import { FC } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const Chat: FC = () => (
  <>
    <div>Chat</div>
    <Container id="ChatContent">
      <Row>
        <Col md="3">Kalle1</Col>
        <Col md="9">Hej alla!</Col>
      </Row>
    </Container>
    <Form>
      <Container id="ChatControl">
        <Row>
          <Col md="10">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control placeholder="Write text here" type="text" />
            </Form.Group>
          </Col>
          <Col md="2">
            <Button type="submit" variant="primary">
              Send
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  </>
);

export default Chat;
