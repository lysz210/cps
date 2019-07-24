const _ = require('lodash')

export default function createObjectPaths(srcObj) {
  if (!_.isObject(srcObj) || _.isEmpty(srcObj)) return []
  let mapper = (key, path) => {
    return _.isString(path) ? `${path}.${key}` : key
  }
  let src = _.keys(srcObj).map(key => mapper(key))
  let paths = []
  
  while (!_.isEmpty(src)) {
    let path = (src.shift())
    if (!_.isString(path)) continue
    let value = _.get(srcObj, path)
    if (!_.isObject(value)) {
      paths.push(path);
      continue;
    }
    let keys = _.keys(value)
    if (_.isEmpty(keys)) paths.push(path)
    else src.push(...keys.map(key => mapper(key, path)))
  }

  return paths
}

const _testCases = [
  {
    a: {
      b: {
        c: 'hello',
        d: [1, 2, {
          e: [
            {f: 'world'},
            {}
          ],
          g: []
        }]
      }
    }
  },
  
  "ciao mondo",
  
  1,
  
  null,
  
  [{a: 'hello'}],
  
  [{
    "": "ciao",
    " ": "mondo"
  }],
  
  {
    "": "a",
    " ": "b",
    "  ": "c",
    "   ": [{
      "": "ciao",
      " ": "mondo"
    }],
    "    ": {
      "": 'e'
    }
  }
]

export function test (...testCases) {
  console.log(testCases)
  if (_.isEmpty(testCases)) testCases = _.cloneDeep(_testCases)
  testCases.forEach((subject, index) => {
    console.log(`TEST ${index} type ${typeof(subject)}`)
    console.log(JSON.stringify(subject, null, 4))
    let paths = createObjectPaths(subject)
    console.log('allPaths:')
    console.log(JSON.stringify(paths, null, 4))
    console.log('CHECK WITH _.get')
    let checkObj = paths.reduce((container, p) => _.set(container, p, _.get(subject, p)), {})
    console.log(JSON.stringify(checkObj, null, 4))
  })
}
