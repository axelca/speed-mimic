import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GamePlan from "./GamePlan";
import Chat from "./Chat";
import Lobby from "./Lobby";

function Main() {
  return (
    <Container>
      <Row>
        <Col md="6">
          <GamePlan />
        </Col>
        <Col md="3">
          <Lobby />
        </Col>
        <Col md="3" xs>
          <Chat />
        </Col>
      </Row>
    </Container>
  );
}
export default Main;
