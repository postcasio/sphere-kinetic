import Component from './Component';
import Element from './Element';
import Node from './Node';
import { PositionProps, SizeProps } from './Props';
import Size from './Size';
import DimensionCalculationStrategies, {
  Dimension
} from './DimensionCalculationStrategies';

export interface LayoutProps extends PositionProps, SizeProps {
  flow?: string;
  children?: Array<Element>;
}

export default class Layout extends Component<LayoutProps> {
  static defaultProps = {
    flow: 'vertical'
  };

  render(): Array<Node> | Node {
    if (!this.props.size || !this.props.at) {
      return;
    }

    let size = this.props.size.inherit();
    let at = this.props.at.inherit();
    let flow = this.props.flow;

    return (
      this.props.children &&
      this.props.children.map(child => {
        let childSize;
        const childAt = at.copy();

        if (flow === 'vertical') {
          childSize = new Size(size.w, Size.AUTO);
          at.addY(childSize.h);
        } else {
          childSize = new Size(Size.AUTO, size.h);
          at.addX(childSize.w);
        }

        return child.withProps({
          size: childSize,
          at: childAt
        });
      })
    );
  }

  getNaturalWidth(): number {
    return this.props.flow === 'vertical'
      ? DimensionCalculationStrategies.Maximum(Dimension.Width).apply(this)
      : DimensionCalculationStrategies.Sum(Dimension.Width).apply(this);
  }

  getNaturalHeight(): number {
    return this.props.flow === 'vertical'
      ? DimensionCalculationStrategies.Sum(Dimension.Height).apply(this)
      : DimensionCalculationStrategies.Maximum(Dimension.Height).apply(this);
  }
}
