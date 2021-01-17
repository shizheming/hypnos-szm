/*
    策略关系
    ❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤函数与函数两者之间的关系❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤
    动态静态：（运动）
        1，添加关系
        2，删除关系
        3，替换关系
        4，查看关系
    核心就是：
        1，一对一
        2，一对多

    目的：
    目的就是我在写逻辑代码的时候，
    第一想把纯粹做事情的代码比如处理数据的代码和逻辑代码，比如判断逻辑的代码分开来，这样子的目的就是更好的可读性站在人理解的角度，同时也能换一种写法写代码，爽
    比如我打个比方，页面里面我写了一个关系表，通过这个关系表我就能知道页面的主要逻辑，这样能短时间聚焦再必要的东西上面
    第二就是依附的关系写法，目的是一个函数专注于干一件事情，其他的都是依附，比如打点

    今天发现我写的这个方法返回的line的线性的一列函数名，我在想如果是联动，本身写这个关系表的时候是一对多，然后我通过这个方法把一对多变成了一对一，完全不适合联动，联动本身就是一对多的，那我写这个方法的初衷是什么，我写了那么多代码不是白写了，
    其实呢我考虑这个表格的出发点就错了，这个只是个单纯的关系表，你不能把他看成只是联动的关系表，把关系表的形式层次提升，他可以是任何的关系表，不单是联动的关系表，我用这个方法把关系表切成一条一条的，那不就成了适用策略的关系表，对吧，把概念提高，更加具象，他就是另外一个意思了对吧，很牛逼把，所以关系表只是个最基本的概念，以后要写新的东西，就要有新的概念的关系表，表中代表的数据的意义就不一样了


*/
import { isArray, isString, isPlainObject, last, flattenDeep } from "lodash";
/* 
用法
function a () {
    alert('a');
}
function b () {
    alert('b');
}
function c () {
    alert('c');
}
function d () {
    alert('d');
}
function e () {
    alert('e');
}
function f () {
    alert('f');
}

let s = strategyRelationship([
    {
        name: 'a',
        relationship: {
            name: 'b',
            relationship: 'f'
        }
    },
    {
        name: 'b',
        relationship: 'f'
    },
    {
        name: 'c',
        relationship: [
            {
                name: 'f'
            },
            {
                name: 'a',
                relationship: {
                    name: 'b',
                    relationship: 'f'
                }
            }
        ]
    }
]);
console.log(s);
*/

export const strategyRelationship = function(table) {
  // 我又思考了下，既然逻辑思维我不擅长，那么我就把他变得扁平再去操作，而且是反向操作，因为倒叙得线只有一条，正序得路线会有好几条，会分叉，试试
  let result = table.map((current, idx) => {
    // 1打平数组
    const flat = flatRelationship(current);

    // console.log(flat, "打平数组");
    // 2按层级分组
    let flatArr = [];

    flat.forEach((current, index, collection) => {
      const { father } = current.nameObj;
      // 如果当前的father和上一个father不一样就说明不在一层，那么就需要一个新得数据容器装在当前层的东西

      if (index == 0) {
        // 这肯定是顶层的么，所以创建新数组的同时把当前插进去
        flatArr.push([current]);
      } else if (father === collection[index - 1].nameObj.father) {
        // 这个判断下来是同一层的，所以直接找到最后一个数组往里面插就好了，因为最后一个数组就是前一个和他平级的数组
        last(flatArr).push(current);
      } else {
        // 这个就是当前和上个不是同一层，所以创建新数组同时插件去
        flatArr.push([current]);
      }
    });
    // console.log(flatArr, "按层级分组");
    // 3倒叙数组，这是关键，应为只有倒过来了，才能保证循环得时候是唯一得道路
    flatArr = flatArr.reverse();
    // console.log(flatArr, "倒叙数组");
    // 4通过循环，把从一个点往上的所有父亲全部找到
    let result = [];

    flatArr.forEach((current, index, collection) => {
      current.forEach((item) => {
        // 首先把自己插进去
        const line = [item];

        let father = item.nameObj.father;

        // 然后呢我要沿着他个父亲往下找，一直找到祖宗
        // 长度说明有几层，那么就是我要循环几次
        const length = collection.length;

        for (let i = 0; i < length; i++) {
          let findFather = [];
          for (let y = 0; y < length; y++) {
            // 找父亲的时候整个当前数组全部要循环一次
            findFather.push(
              collection[y].filter((cur) => {
                // 找到里面和father一样得东西，就能确定是他的父亲
                return cur.nameObj.name === father;
              })
            );
          }
          // 处理下数组，把没找到父亲的空数据去掉
          findFather = flattenDeep(
            findFather.filter((current) => current.length)
          );
          // 首先要判断一下找没找到，有可能有，有可能没有，没有是应为本身是顶层嘛

          if (findFather.length) {
            findFather = findFather[0];
            line.push(findFather);
            // 循环的时候father这个是变的，因为是一层层往上找
            father = findFather.nameObj.father;
          }
        }

        if (line.length) {
          result.push(line);
        }
      });
    });
    // console.log(result, "把父亲连起来");

    // 5去掉顶层和中间层
    result = result.filter((current) => {
      let [
        {
          nameObj: { isSon },
        },
      ] = current;
      return current.length !== 1 && isSon === false;
    });

    // console.log(result, "去掉顶层和中间层");

    return result;
  });
  // 6反转数组同时输出name
  result = result.map((current) => {
    return current.map((item) => {
      return item.reverse().map((current) => current.name);
    });
  });
  // console.log(result, "反转数组同时输出name");
  return result;
};

function flatRelationship(current) {
  const { name, relationship, nameObj = {} } = current;
  const result = [];
  // name是当前自己

  current.nameObj = {
    father: nameObj.father,
    isSon: nameObj.isSon === undefined ? true : nameObj.isSon,
    name,
  };
  result.push(current);
  if (isString(relationship)) {
    // 说明已经到底了
    result.push({
      name: relationship,
      nameObj: {
        father: name,
        isSon: false,
        name: relationship,
      },
    });
  } else if (isPlainObject(relationship)) {
    // 是对象说明是唯一得一条路往下联系
    relationship.nameObj = {
      father: name,
      isSon: true,
    };
    result.push(...flatRelationship(relationship));
  } else if (isArray(relationship)) {
    // 是数组说明是分岔路
    relationship.forEach((item) => {
      item.nameObj = {
        father: name,
        isSon: item.relationship ? true : false,
      };
      result.push(...flatRelationship(item));
    });
  }
  return result;
}
