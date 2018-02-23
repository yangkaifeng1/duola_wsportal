import cors from 'cors';
import {_} from 'meteor/underscore';
import {check, Match} from 'meteor/check';

export default function registerCORS (origins, callback) {
    let result = {};
    origins && _.each(origins, function (urls, prop) {
        if (!urls || !urls.length) {
            return;
        }

        callback && callback(urls, prop);
        if (Match.test(urls, String)) {
            result[prop] = urls;
            return;
        }

        let regexArr = [], hasProto = [], hasNoProto = [];
        urls.forEach(function (url) {
            if (!url) {
                return;
            }
            if (_.isString(url)) {
                url = url.replace(/\/$/, '');
                if (/^https?:\/\//.test(url)) {
                    hasProto.push(url);
                } else {
                    hasNoProto.push(url.replace(/^(\/\/)?/, ''));
                }
            } else {
                regexArr.push(new RegExp(url.regex, url.options));
            }
        });
        result[prop] = function (origin, callback) {
            let flag = (hasProto.length && _.contains(hasProto, origin))
                       || (hasNoProto.length && hasNoProto.some(url =>
                           url === origin && origin.replace && origin.replace(/^https?:\/\//, '')))
                       || (regexArr.length && regexArr.some(reg => reg.test(origin)));
            callback(null, flag);
        };
    });
    return cors(result);
};
