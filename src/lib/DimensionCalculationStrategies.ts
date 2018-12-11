import Component, { ComponentClass } from './Component';

export enum Dimension {
  Width = 'width',
  Height = 'height'
}

export default new class DimensionCalculationStrategies {
  Maximum = function(dimension: Dimension) {
    return function(this: Component): number {
      const m = dimension === 'width' ? 'getNaturalWidth' : 'getNaturalHeight';
      return this.children.reduce((res: number, child: Component) => {
        return Math.max(res, child[m]());
      }, 0);
    };
  };

  Minimum = function(dimension: Dimension) {
    return function(this: Component): number {
      const m = dimension === 'width' ? 'getNaturalWidth' : 'getNaturalHeight';
      return this.children.reduce((res: number, child: Component) => {
        return Math.min(res, child[m]());
      }, 0);
    };
  };

  Sum = function(dimension: Dimension) {
    return function(this: Component): number {
      const m = dimension === 'width' ? 'getNaturalWidth' : 'getNaturalHeight';
      return this.children.reduce((res: number, child: Component) => {
        return res + child[m]();
      }, 0);
    };
  };

  First = function(dimension: Dimension) {
    return function(instance: Component): number {
      const m = dimension === 'width' ? 'getNaturalWidth' : 'getNaturalHeight';

      if (instance.children.length === 0) {
        return 0;
      }

      const first = instance.children[0];

      return first[m]();
    };
  };

  Last = function(dimension: Dimension) {
    return function(this: Component): number {
      const m = dimension === 'width' ? 'getNaturalWidth' : 'getNaturalHeight';

      if (this.children.length === 0) {
        return 0;
      }

      const last = this.children[this.children.length - 1];

      return last[m]();
    };
  };
}();
