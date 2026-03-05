+++
title = "zapomenuta-orlova"
description = "Doprovodný web studentského projektu - historické stezky s cílem objasnit dávno zapomenutou historii Orlové."
stars = 0
downloads = 0
forks = 1
license = ""
homepage_url = "https://zapomenutaorlova.muor.cz"
repo_url = "https://github.com/Tarasa24/zapomenuta-orlova"
lang = [
  { language = "Vue", color = "#41b883", ratio = 0.83 },
  { language = "JavaScript", color = "#f1e05a", ratio = 0.15 },
  { language = "HTML", color = "#e34c26", ratio = 0.01 }
]
+++

<center>
<img align="left" width="148" src="https://i.imgur.com/TqcE2b6.png">
<h1>Zapomenutá Orlová</h1>
Doprovodný web studentského projektu - historické stezky s cílem objasnit dávno zapomenutou historii Orlové.
</center>
</br>

---

> README also available in [English 🇬🇧](https://github.com/Tarasa24/zapomenuta-orlova/blob/master/README.md)

## Table of contents

- [Obecné informace](#Obecné-informace)
- [Technologie](#technologie)

## Obecné informace

Projekt je **PWA (Progresivní Webová Aplikace)** vytvořená pomocí **Vue** a navržená jako prezentace projektu a mapa stezky. Jako **PWA** je web postaven tak, že je možné jej stáhnout včetně mapových dlaždic a jej pak používat úplně offline.

Středobodem webu je pak mapa. Pomocí knihovny **Leaflet** bylo snadné vytvořit komplexní, však na ovládání jednoduchý přehled o stezce. Uživatelé pak mohou kliknout na body stezky a otevřít články o těchto místech.

Z pohledu autora článků je architektura webu pohodlná, protože články jsou psány v markdownu a poté jsou za běhu převedeny do html. Což znamená, že se autor může soustředit pouze na obsah, zatímco formu zpracovává samotný web.

Konzistentní forma je zajištěna **end-to-end testováním** pomocí **Cypress frameworku**. Rychlá iterace během vývojové fáze je pak řešena prostřednictvím **CI / CD** a tím jsou **GitHub Actions** pro testování PR a **Netlify** pro building a deployment.

[![Netlify Status](https://api.netlify.com/api/v1/badges/f37e7027-a329-469a-87c2-ff4ff243c906/deploy-status)](https://app.netlify.com/sites/zapomenuta-orlova/deploys)

## Technologie

- [Vue](https://vuejs.org/) / [SASS](https://sass-lang.com/)
- [LeafletJS](https://leafletjs.com/)
- [Cypress e2e testing](https://www.cypress.io/)
- [PWA](https://cs.wikipedia.org/wiki/Progresivn%C3%AD_webov%C3%A9_aplikace)
- [Netlify](https://www.netlify.com/)
