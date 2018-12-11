import KeyEvent from './KeyEvent';
import Component from '../Component';
import { FocusEventProps } from '../Focus';

export default class KeyUpEvent extends KeyEvent {
  handler: keyof FocusEventProps = 'onKeyUp';

  clone(currentTarget: Component): KeyUpEvent {
    return new KeyUpEvent(this.target, currentTarget, this.key);
  }
}
