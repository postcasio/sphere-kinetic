import Component, { isComponentClass } from './Component';
import Element, { isElement } from './Element';
import Fragment, { isFragment } from './Fragment';

export type TextNode = string;
type Node = Element<any> | Fragment | TextNode | void | null | false;

export default Node;

export function instantiateNode(node: Node, parent?: Component): Component {
  if (isElement(node) && isComponentClass(node.component)) {
    const NodeComponent = node.component;
    const component = new NodeComponent(node.props);

    component.setParent(parent || null);
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
