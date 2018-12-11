import KeyEvent from './KeyEvent';
import Component from '../Component';
import { FocusEventProps } from '../Focus';

export default class KeyDownEvent extends KeyEvent {
  handler: keyof FocusEventProps = 'onKeyDown';

  clone(currentTarget: Component): KeyDownEvent {
    return new KeyDownEvent(this.target, currentTarget, this.key);
  }
}
