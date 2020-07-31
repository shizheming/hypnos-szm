/*
    数学计算
 */

// 加法
export const accAdd = function (arg1, arg2) {
    var r1, r2, m;

    try {
        r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (_.accMul(arg1, m) + _.accMul(arg2, m)) / m;
};

// 减法
export const accSubtr = function (arg1, arg2) {
    var r1, r2, m, n;

    try { r1 = arg1.toString().split('.')[1].length; } catch (e) { r1 = 0; }
    try { r2 = arg2.toString().split('.')[1].length; } catch (e) { r2 = 0; }
    m = Math.pow(10, Math.max(r1, r2));
    // 动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    // .toFixed(n)
    return ((arg1 * m - arg2 * m) / m);
};

// 乘法
export const accMul = function (arg1 = 0, arg2) {
    var m = 0;
    var s1 = arg1.toString();
    var s2 = arg2.toString();

    try {
        m += s1.split('.')[1].length;
    } catch (e) {}
    try {
        m += s2.split('.')[1].length;
    } catch (e) {}
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
};