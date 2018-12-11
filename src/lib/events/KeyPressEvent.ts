import KeyEvent from './KeyEvent';
import Component from '../Component';
import { FocusEventProps } from '../Focus';

export default class KeyPressEvent extends KeyEvent {
  handler: keyof FocusEventProps = 'onKeyPress';

  clone(currentTarget: Component): KeyPressEvent {
    return new KeyPressEvent(this.target, currentTarget, this.key);
  }
}
