import Bindable from './Bindable';
import Component, { ComponentClass } from './Component';
import ratchet, { auto, Notch } from './ratchet';
import { Nullable } from './types';

export interface ResolvedSize {
  w: number;
  h: number;
}

export default class Size implements Bindable<Size> {
  __kinetic_bindable = true;

  private _w: Notch[];
  private _h: Notch[];

  private _boundComponent: Nullable<Component> = null;

  static readonly AUTO = auto;

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

  w = () => {
    return ratchet(this._w, () => this.getComponentNaturalWidth());
  };

  h = () => {
    return ratchet(this._h, () => this.getComponentNaturalHeight());
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
}
