import "./DebugView.css";

import React from "react";

import UserIdentityCard from "./UserIdentityCard";

export interface IDebugProps {
  googleApiSrcState?: boolean;
  state?: any;
  onLoginClick?: any;
  data?: any;
}

function DebugView({ state, onLoginClick = () => false, data }: IDebugProps) {
  return (
    <div className="Debug">
      <header>
        <h4>Debug</h4>
      </header>
      <hr />
      <section>Google API loading state: {JSON.stringify(state)}</section>
      {state !== "logged in" && (
        <section>
          <button type="button" onClick={onLoginClick}>
            login to application
          </button>
        </section>
      )}
      {state === "logged in" && <UserIdentityCard access_token={data} />}
    </div>
  );
}

export default DebugView;
