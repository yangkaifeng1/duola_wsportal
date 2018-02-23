AppGlobal = {
    getDataByPath: function (obj, paths) {
        var fn = function (path) {
            var res = obj;
            path.split('.').forEach(function (p) {
                res = (res || {})[p];
            });
            return res;
        };
        if (arguments.length === 1 && (typeof obj === 'string' || obj instanceof Array)) {
            paths = obj;
            obj = __global__;
        }

        if (!paths || !paths.length) {
            throw new Error('DoraNamespace.getDataByPath', 'paths can not be empty.');
        }

        if (typeof paths === 'string') {
            return fn(paths);
        }

        return paths.map(function (path) {
            return fn(path);
        });
    },
}