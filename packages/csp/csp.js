let _BrowserPolicy = BrowserPolicy;

export default function registerCSP (resources, callback) {
    resources && _.each(resources, function (urls, method) {
        if (!urls || !urls.length) {
            return;
        }

        if (!_.isFunction(_BrowserPolicy.content[method])) {
            throw new Error(`content security policy "${method}" is not defined in package "browser-policy".`)
        }

        callback && callback(urls, method);
        urls.forEach(function (url) {
            url && _BrowserPolicy.content[method](url);
        });
    });
};