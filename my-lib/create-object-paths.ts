import _ from 'lodash'

function mapper (key: string, path: string|undefined = undefined): string {
  return _.isString(path) ? `${path}.${key}` : key
}

export default function createObjectPaths (srcObj) {
  if (!_.isObject(srcObj) || _.isEmpty(srcObj)) { return [] }
  const src: string[] = <Array<string>> _.keys(srcObj).map((key): string => mapper(key))
  const paths: string[] = []

  for (const path of src) {
    if (!_.isString(path)) { continue }
    const value = _.get(srcObj, path)
    if (!_.isObject(value)) {
      paths.push(path)
      continue
    }
    const keys = _.keys(value)
    if (_.isEmpty(keys)) { paths.push(path) } else { src.push(...keys.map(key => mapper(key, path))) }
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
            { f: 'world' },
            {}
          ],
          g: []
        }]
      }
    }
  },

  'ciao mondo',

  1,

  null,

  [{ a: 'hello' }],

  [{
    '': 'ciao',
    ' ': 'mondo'
  }],

  {
    '': 'a',
    ' ': 'b',
    '  ': 'c',
    '   ': [{
      '': 'ciao',
      ' ': 'mondo'
    }],
    '    ': {
      '': 'e'
    }
  }
]

export function test (...testCases) {
  console.log(testCases)
  if (_.isEmpty(testCases)) { testCases = _.cloneDeep(_testCases) }
  testCases.forEach((subject, index) => {
    console.log(`TEST ${index} type ${typeof (subject)}`)
    console.log(JSON.stringify(subject, null, 4))
    const paths = createObjectPaths(subject)
    console.log('allPaths:')
    console.log(JSON.stringify(paths, null, 4))
    console.log('CHECK WITH _.get')
    const checkObj = paths.reduce((container, p) => _.set(container, p, _.get(subject, p)), {})
    console.log(JSON.stringify(checkObj, null, 4))
  })
}
