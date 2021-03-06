<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/Astropilot/NekoSamaBetterFilters/master/webextension/source/icons/icon128.png" alt="Testify" width="128">
</h1>

<h4 align="center">
Refined Neko-Sama.fr</h4>

<p align="center">
  <a href="https://github.com/Astropilot/NekoSamaBetterFilters/actions">
    <img src="https://github.com/Astropilot/NekoSamaBetterFilters/workflows/Build%20%26%20Publish%20WebAPI/badge.svg"
         alt="Build Status">
  </a>
  <img src="https://img.shields.io/github/v/tag/Astropilot/NekoSamaBetterFilters">
  <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-yellow.svg">
</p>

<p align="center">
    <a href="https://chrome.google.com/webstore/detail/refined-neko-samafr/bkhfdimpfnkdmegkcniknicnpbpeklag"><img src="https://imgur.com/3C4iKO0.png" width="64" height="64"></a>
    <a href="https://addons.mozilla.org/fr/firefox/addon/refined-neko-sama/"><img src="https://imgur.com/ihXsdDO.png" width="64" height="64"></a>
    <a href="#edge"><img src="https://imgur.com/vMcaXaw.png" width="64" height="64"></a>
    <a href="https://chrome.google.com/webstore/detail/refined-neko-samafr/bkhfdimpfnkdmegkcniknicnpbpeklag"><img src="https://imgur.com/EuDp4vP.png" width="64" height="64"></a>
    <a href="https://chrome.google.com/webstore/detail/refined-neko-samafr/bkhfdimpfnkdmegkcniknicnpbpeklag"><img src="https://imgur.com/z8yjLZ2.png" width="64" height="64"></a>
    <a href="https://addons.mozilla.org/fr/firefox/addon/refined-neko-sama/"><img src="https://imgur.com/MQYBSrD.png" width="64" height="64"></a>
</p>

## A propos

Cette extension web permet principalement de corriger et d'améliorer la page des animés du site [Neko-Sama.fr](https://www.neko-sama.fr).

Voici la liste des fonctionnalités qu'elle apporte:

* [x] La recherche et la navigation entre les pages sont maintenant complètement dynamiques
* [x] Les filtres Type, Status et Genres sont maintenant fonctionnels
* [x] Ajout d'un filtre par année
* [x] Vos filtres de recherche ainsi que la page sont sauvegardé dans l'URL pour vous permettre de les garder en favoris ou à transmettre ce lien à une tierce personne
* [x] **Bonus**: Un anti-pub est intégré pour les deux hébergeurs vidéos présent sur le site:
    * [x] pStream (Stream): Plus aucune PopUp et ajoute une compatibilité avec les autres bloqueurs de pub (Vous n'êtes donc plus dans l'obligation de les désactiver)
    * [x] MyStream: Les PopUps sont retirées ainsi que les publicités intrusives sur le lecteur mais il n'est pas compatible avec certains bloqueurs de publicités. Si le lecteur ne réagit pas, essayez de désactiver vos anti-publicités pour Neko-Sama.fr

## Build/Run

### Prérequis

#### Extension web
* [Node.js](https://nodejs.org) v14+ et [npm.js](https://www.npmjs.com) v6+
* Un navigateur comme [Firefox](https://www.mozilla.org/fr/firefox/new), [Chrome](https://www.google.fr/chrome) ou [Edge](https://www.microsoft.com/edge)

#### Web API
* [Python](https://www.python.org) 3+
* [Docker](https://www.docker.com) + [docker-compose](https://docs.docker.com/compose) (optionnel mais chaudement recommandé). Pour Windows vous avez [Docker Desktop](https://www.docker.com/products/docker-desktop)
* [Elasticsearch](https://www.elastic.co/fr/elasticsearch/) si vous ne comptez pas utiliser Docker

### Lancer l'API de recherche

Si vous disposez de Docker avec docker-compose, vous pouvez lancer simplement l'API comme ceci:
```sh
$ cd webapi
$ docker-compose up
```

Attention pour faire fonctionner le moteur ElasticSearch vous devez impérativement modifier le paramètre kernel `vm.max_map_count` et le mettre à au moins `262144`. Cliquez sur [ce lien pour connaitre la manipulation nécessaire selon votre environnement](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#_set_vm_max_map_count_to_at_least_262144).

L'api est disponible à l'adresse `http://127.0.0.1:8000/api/animes` <br>
l'api d'ElasticSearch est disponible à l'adresse `http://127.0.0.1:9200`

#### Populer la base de données Elasticsearch

Actuellement la base de documents est vide par défaut, pour y ajouter les animés présent sur Neko-Sama, vous devez utiliser la commande Flask `populate-animes`, avec Docker il vous suffit d'entrer l'a commande suivante
```sh
$ docker-compose run webapi flask populate-animes
```

:bulb: **Tips**: La commande pour rajouter les animés dans Elasticsearch supporte l'envoi d'email si l'opération à réussi ou échouée. Dans le cas d'une réussite elle renvoi les informations sur les animés rajoutés/modifiés/supprimés ainsi qu'un rapport d'health-check du cluster. Dans le cas d'une erreur vous recevrez la stacktrace de l'exception.

Pour activer et configurer l'envoi de mail, vous devez définir les variables d'environnement suivantes
* `MAIL_ACTIVE_LOGS` : Mettez cette valeur à `true` pour activer l'envoi des mails
* `MAIL_SERVER` : Il s'agit du serveur mail à contacter (Généralement le serveur SMTP qui gère l'email que vous voulez utiliser)
* `MAIL_PORT` : Il s'agit du port à utiliser pour contacter le serveur mail. Il s'agit souvent du port `587` ou `465` pour une communication chiffrée
* `MAIL_USE_TLS` : Mettez cette valeur à `true` pour utiliser le protocol TLS
* `MAIL_USE_SSL` : Mettez cette valeur à `true` pour utiliser le protocol SSL
* `MAIL_USERNAME` : Il s'agit de votre identifiant d'authentification au serveur mail
* `MAIL_PASSWORD` : Renseignez ici votre mot de passe d'authentification si c'est nécessaire
* `MAIL_LOGS_RECIPIENT` : Il s'agit de l'adresse email qui recevra les mails de l'API

Voici un exemple d'une configuration pour utiliser votre adresse Gmail pour envoyer les mails
```sh
MAIL_ACTIVE_LOGS=true
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=465
MAIL_USE_TLS=false
MAIL_USE_SSL=true
MAIL_USERNAME=votre-adresse@gmail.com
MAIL_PASSWORD=votre-mot-de-passe
MAIL_LOGS_RECIPIENT=je-recois-les-emails@*****.***
```

Vous pouvez soit les définir de plusieurs manières
* Via la commande `export` sous Unix ou `set` pour Windows (Peu recommandé car il faut le faire à chaque nouvelle session)
* Vous pouvez les ajouter dans le `docker-compose.yml` dans la rubrique `environment` de `webapi` (Vous n'avez qu'à le faire une fois mais vos identifiants seront exposé sur Git si vous les incluez dans un commit)
* Vous pouvez définir un fichier `.env` dans le dossier `webapi` dans lequel vous mettez vos variables d'environment. Il sera lu automatiquement par Flask lorsque vous utiliserez la commande `populate-animes`. Et il ne sera pas pris en compte dans vos commit car il à été ajouté au `.gitignore`

### Compiler / Lancer l'extension Web

Pour compiler l'extension
```sh
$ cd webextension/
$ npm install
$ npm run build
```

Un dossier `distribution/` est maintenant créé contenant tous les fichiers pour l'extension web. <br>
Il vous suffit maintenant de charger l'application dans votre navigateur web.

Vous pouvez utilisez les commandes suivantes pour ouvrir une instance de Firefox ou Chrome sur un profil séparé avec directement l'extension chargée et avec le site Neko-Sama.fr ouvert au démarrage:
```sh
# Pour lancer une instance de Chrome
$ npm run start

# Pour lancer une instance de Firefox
$ npm run start:firefox
```

Sinon vous pouvez charger manuellement l'extension avec les instructions suivantes:

* Firefox
    * Tapez `about:debugging` dans votre barre d'adresse
    * Allez dans l'onglet à gauche `Ce Firefox`
    * Dans la rubrique `Extensions temporaires` cliquez sur `Charger un module complémentaire temporaire...` et naviguez dans le dossier `distribution/` et choisissez le fichier `manifest.json` puis `Ouvrir`
    * L'extension est maintenant chargée et utilisable

* Chrome / Edge
    * Rendez-vous sur l'adresse `chrome://extensions/` pour Chrome ou `edge://extensions/` pour Edge
    * Activer le `Mode développeur`
    * Cliquez sur `Charger l'extension non empaquetée` / `Charger l'élément décompressé` puis naviguez jusque dans le dossier `distribution/` et faites OK
    * L'extension est maintenant chargée et utilisable

L'extension utilise l'API hébergée, pour la faire utiliser votre API locale, rendez-vous dans le fichier `webextension/animes/better-filters.js` et changez le hostname par `127.0.0.1:8000` en HTTP

Pour mettre à jour automatiquement l'extension quand vous modifiez un fichier, utilisez la commande
```sh
$ npm run watch
```

## Licence

[MIT - Fichier LICENSE](https://github.com/Astropilot/NekoSamaBetterFilters/blob/master/LICENSE)

---

> [Yohann Martin](https://codexus.fr) &nbsp;&middot;&nbsp;
> 2020
