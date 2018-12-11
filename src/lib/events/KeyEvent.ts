import Event from './Event';
import Component from '../Component';

export default class KeyEvent extends Event {
  key: number;

  constructor(target: Component, currentTarget: Component, key: number) {
    super(target, currentTarget);

    this.key = key;
  }

  clone(currentTarget: Component): KeyEvent {
    return new KeyEvent(this.target, currentTarget, this.key);
  }
}
