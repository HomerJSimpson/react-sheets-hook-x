import React from "react";

import useScript from "./use-script";

const gapiJsURL = "https://apis.google.com/js/api.js";
const gisClientUrl = "https://accounts.google.com/gsi/client";

export interface ISheetHookArgs {
  apiKey: string;
  clientId: string;
  scopes?: string;
  discoveryDocs?: string[];
}

type State = {
  data?: any;
  error?: any;
  status: string;
};

enum ActionTypes {
  INITING = "initializing",
  JSLOADING_RESULT = "js loading result",
  FAILURE = "failure",
  READY = "ready to go",
}

type Action =
  | { type: ActionTypes.INITING; status: string }
  | { type: ActionTypes.READY }
  | { type: ActionTypes.JSLOADING_RESULT; results: string; status: string }
  | { type: ActionTypes.FAILURE; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.READY:
      return { status: "ready to go" };
    case ActionTypes.JSLOADING_RESULT:
      return { status: action.status, data: action.results };
    case ActionTypes.INITING:
      return {
        status: action.type,
        data: undefined,
        error: undefined,
      };
    default:
      throw new Error("invalid action");
  }
}

export default function useSheet(args: ISheetHookArgs) {
  const [state, dispatch] = React.useReducer(reducer, {
    status: ActionTypes.INITING,
    data: undefined,
    error: undefined,
  });
  let gisLoadingStatus = useScript(gisClientUrl);
  let gapiLoadingStatus = useScript(gapiJsURL);

  React.useEffect(() => {
    console.log("both");
    if (
      gisLoadingStatus.toLowerCase() === "ready" &&
      gapiLoadingStatus.toLowerCase() === "ready"
    ) {
      dispatch({ type: ActionTypes.READY });
    }
    return () => {};
  }, [gisLoadingStatus, gapiLoadingStatus]);

  React.useEffect(() => {
    console.log("gapi");
    if (gapiLoadingStatus.toLowerCase() === "ready") {
      dispatch({
        type: ActionTypes.JSLOADING_RESULT,
        status: "gapiJS",
        results: gapiLoadingStatus,
      });
    }

    return () => {};
  }, [gapiLoadingStatus]);

  React.useEffect(() => {
    console.log("gis");
    if (gisLoadingStatus.toLowerCase() === "ready") {
      dispatch({
        type: ActionTypes.JSLOADING_RESULT,
        status: "gisJS",
        results: gisLoadingStatus,
      });
    }
    return () => {};
  }, [gisLoadingStatus]);

  return state;
}
