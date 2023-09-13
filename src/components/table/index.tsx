import React, { useContext } from 'react'
import Presenter from './Presenter'
import { SystemContext } from '../../context/SystemContext'
import { TerminalContext } from '../../context/TerminalContext'

export default function TableContainer() {
    const {inodes, dataBlocks} = useContext(SystemContext)
    const {currentDirectory} = useContext(TerminalContext)
    
  return (
    <Presenter inodes={inodes} dataBlocks={dataBlocks} currentDirectory={currentDirectory}/>
  )
}
