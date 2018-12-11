import lodash from 'lodash';
import { isBindable } from './Bindable';
// import DimensionCalculationStrategies, {
//   Dimension
// } from './DimensionCalculationStrategies';
import Element, { isElement } from './Element';
import Kinetic from './Kinetic';
import Node, { flattenNodes, instantiateNode } from './Node';
import DimensionCalculationStrategies, {
  Dimension
} from './DimensionCalculationStrategies';
import SurfaceHost from './prim/SurfaceHost';

function bindProps<P extends {}>(props: P, component: Component): P {
  for (const prop of Object.values(props)) {
    if (isBindable(prop)) {
      prop.bind(component);
    }
  }

  return props;
}

export default class Component<P = {}, S = {}> {
  props: P;
  children: Component[];
  protected state: S;

  protected _kinetic: Kinetic;
  private _mounted: boolean = true;
  private _surfaceHost: SurfaceHost | null;
  private _parent: Component | null = null;

  constructor(props: P) {
    this.props = bindProps(Object.assign({}, props), this);
    this.state = {} as S;

    this._kinetic = Kinetic.current();
    this.children = [];
    const host = this._kinetic.getCurrentSurfaceHost();

    this._surfaceHost = host;

    this.componentWillMount();

    this.state = this.getInitialState();

    this.update();

    this.componentDidMount();
  }

  setParent(component: Component | null) {
    this._parent = component;
  }

  getInitialState(): S {
    return {} as S;
  }

  componentWillUpdate() {}

  componentDidUpdate() {}

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidUnmount() {}

  render(): Node[] | Node {
    return (
      ((this.props as unknown) as { children: Array<Node> }).children || []
    );
  }

  update(): void {
    SSj.log('Updating ' + this.constructor.name);

    this.componentWillUpdate();

    let children = flattenNodes(this.render());

    this.reconcile(children.filter(isElement));

    this.componentDidUpdate();

    if (
      this._kinetic.hasRootComponent() &&
      !this._kinetic.isRootComponent(this)
    ) {
      this._kinetic.scheduleDraw(this.getSurfaceHost()!);
    }
  }

  reconcile(incomingChildren: Array<Element>): void {
    const outgoingChildren = this.children;
    const newChildren = [];

    for (var i = 0; i < outgoingChildren.length; i++) {
      if (outgoingChildren[i].constructor !== incomingChildren[i].component) {
        outgoingChildren[i].unmount();
        newChildren.push(instantiateNode(incomingChildren[i], this));
      } else {
        outgoingChildren[i].receiveProps(incomingChildren[i].props);
        newChildren.push(outgoingChildren[i]);
      }
    }

    for (; i < incomingChildren.length; i++) {
      newChildren.push(instantiateNode(incomingChildren[i], this));
    }

    this.children = newChildren;
  }

  receiveProps(newProps: P): void {
    SSj.log(`${this.constructor.name} received new props`);
    this.props = bindProps(newProps, this);

    this.update();
  }

  unmount(): void {
    this.componentWillUnmount();

    for (const child of this.children) {
      child.unmount();
    }

    this._mounted = false;

    this.componentDidUnmount();
  }

  draw(surface: Surface): void {
    SSj.log(
      `Drawing ${this.constructor.name} (${this.children.length} children)`
    );
    for (const component of this.children) {
      component.draw(surface);
    }
  }

  getNaturalWidth() {
    return DimensionCalculationStrategies.Maximum(Dimension.Width).apply(this);
  }

  getNaturalHeight() {
    return DimensionCalculationStrategies.Maximum(Dimension.Height).apply(this);
  }

  setState(newState: Partial<S>) {
    Object.assign(this.state, newState);

    this._kinetic.scheduleUpdate(this);
  }

  getSurfaceHost(): SurfaceHost | null {
    return this._surfaceHost;
  }

  getParentComponent() {
    return this._parent;
  }
}

export interface ComponentClass<P = {}, S = {}> {
  new (props: P): Component<P, S>;
  defaultProps?: Partial<P>;
}

export function isComponentClass(component: any): component is ComponentClass {
  return Component.isPrototypeOf(component);
}
