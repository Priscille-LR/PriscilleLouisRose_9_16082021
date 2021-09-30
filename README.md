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

## Lancer tous les tests en local avec Jest :

```
$ npm run test
```

**Voir la couverture de test :**

`http://127.0.0.1:8080/coverage/lcov-report/`

## Couverture de test avant / après :
**Couverture de test à la réception du projet**
```
---------------------|---------|----------|---------|---------|-----------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------|---------|----------|---------|---------|-----------------------
All files            |   60.41 |    71.57 |   55.07 |   61.78 |
 constants           |     100 |      100 |     100 |     100 |
  routes.js          |     100 |      100 |     100 |     100 |
  usersTest.js       |       0 |        0 |       0 |       0 |
 containers          |   53.88 |     59.7 |   42.59 |   55.56 |
  Bills.js           |       0 |        0 |       0 |       0 | 7-62
  Dashboard.js       |   83.33 |    82.22 |      64 |   89.74 | 19-20,159-170,179-182
  Login.js           |    61.7 |       30 |   55.56 |   62.22 | 42-49,55-66,75-83
  Logout.js          |     100 |      100 |     100 |     100 |
  NewBill.js         |       0 |        0 |       0 |       0 | 7-62
 views               |   93.55 |    93.33 |     100 |   92.86 |
  Actions.js         |     100 |      100 |     100 |     100 |
  BillsUI.js         |   83.33 |       75 |     100 |      80 | 46,48
  DashboardFormUI.js |     100 |      100 |     100 |     100 |
  DashboardUI.js     |     100 |      100 |     100 |     100 |
  ErrorPage.js       |     100 |      100 |     100 |     100 |
  LoadingPage.js     |     100 |      100 |     100 |     100 |
  LoginUI.js         |     100 |      100 |     100 |     100 |
  NewBillUI.js       |     100 |      100 |     100 |     100 |
  VerticalLayout.js  |     100 |      100 |     100 |     100 |
---------------------|---------|----------|---------|---------|-----------------------
```
**Couverture de test après développement et correction**
```
---------------------|---------|----------|---------|---------|-------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------|---------|----------|---------|---------|-------------------
All files            |    96.7 |    97.78 |   88.89 |     100 |
 constants           |     100 |      100 |     100 |     100 |
  routes.js          |     100 |      100 |     100 |     100 |
  usersTest.js       |       0 |        0 |       0 |       0 |
  utils.js           |     100 |      100 |     100 |     100 |
 containers          |   95.88 |    96.36 |   83.78 |     100 |
  Bills.js           |     100 |      100 |     100 |     100 |
  Dashboard.js       |   91.03 |    95.12 |      70 |     100 | 11,74
  Login.js           |     100 |      100 |     100 |     100 |
  Logout.js          |     100 |      100 |     100 |     100 |
  NewBill.js         |     100 |      100 |     100 |     100 |
 views               |     100 |      100 |     100 |     100 |
  Actions.js         |     100 |      100 |     100 |     100 |
  BillsUI.js         |     100 |      100 |     100 |     100 |
  DashboardFormUI.js |     100 |      100 |     100 |     100 |
  DashboardUI.js     |     100 |      100 |     100 |     100 |
  ErrorPage.js       |     100 |      100 |     100 |     100 |
  LoadingPage.js     |     100 |      100 |     100 |     100 |
  LoginUI.js         |     100 |      100 |     100 |     100 |
  NewBillUI.js       |     100 |      100 |     100 |     100 |
  VerticalLayout.js  |     100 |      100 |     100 |     100 |
---------------------|---------|----------|---------|---------|-------------------
```

## Exemple de rédaction tests

***Scénario 1***

> **Given** Je suis un visiteur (non connecté)  
> **When** Je ne remplis pas le champ e-mail ou le champ password du login employé et je clique sur le bouton Se Connecter  
> **Then** Je reste sur la page Login et je suis invité à remplir le champ manquant

***Scénario 2***

> **Given** Je suis un visiteur (non connecté)  
> **When** Je remplis le champ e-mail du login employé au mauvais format (sans la forme chaîne@chaîne) et je clique sur le bouton Se connecter  
> **Then** Je reste sur la page Login et je suis invité à remplir le champ e-mail au bon format
