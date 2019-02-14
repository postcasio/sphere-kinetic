export interface IFont {
  height: number;
  drawText(
    surface: Surface,
    x: number,
    y: number,
    text: string,
    color?: Color,
    wrap?: number
  ): void;
  getTextSize(text: string, wrap?: number): { width: number; height: number };
}
