import Component, { isComponentClass } from './Component';
import Element, { isElement } from './Element';
import Fragment, { isFragment } from './Fragment';
import { RefProps } from './Props';

export type TextNode = string;
type Node = Element<any> | Fragment | TextNode | void | null | false;

export default Node;

export function instantiateNode<T extends Component>(
  node: Node,
  parent?: Component,
  enableDrawScheduling: boolean = true
): T {
  if (isElement(node) && isComponentClass(node.component)) {
    const NodeComponent = node.component;
    const component: T = new NodeComponent(node.props) as T;

    component.setParent(parent || null);
    component.enableDrawScheduling(
      !(component as any).__kinetic_lift && enableDrawScheduling
    );

    const ref = (component.props as RefProps<T>).ref;
    if (ref) {
      ref(component);
    }

    component.mount();

    return component;
  }

  throw new Error('Cannot instantiate this node');
}

export function flattenNodes(nodes: Array<Node> | Node): Array<Node> {
  const nodeArr = Array.isArray(nodes) ? nodes : [nodes];
  let output: Array<Node> = [];

  for (const node of nodeArr) {
    if (isElement(node) && isFragment(node)) {
      output = output.concat(
        flattenNodes(
          ((node.props as unknown) as { children: Array<Node> }).children
        )
      );
    } else if (node !== undefined && node !== null && node !== false) {
      output.push(node);
    }
  }

  return output;
}
