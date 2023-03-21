import React from "react";

import "./DebugView.css";

export interface IDebugProps {
  googleApiSrcState?: boolean;
  state?: any;
}

function DebugView({ state }: IDebugProps) {
  return (
    <div className="Debug">
      <header>
        <h4>Debug</h4>
      </header>
      <hr />
      <section>Google API loading state: {JSON.stringify(state)}</section>
    </div>
  );
}

export default DebugView;
