import { FC, useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useWebSocketContext } from "../contexts/WebSocketContext";
import { getConnectionStatus } from "../utils";

const Status: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { readyState } = useWebSocketContext();

  useEffect(() => {
    if (readyState) {
      setIsVisible(true);
    }
  }, [readyState]);

  return (
    <ToastContainer position="bottom-end" style={{ padding: "1em" }}>
      <Toast
        autohide
        delay={10000}
        onClose={() => setIsVisible(false)}
        show={isVisible}
      >
        <Toast.Header>
          <strong className="me-auto">Connection status</strong>
        </Toast.Header>
        <Toast.Body>{getConnectionStatus(readyState)}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default Status;
