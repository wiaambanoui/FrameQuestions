export const content = [
    {
        level: 1,
        type: "quiz",
        title: "Concepts Fondamentaux Angular",
        subtitle: "Validez vos compétences sur les composants, l'injection de dépendances et les signaux.",
        challenges: [
            {
                question: "À quoi sert le décorateur '@Component' en Angular ?",
                options: [
                    "À transformer une classe TypeScript en un composant avec des métadonnées comme son sélecteur, son template HTML et ses styles CSS.",
                    "À configurer les requêtes HTTP asynchrones vers le serveur backend.",
                    "À générer un fichier de configuration Webpack lors de la compilation.",
                    "À déclarer un service pouvant être injecté dans d'autres classes."
                ],
                correctIndex: 0,
                explanation: "Le décorateur '@Component' est crucial en Angular. Il se place juste au-dessus d'une classe TypeScript pour y attacher des métadonnées de configuration nécessaires à l'initialisation du composant, telles que son sélecteur HTML ('selector'), son template ('template' ou 'templateUrl') et ses styles CSS."
            },
            {
                question: "Avec les Angular Signals introduits récemment, comment lit-on la valeur d'un signal 'count' dans le code TypeScript ?",
                options: [
                    "En accédant directement à la propriété : count.value",
                    "En appelant le signal comme une fonction sans argument : count()",
                    "En utilisant le service de réactivité : this.signals.get(count)",
                    "En appliquant le pipe async : count | async"
                ],
                correctIndex: 1,
                explanation: "Un Signal Angular est une fonction réactive. Pour lire sa valeur courante et enregistrer le contexte d'exécution comme consommateur du signal, il faut appeler la fonction représentant le signal sans aucun argument, c'est-à-dire 'count()'."
            },
            {
                question: "Comment fonctionne le système d'injection de dépendances (DI) d'Angular pour fournir un service ?",
                options: [
                    "Les services doivent être instanciés manuellement avec le mot-clé 'new' dans chaque composant.",
                    "Angular recherche les services dans les fichiers HTML pour les instancier.",
                    "Angular fournit un injecteur qui résout et fournit les dépendances requises d'une classe via son constructeur ou la fonction inject().",
                    "Les dépendances sont importées uniquement via le fichier angular.json."
                ],
                correctIndex: 2,
                explanation: "Angular utilise un puissant système d'injection de dépendances hiérarchique. Au lieu d'instancier manuellement des classes (couplage fort), le framework injecte les instances de services nécessaires (généralement des singletons) via le constructeur de la classe ou le helper inject()."
            }
        ]
    },
    {
        level: 2,
        type: "blank",
        title: "Syntaxe et Templates Angular",
        subtitle: "Complétez les syntaxes TypeScript et templates d'un composant moderne.",
        challenges: [
            {
                instruction: "Complétez la déclaration de ce composant autonome (standalone) pour y inclure la métadonnée d'import requise pour utiliser CommonModule.",
                code: "@Component({\n    selector: 'app-user',\n    [[blank1]]: true,\n    imports: [[[blank2]]],\n    template: '<p>User</p>'\n})\nexport class UserComponent {}",
                blanks: ["standalone", "CommonModule"],
                explanation: "Dans l'architecture moderne d'Angular, les composants sont par défaut 'standalone: true'. Pour utiliser les fonctionnalités standards (comme les anciennes directives ou les pipes), on les importe dans le tableau 'imports'."
            },
            {
                instruction: "Déclarez une propriété d'entrée (input) à l'aide du décorateur approprié pour recevoir le nom d'un produit depuis un composant parent.",
                code: "import { Component, [[blank1]] } from '@angular/core';\n\n@Component({ selector: 'app-prod' })\nexport class ProductComponent {\n    @ [[blank2]]() productName: string = '';\n}",
                blanks: ["Input", "Input"],
                explanation: "Le décorateur '@Input()' (qui s'importe depuis '@angular/core') permet de marquer un champ de classe comme une propriété d'entrée, permettant ainsi au parent de lui lier des valeurs via le property binding dans le template HTML."
            },
            {
                instruction: "Associez un événement de clic à la méthode 'saveProduct()' dans le template HTML d'un bouton.",
                code: "<button [[blank1]]=\"[[blank2]]()\">Enregistrer</button>",
                blanks: ["(click)", "saveProduct"],
                explanation: "En Angular, l'écoute d'événements (Event Binding) s'effectue en entourant le nom de l'événement HTML par des parenthèses, ex: '(click)', et en lui affectant l'appel de la méthode cible."
            }
        ]
    },
    {
        level: 3,
        type: "debug",
        title: "Correction de Bugs Angular",
        subtitle: "Résolvez les erreurs classiques d'importation, de signaux ou d'injection.",
        challenges: [
            {
                instruction: "Dans ce template, le développeur tente d'afficher la valeur du signal 'count' mais n'obtient que la référence de la fonction dans la vue. Corrigez le template.",
                code: "import { Component, signal } from '@angular/core';\n\n@Component({\n    selector: 'app-counter',\n    standalone: true,\n    template: '<h1>Valeur : { { count } }</h1>'\n})\nexport class CounterComponent {\n    count = signal(0);\n}",
                errorLineIndex: 6,
                errorText: "    template: '<h1>Valeur : { { count } }</h1>'",
                correctText: "    template: '<h1>Valeur : { { count() } }</h1>'",
                explanation: "Les signaux Angular sont des fonctions d'accès (getter functions). Dans le template HTML, comme en TypeScript, vous devez invoquer le signal avec des parenthèses `count()` pour en extraire la valeur réactive courante."
            },
            {
                instruction: "Ce composant standalone utilise l'ancienne directive structurelle '*ngIf' mais lève une erreur car la directive n'est pas déclarée au niveau du composant. Corrigez le tableau imports.",
                code: "import { Component } from '@angular/core';\n\n@Component({\n    selector: 'app-admin',\n    standalone: true,\n    imports: [],\n    template: '<div *ngIf=\"isAdmin\">Admin Panel</div>'\n})\nexport class AdminComponent {\n    isAdmin = true;\n}",
                errorLineIndex: 6,
                errorText: "    imports: [],",
                correctText: "    imports: [NgIf],",
                explanation: "Pour utiliser des directives structurelles classiques comme '*ngIf' ou '*ngFor' dans un composant standalone, vous devez explicitement les importer individuellement (ex: `NgIf` ou `NgFor`) ou importer le `CommonModule` dans le tableau 'imports' du décorateur."
            },
            {
                instruction: "L'injecteur Angular lève une erreur car la classe 'UserService' est injectée dans le composant mais le décorateur Injectable de celle-ci ne déclare pas où elle est disponible. Corrigez le décorateur du service.",
                code: "import { Injectable } from '@angular/core';\n\n@Injectable()\nexport class UserService {\n    getUsername() { return 'Alex'; }\n}",
                errorLineIndex: 3,
                errorText: "@Injectable()",
                correctText: "@Injectable({ providedIn: 'root' })",
                explanation: "Pour rendre un service injecttable globalement (en tant que singleton), vous devez le configurer avec `@Injectable({ providedIn: 'root' })`. Cela évite d'avoir à l'enregistrer manuellement dans les providers d'un module ou d'un composant."
            }
        ]
    },
    {
        level: 4,
        type: "reorder",
        title: "Cycle d'Injection et Signaux Angular",
        subtitle: "Ordonnez les étapes de configuration de services et de composants.",
        challenges: [
            {
                instruction: "Réordonnez les lignes pour créer un service injecté qui expose un signal en lecture seule.",
                lines: [
                    "@Injectable({ providedIn: 'root' })",
                    "export class DataService {",
                    "  private _status = signal('idle');",
                    "  public status = this._status.asReadonly();",
                    "  setStatus(newStatus: string) {",
                    "    this._status.set(newStatus);",
                    "  }",
                    "}"
                ],
                correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
                explanation: "Pour une bonne encapsulation en Angular avec les Signaux, on déclare un signal privé mutable `_status`, on expose sa version en lecture seule via `asReadonly()` pour l'extérieur, puis on fournit une méthode publique pour le modifier."
            },
            {
                instruction: "Ordonnez la configuration d'un composant standalone qui injecte le service précédemment créé via le helper inject().",
                lines: [
                    "@Component({",
                    "  selector: 'app-status',",
                    "  standalone: true,",
                    "  template: '<p>Statut : { { status() } }</p>'",
                    "})",
                    "export class StatusComponent {",
                    "  private dataService = inject(DataService);",
                    "  status = this.dataService.status;",
                    "}"
                ],
                correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                explanation: "On définit d'abord le composant avec ses métadonnées, puis dans la classe TypeScript, on injecte le service à l'aide de la fonction 'inject()' au niveau des propriétés de classe, avant d'exposer le signal du service."
            },
            {
                instruction: "Ordonnez l'utilisation du nouveau Control Flow `@if` / `@else` dans un template Angular v17+.",
                lines: [
                    "@if (loading) {",
                    "  <p>Chargement en cours...</p>",
                    "} @else if (error) {",
                    "  <p>Une erreur est survenue.</p>",
                    "} @else {",
                    "  <p>Données prêtes !</p>",
                    "}"
                ],
                correctOrder: [0, 1, 2, 3, 4, 5, 6],
                explanation: "Le nouveau control flow Angular utilise la syntaxe intégrée à base d'arobases `@if`, `@else if` et `@else`. Cette syntaxe remplace l'usage de `*ngIf` et offre de meilleures performances sans nécessiter d'imports de directives."
            }
        ]
    },
    {
        level: 5,
        type: "project",
        title: "Mini-Projet : Fiche Produit Dynamique",
        subtitle: "Créez un composant standalone qui affiche un produit et gère un compteur de quantité réactif avec des Signaux.",
        challenges: [
            {
                step: 1,
                title: "Déclaration du Signal Quantité",
                description: "Dans la classe du composant ProductCard, déclarez un signal appelé 'quantity' initialisé à 1.",
                code: "import { Component, signal } from '@angular/core';\n\n@Component({\n    selector: 'app-product-card',\n    standalone: true\n})\nexport class ProductCardComponent {\n    quantity = [[blank]](1);",
                blankInput: "signal",
                explanation: "Nous utilisons le constructeur 'signal' pour créer un signal réactif contenant la valeur numérique initiale 1."
            },
            {
                step: 2,
                title: "Incrémentation Réactive",
                description: "Écrivez la méthode 'updateQuantity()' pour mettre à jour la valeur actuelle en l'incrémentant de 1.",
                code: "    updateQuantity() {\n        this.quantity.[[blank]](val => val + 1);\n    }",
                blankInput: "update",
                explanation: "La méthode '.update()' d'un Signal permet de modifier sa valeur en lui passant une fonction de mise à jour basée sur la valeur courante."
            },
            {
                step: 3,
                title: "Nouveau Control Flow dans le Template",
                description: "Dans la métadonnée template du composant, utilisez le nouveau control flow Angular pour afficher un message si la quantité dépasse 5.",
                code: "    template: `\n        <h3>Quantité : { { quantity() } }</h3>\n        <button (click)=\"updateQuantity()\">+</button>\n        [[blank]] (quantity() > 5) {\n            <p>Stock maximum atteint</p>\n        }\n    `\n}",
                blankInput: "@if",
                explanation: "Le nouveau control flow de template Angular utilise la syntaxe `@if (condition) { ... }` sans nécessiter l'import de NgIf."
            }
        ]
    }
];
