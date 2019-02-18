import { isBindable } from './Bindable';
import Element, { isElement, isElementComponent } from './Element';

import Node, { flattenNodes, instantiateNode } from './Node';

import Kinetic, {
  SurfaceHost,
  isSurfaceHost,
  DimensionCalculationStrategies,
  Dimension
} from '../index';

function bindProps<P extends {}>(props: P, component: Component): P {
  for (const prop of Object.values(props)) {
    if (isBindable(prop)) {
      prop.bind(component);
    }
  }

  return props;
}

export type Literal = string | boolean | null | void;
export type ComponentChild = Literal | Component;

export default class Component<P = {}, S = {}> {
  props: P;
  components: Component[] = [];
  children: Array<ComponentChild> = [];
  protected state: S;

  protected _kinetic: Kinetic;
  private _mounted: boolean = false;
  private _surfaceHost: SurfaceHost | null = null;
  private _parent: Component | null = null;
  protected _shouldScheduleSurfaceHostDraw: boolean = true;

  protected repositioning = false;

  constructor(props: P) {
    this.props = bindProps(Object.assign({}, props), this);
    this.state = {} as S;

    this._kinetic = Kinetic.current();

    this.componentWillMount();

    this.state = this.getInitialState();
  }

  setParent(component: Component | null) {
    this._parent = component;

    let node = component;

    while (node && !isSurfaceHost(node)) {
      node = node.getParentComponent();
    }

    if (node) {
      this._surfaceHost = node;
    }
  }

  mount() {
    if (this._mounted) {
      throw new Error(
        'Tried to mount the same ' + this.constructor.name + ' twice'
      );
    }

    this.update();

    this._mounted = true;

    this.componentDidMount();
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

  componentDidReposition() {}

  getDerivedStateFromProps(_newProps: P): Partial<S> {
    return {};
  }

  render(): Node[] | Node {
    return (
      ((this.props as unknown) as { children: Array<Node> }).children || []
    );
  }

  enableDrawScheduling(enabled: boolean) {
    this._shouldScheduleSurfaceHostDraw = enabled;
  }

  update(): void {
    this.componentWillUpdate();

    let children = flattenNodes(this.render());

    this.reconcile(
      children
        .filter(child => !!child)
        .map(child => (isElement(child) ? child : String(child)))
    );

    this.componentDidUpdate();

    if (this._shouldScheduleSurfaceHostDraw) {
      let surfaceHost = this.getSurfaceHost();
      if (
        !this.repositioning &&
        this._kinetic.hasRootComponent() &&
        !this._kinetic.isRootComponent(this) &&
        surfaceHost
      ) {
        this._kinetic.scheduleDraw(surfaceHost);
      }
    }
  }

  reconcile(incomingChildren: Array<Node>): void {
    const outgoingChildren: Array<Node> = this.children;
    const newChildren: Array<ComponentChild> = [];

    for (var i = 0; i < outgoingChildren.length; i++) {
      const outgoingChild = outgoingChildren[i];
      const incomingChild = incomingChildren[i];

      if (
        incomingChild instanceof Element &&
        outgoingChild instanceof Component
      ) {
        if (incomingChild.component !== outgoingChild.constructor) {
          outgoingChild.unmount();
          newChildren.push(
            instantiateNode(
              incomingChild,
              this,
              this._shouldScheduleSurfaceHostDraw
            )
          );
        } else {
          outgoingChild.receiveProps(incomingChild.props);
          newChildren.push(outgoingChild);
        }
      } else {
        if (outgoingChild !== incomingChild) {
          if (isComponent(outgoingChild)) {
            outgoingChild.unmount();
          }
          if (incomingChild instanceof Element) {
            newChildren.push(
              instantiateNode(
                incomingChild,
                this,
                this._shouldScheduleSurfaceHostDraw
              )
            );
          } else {
            newChildren.push(incomingChild as Literal);
          }
        } else {
          newChildren.push(outgoingChild as Literal);
        }
      }
    }

    for (; i < incomingChildren.length; i++) {
      if (incomingChildren[i] instanceof Element) {
        newChildren.push(
          instantiateNode(
            incomingChildren[i],
            this,
            this._shouldScheduleSurfaceHostDraw
          )
        );
      } else {
        newChildren.push(incomingChildren[i] as Literal);
      }
    }

    this.children = newChildren;
    this.components = newChildren.filter(isComponent);
  }

  receiveProps(newProps: P): void {
    this.props = bindProps(newProps, this);

    this.update();
  }

  unmount(): void {
    this.componentWillUnmount();

    for (const child of this.components) {
      child.unmount();
    }

    this._mounted = false;

    this.componentDidUnmount();
  }

  reposition() {
    this.repositioning = true;

    for (const child of this.components) {
      child.reposition();
    }

    this.componentDidReposition();

    this.repositioning = false;
  }

  draw(surface: Surface): void {
    for (const component of this.components) {
      component.draw(surface);
    }
  }

  getNaturalWidth(): number {
    return DimensionCalculationStrategies.Maximum(Dimension.Width).apply(this);
  }

  getNaturalHeight(): number {
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

export function isComponent(component: any): component is Component {
  return component instanceof Component;
}

export interface ComponentConstructor<T extends Component> {
  new (props: T['props']): Component;
  defaultProps?: Partial<T['props']>;
}
