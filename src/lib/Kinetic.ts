import Component, { ComponentClass } from './Component';
import Element from './Element';
import Node, { instantiateNode } from './Node';
import SurfaceHost from './prim/SurfaceHost';
import Point from './Point';
import Size from './Size';
import { PositionProps, SizeProps } from './Props';
import { isFocused, FocusedComponent, FocusProps } from './Focus';
import { KeyPressEvent } from '..';

export class MissingRootException extends Error {}

interface KineticInstanceClaim {
  release: () => void;
}

interface BuiltinProps {
  ref?: (component: Component) => void;
}

export default class Kinetic {
  private _root?: Component;
  private _scheduledUpdates: Array<Component> = [];
  private _scheduledDraws: Array<SurfaceHost> = [];

  static currentInstance?: Kinetic;

  private _currentSurfaceHost: SurfaceHost | null = null;

  static createElement<P extends {}>(
    component: ComponentClass<P>,
    props?: P & BuiltinProps,
    ...children: Array<Node>
  ): Element<P> {
    const elementProps = (Object.assign(props || {}, {
      children
    }) as unknown) as P;

    return new Element(component, elementProps);
  }

  static current(): Kinetic {
    if (!Kinetic.currentInstance) {
      throw new Error('No current Kinetic instance');
    }

    return Kinetic.currentInstance;
  }

  static claim(instance: Kinetic): KineticInstanceClaim {
    const oldInstance = Kinetic.currentInstance;
    Kinetic.currentInstance = instance;
    return {
      release: () => {
        Kinetic.currentInstance = oldInstance;
      }
    };
  }

  constructor() {}

  claimSurfaceHost(instance: SurfaceHost): KineticInstanceClaim {
    const oldInstance = this._currentSurfaceHost;
    this._currentSurfaceHost = instance;
    return {
      release: () => {
        this._currentSurfaceHost = oldInstance;
      }
    };
  }

  getCurrentSurfaceHost(): SurfaceHost | null {
    return this._currentSurfaceHost;
  }

  isRootComponent(component: Component): boolean {
    return this._root === component;
  }

  hasRootComponent(): boolean {
    return this._root ? true : false;
  }

  render(root: Node) {
    const claim = Kinetic.claim(this);

    this._root = instantiateNode(root);

    claim.release();
  }

  registerKeyPress(key: Key) {
    const component = this.getFocusedComponent();

    if (!component) {
      return;
    }

    const event = new KeyPressEvent(component, component, key);

    event.emit();
  }

  getFocusedComponent(): FocusedComponent | null {
    let top = null;

    if (this._root) {
      this._walk(this._root, component => {
        if (isFocused(component)) top = component;
      });
    }

    return top;
  }

  update() {
    const claim = Kinetic.claim(this);

    const updates = [...this._scheduledUpdates];

    this._scheduledUpdates = [];

    for (const component of updates) {
      component.update();
    }

    const draws = [...this._scheduledDraws];

    this._scheduledDraws = [];

    for (const component of draws) {
      component.drawSurface();
    }

    claim.release();
  }

  draw() {
    if (!this._root) {
      throw new MissingRootException();
    }

    const claim = Kinetic.claim(this);

    this._root.draw(Surface.Screen);

    claim.release();
  }

  scheduleUpdate(component: Component) {
    if (!this._scheduledUpdates.includes(component)) {
      this._scheduledUpdates.push(component);
    }
  }

  scheduleDraw(component: SurfaceHost) {
    if (!this._scheduledDraws.includes(component)) {
      this._scheduledDraws.push(component);
    }
  }

  componentAt(point: Point): Component | null {
    if (!this._root) {
      return null;
    }

    const stack: Array<Component> = [];

    this._walk(this._root, (node: Component) => {
      if (!isFocused(node)) {
        return;
      }

      const props = node.props as SizeProps & PositionProps;

      if (!props.size || !props.at) {
        return;
      }

      if (point.within(props.at, props.size)) {
        stack.push(node);
      }
    });

    return stack.pop() || null;
  }

  _walk(node: Component, callback: (node: Component) => void) {
    for (const child of node.components) {
      callback(child);
      this._walk(child, callback);
    }
  }
}
