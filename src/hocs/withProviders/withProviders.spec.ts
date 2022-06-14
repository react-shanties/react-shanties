import test, { withAspect } from 'jest-gwt';
import { mocked } from 'jest-mock';
import { createElement } from 'react';
import type { FC, ReactElement } from 'react';

import type { ComponentDefinition, ProviderList } from './withProviders';
import withProviders, { composeComponents } from './withProviders';

jest.mock('react');
const mock_createElement = mocked(createElement);

describe('with providers', () => {
  withAspect(
    mock_components,
  );

  test('returns null if no components provided', {
    given: {
      no_providers,
    },
    when: {
      composing_components_with_providers,
    },
    then: {
      NULL_is_returned,
    },
  });

  test('props are passed to component', {
    given: {
      components_with_props,
    },
    when: {
      composing_components_with_providers,
    },
    then: {
      component_is_created_with_props,
    },
  });

  test('builds provider tree with children', {
    given: {
      multiple_components,
    },
    when: {
      composing_components_with_providers,
    },
    then: {
      provider_has_children,
    },
  });

  test('is curried with the root component', {
    given: {
      components_with_props,
      app_component,
    },
    when: {
      wrapping_app_with_providers,
    },
    then: {
      app_is_last_child,
      app_has_props,
    },
  });
});

type P = {};

type Context = {
  app: ComponentDefinition<P>,
  app_props: P,
  components: ProviderList,

  result: ReactElement | FC<P> | null,
  PseudoComponent: FC<P>,
};

const mock_components_map = {
  AppComponent: () => null,
  RootComponent: () => null,
  ChildComponent: () => null,
} as { [index: string]: FC<void> };

function mock_components(this: Context) {
  mock_createElement.mockImplementation(((n: string) => mock_components_map[n]) as any);
}

function no_providers(this: Context) {
  this.components = [];
}

function components_with_props(this: Context) {
  this.components = [
    ['RootComponent', { prop1: 'value', prop2: 12 }],
  ];
}

function multiple_components(this: Context) {
  this.components = [
    'RootComponent',
    'ChildComponent',
  ];
}

function app_component(this: Context) {
  this.app = 'AppComponent';
}

function composing_components_with_providers(this: Context) {
  this.result = composeComponents(this.components);
}

function wrapping_app_with_providers(this: Context) {
  this.PseudoComponent = withProviders(
    this.components,
    this.app,
  );

  this.app_props = {};
  this.result = this.PseudoComponent(this.app_props);
}

function NULL_is_returned(this: Context) {
  expect(this.result).toBeNull();
}

function component_is_created_with_props(this: Context) {
  expect(mock_createElement).toHaveBeenCalledTimes(1);
  expect(mock_createElement.mock.calls[0][0]).toBe('RootComponent');
  expect(mock_createElement.mock.calls[0][1]).toEqual({ prop1: 'value', prop2: 12 });
}

function provider_has_children(this: Context) {
  expect(mock_createElement).toHaveBeenCalledTimes(2);
  expect(mock_createElement.mock.calls[1][0]).toBe('RootComponent');
  expect(mock_createElement.mock.calls[1][2]).toBe(mock_components_map.ChildComponent);
}

function app_is_last_child(this: Context) {
  expect(mock_createElement.mock.calls[0][0]).toBe('AppComponent');
  // 1 since recursion means the last component is first
  expect(mock_createElement.mock.calls[1][2]).toBe(mock_components_map.AppComponent);
}

function app_has_props(this: Context) {
  expect(mock_createElement.mock.calls[0][1]).toBe(this.app_props);
}
