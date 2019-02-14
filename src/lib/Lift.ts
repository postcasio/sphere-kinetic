import { ComponentClass } from './Component';
import { Component, Node } from '..';
import Kinetic from './Kinetic';
import { rebindProps } from './Props';

class LiftInner<P> extends Component<P> {
  __kinetic_lift: boolean = true;

  registration: { release: () => void } | null = null;

  draw() {
    return;
  }

  drawLifted(surface: Surface) {
    super.draw(surface);
  }

  update() {
    super.update();
  }

  componentDidMount() {
    SSj.log('Lift did mount');
    this.registration = Kinetic.current().registerLift(this);
  }

  componentWillUnmount() {
    SSj.log('Lift did unmount');
    this.registration!.release();
  }
}

export default function lift<P extends {}>(
  wrappedComponent: ComponentClass<P>
): ComponentClass<P> {
  return class Lift extends LiftInner<P> {
    static defaultProps: P = Object.assign(
      {},
      wrappedComponent && wrappedComponent.defaultProps
    ) as P;

    render(): Node | Array<Node> {
      return Kinetic.createElement(
        wrappedComponent,
        rebindProps(this.props),
        ...((this.props as { children?: Node[] }).children || [])
      );
    }
  };
}

export function isLifted(component: any): component is LiftedComponent {
  return component && component.__kinetic_lift === true;
}

export type LiftedComponent = LiftInner<any>;
