import { createRef, FC, useEffect } from "react";
import { JsonObject } from "react-use-websocket/dist/lib/types";
import { useWebSocketContext } from "../contexts/WebSocketContext";
import { Message, MessageTypeEnum } from "../types/messages";
import DisplayImageControl, {
  DisplayImageRefs,
} from "./display-image-control/DisplayImageControl";
import DrawImageControl from "./draw-image-control/DrawImageControl";

const TestImageTransfer: FC = () => {
  const { lastMessage, sendJsonMessage } = useWebSocketContext();
  const imageWidth = 700;
  const imageHeight = 300;

  const ref = createRef<DisplayImageRefs>();

  const drawingSubmitted = (dataUrl: string) => {
    const drawMessage: Message = {
      type: MessageTypeEnum.DrawLeader,
      data: dataUrl,
    };
    sendJsonMessage(drawMessage as unknown as JsonObject);
  };

  useEffect(() => {
    let drawMessage: Message | null = null;

    if (!lastMessage?.data) {
      return;
    }

    try {
      drawMessage = JSON.parse(lastMessage?.data);
    } catch (error) {
      console.error(error);
    }

    if (!drawMessage?.data) {
      return;
    }
    
    ref.current?.redrawImage(drawMessage.data);
  }, [lastMessage]);

  return (
    <div>
      <DrawImageControl
        drawingSubmitted={drawingSubmitted}
        height={imageHeight}
        width={imageWidth}
      />
      <DisplayImageControl ref={ref} height={imageHeight} width={imageWidth} />
    </div>
  );
};

export default TestImageTransfer;
