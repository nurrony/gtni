gtni
====
[![NPM](https://nodei.co/npm/gtni.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/gtni)

Install your npm dependencies with `gtni` as soon you `pull`, `fetch` or `clone` a git repo.

Installation
-------------
```sh
[sudo] npm install -g gtni
```
Usage
------
```sh
$gtni --help
Usage: gtni <command> [options]

Commands:
  pull   git pull and install npm dependencies
  fetch  git fetch and install npm dependencies
  clone  clone a git repository and install npm dependencies

Options:
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]

Examples:
  gtni pull [git-options]  git pull and install npm packages

```
I need your help to improve this module. Please send me your valuable suggestions and advices. I am all ears.

Todo List
---------
- [x] Very basic stage of pull support
- [x] Pull support for most used `git pull` options
- [x] Fetch support for most used `git fetch` options
- [x] Support for `git clone`
- [ ] Support for merge options in `git pull`
