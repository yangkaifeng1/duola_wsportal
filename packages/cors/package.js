Package.describe({
    name: 'leaf4monkey:cors',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({
    "cors": "2.7.1"
});

Package.onUse(function (api) {
    api.versionsFrom('1.3.2.4');
    api.use([
        'ecmascript',
        'check'
    ], 'server');
    api.mainModule('cors.js', 'server');
});
