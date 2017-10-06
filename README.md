# All Props

Utils for all props matching @paths

# Installation
```sh
$ npm install all-props
```

# Usage
```javascript
const allProps = require('all-props');

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

expect(props).toEqual([{foo: 'bar'}, {foo: 'baz'}, {hello: 'world'}, {hello: 'computer'}]); // true
```
