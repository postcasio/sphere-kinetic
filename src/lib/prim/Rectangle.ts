import Prim from 'prim';
import { PositionProps, SizeProps } from '../Props';
import Primitive from './Primitive';

interface RectangleProps extends PositionProps, SizeProps {
  fillColor?: Color | Color[];
  borderColor?: Color;
  borderWidth?: number;
  blendOp?: BlendOp;
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

    const {
      at,
      size,
      fillColor,
      borderColor,
      borderWidth,
      blendOp
    } = this.props;

    const { x, y } = at.resolve();
    const { w, h } = size.resolve();

    const prevBlendOp = target.blendOp;

    if (blendOp) {
      target.blendOp = blendOp;
    }

    if (fillColor) {
      if (Array.isArray(fillColor)) {
        if (fillColor.length !== 4) {
          throw new Error('You must pass 4 colors if passing an array');
        }

        Prim.drawSolidRectangle(
          target,
          x,
          y,
          w,
          h,
          fillColor[0],
          fillColor[1],
          fillColor[2],
          fillColor[3]
        );
      } else {
        Prim.drawSolidRectangle(target, x, y, w, h, fillColor);
      }
    }

    if (blendOp) {
      target.blendOp = prevBlendOp;
    }

    if (borderColor && borderWidth && borderWidth > 0) {
      Prim.drawRectangle(target, x, y, w, h, borderWidth, borderColor);
    }
  }
}
