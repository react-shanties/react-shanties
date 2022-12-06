/** @jest-environment jsdom */
import React from 'react';
import test from 'jest-gwt';
import type { ComponentType } from 'react';
import { render } from '@testing-library/react';

import type { OmittedPropsComponent } from './omitProps';
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

  test('forwards ref', {
    given: {
      properities_to_omit,
      component_properties,
      component_WITH_REF,
    },
    when: {
      omitting_properties_WITH_REF,
      rendering_component_WITH_REF,
    },
    then: {
      component_gets_forwarded_ref,
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
  Component: ComponentType<TProps>,
  RefComponent: OmittedPropsComponent<TProps> & { component_mock: jest.Mock },
  ref: React.MutableRefObject<any>,
  OmittedComponent: OmittedPropsComponent<TProps>
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

function component_WITH_REF(this: Context) {
  const component_mock = jest.fn();
  // eslint-disable-next-line react/display-name -- ref
  this.RefComponent = React.forwardRef((props, ref) => component_mock(props, ref)) as any;
  this.RefComponent.component_mock = component_mock;

  console.log(this.RefComponent.component_mock);
}

function omitting_properties(this: Context) {
  this.OmittedComponent = omitProps(this.omitted, this.Component);
}

function omitting_properties_WITH_REF(this: Context) {
  this.OmittedComponent = omitProps(this.omitted, this.RefComponent);
}

function rendering_component(this: Context) {
  const { OmittedComponent } = this;

  render(<OmittedComponent {...this.props} />);
}

function rendering_component_WITH_REF(this: Context) {
  const { OmittedComponent } = this;
  this.ref = React.createRef();

  render(<OmittedComponent {...this.props} ref={this.ref} />);
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

function component_gets_forwarded_ref(this: Context) {
  expect(this.RefComponent.component_mock).toHaveBeenCalledWith(
    expect.anything(),
    this.ref,
  );
}
