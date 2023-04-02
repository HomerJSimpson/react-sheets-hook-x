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
  login?: any;
};

enum ActionTypes {
  INITING = "initializing",
  JSLOADING_RESULT = "js loading result",
  FAILURE = "failure",
  READY = "ready to go",
  LOGGEDIN = "logged in",
}

type Action =
  | { type: ActionTypes.INITING; status: string }
  | { type: ActionTypes.READY }
  | { type: ActionTypes.LOGGEDIN; results: string; status: string }
  | { type: ActionTypes.JSLOADING_RESULT; results: string; status: string }
  | { type: ActionTypes.FAILURE; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.READY:
      return { status: "ready to go", login: state.login };
    case ActionTypes.JSLOADING_RESULT:
      return {
        status: action.status,
        data: action.results,
        login: state.login,
      };
    case ActionTypes.INITING:
      return {
        status: action.type,
        data: undefined,
        error: undefined,
        login: state.login,
      };
    case ActionTypes.LOGGEDIN:
      return {
        status: ActionTypes.LOGGEDIN,
        data: action.results,
        error: undefined,
        login: state.login,
      };
    default:
      throw new Error("invalid action");
  }
}

export default function useSheet(args: ISheetHookArgs) {
  // hooks begin
  const [state, dispatch] = React.useReducer(reducer, {
    status: ActionTypes.INITING,
    data: undefined,
    error: undefined,
    login: undefined,
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
    console.log("gapi:", gapiLoadingStatus);
    if (gapiLoadingStatus.toLowerCase() === "ready") {
      const { gapi } = window;
      gapi.load("client", async () => {
        await gapi.client.init({
          apiKey: args.apiKey,
          discoveryDocs: [...(args.discoveryDocs ?? [])],
        });

        dispatch({
          type: ActionTypes.JSLOADING_RESULT,
          status: "gapiJS",
          results: gapiLoadingStatus,
        });
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

  function login() {
    const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

    const { google, gapi } = window;
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: args.clientId,
      scope: SCOPES,
      callback: (resp: any) => {
        console.log(resp);
        dispatch({
          type: ActionTypes.LOGGEDIN,
          results: resp.access_token,
          status: "logged in",
        });
      },
    });
    if (gapi && gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    }
  }

  return { ...state, login };
}
