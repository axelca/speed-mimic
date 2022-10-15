import { FC, useEffect, useRef, useState } from "react";
import DrawImageControlMenu from "./DrawImageControlMenu";
import "./draw-image-control.css";

interface Props {
  drawingSubmitted?: (arrayBuffer: ArrayBufferLike | null) => void;
  height?: number;
  width?: number;
}

const DrawImageControl: FC<Props> = ({
  drawingSubmitted,
  height = 300,
  width = 700,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(0.1);
  const canvasStyle = { height: `${height}px`, width: `${width}px` };

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");

    if (!canvasCtx) {
      return;
    }

    canvasCtx.lineCap = "round";
    canvasCtx.lineJoin = "round";
    canvasCtx.globalAlpha = lineOpacity;
    canvasCtx.strokeStyle = lineColor;
    canvasCtx.lineWidth = lineWidth;
  }, [lineColor, lineOpacity, lineWidth]);

  const baseDrawCmdFn = (
    drawCmdFn: (canvasCtx: CanvasRenderingContext2D) => void
  ) => {
    const canvasCtx = canvasRef.current?.getContext("2d");

    if (!canvasCtx) {
      return;
    }

    drawCmdFn(canvasCtx);
  };

  const startDrawing = (e: React.MouseEvent<HTMLElement>) => {
    baseDrawCmdFn((canvasCtx: CanvasRenderingContext2D) => {
      canvasCtx.beginPath();
      canvasCtx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    });
  };

  const endDrawing = (e: React.MouseEvent<HTMLElement>) => {
    baseDrawCmdFn((canvasCtx: CanvasRenderingContext2D) => {
      canvasCtx.closePath();
      setIsDrawing(false);
    });
  };

  const draw = (e: React.MouseEvent<HTMLElement>) => {
    baseDrawCmdFn((canvasCtx: CanvasRenderingContext2D) => {
      if (!isDrawing) {
        return;
      }

      canvasCtx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      canvasCtx.stroke();
    });
  };

  const submitDrawing = (e: React.MouseEvent<HTMLElement>) => {
    baseDrawCmdFn((canvasCtx: CanvasRenderingContext2D) => {
      let buffer: ArrayBufferLike | null = null;

      if (!drawingSubmitted) {
        return;
      }

      buffer = canvasCtx.getImageData(0, 0, width, height).data.buffer;

      drawingSubmitted(buffer);
    });
  };

  return (
    <div className="draw-image-control">
      <DrawImageControlMenu
        setLineColor={setLineColor}
        setLineOpacity={setLineOpacity}
        setLineWidth={setLineWidth}
      />
      <canvas
        ref={canvasRef}
        className="draw-image-control__canvas"
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        style={canvasStyle}
        width={width}
      />
      <div className="draw-image-control__btn-panel">
        <button onClick={submitDrawing} type="button">
          Send
        </button>
        <button type="button">Clear</button>
      </div>
    </div>
  );
};

export default DrawImageControl;
