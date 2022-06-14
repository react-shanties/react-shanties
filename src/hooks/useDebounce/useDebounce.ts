/* eslint-disable react-hooks/exhaustive-deps */
import { debounce } from 'lodash/fp';
import { useMemo } from 'react';

export default (
  fn: (...args: any[]) => any,
  deps: any[],
  millis: number,
) => useMemo(
  () => debounce(millis, fn),
  [...deps, millis],
);
