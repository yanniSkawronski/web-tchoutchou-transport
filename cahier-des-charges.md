# Cahier des charges — Projet libre

## 1. Informations générales

- **Nom du projet** : Tchoutchou transport
- **Membres de l'équipe** : Tadeusz Kondracki, Jules Rossier, Aymeric Siegenthaler, Yanni Skawronski
- **Lien du dépôt Git** : [ici](https://github.com/yanniSkawronski/web-tchoutchou-transport)

## 2. Description du projet

Site Web permettant la planification et la visualisation de ses trajets en transport public, inspiré par l'application des CFF.

## 3. Objectifs

- Déterminer les connexions possibles entre un point A et un point B à un moment donné
- Donner un point de départ et d'arrivée sur une carte, et déterminer les trajets possibles
- Afficher le trajet précis sur une carte
- Intégration d'un affichage de la météo à l'arrivée
- Lister les différens départ depuis une station, enregistrer un trajet, mettre en favoris des stations, .... TBD

## 3.1 Ajouts optionnels

- To be defined éventuellement

## 4. Technologies

Listez les technologies envisagées et **justifiez brièvement chaque choix**.

Par exemple :

- **Frontend** : Angular avec Typescript
- **Backend** : Nest.js
- **Base de données** : PostgreSQL, communication avec Prisma
- **Authentification** : Oui, utilisation de cookies, stack précise à définir
- **Autres outils** : API OJP de OpenTransportData, Leaflet, API météo

## 5. Architecture

Frontend qui communique avec le backend, backend s'occupe de communiquer avec les différentes API externes et de persister les données dans la base de données.

## 6. Évolutions possibles

To be defined
