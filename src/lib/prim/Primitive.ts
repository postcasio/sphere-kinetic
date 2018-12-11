import Component from '../Component';
import Node from '../Node';

export default class Primitive<P = {}, S = {}> extends Component<P, S> {
  isPrimitive: boolean = true;

  render(): Node[] | Node {
    return [];
  }
}
