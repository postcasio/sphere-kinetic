import Component from '../Component';
import Node from '../Node';
import { PositionProps, SizeProps } from '../Props';
import Primitive from './Primitive';
import { IFont } from '../IFont';

interface TextProps extends PositionProps, SizeProps {
  children?: Array<Node>;
  content: string;
  fillColor?: Color;
  font?: IFont;
}

export default class Text extends Primitive<TextProps> {
  static defaultProps = {
    font: Font.Default,
    fillColor: Color.White
  };

  draw(target: Surface): void {
    if (!this.props.at) {
      return;
    }

    const { at, fillColor, font } = this.props;
    const { x, y } = at.resolve();
    const prevOp = target.blendOp;
    target.blendOp = BlendOp.Default;
    font!.drawText(target, x, y, this.props.content, fillColor);
    target.blendOp = prevOp;
  }

  getNaturalHeight() {
    return this.props.font!.height;
  }

  getNaturalWidth() {
    return this.props.font!.getTextSize(this.props.content).width;
  }
}
