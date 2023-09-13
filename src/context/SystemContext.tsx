import React, { createContext, useEffect, useState } from 'react'
import { DataBlock, DirectoryEntry, FileType, Inode, SystemContextProps } from '../types'

export const SystemContext = createContext<SystemContextProps>({
    inodes: [],
    dataBlocks: [],
    doCommand: (path, args) => {},
    initSystemSettings: () => {},
    mkdir: () => {},
    touch: () => {},
    findChildrenEntry: (inode_id:number) => null,
})

export default function SystemContextWrapper({children}:{children:any}) {
    const [inodes, setInodes] = useState<Inode[]>([])
    const [dataBlocks, setDataBlocks] = useState<DataBlock[]>([])
    
    useEffect(() => {
        initSystemSettings()
    },[])

    const createNewInode = (file_type:FileType) => {
        const block_size = file_type === FileType.DIRECTORY ? 1 : 4
        const blocks = Array(block_size).fill(null).map((_, index) => inodes.length + index + 20)
        
        const _inode:Inode = {
            id: inodes.length,
            file_type,
            block_size,
            blocks,
        }
        return _inode
    }

    const initSystemSettings = () => {
        const _inodes = Array(10).fill(null).map((_, index) => {
            const _inode:Inode = {
                id: index,
                file_type: FileType.DIRECTORY,
                block_size: 1,
                blocks: [20 + index]
            }
            return _inode
        })
        const _dataBlocks = _inodes.map((_inode, index) => {
            const _dataBlock:DataBlock = {
                block_position: index + 20,
                directory_entry: []
            }
            return _dataBlock
        })
        setInodes(_inodes)
        setDataBlocks(_dataBlocks)
    }

    const findCurrentInode = (path: string) => {
        const locations = path.split('/')
        let currentInodeId = 2
        const getInodeId = (location: string) => {
            const inode = inodes.find(_inode => _inode.id === currentInodeId)
            if(!inode?.blocks) return
            inode.blocks.forEach(_blockPosition => {
                const dataBlock = dataBlocks.find(_dataBlock => _dataBlock.block_position === _blockPosition)
                const directory_entry = dataBlock?.directory_entry.find(_directory_entry => _directory_entry.file_name === location)
                if(!directory_entry) return
                currentInodeId = directory_entry.inode_id
            })

        }
        locations.forEach(_location => {
            getInodeId(_location)
        })
        return currentInodeId
    }

    const findChildrenEntry = (inode_id:number) => {
        const inode = inodes.find(_inode => _inode.id === inode_id)
        if(!inode) return null
        let ret:DirectoryEntry[] = []
        inode.blocks.forEach(_blockPosition => {
            const dataBlock = dataBlocks.find(_dataBlock => _dataBlock.block_position === _blockPosition)
            const directory_entry = dataBlock?.directory_entry
            if(directory_entry) ret = [...ret, ...directory_entry]
        })
        return ret
    }

    const doCommand = (path: string, args: string[]) => {
        switch(args[0]){
            case 'mkdir':{
                const dirName = args[1].replace(/\/\./g,'')
                const parentInode = inodes[findCurrentInode(path)]
                mkdir(parentInode.id, dirName)
                break
            }
            case 'touch':{
                const dirName = args[1].replace(/\/\./g,'')
                const parentInode = inodes[findCurrentInode(path)]
                touch(parentInode.id, dirName)
                break
            }
            default: {
                break
            }
        }
    }

    const mkdir = (parentInodeId:number, fileName: string) => {
        const parentInode = inodes.find((_inode, index) => _inode.id === parentInodeId)
        if(!parentInode) return false
        const _inode = createNewInode(FileType.DIRECTORY)
        setInodes((prev => [...prev, _inode]))
        setDataBlocks(prev => {
            const _dataBlocks = prev.map((_dataBlock, index) => {
                const tmp = {..._dataBlock}
                if(!parentInode.blocks.find(_block => _block === tmp.block_position)) return tmp
                const _directoryEntry:DirectoryEntry = {
                    inode_id: _inode.id,
                    file_name: fileName,
                }
                tmp.directory_entry = [...tmp.directory_entry, _directoryEntry]
                return tmp
            })
            const newDataBlock:DataBlock = {
                block_position: 20 + prev.length,
                directory_entry: []
            }
            return [..._dataBlocks, newDataBlock]
        })

        return true
    }

    const touch = (parentInodeId:number, fileName: string) => {
        const parentInode = inodes.find((_inode, index) => _inode.id === parentInodeId)
        if(!parentInode) return false

        const _inode = createNewInode(FileType.NORMAL)
        setInodes((prev => [...prev, _inode]))
        setDataBlocks(prev => {
            return prev.map((_dataBlock, index) => {
                const tmp = {..._dataBlock}
                if(!parentInode.blocks.find(_block => _block === tmp.block_position)) return tmp
                const _directoryEntry:DirectoryEntry = {
                    inode_id: _inode.id,
                    file_name: fileName,
                }
                tmp.directory_entry = [...tmp.directory_entry, _directoryEntry]
                return tmp
            })
        })

        return true
    }

    const values:SystemContextProps = {
        inodes,
        dataBlocks,
        doCommand,
        initSystemSettings,
        mkdir,
        touch,
        findChildrenEntry,
    }

  return (
    <SystemContext.Provider value={values}>
        {children}
    </SystemContext.Provider>
  )
}
