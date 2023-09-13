import React from 'react'

type Props = {
  paths: string[],
  command: string,
  histories: string[],
  onChangeCommand: (text:string) => void
  onEnter: () => void
}

export default function Presenter({
  paths, command, histories, onChangeCommand, onEnter
}:Props) {
  return (
    <div style={styles.container}>
      {histories.map((_command, index) => {
        const _path = paths[index]
        return <div style={styles.historyContainer}>{`${_path} > ${_command}`}</div>
      })}
      <div style={styles.inputContainer}>
        <div>{`${paths[paths.length - 1]} > `}</div>
        <input 
          style={styles.input}
          value={command} 
          onChange={(e) => onChangeCommand(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' ? onEnter() : null}/>
      </div>
    </div>
  )
}

const styles:{[key:string]:React.CSSProperties} = {
  container: {
    flex: 1,
    height: '90vh',
    border: 'black 1px solid',
    padding: '4px',
  },
  historyContainer: {
    paddingBottom: '8px',
  },
  inputContainer: {
    width: '100%',
    display: 'flex',
    paddingTop: '8px',
  },
  input: {
    flex: 1,
    marginLeft: '8px',
    border: '0px solid black',
    outline: 'none'
  },
}