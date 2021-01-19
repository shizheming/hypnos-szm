/* 
  逻辑可视化-概览
  以最基本的关系表为基础，把一些逻辑概念整合进去
  现在有
    联动
    判条件断
*/
/* 
  用法
  // 以联动为基础，扩展判断
let hhhhhh = [
  {
    be: 'linkage',
    name: 'a',
    relationship: [
      {
        be: 'judge',
        name: 'b',
        relationship: [
          {
            name: 'c'
          },
          {
            name: 'd'
          }
        ]
      },
      {
        be: 'linkage',
        name: 'e',
        relationship: {
          be: 'judge',
          name: 'ff',
          relationship: [
            {
              name: 'g'
            },
            {
              name: 'h'
            }
          ]
        }
      },
      {
        be: 'linkage',
        name: 'i',
        relationship: 'j'
      }
    ]
  }
];
*/
import {isPlainObject, isArray, isString} from 'lodash';

export const simpleLinkage = function (relationshipTable, obj, args) {
  let {relationship} = relationshipTable;

  // console.log(relationshipTable.name, 'simpleLinkage');
  let result = arrFn(obj[relationshipTable.name](args));

  if (isString(relationship)) {
    // 说明已经到底了
    obj[relationship]();
  } else if (isPlainObject(relationship)) {
    // 是对象说明是唯一得一条路往下联系

    return {
      be: 'going',
      relationship
    };
  } else if (isArray(relationship)) {
    // 是数组说明是分岔路
    return {
      be: 'going',
      relationship
    };
  }
};

export const simpleStrategy = function (relationshipTable, obj, arg) {
  // console.log(relationshipTable.name, 'judge');
  const {relationship} = relationshipTable;

  arg = arrFn(obj[relationshipTable.name](arg));
  if (isPlainObject(relationship)) {
    // 是对象说明是唯一得一条路往下联系
    return {
      be: 'going',
      relationship
    };
  } else if (isArray(relationship)) {
    let firstName = arg.shift();

    // 是数组说明是分岔路
    let [findObj] = relationship.filter(({name}) => name === firstName);

    // console.log(findObj, 'ccc');
    return {
      be: 'going',
      relationship: findObj
    };
  }
};

export const bing = function (table, obj) {
  table.forEach(current => {
    r(current, obj);
  });
};

function r (current, obj) {
  let result;

  if (current.be === 'linkage') {
    result = simpleLinkage(current, obj);
  } else if (current.be === 'judge') {
    result = simpleStrategy(current, obj);
  }

  if (result && result.be === 'going') {
    if (isArray(result.relationship)) {
      result.relationship.forEach(item => {
        r(item, obj);
      });
    } else if (isPlainObject(result.relationship)) {
      if (!result.relationship.be) {
        obj[result.relationship.name]();
      }
      r(result.relationship, obj);
    }
  } else {
    return result;
  }
}

const arrFn = function (v) {
  return isArray(v) ? v : [v];
};