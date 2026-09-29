/**
 * FrameQuest State Manager
 */

const STATE_KEY = 'framequest_player_state';

export const XP_REWARDS = {
    firstTry: 100,
    retry: 50,
    levelBonus: 300
};

const defaultState = {
    xp: 0,
    level: 1,
    unlockedBadges: [],
    progress: {
        react: { completedLevels: [] },
        vue: { completedLevels: [] },
        angular: { completedLevels: [] },
        node: { completedLevels: [] }
    },
    stats: {
        attempts: 0,
        challengesSolved: 0,
        perfectChallenges: 0,
        hintsUsed: 0
    },
    hasSeenGuide: false,
    hasSeenOnboarding: false,
    lang: 'fr',
    appearance: 'dark',
    sessionErrors: 0
};

export const BADGES = {
    'first_challenge': {
        id: 'first_challenge',
        name: 'Premier Pas',
        desc: 'Validez votre tout premier défi !',
        icon: '🐣'
    },
    'react_master': {
        id: 'react_master',
        name: 'Maître React',
        desc: 'Complétez l\'intégralité du monde React.',
        icon: '⚛️'
    },
    'vue_master': {
        id: 'vue_master',
        name: 'Gourou Vue',
        desc: 'Complétez l\'intégralité du monde Vue.js.',
        icon: '💚'
    },
    'angular_master': {
        id: 'angular_master',
        name: 'Chevalier Angular',
        desc: 'Complétez l\'intégralité du monde Angular.',
        icon: '🛡️'
    },
    'node_master': {
        id: 'node_master',
        name: 'Ninja du Serveur',
        desc: 'Complétez l\'intégralité du monde Node.js.',
        icon: '🚀'
    },
    'expert_level': {
        id: 'expert_level',
        name: 'Architecte Web',
        desc: 'Atteignez le niveau de joueur 5.',
        icon: '👑'
    },
    'perfect_run': {
        id: 'perfect_run',
        name: 'Sniper de Code',
        desc: 'Terminez un niveau complet sans aucune erreur.',
        icon: '🎯'
    },
    'polyglot': {
        id: 'polyglot',
        name: 'Polyglotte JS',
        desc: 'Terminez les quatre mondes : React, Vue, Angular et Node.js.',
        icon: '🌐'
    }
};

let currentState = cloneState();
const listeners = [];

function cloneState(state = defaultState) {
    return JSON.parse(JSON.stringify(state));
}

export function subscribe(callback) {
    listeners.push(callback);
}

function notify(event, data) {
    listeners.forEach(cb => cb(event, data));
}

export function initGame() {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            currentState = {
                ...cloneState(),
                ...parsed,
                progress: {
                    react: { ...defaultState.progress.react, ...parsed.progress?.react },
                    vue: { ...defaultState.progress.vue, ...parsed.progress?.vue },
                    angular: { ...defaultState.progress.angular, ...parsed.progress?.angular },
                    node: { ...defaultState.progress.node, ...parsed.progress?.node }
                },
                stats: {
                    ...defaultState.stats,
                    ...parsed.stats
                },
                hasSeenOnboarding: parsed.hasSeenOnboarding ?? Boolean(parsed.hasSeenGuide)
            };
        } catch (e) {
            console.error('Error loading state, using default.', e);
            currentState = cloneState();
        }
    } else {
        currentState = cloneState();
    }
    notify('init', currentState);
    return currentState;
}

export function getState() {
    return currentState;
}

function save() {
    localStorage.setItem(STATE_KEY, JSON.stringify(currentState));
    notify('save', currentState);
}

export function resetProgress() {
    const { lang, appearance, hasSeenGuide, hasSeenOnboarding } = currentState;
    currentState = cloneState();
    currentState.lang = lang === 'en' ? 'en' : 'fr';
    currentState.appearance = appearance === 'light' ? 'light' : 'dark';
    currentState.hasSeenGuide = Boolean(hasSeenGuide);
    currentState.hasSeenOnboarding = Boolean(hasSeenOnboarding);
    save();
    notify('reset', currentState);
}

export function setLangPref(lang) {
    currentState.lang = lang === 'en' ? 'en' : 'fr';
    save();
    notify('prefs', currentState);
}

export function setAppearancePref(appearance) {
    currentState.appearance = appearance === 'light' ? 'light' : 'dark';
    save();
    notify('prefs', currentState);
}

export function markOnboardingSeen() {
    currentState.hasSeenOnboarding = true;
    save();
}

export function addXp(amount) {
    if (!amount) return;
    currentState.xp += amount;

    const newLevel = Math.floor(currentState.xp / 1000) + 1;
    const levelUp = newLevel > currentState.level;

    if (levelUp) {
        currentState.level = newLevel;
        notify('levelUp', { level: currentState.level });

        if (newLevel >= 5) {
            unlockBadge('expert_level');
        }
    }

    save();
    notify('xpAdded', { xpGained: amount, totalXp: currentState.xp });
}

export function areAllWorldsComplete() {
    return ['react', 'vue', 'angular', 'node']
        .every(world => (currentState.progress[world]?.completedLevels?.length || 0) === 5);
}

export function completeLevel(world, levelNum) {
    const worldProgress = currentState.progress[world];
    const badgesBefore = [...currentState.unlockedBadges];
    const alreadyDone = worldProgress.completedLevels.includes(levelNum);

    if (alreadyDone) {
        return {
            isNew: false,
            bonusXp: 0,
            worldCompleted: worldProgress.completedLevels.length === 5,
            allWorldsCompleted: areAllWorldsComplete(),
            newBadgeIds: []
        };
    }

    worldProgress.completedLevels.push(levelNum);
    addXp(XP_REWARDS.levelBonus);

    if (currentState.sessionErrors === 0) {
        unlockBadge('perfect_run');
    }

    if (worldProgress.completedLevels.length === 5) {
        unlockBadge(`${world}_master`);
    }

    if (areAllWorldsComplete()) {
        unlockBadge('polyglot');
    }

    save();
    notify('levelCompleted', { world, level: levelNum });

    return {
        isNew: true,
        bonusXp: XP_REWARDS.levelBonus,
        worldCompleted: worldProgress.completedLevels.length === 5,
        allWorldsCompleted: areAllWorldsComplete(),
        newBadgeIds: currentState.unlockedBadges.filter(id => !badgesBefore.includes(id))
    };
}

export function registerChallengeSuccess({ firstAttempt = false, usedHint = false } = {}) {
    currentState.stats.attempts += 1;
    currentState.stats.challengesSolved += 1;
    if (firstAttempt && !usedHint) {
        currentState.stats.perfectChallenges += 1;
    }
    unlockBadge('first_challenge');
    save();
}

export function registerChallengeFail() {
    currentState.stats.attempts += 1;
    currentState.sessionErrors += 1;
    save();
}

export function registerHintUsed() {
    currentState.stats.hintsUsed += 1;
    save();
}

export function getAccuracyPercent() {
    const { challengesSolved, perfectChallenges } = currentState.stats;
    if (!challengesSolved) return 0;
    return Math.round((perfectChallenges / challengesSolved) * 100);
}

export function markGuideSeen() {
    if (currentState.hasSeenGuide) return;
    currentState.hasSeenGuide = true;
    save();
}

export function unlockBadge(badgeId) {
    if (BADGES[badgeId] && !currentState.unlockedBadges.includes(badgeId)) {
        currentState.unlockedBadges.push(badgeId);
        save();
        notify('badgeUnlocked', BADGES[badgeId]);
        return true;
    }
    return false;
}

export function getWorldProgressPercent(world) {
    const completed = currentState.progress[world]?.completedLevels?.length || 0;
    return Math.round((completed / 5) * 100);
}

export function trackSessionError() {
    currentState.sessionErrors++;
}

export function resetSessionErrors() {
    currentState.sessionErrors = 0;
}
