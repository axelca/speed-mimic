import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import "./display-image-control.css";

interface Props {
  height?: number;
  imageDataUrl?: string | null;
  width?: number;
}

export interface DisplayImageRefs {
  redrawImage: (dataUrl: string) => void;
}

const DisplayImageControl = forwardRef<DisplayImageRefs, Props>(
  ({ height = 300, imageDataUrl = null, width = 700 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasStyle = { height: `${height}px`, width: `${width}px` };
    const setCanvas = (dataUrl: string | null) => {
      const canvas = canvasRef.current;
      const canvasCtx = canvas?.getContext("2d");
      let image: HTMLImageElement | null = null;

      if (!canvasCtx || !dataUrl) {
        return;
      }

      image = new Image();
      image.onload = () => {
        if (!image) {
          return;
        }

        canvasCtx.drawImage(image, 0, 0);
      };

      image.src = dataUrl;

      canvasCtx.drawImage(image, 0, 0);
    };

    useImperativeHandle(ref, () => ({
      redrawImage(dataUrl: string) {
        setCanvas(dataUrl);
      },
    }));

    useEffect(() => {
      setCanvas(imageDataUrl);
    }, [imageDataUrl]);

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
