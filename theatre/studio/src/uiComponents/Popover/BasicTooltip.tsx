import styled from 'styled-components'
import BasicPopover from './BasicPopover'

const BasicTooltip = styled(BasicPopover)`
  padding: 1em;
  max-width: 240px;
  pointer-events: none !important;
  --popover-outer-stroke: transparent;
  // --popover-inner-stroke: #bebebe2b;
  --popover-inner-stroke: #4b4b4b;
  // --popover-inner-stroke: #45464d;
`

export default BasicTooltip
