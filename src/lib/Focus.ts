import Component, { ComponentClass } from './Component';
import Node from './Node';
import Kinetic from './Kinetic';
import omit from 'lodash/omit';
import { isBindable } from './Bindable';
import Event from './events/Event';
import KeyDownEvent from './events/KeyDownEvent';
import KeyUpEvent from './events/KeyUpEvent';
import KeyPressEvent from './events/KeyPressEvent';
import { PositionProps, SizeProps, rebindProps } from './Props';

export interface FocusEventProps {
  onKeyDown?: (event: KeyDownEvent) => void;
  onKeyUp?: (event: KeyUpEvent) => void;
  onKeyPress?: (event: KeyPressEvent) => void;
  onClick?: (event: Event) => void;
}

export interface FocusProps extends FocusEventProps, SizeProps, PositionProps {
  children?: Array<Node>;
}

export interface FocusState {}

class FocusedInner<P> extends Component<P & FocusProps, FocusState> {}

export default function focus<P extends {}, S extends {}>(
  wrappedComponent: ComponentClass<P, S> | null = null
): ComponentClass<P & FocusProps, FocusState> {
  return class Focused extends FocusedInner<P> {
    static defaultProps: P & FocusProps = Object.assign(
      {},
      wrappedComponent && wrappedComponent.defaultProps
    ) as P & FocusProps;

    __kinetic_focus: boolean = true;

    render(): Node | Array<Node> {
      return wrappedComponent
        ? Kinetic.createElement(
            wrappedComponent,
            rebindProps(
              omit(this.props, [
                'onKeyDown',
                'onKeyUp',
                'onKeyPress',
                'onClick',
                'children'
              ])
            ),
            ...(this.props.children || [])
          )
        : this.props.children;
    }
  };
}

export const Focused = focus();

export function isFocused(component: any): component is FocusedInner<any> {
  return component && component.__kinetic_focus === true;
}

export type FocusedComponent = FocusedInner<any>;
