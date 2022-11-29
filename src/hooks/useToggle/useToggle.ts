import {
  useMemo,
  useReducer,
} from 'react';
import { isUndefined } from 'lodash/fp';
import type { Reducer } from 'react';
import useCurry from '../useCurry';

export type Toggle = [
  value: boolean,
  toggle: (forceValue?: boolean) => void,
  setters: {
    setOn: () => void,
    setOff: () => void,
  },
];

export default (defaultValue: boolean = false): Toggle => {
  const [value, setValue] = useReducer<Reducer<boolean, boolean | undefined>>(
    (currentValue: boolean, forceValue?: boolean) => (
      isUndefined(forceValue)
        ? !currentValue
        : forceValue
    ),
    defaultValue,
  );

  const setOn = useCurry(setValue, true);
  const setOff = useCurry(setValue, false);

  return useMemo(
    () => [
      value,
      setValue,
      {
        setOn,
        setOff,
      },
    ],
    [setOff, setOn, value],
  );
};
