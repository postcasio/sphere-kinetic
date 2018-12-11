import Component from './Component';

export default interface Bindable<T> {
  __kinetic_bindable: boolean;
  bind(component: Component): void;
  inherit(): T;
}

export function isBindable(object: any): object is Bindable<any> {
  return object && object.__kinetic_bindable === true;
}
