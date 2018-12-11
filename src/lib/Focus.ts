import Component, { ComponentClass } from './Component';
import Node from './Node';
import Kinetic from './Kinetic';
import lodash from 'lodash';
import { isBindable } from './Bindable';
import Event from './events/Event';
import KeyDownEvent from './events/KeyDownEvent';
import KeyUpEvent from './events/KeyUpEvent';
import KeyPressEvent from './events/KeyPressEvent';

export interface FocusEventProps {
  onKeyDown?: (event: KeyDownEvent) => void;
  onKeyUp?: (event: KeyUpEvent) => void;
  onKeyPress?: (event: KeyPressEvent) => void;
  onClick?: (event: Event) => void;
}

export interface FocusProps extends FocusEventProps {
  children?: Array<Node>;
}

export interface FocusState {}

class FocusedInner<P> extends Component<P & FocusProps, FocusState> {}

export default function Focus<P extends {}, S extends {}>(
  wrappedComponent: ComponentClass<P, S> | null = null
): ComponentClass<P & FocusProps, FocusState> {
  return class Focused extends FocusedInner<P> {
    static defaultProps: P & FocusProps = Object.assign(
      {},
      wrappedComponent && wrappedComponent.defaultProps
    ) as P & FocusProps;

    __kinetic_focus: boolean = true;

    render(): Node | Array<Node> {
      SSj.log(`Render Focus with ${this.props.children!.length} children`);
      return wrappedComponent
        ? Kinetic.createElement(
            wrappedComponent,
            (lodash(this.props)
              .omit([
                'onKeyDown',
                'onKeyUp',
                'onKeyPress',
                'onClick',
                'children'
              ])
              .mapValues(value => {
                if (isBindable(value)) {
                  return value.inherit();
                }
                return value;
              })
              .value() as unknown) as P,
            ...(this.props.children || [])
          )
        : this.props.children;
    }
  };
}

export const Focused = Focus();

export function isFocused(component: any): component is FocusedInner<any> {
  return component && component.__kinetic_focus === true;
}
