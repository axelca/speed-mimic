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
        <Col md="8">
          <GamePlan />
        </Col>
        <Col md="2">
          <Lobby />
        </Col>
        <Col md="2">
          <Chat />
        </Col>
      </Row>
    </Container>
  );
}
export default Main;
