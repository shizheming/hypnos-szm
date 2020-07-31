/*
    状态
    我自己内心有的状态我才能调整状态
    惰性函数，单列函数，一次函数，这些都能算状态的，这么说其实也没有什么不对，你可以认为是函数的状态，可以变惰性，可以变单列，可以变一次，所以我可以把这些写在状态里面，本来就是函数对象的状态，可我说的不是内容，而是状态的架子
    就是状态是内部有的，比如我可以很狂躁，我可以很安静，我可以很贱，我可以很坏，我有的我才能变
    状态的改变是什么，我觉得就是变化不同的属性和方法，对象这个时候拥有这些属性和方法，那个时候拥有那些属性和方法，

    例如移上去一个浮层，第一次需要请求接口拿数据，后面就不需要请求接口了，因为数据已经拿过了，状态就变了。我想想合once的区别

    我现在是这样认为得，状态得变化是内部的，这无可厚非，但是状态得改变有2种条件，一种是自主变化，就像我状态不好我会自己调节，不需要条件，另一种情况就是需要外部条件，然后变化状态，这个倒和策略有点像，上面那个例子就是自身的变化

*/
import {attachment} from './attachment'
// 1.外部条件引发的内部状态改变
export const warpState = function (stateCollection) {
    // 初始状态，状态对象第一个
    var keys = Object.keys(stateCollection);
    var currentSate = stateCollection[keys[0]];

    function state () {
        return currentSate.apply(this, arguments);
    }
    state.change = function (key) {
        currentSate = stateCollection[key];
        state.state = key;
    };
    state.getState = function (key) {
        return state.state
    };
    return state;
};

export const baseState = function (stateCollection) {
    const newState = warpState(stateCollection);
    
    return function s (...args) {
      let result = newState.apply(this, args);
  
      return s.base(result);
    };
  };

// 2.第一次运行完后就出发的内部状态改变
export const onceState = function (stateCollection) {
    // 初始状态，状态对象第一个
    const keys = Object.keys(stateCollection);

    let currentSate = stateCollection[keys[0]];

    return function (...args) {
        currentSate.apply(this, args);
        currentSate = stateCollection[keys[1]];
        return currentSate;
    };
};

// 3.内部运行change，当策略来用
// 这是最简单的策略，
// 这里有个问题，就是我的目的就是逻辑更加的清晰，那么我写个if-else清晰还是策略清晰，我是说就很简短的一个判断，并不是有很多策略能选，多的情况坑定是选策略，我先搞清楚，策略并不是侏罗纪，策略不能代替侏罗纪，
export const strategy = function (strategy) {
    const state = warpState(strategy);

    return function (str, ...args) {
        state.change(str);
        return state.apply(this, args);
    };
};