import Component, { isComponent } from './Component';

export default interface AspectRatioAware {
  shouldMaintainAspectRatio(): boolean;
}

export function isAspectRatioAware(
  component: any
): component is AspectRatioAware {
  return isComponent(component) && 'shouldMaintainAspectRatio' in component;
}
