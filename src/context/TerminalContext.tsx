import React, { createContext, useContext, useState } from 'react'
import { DirectoryEntry, TerminalContextProps } from '../types';
import { SystemContext } from './SystemContext';

export const TerminalContext = createContext<TerminalContextProps>({
    paths:[], 
    histories: [], 
    currentDirectory: {inode_id:-1, file_name:'null'},
    addHistory: (path, command) => {},
    cd: (dirName) => {},
    initTerminal: () => {},
});

const ROOT = 'root'
const ROOT_INODE_ID = 2
const initPaths:string[] = [ROOT]
const initHistories:string[] = []
const initCurrentDirectory:DirectoryEntry = { inode_id: ROOT_INODE_ID, file_name: ROOT }

export default function TerminalContextWrapper({children}:{children:any}) {
    const [paths, setPaths] = useState<string[]>(initPaths)
    const [histories, setHistories] = useState<string[]>(initHistories)
    const [currentDirectory, setCurrentDirectory] = useState<DirectoryEntry>(initCurrentDirectory)
    const {findChildrenEntry} = useContext(SystemContext)

    const addHistory = (path:string, command: string) => {
        setPaths((prev) => [...prev, path])
        setHistories((prev) => [...prev, command])
    }

    const cd = (dirName: string) => {
        const currentPath = paths[paths.length - 1]
        const childrenEntry = findChildrenEntry(currentDirectory.inode_id)
        if(!childrenEntry) return false
        const childEntry = childrenEntry.find(_entry => _entry.file_name === dirName)
        if(!childEntry) return false
        //go logic
        const newPath = `${currentPath}/${dirName}`
        setPaths(prev => [...prev, newPath])
        setCurrentDirectory(childEntry)
    }

    const initTerminal = () => {
        setPaths(initPaths)
        setHistories(initHistories)
        setCurrentDirectory(initCurrentDirectory)
    }
    const values:TerminalContextProps = {
        paths,
        histories,
        currentDirectory,
        addHistory,
        cd,
        initTerminal,
    }

  return (
    <TerminalContext.Provider value={values}>
        {children}
    </TerminalContext.Provider>
  )
}
