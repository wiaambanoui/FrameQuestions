export const content = [
    {
        level: 1,
        type: "quiz",
        title: "Concepts Fondamentaux Node.js",
        subtitle: "Validez vos bases sur l'Event Loop, les modules et les opérations asynchrones.",
        challenges: [
            {
                question: "Qu'est-ce que l'architecture non-bloquante (Asynchronous I/O) dans Node.js ?",
                options: [
                    "Une mécanique où chaque utilisateur connecté crée un nouveau thread système dédié.",
                    "Un système qui bloque l'exécution globale jusqu'à ce que les accès fichiers soient complétés.",
                    "Un modèle mono-thread qui délègue les tâches lourdes (I/O) au système d'exploitation et utilise des callbacks/promesses pour ne pas bloquer le thread principal.",
                    "Une limitation technique qui empêche Node.js de faire des calculs mathématiques."
                ],
                correctIndex: 2,
                explanation: "Node.js est construit sur un modèle mono-thread avec boucle d'événements (Event Loop). Au lieu de bloquer l'exécution en attendant la fin d'une requête réseau ou d'une lecture de fichier, Node.js délègue ces opérations d'I/O au système d'exploitation sous-jacent et reprend le traitement des autres tâches. Une fois l'opération d'I/O terminée, son callback est placé dans la file d'attente pour être exécuté."
            },
            {
                question: "Quelle syntaxe représente l'importation d'un module sous le standard d'origine CommonJS ?",
                options: [
                    "import fs from 'fs';",
                    "const fs = require('fs');",
                    "include('fs');",
                    "require.import('fs');"
                ],
                correctIndex: 1,
                explanation: "Dans le système de modules historique de Node.js appelé CommonJS (CJS), l'importation de paquets ou de fichiers se fait avec la fonction globale `require()`. L'équivalent moderne dans les modules ES (ESM) est la directive `import`."
            },
            {
                question: "Quel module natif de Node.js permet de manipuler les chemins de fichiers de manière multiplateforme ?",
                options: [
                    "fs",
                    "path",
                    "url",
                    "os"
                ],
                correctIndex: 1,
                explanation: "Le module natif 'path' fournit des utilitaires très pratiques pour travailler avec les chemins de fichiers et de répertoires de manière compatible avec tous les systèmes d'exploitation (Windows utilisant des backslashes `\\` et Unix/macOS des slashes `/`)."
            }
        ]
    },
    {
        level: 2,
        type: "blank",
        title: "Modules et Serveur HTTP Node.js",
        subtitle: "Complétez le code pour lire des fichiers et configurer des serveurs HTTP.",
        challenges: [
            {
                instruction: "Complétez ce code pour importer le module de système de fichiers (File System) avec les promesses et lire un fichier.",
                code: "const fs = require('fs').[[blank1]];\n\nfs.readFile('data.txt', 'utf-8')\n    .then(content => console.log(content))\n    .catch(err => console.error([[blank2]]));",
                blanks: ["promises", "err"],
                explanation: "En CommonJS, on peut accéder à l'API basée sur les promesses de 'fs' en appelant la propriété '.promises'. Le bloc `.catch` intercepte l'erreur 'err' s'il y a un problème de lecture."
            },
            {
                instruction: "Utilisez le module HTTP natif de Node.js pour créer un serveur écoutant sur le port 3000.",
                code: "const http = require('http');\n\nconst server = http.[[blank1]]((req, res) => {\n    res.end('Hello');\n});\n\nserver.listen([[blank2]], () => console.log('Prêt !'));",
                blanks: ["createServer", "3000"],
                explanation: "La méthode `http.createServer()` instancie un nouveau serveur web natif. La méthode `server.listen(port)` le met en écoute sur le port réseau indiqué."
            },
            {
                instruction: "Configurez une route Express.js qui répond à une requête GET sur le chemin '/api/status'.",
                code: "const express = require('express');\nconst app = express();\n\napp.[[blank1]]('/api/status', (req, [[blank2]]) => {\n    res.json({ ok: true });\n});",
                blanks: ["get", "res"],
                explanation: "Pour écouter des requêtes GET, on utilise `app.get()`. Le second argument est un callback qui reçoit l'objet requête `req` et l'objet réponse `res` (utilisé pour renvoyer du JSON via `res.json()`)."
            }
        ]
    },
    {
        level: 3,
        type: "debug",
        title: "Résolution d'Erreurs Express et Asynchrone",
        subtitle: "Trouvez pourquoi le serveur Express se bloque ou renvoie des erreurs.",
        challenges: [
            {
                instruction: "Ce middleware d'Express vérifie une clé API mais bloque indéfiniment la requête lorsque la clé est valide car une fonction essentielle n'est pas invoquée. Corrigez la ligne.",
                code: "const express = require('express');\nconst app = express();\n\napp.use((req, res, next) => {\n    if (req.headers['x-api-key'] === 'secret') {\n        next;\n    } else {\n        res.status(401).send('Unauthorized');\n    }\n});",
                errorLineIndex: 6,
                errorText: "        next;",
                correctText: "        next();",
                explanation: "Un middleware Express doit impérativement appeler la fonction `next()` (en l'invoquant avec des parenthèses) pour transmettre le contrôle au middleware suivant de la pile. Sans cela, le serveur considère la requête comme en attente perpétuelle et le client finit par recevoir un timeout."
            },
            {
                instruction: "Le développeur essaie de lire un fichier de configuration de manière asynchrone, mais tente de retourner le contenu de manière synchrone, ce qui renvoie 'undefined'. Corrigez la fonction pour utiliser le flux synchrone natif.",
                code: "const fs = require('fs');\n\nfunction readConfig() {\n    fs.readFile('config.json', 'utf8', (err, data) => {\n        return data;\n    });\n}",
                errorLineIndex: 4,
                errorText: "    fs.readFile('config.json', 'utf8', (err, data) => {",
                correctText: "    return fs.readFileSync('config.json', 'utf8');",
                explanation: "La méthode `fs.readFile()` est asynchrone et ne renvoie rien directement (son callback traite le résultat plus tard). Si l'on souhaite absolument renvoyer la valeur immédiatement de manière synchrone, il faut utiliser la fonction bloquante `fs.readFileSync()`."
            },
            {
                instruction: "Ce script Express définit des routes mais ne démarre jamais l'écoute, rendant le serveur injoignable. Ajoutez la méthode d'écoute sur le port 8080.",
                code: "const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => {\n    res.send('Welcome');\n});\n\n// Activer l'écoute ici",
                errorLineIndex: 8,
                errorText: "// Activer l'écoute ici",
                correctText: "app.listen(8080);",
                explanation: "Définir des routes ne suffit pas à rendre le serveur Express fonctionnel. Il faut appeler explicitement la méthode `app.listen(port)` pour lier l'application à un port réseau et commencer à écouter les requêtes entrantes."
            }
        ]
    },
    {
        level: 4,
        type: "reorder",
        title: "Flux d'Événements et Pipelines Node.js",
        subtitle: "Remettez les lignes dans le bon ordre pour configurer des flux réseau ou middleware.",
        challenges: [
            {
                instruction: "Ordonnez les étapes pour configurer un serveur Express de base avec un parser JSON et une route.",
                lines: [
                    "const express = require('express');",
                    "const app = express();",
                    "app.use(express.json());",
                    "app.post('/user', (req, res) => {",
                    "  res.status(201).send(req.body);",
                    "});",
                    "app.listen(3000);"
                ],
                correctOrder: [0, 1, 2, 3, 4, 5, 6],
                explanation: "Pour configurer Express correctement, on importe le module, instancie l'application, configure le middleware de parsing JSON avant les définitions de routes (pour que le body soit analysé), déclare les endpoints et enfin, démarre le serveur."
            },
            {
                instruction: "Ordonnez les lignes pour implémenter un flux (Readable Stream) lisant un gros fichier et l'écrivant dans un fichier de sortie.",
                lines: [
                    "const fs = require('fs');",
                    "const readStream = fs.createReadStream('input.txt');",
                    "const writeStream = fs.createWriteStream('output.txt');",
                    "readStream.pipe(writeStream);",
                    "readStream.on('end', () => {",
                    "  console.log('Copie terminée');",
                    "});"
                ],
                correctOrder: [0, 1, 2, 3, 4, 5, 6],
                explanation: "Les streams permettent de traiter de grandes quantités de données par morceaux (chunks). On crée un flux de lecture, un flux d'écriture, on les connecte via la méthode `pipe()`, puis on écoute l'événement 'end' pour être averti de la fin du transfert."
            },
            {
                instruction: "Ordonnez les étapes pour charger des variables d'environnement depuis un fichier '.env' de manière sécurisée en Node.js.",
                lines: [
                    "require('dotenv').config();",
                    "const port = process.env.PORT || 5000;",
                    "const dbUrl = process.env.DATABASE_URL;",
                    "if (!dbUrl) {",
                    "  console.error('Base de données manquante !');",
                    "  process.exit(1);",
                    "}"
                ],
                correctOrder: [0, 1, 2, 3, 4, 5, 6],
                explanation: "Il faut exécuter la configuration dotenv en premier pour charger les variables. Ensuite, on récupère le port avec une valeur par défaut, puis l'URL de base de données. Si celle-ci est absente, on affiche une erreur et stoppe le processus avec `process.exit(1)`."
            }
        ]
    },
    {
        level: 5,
        type: "project",
        title: "Mini-Projet : API REST Express Sécurisée",
        subtitle: "Créez un endpoint Express sécurisé qui reçoit des données utilisateur en JSON, valide leur présence et renvoie un statut 201.",
        challenges: [
            {
                step: 1,
                title: "Création de l'application et import",
                description: "Importez express et créez une instance de l'application.",
                code: "const [[blank1]] = require('express');\nconst app = [[blank2]]();",
                blankInput: "express",
                explanation: "On commence par charger Express via require('express') puis on instancie l'application en invoquant express()."
            },
            {
                step: 2,
                title: "Configuration du Middleware JSON",
                description: "Configurez l'application Express pour qu'elle décode automatiquement les corps de requêtes (request body) formatés en JSON.",
                code: "app.use(express.[[blank]]);",
                blankInput: "json()",
                explanation: "Le middleware intégré 'express.json()' parse le corps des requêtes HTTP entrantes contenant du JSON, le rendant disponible dans 'req.body'."
            },
            {
                step: 3,
                title: "Déclaration de la Route de Création",
                description: "Créez une route POST '/users' qui valide la présence du champ 'username' dans le body. Si présent, renvoyez un code 201 avec l'utilisateur créé.",
                code: "app.post('/users', (req, res) => {\n    const { username } = req.body;\n    if (!username) {\n        return res.status(400).send('Nom requis');\n    }\n    res.status([[blank1]]).json({ id: 1, username });\n});",
                blankInput: "201",
                explanation: "Le statut HTTP 201 Created indique qu'une ressource (ici l'utilisateur) a été créée avec succès sur le serveur."
            }
        ]
    }
];
