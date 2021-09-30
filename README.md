# Billed : gestion des notes de frais
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)  ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
## Objectif

Reprendre un projet et mettre en place:
- Test unitaires et d’intégration pour augmenter la couverture de tests
- Rédaction test End-to-End pour le parcours Employé

## Installation

Installez les packages npm (décrits dans `package.json`) :
```
$ npm install
```

Installez live-server pour lancer un serveur local :
```
$ npm install -g live-server
```

Lancez l'application :
```
$ live-server
```

Puis allez à l'adresse : `http://127.0.0.1:8080/`

## Couverture de test avant / après :
avant :  TODO

après : TODO

## Couverture de test globale
TODO

## Exemple de rédaction tests

***Scénario 1***

> **Given** Je suis un visiteur (non connecté)  
> **When** Je ne remplis pas le champ e-mail ou le champ password du login employé et je clique sur le bouton Se Connecter  
> **Then** Je reste sur la page Login et je suis invité à remplir le champ manquant

***Scénario 2***

> **Given** Je suis un visiteur (non connecté)  
> **When** Je remplis le champ e-mail du login employé au mauvais format (sans la forme chaîne@chaîne) et je clique sur le bouton Se connecter  
> **Then** Je reste sur la page Login et je suis invité à remplir le champ e-mail au bon format
