+++
title = "zapomenuta-orlova"
description = "Accompanying website for the student project - historical trail with the goal to expound the long-forgotten history of Orlová."
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
Accompanying website for the student project - historical trail with the goal to expound the long-forgotten history of Orlová.
</center>
</br>

---

> README také dostupné v [Češtině 🇨🇿](https://github.com/Tarasa24/zapomenuta-orlova/blob/master/README.cz.md)

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)

## General info

Project is a **PWA (Progressive Web App)** made in **Vue** designed as a project presentation and trail map. As a **PWA** it's built in a way that it's possible for the website to be downloaded including the map tiles and then work entirely offline.

The centre-point of the website is the map screen. Using the **Leaflet** library it was easy to create comprehensive yet simple-to-operate overview of the trail. Users can then click on trail's stopping points and open up articles about the places.

From articles writer’s point of view is the website architecture convenient because the actual articles are written in markdown and are then converted to html on runtime. Which means that the writer can focus on the content while the website itself handles the form.

Consistent form is assured by **end-to-end testing** using the **Cypress framework**. Fast iteration during the development phase is then handled through **CI/CD** and that being **GitHub Actions** for PR testing and **Netlify** for building and deployment.

[![Netlify Status](https://api.netlify.com/api/v1/badges/f37e7027-a329-469a-87c2-ff4ff243c906/deploy-status)](https://app.netlify.com/sites/zapomenuta-orlova/deploys)

## Technologies

- [Vue](https://vuejs.org/) / [SASS](https://sass-lang.com/)
- [LeafletJS](https://leafletjs.com/)
- [Cypress e2e testing](https://www.cypress.io/)
- [PWA](https://en.wikipedia.org/wiki/Progressive_web_application)
- [Netlify](https://www.netlify.com/)
