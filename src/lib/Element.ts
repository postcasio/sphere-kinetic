import { ComponentClass, isComponentClass } from './Component';
import Node, { flattenNodes } from './Node';
import { FragmentClass } from './Fragment';

export default class Element<P = {}> {
  component: ComponentClass<P> | FragmentClass;
  props: P;

  constructor(component: ComponentClass<P> | FragmentClass, props: P) {
    this.component = component;

    this.props = Object.assign(
      {},
      (isComponentClass(component) && component.defaultProps) || {},
      props,
      {
        children: ((props as unknown) as { children: Node[] }).children.reduce(
          (res: Array<Node>, childNode: Array<Node> | Node) => {
            return res.concat(flattenNodes(childNode));
          },
          []
        )
      }
    );
  }

  withProps(props: P) {
    return new Element(this.component, Object.assign({}, this.props, props));
  }

  withChildren(children: Array<Node>) {
    return new Element(this.component, ({ children } as unknown) as P);
  }
}

export function isElement(node: Node): node is Element<any> {
  return node instanceof Element;
}

export function isElementComponent<T extends ComponentClass>(
  node: any,
  componentClass: T
): node is Element<InstanceType<T>['props']> {
  return (
    node instanceof Element &&
    (componentClass === node.component ||
      componentClass.isPrototypeOf(node.component))
  );
}
