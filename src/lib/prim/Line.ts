import Prim from 'prim';
import { PositionProps, SizeProps } from '../Props';
import Primitive from './Primitive';

interface LineProps extends PositionProps, SizeProps {
  fillColor?: Color;
  fillColor2?: Color;
  width?: number;
}

export default class Line extends Primitive<LineProps> {
  static defaultProps: Partial<LineProps> = {
    fillColor: Color.White,
    fillColor2: Color.White,
    width: 1
  };

  draw(target: Surface): void {
    if (!this.props.at || !this.props.size) {
      return;
    }

    const { at, size, fillColor, width, fillColor2 } = this.props;

    const { x, y } = at.resolve();
    const { w, h } = size.resolve();

    if (fillColor && width) {
      Prim.drawLine(target, x, y, x + w, y + h, width, fillColor, fillColor2);
    }
  }
}
