/**
 * Created by jhonyoung on 2017/3/8.
 * Promiseify async method
 */
import _ from 'lodash';
import {HTTP} from 'meteor/http';
let Promseify = function (fn, ctx) {
	return function (...args) {
		let last = _.last(args);
		if (_.isFunction(last)) {
			return fn.call(ctx, ...args);
		}
		return new Promise(function (resolve, reject) {
			args.push(function (err, res) {
				if (err) {
					return reject(err);
				}
				resolve(res);
			});
			return fn.call(ctx, ...args);
		});
	};
};
HTTP.callPromiseify = Promseify(HTTP.call, HTTP);
_.extend(Promseify, {
	HTTPpromise: (type, url, data, query = {debug: 1}) => {
		// 赋值前应当先声明，以免创建全局变量
		let promise;
		return promise = new Promise((resolve, reject) => {
			let res = HTTP.call(type, url, data, function (err, res) {
				if (res) {
					resolve(res);
				} else {
					reject(err);
				}
			});
		});
	}
});

export default Promseify;