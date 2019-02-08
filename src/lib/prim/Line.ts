import Prim from 'prim';
import { PositionProps, SizeProps } from '../Props';
import Primitive from './Primitive';
import { Point } from '../..';

interface LineProps extends PositionProps {
  fillColor?: Color;
  fillColor2?: Color;
  width?: number;
  to?: Point;
}

export default class Line extends Primitive<LineProps> {
  static defaultProps: Partial<LineProps> = {
    fillColor: Color.White,
    fillColor2: Color.White,
    width: 1
  };

  draw(target: Surface): void {
    if (!this.props.at || !this.props.to) {
      return;
    }

    const { at, to, fillColor, width, fillColor2 } = this.props;

    const { x, y } = at.resolve();
    const { x: x2, y: y2 } = to.resolve();

    if (fillColor && width) {
      Prim.drawLine(target, x, y, x2, y2, width, fillColor, fillColor2);
    }
  }
}
