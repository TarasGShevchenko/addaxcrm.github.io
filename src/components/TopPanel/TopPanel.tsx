import React from 'react'
import styled from 'styled-components'

const TopPanelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff61de;
  width: 100%;
  height: 50px;
`

export const TopPanel = () => {
  return <TopPanelContainer>Calendar</TopPanelContainer>
}
