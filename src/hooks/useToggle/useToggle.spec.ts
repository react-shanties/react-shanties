import test from 'jest-gwt';
import type { RenderHookResult } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react';

import type { Toggle } from './useToggle';
import useToggle from './useToggle';

describe('hooks > useToggle', () => {
  test('defaults to false', {
    given: {
      NO_default_value,
    },
    when: {
      using_hook,
    },
    then: {
      value_is_FALSE,
    },
  });

  test('uses default value', {
    given: {
      default_value_is_TRUE,
    },
    when: {
      using_hook,
    },
    then: {
      value_is_TRUE,
    },
  });

  test('toggles to FALSE', {
    given: {
      default_value_is_TRUE,
    },
    when: {
      using_hook,
      toggling_value,
    },
    then: {
      value_is_FALSE,
    },
  });

  test('toggles to TRUE', {
    given: {
      default_value_is_FALSE,
    },
    when: {
      using_hook,
      toggling_value,
    },
    then: {
      value_is_TRUE,
    },
  });

  test('force ON', {
    given: {
      default_value_is_FALSE,
    },
    when: {
      using_hook,
      forcing_ON,
    },
    then: {
      value_is_TRUE,
    },
  });

  test('force OFF', {
    given: {
      default_value_is_TRUE,
    },
    when: {
      using_hook,
      forcing_OFF,
    },
    then: {
      value_is_FALSE,
    },
  });
});

type Context = {
  default_value: boolean | undefined,
  hook: RenderHookResult<Toggle, never>['result'],
};

function default_value_is_TRUE(this: Context) {
  this.default_value = true;
}

function default_value_is_FALSE(this: Context) {
  this.default_value = false;
}

function using_hook(this: Context) {
  const { result } = renderHook(() => (
    useToggle(this.default_value)
  ));

  this.hook = result;
}

function toggling_value(this: Context) {
  act(() => {
    this.hook.current[1]();
  });
}

function forcing_ON(this: Context) {
  act(() => {
    this.hook.current[2].setOn();
  });
}

function forcing_OFF(this: Context) {
  act(() => {
    this.hook.current[2].setOff();
  });
}

function NO_default_value(this: Context) {
  this.default_value = undefined;
}

function value_is_FALSE(this: Context) {
  expect(this.hook.current[0]).toBe(false);
}

function value_is_TRUE(this: Context) {
  expect(this.hook.current[0]).toBe(true);
}
