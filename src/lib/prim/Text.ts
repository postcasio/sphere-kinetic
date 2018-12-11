import Component from '../Component';
import Node from '../Node';
import { PositionProps, SizeProps } from '../Props';
import Primitive from './Primitive';

interface TextProps extends PositionProps, SizeProps {
  children?: Array<Node>;
  content: string;
  fillColor?: Color;
  font?: Font;
}

export default class Text extends Primitive<TextProps> {
  static defaultProps = {
    font: Font.Default,
    fillColor: Color.White
  };

  draw(target: Surface): void {
    if (!this.props.at) {
      SSj.log(`Text "${this.props.content}" has no position`);
      return;
    }

    const { at, fillColor } = this.props;
    const { x, y } = at.resolve();

    SSj.log(`Drawing Text<"${this.props.content}"@${x},${y}>}`);

    Font.Default.drawText(target, x, y, this.props.content, fillColor);
  }

  getNaturalHeight() {
    return this.props.font!.height;
  }

  getNaturalWidth() {
    return this.props.font!.getTextSize(this.props.content, 0).width;
  }
}
