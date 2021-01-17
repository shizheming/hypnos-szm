/*
    组合
    ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥函数与函数之间的组合关系♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
    组合函数，然后目的是什么呢？？？？
*/

/* 
用法
let fn = compose(function(a){},function(a){})(1,2,...)
*/
// 多个函数组合
export const compose = function (...args) {
  return function (...a) {
    var once = true;

    return args.reduceRight(function (res, cb) {
      var result;

      if (once) {
        once = false;
        result = cb.apply(null, res);
      } else {
        result = cb(res);
      }
      return result;
    }, a);
  };
};
