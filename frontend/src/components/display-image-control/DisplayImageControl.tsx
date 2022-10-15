import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import "./display-image-control.css";

interface Props {
  height?: number;
  imageDataBuffer?: ArrayBufferLike | null;
  width?: number;
}

export interface DisplayImageRefs {
  redrawImage: (buffer: ArrayBufferLike | null) => void;
}

const DisplayImageControl = forwardRef<DisplayImageRefs, Props>(
  ({ height = 300, imageDataBuffer = null, width = 700 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasStyle = { height: `${height}px`, width: `${width}px` };
    const setCanvas = (buffer: ArrayBufferLike | null) => {
      const canvas = canvasRef.current;
      const canvasCtx = canvas?.getContext("2d");

      if (!canvasCtx || !buffer) {
        return;
      }

      canvasCtx.putImageData(
        new ImageData(
          new Uint8ClampedArray(buffer),
          canvasCtx.canvas.width,
          canvasCtx.canvas.height
        ),
        0,
        0
      );
    };

    useImperativeHandle(ref, () => ({
      redrawImage(buffer: ArrayBufferLike | null) {
        setCanvas(buffer);
      },
    }));

    useEffect(() => {
      setCanvas(imageDataBuffer);
    }, [imageDataBuffer]);

    return (
      <div className="display-image-control">
        <canvas
          ref={canvasRef}
          className="display-image-control__canvas"
          height={height}
          style={canvasStyle}
          width={width}
        />
      </div>
    );
  }
);

export default DisplayImageControl;
