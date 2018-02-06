/* eslint-disable camelcase, new-cap */
/**
 * @flow
 */
const _ = require('lodash');
const mongoose = require('mongoose');

const transformLeaves = require('./transformLeaves');

const pizzazz = (str) => str + 'WOW';

test('when @paths and @transformers are not arrays', () => {
  const tree = {
    decoy: 'baz',
    foo: 'bar'
  };
  const paths = {
    base: [],
    branches: [],
    leaves: ['foo']
  };

  transformLeaves(tree, paths, pizzazz);

  expect(tree).toEqual({decoy: 'baz', foo: 'barWOW'});
});

test('when @tree is an array', () => {
  const tree = [{decoy: 'meh'}, {foo: 'bar'}];
  const paths = {leaves: ['1']};

  transformLeaves(tree, paths, () => 'WOW');

  expect(tree).toEqual([{decoy: 'meh'}, 'WOW']);
});

test('when @paths.base has a RegExp', () => {
  const tree = {
    decoy: {
      noKey: 'of interest',
      meh: {
        hi: 'u'
      }
    },
    key1: {
      foo: {
        decoy: 'meh',
        hi: 'u'
      }
    },
    key2: {
      foo: {
        hi: 'me'
      }
    }
  };
  const clone = _.cloneDeep(tree);
  const paths = {base: [/.*/, 'foo'], leaves: ['hi']};

  transformLeaves(tree, paths, pizzazz);

  expect(tree).toEqual(_.merge(clone, {key1: {foo: {hi: 'uWOW'}}, key2: {foo: {hi: 'meWOW'}}}));
});

test('when a base has a simple branch', () => {
  const tree = {
    value: {
      outterAry: [
        {
          inner: {
            foo: 'bar'
          }
        },
        {
          inner: {
            foo: 'bar'
          }
        }
      ]
    }
  };
  const paths = {base: 'value', branches: [{base: ['outterAry', /.*/, 'inner'], leaves: ['foo']}]};
  const expected = _.cloneDeep(tree);
  expected.value.outterAry.map((item) => {
    item.inner.foo = 'barWOW';
  });

  transformLeaves(tree, paths, pizzazz);


  expect(tree).toEqual(expected);
});

test('when @paths.leaves has a RegExp', () => {
  const user = {
    email: 'johndoe@example.com',
    firstName: 'John',
    lastName: 'Doe'
  };
  const paths = {leaves: [/name/i]};

  transformLeaves(user, paths, pizzazz);

  expect(user).toEqual(Object.assign(
    {},
    user,
    {
      firstName: 'JohnWOW',
      lastName: 'DoeWOW'
    }
  ));
});

test('when leaf on one base, but not another', () => {
  const tree = [
    {
      decoy: 'meh'
    },
    {
      foo: 'bar'
    }
  ];
  const paths = {
    base: [/.*/],
    branches: [],
    leaves: ['foo']
  };

  transformLeaves(tree, paths, pizzazz);

  expect(tree).toEqual([
    {
      decoy: 'meh'
    },
    {
      foo: 'barWOW'
    }
  ]);
});

test.skip('transforming all leaves, recursively', () => {
  const _id_1 = '4edd40c86762e0fb12000001';
  const _id_2 = '4edd40c86762e0fb12000002';
  const _id_3 = '4edd40c86762e0fb12000003';
  const tree = {
    _id: mongoose.Types.ObjectId(_id_1),
    outter: {
      _id: mongoose.Types.ObjectId(_id_2),
      inner: {
        _id: mongoose.Types.ObjectId(_id_3)
      }
    }
  };

  transformLeaves(tree, {leaves: [{matcher: /.*/, recursive: true}]}, String);

  expect(tree).toEqual({
    _id: _id_1,
    outter: {
      _id: _id_2,
      inner: {
        _id: _id_3
      }
    }
  });
});
