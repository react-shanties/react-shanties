/* eslint-disable import/no-dynamic-require,global-require */
import test from 'jest-gwt';
import fs from 'fs';
import path from 'path';
import {
  withKey,
} from 'moredash';
import {
  filter,
  flow,
  forEach,
  fromPairs,
  get,
  identity,
  map,
  pickBy,
  zip,
} from 'lodash/fp';

describe('index', () => {
  test('all hocs exported', {
    given: {
      modules: modules('hocs'),
    },
    when: {
      importing_react_shanties,
    },
    then: {
      all_modules_exported,
    },
  });

  test('all hooks exported', {
    given: {
      modules: modules('hooks'),
    },
    when: {
      importing_react_shanties,
    },
    then: {
      all_modules_exported,
    },
  });
});

type Context = {
  module_type: string,
  modules: { [function_name: string]: any },
  index: any,
};

function modules(moduleType: string) {
  return async function (this: Context) {
    this.module_type = moduleType;
    const modulePath = path.join(__dirname, moduleType);
    const files = fs.readdirSync(modulePath);

    const ms = filter(
      (fn: string) => fs.lstatSync(path.join(modulePath, fn)).isDirectory(),
      files,
    );
    const promises = map((fn: string) => require(`./${moduleType}/${fn}`), ms);
    const imported = map(
      get('default'),
      await Promise.all(promises),
    );

    this.modules = flow(
      zip(ms),
      fromPairs,
      pickBy(identity),
    )(imported);
  };
}

async function importing_react_shanties(this: Context) {
  this.index = await require('./index');
}

function all_modules_exported(this: Context) {
  withKey(forEach)(
    (fn: any, name: string) => {
      try {
        expect(this.index[name]).toBe(fn);
      } catch {
        throw new Error(`${this.module_type} ${name} was not exported`);
      }
    },
    this.modules,
  );
}
