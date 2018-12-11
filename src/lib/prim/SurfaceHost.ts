import Prim from 'prim';
import Node from '../Node';
import { PositionProps, SizeProps } from '../Props';
import Primitive from './Primitive';

interface SurfaceHostProps extends PositionProps, SizeProps {
  children?: Node[];
}

// type DrawFunction = (...args: Array<any>) => any;

// type DrawOperation = [DrawFunction, ...Array<any>];

// interface DrawOperationCacheEntry {
//   op: DrawOperation;
//   component: Primitive;
// };

export default class SurfaceHost<
  P extends SurfaceHostProps = SurfaceHostProps
> extends Primitive<P> {
  surface?: Surface;

  constructor(props: P) {
    super(props);
  }

  componentDidUpdate() {
    this.drawSurface();
  }

  render(): Node[] | Node {
    return this.props.children || [];
  }

  update() {
    const claim = this._kinetic.claimSurfaceHost(this);
    Primitive.prototype.update.apply(this);
    claim.release();
  }

  drawSurface() {
    if (!this.props.size) {
      return;
    }

    const { w, h } = this.props.size.resolve();

    if (
      !this.surface ||
      w !== this.surface.width ||
      h !== this.surface.height
    ) {
      this.surface = new Surface(w, h, Color.Transparent);
    } else if (this.surface) {
      Prim.drawSolidRectangle(this.surface, 0, 0, w, h, Color.Transparent);
    }

    for (const child of this.children) {
      child.draw(this.surface);
    }
  }

  draw(target: Surface) {
    if (this.surface && this.props.at && this.props.size) {
      const { x, y } = this.props.at.resolve();

      Prim.blit(target, x, y, this.surface);
    }
  }
}
