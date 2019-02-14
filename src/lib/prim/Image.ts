import { SizeProps, PositionProps } from '../Props';
import Primitive from './Primitive';
import AspectRatioAware from '../AspectRatioAware';

interface ImageProps extends SizeProps, PositionProps {
  src?: string | Texture | Promise<Texture>;
  maintainAspectRatio?: boolean;
}

interface ImageState {
  texture: Texture | null;
  shape: Shape | null;
}

function createTriStripList(texture: Texture, mask: Color = Color.White) {
  const w = texture.width;
  const h = texture.height;

  return new VertexList([
    { x: 0, y: 0, u: 0, v: 1, color: mask },
    { x: 1, y: 0, u: 1, v: 1, color: mask },
    { x: 0, y: 1, u: 0, v: 0, color: mask },
    { x: 1, y: 1, u: 1, v: 0, color: mask }
  ]);
}

function createShape(texture: Texture, mask: Color = Color.White) {
  return new Shape(
    ShapeType.TriStrip,
    texture,
    createTriStripList(texture, mask)
  );
}

export default class Image extends Primitive<ImageProps, ImageState>
  implements AspectRatioAware {
  static defaultProps = {
    maintainAspectRatio: true
  };

  shouldMaintainAspectRatio(): boolean {
    return this.props.maintainAspectRatio!;
  }

  componentDidMount() {
    if (!this.props.src || this.props.src instanceof Texture) {
      return;
    }

    const src = this.props.src;
    let promise: Promise<Texture>;

    if (typeof src === 'string') {
      promise = Texture.fromFile(src);
    } else {
      promise = src;
    }

    promise.then(texture => {
      this.setState({
        texture,
        shape: createShape(texture)
      });
    });
  }

  getInitialState() {
    const src = this.props.src;

    return src instanceof Texture
      ? {
          texture: src,
          shape: createShape(src)
        }
      : {
          texture: null,
          shape: null
        };
  }

  getNaturalHeight() {
    if (this.state.texture) {
      return this.state.texture.height;
    }

    return 0;
  }

  getNaturalWidth() {
    if (this.state.texture) {
      return this.state.texture.width;
    }

    return 0;
  }

  draw(target: Surface) {
    if (
      !this.props.at ||
      !this.props.size ||
      !this.state.texture ||
      !this.state.shape
    ) {
      return;
    }

    const { at, size } = this.props;
    const { shape } = this.state;
    const { x, y } = at.resolve();
    const { w, h } = size.resolve();

    const transform = new Transform();
    transform.translate(x / w, y / h);
    transform.scale(w, h);

    shape!.draw(target, transform);
  }
}
