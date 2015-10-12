gtni
====
Install your npm dependencies with `gtni` as soon you `pull`, `fetch` or `clone` a git repo.

**This repo is actively under development. Only supports `pull` command for now.
Other functionality is coming soon. Please check Todo list before use.**

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
  clone  clone a git repo and install npm dependencies (coming soon)

Options:
  -h, --help  Show help  [boolean]

Examples:
  gtni pull [git-options]  git pull and install npm dependencies
```
I need your help to improve this module. Please send me your valuable suggestions and advices. I am all ears.

Todo List
---------
- [x] Very basic stage of pull support
- [x] Pull support for most used `git pull` options
- [x] Fetch support for most used `git fetch` options
- [ ] Support for `git clone`
- [ ] Support for merge options in `git pull`
