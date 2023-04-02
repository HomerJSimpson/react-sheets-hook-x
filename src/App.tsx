import './App.css';

import React from 'react';

import DebugView from './DebugView';
import useSheet from './use-sheet';

function App() {
  const { status, login, data } = useSheet({
    apiKey: "AIzaSyCx8sSfnPFF1iEi4CSM_mrTQA5c5n-ErtM",
    clientId:
      "247918953740-4g7h4gb1mip4j5d50cqvp28b04qr6ic3.apps.googleusercontent.com",
  });
  return (
    <div className="App">
      <DebugView state={status} data={data} onLoginClick={login} />
    </div>
  );
}

export default App;
