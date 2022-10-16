import Login from "./Login";
import Messages from "./Messages";
import Status from "./Status";
import Restart from "./Restart";
import Main from "./Main";
import "bootstrap/dist/css/bootstrap.min.css";
import { useWebSocketContext } from "../contexts/WebSocketContext";

const Container = ({ children }: { children: JSX.Element | JSX.Element[] }) => (
  <div
    style={{
      height: "100%",
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      paddingTop: "2em",
    }}
  >
    {children}
    <Status />
    <Messages />
  </div>
);

const App = () => {
  const { username } = useWebSocketContext();

  // För att testa överföring av ritad data mellan clienter
  // return <TestImageTransfer />;

  if (!username) {
    return (
      <Container>
        <Login />
      </Container>
    );
  }

  return (
    <Container>
      <Main />
      <Restart />
    </Container>
  );
};

export default App;
