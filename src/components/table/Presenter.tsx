import React from 'react'
import { DataBlock, DirectoryEntry, FileType, Inode } from '../../types'

type Props = {
    inodes: Inode[],
    dataBlocks: DataBlock[],
    currentDirectory: DirectoryEntry,
}

export default function Presenter({inodes, dataBlocks, currentDirectory}:Props) {
    console.log({inodes, dataBlocks})
  return (
    <div style={styles.container}>
        {/* inodes table */}
        <h2>Inode</h2>
        <table>
            <thead>
                <tr>
                    <td style={styles.td}>ID</td>
                    {
                        Array(20).fill(null).map((_, index) => {
                            if (index === currentDirectory.inode_id) return <td key={index} style={styles.td_selected2}>{index}</td>
                            if (index < inodes.length) return <td key={index} style={styles.td_selected}>{index}</td>
                            return <td key={index} style={styles.td}>{index}</td>
                        })
                    }
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={styles.td}>Block</td>
                    {
                        inodes.map(_inode => {
                            return <td key={_inode.id} style={styles.td}>{_inode.blocks}</td>
                        })
                    }
                </tr>
                <tr>
                    <td style={styles.td}>Block size</td>
                    {
                        inodes.map(_inode => {
                            return <td key={_inode.id} style={styles.td}>{_inode.block_size}</td>
                        })
                    }
                </tr>
                <tr>
                    <td style={styles.td}>File name</td>
                    {
                        inodes.map(_inode => {
                            if(_inode.file_type === FileType.DIRECTORY && currentDirectory.inode_id === _inode.id){
                                return <td key={_inode.id} style={styles.td_selected2}>{currentDirectory.file_name}</td>
                            }
                            if(_inode.file_type === FileType.DIRECTORY){
                                const _dataBlocks = dataBlocks
                                    .map(_dataBlock => _dataBlock.directory_entry
                                            .find(_directory_entry => _directory_entry.inode_id === _inode.id)
                                        )
                                    .filter(_ => _)
                                if(_dataBlocks.length > 0){
                                    return <td key={_inode.id} style={styles.td_selected}>{_dataBlocks[0]?.file_name}</td>
                                }
                            }
                            return <td key={_inode.id} style={styles.td}>{'-'}</td>
                        })
                    }
                </tr>
            </tbody>
        </table>
        {/* datablocks table */}
    </div>
  )
}

const styles:{[key:string]:React.CSSProperties} = {
    container: {
      flex: 1,
      height: '90vh',
      border: 'black 1px solid'
    },
    td: {
        padding: '2px',
        border: '1px black solid',
    },
    td_selected: {
        padding: '2px',
        border: '1px black solid',
        backgroundColor: 'yellowgreen',
    },
    td_selected2: {
        padding: '2px',
        border: '1px black solid',
        backgroundColor: 'green',
    }
  }