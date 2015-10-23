# blender.js

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

These are the JavaScript files used by Blender CMS.

## Install

This NPM package is custom built for [Spatie](https://spatie.be) projects and is therefore not registered on NPM.
In order to install it via NPM you must specify this extra repository in `package.json`:

```json
"dependencies": { "blender.js": "spatie-custom/blender.js#1.0.0" }
```

Or you can install the package directly via NPM:
``` bash
$ npm i spatie-custom/blender.js#1.0.0
```

## Usage

Include one or more files in your app.js, and build with *Laravel Elixir* and *Browserify* afterwards.

``` js
require("blender.js/modules/ajax.csrf");
require("blender.js/modules/form.autosave");
require("blender.js/modules/form.input.datetimepicker");
require("blender.js/modules/form.select");
require("blender.js/modules/form.textarea.autosize");
require("blender.js/modules/form.textarea.parts");
require("blender.js/modules/form.locationpicker");
require("blender.js/modules/interface.confirm");
require("blender.js/modules/table.datatables");
require("blender.js/modules/table.sortable");
```

## Change log

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

If you discover any security related issues, please email willem@spatie.be instead of using the issue tracker.

## Credits

- [Willem Van Bockstal](https://github.com/willemvb)
- [All Contributors](../../contributors)

## About Spatie
Spatie is webdesign agency in Antwerp, Belgium. You'll find an overview of all our open source projects [on our website](https://spatie.be/opensource).

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
