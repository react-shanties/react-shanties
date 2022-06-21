/** @jest-environment jsdom */
import test from 'jest-gwt';
import { renderHook } from '@testing-library/react';
import { identity } from 'lodash';
import useAction from './useAction';

const mocked_dispatch = jest.fn(identity);
jest.mock('react-redux', () => ({
  useDispatch: () => mocked_dispatch,
}));

describe('hooks > useAction', () => {
  test('curry one', {
    given: {
      action,
    },
    scenario: {
      when_currying_with_ONE_argument,
      when_FINISHING_ONE_curried_fn,
      then_fn_is_called,
      then_action_is_DISPATCHED,
      then_result_returned,
    },
  });

  test('curry many', {
    given: {
      action,
    },
    scenario: {
      when_currying_with_MANY_arguments,
      when_FINISHING_MANY_curried_fn,
      then_fn_is_called,
      then_action_is_DISPATCHED,
      then_result_returned,
    },
  });
});

type Action = {
  type: string,
  payload: string,
};

type TestFn = (a: string, b: number, c: string) => Action;

type Context = {
  action: jest.Mock<ReturnType<TestFn>, Parameters<TestFn>>,
  ONE_curried_fn: (b: number, c: string) => Action,
  MANY_curried_fn: (c: string) => Action,

  action_result: Action,
};

function action(this: Context) {
  this.action = jest.fn((a: string, b: number, c: string) => ({
    type: 'TEST',
    payload: `${a} ${b} ${c}`,
  }));
}

function when_currying_with_ONE_argument(this: Context) {
  const { result } = renderHook(() => useAction(this.action, 'one'));

  this.ONE_curried_fn = result.current;
}

function when_FINISHING_ONE_curried_fn(this: Context) {
  this.action_result = this.ONE_curried_fn(2, 'three');
}

function when_currying_with_MANY_arguments(this: Context) {
  const { result } = renderHook(() => useAction(this.action, 'one', 2));

  this.MANY_curried_fn = result.current;
}

function when_FINISHING_MANY_curried_fn(this: Context) {
  this.action_result = this.MANY_curried_fn('three');
}

function then_fn_is_called(this: Context) {
  expect(this.action).toHaveBeenCalledWith('one', 2, 'three');
}

function then_action_is_DISPATCHED(this: Context) {
  expect(mocked_dispatch).toHaveBeenCalledWith({
    type: 'TEST',
    payload: 'one 2 three',
  });
}

function then_result_returned(this: Context) {
  expect(this.action_result).toEqual({
    type: 'TEST',
    payload: 'one 2 three',
  });
}
