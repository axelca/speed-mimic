import { FC } from "react";
import { v4 } from "uuid";
import "./draw-image-control-menu.css";

interface Props {
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
  setLineOpacity: React.Dispatch<React.SetStateAction<number>>;
  setLineWidth: React.Dispatch<React.SetStateAction<number>>;
}

const DrawImageControlMenu: FC<Props> = ({
  setLineColor,
  setLineOpacity,
  setLineWidth,
}) => {
  const drawImageControlMenuId = v4();
  const drawImageControlMenuColorId = `color-${drawImageControlMenuId}`;
  const drawImageControlMenuWidthId = `width-${drawImageControlMenuId}`;
  const drawImageControlMenuOpacityId = `opacity-${drawImageControlMenuId}`;

  return (
    <ul className="draw-image-control-menu">
      <li className="draw-image-control-menu__item">
        <label htmlFor={drawImageControlMenuColorId}>Brush Color:</label>
        <input
          id={drawImageControlMenuColorId}
          onChange={(e) => {
            setLineColor(e.target.value);
          }}
          type="color"
        />
      </li>
      <li className="draw-image-control-menu__item">
        <label htmlFor={drawImageControlMenuWidthId}>Brush Width:</label>
        <input
          id={drawImageControlMenuWidthId}
          max="20"
          min="3"
          onChange={(e) => {
            setLineWidth(+e.target.value);
          }}
          type="range"
        />
      </li>
      <li className="draw-image-control-menu__item">
        <label htmlFor={drawImageControlMenuOpacityId}>Brush Opacity:</label>
        <input
          id={drawImageControlMenuOpacityId}
          max="100"
          min="1"
          onChange={(e) => {
            setLineOpacity(+e.target.value / 100);
          }}
          type="range"
        />
      </li>
    </ul>
  );
};

export default DrawImageControlMenu;
