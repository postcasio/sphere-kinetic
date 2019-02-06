import Component from './Component';
import { Nullable } from './types';

export type NotchFunction = (component: Nullable<Component>) => number;
export type NotchValue = number;
export type Notch = NotchValue | NotchFunction;

export default function ratchet(
  notches: Notch[],
  component: Nullable<Component>,
  initial: NotchFunction
) {
  return notches.reduce((acc: NotchValue, notch) => {
    if (typeof notch === 'function') {
      return acc + notch(component);
    } else {
      if (notch === Number.MIN_VALUE) {
        return initial(component);
      }

      return acc + notch;
    }
  }, 0);
}

export const auto = Number.MIN_VALUE;
