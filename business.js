/*
    业务层面的js
*/
import {forEach, isNumber, cloneDeep, isString} from 'lodash';
import {recursive} from './operation';
import {accMul} from './calculation';
import moment from 'moment';
// 处理时间戳和分，回显的时候，当后端接口返回后在promise外面包了一层来处理之间事情
// 都是被逼的，要是后端都愿意转，我何必再要干这件事情呢
// 处理时间戳和分，回显的时候和提交的时候
export const warpAPI = function (api) {
    forEach(api, function (value, key, c) {
        api[key] = function (data = {}) {
            // 这里是吐给后端的数据
            // 预处理
            if (data.format) {
                /*
                    {
                        format: {
                            time: ['a','b'],
                            money: ['e','k']
                        }
                    }
                 */
                const {time = [], money = []} = data.format;

                delete data.format;
                data = cloneDeep(data);

                recursive(data, function (value, key, collection) {
                    if (time.includes(key)) {
                        collection[key] = Math.floor(accMul(value, 0.001));
                    }
                    if (money.includes(key)) {
                        collection[key] = accMul(value, 100);
                    }
                });
            }
            return value(data).then(data => {
                // 这里是处理后端吐出来的数据
                // 预处理
                recursive(data, function (value, key, collection) {
                    // 处理时间戳
                    // 有的情况下
                    if (/^\d{10}$/.test(value)) collection['time_' + key] = moment(Number(value + '000')).format('YYYY-MM-DD HH:mm:ss');
                    // 是0没有的情况下
                    if (value === 0) collection['time_' + key] = '';
                    // 处理分转元
                    if ((isString(value) || isNumber(value)) && !Number.isNaN(Number(value))) collection['money_' + key] = accMul(value, 0.01);
                });
                return data;
            });
        };
    });
    return api;
}

export const warpModalSubmit = function (api, params) {
    return function ({success = function () {}, error = function () {}}) {
        this.confirmLoading = true;
        api(params).then(res => {
            success.call(this, res);
            this.$message.success('成功');
            setTimeout(() => {
                this.form && this.form.resetFields();
                this.$refs.formRender && this.$refs.formRender.form.resetFields();
                this.confirmLoading = false;
                this.visible = false;
            }, 1500);
        }).catch(res => {
            error.call(this, res);
            this.confirmLoading = false;
        });
    };
};