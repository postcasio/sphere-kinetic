import Prim from 'prim';
import Node from '../Node';
import { PositionProps, SizeProps } from '../Props';
import Primitive from './Primitive';
import Component from '../Component';

export interface SurfaceHostProps extends PositionProps, SizeProps {
  children?: Node[];
}

export default class SurfaceHost<
  P extends SurfaceHostProps = SurfaceHostProps,
  S = {}
> extends Primitive<P, S> {
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

  drawSurface() {
    if (!this.props.size) {
      return;
    }

    const { w, h } = this.props.size.resolve();

    const surface = this.prepareSurface(w, h);

    for (const child of this.components) {
      child.draw(surface);
    }
  }

  draw(target: Surface) {
    if (this.surface && this.props.at && this.props.size) {
      const { x, y } = this.props.at.resolve();

      Prim.blit(target, x, y, this.surface);
    }
  }

  prepareSurface(w: number, h: number) {
    if (
      !this.surface ||
      w !== this.surface.width ||
      h !== this.surface.height
    ) {
      this.surface = new Surface(w, h, Color.Transparent);
    } else if (this.surface) {
      this.surface.blendOp = BlendOp.Replace;
      Prim.drawSolidRectangle(this.surface, 0, 0, w, h, Color.Transparent);
      this.surface.blendOp = BlendOp.Default;
    }

    return this.surface;
  }
}

export function isSurfaceHost(component: any): component is SurfaceHost {
  return component instanceof SurfaceHost;
}
