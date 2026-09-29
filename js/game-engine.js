/**
 * FrameQuest Game Engine
 * Handles rendering and verification for all 5 challenge types.
 */

import { escapeHtml } from './utils.js';
import { t } from './i18n.js';

export const LEVEL_TYPES = {
    quiz: { id: 'quiz', label: 'QCM', icon: '❓', short: 'Quiz à choix multiples' },
    blank: { id: 'blank', label: 'Code à trous', icon: '✍️', short: 'Complétion de syntaxe' },
    debug: { id: 'debug', label: 'Débogage', icon: '🐛', short: 'Chasse aux bugs' },
    reorder: { id: 'reorder', label: 'Réorganisation', icon: '🔀', short: 'Remettre le code en ordre' },
    project: { id: 'project', label: 'Mini-projet', icon: '🛠️', short: 'Projet guidé en 3 étapes' }
};

/**
 * Pedagogical hint that never reveals the exact answer.
 */
export function getHint(challenge, type) {
    if (challenge?.hint) return challenge.hint;

    switch (type) {
        case 'quiz':
            return t('hintQuiz');
        case 'blank':
            return t('hintBlank');
        case 'debug':
            return challenge.instruction || t('hintDebug');
        case 'reorder':
            return t('hintReorder');
        case 'project':
            return challenge.description || t('hintProject');
        default:
            return t('hintDefault');
    }
}

export function renderChallenge(challenge, type, target, onInteractive) {
    target.innerHTML = '';
    
    switch (type) {
        case 'quiz':
            renderQuiz(challenge, target, onInteractive);
            break;
        case 'blank':
            renderBlank(challenge, target, onInteractive);
            break;
        case 'debug':
            renderDebug(challenge, target, onInteractive);
            break;
        case 'reorder':
            renderReorder(challenge, target, onInteractive);
            break;
        case 'project':
            renderProject(challenge, target, onInteractive);
            break;
        default:
            console.error('Unknown level type:', type);
    }
}

/**
 * Validates the player's input against the challenge solution.
 * @param {object} challenge 
 * @param {string} type 
 * @param {HTMLElement} container 
 * @returns {boolean} True if correct, false otherwise
 */
export function verifyChallenge(challenge, type, container) {
    switch (type) {
        case 'quiz':
            const selectedOption = container.querySelector('.quiz-option-card.selected');
            if (!selectedOption) return false;
            const selectedIdx = parseInt(selectedOption.dataset.index, 10);
            return selectedIdx === challenge.correctIndex;
            
        case 'blank':
            const inputs = Array.from(container.querySelectorAll('.blank-input'));
            const userBlanks = inputs.map(input => input.value.trim());
            
            // Check each blank (case-sensitive and space-trimmed)
            let allCorrect = true;
            inputs.forEach((input, idx) => {
                const isCorrect = input.value.trim().replace(/\s+/g, '') === challenge.blanks[idx].trim().replace(/\s+/g, '');
                if (isCorrect) {
                    input.classList.remove('incorrect');
                    input.classList.add('correct');
                } else {
                    input.classList.remove('correct');
                    input.classList.add('incorrect');
                    allCorrect = false;
                }
            });
            return allCorrect;
            
        case 'debug':
            const debugInput = container.querySelector('.debug-text-input');
            if (!debugInput) return false;
            
            // Compare user answer (collapsing spaces, ignoring final semicolons occasionally to be pedagogical but forgiving)
            const cleanUser = debugInput.value.trim().replace(/\s+/g, ' ').replace(/;$/, '');
            const cleanTarget = challenge.correctText.trim().replace(/\s+/g, ' ').replace(/;$/, '');
            
            return cleanUser === cleanTarget;
            
        case 'reorder':
            const orderedItems = Array.from(container.querySelectorAll('#reorder-solution-box .reorder-item-card'));
            if (orderedItems.length !== challenge.lines.length) return false;
            
            const userOrder = orderedItems.map(item => parseInt(item.dataset.index, 10));
            
            // Check if userOrder matches correctOrder
            return userOrder.every((val, index) => val === challenge.correctOrder[index]);
            
        case 'project':
            // Project validation is handled step-by-step
            const activeStep = challenge.challenges.find(s => s.active);
            if (!activeStep) return false;
            
            const stepInput = container.querySelector('.project-step-item.active .debug-text-input');
            if (!stepInput) return false;
            
            const cleanStepUser = stepInput.value.trim().replace(/\s+/g, ' ').replace(/;$/, '');
            const cleanStepTarget = activeStep.blankInput.trim().replace(/\s+/g, ' ').replace(/;$/, '');
            
            return cleanStepUser === cleanStepTarget;
            
        default:
            return false;
    }
}

/**
 * Level 1: Render Quiz MCQ
 */
function renderQuiz(challenge, target, onInteractive) {
    const questionEl = document.createElement('p');
    questionEl.className = 'challenge-instruction';
    questionEl.textContent = challenge.question;
    target.appendChild(questionEl);
    
    const grid = document.createElement('div');
    grid.className = 'quiz-options-grid';
    
    const bulletLetters = ['A', 'B', 'C', 'D'];

    challenge.options.forEach((option, index) => {
        const optionCard = document.createElement('div');
        optionCard.className = 'quiz-option-card';
        optionCard.dataset.index = index;
        optionCard.setAttribute('role', 'button');
        optionCard.setAttribute('tabindex', '0');
        optionCard.setAttribute('aria-label', t('optionAria', { letter: bulletLetters[index] || index + 1 }));
        const bullet = document.createElement('div');
        bullet.className = 'option-bullet';
        bullet.textContent = bulletLetters[index] || index + 1;
        
        const text = document.createElement('span');
        text.textContent = option;
        
        optionCard.appendChild(bullet);
        optionCard.appendChild(text);
        
        const selectOption = () => {
            grid.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
            optionCard.classList.add('selected');
            onInteractive(true);
        };
        optionCard.addEventListener('click', selectOption);
        optionCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectOption();
            }
        });
        
        grid.appendChild(optionCard);
    });
    
    target.appendChild(grid);
}

/**
 * Level 2: Render Fill-in-the-blank
 */
function renderBlank(challenge, target, onInteractive) {
    const instructionEl = document.createElement('p');
    instructionEl.className = 'challenge-instruction';
    instructionEl.textContent = challenge.instruction;
    target.appendChild(instructionEl);
    
    const editor = document.createElement('div');
    editor.className = 'code-editor';
    
    // Parse code template to inject inputs
    let rawCode = challenge.code;
    let htmlContent = escapeHtml(rawCode);
    
    // Replace [[blank1]], [[blank2]] etc. with inputs
    let blankIndex = 1;
    const blankRegex = /\[\[blank\d*\]\]/g;
    
    // We parse the raw text to insert HTML inputs safely
    const parts = rawCode.split(blankRegex);
    const matches = rawCode.match(blankRegex) || [];
    
    const codePre = document.createElement('pre');
    const codeBlock = document.createElement('code');
    
    parts.forEach((part, idx) => {
        codeBlock.appendChild(document.createTextNode(part));
        
        if (idx < matches.length) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'blank-input';
            input.placeholder = '...';
            // Calculate size dynamically
            const expectedWord = challenge.blanks[blankIndex - 1] || '...';
            input.style.width = `${Math.max(expectedWord.length * 9 + 15, 40)}px`;
            input.dataset.index = blankIndex - 1;
            
            input.addEventListener('input', () => {
                // Auto resize on text input
                input.style.width = `${Math.max(input.value.length * 9 + 15, 40)}px`;
                const allFilled = Array.from(editor.querySelectorAll('.blank-input'))
                    .every(i => i.value.trim() !== '');
                onInteractive(allFilled);
            });
            
            codeBlock.appendChild(input);
            blankIndex++;
        }
    });
    
    codePre.appendChild(codeBlock);
    editor.appendChild(codePre);
    target.appendChild(editor);
}

/**
 * Level 3: Render Debug
 */
function renderDebug(challenge, target, onInteractive) {
    const instructionEl = document.createElement('p');
    instructionEl.className = 'challenge-instruction';
    instructionEl.textContent = challenge.instruction;
    target.appendChild(instructionEl);
    
    const layout = document.createElement('div');
    layout.className = 'debug-challenge-layout';
    
    const editor = document.createElement('div');
    editor.className = 'code-editor';
    
    const codeLines = challenge.code.split('\n');
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    
    codeLines.forEach((line, index) => {
        const lineSpan = document.createElement('span');
        // Match 1-indexed error line
        if (index + 1 === challenge.errorLineIndex) {
            lineSpan.className = 'error-line';
        }
        lineSpan.textContent = line + '\n';
        code.appendChild(lineSpan);
    });
    
    pre.appendChild(code);
    editor.appendChild(pre);
    layout.appendChild(editor);
    
    // Add input card below
    const inputArea = document.createElement('div');
    inputArea.className = 'debug-input-area';
    
    const label = document.createElement('span');
    label.className = 'debug-input-label';
    label.textContent = t('fixLine', { n: challenge.errorLineIndex });
    inputArea.appendChild(label);
    
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'debug-field-wrapper';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'debug-text-input';
    input.value = challenge.errorText; // Pre-fill with the buggy line for easier editing
    input.spellcheck = false;
    input.autocomplete = 'off';
    
    input.addEventListener('input', () => {
        onInteractive(input.value.trim() !== '');
    });
    
    fieldWrapper.appendChild(input);
    inputArea.appendChild(fieldWrapper);
    layout.appendChild(inputArea);
    
    target.appendChild(layout);
}

/**
 * Level 4: Render Code Reordering (Source Box -> Solution Box)
 * Highly mobile responsive click-to-move pattern
 */
function renderReorder(challenge, target, onInteractive) {
    const instructionEl = document.createElement('p');
    instructionEl.className = 'challenge-instruction';
    instructionEl.textContent = challenge.instruction;
    target.appendChild(instructionEl);
    
    const container = document.createElement('div');
    container.className = 'reorder-container';
    
    // Left Box: Source (Scrambled)
    const sourceBox = document.createElement('div');
    sourceBox.className = 'reorder-box';
    sourceBox.id = 'reorder-source-box';
    
    const sourceTitle = document.createElement('div');
    sourceTitle.className = 'reorder-box-title';
    sourceTitle.textContent = t('scrambled');
    sourceBox.appendChild(sourceTitle);
    
    // Right Box: Solution
    const solutionBox = document.createElement('div');
    solutionBox.className = 'reorder-box';
    solutionBox.id = 'reorder-solution-box';
    
    const solutionTitle = document.createElement('div');
    solutionTitle.className = 'reorder-box-title';
    solutionTitle.textContent = t('yourSolution');
    solutionBox.appendChild(solutionTitle);
    
    // Initialize scrambled elements state
    // Store original index mapping to verify order
    const scrambledLines = challenge.lines.map((text, index) => ({ text, index }));
    
    // Scramble order by sorting randomly (ensure it's not in correct order)
    let isSorted = true;
    while (isSorted && scrambledLines.length > 1) {
        scrambledLines.sort(() => Math.random() - 0.5);
        // Check if it scrambled in the correct order by chance
        isSorted = scrambledLines.every((line, idx) => line.index === idx);
    }
    
    // Render source cards
    scrambledLines.forEach(item => {
        const itemCard = createReorderCard(item.text, item.index, true, moveToSolution);
        sourceBox.appendChild(itemCard);
    });
    
    function moveToSolution(card) {
        card.parentNode.removeChild(card);
        const newCard = createReorderCard(card.dataset.text, card.dataset.index, false, moveToSource);
        solutionBox.appendChild(newCard);
        updateInteractiveState();
    }
    
    function moveToSource(card) {
        card.parentNode.removeChild(card);
        const newCard = createReorderCard(card.dataset.text, card.dataset.index, true, moveToSolution);
        sourceBox.appendChild(newCard);
        updateInteractiveState();
    }
    
    function updateInteractiveState() {
        const solutionItemsCount = solutionBox.querySelectorAll('.reorder-item-card').length;
        // Interactive check is satisfied when all lines are moved to solution box
        onInteractive(solutionItemsCount === challenge.lines.length);
    }
    
    function createReorderCard(text, index, isSource, onClick) {
        const card = document.createElement('div');
        card.className = 'reorder-item-card';
        card.dataset.index = index;
        card.dataset.text = text;
        
        const codeText = document.createElement('span');
        codeText.textContent = text;
        card.appendChild(codeText);
        
        const actionTag = document.createElement('span');
        actionTag.className = 'reorder-item-action';
        actionTag.textContent = isSource ? '➕' : '❌';
        card.appendChild(actionTag);
        
        card.addEventListener('click', () => onClick(card));
        return card;
    }
    
    container.appendChild(sourceBox);
    container.appendChild(solutionBox);
    target.appendChild(container);
}

/**
 * Level 5: Render Guided Mini-Project
 */
function renderProject(challenge, target, onInteractive) {
    const layout = document.createElement('div');
    layout.className = 'project-container';
    
    const guideCard = document.createElement('div');
    guideCard.className = 'project-guide-card';
    
    // Find active step
    let activeStepIndex = challenge.challenges.findIndex(s => s.active);
    if (activeStepIndex === -1) {
        // Default to step 1
        challenge.challenges[0].active = true;
        activeStepIndex = 0;
    }
    
    challenge.challenges.forEach((step, idx) => {
        const stepItem = document.createElement('div');
        stepItem.className = 'project-step-item';
        if (step.completed) stepItem.classList.add('completed');
        if (step.active) stepItem.classList.add('active');
        
        const checkbox = document.createElement('div');
        checkbox.className = 'project-step-checkbox';
        if (step.completed) checkbox.textContent = '✓';
        
        const content = document.createElement('div');
        content.className = 'project-step-content';
        
        const title = document.createElement('div');
        title.className = 'project-step-title';
        title.textContent = `Étape ${idx + 1} : ${step.title}`;
        
        const desc = document.createElement('div');
        desc.className = 'project-step-desc';
        desc.textContent = step.description;
        
        content.appendChild(title);
        content.appendChild(desc);
        stepItem.appendChild(checkbox);
        stepItem.appendChild(content);
        guideCard.appendChild(stepItem);
    });
    
    const activeStep = challenge.challenges[activeStepIndex];
    
    // Workspace side (right) for active step interaction
    const workspace = document.createElement('div');
    workspace.className = 'debug-challenge-layout';
    
    const instructionEl = document.createElement('p');
    instructionEl.className = 'challenge-instruction';
    instructionEl.textContent = t('projectStep', { n: activeStepIndex + 1 });
    workspace.appendChild(instructionEl);
    
    const editor = document.createElement('div');
    editor.className = 'code-editor';
    
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    
    // Show [[blank]] as a visual marker; the player answers in the field below
    let rawCode = activeStep.code;
    const parts = rawCode.split('[[blank]]');

    parts.forEach((part, idx) => {
        code.appendChild(document.createTextNode(part));
        if (idx < parts.length - 1) {
            const mark = document.createElement('span');
            mark.className = 'code-blank-mark';
            mark.textContent = '___';
            mark.title = 'Complétez ce trou dans le champ ci-dessous';
            code.appendChild(mark);
        }
    });
    
    pre.appendChild(code);
    editor.appendChild(pre);
    workspace.appendChild(editor);
    
    // Prompt text box instructions if needed or instructions inside input area
    const inputArea = document.createElement('div');
    inputArea.className = 'debug-input-area';
    
    const label = document.createElement('span');
    label.className = 'debug-input-label';
    label.textContent = t('completeBlank');
    inputArea.appendChild(label);
    
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'debug-field-wrapper';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'debug-text-input';
    input.placeholder = t('typeAnswer');
    input.spellcheck = false;
    input.autocomplete = 'off';
    
    input.addEventListener('input', () => {
        onInteractive(input.value.trim() !== '');
    });
    
    fieldWrapper.appendChild(input);
    inputArea.appendChild(fieldWrapper);
    workspace.appendChild(inputArea);
    
    layout.appendChild(guideCard);
    layout.appendChild(workspace);
    target.appendChild(layout);
}
