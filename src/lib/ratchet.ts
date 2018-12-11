export type NotchFunction = () => number;
export type NotchValue = number;
export type Notch = NotchValue | NotchFunction;

export default function ratchet(notches: Notch[], initial: NotchFunction) {
  return notches.reduce((acc: NotchValue, notch) => {
    if (typeof notch === 'function') {
      return acc + notch();
    } else {
      if (notch === Number.MIN_VALUE) {
        return initial();
      }

      return acc + notch;
    }
  }, 0);
}

export const auto = Number.MIN_VALUE;
