# gtni

Install your npm dependencies recursively with gtni as soon you clone, fetch or pull a git repo.

[![version][npm-version]][npm-url] [![Downloads][npm-total-downloads]][npm-url] [![Travis branch][travis-badge]][travis-url] [![Greenkeeper badge][gk-badge]][gk-url] [![semantic-release][sembadge]][npm-url]

> **gtni** automatically choose right package manager for a git repository based on lock file in a directory with `package.json`.

## Installation

```sh
[sudo] npm install -g gtni
# or
[sudo] yarn global add gtni
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
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]

Examples:
  [NODE_ENV=<env>] gtni pull [git-options]  git pull and install npm packages



# Sub command options

$ gtni <command> -h
Options:
  -h, --help, --help  Show help  [boolean]
  --branch, -b        remote branch name to clone  [string] [default: false]
  --debug, -d         Show debug output  [boolean] [default: false]
  -v, --version       Show version number  [boolean]

  Note: here you can pass any flags for the corresponding git command
```

I need your help to improve this module. Please send me your valuable suggestions and advices. I am all ears.

## Todo List

- [x] Very basic stage of pull support
- [x] Pull support for most used `git pull` options
- [x] Fetch support for most used `git fetch` options
- [x] Support for `git clone`
- [x] `NODE_ENV` support for `npm/yarn install`
- [x] Show warnings during dependencies installation
- [x] Support for read and install dependencies when project has multiple `package.json` files
- [x] Install npm modules diffing `git tree` for various branch after doing git operations supported by `gtni`
- [x] Add support to pass custom `NODE_ENV` values for `npm install`
- [x] Choose right package manager automatically for a repository

[npm-badge]: https://nodei.co/npm/gtni.png?compact=true
[npm-version]: https://img.shields.io/npm/v/gtni.svg?style=flat-square
[npm-dependencies]: https://img.shields.io/david/nmrony/gtni.svg?style=flat-square
[npm-dev-dependencies]: https://img.shields.io/david/dev/nmrony/gtni.svg?style=flat-square
[npm-total-downloads]: https://img.shields.io/npm/dm/gtni.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/gtni
[github-url]: https://github.com/nmrony/gtni
[travis-url]: https://travis-ci.org/nmrony/gtni
[travis-badge]: https://img.shields.io/travis/nmrony/gtni/master.svg?style=flat-square
[yarn-url]: https://yarnpkg.com/
[gk-badge]: https://badges.greenkeeper.io/nmrony/gtni.svg
[gk-url]: https://greenkeeper.io/
[sembadge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
