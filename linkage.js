/* eslint-disable no-console */
/*
    联动
    ❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤函数与函数两者之间的间断性和连续性（运动）函数本身调用的运动没有意义❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤
    概念：
    连着动
    占时不考虑间断性
    参数是一个接着一个传递下去的，联动嘛
*/

/* 
用法
export const data = [
  {
    name: 'setOrderQuantity',
    relationship: [
      {
        name: 'ladderPrice',
        relationship: {
          name: 'setUnitPurchasePrice',
          relationship: [
            {
              name: 'set_adjust_mount'
            },
            {
              name: 'set_shop_selling_price'
            }
          ]
        }
      },
      {
        name: 'setPurchaseAmount'
      },
      {
        name: 'needCalculatedPrice'
      }
    ]
  }
];
*/

import { isPlainObject, isArray, isString, zipObject } from "lodash";
export const linkage = function (first, ...fn) {
  fn.push(() => {});
  const arrFn = function (v) {
    return isArray(v) ? v : [v];
  };

  return function (...args) {
    const result = fn.reduce(
      (a, b) => {
        const r = arrFn(a.back);

        return {
          name: a.f.name,
          back: a.f.apply(this, r),
          f: b,
        };
      },
      {
        name: undefined,
        back: args,
        f: first,
      }
    );

    return result;
  };
};

export const linkageRelationship = function (relationshipTable, obj) {
  //我现在就是要把传进来的方法包一下重新丢出去用
  let allFn = [];
  let fn = relationshipTable.map((current) => {
    return flatRelationship(current);
  });
  let titleKey = [];

  fn.forEach((current) => {
    titleKey.push(current[0]);
    let arrStr = [];

    current.forEach((item) => {
      let s = item.split(".");

      if (s.length == 1) {
        arrStr.push(obj[item]);
      } else {
        let fn = findObjFn(obj[s[0]], item);

        arrStr.push(fn);
      }
    });
    allFn.push(linkage(...arrStr));
  });
  return zipObject(titleKey, allFn);
};

function findObjFn(o, str) {
  let father;
  let s = str.split(".");

  s.shift();
  s.forEach((current) => {
    father = o;
    o = o[current];
  });
  return o.bind(father);
}

function flatRelationship(current) {
  const { relationship } = current;
  const result = [];

  result.push(current.name);
  if (isString(relationship)) {
    // 说明已经到底了
    result.push(relationship);
  } else if (isPlainObject(relationship)) {
    // 是对象说明是唯一得一条路往下联系
    result.push(...flatRelationship(relationship));
  } else if (isArray(relationship)) {
    // 是数组说明是分岔路
    relationship.forEach((item) => {
      result.push(...flatRelationship(item));
    });
  }
  return result;
}
