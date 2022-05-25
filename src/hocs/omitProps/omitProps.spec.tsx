/** @jest-environment jsdom */
import React from 'react';
import test from 'jest-gwt';
import type { FC } from 'react';
import { render } from '@testing-library/react';

import omitProps from './omitProps';

describe('with providers', () => {
  test('omits properties', {
    given: {
      properities_to_omit,
      component_properties,
      component,
    },
    when: {
      omitting_properties,
      rendering_component,
    },
    then: {
      omitted_properties_are_NOT_rendered,
      existing_properties_ARE_rendered,
    },
  });
});

type TProps = {
  one: string,
  two: number,
  three: string,
};

type Context = {
  omitted: Array<keyof TProps>,
  props: TProps,
  Component: FC<TProps>,
  OmittedComponent: FC<TProps>
};

function properities_to_omit(this: Context) {
  this.omitted = ['one'];
}

function component_properties(this: Context) {
  this.props = {
    one: 'cat',
    two: 2,
    three: 'three',
  };
}

function component(this: Context) {
  this.Component = jest.fn();
}

function omitting_properties(this: Context) {
  this.OmittedComponent = omitProps(this.omitted, this.Component);
}

function rendering_component(this: Context) {
  const { OmittedComponent } = this;

  render(<OmittedComponent {...this.props} />);
}

function omitted_properties_are_NOT_rendered(this: Context) {
  expect(this.Component).not.toHaveBeenCalledWith(
    expect.objectContaining({ one: expect.anything() }),
    expect.anything(),
  );
}

function existing_properties_ARE_rendered(this: Context) {
  expect(this.Component).toHaveBeenCalledWith(
    expect.objectContaining({
      two: 2,
      three: 'three',
    }),
    expect.anything(),
  );
}
