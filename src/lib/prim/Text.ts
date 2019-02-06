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
      return;
    }

    const { at, fillColor, font } = this.props;
    const { x, y } = at.resolve();

    font!.drawText(target, x, y, this.props.content, fillColor);
  }

  getNaturalHeight() {
    return this.props.font!.height;
  }

  getNaturalWidth() {
    return this.props.font!.getTextSize(this.props.content).width;
  }
}
