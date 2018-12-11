import Bindable from './Bindable';
import Component from './Component';
import ratchet, { auto, Notch } from './ratchet';
import { Nullable } from './types';
import Size from './Size';

export interface ResolvedPoint {
  x: number;
  y: number;
}

export default class Point implements Bindable<Point> {
  __kinetic_bindable = true;

  private _x: Notch[];
  private _y: Notch[];

  private _boundComponent: Nullable<Component> = null;

  static readonly AUTO = auto;

  constructor(x: Notch | Notch[], y: Notch | Notch[]) {
    this._x = Array.isArray(x) ? x : [x];
    this._y = Array.isArray(y) ? y : [y];
  }

  inherit() {
    return new Point([...this._x], [...this._y]);
  }

  x = () => {
    return ratchet(this._x, function() {
      return 0;
    });
  };

  y = () => {
    return ratchet(this._y, function() {
      return 0;
    });
  };

  addX(x: Notch): Point {
    this._x.push(x);

    return this;
  }

  addY(y: Notch): Point {
    this._y.push(y);

    return this;
  }

  setX(x: Notch): Point {
    this._x = [x];

    return this;
  }

  setY(y: Notch): Point {
    this._y = [y];

    return this;
  }

  resolve(): ResolvedPoint {
    return { x: this.x(), y: this.y() };
  }

  bind(component: Component) {
    if (this._boundComponent && this._boundComponent !== component) {
      throw new Error('Tried to bind a Point twice');
    }
    this._boundComponent = component;
  }

  within(otherAt: Point, otherSize: Size): boolean {
    const { x, y } = this.resolve();
    const { x: x2, y: y2 } = otherAt.resolve();
    const { w, h } = otherSize.resolve();

    return x >= x2 && x <= x2 + w && y >= y2 && y <= y2 + h;
  }
}
