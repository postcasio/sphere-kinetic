import Point from './Point';
import Size from './Size';

export interface PositionProps {
  at?: Point;
}

export interface SizeProps {
  size?: Size;
}

export interface RefProps<T> {
  ref?: (component: T) => void;
}
