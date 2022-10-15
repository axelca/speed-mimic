import Login from "./Login";
import Messages from "./Messages";
import Status from "./Status";
import Restart from "./Restart";
import GameState from "./GameState";
import Main from "./Main";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <Status />
      <Messages />
      <Login />
      <Restart />
      <GameState />
      <Main />
    </>
  );
}

export default App;
