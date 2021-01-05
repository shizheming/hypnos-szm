/*
    关系
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

*/
import {isArray, isString, isPlainObject, last, flattenDeep, uniq, compact, difference} from 'lodash';
import compose from './compose';
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

let s = relationship([
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
function relationship (table, obj) {
    // 我又思考了下，既然逻辑思维我不擅长，那么我就把他变得扁平再去操作，而且是反向操作，因为倒叙得线只有一条，正序得路线会有好几条，会分叉，试试
    const result = table.map((current, idx) => {
        // 1打点扁平
        const flat = flatRelationship(current);

        console.log(flat, 1);
        // 2按层级分组
        let flatArr = [];

        flat.forEach((current, index, collection) => {
            const {father, name} = current.nameObj;
            // 如果当前得father和上一个father不一样就说明不在一层，那么就需要一个新得数据容器装在当前层得东西

            if (index == 0) {
                // 这肯定是顶层得么，所以穿件新数组得同时把当前插进去
                flatArr.push([current]);
            } else if (father === collection[index - 1].nameObj.father) {
                // 这个判断下来是同一层得，所以直接找到最后一个数组往里面插就好了
                last(flatArr).push(current);
            } else if (father !== collection[index - 1].nameObj.father) {
                // 这个就是当前和上个不是同一层，所以创建新数组同时插件去
                flatArr.push([current]);
            }
        });
        // 3倒叙数组，这是关键，应为只有倒过来了，才能保证循环得时候是唯一得道路
        flatArr = flatArr.reverse();
        console.log(flatArr, 3);
        // 4循环出结果一股脑全部撸出来
        const result = [];

        flatArr.forEach((current, index, collection) => {
            current.forEach(item => {
                // 首先把自己插进去
                const line = [item];

                let father = item.nameObj.father;

                // 然后呢我要沿着他个父亲往下找，一直找到祖宗
                const length = collection.length;

                let idx = index;

                for (let i = 0; i < length && idx < length; i++) {
                    const [findFather] = collection[idx].filter(cur => {
                        // 找到里面和father一样得东西，就能确定是他的父亲
                        return cur.nameObj.name === father;
                    });
                        // 首先要判断一下找没找到，有可能有，有可能没有，以为我是一股脑撸得

                    if (findFather) {
                        line.push(findFather);
                        // 循环得时候collection[idx]这个是变得，因为是一层层往下找，同时father也是、在变得
                        father = findFather.nameObj.father;
                    }
                    idx++;
                }
                if (line.length) {
                    result.push(line);
                }
            });
        });
        console.log(result, 4);
        return result;
    });
    // 5最后过把中间的点过滤掉，就是不是开端的点，成为中间的点
    // 把开端的name都拿出来，下面需要对比

    const allFirstName = [...new Set(result.map(current => {
        return current.map(([item]) => {
            return item.name;
        });
    }).flat())];

    const firstName = compose(compact, uniq, flattenDeep)(flattenDeep(result).map(({nameObj: {father}}) => father));
    const lastName = difference(allFirstName, firstName);

    const lastResult = result.map(current => {
        return current.filter(([item]) => {
            return lastName.includes(item.name);
        }).map(current => {
            return current.map(({name}) => name);
        });
    });

    console.log(lastResult, 5);
    return lastResult;
}
function flatRelationship (current) {
    const {name, relationship, nameObj = {}} = current;
    const result = [];
    // name是当前自己

    current.nameObj = {
        father: nameObj.father,
        name
    };
    result.push(current);
    if (isString(relationship)) {
        // 说明已经到底了
        result.push({
            name: relationship,
            nameObj: {
                father: name,
                name: relationship
            }
        });
    } else if (isPlainObject(relationship)) {
        // 是对象说明是唯一得一条路往下联系
        relationship.nameObj = {
            father: name
        };
        result.push(...flatRelationship(relationship));
    } else if (isArray(relationship)) {
        // 是数组说明是分岔路
        relationship.forEach(item => {
            item.nameObj = {
                father: name
            };
            result.push(...flatRelationship(item));
        });
    }
    return result;
}
export default relationship;