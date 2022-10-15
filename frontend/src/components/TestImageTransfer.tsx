import { createRef, FC } from "react";
import DrawImageControl from "./draw-image-control/DrawImageControl";
import DisplayImageControl, {
  DisplayImageRefs,
} from "./display-image-control/DisplayImageControl";

const TestImageTransfer: FC = () => {
  const imageWidth = 700;
  const imageHeight = 300;

  const ref = createRef<DisplayImageRefs>();

  const drawingSubmitted = (buffer: ArrayBufferLike | null) => {
    console.log('test');
    ref.current?.redrawImage(buffer);
  };

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
