# 🔮 FrameQuest

**FrameQuest** est une application web éducative et gamifiée conçue pour apprendre de manière ludique les frameworks JavaScript les plus populaires : **React.js**, **Vue.js**, **Angular** et **Node.js**.

Ce projet est conçu comme un livrable de stage de fin d'études destiné aux développeurs web de niveau débutant à intermédiaire qui possèdent déjà des bases solides en HTML, CSS et JavaScript Vanilla.

---

## 🎮 Fonctionnalités & Mécaniques de Jeu

### 1. Système de "Mondes" (Frameworks)
Chaque framework représente un monde indépendant composé d'une suite logique de 5 niveaux progressifs :
*   **React.js** : Composants, props, hooks (`useState`, `useEffect`) et cycle de vie.
*   **Vue.js** : Réactivité (`ref`/`computed`), directives de templates (`v-model`, `v-if`, `v-for`) et Composition API.
*   **Angular** : Composants autonomes (`standalone`), métadonnées `@Component`, data-binding, injection de dépendances et *Signals*.
*   **Node.js** : Event Loop, modules natifs, lecture/écriture asynchrone (`fs`) et serveurs HTTP/Express.js.

### 2. Typologie des Niveaux (5 Types de Défis)
Chaque monde contient 5 types de défis uniques et interactifs :
1.  **Quiz à Choix Multiples (QCM)** : Concepts de base et architecture générale.
2.  **Complétion de Code à Trous** : Syntaxe à remplir directement au clavier.
3.  **Défi Debugging (Chasse aux bugs)** : Identification et correction en direct d'une ligne de code défectueuse dans un faux éditeur de code.
4.  **Réorganisation de Code** : Tri logique de lignes de code mélangées à travers une interface mobile-friendly de transfert en clic.
5.  **Mini-Projet Guidé** : Un projet complet découpé en 3 étapes interactives à valider les unes après les autres.

### 3. Éléments de Gamification
*   **Points d'Expérience (XP)** : Gain de 100 XP par défi réussi du premier coup, 50 XP en cas d'erreur préalable ou d'indice. La première complétion d'un niveau octroie un bonus réel de 300 XP.
*   **Niveaux de Joueur** : Chaque tranche de 1000 XP fait monter le joueur de niveau.
*   **Système de Badges** : 8 badges, dont *"Maître React"*, *"Sniper de Code"* (zéro faute sur un niveau), *"Architecte Web"* (niveau 5) et *"Polyglotte JS"* (les 4 mondes).
*   **Carte de monde** : choix des niveaux, verrouillage progressif, rejouabilité.
*   **Guide « Comment jouer »** : affiché au premier lancement, disponible ensuite via le bouton `?`.
*   **Indices pédagogiques** : jamais la réponse exacte ; réduit la récompense du défi à 50 XP.
*   **Statistiques** : défis réussis et taux de réussite du premier coup.
*   **Langue** : français et anglais (boutons FR / EN, sauvegardés).
*   **Thème** : mode sombre ou clair (bouton lune / soleil, sauvegardé).
*   **Logo** : icône cristal + `</>` dans `img/logo.svg`.
*   **À propos** : présentation du projet, de la stack et du volume pédagogique.

---

## 🛠️ Architecture du Projet

L'application respecte une architecture web modulaire moderne, séparant les styles, le moteur de jeu, les états et les fichiers de contenus de cours :

```
/ (Racine du projet)
├── index.html                  # Point d'entrée de l'application (SPA HTML5)
├── README.md                   # Documentation du projet
├── css/
│   ├── variables.css           # Thèmes CSS variables globales et tokens néons
│   ├── styles.css              # Styles généraux, layout, dashboard
│   ├── game.css                # Styles spécifiques aux 5 types de niveaux
│   └── components.css          # Composants UI (badges, boutons, progress bar, alertes)
├── js/
│   ├── app.js                  # Routeur principal, chargement et point d'entrée
│   ├── state.js                # Moteur d'état : XP, niveaux, badges et localStorage
│   ├── ui.js                   # Contrôleur d'affichage et transitions de vues
│   ├── game-engine.js          # Moteur des 5 mécaniques d'exercices
│   └── utils.js                # Utilitaires de sécurité et d'effets visuels (confettis canvas)
├── react/
│   └── content.js              # 15 exercices et explications pour React
├── vue/
│   └── content.js              # 15 exercices et explications pour Vue
├── angular/
│   └── content.js              # 15 exercices et explications pour Angular
└── node/
    └── content.js              # 15 exercices et explications pour Node.js
```

---

## 🚀 Comment Lancer le Projet ?

Puisque FrameQuest utilise les **Modules JavaScript natifs** (`import`/`export` ES6), les navigateurs bloquent les requêtes locales en raison de restrictions CORS si vous tentez d'ouvrir le fichier `index.html` en effectuant un simple double-clic (`file://`).

Il est donc **nécessaire** de servir le projet via un serveur HTTP local. Voici les méthodes les plus simples et rapides :

### Option A : Avec Node.js (Recommandé)
Si Node.js est installé sur votre machine, utilisez `npx` pour lancer un serveur léger instantané dans le dossier du projet :
```bash
npx serve .
# ou
npx http-server .
```
Ouvrez ensuite l'adresse locale affichée dans la console (ex: `http://localhost:3000`).

### Option B : Avec Python
Si vous avez Python d'installé :
```bash
# Python 3
python -m http.server 8000
```
Ouvrez ensuite `http://localhost:8000`.

### Option C : Avec l'extension VS Code (Live Server)
Si vous utilisez VS Code :
1.  Installez l'extension **Live Server** (par Ritwick Dey).
2.  Faites un clic droit sur le fichier `index.html`.
3.  Sélectionnez **Open with Live Server**.
