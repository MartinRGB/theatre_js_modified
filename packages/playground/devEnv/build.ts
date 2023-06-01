import type {BuildOptions} from 'esbuild'
import esbuild from 'esbuild'
import {readdir, readFile, stat, writeFile} from 'fs/promises'
import {mapValues} from 'lodash-es'
import path from 'path'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {ServerStyleSheet} from 'styled-components'
import {definedGlobals} from '../../../theatre/devEnv/definedGlobals'
import {createEsbuildLiveReloadTools} from './createEsbuildLiveReloadTools'
import {createProxyServer} from './createProxyServer'
import {createServerForceClose} from './createServerForceClose'
import {PlaygroundPage} from './home/PlaygroundPage'
import {openForOS} from './openForOS'
import {timer} from './timer'
import {tryMultiplePorts} from './tryMultiplePorts'

const playgroundDir = (folder: string) => path.join(__dirname, '..', folder)
const buildDir = playgroundDir('build')
const srcDir = playgroundDir('src')
const sharedDir = playgroundDir('src/shared')
const personalDir = playgroundDir('src/personal')
const testDir = playgroundDir('src/tests')

export async function start(options: {
  /** enable live reload and watching stuff */
  dev: boolean
  /** make some UI elements predictable by setting the __IS_VISUAL_REGRESSION_TESTING value on window */
  isVisualRegressionTesting: boolean
  serve?: {
    findAvailablePort: boolean
    openBrowser: boolean
    waitBeforeStartingServer?: Promise<void>
    /** defaults to 8080 */
    defaultPort?: number
  }
}): Promise<{stop(): Promise<void>}> {
  const defaultPort = options.serve?.defaultPort ?? 8080

  const liveReload =
    options.serve && options.dev ? createEsbuildLiveReloadTools() : undefined

  type PlaygroundExample = {
    useHtml?: string
    entryFilePath: string
    outDir: string
  }

  type Groups = {
    [group: string]: {
      [module: string]: PlaygroundExample
    }
  }

  // Collect all entry directories per module per group
  const groups: Groups = await Promise.all(
    [sharedDir, personalDir, testDir].map(async (groupDir) =>
      readdir(groupDir)
        .then(async (groupDirItems) => [
          path.basename(groupDir),
          await Promise.all(
            groupDirItems.map(
              async (
                moduleDirName,
              ): Promise<[string, PlaygroundExample | undefined]> => {
                const entryKey = path.basename(moduleDirName)
                const entryFilePath = path.join(
                  groupDir,
                  moduleDirName,
                  'index.tsx',
                )

                if (
                  !(await stat(entryFilePath)
                    .then((s) => s.isFile())
                    .catch(() => false))
                )
                  return [entryKey, undefined]

                return [
                  entryKey,
                  {
                    // Including your own html file for playground is an experimental feature,
                    // it's not quite ready for "prime time" and advertising to the masses until
                    // it properly handles file watching.
                    // It's good for now, since we can use it for some demos, just make sure that
                    // you add a comment to the custom index.html file saying that you have to
                    // restart playground server entirely to see changes.
                    useHtml: await readFile(
                      path.join(groupDir, moduleDirName, 'index.html'),
                      'utf-8',
                    ).catch(() => undefined),
                    entryFilePath,
                    outDir: path.join(
                      buildDir,
                      path.basename(groupDir),
                      moduleDirName,
                    ),
                  },
                ]
              },
            ),
          ).then((entries) =>
            Object.fromEntries(
              entries.filter((entry) => entry[1] !== undefined),
            ),
          ),
        ])
        .catch(() =>
          // If the group dir doesn't exist, we just set its entry to undefined
          [path.basename(groupDir), undefined],
        ),
    ),
  )
    .then((entries) =>
      Object.fromEntries(
        // and then filter it out.
        entries.filter((entry) => entry[1] !== undefined),
      ),
    )
    .catch(wrapCatch('reading group dirs'))

  // Collect all entry files
  const entryPoints = Object.values(groups)
    .flatMap((group) => Object.values(group))
    .map((module) => module.entryFilePath)

  // Collect all output directories
  const outModules = Object.values(groups).flatMap((group) =>
    Object.values(group),
  )

  // Render home page contents
  const homeHtml = (() => {
    const sheet = new ServerStyleSheet()
    try {
      const html = renderToStaticMarkup(
        sheet.collectStyles(
          React.createElement(PlaygroundPage, {
            groups: mapValues(groups, (group) => Object.keys(group)),
          }),
        ),
      )
      const styleTags = sheet.getStyleTags() // or sheet.getStyleElement();
      sheet.seal()
      return {
        head: styleTags,
        html,
      }
    } catch (error) {
      // handle error
      console.error(error)
      sheet.seal()
      process.exit(1)
    }
  })()

  const _initialBuild = timer('esbuild initial playground entry point builds')

  const esbuildConfig: BuildOptions = {
    entryPoints,
    bundle: true,
    sourcemap: true,
    outdir: buildDir,
    target: ['firefox88'],
    loader: {
      '.png': 'file',
      '.glb': 'file',
      '.gltf': 'file',
      '.mp3': 'file',
      '.ogg': 'file',
      '.svg': 'dataurl',
    },
    define: {
      ...definedGlobals,
      'window.__IS_VISUAL_REGRESSION_TESTING': JSON.stringify(
        options.isVisualRegressionTesting,
      ),
    },
    banner: liveReload?.esbuildBanner,
    watch: liveReload?.esbuildWatch && {
      onRebuild(error, result) {
        esbuildWatchStop = result?.stop ?? esbuildWatchStop
        liveReload?.esbuildWatch.onRebuild?.(error, result)
      },
    },
    plugins: [
      {
        name: 'watch playground assets',
        setup(build) {
          build.onStart(() => {})
          build.onLoad(
            {
              filter: /index\.tsx?$/,
            },
            async (loadFile) => {
              const indexHtmlPath = loadFile.path.replace(
                /index\.tsx?$/,
                'index.html',
              )
              const relToSrc = path.relative(srcDir, indexHtmlPath)
              const isInSrcFolder = !relToSrc.startsWith('..')
              if (isInSrcFolder) {
                const newHtml = await readFile(indexHtmlPath, 'utf-8').catch(
                  () => undefined,
                )
                if (newHtml) {
                  await writeFile(
                    path.resolve(buildDir, relToSrc),
                    newHtml.replace(
                      /<\/body>/,
                      `<script src="${path.join(
                        '/',
                        relToSrc,
                        '../index.js',
                      )}"></script></body>`,
                    ),
                  ).catch(
                    wrapCatch(
                      `loading index.tsx creates corresponding index.html for ${relToSrc}`,
                    ),
                  )
                }

                return {
                  watchFiles: [indexHtmlPath],
                }
              }
            },
          )
        },
      },
    ],
  }

  let esbuildWatchStop: undefined | (() => void)

  await esbuild
    .build(esbuildConfig)
    .finally(() => _initialBuild.stop())
    .catch(
      // if in dev mode, permit continuing to watch even if there was an error
      options.dev
        ? () => Promise.resolve()
        : wrapCatch(`failed initial esbuild.build`),
    )
    .then(async (buildResult) => {
      esbuildWatchStop = buildResult?.stop
      // Read index.html template
      const index = await readFile(
        path.join(__dirname, 'index.html'),
        'utf8',
      ).catch(wrapCatch('reading index.html template'))
      await Promise.all([
        // Write home page
        writeFile(
          path.join(buildDir, 'index.html'),
          index
            .replace(/<\/head>/, `${homeHtml.head}<\/head>`)
            .replace(/<body>/, `<body>${homeHtml.html}`),
          'utf-8',
        ).catch(wrapCatch('writing build index.html')),
        // Write module pages
        ...outModules.map((outModule) =>
          writeFile(
            path.join(outModule.outDir, 'index.html'),
            // Insert the script
            (outModule.useHtml ?? index).replace(
              /<\/body>/,
              `<script src="${path.join(
                '/',
                path.relative(buildDir, outModule.outDir),
                'index.js',
              )}"></script></body>`,
            ),
            'utf-8',
          ).catch(
            wrapCatch(
              `writing index.html for ${path.relative(
                buildDir,
                outModule.outDir,
              )}`,
            ),
          ),
        ),
      ])
    })
    .catch((err) => {
      console.error('build.ts: esbuild or html files writing error', err)
      return process.exit(1)
    })

  // Only start dev server in serve, otherwise just run build and that's it
  if (!options.serve) {
    return {
      stop() {
        esbuildWatchStop?.()
        return Promise.resolve()
      },
    }
  }

  const {serve} = options
  await serve.waitBeforeStartingServer

  // We start ESBuild serve with no build config because it doesn't need to build
  // anything, we are already using ESBuild watch.
  /** See https://esbuild.github.io/api/#serve-return-values */
  const esbuildServe = await esbuild.serve({servedir: buildDir}, {})

  const proxyServer = createProxyServer(liveReload?.handleRequest, {
    hostname: '0.0.0.0',
    port: esbuildServe.port,
  })

  const proxyForceExit = createServerForceClose(proxyServer)
  const portTries = serve.findAvailablePort ? 10 : 1
  const portChosen = await tryMultiplePorts(defaultPort, portTries, proxyServer)

  const hostedAt = `http://localhost:${portChosen}`

  console.log('Playground running at', hostedAt)

  if (serve.openBrowser) {
    setTimeout(() => {
      if (!liveReload?.hasOpenConnections()) openForOS(hostedAt)
    }, 1000)
  }

  return {
    stop() {
      esbuildServe.stop()
      esbuildWatchStop?.()
      return Promise.all([proxyForceExit(), esbuildServe.wait]).then(() => {
        // map to void for type defs
      })
    },
  }
}

function wrapCatch(message: string) {
  return (err: any) => {
    return Promise.reject(`Rejected "${message}":\n    ${err.toString()}`)
  }
}
