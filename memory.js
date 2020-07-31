/*
    记忆：人的记忆就是一堆数据，那怎么记呢，人就像个永动机不停得将看到得听到得记录下来，然后页面得什么时候需要显示什么数据就去记忆当中拿，比如回显
*/
function delObjCompact (obj) {
    for (const key in obj) {
        if (!obj[key]) delete obj[key];
    }
    return obj;
}
export const memory = function (getfn/* 获取数据的方法，因为我要不停的获取数据然后存储 */) {
    let data = {};

    const time = setInterval(() => {
        data = {
            ...data,
            ...delObjCompact(getfn.call(this))
        };
    }, 1000);

    function setData (setfn) {
        setfn.call(this, data);
        // 这个确保操作再一秒之内获取数据，导致数据还没更新就使用
        setTimeout(() => {
            setfn.call(this, data);
        }, 1000);
    };
    setData.clear = function () {
        clearInterval(time);
        data = {};
    };
    return setData;
};