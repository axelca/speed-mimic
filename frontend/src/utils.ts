import { ReadyState } from "react-use-websocket";

export const getConnectionStatus = (readyState: ReadyState): string =>
  ({
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState]);
