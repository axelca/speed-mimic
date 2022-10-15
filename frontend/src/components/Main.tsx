import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GamePlan from "./GamePlan";
import Chat from "./Chat";
import Lobby from "./Lobby";
import { useWebSocketContext } from "../contexts/WebSocketContext";
import { GameStateEnum } from "../types/gameState";

function Main() {
  const { gameState } = useWebSocketContext();
  return (
    <Container style={{ display: "flex", flex: 1 }}>
      <Row>
        <Col md="8" sm="12">
          {gameState === GameStateEnum.Paused ? (
            <div>Game will begin shortly</div>
          ) : (
            <GamePlan />
          )}
        </Col>
        <Col md="2" sm="6">
          <Lobby />
        </Col>
        <Col md="2" sm="6">
          <Chat />
        </Col>
      </Row>
    </Container>
  );
}
export default Main;
