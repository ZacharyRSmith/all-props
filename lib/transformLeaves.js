/**
 * @module transformLeaves.
 *
 * @flow
 */
const get = require('./get');

const _getKeys = ({crntObject, crntPath}) => {
  if (typeof crntPath === 'string' || crntPath instanceof String) {
    return crntObject.hasOwnProperty(crntPath) ? [crntPath] : [];
  } else { // `crntPath instanceof RegExp`
    return Object.keys(crntObject).reduce((memo, k) => {
      return crntPath.test(k) ? memo.concat(k) : memo;
    }, []);
  }
};

const transformLeaves = (tree, paths, transformersIn = []) => {
  const transformers = Array.isArray(transformersIn) ? transformersIn : [transformersIn];
  const iter = (crntTrees, crntNode) => {
    // travel down to new bases
    const {base=[], branches=[], leaves=[]} = crntNode;
    const newBases = crntTrees.reduce((memo, crntTree) =>
      memo.concat(get(crntTree, base)), []);
    // transform leaves
    newBases.map((newBase) => {
      leaves.forEach((leaf) => {
        const keys = _getKeys({crntObject: newBase, crntPath: leaf});
        keys.forEach((key) => {
          const leafVal = newBase[key];
          if (typeof leafVal === 'undefined') return;
          newBase[key] = transformers.reduce((memo, transformer) =>
            transformer(memo), newBase[key]);
        });
      });
    });
    // iter on branches
    branches.forEach((branch) => {
      iter(newBases, branch);
    });
  };

  iter([tree], paths);
};

module.exports = transformLeaves;
