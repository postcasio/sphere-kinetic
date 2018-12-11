import { isElement } from './Element';
import Node from './Node';

export default class Fragment {}

export function isFragment(node: Node): node is Fragment {
  return isElement(node) && node.component === Fragment;
}

export interface FragmentClass {}
