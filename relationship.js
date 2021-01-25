/*
  逻辑可视化-概览
  以最基本的关系表为基础，把一些逻辑概念整合进去
  现在有
    联动
    判条件断

    表单控件的状态
    1-显示
      1-1-可编辑
      1-2-不可编辑
    2-隐藏

    添加全局数据
*/
// 控件的状态几乎都是外部条件所决定的变化，很少有自己状态的变化，所以我先考虑前者

import { isPlainObject, isArray, isString ,forEach} from "lodash";


// 联动
const simpleLinkage = function(relationshipTable, obj, args) {
  let lastResult;
  const { relationship } = relationshipTable;
  const originalResult = obj[relationshipTable.name](...args)
  const result = arrFn(originalResult);
  relation.data[relationshipTable.name] = originalResult;
  if (isString(relationship)) {
    // 说明已经到底了
    lastResult = obj[relationship](...result);
    relation.data[relationship] = lastResult;
  } else if (isPlainObject(relationship)) {
    // 是对象说明是唯一得一条路往下联系
    addBe(relationship, relationshipTable);
    lastResult = r(relationship, obj, result);
  } else if (isArray(relationship)) {
    let arrResult = result;
    // 是数组说明是分岔路
    relationship.forEach((item) => {
      addBe(item, relationshipTable);
      arrResult = r(item, obj, arrResult);
    });
    lastResult = arrResult;
  }
  return arrFn(lastResult);
};

// 判断
const simpleStrategy = function(relationshipTable, obj, args) {
  let lastResult;
  const { relationship } = relationshipTable;
  const originalResult = obj[relationshipTable.name](...args)
  let result = arrFn(originalResult);
  relation.data[relationshipTable.name] = originalResult;
  if (isPlainObject(relationship)) {
    // 是对象说明是唯一得一条路往下联系
    addBe(relationship, relationshipTable);
    lastResult = r(relationship, obj, result);
  } else if (isArray(relationship)) {
    let arrResult = result;
    const firstName = [...result].shift();
    // 是数组说明是分岔路
    const findObj = relationship.filter(({ name }) => name === firstName);
    findObj.forEach((item) => {
      addBe(item, relationshipTable);
      arrResult = r(item, obj, arrResult);
    });
    lastResult = arrResult;
  }
  return arrFn(lastResult);
};

// 状态
const simpleState = function(relationshipTable, obj, args) {
  let lastResult;
  const { relationship } = relationshipTable;
  // 状态判断函数
  const originalResult = obj[relationshipTable.name](...args)
  let result = arrFn(originalResult);
  relation.data[relationshipTable.name] = originalResult;

  const firstName = result.shift();
  const [state] = relationship.filter(({ state }) => state === firstName);
  // 渲染组件
  let dom = obj[relationshipTable.component](
    displayState(state.state, ...result)
  );
  relation.data[relationshipTable.component] = dom;
  lastResult = r(state.relationship ? state.relationship : {}, obj, [dom]);
  return arrFn(lastResult);
};


function r(current, obj, args) {
  let result = args;
  
  
  if (current.be === "linkage") {
    result = simpleLinkage(current, obj, result);
  } else if (current.be === "judge") {
    result = simpleStrategy(current, obj, result);
  } else if (current.be === "state") {
    result = simpleState(current, obj, result);
  }
  return result;
}

// 没有写be就给他加上父级的be,同时要判断下面有没有realtionship，如果没有就不要加了
const addBe = function(current, parent) {
  if (!current.be) current.be = parent.be;
};
const arrFn = function(v) {
  return isArray(v) ? v : [v];
};

// 显示哪种状态
const displayState = function(state) {
  return {
    show: "show",
    hide: "hide",
    able: "able",
    disabled: "disabled",
  }[state];
};


// 合体
export const relation = function(table, obj, ...args) {
  forEach(obj,(value, key) => {
    relation.data[key] = undefined;
  })
  let result = args;
  table.forEach((current) => {
    result = r(current, obj, result);
    console.log(result,293)
  });
  console.log(result,301)
  return result
};
relation.data = {}
