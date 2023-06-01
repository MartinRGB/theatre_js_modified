import React, {useCallback} from 'react'
import styled from 'styled-components'
import {CgSelect} from 'react-icons/all'

const Container = styled.div`
  width: 100%;
  position: relative;
`

const IconContainer = styled.div`
  position: absolute;
  right: 0px;
  top: 0;
  bottom: 0;
  width: 1.5em;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: #6b7280;
  pointer-events: none;
`

const Select = styled.select`
  appearance: none;
  background-color: transparent;
  box-sizing: border-box;
  border: 1px solid transparent;
  color: rgba(255, 255, 255, 0.9);
  cursor:pointer;
  padding: 1px 6px;
  font: inherit;
  outline: none;
  text-align: left;
  width: 100%;
  /*
  looks like putting percentages in the height of a select box doesn't work in Firefox. Not sure why.
  So we're hard-coding the height to 26px, unlike all other inputs that use a relative height.
  */
  height: 26px /* calc(100% - 4px); */;

  @supports (-moz-appearance: none) {
    /* Ugly hack to remove the extra left padding that shows up only in Firefox */
    text-indent: -2px;
  }

  &:hover{
    border-color: #4b4b4b;
  }
  &:focus {
    border-color:#40aeff;
  }
`

const Option = styled.option`
  border: none;
  border-radius:0px;
  min-width: 100%;
  background-color: #1e1e1e;
  box-shadow: 0 5px 17px rgba(0, 0, 0, 0.2),
  0 2px 7px rgba(0, 0, 0, 0.15), inset 0 0 0 0.5px #000000,
  0 0 0 0.5px rgba(0, 0, 0, 0.1);
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  overflow-y: auto;
  font-family:'Inter', 'Helvetica', sans-serif;
`

function BasicNumberSelect<TLiteralOptions extends number>({
  value,
  onChange,
  options,
  className,
  autoFocus,
}: {
  value: TLiteralOptions
  onChange: (val: TLiteralOptions) => void
  options: Record<TLiteralOptions, number>
  className?: string
  autoFocus?: boolean
}) {
  const _onChange = useCallback(
    (el: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(Number(el.target.value) as TLiteralOptions)
    },
    [onChange],
  )

  return (
    <Container>
      <Select
        className={className}
        value={value}
        onChange={_onChange}
        autoFocus={autoFocus}
      >
        {Object.keys(options).map((key, i) => (
          <Option key={'option-' + i} value={key}>
            {options[key]}
          </Option>
        ))}
      </Select>
      <IconContainer>
        <CgSelect />
      </IconContainer>
    </Container>
  )
}

export default BasicNumberSelect
