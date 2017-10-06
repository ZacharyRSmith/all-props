const get = require('./get');

test('getting all array elements', () => {
  const object = {
    decoyAry: [
      {
        innerAry: [
          {
            bat: 'man'
          }
        ]
      }
    ],
    outterAry: [
      {
        decoyAry: [
          {
            spider: 'man'
          }
        ],
        innerAry: [
          {
            foo: 'bar'
          },
          {
            foo: 'baz'
          }
        ]
      },
      {
        innerAry: [
          {
            hello: 'world'
          },
          {
            hello: 'computer'
          }
        ]
      }
    ]
  };

  const props = get(object, ['outterAry', /.*/, 'innerAry', /.*/]);

  expect(props).toEqual([{foo: 'bar'}, {foo: 'baz'}, {hello: 'world'}, {hello: 'computer'}]);
});

describe('getting specific object properties', () => {
  const user = {
    email: 'johndoe@example.com',
    firstName: 'John',
    lastName: 'Doe'
  };
  const paths = /name/i;

  test('when @opts.keepKeys is true', () => {
    const opts = {keepKeys: true};

    const props = get(user, paths, opts);

    expect(props).toEqual([{firstName: 'John'}, {lastName: 'Doe'}]);
  });

  test('when @opts.keepKeys is not true', () => {
    const props = get(user, paths);

    expect(props).toEqual(['John', 'Doe']);
  });
});
