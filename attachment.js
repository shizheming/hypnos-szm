// 主体，客体，依附关系，不是简单的联动，主客体更好理解


export const attachment = function (fn) {
    // 联动是平级的，不能很好的体现前后的依附关系，就是说，联动是n个同等重要的事情的联动，而这里我理解为附加的，就比方说我外门之前拉了一泡屎，这泡屎这是附带的，并不是主要的，
    // 我现在这样理解，出发点是做事情，这个无非分清楚主要事情和次要事情，可以理解为次要事情是顺带事情，事情的重要程度划分好了，主逻辑是重要的，次逻辑是次要的，第一维度重要次要分完了，接着是第二维度的分，按照事情服务于谁来分
    // let as = _.linkage(this.return_type_change, this.hhh);

    /* this.return_type_change.attachment = [
        this.hhh
    ]; */
    if (!fn.attachment) return fn;
    return function (...arg) {
        const result = fn.apply(this, arg);

        fn.attachment.forEach((current) => {
            current.call(this, result);
        });
        return result;
    };
}