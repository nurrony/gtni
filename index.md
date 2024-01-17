# gtni

Install your npm dependencies recursively with gtni as soon you pull, fetch or clone a git repo.

[![version][npm-version]][npm-url] [![dependencies][npm-dependencies]][dep-status] [![devDependencies][npm-dev-dependencies]][devdep-status] [![Downloads][npm-total-downloads]][npm-url] [![Travis branch][travis-badge]][travis-url] [![maintenance][maintenance-url]][github-url]

> For full features list, please check [Todo List](#todo-list) below. Keep an eye on github for updated feature list

## Installation

```sh
[sudo] npm install -g gtni
```

## Usage

```sh
$gtni --help
Usage: gtni <command> [options]

Commands:
  pull   git pull and install npm dependencies
  fetch  git fetch and install npm dependencies
  clone  clone a git repository and install npm dependencies

Options:
  -h, --help     Show help                                             [boolean]
  --version      Show version number                                   [boolean]

Examples:
  [NODE_ENV=<env>] gtni pull [git-options]  git pull and install npm packages

```

I need your help to improve this module. Please send me your valuable suggestions and advices. I am all ears.

## Todo List

- [x] Very basic stage of pull support
- [x] Pull support for most used `git pull` options
- [x] Fetch support for most used `git fetch` options
- [x] Support for `git clone`
- [x] `NODE_ENV` support for `npm install`
- [x] Show warnings during `npm` dependencies installation
- [x] Support for read and install dependencies when project has multiple `package.json` files
- [x] Install npm modules diffing `git tree` for various branch after doing git operations supported by `gtni`

[npm-badge]: https://nodei.co/npm/gtni.png?compact=true
[npm-version]: https://img.shields.io/npm/v/gtni.svg?style=flat-square
[npm-dependencies]: https://img.shields.io/david/nmrony/gtni.svg?style=flat-square
[npm-dev-dependencies]: https://img.shields.io/david/dev/nmrony/gtni.svg?style=flat-square
[npm-total-downloads]: https://img.shields.io/npm/dm/gtni.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/gtni
[github-url]: https://github.com/nmrony/gtni
[dep-status]: https://david-dm.org/nmrony/gtni#info=dependencies&view=table
[devdep-status]: https://david-dm.org/nmrony/gtni#info=devDependencies&view=table
[maintenance-url]: https://img.shields.io/maintenance/yes/2016.svg?style=flat-square
[travis-url]: https://travis-ci.org/nmrony/gtni
[travis-badge]: https://img.shields.io/travis/nmrony/gtni/master.svg?style=flat-square
