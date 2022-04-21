import type { FC, ReactElement } from 'react';
import { createElement } from 'react';
import {
  castArray,
  isEmpty,
} from 'lodash/fp';

type FCWithProps<T> = [FC<T>, T];

export const composeComponents = (
  components: Array<FCWithProps<unknown> | FC<unknown>>,
): ReactElement<any, any> | null => {
  if (isEmpty(components)) {
    return null;
  }

  const [nextComponentDef, ...remaining] = components;

  const [Component, props] = castArray(nextComponentDef) as [FC<any>, any | undefined];

  return createElement(
    Component,
    props || null,
    composeComponents(remaining) || props?.children,
  );
};

export default <P extends object = {}>(
  components: any,
  root: FC<P>,
) => (
  (props: P) => composeComponents([
    ...components,
    [root, props],
  ])
);
