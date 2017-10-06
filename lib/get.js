/**
 * @module get.
 *
 * @flow
 * @param {Object} object
 * @param {string | RegExp | Array<string | RegExp>} paths
 * @param {Object} opts TODO better type
 * @return {mixed[]}
 */

const _getKeys = ({crntObject, crntPath}) => {
  if (typeof crntPath === 'string' || crntPath instanceof String) {
    return crntObject.hasOwnProperty(crntPath) ? [crntPath] : [];
  } else { // `crntPath instanceof RegExp`
    return Object.keys(crntObject).reduce((memo, k) =>
      // flow-disable-next-line Flow thinks crntPath might be a string despite our check in if()
      crntPath.test(k) ? memo.concat(k) : memo, []);
  }
};

/*:: export type ObjectT = Object; */
/*:: export type PathsT = string | RegExp | Array<string | RegExp>; */
/*:: export type OptsT = { keepKeys?: bool }; */
const get = (object/*: ObjectT */, paths/*: PathsT */, opts/*: OptsT */= {}) => {
  const iter = (crntObjects, crntPaths) => {
    if (!crntPaths.length) return crntObjects;
    const [crntPath, ...nextPaths] = crntPaths;
    const nextObjects = crntObjects.reduce((mainMemo, crntObject) => {
      if (!(typeof crntObject === 'object' && crntObject !== null)) return mainMemo;
      const keys = _getKeys({crntObject, crntPath});
      keys.forEach((key) => {
        opts.keepKeys
          ? mainMemo.push({[key]: crntObject[key]})
          : mainMemo.push(crntObject[key]);
      });
      return mainMemo;
    }, []);
    return iter(nextObjects, nextPaths);
  };
  return iter([object], Array.isArray(paths) ? paths : [paths]);
};

module.exports = get;
