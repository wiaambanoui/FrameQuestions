export const content = [
    {
        level: 1,
        type: "quiz",
        title: "Concepts Fondamentaux React",
        subtitle: "Validez vos connaissances sur le Virtual DOM, les composants et les props.",
        challenges: [
            {
                question: "Qu'est-ce que le Virtual DOM en React ?",
                options: [
                    "Une copie légère en mémoire du DOM réel que React synchronise avec le DOM réel via le processus de réconciliation.",
                    "Un navigateur web virtuel utilisé uniquement pour exécuter les tests unitaires React.",
                    "Une API HTML5 spéciale qui accélère le chargement des scripts JS.",
                    "Le DOM généré directement par Node.js côté serveur."
                ],
                correctIndex: 0,
                explanation: "Le Virtual DOM est une représentation virtuelle du DOM réel conservée en mémoire. Lorsque l'état change, React met à jour cette structure en premier, calcule les différences (diffing) et applique uniquement les modifications nécessaires au DOM réel, ce qui optimise les performances."
            },
            {
                question: "Laquelle de ces règles sur les Hooks React est correcte ?",
                options: [
                    "Les Hooks peuvent être appelés dans des conditions (if) ou des boucles (for).",
                    "Les Hooks doivent uniquement être appelés au niveau le plus haut (top level) d'une fonction composant React.",
                    "Les Hooks peuvent être déclarés dans des fonctions JavaScript standards qui ne sont pas des composants.",
                    "Les Hooks doivent être appelés après le return du composant."
                ],
                correctIndex: 1,
                explanation: "Les Hooks React ne doivent être appelés qu'au niveau le plus haut des fonctions de composants (ou d'autres hooks personnalisés). Vous ne devez pas les appeler à l'intérieur de boucles, de conditions, ou de fonctions imbriquées pour garantir que React préserve correctement leur ordre d'exécution à chaque rendu."
            },
            {
                question: "Pourquoi est-il nécessaire d'utiliser la prop 'key' lors du rendu d'une liste de composants ?",
                options: [
                    "Pour appliquer des styles CSS uniques à chaque élément.",
                    "Pour indiquer à React la priorité de chargement des composants de la liste.",
                    "Pour aider React à identifier quels éléments ont été modifiés, ajoutés ou supprimés, optimisant ainsi le rendu.",
                    "Pour lier automatiquement les événements d'écoute aux composants enfants."
                ],
                correctIndex: 2,
                explanation: "La prop 'key' aide React à identifier de manière stable chaque élément d'une liste. Cela permet au moteur de réconciliation de React de réordonner ou de mettre à jour le DOM existant de manière efficace au lieu de détruire et recréer entièrement les éléments de la liste."
            }
        ]
    },
    {
        level: 2,
        type: "blank",
        title: "Complétion de Syntaxe React",
        subtitle: "Complétez le code pour valider la création de composants et l'usage de hooks.",
        challenges: [
            {
                instruction: "Complétez ce composant fonctionnel simple pour qu'il reçoive la prop 'name' et l'affiche.",
                code: "function Welcome([[blank1]]) {\n    return <h1>Bonjour, {[[blank2]].name}</h1>;\n}",
                blanks: ["props", "props"],
                explanation: "Dans les composants fonctionnels, les attributs passés au composant sont regroupés dans un objet unique généralement nommé 'props', reçu comme premier paramètre de la fonction."
            },
            {
                instruction: "Importez le Hook nécessaire pour gérer un état local dans ce composant.",
                code: "import React, { [[blank1]] } from 'react';\n\nfunction Counter() {\n    const [count, setCount] = [[blank2]](0);\n    return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}",
                blanks: ["useState", "useState"],
                explanation: "Le Hook 'useState' est utilisé pour ajouter un état local à un composant fonctionnel React. Il retourne une paire : la valeur de l'état actuel et une fonction pour la mettre à jour."
            },
            {
                instruction: "Initialisez un effet secondaire qui s'exécute uniquement après le premier rendu (montage).",
                code: "import React, { useEffect } from 'react';\n\nfunction ApiLoader() {\n    useEffect(() => {\n        fetchData();\n    }, [[blank1]]);\n    return <div>Chargement...</div>;\n}",
                blanks: ["[]"],
                explanation: "Passer un tableau de dépendances vide '[]' à 'useEffect' indique à React que l'effet ne dépend d'aucune variable de scope et ne doit donc s'exécuter qu'une seule fois au montage du composant."
            }
        ]
    },
    {
        level: 3,
        type: "debug",
        title: "Chasse aux Bugs React",
        subtitle: "Trouvez et corrigez l'erreur de logique ou de syntaxe dans chaque snippet.",
        challenges: [
            {
                instruction: "Ce bouton ne met pas à jour le compteur car le state est modifié directement. Corrigez la ligne avec le setter approprié.",
                code: "import React, { useState } from 'react';\n\nfunction BuggyCounter() {\n    const [count, setCount] = useState(0);\n    return (\n        <button onClick={() => count = count + 1}>\n            Nombre : {count}\n        </button>\n    );\n}",
                errorLineIndex: 5,
                errorText: "<button onClick={() => count = count + 1}>",
                correctText: "<button onClick={() => setCount(count + 1)}>",
                explanation: "En React, le state est immuable. Vous ne devez jamais modifier directement une variable d'état (ex: count = count + 1). Utilisez toujours la fonction de modification associée (setCount) pour notifier React du changement et déclencher un nouveau rendu."
            },
            {
                instruction: "Cet effet entraîne une boucle infinie de rendus. Corrigez le tableau de dépendances de useEffect pour qu'il ne dépende pas de ce qu'il met à jour sans contrôle.",
                code: "import React, { useState, useEffect } from 'react';\n\nfunction Timer() {\n    const [seconds, setSeconds] = useState(0);\n    useEffect(() => {\n        const interval = setInterval(() => {\n            setSeconds(s => s + 1);\n        }, 1000);\n        return () => clearInterval(interval);\n    }, [seconds]);\n    return <div>Temps : {seconds}s</div>;\n}",
                errorLineIndex: 9,
                errorText: "}, [seconds]);",
                correctText: "}, []);",
                explanation: "Puisque nous mettons à jour l'état à l'aide d'une fonction de mise à jour fonctionnelle `setSeconds(s => s + 1)`, l'intervalle n'a pas besoin de recréer l'effet à chaque changement de 'seconds'. En passant un tableau de dépendances vide `[]`, l'intervalle est créé une seule fois au montage du composant."
            },
            {
                instruction: "React refuse d'afficher ce composant car son nom est mal formaté. Corrigez la ligne de déclaration.",
                code: "import React from 'react';\n\nfunction userProfile(props) {\n    return <div>Utilisateur : {props.username}</div>;\n}\n\nexport default userProfile;",
                errorLineIndex: 2,
                errorText: "function userProfile(props) {",
                correctText: "function UserProfile(props) {",
                explanation: "En React, les composants personnalisés doivent impérativement commencer par une lettre majuscule (PascalCase). Si un nom commence par une minuscule, React le traitera comme une balise HTML native (comme <div> ou <span>) et lèvera une erreur ou ne l'affichera pas."
            }
        ]
    },
    {
        level: 4,
        type: "reorder",
        title: "Logique d'Ordonnancement React",
        subtitle: "Remettez les lignes dans le bon ordre pour structurer des flux React valides.",
        challenges: [
            {
                instruction: "Réorganisez les lignes pour créer un composant Toggle qui alterne un booléen.",
                lines: [
                    "function Toggle() {",
                    "  const [isOn, setIsOn] = useState(false);",
                    "  return (",
                    "    <button onClick={() => setIsOn(!isOn)}>",
                    "      {isOn ? 'ON' : 'OFF'}",
                    "    </button>",
                    "  );",
                    "}"
                ],
                correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
                explanation: "L'ordre logique d'un composant React comprend la déclaration de la fonction, la définition de son état interne via useState, puis l'instruction return retournant l'arbre JSX avec les handlers d'événements appropriés."
            },
            {
                instruction: "Réorganisez les lignes pour implémenter un fetch de données asynchrone sécurisé dans un composant.",
                lines: [
                    "useEffect(() => {",
                    "  let isMounted = true;",
                    "  fetch('/api/data')",
                    "    .then(res => res.json())",
                    "    .then(data => {",
                    "      if (isMounted) setData(data);",
                    "    });",
                    "  return () => { isMounted = false; };",
                    "}, []);"
                ],
                correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                explanation: "Cet effet met en place une variable locale 'isMounted' pour éviter les fuites de mémoire (memory leaks) si la promesse asynchrone se résout après le démontage du composant. La fonction de nettoyage (cleanup function) passe cette variable à false au démontage."
            },
            {
                instruction: "Ordonnez les étapes de la création d'un Hook personnalisé de tracking de largeur d'écran.",
                lines: [
                    "function useWindowWidth() {",
                    "  const [width, setWidth] = useState(window.innerWidth);",
                    "  useEffect(() => {",
                    "    const handleResize = () => setWidth(window.innerWidth);",
                    "    window.addEventListener('resize', handleResize);",
                    "    return () => window.removeEventListener('resize', handleResize);",
                    "  }, []);",
                    "  return width;",
                    "}"
                ],
                correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                explanation: "Un hook personnalisé commence par 'use', définit un état pour stocker la dimension, écoute l'événement 'resize' au montage avec nettoyage correct au démontage, puis renvoie la valeur de l'état."
            }
        ]
    },
    {
        level: 5,
        type: "project",
        title: "Mini-Projet : Compteur Incrémentiel Moderne",
        subtitle: "Créez un composant de compteur dynamique avec limite et message d'avertissement.",
        challenges: [
            {
                step: 1,
                title: "Initialisation du State et de la Limite",
                description: "Nous voulons un compteur qui ne peut pas dépasser 5. Remplissez le trou pour initialiser le hook de statut 'count' à 0.",
                code: "import React, { useState } from 'react';\n\nfunction LimitedCounter() {\n    const [count, setCount] = [[blank]](0);\n    const limit = 5;",
                blankInput: "useState",
                explanation: "Pour créer un état réactif en React, on utilise useState, que l'on initialise ici à la valeur 0."
            },
            {
                step: 2,
                title: "Logique de Sécurité à l'Incrémentation",
                description: "Empêchons l'incrémentation si la limite est atteinte. Complétez la fonction d'incrémentation pour appeler 'setCount' de manière conditionnelle.",
                code: "    const increment = () => {\n        if (count < limit) {\n            [[blank]](count + 1);\n        }\n    };",
                blankInput: "setCount",
                explanation: "Pour modifier l'état count de façon sécurisée, nous appelons la fonction de mise à jour setCount."
            },
            {
                step: 3,
                title: "Affichage Conditionnel de l'Avertissement",
                description: "Si le compteur atteint 5, nous affichons un message d'alerte. Complétez le JSX pour afficher conditionnellement le message d'avertissement.",
                code: "    return (\n        <div>\n            <h2>Valeur : {count}</h2>\n            <button onClick={increment}>+</button>\n            {count === limit && [[blank]]}\n        </div>\n    );\n}",
                blankInput: "<p>Limite atteinte !</p>",
                explanation: "En JSX, l'opérateur logique && permet un rendu conditionnel. Si le terme de gauche est vrai, le terme de droite (le paragraphe d'erreur) est évalué et rendu dans le DOM."
            }
        ]
    }
];
