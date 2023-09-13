import React from 'react';
import TerminalContainer from './components/terminal';
import TableContainer from './components/table';
import TerminalContextWrapper from './context/TerminalContext';
import SystemContextWrapper from './context/SystemContext';

function App() {
  return (
    <div style={{display:'flex', width: '100%'}}>
      <SystemContextWrapper>
        <TerminalContextWrapper>
          <TerminalContainer />
          <div style={{width:'22px'}} />
          <TableContainer />
        </TerminalContextWrapper>
      </SystemContextWrapper>
    </div>
  );
}

export default App;
