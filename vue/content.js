export const content = [
    {
        level: 1,
        type: "quiz",
        title: "Concepts Fondamentaux Vue 3",
        subtitle: "Validez vos connaissances sur la réactivité, les directives et le cycle de vie Vue.",
        challenges: [
            {
                question: "Quelle est la principale différence entre 'ref' et 'reactive' dans la Composition API de Vue 3 ?",
                options: [
                    "ref s'utilise uniquement pour les types primitifs (String, Number, etc.) tandis que reactive s'utilise pour les objets et tableaux.",
                    "reactive s'utilise pour tous les types mais nécessite .value pour être modifié dans le template.",
                    "ref enveloppe une valeur dans un objet réactif et s'accède via .value en JS, alors que reactive rend un objet directement réactif.",
                    "ref est obsolète dans Vue 3 et remplacé par reactive."
                ],
                correctIndex: 2,
                explanation: "La fonction 'ref' prend une valeur interne (primitive ou non) et renvoie un objet réactif mutable. Elle nécessite d'utiliser '.value' pour lire/écrire la valeur dans le code JavaScript (mais pas dans le template HTML). 'reactive' renvoie directement un proxy réactif de l'objet passé en argument."
            },
            {
                question: "Quelle directive Vue permet d'implémenter une liaison de données bidirectionnelle (two-way binding) ?",
                options: [
                    "v-bind",
                    "v-model",
                    "v-on",
                    "v-sync"
                ],
                correctIndex: 1,
                explanation: "La directive 'v-model' crée une liaison bidirectionnelle sur les éléments de saisie de formulaire ou les composants personnalisés. Elle synchronise automatiquement la valeur de l'élément HTML avec l'état de l'application."
            },
            {
                question: "Quelle est la différence fondamentale entre les directives 'v-if' et 'v-show' ?",
                options: [
                    "v-if est utilisé sur les composants alors que v-show est utilisé sur les balises HTML de base.",
                    "v-if détruit et recrée l'élément dans le DOM, tandis que v-show utilise la propriété CSS display pour masquer l'élément.",
                    "v-if s'exécute côté serveur tandis que v-show s'exécute uniquement côté client.",
                    "v-show ne supporte pas de bloc v-else."
                ],
                correctIndex: 1,
                explanation: "'v-if' a un coût plus élevé lors des basculements car il insère ou supprime réellement l'élément du DOM. 'v-show' est plus économique lors des basculements fréquents puisqu'il applique simplement le style CSS 'display: none' pour masquer l'élément."
            }
        ]
    },
    {
        level: 2,
        type: "blank",
        title: "Directives et Réactivité Vue",
        subtitle: "Complétez le code pour lier les données et réagir aux événements.",
        challenges: [
            {
                instruction: "Complétez le script setup pour déclarer une variable réactive 'message' initialisée à 'Hello World'.",
                code: "<script setup>\nimport { [[blank1]] } from 'vue';\n\nconst message = [[blank2]]('Hello World');\n</script>",
                blanks: ["ref", "ref"],
                explanation: "Pour utiliser la réactivité moderne dans Vue 3, on importe 'ref' de la bibliothèque 'vue' et on l'appelle pour instancier notre variable réactive."
            },
            {
                instruction: "Liez dynamiquement l'attribut HTML src à la variable imageSrc et écoutez le clic du bouton pour appeler la méthode load.",
                code: "<template>\n    <img [[blank1]]:src=\"imageSrc\" />\n    <button [[blank2]]:click=\"load\">Charger</button>\n</template>",
                blanks: ["v-bind", "v-on"],
                explanation: "'v-bind:attribut' (raccourci par ':') permet de lier dynamiquement un attribut HTML à une expression JS. 'v-on:evenement' (raccourci par '@') permet d'attacher un écouteur d'événement."
            },
            {
                instruction: "Déclarez une propriété calculée (computed property) qui retourne la version en majuscules du texte réactif.",
                code: "<script setup>\nimport { ref, [[blank1]] } from 'vue';\n\nconst text = ref('vuejs');\nconst upperText = [[blank2]](() => text.value.toUpperCase());\n</script>",
                blanks: ["computed", "computed"],
                explanation: "Le helper 'computed' permet de créer des propriétés dont la valeur est mise en cache et recalculée automatiquement uniquement lorsque leurs dépendances réactives (ici text.value) changent."
            }
        ]
    },
    {
        level: 3,
        type: "debug",
        title: "Correction de Bugs Vue 3",
        subtitle: "Détectez les erreurs fréquentes de manipulation d'état ou d'attributs.",
        challenges: [
            {
                instruction: "Dans ce script setup, le compteur n'incrémente pas car on a oublié une propriété spécifique d'une ref en JS. Corrigez la ligne concernée.",
                code: "<script setup>\nimport { ref } from 'vue';\n\nconst count = ref(0);\n\nfunction increment() {\n    count = count + 1;\n}\n</script>",
                errorLineIndex: 6,
                errorText: "    count = count + 1;",
                correctText: "    count.value = count.value + 1;",
                explanation: "Dans le bloc <script setup>, les variables réactives créées avec 'ref' sont encapsulées dans un objet. Pour lire ou modifier leur contenu en JavaScript, vous devez impérativement passer par la propriété '.value'."
            },
            {
                instruction: "Vue renvoie un avertissement dans la console lors de l'affichage de cette liste car la clé unique est mal spécifiée. Corrigez la directive v-for.",
                code: "<template>\n    <ul>\n        <li v-for=\"user in users\" key=\"user.id\">\n            { { user.name } }\n        </li>\n    </ul>\n</template>",
                errorLineIndex: 2,
                errorText: "        <li v-for=\"user in users\" key=\"user.id\">",
                correctText: "        <li v-for=\"user in users\" :key=\"user.id\">",
                explanation: "L'attribut 'key' attend une valeur dynamique issue de l'itération. Sans la directive 'v-bind' (ou son raccourci ':'), Vue évalue 'user.id' comme une simple chaîne de caractères statique identique pour tous les éléments, ce qui invalide son unicité."
            },
            {
                instruction: "L'utilisateur tente de modifier une propriété calculée directement, ce qui déclenche une erreur console. Corrigez la fonction pour modifier l'état d'origine à la place.",
                code: "<script setup>\nimport { ref, computed } from 'vue';\nconst basePrice = ref(100);\nconst totalPrice = computed(() => basePrice.value * 1.2);\n\nfunction resetPrice() {\n    totalPrice.value = 0;\n}\n</script>",
                errorLineIndex: 6,
                errorText: "    totalPrice.value = 0;",
                correctText: "    basePrice.value = 0;",
                explanation: "Les propriétés calculées (computed) sont par défaut en lecture seule (read-only). Pour changer indirectement leur résultat, vous devez modifier la ou les dépendances réactives d'origine dont elles dépendent (ici basePrice)."
            }
        ]
    },
    {
        level: 4,
        type: "reorder",
        title: "Structure de Composant Vue",
        subtitle: "Réorganisez les déclarations pour obtenir un composant Vue 3 valide.",
        challenges: [
            {
                instruction: "Ordonnez les étapes pour configurer un composant avec des props, des variables et une fonction réactive.",
                lines: [
                    "<script setup>",
                    "import { ref } from 'vue';",
                    "const props = defineProps(['initial']);",
                    "const state = ref(props.initial);",
                    "function reset() { state.value = props.initial; }",
                    "</script>",
                    "<template>",
                    "  <button @click=\"reset\">Reset ({ { state } })</button>",
                    "</template>"
                ],
                correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                explanation: "Dans les composants mono-fichiers Vue (SFC), l'usage standard consiste à positionner d'abord le bloc <script setup> (avec imports, props et déclarations d'état), puis le bloc <template> décrivant la vue."
            },
            {
                instruction: "Ordonnez les lignes pour configurer un écouteur de cycle de vie onMounted chargeant des données depuis une API.",
                lines: [
                    "import { ref, onMounted } from 'vue';",
                    "const items = ref([]);",
                    "onMounted(async () => {",
                    "  const response = await fetch('/api/items');",
                    "  items.value = await response.json();",
                    "});"
                ],
                correctOrder: [0, 1, 2, 3, 4, 5],
                explanation: "Il faut d'abord importer les helpers de Vue, déclarer le conteneur réactif (items), puis déclarer le callback du hook onMounted pour y charger les données de façon asynchrone."
            },
            {
                instruction: "Réorganisez la déclaration pour définir des événements émis (emits) par un composant enfant.",
                lines: [
                    "<script setup>",
                    "const emit = defineEmits(['close', 'confirm']);",
                    "function handleConfirm() {",
                    "  emit('confirm', { status: 'success' });",
                    "}",
                    "</script>"
                ],
                correctOrder: [0, 1, 2, 3, 4, 5],
                explanation: "Le macro-compilateur 'defineEmits' doit être appelé au plus haut niveau de <script setup> pour déclarer les événements que le composant est capable d'émettre vers son parent."
            }
        ]
    },
    {
        level: 5,
        type: "project",
        title: "Mini-Projet : Compteur de Caractères",
        subtitle: "Créez une zone de texte réactive avec décompte de caractères restants et indicateur visuel de dépassement.",
        challenges: [
            {
                step: 1,
                title: "Déclaration du State de Saisie",
                description: "Dans le bloc script setup, déclarez une ref 'text' pour stocker la saisie utilisateur et fixez la limite maximale à 140 caractères.",
                code: "<script setup>\nimport { ref } from 'vue';\n\nconst text = [[blank]]('');\nconst maxLength = 140;",
                blankInput: "ref",
                explanation: "Nous utilisons ref('') pour créer une variable réactive initialisée par une chaîne de caractères vide."
            },
            {
                step: 2,
                title: "Calcul des Caractères Restants",
                description: "Calculez le nombre de caractères restants à l'aide d'une computed property appelée 'charsLeft'.",
                code: "import { computed } from 'vue';\n\nconst charsLeft = computed(() => {\n    return maxLength - text.[[blank]];\n});\n</script>",
                blankInput: "value.length",
                explanation: "Puisque 'text' est une ref, nous devons accéder à sa valeur avec '.value' et mesurer sa longueur avec '.length'."
            },
            {
                step: 3,
                title: "Liaison de Données Bidirectionnelle dans le Template",
                description: "Dans le template, liez la zone de texte à notre ref 'text' et affichez dynamiquement le nombre restant.",
                code: "<template>\n    <textarea [[blank]]=\"text\"></textarea>\n    <p>Restant : { { charsLeft } }</p>\n</template>",
                blankInput: "v-model",
                explanation: "La directive v-model permet de synchroniser automatiquement le contenu saisi dans le textarea avec l'état 'text'."
            }
        ]
    }
];
