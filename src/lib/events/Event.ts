import Component from '../Component';
import { FocusEventProps, isFocused } from '../Focus';
import { Nullable } from '../types';

type GenericEventHandler = (event: Event) => void;

export default class Event {
  target: Component;
  currentTarget: Component;
  handler?: keyof FocusEventProps;
  propagating: boolean = true;

  constructor(target: Component, currentTarget: Component) {
    this.target = target;
    this.currentTarget = currentTarget;
  }

  stopPropagation() {
    this.propagating = false;
  }

  emit() {
    if (!this.handler) {
      return;
    }

    let target: Nullable<Component> = this.currentTarget;
    let event: Event = this;

    while (target && event.propagating) {
      event = this.clone(target);

      if (isFocused(target)) {
        const props = target.props as FocusEventProps;
        const method = props[this.handler];

        method && (method as GenericEventHandler)(event);
      }

      target = target.getParentComponent();
    }
  }

  clone(currentTarget: Component): Event {
    return new Event(this.target, currentTarget);
  }
}
