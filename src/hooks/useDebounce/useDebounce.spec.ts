import test, {
  withAspect,
} from 'jest-gwt';
import type { RenderHookResult } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { DebouncedFunc } from 'lodash';
import useDebounce from './useDebounce';

describe('hooks > usecategory', () => {
  withAspect(
    function () {
      jest.useFakeTimers();
    },
    function () {
      jest.useRealTimers();
    },
  );

  test('executes callback', {
    given: {
      callback,
      dependencies,
    },
    scenario: {
      when_using_hook,
      when_executing_debounced_callback,
      when_debounce_expires,
      then_callback_invoked,
    },
  });

  test('debounces callback', {
    given: {
      callback,
      dependencies,
    },
    scenario: {
      when_using_hook,
      when_executing_debounced_callback,
      then_callback_NOT_invoked,
      when_executing_debounced_callback_AGAIN,
      when_debounce_expires,
      then_callback_NOT_invoked_with_FIRST_arguments,
      then_callback_invoked_with_LAST_arguments,
    },
  });
});

type Context = {
  callback: jest.Mock,
  deps: any[],
  hook: RenderHookResult<DebouncedFunc<jest.Mock>, never>['result'],

  result: Promise<any>,
};

function callback(this: Context) {
  this.callback = jest.fn(() => Symbol.for('result'));
}

function dependencies(this: Context) {
  this.deps = [1, 'cat', {}];
}

function when_using_hook(this: Context) {
  const { result } = renderHook(() => (
    useDebounce(
      this.callback,
      this.deps,
      10,
    )
  ));

  this.hook = result;
}

function when_executing_debounced_callback(this: Context) {
  this.result = this.hook.current('args', 2);
}

function when_executing_debounced_callback_AGAIN(this: Context) {
  jest.advanceTimersByTime(5);

  this.result = this.hook.current('last', 3);
}

function when_debounce_expires(this: Context) {
  jest.advanceTimersByTime(10);
}

function then_callback_NOT_invoked(this: Context) {
  expect(this.callback).not.toHaveBeenCalled();
}

function then_callback_invoked(this: Context) {
  expect(this.callback).toHaveBeenCalledWith('args', 2);
}

function then_callback_invoked_with_LAST_arguments(this: Context) {
  expect(this.callback).toHaveBeenCalledWith('last', 3);
}

function then_callback_NOT_invoked_with_FIRST_arguments(this: Context) {
  expect(this.callback).not.toHaveBeenCalledWith('args', 2);
}
