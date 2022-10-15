import Draw from "./Draw";
import Login from "./Login";
import Messages from "./Messages";
import Status from "./Status";
import TestImageTransfer from "./TestImageTransfer";
import Restart from "./Restart";
import GameState from "./GameState";

function App() {
  return (
    <>
      <Status />
      <Messages />
      <Login />
      <Draw />
      <TestImageTransfer />
      <Restart />
      <GameState />
    </>
  );
}

export default App;
