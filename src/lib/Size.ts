import Bindable from './Bindable';
import Component, { ComponentClass } from './Component';
import ratchet, { auto, Notch } from './ratchet';
import { Nullable } from './types';

export interface ResolvedSize {
  w: number;
  h: number;
}

export interface Measurable {
  width: number;
  height: number;
}

export default class Size implements Bindable<Size> {
  __kinetic_bindable = true;

  private _w: Notch[];
  private _h: Notch[];

  private _boundComponent: Nullable<Component> = null;

  static readonly AUTO = auto;

  static get auto() {
    return new Size(Size.AUTO, Size.AUTO);
  }

  constructor(w: Notch | Notch[], h: Notch | Notch[]) {
    this._w = Array.isArray(w) ? w : [w];
    this._h = Array.isArray(h) ? h : [h];
  }

  collapse() {
    const lastAutoWidth = this._w.lastIndexOf(Size.AUTO);

    if (lastAutoWidth >= 0) {
      this._w = this._w.slice(lastAutoWidth);
    }

    const lastAutoHeight = this._h.lastIndexOf(Size.AUTO);

    if (lastAutoHeight >= 0) {
      this._h = this._h.slice(lastAutoHeight);
    }

    return this;
  }

  inherit() {
    this.collapse();

    return new Size(this.w, this.h);
  }

  copy() {
    return new Size(this._w.slice(), this._h.slice());
  }

  replaceWith(other: Size) {
    this._w = [other.w];
    this._h = [other.h];
  }

  w = () => {
    return ratchet(this._w, this._boundComponent, () =>
      this.getComponentNaturalWidth()
    );
  };

  h = () => {
    return ratchet(this._h, this._boundComponent, () =>
      this.getComponentNaturalHeight()
    );
  };

  addW(w: Notch): Size {
    this._w.push(w);

    return this;
  }

  addH(h: Notch): Size {
    this._h.push(h);

    return this;
  }

  setW(w: Notch): Size {
    this._w = [w];

    return this;
  }

  setH(h: Notch): Size {
    this._h = [h];

    return this;
  }

  resolve(): ResolvedSize {
    return { w: this.w(), h: this.h() };
  }

  bind(component: Component) {
    if (this._boundComponent && this._boundComponent !== component) {
      throw new Error('Tried to bind a Size twice');
    }

    this._boundComponent = component;

    return this;
  }

  unbind() {
    this._boundComponent = null;

    return this;
  }

  getComponentNaturalWidth() {
    if (!this._boundComponent) {
      throw new Error('Cannot use AUTO in unbound Size');
    }

    return this._boundComponent.getNaturalWidth();
  }

  getComponentNaturalHeight() {
    if (!this._boundComponent) {
      throw new Error('Cannot use AUTO in unbound Size');
    }

    return this._boundComponent.getNaturalHeight();
  }

  static of(other: Measurable) {
    return new Size(other.width, other.height);
  }

  isAutoWidth(): boolean {
    return this._w[this._w.length - 1] === Size.AUTO;
  }

  isAutoHeight(): boolean {
    return this._h[this._h.length - 1] === Size.AUTO;
  }
}
