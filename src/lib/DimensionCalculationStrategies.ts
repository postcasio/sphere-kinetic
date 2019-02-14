import Component, { ComponentClass } from './Component';
import { Size } from '..';
import { SizeProps } from './Props';

export enum Dimension {
  Width = 'width',
  Height = 'height'
}

// function getWidth(component: Component) {
//   const size = (component.props as SizeProps).size;
//   return size && !size.isAutoWidth() ? size.w() : component.getNaturalWidth();
// }

// function getHeight(component: Component) {
//   const size = (component.props as SizeProps).size;
//   return size && !size.isAutoHeight() ? size.w() : component.getNaturalHeight();
// }

function getWidth(component: Component) {
  return component.getNaturalWidth();
}

function getHeight(component: Component) {
  return component.getNaturalHeight();
}

export default new class DimensionCalculationStrategies {
  Maximum = function(dimension: Dimension) {
    const dimensionGetter = dimension === 'width' ? getWidth : getHeight;

    return function(this: Component): number {
      return this.components.reduce((res: number, child: Component) => {
        return Math.max(res, dimensionGetter(child));
      }, 0);
    };
  };

  Minimum = function(dimension: Dimension) {
    const dimensionGetter = dimension === 'width' ? getWidth : getHeight;

    return function(this: Component): number {
      return this.components.reduce((res: number, child: Component) => {
        return Math.min(res, dimensionGetter(child));
      }, 0);
    };
  };

  Sum = function(dimension: Dimension) {
    const dimensionGetter = dimension === 'width' ? getWidth : getHeight;

    return function(this: Component): number {
      return this.components.reduce((res: number, child: Component) => {
        return res + dimensionGetter(child);
      }, 0);
    };
  };

  First = function(dimension: Dimension) {
    const dimensionGetter = dimension === 'width' ? getWidth : getHeight;

    return function(instance: Component): number {
      if (instance.components.length === 0) {
        return 0;
      }

      const first = instance.components[0];

      return dimensionGetter(first);
    };
  };

  Last = function(dimension: Dimension) {
    const dimensionGetter = dimension === 'width' ? getWidth : getHeight;
    return function(this: Component): number {
      if (this.components.length === 0) {
        return 0;
      }

      const last = this.components[this.components.length - 1];

      return dimensionGetter(last);
    };
  };
}();
