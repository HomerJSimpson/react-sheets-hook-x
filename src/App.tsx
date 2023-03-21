import React from "react";

import "./App.css";
import DebugView from "./DebugView";
import useSheet from "./use-sheet";

function App() {
  const state = useSheet({
    apiKey: "AIzaSyCx8sSfnPFF1iEi4CSM_mrTQA5c5n-ErtM",
    clientId:
      "247918953740-4g7h4gb1mip4j5d50cqvp28b04qr6ic3.apps.googleusercontent.com",
  });
  return (
    <div className="App">
      <DebugView state={state} />
    </div>
  );
}

export default App;
