export const definedGlobals = {
  'process.env.THEATRE_VERSION': JSON.stringify(
    require('../studio/package.json').version,
  ),
  // json-touch-patch (an unmaintained package) reads this value. We patch it to just 'Set', becauce
  // this is only used in `@theatre/studio`, which only supports evergreen browsers
  'global.Set': 'Set',
}
