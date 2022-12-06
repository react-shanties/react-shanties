import React, {
  useMemo,
} from 'react';
import { omit } from 'lodash/fp';

export type OmittedPropsComponent<TProps> = React.ForwardRefExoticComponent<
React.PropsWithoutRef<TProps> & React.RefAttributes<unknown>
>;

export default <
  TProps extends object
>(
  propsToRemove: Array<keyof TProps>,
  Component: React.ComponentType<TProps>,
): OmittedPropsComponent<TProps> => {
  // eslint-disable-next-line react/display-name -- ref
  const ExtractedComponent = React.forwardRef((props: TProps, ref) => {
    const remaining = useMemo(
      () => omit(propsToRemove, props),
      // eslint-disable-next-line react-hooks/exhaustive-deps -- provided props
      [props, ...propsToRemove],
    );

    return (
      <Component {...remaining as any} ref={ref} />
    );
  });

  return ExtractedComponent;
};
