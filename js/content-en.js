/**
 * English overlay for pedagogical text. Code snippets stay in the FR source files.
 */

export const contentEn = {
    react: [
        {
            title: 'React Fundamentals',
            subtitle: 'Check your knowledge of the Virtual DOM, components and props.',
            challenges: [
                {
                    question: 'What is the Virtual DOM in React?',
                    options: [
                        'A lightweight in-memory copy of the real DOM that React syncs through reconciliation.',
                        'A virtual web browser used only to run React unit tests.',
                        'A special HTML5 API that speeds up JS script loading.',
                        'The DOM generated directly by Node.js on the server.'
                    ],
                    explanation: 'The Virtual DOM is an in-memory representation of the real DOM. When state changes, React updates this structure first, diffs it, and applies only the needed patches to the real DOM.'
                },
                {
                    question: 'Which rule about React Hooks is correct?',
                    options: [
                        'Hooks may be called inside conditions (if) or loops (for).',
                        'Hooks must only be called at the top level of a React function component.',
                        'Hooks may be declared in regular JavaScript functions that are not components.',
                        'Hooks must be called after the component return.'
                    ],
                    explanation: 'React Hooks must be called at the top level of function components (or other custom hooks). Do not call them inside loops, conditions or nested functions so React can keep their order stable across renders.'
                },
                {
                    question: 'Why is the key prop required when rendering a list of components?',
                    options: [
                        'To apply unique CSS styles to each item.',
                        'To tell React the loading priority of list items.',
                        'To help React identify which items changed, were added or removed, and optimize rendering.',
                        'To automatically bind event listeners to child components.'
                    ],
                    explanation: 'The key prop gives React a stable identity for each list item so reconciliation can reorder or update existing DOM nodes instead of destroying and recreating the whole list.'
                }
            ]
        },
        {
            title: 'React Syntax Fill-in',
            subtitle: 'Complete the code to create components and use hooks.',
            challenges: [
                {
                    instruction: 'Complete this simple function component so it receives the name prop and displays it.',
                    explanation: 'In function components, attributes are grouped into a single object usually called props, received as the first function parameter.'
                },
                {
                    instruction: 'Import the Hook needed to manage local state in this component.',
                    explanation: 'The useState Hook adds local state to a function component. It returns a pair: the current value and a setter function.'
                },
                {
                    instruction: 'Initialize a side effect that runs only after the first render (mount).',
                    explanation: 'An empty dependency array [] tells React the effect depends on no values and should run once on mount.'
                }
            ]
        },
        {
            title: 'React Bug Hunt',
            subtitle: 'Find and fix the logic or syntax error in each snippet.',
            challenges: [
                {
                    instruction: 'This button does not update the counter because state is mutated directly. Fix the line with the proper setter.',
                    explanation: 'In React, state is immutable. Never assign to a state variable (count = count + 1). Always call the setter (setCount) so React re-renders.'
                },
                {
                    instruction: 'This effect causes an infinite render loop. Fix the useEffect dependency array so it does not depend on what it updates.',
                    explanation: 'Because the updater is functional (setSeconds(s => s + 1)), the interval does not need to recreate the effect on every seconds change. Pass [] so it is created once on mount.'
                },
                {
                    instruction: 'React refuses to render this component because its name is invalid. Fix the declaration line.',
                    explanation: 'Custom React components must start with an uppercase letter (PascalCase). A lowercase name is treated as a native HTML tag.'
                }
            ]
        },
        {
            title: 'React Ordering Logic',
            subtitle: 'Put the lines back in order to build valid React flows.',
            challenges: [
                {
                    instruction: 'Reorder the lines to create a Toggle component that flips a boolean.',
                    explanation: 'A React component typically declares the function, defines state with useState, then returns JSX with the event handlers.'
                },
                {
                    instruction: 'Reorder the lines to implement a safe async data fetch inside a component.',
                    explanation: 'The isMounted flag avoids setting state after unmount. The cleanup function sets it to false.'
                },
                {
                    instruction: 'Order the steps of a custom hook that tracks window width.',
                    explanation: 'A custom hook starts with use, stores a dimension in state, listens to resize on mount with proper cleanup, then returns the value.'
                }
            ]
        },
        {
            title: 'Mini-project: Modern Increment Counter',
            subtitle: 'Build a dynamic counter with a limit and a warning message.',
            challenges: [
                {
                    title: 'Initialize state and the limit',
                    description: 'We want a counter that cannot go past 5. Fill the blank to initialize the count state hook at 0.',
                    explanation: 'useState creates reactive state in React, initialized here to 0.'
                },
                {
                    title: 'Safe increment logic',
                    description: 'Block incrementing when the limit is reached. Complete the increment function so it calls setCount conditionally.',
                    explanation: 'To update count safely we call the setter setCount.'
                },
                {
                    title: 'Conditional warning display',
                    description: 'If the counter reaches 5, show an alert. Complete the JSX to render the warning conditionally.',
                    explanation: 'In JSX, && is conditional rendering: if the left side is true, the right side is evaluated and rendered.'
                }
            ]
        }
    ],
    vue: [
        {
            title: 'Vue 3 Fundamentals',
            subtitle: 'Check your knowledge of reactivity, directives and the Vue lifecycle.',
            challenges: [
                {
                    question: 'What is the main difference between ref and reactive in the Vue 3 Composition API?',
                    options: [
                        'ref is only for primitives (String, Number, etc.) while reactive is only for objects and arrays.',
                        'reactive works for all types but needs .value to be changed in the template.',
                        'ref wraps a value in a reactive object accessed via .value in JS, while reactive makes an object reactive directly.',
                        'ref is deprecated in Vue 3 and replaced by reactive.'
                    ],
                    explanation: 'ref takes an inner value and returns a mutable reactive object. You use .value to read/write it in JavaScript (not in the template). reactive returns a reactive proxy of the given object.'
                },
                {
                    question: 'Which Vue directive implements two-way data binding?',
                    options: ['v-bind', 'v-model', 'v-on', 'v-sync'],
                    explanation: 'v-model creates two-way binding on form inputs or custom components and keeps the element value in sync with app state.'
                },
                {
                    question: 'What is the core difference between v-if and v-show?',
                    options: [
                        'v-if is for components while v-show is for plain HTML tags.',
                        'v-if destroys and recreates the element in the DOM, while v-show toggles the CSS display property.',
                        'v-if runs on the server while v-show runs only on the client.',
                        'v-show does not support a v-else block.'
                    ],
                    explanation: 'v-if is more expensive when toggling because it actually inserts or removes the node. v-show is cheaper for frequent toggles because it only sets display: none.'
                }
            ]
        },
        {
            title: 'Vue Directives and Reactivity',
            subtitle: 'Complete the code to bind data and react to events.',
            challenges: [
                {
                    instruction: 'Complete the script setup to declare a reactive message variable initialized to Hello World.',
                    explanation: 'Modern Vue 3 reactivity imports ref from vue and calls it to create a reactive variable.'
                },
                {
                    instruction: 'Dynamically bind the HTML src attribute to imageSrc and listen to the button click to call load.',
                    explanation: 'v-bind:attr (shortcut :) binds an HTML attribute to a JS expression. v-on:event (shortcut @) attaches a listener.'
                },
                {
                    instruction: 'Declare a computed property that returns the uppercase version of the reactive text.',
                    explanation: 'computed caches a value and recalculates it only when its reactive dependencies (here text.value) change.'
                }
            ]
        },
        {
            title: 'Vue 3 Bug Fixes',
            subtitle: 'Spot common state or attribute mistakes.',
            challenges: [
                {
                    instruction: 'In this script setup the counter does not increment because a specific ref property is missing in JS. Fix the line.',
                    explanation: 'In <script setup>, ref values are wrapped. To read or write them in JavaScript you must use .value.'
                },
                {
                    instruction: 'Vue warns when rendering this list because the unique key is wrong. Fix the v-for directive.',
                    explanation: 'key must be a dynamic value. Without v-bind (or :), Vue treats user.id as a static string identical for every item.'
                },
                {
                    instruction: 'The user tries to write to a computed property, which logs an error. Fix the function so it updates the source state instead.',
                    explanation: 'Computed properties are read-only by default. Change the original reactive dependency (here basePrice) instead.'
                }
            ]
        },
        {
            title: 'Vue Component Structure',
            subtitle: 'Reorder the declarations to get a valid Vue 3 component.',
            challenges: [
                {
                    instruction: 'Order the steps to set up a component with props, variables and a reactive function.',
                    explanation: 'In Vue SFCs, put <script setup> first (imports, props, state), then the <template> that describes the view.'
                },
                {
                    instruction: 'Order the lines to set an onMounted listener that loads data from an API.',
                    explanation: 'Import Vue helpers first, declare the reactive container, then the onMounted callback to load data asynchronously.'
                },
                {
                    instruction: 'Reorder the declaration of events emitted by a child component.',
                    explanation: 'defineEmits must be called at the top level of <script setup> to declare events the component can emit to its parent.'
                }
            ]
        },
        {
            title: 'Mini-project: Character Counter',
            subtitle: 'Build a reactive textarea with remaining characters and an overflow indicator.',
            challenges: [
                {
                    title: 'Declare input state',
                    description: 'In script setup, declare a text ref for user input and set the max length to 140 characters.',
                    explanation: 'ref(\'\') creates a reactive variable initialized with an empty string.'
                },
                {
                    title: 'Compute remaining characters',
                    description: 'Compute remaining characters with a computed property named charsLeft.',
                    explanation: 'Because text is a ref, access its value with .value and measure it with .length.'
                },
                {
                    title: 'Two-way binding in the template',
                    description: 'In the template, bind the textarea to the text ref and show the remaining count.',
                    explanation: 'v-model keeps the textarea content in sync with the text state.'
                }
            ]
        }
    ],
    angular: [
        {
            title: 'Angular Fundamentals',
            subtitle: 'Check your skills on components, dependency injection and signals.',
            challenges: [
                {
                    question: 'What is the @Component decorator for in Angular?',
                    options: [
                        'To turn a TypeScript class into a component with metadata such as its selector, HTML template and CSS styles.',
                        'To configure async HTTP requests to the backend.',
                        'To generate a Webpack config file at compile time.',
                        'To declare a service that can be injected into other classes.'
                    ],
                    explanation: '@Component sits above a TypeScript class and attaches the metadata Angular needs: selector, template or templateUrl, and styles.'
                },
                {
                    question: 'With Angular Signals, how do you read the value of a count signal in TypeScript?',
                    options: [
                        'By accessing the property: count.value',
                        'By calling the signal as a function with no argument: count()',
                        'By using the reactivity service: this.signals.get(count)',
                        'By applying the async pipe: count | async'
                    ],
                    explanation: 'An Angular Signal is a reactive function. Call it with no arguments — count() — to read the current value and register the consumer.'
                },
                {
                    question: 'How does Angular dependency injection provide a service?',
                    options: [
                        'Services must be instantiated with new in every component.',
                        'Angular looks up services in HTML files to instantiate them.',
                        'Angular provides an injector that resolves dependencies via the constructor or the inject() function.',
                        'Dependencies are imported only through angular.json.'
                    ],
                    explanation: 'Angular uses hierarchical DI. Instead of new-ing classes, the framework injects service instances (often singletons) through the constructor or inject().'
                }
            ]
        },
        {
            title: 'Angular Syntax and Templates',
            subtitle: 'Complete TypeScript and template syntax for a modern component.',
            challenges: [
                {
                    instruction: 'Complete this standalone component declaration to include the import metadata needed for CommonModule.',
                    explanation: 'Modern Angular components are standalone: true. Standard features (older directives or pipes) are listed in the imports array.'
                },
                {
                    instruction: 'Declare an input property with the proper decorator to receive a product name from a parent component.',
                    explanation: '@Input() from @angular/core marks a class field as an input so the parent can bind values in the template.'
                },
                {
                    instruction: 'Bind a click event to the saveProduct() method on a button template.',
                    explanation: 'Event binding wraps the DOM event name in parentheses, e.g. (click), and assigns the target method call.'
                }
            ]
        },
        {
            title: 'Angular Bug Fixes',
            subtitle: 'Solve classic import, signal or injection errors.',
            challenges: [
                {
                    instruction: 'This template tries to display the count signal but shows the function reference. Fix the template.',
                    explanation: 'Angular signals are getter functions. In the template, as in TypeScript, call count() to read the current reactive value.'
                },
                {
                    instruction: 'This standalone component uses *ngIf but errors because the directive is not declared. Fix the imports array.',
                    explanation: 'Classic structural directives like *ngIf need to be imported (NgIf or CommonModule) in a standalone component imports array.'
                },
                {
                    instruction: 'The injector errors because UserService is injected but Injectable does not declare where it is provided. Fix the service decorator.',
                    explanation: '@Injectable({ providedIn: \'root\' }) registers the service as a global singleton without listing it in component providers.'
                }
            ]
        },
        {
            title: 'Angular Injection Cycle and Signals',
            subtitle: 'Order the steps to configure services and components.',
            challenges: [
                {
                    instruction: 'Reorder the lines to create an injected service that exposes a read-only signal.',
                    explanation: 'Keep a private mutable _status signal, expose asReadonly() publicly, and provide a method to update it.'
                },
                {
                    instruction: 'Order a standalone component that injects the previous service with inject().',
                    explanation: 'Define component metadata first, then inject the service with inject() on a class field and expose the service signal.'
                },
                {
                    instruction: 'Order the new @if / @else control flow in an Angular v17+ template.',
                    explanation: 'Built-in @if, @else if and @else replace *ngIf, with better performance and no directive imports.'
                }
            ]
        },
        {
            title: 'Mini-project: Dynamic Product Card',
            subtitle: 'Build a standalone component that shows a product and a reactive quantity with Signals.',
            challenges: [
                {
                    title: 'Declare the quantity signal',
                    description: 'In ProductCard, declare a signal named quantity initialized to 1.',
                    explanation: 'The signal() constructor creates a reactive signal holding the initial number 1.'
                },
                {
                    title: 'Reactive increment',
                    description: 'Write updateQuantity() to increment the current value by 1.',
                    explanation: 'Signal.update() changes the value using a function of the current value.'
                },
                {
                    title: 'New control flow in the template',
                    description: 'In the template metadata, use Angular control flow to show a message if quantity is greater than 5.',
                    explanation: 'The new template control flow uses @if (condition) { ... } with no NgIf import.'
                }
            ]
        }
    ],
    node: [
        {
            title: 'Node.js Fundamentals',
            subtitle: 'Check your basics on the Event Loop, modules and async I/O.',
            challenges: [
                {
                    question: 'What is non-blocking (asynchronous I/O) architecture in Node.js?',
                    options: [
                        'A model where each connected user gets a dedicated OS thread.',
                        'A system that blocks global execution until file access completes.',
                        'A single-thread model that delegates heavy I/O to the OS and uses callbacks/promises so the main thread is not blocked.',
                        'A technical limit that prevents Node.js from doing math.'
                    ],
                    explanation: 'Node.js is single-threaded with an Event Loop. Instead of blocking on network or disk I/O, it delegates that work to the OS and keeps processing other tasks. When I/O finishes, the callback is queued.'
                },
                {
                    question: 'Which syntax is the original CommonJS way to import a module?',
                    options: [
                        'import fs from \'fs\';',
                        'const fs = require(\'fs\');',
                        'include(\'fs\');',
                        'require.import(\'fs\');'
                    ],
                    explanation: 'In historic CommonJS (CJS), packages are imported with require(). The modern ESM equivalent is import.'
                },
                {
                    question: 'Which native Node.js module manipulates file paths in a cross-platform way?',
                    options: ['fs', 'path', 'url', 'os'],
                    explanation: 'The path module has utilities for file and directory paths on every OS (Windows backslashes vs Unix slashes).'
                }
            ]
        },
        {
            title: 'Node.js Modules and HTTP Server',
            subtitle: 'Complete the code to read files and configure HTTP servers.',
            challenges: [
                {
                    instruction: 'Complete this code to import the filesystem module with promises and read a file.',
                    explanation: 'In CommonJS, fs.promises exposes the promise-based API. The .catch block handles a read error.'
                },
                {
                    instruction: 'Use the native HTTP module to create a server listening on port 3000.',
                    explanation: 'http.createServer() instantiates a native web server. server.listen(port) starts listening on that port.'
                },
                {
                    instruction: 'Configure an Express route that answers GET /api/status.',
                    explanation: 'app.get() listens for GET requests. The callback receives req and res (res.json() sends JSON).'
                }
            ]
        },
        {
            title: 'Express and Async Error Fixes',
            subtitle: 'Find why the Express server hangs or returns errors.',
            challenges: [
                {
                    instruction: 'This Express middleware checks an API key but hangs forever when the key is valid because an essential function is not invoked. Fix the line.',
                    explanation: 'An Express middleware must call next() to pass control to the next middleware. Otherwise the request waits forever and the client times out.'
                },
                {
                    instruction: 'The developer reads a config file asynchronously but tries to return the content synchronously, which yields undefined. Fix the function to use the native sync API.',
                    explanation: 'fs.readFile() is async and returns nothing directly. To return a value immediately, use blocking fs.readFileSync().'
                },
                {
                    instruction: 'This Express script defines routes but never starts listening, so the server is unreachable. Add listen on port 8080.',
                    explanation: 'Defining routes is not enough. Call app.listen(port) to bind a network port and accept incoming requests.'
                }
            ]
        },
        {
            title: 'Node.js Event Flows and Pipelines',
            subtitle: 'Put the lines in order to configure network streams or middleware.',
            challenges: [
                {
                    instruction: 'Order the steps for a basic Express server with a JSON parser and a route.',
                    explanation: 'Import, instantiate, add JSON parsing middleware before routes, declare endpoints, then start the server.'
                },
                {
                    instruction: 'Order the lines to pipe a large file from a readable stream to an output file.',
                    explanation: 'Streams process data in chunks. Create a read stream and a write stream, connect them with pipe(), then listen for end.'
                },
                {
                    instruction: 'Order the steps to load environment variables from a .env file safely in Node.js.',
                    explanation: 'Run dotenv config first, then read PORT with a default and DATABASE_URL. If the URL is missing, log and process.exit(1).'
                }
            ]
        },
        {
            title: 'Mini-project: Secure Express REST API',
            subtitle: 'Build a secure Express endpoint that receives JSON user data, validates it and returns status 201.',
            challenges: [
                {
                    title: 'Create the app and import',
                    description: 'Import express and create an application instance.',
                    explanation: 'Load Express with require(\'express\') then instantiate the app by calling express().'
                },
                {
                    title: 'Configure JSON middleware',
                    description: 'Configure Express so it automatically decodes JSON request bodies.',
                    explanation: 'express.json() parses incoming JSON bodies into req.body.'
                },
                {
                    title: 'Declare the create route',
                    description: 'Create POST /users that validates username in the body. If present, return 201 with the created user.',
                    explanation: 'HTTP 201 Created means a resource (here the user) was successfully created on the server.'
                }
            ]
        }
    ]
};

export function localizeWorld(frLevels, overlay) {
    if (!overlay) return frLevels;
    return frLevels.map((level, li) => {
        const o = overlay[li] || {};
        return {
            ...level,
            title: o.title || level.title,
            subtitle: o.subtitle || level.subtitle,
            challenges: level.challenges.map((ch, ci) => ({
                ...ch,
                ...((o.challenges && o.challenges[ci]) || {})
            }))
        };
    });
}
