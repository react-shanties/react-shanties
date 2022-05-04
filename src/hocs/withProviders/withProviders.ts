import type { ComponentClass, FC, ReactElement } from 'react';
import { createElement } from 'react';
import {
  castArray,
  isEmpty,
} from 'lodash/fp';

export type ComponentDefinition<T = any> = string | FC<T> | ComponentClass<T, any>;
export type ProviderList = Array<[ComponentDefinition, any] | ComponentDefinition>;

export const composeComponents = (
  components: ProviderList,
): ReactElement<any, any> | null => {
  if (isEmpty(components)) {
    return null;
  }

  const [nextComponentDef, ...remaining] = components;

  const [Component, props] = castArray(nextComponentDef) as [ComponentDefinition, any | undefined];

  return createElement(
    Component,
    props || null,
    composeComponents(remaining) || props?.children,
  );
};

export default <P extends object = {}>(
  components: ProviderList,
  root: ComponentDefinition<P>,
): FC<P> => (
  (props: P) => composeComponents([
    ...components,
    [root, props],
  ])
);
