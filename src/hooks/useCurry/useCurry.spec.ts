/** @jest-environment jsdom */
import test from 'jest-gwt';
import { renderHook } from '@testing-library/react';
import useCurry from './useCurry';

describe('hooks > useCurry', () => {
  test('curry one', {
    given: {
      fn,
    },
    scenario: {
      when_currying_with_ONE_argument,
      when_FINISHING_ONE_curried_fn,
      then_fn_is_called,
    },
  });

  test('curry many', {
    given: {
      fn,
    },
    scenario: {
      when_currying_with_MANY_arguments,
      when_FINISHING_MANY_curried_fn,
      then_fn_is_called,
    },
  });
});

type TestFn = (a: string, b: number, c: string) => string;

type Context = {
  fn: jest.Mock<ReturnType<TestFn>, Parameters<TestFn>>,
  ONE_curried_fn: (b: number, c: string) => string,
  MANY_curried_fn: (c: string) => string,
};

function fn(this: Context) {
  this.fn = jest.fn((a: string, b: number, c: string) => `${a} ${b} ${c}`);
}

function when_currying_with_ONE_argument(this: Context) {
  const { result } = renderHook(() => useCurry(this.fn, 'one'));

  this.ONE_curried_fn = result.current;
}

function when_FINISHING_ONE_curried_fn(this: Context) {
  this.ONE_curried_fn(2, 'three');
}

function when_currying_with_MANY_arguments(this: Context) {
  const { result } = renderHook(() => useCurry(this.fn, 'one', 2));

  this.MANY_curried_fn = result.current;
}

function when_FINISHING_MANY_curried_fn(this: Context) {
  this.MANY_curried_fn('three');
}

function then_fn_is_called(this: Context) {
  expect(this.fn).toHaveBeenCalledWith('one', 2, 'three');
}
