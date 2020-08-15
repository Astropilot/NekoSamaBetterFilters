<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/Astropilot/NekoSamaBetterFilters/master/webextension/images/icon128.png" alt="Testify" width="128">
</h1>

<h4 align="center">
Refined Neko-Sama.fr</h4>

<p align="center">
  <a href="https://travis-ci.org/Astropilot/appsy_project">
    <img src="https://github.com/Astropilot/NekoSamaBetterFilters/workflows/.github/workflows/build_webapi.yml/badge.svg"
         alt="Build Status">
  </a>
  <img src="https://img.shields.io/github/v/tag/Astropilot/NekoSamaBetterFilters">
  <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-yellow.svg">
</p>

<!--<p align="center">
  <a href="#about">About</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#download">Download</a> •
  <a href="#authors">Authors</a> •
  <a href="#license">License</a>
</p>-->

<p align="center">
    <a href="#chrome" target="_blank"><img src="https://imgur.com/3C4iKO0.png" width="64" height="64"></a>
    <a href="#firefox" target="_blank"><img src="https://imgur.com/ihXsdDO.png" width="64" height="64"></a>
    <a href="#edge" target="_blank"><img src="https://imgur.com/vMcaXaw.png" width="64" height="64"></a>
    <a href="#vivaldi" target="_blank"><img src="https://imgur.com/EuDp4vP.png" width="64" height="64"></a>
    <a href="#brave" target="_blank"><img src="https://imgur.com/z8yjLZ2.png" width="64" height="64"></a>
    <a href="#tor" target="_blank"><img src="https://imgur.com/MQYBSrD.png" width="64" height="64"></a>
</p>


## A propos

Cette extension web permet principalement de corriger la page

## Getting Started

### Prerequisites

To make this project work you will need:

* PHP 7.+
* A MySQL database server
* A web server like Apache
* The [XDebug](https://xdebug.org/) extension if you want to run unit tests (PHPUnit is provided in PHAR format in `tools/` folder)

### Installing

* Put all the files in your site directory
* Configure your web server to serve the `appsy_project/public/` folder directly.

A example with Apache in your `httpd.conf` file:
```ini
DocumentRoot "path/to/appsy_project/public"
<Directory "path/to/appsy_project/public">
    Options FollowSymLinks Includes ExecCGI
    AllowOverride All
    Require all granted
</Directory>
```
* Configure your web server to declare 3 environment variables: `SMTP_HOST`, `MAIL_USERNAME` and `MAIL_PASSWORD`.
  * `SMTP_HOST`: This is the address of the mail server to communicate to. Eg: smtp.gmail.com
  * `MAIL_USERNAME`: This is the sender email address (used to send registration emails)
  * `MAIL_PASSWORD`: This is the password for authenticating the email address defined above.

A example with Apache in your `httpd.conf` file:
```ini
SetEnv SMTP_HOST smtp.gmail.com
SetEnv MAIL_USERNAME sample@gmail.com
SetEnv MAIL_PASSWORD my_password
```
* On your MySQL server create a database called `testify`. Import the `tools/testify.sql` script into your MySQL server to get the different tables needed by the project.
* Everything is ready you can now access your site!

### Utils CLI

We provide a mini PHP cli application with some util commands.
Here the list of the different commands available:
- `clear-cache` : Clear the cache within `app/cache` folder. (Basically it delete all .php and .chtml files)

### Running the tests

To run PHPUnit on the unit tests you have two different configuration files, one for the Framework tests and the other one for the Project tests. You can start them by the following commands:
```bash
$ php tools/phpunit.phar --configuration framework.xml.dist
$ php tools/phpunit.phar --configuration project.xml.dist
```

## Licence

MIT

---

> [Yohann Martin](https://codexus.fr) &nbsp;&middot;&nbsp;
> 2020
