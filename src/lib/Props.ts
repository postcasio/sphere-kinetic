import Point from './Point';
import Size from './Size';
import { isBindable } from './Bindable';

export interface PositionProps {
  at?: Point;
}

export interface SizeProps {
  size?: Size;
}

export interface RefProps<T> {
  ref?: (component: T) => void;
}

export function rebindProps<P extends { [key: string]: any }>(props: P): P {
  return Object.keys(props).reduce(
    (res, propKey) => {
      if (isBindable(props[propKey])) {
        res[propKey] = props[propKey].inherit();
      } else {
        res[propKey] = props[propKey];
      }

      return res;
    },
    {} as P
  );
}
