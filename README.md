<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/Astropilot/NekoSamaBetterFilters/master/webextension/icons/icon128.png" alt="Testify" width="128">
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
    <a href="#chrome" target="_blank"><img src="https://imgur.com/3C4iKO0.png" width="64" height="64"></a>
    <a href="#firefox" target="_blank"><img src="https://imgur.com/ihXsdDO.png" width="64" height="64"></a>
    <a href="#edge" target="_blank"><img src="https://imgur.com/vMcaXaw.png" width="64" height="64"></a>
    <a href="#vivaldi" target="_blank"><img src="https://imgur.com/EuDp4vP.png" width="64" height="64"></a>
    <a href="#brave" target="_blank"><img src="https://imgur.com/z8yjLZ2.png" width="64" height="64"></a>
    <a href="#tor" target="_blank"><img src="https://imgur.com/MQYBSrD.png" width="64" height="64"></a>
</p>

> :warning: **Pas encore de release**: La première version ne devrait plus tarder à arriver !

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

* [Node.js](https://nodejs.org) v14 ou plus
* [Python](https://www.python.org) 3+
* [Gulp](https://gulpjs.com)
* [Docker](https://www.docker.com) + [docker-compose](https://docs.docker.com/compose) (optionnel mais chaudement recommandé)
* [Elasticsearch](https://www.elastic.co/fr/elasticsearch/) si vous ne comptez pas utiliser Docker
* Un navigateur comme [Firefox](https://www.mozilla.org/fr/firefox/new), [Chrome](https://www.google.fr/chrome) ou [Edge](https://www.microsoft.com/edge)

### Lancer l'API de recherche

Si vous disposez de Docker avec docker-compose, vous pouvez lancer simplement l'API comme ceci:
```sh
$ cd webapi
$ docker-compose up
```

Attention pour faire fonctionner le moteur ElasticSearch vous devez impérativement modifier le paramètre kernel `vm.max_map_count` et le mettre à au moins `262144`. Cliquez sur [ce lien pour connaitre la manipulation nécessaire selon votre environnement](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#_set_vm_max_map_count_to_at_least_262144).

L'api est disponible à l'adresse `http://127.0.0.1:8000/api/animes` <br>
l'api d'ElasticSearch est disponible à l'adresse `http://127.0.0.1:9200`

### Compiler / Lancer l'extension Web

Pour compiler l'extension
```sh
$ npm install
$ npm run build
```

Un dossier `dist/` est maintenant créé contenant tous les fichiers pour l'extension web. <br>
Il vous suffit maintenant de charger l'application dans votre navigateur web:

* Firefox
    * Tapez `about:debugging` dans votre barre d'adresse
    * Allez dans l'onglet à gauche `Ce Firefox`
    * Dans la rubrique `Extensions temporaires` cliquez sur `Charger un module complémentaire temporaire...` et naviguez dans le dossier `dist/` et choisissez le fichier `manifest.json` puis `Ouvrir`
    * L'extension est maintenant chargée et utilisable

* Chrome / Edge
    * Rendez-vous sur l'adresse `chrome://extensions/` pour Chrome ou `edge://extensions/` pour Edge
    * Activer le `Mode développeur`
    * Cliquez sur `Charger l'extension non empaquetée` / `Charger l'élément décompressé` puis naviguez jusque dans le dossier `dist/` et faites OK
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
