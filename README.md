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
  pull   pull a git repository and install npm dependencies
  fetch  fetch a git repository and install npm dependencies (coming soon)
  clone  clone a git repository and install npm dependencies (coming soon)

Options:
  -h, --help  Show help  [boolean]

Examples:
  gtni pull [git-options]  pull current git repository and install npm dependencies
```
I need your help to improve this module. Please send me your valuable suggestions and advices. I am all ears.

Todo List
---------
- [x] Very basic stage of `git pull` support
- [x] Full `git pull` support for most used options
- [ ] Support for `git fetch`
- [ ] Support for `git clone`
