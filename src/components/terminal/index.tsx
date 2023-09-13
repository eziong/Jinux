import React, { useContext, useState } from 'react'
import TerminalPresenter from './Presenter'
import { TerminalContext } from '../../context/TerminalContext'
import { SystemContext } from '../../context/SystemContext'

export default function TerminalContainer() {
    const {paths, histories, addHistory, cd} = useContext(TerminalContext)
    const {doCommand} = useContext(SystemContext)
    const [command, setCommand] = useState<string>('')

    const onChangeCommand = (text:string) => {
        setCommand(text)
    }

    const onEnter = () => {
        addHistory(paths[paths.length - 1], command)
        const args = command.split(/\s+/g)
        switch(args[0]){
            case 'cd':{
                args[1] && cd(args[1])
                break;
            }
            default: {
                doCommand(paths[paths.length - 1], args)
                break;
            }
        }
        setCommand("")
    }
    
  return (
    <TerminalPresenter 
        paths={paths} 
        command={command} 
        histories={histories} 
        onChangeCommand={onChangeCommand}
        onEnter={onEnter}
    />
  )
}
