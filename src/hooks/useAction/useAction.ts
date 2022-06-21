import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

type CurriedArgs<Fn> = Fn extends (...args: any[]) => any
  ? Partial<Parameters<Fn>>
  : never;

type RemainingArgs<
Fn,
CArgs extends any[],
> = Fn extends (...args: [...CArgs, ...infer RArgs]) => any
  ? RArgs
  : never;

export default <
  Fn extends (...args: any[]) => any,
  R extends ReturnType<Fn>,
  CArgs extends CurriedArgs<Fn>,
  RArgs extends RemainingArgs<Fn, CArgs>,
>(fn: Fn, ...cargs: CArgs) => {
  const dispatch = useDispatch();

  return useCallback(
    (...rargs: RArgs): R => (
      dispatch(fn(...cargs, ...rargs))
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fn, ...cargs, dispatch],
  );
};
