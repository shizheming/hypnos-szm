/* 
  策略关系表
  用法
  this.priceStrategy = strategyRelationship([
    {
      name: 'isLadderPrice',
      relationship: [
        {
          name: 'normalPrice'
        },
        {
          name: 'ladderPrice'
        }
      ]
    }
  ], obj);
*/
import { isPlainObject, isArray } from "lodash";
export const strategyRelationship = function (strategyRelationshipTable, obj) {
  return function (...args) {
    strategyRelationshipTable.forEach((current) => {
      recursive(current, obj, args);
    });
  };
};

function recursive(current, obj, arg) {
  const { relationship } = current;

  arg = arrFn(obj[current.name](...arg));
  if (isPlainObject(relationship)) {
    // 是对象说明是唯一得一条路往下联系
    recursive(relationship, obj, arg);
  } else if (isArray(relationship)) {
    let firstName = arg.shift();

    // 是数组说明是分岔路
    let [findObj] = relationship.filter(({ name }) => name === firstName);

    recursive(findObj, obj, arg);
  }
}

const arrFn = function (v) {
  return isArray(v) ? v : [v];
};
