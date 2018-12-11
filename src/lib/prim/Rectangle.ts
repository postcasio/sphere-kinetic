import Prim from 'prim';
import { PositionProps, SizeProps } from '../Props';
import Primitive from './Primitive';

interface RectangleProps extends PositionProps, SizeProps {
  fillColor?: Color;
  borderColor?: Color;
  borderWidth?: number;
}

export default class Rectangle extends Primitive<RectangleProps> {
  static defaultProps: Partial<RectangleProps> = {
    fillColor: Color.White,
    borderColor: Color.Transparent,
    borderWidth: 0
  };

  draw(target: Surface): void {
    if (!this.props.at || !this.props.size) {
      return;
    }

    const { at, size, fillColor, borderColor, borderWidth } = this.props;

    const { x, y } = at.resolve();
    const { w, h } = size.resolve();

    SSj.log(`Drawing Rectangle<${w}x${h}@${x},${y}>}`);

    if (fillColor) {
      Prim.drawSolidRectangle(target, x, y, w, h, fillColor);
    }

    if (borderColor && borderWidth && borderWidth > 0) {
      Prim.drawRectangle(target, x, y, w, h, borderWidth, borderColor);
    }
  }
}
