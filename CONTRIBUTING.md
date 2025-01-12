# Contributing to cipherguard

## Introduction

Thank you for your interest in cipherguard. We welcome contributions from everyone, this guide is here to help you get started!

### Code of Conduct

First things first, please read our [Code of Conduct](https://www.cipherguard.com/code_of_conduct).
Help us keep Cipherguard open and inclusive!

## High level guidelines

There are a few guidelines that we need contributors to follow so that we have a chance of keeping on top of things.

### Reporting a security Issue

If you've found a security related issue in Cipherguard, please don't open an issue in GitHub.
Instead contact us at security@cipherguard.com. In the spirit of responsible disclosure we ask that the reporter keep the
issue confidential until we announce it.

The cipherguard team will take the following actions:
- Try to first reproduce the issue and confirm the vulnerability.
- Acknowledge to the reporter that we’ve received the issue and are working on a fix.
- Get a fix/patch prepared and create associated automated tests.
- Prepare a post describing the vulnerability, and the possible exploits.
- Release new versions of all affected major versions.
- Prominently feature the problem in the release announcement.
- Provide credits in the release announcement to the reporter if they so desire.

### Reporting a bug
Please only use github for bugs or pull request.

* Make sure you have a [GitHub account](https://github.com/signup/free).
* Submit an [issue](https://github.com/cipherguard/cipherguard/issues)
  * Check first that a similar issue does not already exist.
  * Make sure you fill in the earliest version that you know has the issue if it is a bug.
  * Clearly describe the issue including steps to reproduce the bug

### Requesting a new feature or ehancement

Please use the community forum: http://community.cipherguard.com/
Do not use github to request new features.

### Getting help with an installation issue

Please use the community forum: http://community.cipherguard.com/
Do not use github to request help with your instance installation.

### How can you help?

There are several ways you can help out:

* Create an [issue](https://github.com/cipherguard/cipherguard/issues) on GitHub ONLY if you have found a bug
* Review [enhancement or new feature requests](https://community.cipherguard.com/c/backlog) on the community foum and contribute to the functional or technical specifications in the issues.
* Write patches for open bug/feature issues, preferably with test cases included
* Contribute to the [documentation](https://cipherguard.com/help).
* Help design the proposed changes by editing the [styleguide](https://github.com/cipherguard/cipherguard_styleguide) or by submitting changes in the [wireframes](https://github.com/cipherguard/cipherguard_wireframes).
* Write unit test cases to help increase [test coverage](https://coveralls.io/github/cipherguard/cipherguard).
* Extend the [selenium test suite](https://github.com/cipherguard/cipherguard_selenium) for any open bug or change requests

If you have any suggestions or want to get involved in other ways feel free to get in touch with us at [contact@cipherguard.com](mailto:contact@cipherguard.com)!

### Making code changes

#### Which branch to base the work?

* Bugfix branches will be based on master.
* New features that are backwards compatible will be based on next minor release branch.
* New features or other non backwards compatible changes will go in the next major release branch.

#### Make changes locally first
* Fork the repository on GitHub.
* Create a feature branch from where you want to base your work.
  * This is usually the master branch.
  * Only target release branches if you are certain your fix must be on that
    branch.
  * To quickly create a feature branch based on master; `git branch
    feature/ID_feature_description master` then checkout the new branch with `git
    checkout feature/ID_feature_description`. Better avoid working directly on the
    `master` branch, to avoid conflicts if you pull in updates from origin.
* Make commits of logical units.

#### Before submiting changes
* Check for unnecessary whitespace with `git diff --check` before committing.
* Use descriptive commit messages and reference the #issue number.
* PHP unit test cases should continue to pass. You can run tests locally or enable [travis-ci](https://travis-ci.org/) for your fork, so all tests and codesniffs will be executed (see faq bellow).
* Selenium tests should continue to pass. See [cipherguard selenium test suite](https://github.com/cipherguard/cipherguard_selenium) (see faq bellow).
* Your work should apply the [CakePHP coding standards](http://book.cakephp.org/2.0/en/contributing/cakephp-coding-conventions.html) (see faq bellow).

#### Submitting Changes

* Push your changes to a topic branch in your fork of the repository.
* Submit a pull request to the official cipherguard repository, with the correct target branch.

### Making code changes

#### Which branch to base the work?

* Bugfix branches will be based on master.
* New features that are backwards compatible will be based on next minor release branch.
* New features or other non backwards compatible changes will go in the next major release branch.

#### Make changes locally first
* Fork the repository on GitHub.
* Create a feature branch from where you want to base your work.
  * This is usually the master branch.
  * Only target release branches if you are certain your fix must be on that
    branch.
  * To quickly create a feature branch based on master; `git branch
    feature/ID_feature_description master` then checkout the new branch with `git
    checkout feature/ID_feature_description`. Better avoid working directly on the
    `master` branch, to avoid conflicts if you pull in updates from origin.
* Make commits of logical units.

#### Before submiting changes
* Check for unnecessary whitespace with `git diff --check` before committing.
* Use descriptive commit messages and reference the #issue number.
* Browser extension unit test cases should continue to pass.
* Selenium tests should continue to pass. See [cipherguard selenium test suite](https://github.com/cipherguard/cipherguard_selenium) (see faq bellow).

## How to edit the CSS files?

All the less and css files of cipherguard are managed through a styleguide.
https://github.com/cipherguard/cipherguard_styleguide

You can also develop an alternative stylesheet and include it manually if you only want some styling changes for your own version of the browser add-on.
If you want your changes to be included in an official release, you will have to submit the changes in the official styleguide.
