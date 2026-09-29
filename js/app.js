/**
 * FrameQuest Main Entry Point
 */

import { initGame, getState } from './state.js';
import { setLang } from './i18n.js';
import { initUi, showDashboard, applyChrome } from './ui.js';
import { contentEn, localizeWorld } from './content-en.js';

import { content as reactContent } from '../react/content.js';
import { content as vueContent } from '../vue/content.js';
import { content as angularContent } from '../angular/content.js';
import { content as nodeContent } from '../node/content.js';

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    const prefs = getState();
    setLang(prefs.lang || 'fr');

    const contentData = {
        fr: {
            react: reactContent,
            vue: vueContent,
            angular: angularContent,
            node: nodeContent
        },
        en: {
            react: localizeWorld(reactContent, contentEn.react),
            vue: localizeWorld(vueContent, contentEn.vue),
            angular: localizeWorld(angularContent, contentEn.angular),
            node: localizeWorld(nodeContent, contentEn.node)
        }
    };

    initUi(contentData);
    applyChrome();
    showDashboard();
});
