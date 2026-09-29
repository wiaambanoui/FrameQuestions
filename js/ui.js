/**
 * FrameQuest UI Renderer and Views Manager
 */

import {
    getState,
    addXp,
    completeLevel,
    BADGES,
    getWorldProgressPercent,
    resetProgress,
    resetSessionErrors,
    registerChallengeSuccess,
    registerChallengeFail,
    registerHintUsed,
    getAccuracyPercent,
    markGuideSeen,
    markOnboardingSeen,
    setLangPref,
    setAppearancePref,
    XP_REWARDS
} from './state.js';
import { renderChallenge, verifyChallenge, getHint, LEVEL_TYPES } from './game-engine.js';
import { triggerConfetti } from './utils.js';
import { t, getLang, setLang, typeLabel } from './i18n.js';

const WORLDS_INFO = [
    { id: 'react', title: 'React.js', icon: '⚛️', descKey: 'worldReact' },
    { id: 'vue', title: 'Vue.js', icon: '💚', descKey: 'worldVue' },
    { id: 'angular', title: 'Angular', icon: '🛡️', descKey: 'worldAngular' },
    { id: 'node', title: 'Node.js', icon: '🚀', descKey: 'worldNode' }
];

const WORLD_COLORS = { react: '#00d8ff', vue: '#42b883', angular: '#dd0031', node: '#5fa04e' };
const WORLD_TITLES = { react: 'React.js', vue: 'Vue.js', angular: 'Angular', node: 'Node.js' };

let appData = {};
let currentView = 'dashboard';
let activeWorld = null;
let activeLevelNum = null;
let activeChallengeIdx = 0;
let isFirstAttempt = true;
let hintUsedThisChallenge = false;
let lastCompletion = null;

const el = {
    main: () => document.getElementById('view-root'),
    logoText: () => document.querySelector('.logo-text'),
    logoLink: () => document.querySelector('.logo-link'),
    playerLevelBadge: () => document.getElementById('player-level-badge'),
    playerXpValue: () => document.getElementById('player-xp-value'),
    playerXpNext: () => document.getElementById('player-xp-next'),
    headerProgressFill: () => document.getElementById('header-progress-fill')
};

function worldLevels(world) {
    return appData[getLang()]?.[world] || appData.fr?.[world] || [];
}

export function applyChrome(world = activeWorld) {
    const state = getState();
    document.body.classList.remove('theme-react', 'theme-vue', 'theme-angular', 'theme-node');
    if (world) document.body.classList.add(`theme-${world}`);
    document.body.classList.toggle('appearance-light', state.appearance === 'light');
    document.body.classList.toggle('appearance-dark', state.appearance !== 'light');

    const themeBtn = document.getElementById('btn-appearance');
    if (themeBtn) {
        const toLight = state.appearance !== 'light';
        themeBtn.textContent = toLight ? '☀️' : '🌙';
        themeBtn.title = t(toLight ? 'themeToLight' : 'themeToDark');
        themeBtn.setAttribute('aria-label', t(toLight ? 'themeToLight' : 'themeToDark'));
    }

    document.getElementById('btn-lang-fr')?.classList.toggle('is-active', getLang() === 'fr');
    document.getElementById('btn-lang-en')?.classList.toggle('is-active', getLang() === 'en');

    const footer = document.getElementById('app-footer');
    if (footer) footer.textContent = t('footer');

    el.logoLink()?.setAttribute('aria-label', t('logoAria'));
    const helpBtn = document.getElementById('btn-help');
    if (helpBtn) {
        helpBtn.title = t('helpTitle');
        helpBtn.setAttribute('aria-label', t('helpAria'));
    }
}

function refreshCurrentView() {
    applyChrome();
    updateHeaderStats();
    if (currentView === 'dashboard') showDashboard({ skipGuide: true });
    else if (currentView === 'world-hub' && activeWorld) showWorldHub(activeWorld);
    else if (currentView === 'game') renderGameView();
    else if (currentView === 'rewards') showRewards(lastCompletion);
}

function changeLanguage(lang) {
    setLang(lang);
    setLangPref(lang);
    refreshCurrentView();
}

function toggleAppearance() {
    const next = getState().appearance === 'light' ? 'dark' : 'light';
    setAppearancePref(next);
    applyChrome();
}

export function initUi(contentData) {
    appData = contentData;

    el.logoLink().addEventListener('click', (e) => {
        e.preventDefault();
        showDashboard({ skipGuide: true });
    });

    document.getElementById('btn-help')?.addEventListener('click', () => openHowToPlay(false));
    document.getElementById('btn-appearance')?.addEventListener('click', toggleAppearance);
    document.getElementById('btn-lang-fr')?.addEventListener('click', () => changeLanguage('fr'));
    document.getElementById('btn-lang-en')?.addEventListener('click', () => changeLanguage('en'));

    document.addEventListener('keydown', handleGlobalKeydown);

    applyChrome();
    updateHeaderStats();
}

function handleGlobalKeydown(e) {
    if (e.key === 'Escape') {
        closeModal();
        return;
    }

    if (currentView !== 'game') return;

    const tag = document.activeElement?.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA';

    if (e.key === 'Enter') {
        const btn = document.getElementById('btn-submit-action');
        if (btn && !btn.disabled) {
            e.preventDefault();
            btn.click();
        }
        return;
    }

    if (typing) return;

    const letterMap = { a: 0, b: 1, c: 2, d: 3 };
    const idx = letterMap[e.key.toLowerCase()];
    if (idx !== undefined) {
        const cards = document.querySelectorAll('.quiz-option-card');
        if (cards[idx]) cards[idx].click();
    }
}

function applyWorldTheme(world) {
    applyChrome(world);
    if (!world) {
        el.logoText().style.background = 'linear-gradient(135deg, var(--text-primary) 50%, var(--accent-blue) 100%)';
        el.logoText().style.webkitBackgroundClip = 'text';
        return;
    }
    el.logoText().style.background = `linear-gradient(135deg, var(--text-primary) 60%, ${WORLD_COLORS[world]} 100%)`;
    el.logoText().style.webkitBackgroundClip = 'text';
}

export function updateHeaderStats() {
    const state = getState();
    el.playerLevelBadge().textContent = state.level;
    const xpInCurrentLevel = state.xp % 1000;
    const progressPercent = Math.min((xpInCurrentLevel / 1000) * 100, 100);
    el.playerXpValue().textContent = xpInCurrentLevel;
    el.playerXpNext().textContent = '1000';
    el.headerProgressFill().style.width = `${progressPercent}%`;
}

function makeBackButton(label, onClick) {
    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'btn btn-secondary';
    backBtn.style.alignSelf = 'flex-start';
    backBtn.style.marginBottom = '1.5rem';
    backBtn.textContent = label;
    backBtn.addEventListener('click', onClick);
    return backBtn;
}

export function showDashboard({ skipGuide = false } = {}) {
    currentView = 'dashboard';
    activeWorld = null;
    activeLevelNum = null;
    applyWorldTheme(null);

    const state = getState();
    const mainEl = el.main();
    mainEl.innerHTML = '';

    const dashboardContainer = document.createElement('div');
    dashboardContainer.className = 'view-container';

    const hero = document.createElement('div');
    hero.className = 'welcome-hero';
    hero.innerHTML = `
        <h1>${t('heroTitle')}</h1>
        <p>${t('heroLead')}</p>
        <div class="hero-actions">
            <button type="button" class="btn btn-secondary" id="btn-open-guide">📘 ${t('howToPlay')}</button>
            <button type="button" class="btn btn-secondary" id="btn-open-about">ℹ️ ${t('aboutBtn')}</button>
        </div>
    `;
    dashboardContainer.appendChild(hero);

    const layout = document.createElement('div');
    layout.className = 'dashboard-layout';

    const worldsSection = document.createElement('section');
    worldsSection.className = 'worlds-section';
    worldsSection.innerHTML = `<h2>🗺️ ${t('worldsTitle')}</h2>`;

    const grid = document.createElement('div');
    grid.className = 'worlds-grid';

    WORLDS_INFO.forEach(w => {
        const percent = getWorldProgressPercent(w.id);
        const completedCount = state.progress[w.id]?.completedLevels?.length || 0;

        const card = document.createElement('div');
        card.className = `world-card ${w.id}`;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.innerHTML = `
            <div class="world-card-header">
                <div class="world-icon-title">
                    <span class="world-icon">${w.icon}</span>
                    <span class="world-title">${w.title}</span>
                </div>
                <span class="world-progress-badge">${t('levelsShort', { n: completedCount })}</span>
            </div>
            <p class="world-description">${t(w.descKey)}</p>
            <div class="world-card-footer">
                <div class="world-progress-label">
                    <span>${t('progress')}</span>
                    <span>${percent}%</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar-fill" style="width: ${percent}%;"></div>
                </div>
            </div>
        `;

        const openHub = () => showWorldHub(w.id);
        card.addEventListener('click', openHub);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openHub();
            }
        });
        grid.appendChild(card);
    });

    worldsSection.appendChild(grid);
    layout.appendChild(worldsSection);

    const profileSection = document.createElement('section');
    profileSection.className = 'profile-section';
    profileSection.innerHTML = `<h2>🏆 ${t('profileTitle')}</h2>`;

    const totalCompleted = Object.values(state.progress)
        .reduce((sum, world) => sum + (world.completedLevels?.length || 0), 0);
    const accuracy = getAccuracyPercent();

    const profileCard = document.createElement('div');
    profileCard.className = 'profile-card';
    profileCard.innerHTML = `
        <div class="profile-summary">
            <div class="profile-avatar">👨‍💻</div>
            <div class="profile-info">
                <h3>${t('playerLevel', { n: state.level })}</h3>
                <p>${t('xpTotal', { n: state.xp })}</p>
            </div>
        </div>
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-val">${totalCompleted}</div>
                <div class="stat-lbl">${t('levelsDone')}</div>
            </div>
            <div class="stat-item">
                <div class="stat-val">${state.unlockedBadges.length}</div>
                <div class="stat-lbl">${t('badgesWon')}</div>
            </div>
            <div class="stat-item">
                <div class="stat-val">${state.stats.challengesSolved}</div>
                <div class="stat-lbl">${t('challengesWon')}</div>
            </div>
            <div class="stat-item">
                <div class="stat-val">${accuracy}%</div>
                <div class="stat-lbl">${t('firstTryRate')}</div>
            </div>
        </div>
        <div>
            <h3>${t('yourBadges')}</h3>
            <div class="badge-grid" id="dashboard-badges-grid"></div>
        </div>
        <div class="reset-data-container">
            <button class="btn btn-secondary btn-reset" id="btn-reset-data">🔄 ${t('reset')}</button>
        </div>
    `;

    profileSection.appendChild(profileCard);
    layout.appendChild(profileSection);

    dashboardContainer.appendChild(layout);
    mainEl.appendChild(dashboardContainer);

    const badgesGrid = document.getElementById('dashboard-badges-grid');
    Object.keys(BADGES).forEach(badgeId => {
        const badge = BADGES[badgeId];
        const isUnlocked = state.unlockedBadges.includes(badgeId);

        const badgeCard = document.createElement('div');
        badgeCard.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        badgeCard.innerHTML = `
            <div class="badge-icon-wrapper">${badge.icon}</div>
            <div class="badge-name">${t(`badge.${badgeId}.name`)}</div>
            <div class="badge-desc">${t(`badge.${badgeId}.desc`)}</div>
        `;
        badgesGrid.appendChild(badgeCard);
    });

    document.getElementById('btn-reset-data').addEventListener('click', () => {
        const confirmReset = confirm(t('resetConfirm'));
        if (confirmReset) {
            resetProgress();
            applyChrome();
            showDashboard({ skipGuide: true });
            updateHeaderStats();
            showToast(t('resetDone'), 'info');
        }
    });

    document.getElementById('btn-open-guide').addEventListener('click', () => openHowToPlay(false));
    document.getElementById('btn-open-about').addEventListener('click', openAbout);

    if (!skipGuide) {
        if (!state.hasSeenOnboarding) openOnboarding();
        else if (!state.hasSeenGuide) openHowToPlay(true);
    }
}

function showWorldHub(world) {
    currentView = 'world-hub';
    activeWorld = world;
    applyWorldTheme(world);

    const state = getState();
    const worldMeta = WORLDS_INFO.find(w => w.id === world);
    const levels = worldLevels(world);
    const completed = state.progress[world]?.completedLevels || [];
    const percent = getWorldProgressPercent(world);

    const mainEl = el.main();
    mainEl.innerHTML = '';

    const view = document.createElement('div');
    view.className = 'view-container';
    view.appendChild(makeBackButton(t('backDashboard'), () => showDashboard({ skipGuide: true })));

    const hero = document.createElement('div');
    hero.className = 'world-hub-hero';
    hero.innerHTML = `
        <div class="world-hub-heading">
            <span class="world-hub-icon">${worldMeta.icon}</span>
            <div>
                <h1>${t('worldTitle', { name: worldMeta.title })}</h1>
                <p>${t(worldMeta.descKey)}</p>
            </div>
        </div>
        <div class="world-hub-progress">
            <div class="world-progress-label">
                <span>${t('levelsCount', { n: completed.length })}</span>
                <span>${percent}%</span>
            </div>
            <div class="progress-container">
                <div class="progress-bar-fill" style="width: ${percent}%;"></div>
            </div>
        </div>
    `;
    view.appendChild(hero);

    const list = document.createElement('div');
    list.className = 'hub-levels';

    levels.forEach(levelData => {
        const lvlNum = levelData.level;
        const typeMeta = LEVEL_TYPES[levelData.type] || LEVEL_TYPES.quiz;
        const isCompleted = completed.includes(lvlNum);
        const isLocked = lvlNum > 1 && !completed.includes(lvlNum - 1) && !isCompleted;
        const statusClass = isLocked ? 'locked' : (isCompleted ? 'completed' : 'unlocked');
        const cta = isLocked ? t('locked') : (isCompleted ? t('replay') : t('start'));

        const card = document.createElement('button');
        card.type = 'button';
        card.className = `hub-level-card ${statusClass}`;
        card.disabled = isLocked;
        card.innerHTML = `
            <div class="hub-level-index">
                <span>${isLocked ? '🔒' : isCompleted ? '✅' : '⚡'}</span>
                <strong>${t('levelN', { n: lvlNum })}</strong>
            </div>
            <div class="hub-level-body">
                <span class="type-pill">${typeMeta.icon} ${typeLabel(levelData.type)}</span>
                <h3>${levelData.title}</h3>
                <p>${levelData.subtitle}</p>
            </div>
            <span class="hub-level-cta">${cta}</span>
        `;
        if (!isLocked) {
            card.addEventListener('click', () => startLevel(world, lvlNum));
        }
        list.appendChild(card);
    });

    view.appendChild(list);

    const nextIncomplete = [1, 2, 3, 4, 5].find(n => !completed.includes(n));
    if (nextIncomplete) {
        const continueWrap = document.createElement('div');
        continueWrap.className = 'hub-continue';
        const continueBtn = document.createElement('button');
        continueBtn.type = 'button';
        continueBtn.className = 'btn btn-primary';
        continueBtn.textContent = t('continueLevel', { n: nextIncomplete });
        continueBtn.addEventListener('click', () => startLevel(world, nextIncomplete));
        continueWrap.appendChild(continueBtn);
        view.appendChild(continueWrap);
    } else {
        const done = document.createElement('p');
        done.className = 'hub-world-complete';
        done.textContent = t('worldComplete', { name: worldMeta.title });
        view.appendChild(done);
    }

    mainEl.appendChild(view);
}

export function startLevel(world, levelNum) {
    activeWorld = world;
    activeLevelNum = levelNum;
    activeChallengeIdx = 0;
    isFirstAttempt = true;
    hintUsedThisChallenge = false;
    resetSessionErrors();
    applyWorldTheme(world);
    renderGameView();
}

function renderGameView() {
    currentView = 'game';
    const mainEl = el.main();
    mainEl.innerHTML = '';

    const worldLevelsData = worldLevels(activeWorld);
    const levelData = worldLevelsData.find(l => l.level === activeLevelNum);

    if (!levelData) {
        console.error(`Level ${activeLevelNum} not found in world ${activeWorld}`);
        showDashboard();
        return;
    }

    const viewContainer = document.createElement('div');
    viewContainer.className = 'view-container';
    viewContainer.appendChild(makeBackButton(t('backHub'), () => showWorldHub(activeWorld)));

    const gameLayout = document.createElement('div');
    gameLayout.className = 'game-layout';

    const mainPanel = document.createElement('div');
    mainPanel.className = 'game-main-panel';

    const isProject = levelData.type === 'project';
    const totalCount = isProject ? levelData.challenges.length : 3;
    const typeMeta = LEVEL_TYPES[levelData.type] || LEVEL_TYPES.quiz;
    const progressLabel = isProject
        ? t('stepOf', { n: activeChallengeIdx + 1, total: totalCount })
        : t('challengeOf', { n: activeChallengeIdx + 1, total: totalCount });

    const gameHeader = document.createElement('div');
    gameHeader.className = 'game-header';
    gameHeader.innerHTML = `
        <div class="game-header-top">
            <div class="game-title-container">
                <span class="type-pill">${typeMeta.icon} ${typeLabel(levelData.type)}</span>
                <span class="game-title">${t('levelN', { n: activeLevelNum })} : ${levelData.title}</span>
                <span class="game-subtitle">${levelData.subtitle}</span>
            </div>
            <span class="question-counter-badge" id="challenge-counter">${progressLabel}</span>
        </div>
        <div class="challenge-stepper" aria-hidden="true">
            ${Array.from({ length: totalCount }, (_, i) => {
                const cls = i < activeChallengeIdx ? 'done' : (i === activeChallengeIdx ? 'current' : '');
                return `<span class="step-dot ${cls}"></span>`;
            }).join('')}
        </div>
    `;
    mainPanel.appendChild(gameHeader);

    const challengeBody = document.createElement('div');
    challengeBody.className = 'challenge-body';
    challengeBody.id = 'challenge-workspace';
    mainPanel.appendChild(challengeBody);

    const hintPanel = document.createElement('div');
    hintPanel.className = 'hint-panel';
    hintPanel.id = 'hint-panel';
    hintPanel.hidden = true;
    mainPanel.appendChild(hintPanel);

    const feedbackPanel = document.createElement('div');
    feedbackPanel.className = 'feedback-panel';
    feedbackPanel.id = 'feedback-panel';
    mainPanel.appendChild(feedbackPanel);

    const actionsBar = document.createElement('div');
    actionsBar.className = 'game-actions-bar';
    actionsBar.innerHTML = `
        <div class="game-actions-left">
            <button class="btn btn-secondary" id="btn-back-challenge" disabled>${t('previous')}</button>
            <button class="btn btn-secondary" id="btn-hint" type="button">💡 ${t('hint')}</button>
        </div>
        <button class="btn btn-primary" id="btn-submit-action" disabled>${t('validate')}</button>
    `;
    mainPanel.appendChild(actionsBar);

    const kbdHint = document.createElement('p');
    kbdHint.className = 'kbd-hint';
    kbdHint.textContent = levelData.type === 'quiz' ? t('kbdQuiz') : t('kbdEnter');
    mainPanel.appendChild(kbdHint);

    gameLayout.appendChild(mainPanel);

    const sidebar = document.createElement('div');
    sidebar.className = 'levels-sidebar-card';
    const state = getState();
    const completedLevels = state.progress[activeWorld]?.completedLevels || [];

    sidebar.innerHTML = `
        <h3 class="levels-sidebar-title">🗺️ ${t('map', { name: WORLD_TITLES[activeWorld] })}</h3>
        <ul class="sidebar-levels-list">
            ${[1, 2, 3, 4, 5].map(lvlNum => {
                const isCompleted = completedLevels.includes(lvlNum);
                const isActive = lvlNum === activeLevelNum;
                const isLocked = lvlNum > 1 && !completedLevels.includes(lvlNum - 1) && !isCompleted && !isActive;

                let icon = '🔒';
                let statusClass = 'locked';
                if (isActive) {
                    icon = '⚡';
                    statusClass = 'active';
                } else if (isCompleted) {
                    icon = '✅';
                    statusClass = 'completed';
                } else if (!isLocked) {
                    icon = '🔓';
                    statusClass = 'unlocked';
                }

                return `
                    <li class="sidebar-level-item ${statusClass}" data-lvl="${lvlNum}">
                        <span class="level-icon">${icon}</span>
                        <span>${t('levelN', { n: lvlNum })}</span>
                    </li>
                `;
            }).join('')}
        </ul>
    `;

    sidebar.querySelectorAll('.sidebar-level-item:not(.locked)').forEach(item => {
        item.addEventListener('click', () => {
            const lvl = parseInt(item.dataset.lvl, 10);
            startLevel(activeWorld, lvl);
        });
        item.style.cursor = 'pointer';
    });

    gameLayout.appendChild(sidebar);
    viewContainer.appendChild(gameLayout);
    mainEl.appendChild(viewContainer);

    if (isProject) {
        levelData.challenges.forEach((step, idx) => {
            step.active = idx === activeChallengeIdx;
        });
    }

    const currentChallenge = levelData.challenges[activeChallengeIdx];
    const challengeToRender = isProject ? levelData : currentChallenge;

    renderChallenge(
        challengeToRender,
        levelData.type,
        document.getElementById('challenge-workspace'),
        (isInteractiveReady) => {
            document.getElementById('btn-submit-action').disabled = !isInteractiveReady;
        }
    );

    const submitBtn = document.getElementById('btn-submit-action');
    submitBtn.addEventListener('click', () => handleSubmission(levelData, currentChallenge));

    document.getElementById('btn-hint').addEventListener('click', () => {
        const panel = document.getElementById('hint-panel');
        const challenge = levelData.challenges[activeChallengeIdx];
        panel.hidden = false;
        panel.innerHTML = `<strong>${t('hintTitle')}</strong><p>${getHint(challenge, levelData.type)}</p>`;
        if (!hintUsedThisChallenge) {
            hintUsedThisChallenge = true;
            isFirstAttempt = false;
            registerHintUsed();
        }
    });

    const prevBtn = document.getElementById('btn-back-challenge');
    if (activeChallengeIdx > 0) {
        prevBtn.disabled = false;
        prevBtn.addEventListener('click', () => {
            activeChallengeIdx--;
            isFirstAttempt = true;
            hintUsedThisChallenge = false;
            renderGameView();
        });
    }
}

function handleSubmission(levelData, challenge) {
    const workspace = document.getElementById('challenge-workspace');
    const feedbackPanel = document.getElementById('feedback-panel');
    const submitBtn = document.getElementById('btn-submit-action');

    const payload = levelData.type === 'project' ? levelData : challenge;
    const isCorrect = verifyChallenge(payload, levelData.type, workspace);

    if (isCorrect) {
        const xpReward = isFirstAttempt && !hintUsedThisChallenge ? XP_REWARDS.firstTry : XP_REWARDS.retry;
        registerChallengeSuccess({
            firstAttempt: isFirstAttempt,
            usedHint: hintUsedThisChallenge
        });
        addXp(xpReward);
        updateHeaderStats();

        feedbackPanel.className = 'feedback-panel correct';
        feedbackPanel.innerHTML = `
            <div class="feedback-title">🎉 ${t('excellent')} <span class="xp-chip">+${xpReward} XP</span></div>
            <p class="feedback-text">${challenge.explanation}</p>
        `;

        workspace.querySelectorAll('input, select, textarea, .quiz-option-card, .reorder-item-card')
            .forEach(node => {
                node.style.pointerEvents = 'none';
                if (node.tagName === 'INPUT') node.disabled = true;
            });

        const selectedOption = workspace.querySelector('.quiz-option-card.selected');
        if (selectedOption) selectedOption.classList.add('correct');

        if (levelData.type === 'project') {
            challenge.completed = true;
        }

        const hintBtn = document.getElementById('btn-hint');
        if (hintBtn) hintBtn.disabled = true;

        const isProject = levelData.type === 'project';
        const totalCount = isProject ? levelData.challenges.length : 3;

        if (activeChallengeIdx < totalCount - 1) {
            submitBtn.textContent = t('nextChallenge');
            submitBtn.className = 'btn btn-primary';
            submitBtn.disabled = false;

            const newSubmitBtn = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
            newSubmitBtn.addEventListener('click', () => {
                activeChallengeIdx++;
                isFirstAttempt = true;
                hintUsedThisChallenge = false;
                renderGameView();
            });
        } else {
            submitBtn.textContent = t('seeRewards');
            submitBtn.className = 'btn btn-primary';
            submitBtn.disabled = false;

            const newSubmitBtn = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
            newSubmitBtn.addEventListener('click', () => {
                lastCompletion = completeLevel(activeWorld, activeLevelNum);
                showRewards(lastCompletion);
            });
        }
    } else {
        isFirstAttempt = false;
        registerChallengeFail();

        feedbackPanel.className = 'feedback-panel incorrect';

        let customHint = t('failGeneric');
        if (levelData.type === 'quiz') {
            customHint = t('failQuiz');
        } else if (levelData.type === 'debug') {
            customHint = t('failDebug', { n: challenge.errorLineIndex, hint: challenge.instruction });
        }

        feedbackPanel.innerHTML = `
            <div class="feedback-title">❌ ${t('oops')}</div>
            <p class="feedback-text">${customHint}</p>
        `;

        if (levelData.type === 'quiz') {
            const selectedOption = workspace.querySelector('.quiz-option-card.selected');
            if (selectedOption) {
                selectedOption.classList.add('incorrect');
                selectedOption.classList.remove('selected');
            }
        }

        submitBtn.textContent = t('retry');
        submitBtn.disabled = true;

        workspace.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                submitBtn.disabled = false;
            }, { once: true });
        });

        workspace.querySelectorAll('.quiz-option-card').forEach(card => {
            card.addEventListener('click', () => {
                submitBtn.disabled = false;
            }, { once: true });
        });

        workspace.querySelectorAll('.reorder-item-card').forEach(card => {
            card.addEventListener('click', () => {
                submitBtn.disabled = false;
            }, { once: true });
        });
    }
}

function showRewards(completion = lastCompletion || { isNew: false, bonusXp: 0, worldCompleted: false, allWorldsCompleted: false, newBadgeIds: [] }) {
    currentView = 'rewards';
    const mainEl = el.main();
    mainEl.innerHTML = '';
    triggerConfetti();
    updateHeaderStats();

    const worldMeta = WORLDS_INFO.find(w => w.id === activeWorld);
    const viewContainer = document.createElement('div');
    viewContainer.className = 'view-container';

    const rewardsView = document.createElement('div');
    rewardsView.className = 'rewards-view';

    let title = t('levelDone', { n: activeLevelNum });
    let subtitle = t('levelDoneSub');
    let icon = '🏆';

    if (completion.allWorldsCompleted && completion.isNew) {
        title = t('questDone');
        subtitle = t('questDoneSub');
        icon = '🌐';
    } else if (completion.worldCompleted && completion.isNew) {
        title = t('worldMastered', { name: worldMeta?.title || '' });
        subtitle = t('worldMasteredSub');
        icon = worldMeta?.icon || '🏆';
    }

    const celebrationHeader = document.createElement('div');
    celebrationHeader.className = 'celebration-header';
    celebrationHeader.innerHTML = `
        <span class="celebration-icon">${icon}</span>
        <h1>${title}</h1>
        <p>${subtitle}</p>
    `;
    rewardsView.appendChild(celebrationHeader);

    const rewardsCard = document.createElement('div');
    rewardsCard.className = 'rewards-card';

    const bonusXp = completion.bonusXp || 0;
    const bonusLabel = completion.isNew ? t('bonusCredited') : t('alreadyDone');

    rewardsCard.innerHTML = `
        <div class="xp-gained-box">
            <div class="xp-gained-value">${bonusXp ? `+${bonusXp} XP` : t('replayed')}</div>
            <div class="xp-gained-label">${bonusLabel}</div>
        </div>
        <p>${completion.isNew
            ? t('bonusAdded', { n: bonusXp })
            : t('replayNote')}</p>
    `;

    const newBadges = (completion.newBadgeIds || [])
        .map(id => BADGES[id])
        .filter(Boolean);

    if (newBadges.length) {
        const badgeSection = document.createElement('div');
        badgeSection.className = 'reward-badges-section';
        badgeSection.innerHTML = `<h3>🏅 ${newBadges.length > 1 ? t('badgesUnlockedPlural') : t('badgesUnlocked')}</h3>`;
        newBadges.forEach(badge => {
            const row = document.createElement('div');
            row.className = 'unlocked-badge-display';
            row.innerHTML = `
                <div class="unlocked-badge-icon">${badge.icon}</div>
                <div class="unlocked-badge-details">
                    <h4>${t(`badge.${badge.id}.name`)}</h4>
                    <p>${t(`badge.${badge.id}.desc`)}</p>
                </div>
            `;
            badgeSection.appendChild(row);
        });
        rewardsCard.appendChild(badgeSection);
    }

    const actionWrapper = document.createElement('div');
    actionWrapper.className = 'rewards-actions';

    const hubBtn = document.createElement('button');
    hubBtn.className = 'btn btn-secondary';
    hubBtn.textContent = t('worldMap');
    hubBtn.addEventListener('click', () => showWorldHub(activeWorld));
    actionWrapper.appendChild(hubBtn);

    const dashboardBtn = document.createElement('button');
    dashboardBtn.className = 'btn btn-secondary';
    dashboardBtn.textContent = t('dashboard');
    dashboardBtn.addEventListener('click', () => showDashboard());
    actionWrapper.appendChild(dashboardBtn);

    if (activeLevelNum < 5) {
        const nextLvlBtn = document.createElement('button');
        nextLvlBtn.className = 'btn btn-primary';
        nextLvlBtn.textContent = t('nextLevel');
        nextLvlBtn.addEventListener('click', () => startLevel(activeWorld, activeLevelNum + 1));
        actionWrapper.appendChild(nextLvlBtn);
    } else if (!completion.allWorldsCompleted) {
        const dashPrimary = document.createElement('button');
        dashPrimary.className = 'btn btn-primary';
        dashPrimary.textContent = t('otherWorld');
        dashPrimary.addEventListener('click', () => showDashboard());
        actionWrapper.appendChild(dashPrimary);
    }

    rewardsCard.appendChild(actionWrapper);
    rewardsView.appendChild(rewardsCard);
    viewContainer.appendChild(rewardsView);
    mainEl.appendChild(viewContainer);
}

function openOnboarding() {
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.id = 'prefs-modal';
    overlay.innerHTML = `
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="onboard-title">
            <img src="img/logo.svg" alt="" width="72" height="72" class="logo-img" style="margin:0 auto 1rem;display:block;">
            <h2 id="onboard-title">${t('onboardingTitle')}</h2>
            <p class="guide-lead">${t('onboardingLead')}</p>
            <p><strong>${t('chooseLang')}</strong></p>
            <div class="choice-grid" id="lang-choices">
                <button type="button" class="choice-card ${getLang() === 'fr' ? 'is-active' : ''}" data-lang="fr">🇫🇷 Français</button>
                <button type="button" class="choice-card ${getLang() === 'en' ? 'is-active' : ''}" data-lang="en">🇬🇧 English</button>
            </div>
            <p><strong>${t('chooseTheme')}</strong></p>
            <div class="choice-grid" id="theme-choices">
                <button type="button" class="choice-card ${getState().appearance !== 'light' ? 'is-active' : ''}" data-appearance="dark">🌙 ${t('themeDark')}</button>
                <button type="button" class="choice-card ${getState().appearance === 'light' ? 'is-active' : ''}" data-appearance="light">☀️ ${t('themeLight')}</button>
            </div>
            <button type="button" class="btn btn-primary" id="btn-onboard-continue">${t('continue')}</button>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelectorAll('#lang-choices .choice-card').forEach(btn => {
        btn.addEventListener('click', () => {
            setLang(btn.dataset.lang);
            setLangPref(btn.dataset.lang);
            applyChrome();
            openOnboarding();
        });
    });
    overlay.querySelectorAll('#theme-choices .choice-card').forEach(btn => {
        btn.addEventListener('click', () => {
            setAppearancePref(btn.dataset.appearance);
            applyChrome();
            openOnboarding();
        });
    });
    overlay.querySelector('#btn-onboard-continue').addEventListener('click', () => {
        markOnboardingSeen();
        closeModal();
        openHowToPlay(true);
    });
}

function openHowToPlay(isFirstVisit) {
    closeModal();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.id = 'how-to-play-modal';
    overlay.innerHTML = `
        <div class="modal-content modal-wide" role="dialog" aria-modal="true" aria-labelledby="guide-title">
            <h2 id="guide-title">📘 ${t('guideTitle')}</h2>
            <p class="guide-lead">${t('guideLead')}</p>
            <div class="how-to-grid">
                <article>
                    <h3>1. ${t('typeQuiz')}</h3>
                    <p>${t('guideQuiz')}</p>
                </article>
                <article>
                    <h3>2. ${t('typeBlank')}</h3>
                    <p>${t('guideBlank')}</p>
                </article>
                <article>
                    <h3>3. ${t('typeDebug')}</h3>
                    <p>${t('guideDebug')}</p>
                </article>
                <article>
                    <h3>4. ${t('typeReorder')}</h3>
                    <p>${t('guideReorder')}</p>
                </article>
                <article>
                    <h3>5. ${t('typeProject')}</h3>
                    <p>${t('guideProject')}</p>
                </article>
                <article>
                    <h3>XP & badges</h3>
                    <p>${t('guideXp')}</p>
                </article>
            </div>
            <p class="guide-note">${t('guideNote')}</p>
            <button type="button" class="btn btn-primary" id="btn-close-guide">${isFirstVisit ? t('startQuest') : t('close')}</button>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            markGuideSeen();
            closeModal();
        }
    });
    overlay.querySelector('#btn-close-guide').addEventListener('click', () => {
        markGuideSeen();
        closeModal();
    });
}

function openAbout() {
    closeModal();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.id = 'about-modal';
    overlay.innerHTML = `
        <div class="modal-content modal-wide" role="dialog" aria-modal="true" aria-labelledby="about-title">
            <h2 id="about-title">ℹ️ ${t('aboutTitle')}</h2>
            <p class="guide-lead">${t('aboutLead')}</p>
            <div class="about-grid">
                <article>
                    <h3>${t('aboutInternship')}</h3>
                </article>
                <article>
                    <h3>${t('aboutStack')}</h3>
                </article>
                <article>
                    <h3>${t('aboutScope')}</h3>
                </article>
                <article>
                    <h3>${t('aboutPersist')}</h3>
                </article>
            </div>
            <button type="button" class="btn btn-primary" id="btn-close-about">${t('close')}</button>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    overlay.querySelector('#btn-close-about').addEventListener('click', closeModal);
}

function closeModal() {
    ['how-to-play-modal', 'prefs-modal', 'about-modal'].forEach(id => {
        const overlay = document.getElementById(id);
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    });
}

export function showToast(text, status = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '10000';
        toastContainer.style.display = 'flex';
        toastContainer.style.flexDirection = 'column';
        toastContainer.style.gap = '10px';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.style.background = 'var(--bg-card)';
    toast.style.border = '1px solid rgba(255,255,255,0.1)';

    const colors = {
        success: 'var(--color-correct)',
        error: 'var(--color-incorrect)',
        info: 'var(--theme-color)'
    };

    toast.style.borderLeft = `4px solid ${colors[status] || 'var(--theme-color)'}`;
    toast.style.color = 'var(--text-primary)';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = 'var(--radius-md)';
    toast.style.boxShadow = 'var(--shadow-lg)';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '600';
    toast.style.animation = 'slide-up 0.3s ease-out';
    toast.textContent = text;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500);
    }, 3500);
}
