declare module "react-range-slider-input";
declare module "react-image-zoom" {
  import { ComponentType } from "react";

  interface ReactImageZoomProps {
    width: number;
    height?: number;
    zoomWidth?: number;
    img?: string;
    scale?: number;
    offset?: {
      vertical: number;
      horizontal: number;
    };
    zoomStyle?: string;
    zoomLensStyle?: string;
    zoomPosition?: "top" | "left" | "bottom" | "right" | "original";
  }

  const ReactImageZoom: ComponentType<ReactImageZoomProps>;

  export default ReactImageZoom;
}
