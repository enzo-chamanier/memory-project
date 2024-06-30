# MEMORY FLASHCARDS

Memory Flashcards est une application web qui permet aux utilisateurs de créer, lire, mettre à jour et supprimer des cartes mémoire. Les utilisateurs peuvent organiser leurs cartes en catégories et en thèmes pour une meilleure organisation.
L'utilisateur peut également tester ses connaissances en lançant des sessions de révision.

## Déploiement

Pour déployer ce projet, suivez les étapes suivantes :

1. Clonez le dépôt à partir de la plateforme git.
2. Installez les dépendances nécessaires avec la commande `npm i`.
3. Lancez le projet avec la commande `npm run serve`.

## Fonctionnalités

Ce projet comprend les fonctionnalités suivantes :

- **Catégories** : Les utilisateurs peuvent créer, lire et supprimer des catégories.
    - Pour supprimer une catégorie, l'utilisateur doit effectuer un clic droit sur la catégorie puis un clic gauche pour confirmer la suppression.
    - Pour lire une catégorie et accéder à ses thèmes, l'utilisateur doit effectuer un clic gauche sur la catégorie.
- **Thèmes** : Les utilisateurs peuvent créer et lire des thèmes.

- **Cartes** : Les utilisateurs peuvent créer, lire et supprimer des cartes.
    - Pour supprimer une carte, l'utilisateur doit effectuer un double clic droit sur la carte.
    - Pour lire une carte, l'utilisateur doit effectuer un double clic gauche sur la carte pour switch entre les faces de la carte.

- **Sessions de révision** : Les utilisateurs peuvent lancer des sessions de révision pour tester leurs connaissances en cliquant sur le bouton "Lancer une session de révision". Les cartes sont affichées dans un ordre calculé algorithmiquement pour maximiser la mémorisation.
Par défaut, le niveau d'une carte est défini à 0. Lorsqu'un utilisateur a eu juste il coche la case "J'ai eu juste" et le niveau de la carte est incrémenté de 1. Lorsqu'un utilisateur a eu faux il coche la case "J'ai eu faux" et le niveau de la carte est décrémenté de 1. Lorsque le niveau d'une carte est supérieur à 2, la carte est retirée de la session de révision et n'est affichée que si l'utilisateur relance une session de révision en fonction du jour n+1.

## Organisation du code et des composants

Le code est organisé en plusieurs composants pour faciliter la maintenance et l'évolutivité. Chaque fonctionnalité (catégories, thèmes, cartes) a son propre ensemble de composants, ce qui permet une séparation claire des préoccupations.

## Données de test

Le projet comprend déjà des données de test pour les catégories, les thèmes et les cartes. Ces données peuvent être utilisées pour tester les différentes fonctionnalités du projet.