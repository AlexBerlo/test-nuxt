export interface ImageHotspot {
  id: string;
  mask: string;
  bounds: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}
