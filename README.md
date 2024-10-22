Test_repo : Première Application mobile pour Dreki
Introduction

Bienvenue dans le projet Dreki, la première application mobile pour Dreki. Ce guide vous aidera à lancer l'application en local et à gérer les mises à jour sur le serveur AWS. Veuillez suivre les instructions ci-dessous.

Prérequis : 

    Un émulateur Android installé (ou simplement utiliser un navigateur web avec l'affichage mobile activé).
    Node.js et npm installés sur votre machine.
    Android Studio (facultatif, mais recommandé pour tester sur émulateur Android).
    Accès SSH pour les mises à jour AWS.

Lancer l'application en local
   Installer les dépendances :

    npm i
  
  Synchroniser Capacitor :

    bash

    npx cap sync

Lancer l'application sur un émulateur Android (si Android Studio est installé) :

    npx cap sync && npx cap open android

Lancer le projet en mode développement :

    npm run dev

Mettre à jour le serveur AWS
Étapes pour déployer une nouvelle version sur le serveur AWS :

  Connexion SSH au serveur :
        
    Se connecter via SSH en utilisant le mot de passe Dreki.

  Naviguer dans le répertoire de l'application :

    bash

    cd Dreki_app

  Récupérer les dernières modifications depuis Git :

    bash

    git pull

  Installer les dépendances mises à jour :

    bash

    npm i

  Construire le projet pour la production :

    Attention : il est crucial de build le projet directement sur le serveur SSH pour que les mises à jour soient en production.

    bash

    npm run build

  Vérifier l'état des processus via PM2 :

    bash

    pm2 status

  Démarrer l'application avec PM2 :

    Si l'application n'est pas encore en cours d'exécution, utilisez cette commande pour démarrer :

    bash

    pm2 start 'dreki_app'

  Sinon, vous pouvez utiliser la commande suivante :

    bash

    pm2 start npx --name "dreki_app" -- serve@latest out

En cas de dysfonctionnement :

    Supprimez l'ancienne instance de l'application :

    bash

    pm2 delete dreki_app

Relancez l'application en utilisant la commande ci-dessus.
