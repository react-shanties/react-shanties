import React, {
  useMemo,
} from 'react';
import type {
  FC,
} from 'react';
import { omit } from 'lodash/fp';

export default <
  TProps extends object
>(
  propsToRemove: Array<keyof TProps>,
  Component: FC<TProps>,
) => {
  const ExtractedComponent = (props: TProps) => {
    const remaining = useMemo(
      () => omit(propsToRemove, props),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [props, ...propsToRemove],
    );

    return (
      <Component {...remaining as any} />
    );
  };

  return ExtractedComponent;
};
