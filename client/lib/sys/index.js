/**
 * Created by jhonyoung on 2017/3/8.
 * some system  function
 */
let Sys = {
	getDataByPath: function (obj, paths) {
		let fn = function (path) {
			let res = obj;
			path.split(".").forEach( function (p) {
				res = (res || {})[p];
			});
			return res;
		}

		if (arguments.length === 1 && (typeof obj === "string" || obj instanceof Array)) {
			paths = obj;
			obj = _global_;
		}

		if (!paths || !paths.length) {
		    throw new Error('getDataByPath: ', 'paths can not be empty.');
		}

		if (typeof paths === 'string') {
		    return fn(paths);
		}

		return paths.map(function (path) {
		    return fn(path);
		});
	}
}
export default Sys;