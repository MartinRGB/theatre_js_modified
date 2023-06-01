import styled from 'styled-components'

const DetailPanelButton = styled.button<{disabled?: boolean}>`
  text-align: center;
  padding: 8px;
  border-radius: 2px;
  // border: 1px solid #627b7b87;
  // background-color: #4b787d3d;
  // color: #eaeaea;
  border: 1px solid transparent;
  background-color: #40aeff;
  color: #ffffff;
  border-radius:8px;

  font-weight: 400;
  display: block;
  appearance: none;
  flex-grow: 1;
  cursor: ${(props) => (props.disabled ? 'none' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};

  &:hover {
    background-color: #007be5;
    border-color: #007be5;
  }
`

export default DetailPanelButton
