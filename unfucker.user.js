// ==UserScript==
// @name         dashboard unfucker
// @version      5.7.1
// @description  no more shitty twitter ui for pc
// @author       dragongirlsnout
// @match        https://www.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @downloadURL  https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker.user.js
// @updateURL    https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker.user.js
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

'use strict';
const $ = window.jQuery;

const main = async function (nonce) {
  const version = '5.7.0';
  const match = [
    '',
    'dashboard',
    'settings',
    'blog',
    'domains',
    'search',
    'likes',
    'following',
    'inbox',
    'tagged',
    'explore',
    'reblog'
  ];
  let state = window.___INITIAL_STATE___;
  let configPreferences = {
    lastVersion: version,
    showCta: true,
    hideDashboardTabs: { advanced: false, type: 'checkbox', value: '' },
    collapseCaughtUp: { advanced: false, type: 'checkbox', value: '' },
    hideRecommendedBlogs: { advanced: false, type: 'checkbox', value: '' },
    hideRecommendedTags: { advanced: false, type: 'checkbox', value: '' },
    originalHeaders: { advanced: false, type: 'checkbox', value: 'checked'},
    hideTumblrRadar: { advanced: false, type: 'checkbox', value: '' },
    hideExplore: { advanced: false, type: 'checkbox', value: '' },
    hideTumblrShop: { advanced: false, type: 'checkbox', value: 'checked' },
    hideBadges: { advanced: false, type: 'checkbox', value: '' },
    highlightLikelyBots: { advanced: false, type: 'checkbox', value: '' },
    showFollowingLabel: { advanced: false, type: 'checkbox', value: '' },
    contentPositioning: { advanced: false, type: 'range', value: 0 },
    contentWidth: { advanced: false, type: 'range', value: 990 },
    messagingScale: { advanced: false, type: 'range', value: 1 },
    disableTumblrDomains: { advanced: true, type: 'checkbox', value: 'checked' },
    revertActivityFeedRedesign: { advanced: false, type: 'checkbox', value: 'checked' },
    revertMessagingRedesign: {
      advanced: false,
      type: 'checkbox',
      value: 'checked',
      style: '1',
      messageColor: 'f0f0f0',
      backgroundColor: 'ffffff',
      textColor: '121212'
    },
    revertSearchbarRedesign: { advanced: true, type: 'checkbox', value: 'checked' },
    enableCustomTabs: { advanced: true, type: 'checkbox', value: '' },
    enableReblogPolls: { advanced: true, type: 'checkbox', value: '' },
    disableTagNag: { advanced: false, type: 'checkbox', value: 'checked' },
    reAddHomeNotifications: { advanced: true, type: 'checkbox', value: 'checked' },
    displayVoteCounts: { advanced: false, type: 'checkbox', value: '' },
    votelessResults : { advanced: false, type: 'checkbox', value: ''},
    showNsfwPosts: { advanced: true, type: 'checkbox', value: '' },
    disableScrollingAvatars: { advanced: false, type: 'checkbox', value: '' },
    originalEditorHeaders: { advanced: false, type: 'checkbox', value: '' }
  };
  let pathname = window.location.pathname.split('/')[1];
  const $a = selector => document.querySelectorAll(selector);
  const $ = selector => document.querySelector(selector);
  const $str = str => {
    let elem = document.createElement('div');
    elem.innerHTML = str;
    elem = elem.firstElementChild;
    return elem;
  };
  const hide = function (elem) {
    if (elem.length) elem.forEach(function (item) { item.style.display = 'none'; });
    else elem.style.display = 'none';
  };
  const show = function (elem) {
    if (elem.length) elem.forEach(function (item) { item.style.display = null; });
    else elem.style.display = null;
  };
  const toggle = (elem, toggle = 'ignore') => {
    if (elem && elem.length !== 0) {
      if (toggle === 'ignore') {
        elem.style.display === 'none'
          ? show(elem)
          : hide(elem);
      } else {
        toggle === true
          ? show(elem)
          : hide(elem);
      }
    }
  };
  const css = (elem, properties = {}) => {
    for (const property in properties) {
      elem.style[property] = properties[property];
    }
  };
  const find = (nodeList, selector) => {
    let elem;
    nodeList.forEach(currentValue => {
      if (currentValue.querySelector(`:scope ${selector}`)) {
        elem = currentValue;
      }
    });
    return elem;
  };
  const remove = (nodeList) => {
    nodeList.forEach(currentValue => { currentValue.remove(); });
  };
  const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms));
  const matchPathname = () => match.includes(pathname);
  const isDashboard = () => ['dashboard', ''].includes(pathname);
  const storageAvailable = type => { // thanks mdn web docs!
    let storage;
    try {
      storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException && (
          e.code === 22 ||
          e.code === 1014 ||
          e.name === 'QuotaExceededError' ||
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        ) &&
          storage &&
          storage.length !== 0
      );
    }
  };
  const modifyObfuscatedFeatures = (obfuscatedFeatures, featureSet) => {
    const obf = JSON.parse(atob(obfuscatedFeatures));
    for (const x of featureSet) {
      obf[x.name] = x.value;
    }
    return btoa(JSON.stringify(obf));
  };
  const waitFor = (selector, scope = document, retried = 0) => new Promise((resolve) => {
    if (scope.querySelector(selector)) { resolve(); } else if (retried < 50) { window.requestAnimationFrame(() => waitFor(selector, scope, retried + 1).then(resolve)); }
  });
  const updatePreferences = () => {
    window.localStorage.setItem('configPreferences', JSON.stringify(configPreferences));
  };
  const getUtilities = async function () {
    let retries = 0;
    while (retries++ < 1000 && (typeof window.tumblr === 'undefined' || typeof window.tumblr.getCssMap === 'undefined')) {
      await new Promise((resolve) => setTimeout(resolve));
    }
    const cssMap = await window.tumblr.getCssMap();
    const keyToClasses = (...keys) => keys.flatMap(key => cssMap[key]).filter(Boolean);
    const keyToCss = (...keys) => `:is(${keyToClasses(...keys).map(className => `.${className}`).join(', ')})`;
    const tr = string => `${window.tumblr.languageData.translations[string] || string}`;
    return { keyToClasses, keyToCss, tr };
  };
  const style = $str(`
    <style nonce="${nonce}">
      #base-container > div[class]:not(#adBanner) > div:first-child {
        z-index: 100;
        border-bottom: 1px solid rgba(var(--white-on-dark),.13) !important;
        position: -webkit-sticky !important;
        position: sticky !important;
        top: 0 !important;
        min-height: unset !important;
        background-color: RGB(var(--navy));
      }
    </style>
  `);

  let localAddedPostFlag = true;
  let dummyValue = false //config prop placeholder
  const addedPosts = [
  ];

  const timelineSelector = /\/api\/v2\/timeline/;
  const peeprSelector = new RegExp(`/\/api\/v2\/blog\/${pathname}\/posts/`);
  const isPostFetch = input => {
    if (timelineSelector.test(input) || peeprSelector.test(input)) return true;
    else return false;
  };
  const oldFetch = window.fetch;
  window.fetch = async (input, options) => {
    const response = await oldFetch(input, options);
    let content = await response.text();
    if (isPostFetch(input) && (configPreferences.showNsfwPosts.value || dummyValue)) {
      console.info(`modified data fetched from ${input}`);
      content = JSON.parse(content);
      const elements = content.response.timeline.elements;
      elements.forEach(function (post) { post.isNsfw = false; });
      if (timelineSelector.test(input) && dummyValue && localAddedPostFlag && typeof window.tumblr.apiFetch !== 'undefined') {
        for (const id of addedPosts) {
          let addedPost;
          await window.tumblr.apiFetch(`/v2/blog/dragongirlsnout/posts/${id}?fields[blogs]=name,avatar,title,url,blog_view_url,is_adult,description_npf,uuid,can_be_followed,?followed`).then(response => {
            if (response && response?.meta.status === 200) {
              const data = response.response;
              addedPost = data;
            }
          });
          if (typeof addedPost !== 'undefined') elements.push(addedPost);
        }
        localAddedPostFlag = false;
        dummyValue = false;
        updatePreferences();
      }
      content = JSON.stringify(content);
    }
    return new Response(content, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  };

  if (storageAvailable('localStorage')) {
    if (!window.localStorage.getItem('configPreferences') || Array.isArray(JSON.parse(window.localStorage.getItem('configPreferences')))) {
      updatePreferences();
      console.log('initialized preferences');
    } else {
      const currentPreferences = JSON.parse(window.localStorage.getItem('configPreferences'));
      const currentKeys = Object.keys(currentPreferences);
      for (const key in configPreferences) {
        if (currentKeys.includes(key)) {
          if (typeof configPreferences[key] === 'object') {
            Object.keys(configPreferences[key]).forEach(function (val) {
              if (!(val in currentPreferences[key])) {
                currentPreferences[key][val] = configPreferences[key][val];
              }
            });
          }
          configPreferences[key] = currentPreferences[key];
        }
      }
      configPreferences.disableTagNag.advanced = false;
      updatePreferences();
    }
  }

  const modifyInitialTimeline = (obj, context) => {
    if (!obj || !configPreferences.showNsfwPosts.value) return obj;
    else if (context === 'dashboard') {
      obj.dashboardTimeline.response.timeline.elements.forEach(function (post) { post.isNsfw = false; });
    } else if (context === 'peepr') {
      obj.initialTimeline.objects.forEach(function (post) { post.isNsfw = false; });
    }
    console.log(obj);
    return obj;
  };

  const featureSet = [
    { name: 'redpopDesktopVerticalNav', value: false },
    { name: 'domainsSettings', value: !configPreferences.disableTumblrDomains.value },
    { name: 'improvedSearchTypeahead', value: !configPreferences.revertSearchbarRedesign.value },
    { name: 'configurableTabbedDash', value: !!configPreferences.enableCustomTabs.value },
    { name: 'allowAddingPollsToReblogs', value: !!configPreferences.enableReblogPolls.value },
    { name: 'redpopUnreadNotificationsOnTab', value: !configPreferences.reAddHomeNotifications.value },
    { name: 'redpopDesktopVerticalNav', value: false },
    { name: 'crowdsignalPollsNpf', value: true },
    { name: 'crowdsignalPollsCreate', value: true },
    { name: 'adFreeCtaBanner', value: false }
  ];
  Object.defineProperty(window, '___INITIAL_STATE___', { // thanks twilight-sparkle-irl!
    set (x) {
      state = x;
    },
    get () {
      try {
        return {
          ...state,
          Dashboard: modifyInitialTimeline(state.Dashboard, 'dashboard'),
          PeeprRoute: modifyInitialTimeline(state.PeeprRoute, 'peepr'),
          obfuscatedFeatures: modifyObfuscatedFeatures(state.obfuscatedFeatures, featureSet)
        };
      } catch (e) {
        console.error('Failed to modify features', e);
      }
      return state;
    },
    enumerable: true,
    configurable: true
  });
  document.head.appendChild(style);
  document.addEventListener('DOMContentLoaded', () => {
    getUtilities().then(({ keyToCss, keyToClasses, tr }) => {
      let windowWidth = window.innerWidth;
      let safeOffset = (windowWidth - 1000) / 2;
      if (Math.abs(configPreferences.contentPositioning.value) > safeOffset) configPreferences.contentPositioning.value = 0;
      if (configPreferences.contentWidth.value < 990 || configPreferences.contentWidth.value > windowWidth) configPreferences.contentWidth.value = 990;
      if (configPreferences.messagingScale.value < 1 || configPreferences.messagingScale.value > 2) configPreferences.messagingScale = 1;

      const postSelector = '[tabindex="-1"][data-id] article';
      const postHeaderTargetSelector = `${keyToCss('main')} > :not(${keyToCss('blogTimeline')}) [data-timeline]:not([data-timeline*='posts/'],${keyToCss('masonry')}) [tabindex='-1'][data-id] article:not(.__avatarFixed)`;
      const noteSelector = `[aria-label="${tr('Notification')}"],[aria-label="${tr('Unread Notification')}"]`;
      const answerSelector = '[data-testid="poll-answer"]:not(.__pollDetailed)';
      const pollBlockSelector = '[data-attribution="poll-block"]';
      const voteSelector = `button${keyToCss('vote')}:not(.__pollResultsShown)`;
      const conversationSelector = '[data-skip-glass-focus-trap]';
      const carouselCellSelector = `[data-cell-id] ${keyToCss('tagCard')}, [data-cell-id] ${keyToCss('blogRecommendation')}, [data-cell-id] ${keyToCss('tagChicletLink')}`;
      const masonryNotesSelector = `[data-timeline]${keyToCss('masonry')} article ${keyToCss('formattedNoteCount')}`;
      const containerSelector = `${keyToCss('bluespaceLayout')} > ${keyToCss('container')}:not(${keyToCss('mainContentIs4ColumnMasonry')})`;

      const tsKey = 'lastSeenNoTagPromptTsKey';

      const newNodes = [];
      const target = document.getElementById('root');

      const styleElement = $str(`
        <style id='__s'>
          #__m {
            margin-bottom: 20px;
            position: relative;
          }
          #__m button {
            position: relative;
          }
          #__in {
            padding: 8px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          #__in h1 {
            color: rgb(var(--white-on-dark));
            font-size: 1.2em;
            display: inline;
          }
          #__m ul {
            max-height: 360px;
            margin: 0 4px 8px;
            padding: 0;
            background: RGB(var(--white));
            border-radius: 0 0 3px 3px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(var(--black),.4)rgba(var(--white),.1);
          }
          #__m ul.submenu {
            margin: 0;
            padding: 0 16px;
            display: none;
            border-bottom: 1px solid rgba(var(--black),.07);
          }
          #__m li[active="true"] + ul.submenu { display: block; }
          #__m li {
            list-style-type: none;
            padding: 8px 12px;
            border-bottom: 1px solid rgba(var(--black),.07);
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: rgb(var(--black));
          }
          #__m li:last-of-type, #__m li[active="true"] { border: none; }
          #__m li span:not(.infoHeader > span) { max-width: 240px; }
          .__n {
            position: absolute;
          }
          #__in > .__n {
            color: rgb(var(--accent));
            top: -6px;
            left: 220px;
          }
          button .__n {
            content: "";
            border-radius: 50%;
            border: solid 4px rgb(var(--accent));
            top: 0px;
            right: -6px;
          }
          .infoHeader {
            color: rgb(var(--navy)) !important;
            background: rgb(var(--accent));
            padding: 12px 12px;
            font-weight: bold;
            margin: 0 4px;
            border-radius: 3px 3px 0 0;
          }
          .configInput[type="checkbox"],
          .subConfigInput[type="radio"] {
            height: 0;
            width: 0;
            visibility: hidden;
            margin: 0;
          }
          .configInput[type="checkbox"] + label {
            cursor: pointer;
            text-indent: -9999px;
            width: 36px;
            height: 18px;
            background: rgb(var(--secondary-accent));
            transition: 0.3s;
            display: block;
            border-radius: 18px;
            position: relative;
          }
          .configInput[type="checkbox"] + label:after {
            content: "";
            position: absolute;
            top: 2px;
            left: 2px;
            width: 14px;
            height: 14px;
            background: rgb(var(--white));
            border-radius: 7px;
            transition: 0.3s;
          }
          .configInput:checked + label { background: rgb(var(--accent)); }
          .configInput:checked + label:after {
            left: calc(100% - 2px);
            transform: translateX(-100%);
            background: rgb(var(--white-on-dark));
          }
          .configInput[type="checkbox"] + label:active:after { width: 20px; }
          .subConfigInput[type="radio"] + label {
            cursor: pointer;
            text-indent: -9999px;
            position: relative;
            height: 12px;
            width: 12px;
            border: 2px solid rgb(var(--accent));
            border-radius: 50%;
          }
          .subConfigInput[type="radio"] + label:after {
            content: "";
            position: absolute;
            top: 2px;
            left: 2px;
            height: 8px;
            width: 8px;
            border-radius: 50%;
          }
          .subConfigInput[type="radio"]:checked + label:after {  background: rgb(var(--accent)); }
          .subConfigInput[type="radio"]:not(:checked) + label:hover:after {  background: rgba(var(--accent),.3); }
          .textInput {
            border: 2px solid rgb(var(--accent));
            border-radius: 3px;
            width: 48px;
          }
          .textInput + span:after {
            padding-left: 5px;
            font-weight: bold;
          }
          .textInput:invalid + span:after {
            content: "✖";
            color: rgb(var(--red));
          }
          .textInput:valid + span::after {
            content: "✓";
            color: rgb(var(--green));
          }
          .rangeInput {
            width: 160px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .configInput[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            cursor: pointer;
          }
          .configInput[type="range"]:focus { outline: none; }
          .configInput[type="range"]::-webkit-slider-runnable-track,
          .configInput[type="range"]::-moz-range-track {
            background: rgb(var(--accent));
            border-radius: 1rem;
            height: 0.5rem;
          }
          .configInput[type="range"]::-webkit-slider-thumb,
          .configInput[type="range"]::-moz-range-track::-moz-range-thumb {
            -webkit-appearance: none;
            appearance: none;
            border: none;
            margin-top: -4px;
            background-color: rgb(var(--white-on-dark));
            border-radius: 50%;
            height: 1rem;
            width: 1rem;
          }
          .rangeInput datalist {
            display: flex;
            justify-content: space-between;
          }
          #__cio {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            margin: 4px 4px 8px;
          }
          .iOButton {
            color: rgb(var(--navy));
            width: 49%;
            background: rgb(var(--accent));
            border-radius: var(--border-radius-small);
            font-size: 20px;
            padding: 4px;
          }
          #__im {
            position: absolute;
            top: 80px;
            left: 0;
            font-size: 20px;
            color: rgb(var(--black));
            transition: opacity .6s ease-in;
            background: rgb(var(--accent));
            padding: 8px;
            text-align: center;
            border-radius: var(--border-radius-small);
            opacity: 0;
          }

          article.__headerFixed header ${keyToCss('communityLabel')} { display: none !important; }
          .__reblogIcon {
            height: 14px;
            display: inline-block;
            transform: translateY(3px);
            margin: 0 5px;
          }
          .__userAvatarWrapper {
            top: 0;
            position: absolute;
            left: -84px;
          }
          .__userAvatarWrapper > ${keyToCss('avatar')} {
            position: absolute !important;
            top: 0 !important;
          }
          .__stickyContainer {
            color: RGB(var(--white-on-dark));
            height: 100%;
            position: absolute;
            left: -84px;
            padding: 0;
          }
          .__stickyContainer > ${keyToCss('avatar')} {
            position: sticky;
            top: 69px;
            transition: top .25s;
          }
          .__stickyContainer ${keyToCss('blogLink')} > ${keyToCss('avatar')},
            .__stickyContainer ${keyToCss('blogLink')} > ${keyToCss('avatar')} ${keyToCss('image')},
            .__stickyContainer ${keyToCss('anonymous')} {
            width: 64px !important;
            height: 64px !important;
          }
          .__stickyContainer ${keyToCss('blogLink')} > ${keyToCss('subavatar')},
            .__stickyContainer ${keyToCss('blogLink')} > ${keyToCss('subavatar')} ${keyToCss('image')} {
            width: 32px !important;
            height: 32px !important;
          }
          .__stickyContainer ${keyToCss('badge')} { display: none; }
          .__avatarWrapper { position: relative; }
          .__blogLink {
            cursor: pointer;
            word-break: break-word;
            text-decoration: none;
          }
          .__targetWrapper {
            width: inherit;
            vertical-align: top;
            display: inline-block;
          }
          .__avatarInner { position: relative; }
          .__avatarWrapperInner {
            border-radius: var(--border-radius-small);
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          .__placeholder {
            width: 100%;
            line-height: 0;
            position: relative;
          }
          .__avatarImage {
            position: absolute;
            top: 0;
            left: 0;
            object-fit: cover;
            visibility: visible;
          }
          
          .customLabelContainer {
            white-space: nowrap;
            border-radius: 4px;
            padding: 0 4px;
            font-size: .78125rem;
            font-weight: 700;
            line-height: 1.52;
            display: inline-block;
          }
          .customLabelContainer[label="Follows You"] {
            color: rgb(var(--blue));
            background-color: rgba(var(--blue),.2);
          }
          .customLabelContainer[label="Possible Bot"] {
            color: rgb(var(--red));
            background-color: rgba(var(--red),.2);
          }
          .customLabelContainer[label="Possible Bot"]::after {
            content: "about";
            border-bottom: 1px solid rgb(var(--red));
            font-size: 12px;
            margin-left: 5px;
          }
          .customLabelIcon {
            vertical-align: middle;
            margin-left: 4px;
            position: relative;
            bottom: 1px;
          }
          .customLabelInfo {
            visibility: hidden;
            opacity: 0;
            width: 240px;
            background-color: rgb(var(--white));
            box-shadow: 2px 2px rgba(var(--black),.07);
            color: inherit;
            text-align: center;
            padding: 2px;
            border-radius: var(--border-radius-small);
            position: absolute;
            z-index: 2;
            top: 24px;
            left: 0;
            transition: opacity 0.5s;
            white-space: initial;
          }
          .customLabelContainer:hover .customLabelInfo {
            visibility: visible;
            opacity: 1;
          }

          .answerVoteCount {
            position: absolute;
            bottom: -2px;
            right: 16px;
            font-size: 12px;
          }

          .__percentage {
            position: absolute;
            content: "";
            height: 100%;
            top: 0;
            left: 0;
            background: rgba(var(--blue),.2);
            border-radius: 18px;
          }

          #tumblr { --dashboard-tabs-header-height: 0px !important; }
          ${keyToCss('navItem')}:has(use[href="#managed-icon__sparkle"]) { display: none !important; }
          ${keyToCss('bluespaceLayout')} > ${keyToCss('container')} { position: relative; }
          [data-blog-container], [data-blog-container] ${keyToCss('layout')}, [data-blog-container] ${keyToCss('sidebar')},
          [data-blog-container] ${keyToCss('sidebarTopContainer')} { width: fit-content !important; }
          ${keyToCss('main')} {
            position: relative;
            flex: 1;
            min-width: 0;
            max-width: none !important;
          }
          ${keyToCss('main')}:not(${keyToCss('body')} > ${keyToCss('main')}) {
            top: -100px;
            padding-top: 100px;
          }
          ${keyToCss('body')} > header,
          ${keyToCss('body')} > ${keyToCss('toolbar')} {
            z-index: 1;
          }
          ${keyToCss('tabsHeader')} {
            top: 0;
            position: relative;
          }
          ${keyToCss('postColumn')} { max-width: calc(100% - 85px); }
          ${keyToCss('post')}, ${keyToCss('post')} > * { max-width: 100%; }
          ${keyToCss('cell')},
          ${keyToCss('link')},
          ${keyToCss('reblog')},
          ${keyToCss('videoBlock')},
          ${keyToCss('videoBlock')} iframe,
          ${keyToCss('audioBlock')} { max-width: none !important; }
          ${keyToCss('queueSettings')} {
            width: calc(100% - 85px);
            box-sizing: border-box;
          }

          ${keyToCss('postColumn')} > ${keyToCss('bar')}, 
            ${keyToCss('activityPopover')} ${keyToCss('selectorPopover')},
            ${keyToCss('tabManagement')}, ${keyToCss('selectorPopover')}:has(${keyToCss('blogsList')}),
            [data-timeline] article,
            [data-timeline] article ${keyToCss('footerWrapper')} { border-radius: 3px !important; }
          [data-timeline] article header { border-radius: 3px 3px 0 0 !important; }

          ${keyToCss('toastHolder')} { display: none; }

          aside > button${keyToCss('expandOnHover')} { display: none !important; }

          button${keyToCss('pollAnswer')} { overflow: clip; }

          figure${keyToCss('anonymous')} { background-image: url(https://assets.tumblr.com/pop/src/assets/images/avatar/anonymous_avatar_96-223fabe0.png) !important; }

          #__cta-close {
            padding: .5rem;
            color: rgb(var(--red));
            border: 1px solid rgb(var(--red));
            border-radius: .5rem;
            line-height: 32px;
            transition: color 0.3s;

            &:hover {
              background-color: rgb(var(--red));
              color: rgb(var(--black));
            }
          }
          __cta-div h1 {
          }
          .__cta-div h3 {
            font-size: 20px;
            line-height: 1.5;
            font-weight: bold;
          }
          .__cta-div p {
            margin-top: 8px;
            margin-bottom: 0;
            line-height: 1.5;
          }
          .__cta-div img {
          }
          .__cta-div footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-flow: row nowrap;
            margin-top: 12px;
            width: 240px;
          }
          .__cohost-logo {
            display: block;
            height: 2rem;
            color: white;
            background-color: rgb(131 37 79);
            padding: .5rem;
            border-radius: .5rem;
          }
          .__cta-div {
            padding: 8px;
            background-color: rgb(var(--white));
            border-radius: 3px;
            margin-bottom: 20px;
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
          }
        </style>
      `);

      const untitledStrings = [
        'Untitled', // en
        'Sans titre', // fr
        'Intitulado', // es
        'Ohne titel', // de
        'Senza titolo', // it
        '無題', // jp
        'Başlıksız', // tr
        'Без названия', // ru
        'Bez tytułu', // pl
        'Sem título', // pt
        'Ongetiteld', // nl
        '무제', // ko
        '无标题', // zh
        'Tanpa judul', // id
        'शीर्षकहीन' // hi
      ];

      const userName = state.queries.queries[0].state.data.user.name;

      const hexToRgb = (hex = '') => {
        hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => {
          return r + r + g + g + b + b;
        });
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            }
          : null;
      };
      const luminance = ({ r, g, b }) => {
        const a = [r, g, b].map(v => {
          v /= 255;
          return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      };
      const ratio = (lum1, lum2) => lum1 > lum2 ? ((lum2 + 0.05) / (lum1 + 0.05)) : ((lum1 + 0.05) / (lum2 + 0.05));
      const contrast = (hex1, hex2) => {
        const lum1 = luminance(hexToRgb(hex1));
        const lum2 = luminance(hexToRgb(hex2));
        return ratio(lum1, lum2);
      };
      const contrastBW = hex => {
        const lum = luminance(hexToRgb(hex));
        const lumBlk = luminance({ r: 12, g: 12, b: 12 });
        const lumWht = luminance({ r: 255, g: 255, b: 255 });
        const ratioBlk = ratio(lum, lumBlk);
        const ratioWht = ratio(lum, lumWht);
        if (ratioBlk < ratioWht) return '12,12,12';
        else return '255,255,255';
      };
      const rgbToString = ({ r, g, b }) => `${r},${g},${b}`;

      const fetchNpf = obj => {
        const fiberKey = Object.keys(obj).find(key => key.startsWith('__reactFiber'));
        let fiber = obj[fiberKey];

        while (fiber !== null) {
          const { timelineObject } = fiber.memoizedProps || {};
          if (timelineObject !== undefined) {
            return timelineObject;
          } else {
            fiber = fiber.return;
          }
        }
      };

      const userAvatar = name => $str(`
        <div class="__avatarOuter">
          <div class="__avatarWrapper" role="figure" aria-label="${tr("avatar")}">
            <span class="__targetWrapper">
              <a href="https://${name}.tumblr.com/" title="${name}" rel="noopener" role="link" class="__blogLink" tabindex="0">
                <div class="__avatarInner" style="width: 64px; height: 64px;">
                  <div class="__avatarWrapperInner">
                    <div class="__placeholder" style="padding-bottom: 100%;">
                      <img
                      class="__avatarImage"
                      srcset="https://api.tumblr.com/v2/blog/${name}/avatar/64 64w,
                              https://api.tumblr.com/v2/blog/${name}/avatar/96 96w,
                              https://api.tumblr.com/v2/blog/${name}/avatar/128 128w,
                              https://api.tumblr.com/v2/blog/${name}/avatar/512 512w"
                      sizes="64px"
                      alt="${tr("Avatar")}" 
                      style="width: 64px; height: 64px;" 
                      loading="eager">
                    </div>
                  </div>
                </div>
              </a>
            </span>
          </div>
        </div>
      `);
      const fixHeaderAvatar = posts => {
        for (const post of posts) {
          try {
            const stickyContainer = $str(`<div class="__stickyContainer"></div>`);
            const avatar = post.querySelector(`header > ${keyToCss('avatar')}`);

            post.prepend(stickyContainer);
            stickyContainer.append(avatar);
            avatar.querySelector(`${keyToCss('targetWrapper')} img`).sizes = "64px";
            avatar.querySelectorAll(`${keyToCss('subAvatarTargetWrapper')} img`).forEach(img => img.sizes = "32px");
            post.classList.add('__avatarFixed');
          } catch (e) {
            console.error('an error occurred processing a post avatar:', e);
            console.error(post);
            console.error(fetchNpf(post));
          }
        }
      };
      const reblogIcon = () => $str(`
        <span class="__reblogIcon">
          <svg xmlns="http://www.w3.org/2000/svg" height="15" width="15" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);">
            <use href="#managed-icon__reblog-compact"></use>
          </svg>
        </span>
      `);
      const fixHeader = posts => {
        /*
        for (const post of posts) {
          if (window.location.pathname.split('/').some(x => ['inbox', 'messages'].includes(x))) return;
          try {
            const { id, parentPostUrl } = fetchNpf(post);
            post.id = `post${id}`;

            const header = post.querySelector('header');
            const attribution = header.querySelector(keyToCss('attribution'));
            let rebloggedFrom = attribution.querySelector(keyToCss('rebloggedFromName'));
            let addingNewRebloggedFrom = false;
            let rebloggedFromName;

            if (parentPostUrl) rebloggedFromName = parentPostUrl.split('/')[3];
            if (!rebloggedFrom && rebloggedFromName) {
              const labels = post.querySelectorAll(`:scope ${keyToCss('username')} ${keyToCss('label')}`);
              if (labels.length !== 0) {
                addingNewRebloggedFrom = true;
                rebloggedFrom = [...labels].find(node => node.querySelector(keyToCss('attribution')).innerText === rebloggedFromName).cloneNode(true);
                const classes = keyToClasses('rebloggedFromName');
                rebloggedFrom.classList.add(...classes);
                css(rebloggedFrom.querySelector(keyToCss('attribution')), { color: 'rgba(var(--black),.65)' });
                const follow = rebloggedFrom.querySelector(keyToCss('followButton'));
                if (follow) hide(follow);
              }
            }

            attribution.normalize();
            [...attribution.childNodes].filter(node => node.nodeName === '#text').forEach(node => node.remove());
            if (addingNewRebloggedFrom) attribution.append(rebloggedFrom);
            if (rebloggedFrom && !header.querySelector('.__reblogIcon')) {
              rebloggedFrom.before(reblogIcon());
            }

            post.classList.add('__headerFixed');
          } catch (e) {
            console.error('an error occurred processing a post header:', e);
            console.error(post);
            console.error(fetchNpf(post));
          }
        }
        */
      };
      const blogViewLink = avatar => {
        const links = avatar.querySelectorAll('a');
        links.forEach(link => {
          const name = link.getAttribute('title');
          link.addEventListener('click', event => {
            event.preventDefault();
            window.tumblr.navigate(`/${name}`);
          });
        });
      };
      const addUserPortrait = () => {
        const bar = $(`${keyToCss('postColumn')} > ${keyToCss('bar')}`);
        if (bar) {
          const userAvatarWrapper = $str('<div class="__userAvatarWrapper"></div>');
          bar.prepend(userAvatarWrapper);
          if (pathname === 'blog') userAvatarWrapper.append(userAvatar(location.pathname.split('/')[2]));
          else userAvatarWrapper.append(userAvatar(userName));
          blogViewLink(userAvatarWrapper);
        }
      };

      const fixMasonryNotes = noteCounts => {
        for (const noteCount of noteCounts) {
          if (noteCount.innerText.length > 9) noteCount.innerHTML = `<span class="${keyToClasses('blackText').join(' ')}">${noteCount.querySelector('span').innerText}<span>`;
        }
      };

      const labelContainer = (label, icon, desc) => $str(`
        <div class="customLabelContainer" label="${label}">
          ${label}
          <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" class="customLabelIcon" role="presentation" style="--icon-color-primary: rgb(var(--${label === 'Follows You' ? 'blue' : 'red'}))">
            <use href="#managed-icon__${icon}"></use>
          </svg>
          <span class="customLabelInfo ${icon}">${desc}</span>
        </div>
      `);

      const fetchPercentage = obj => {
        const fiberKey = Object.keys(obj).find(key => key.startsWith('__reactFiber'));
        let fiber = obj[fiberKey];

        while (fiber !== null) {
          const { percentage } = fiber.memoizedProps || {};
          if (percentage !== undefined) {
            return percentage;
          } else {
            fiber = fiber.return;
          }
        }
      };
      const fetchNote = obj => {
        const fiberKey = Object.keys(obj).find(key => key.startsWith('__reactFiber'));
        let fiber = obj[fiberKey];

        while (fiber !== null) {
          const { notification } = fiber.memoizedProps || {};
          if (notification !== undefined) {
            return notification;
          } else {
            fiber = fiber.return;
          }
        }
      };
      const scanNotes = notes => {
        for (const note of notes) {
          try {
            const { followingYou, mutuals, type, fromTumblelogUuid } = fetchNote(note);
            if (configPreferences.highlightLikelyBots.value && type === 'follower') {
              window.tumblr.apiFetch(`/v2/blog/${fromTumblelogUuid}/info`).then(response => {
                const { title, name, posts, likes } = response.response.blog;
                if (untitledStrings.includes(title) 
                && ([0,1].includes(posts) || likes === 0)
                || (name === title && posts === 1)) {
                  hide(note.querySelector('.customLabelContainer'));
                  css(note, { backgroundColor: 'rgba(255,37,47,.15)' });
                  note.querySelector(keyToCss('tumblelogName')).append(labelContainer('Possible Bot', 'warning-circle', 'This blog may be a bot; block at your own discretion. This feature is a component of dashboard unfucker.'));
                }
              });
            }
            if (configPreferences.showFollowingLabel.value && followingYou && !mutuals && !note.querySelector('.customLabelContainer')) {
              note.querySelector(keyToCss('tumblelogName')).append(labelContainer('Follows You', 'profile-checkmark', 'This blog follows you. This feature is a component of dashboard unfucker.'));
            }
          } catch (e) {
            console.error('an error occurred processing a notification:', e);
            console.error(note);
            console.error(fetchNote(note));
          }
        }
      };

      const detailPolls = answers => {
        for (const answer of answers) {
          if (answer.classList.contains('__pollDetailed')) continue;
          const pollBlock = answer.closest(pollBlockSelector);
          const answers = Array.from(pollBlock.querySelectorAll(':scope [data-testid="poll-answer"]'));
          const voteCount = Number(pollBlock.querySelector(keyToCss('pollSummary')).innerText.replace(/,/, '').match(/\d+/)[0]);
          answers.forEach(element => {
            const percentage = fetchPercentage(element);
            element.append($str(`<span class="answerVoteCount">(${Math.round(voteCount * percentage / 100)})</span>`));
            element.classList.add('__pollDetailed');
          });
        }
      };
      const fetchPollResults = obj => {
        const fiberKey = Object.keys(obj).find(key => key.startsWith('__reactFiber'));
        let fiber = obj[fiberKey];

        while (fiber !== null) {
          const { percentage, answer } = fiber.memoizedProps || {};
          if (percentage !== undefined && answer !== undefined) {
            return `${percentage}%`;
          } else {
            fiber = fiber.return;
          }
        }
      }
      const pollResults = buttons => {
        for (const button of buttons) {
          const percentage = $str('<div class="__percentage"></div>');

          button.prepend(percentage);
          percentage.style.width = fetchPollResults(button);

          button.classList.add('__pollResultsShown');
        }
      }

      const fetchOtherBlog = async function (obj) {
        const fiberKey = Object.keys(obj).find(key => key.startsWith('__reactFiber'));
        let fiber = obj[fiberKey];
        let conversationWindowObject;
        let headerImageFocused;
        let backgroundColor;
        let titleColor;
        let linkColor;

        while (fiber !== null) {
          ({ conversationWindowObject } = fiber.memoizedProps || {});
          if (conversationWindowObject !== undefined) {
            break;
          } else {
            fiber = fiber.return;
          }
        }

        const { otherParticipantName, selectedBlogName } = conversationWindowObject;

        try {
          await window.tumblr.apiFetch(`/v2/blog/${otherParticipantName}/info?fields[blogs]=theme`).then(response => {
            ({ headerImageFocused, backgroundColor, titleColor, linkColor } = response.response.blog.theme);
          });
        } catch (e) {
          console.error(`failed to fetch the theme for blog ${otherParticipantName}`);
        }

        return ({ headerImageFocused, backgroundColor, titleColor, linkColor, otherParticipantName, selectedBlogName });
      };
      const styleMessaging = conversations => {
        for (const conversation of conversations) {
          fetchOtherBlog(conversation).then(({ headerImageFocused, backgroundColor, titleColor, linkColor, otherParticipantName, selectedBlogName }) => {
            conversation.id = `messaging-${otherParticipantName}`;
            const colorStyle = configPreferences.revertMessagingRedesign.style;
            let msgBackground;
            let tsColor;
            let headerBackground;
            if (colorStyle === '1') {
              headerBackground = `no-repeat top/100% url(${headerImageFocused})`;
              msgBackground = contrastBW(titleColor);
              tsColor = contrastBW(backgroundColor);
              if (contrast(linkColor, backgroundColor) > 0.33) {
                linkColor = tsColor;
              } else linkColor = rgbToString(hexToRgb(linkColor));
              titleColor = rgbToString(hexToRgb(titleColor));
            } else if (colorStyle === '2') {
              headerBackground = 'rgb(var(--white))';
              backgroundColor = headerBackground;
              msgBackground = 'var(--secondary-accent)';
              titleColor = 'var(--black)';
              linkColor = titleColor;
              tsColor = titleColor;
            } else if (colorStyle === '3') {
              headerBackground = 'rgb(var(--white))';
              backgroundColor = `#${configPreferences.revertMessagingRedesign.backgroundColor}`;
              msgBackground = rgbToString(hexToRgb(configPreferences.revertMessagingRedesign.messageColor));
              titleColor = rgbToString(hexToRgb(configPreferences.revertMessagingRedesign.textColor));
              linkColor = titleColor;
              tsColor = titleColor;
            } else console.error('invalid style index');

            const style = document.createElement('style');
            style.classList.add('customMessagingStyle');
            conversation.append(style);
            style.innerText = `
              #messaging-${otherParticipantName} { background: ${backgroundColor}; }
              #messaging-${otherParticipantName} ${keyToCss('headerWrapper')} { background: ${headerBackground} }
              #messaging-${otherParticipantName} ${keyToCss('messageText')}${keyToCss('ownMessage')} ${keyToCss('messageHeader')}::before { content: "${selectedBlogName}"; }
              #messaging-${otherParticipantName} ${keyToCss('messageText')}:not(${keyToCss('ownMessage')}) ${keyToCss('messageHeader')}::before { content: "${otherParticipantName}"; }
              #messaging-${otherParticipantName} ${keyToCss('statusWithCaption')} { color: ${linkColor} !important; }
              #messaging-${otherParticipantName} ${keyToCss('timestamp')} { color: rgba(${tsColor},.6) }
              #messaging-${otherParticipantName} ${keyToCss('name')}, #messaging-${otherParticipantName} ${keyToCss('description')}, 
              #messaging-${otherParticipantName} ${keyToCss('descriptionContainer')} { color: rgb(${tsColor}) !important; }
              #messaging-${otherParticipantName} ${keyToCss('messageText')}, #messaging-${otherParticipantName} ${keyToCss('messagePost')} ${keyToCss('header')},
              #messaging-${otherParticipantName} ${keyToCss('headerPreview')} ${keyToCss('action')} {
                background: rgb(${msgBackground}) !important;
                color: rgb(${titleColor}) !important;
              }
              #messaging-${otherParticipantName} ${keyToCss('headerPreview')} ${keyToCss('summary')} { color: rgba(${titleColor}, .6) !important; }
            `;
          });
        }
      };

      const labelCells = cells => {
        for (let cell of cells) {
          cell = cell.closest('[data-cell-id]');
          const prevCell = cell.previousSibling;

          if (cell.getAttribute('data-cell-id').includes('timelineObject:carousel')) {
            if (cell.querySelector(keyToCss('blogRecommendation'))) {
              cell.setAttribute('data-blog-carousel-cell', '');
              prevCell.setAttribute('data-blog-carousel-cell', '');
            } else if (cell.querySelector(keyToCss('tagCard'))) {
              cell.setAttribute('data-tag-carousel-cell', '');
              prevCell.setAttribute('data-tag-carousel-cell', '');
            }
          } else if (cell.getAttribute('data-cell-id').includes('watermark_carousel')) {
            cell.setAttribute('data-watermark-carousel-cell', '');
            prevCell.setAttribute('data-watermark-carousel-title-cell', '');
          }
        }
      };

      const mutationManager = Object.freeze({
        listeners: new Map(),
        start (func, selector) {
          if (this.listeners.has(func)) this.stop(func);
          this.listeners.set(func, selector);
          func(Array.from($a(selector)));
        },
        stop (func) { this.listeners.delete(func); },
        toggle (func, selector) {
          if (this.listeners.has(func)) this.stop(func);
          else this.start(func, selector);
        }
      });
      const sortNodes = () => {
        const nodes = newNodes.splice(0);
        if (nodes.length === 0) return;
        for (const [func, selector] of mutationManager.listeners) {
          const matchingElements = [
            ...nodes.filter(node => node.matches(selector)),
            ...nodes.flatMap(node => [...node.querySelectorAll(selector)])
          ].filter((value, index, array) => index === array.indexOf(value));
          if (matchingElements.length) func(matchingElements);
        }
      };
      const observer = new MutationObserver(mutations => {
        const nodes = mutations
          .flatMap(({ addedNodes }) => [...addedNodes])
          .filter(node => node instanceof Element)
          .filter(node => node.isConnected);
        newNodes.push(...nodes);
        sortNodes();
      });

      const featureStyles = Object.freeze({
        styles: new Map(),
        build (name, on, off, state) {
          const style = document.createElement('style');
          style.id = name;
          style.nonce = nonce;
          document.head.append(style);
          this.styles.set(name, { on, off });
          this.toggle(name, state);
        },
        buildScalable (name, on, off, state, num) {
          const style = document.createElement('style');
          style.id = name;
          style.nonce = nonce;
          document.head.append(style);
          this.styles.set(name, { on, off });
          this.toggleScalable(name, state, num);
        },
        toggle (name, state) {
          const style = document.getElementById(name);
          style.innerText = state ? this.styles.get(name).on : this.styles.get(name).off;
        },
        toggleScalable (name, state, num) {
          const style = document.getElementById(name);
          style.innerText = state ? this.styles.get(name).on.replaceAll('$NUM', num) : this.styles.get(name).off.replaceAll('$NUM', num);
        }
      });

      const checkboxEvent = (id, value) => {
        switch (id) {
          case '__hideDashboardTabs':
            toggle($(keyToCss('timelineHeader')), !value);
            break;
          case '__collapseCaughtUp':
            featureStyles.toggle('__cc', value);

            if (!configPreferences.hideRecommendedTags.value && !configPreferences.hideRecommendedBlogs.value) {
              if (value) mutationManager.start(labelCells, carouselCellSelector);
              else mutationManager.stop(labelCells);
            }
            break;
          case '__hideRecommendedBlogs':
            featureStyles.toggle('__rb', value);
            toggle(find($a(keyToCss('sidebarItem')), keyToCss('recommendedBlogs')), !value);
            toggle(find($a(keyToCss('desktopContainer')), keyToCss('recommendedBlogs')), !value);

            if (!configPreferences.hideRecommendedTags.value && !configPreferences.collapseCaughtUp.value) {
              if (value) mutationManager.start(labelCells, carouselCellSelector);
              else mutationManager.stop(labelCells);
            }
            break;
          case '__hideRecommendedTags':
            featureStyles.toggle('__rt', value);

            if (!configPreferences.hideRecommendedBlogs.value && !configPreferences.collapseCaughtUp.value) {
              if (value) mutationManager.start(labelCells, carouselCellSelector);
              else mutationManager.stop(labelCells);
            }
            break;
          case '__originalHeaders': 
            if (value) {
              addUserPortrait();
              mutationManager.start(fixHeader, postSelector);
              mutationManager.start(fixHeaderAvatar, postHeaderTargetSelector);
            }
            else {
              $a(`.__stickyContainer > ${keyToCss('avatar')} ${keyToCss('targetWrapper')} img`).forEach(img => img.sizes = "32px");
              $a(`.__stickyContainer > ${keyToCss('avatar')} ${keyToCss('subAvatarTargetWrapper')} img`).forEach(img => img.sizes = "16px");
              $a(`.__stickyContainer > ${keyToCss('avatar')}`).forEach(avatar => avatar.closest('article').querySelector('header').prepend(avatar));
              remove($a('.__stickyContainer, .__userAvatarWrapper'));
              $a('.__headerFixed').forEach(elem => elem.classList.remove('__headerFixed'));
              $a('.__avatarFixed').forEach(elem => elem.classList.remove('__avatarFixed'));
              mutationManager.stop(fixHeader);
              mutationManager.stop(fixHeaderAvatar);
            }
            break;
          case '__hideTumblrRadar':
            toggle(find($a(keyToCss('sidebarItem')), keyToCss('radar')), !value);
            break;
          case '__hideExplore':
            toggle(find($a(keyToCss('menuContainer')), 'use[href="#managed-icon__explore"]'), !value);
            break;
          case '__hideTumblrShop':
            toggle(find($a(keyToCss('menuContainer')), 'use[href="#managed-icon__shop"]'), !value);
            break;
          case '__hideBadges':
            featureStyles.toggle('__bs', value);
            break;
          case '__highlightLikelyBots':
            if (value && !configPreferences.showFollowingLabel.value) {
              mutationManager.start(scanNotes, noteSelector);
            } else {
              remove($a("[label='Possible Bot']"));
              if (!configPreferences.showFollowingLabel.value) mutationManager.stop(scanNotes);
            }
            break;
          case '__showFollowingLabel':
            if (value && !configPreferences.highlightLikelyBots.value) mutationManager.start(scanNotes, noteSelector);
            else {
              remove($a("[label='Follows You']"));
              if (!configPreferences.highlightLikelyBots.value) mutationManager.stop(scanNotes);
            }
            break;
          case '__displayVoteCounts':
            featureStyles.toggle('__ps', value);
            featureStyles.toggle('__ps', value);
            mutationManager.toggle(detailPolls, answerSelector);

            if (!value) {
              remove($a('.answerVoteCount'));
              $a('.__pollDetailed').forEach(elem => elem.classList.remove('__pollDetailed'));
            }
            break;
          case '__votelessResults':
            mutationManager.toggle(pollResults, voteSelector);

            if (!value) {
              remove($a('.__percentage'));
              $a('.__pollResultsShown').forEach(elem => elem.classList.remove('__pollResultsShown'));
            }
            break;
          case '__disableScrollingAvatars':
            featureStyles.toggle('__as', value);
            break;
          case '__revertMessagingRedesign':
            mutationManager.toggle(detailPolls, answerSelector);

            if (!value) {
              remove($a('.customMessagingStyle'));
            }
            featureStyles.toggleScalable('__ms', value, configPreferences.messagingScale.value);
            break;
          case '__messaging1':
          case '__messaging2':
          case '__messaging3':
            if (configPreferences.revertMessagingRedesign.value) mutationManager.start(styleMessaging, conversationSelector);
            break;
          case '__revertActivityFeedRedesign':
            featureStyles.toggle('__acs', configPreferences.revertActivityFeedRedesign.value);
            break;
          case '__originalEditorHeaders':
            featureStyles.toggle('__oe', configPreferences.originalEditorHeaders.value)
            break;
          case '__disableTagNag':
            if (configPreferences.disableTagNag.value) window.localStorage.setItem(tsKey, Number.MAX_SAFE_INTEGER);
            else window.localStorage.setItem(tsKey, 0);
        }
      };
      const rangeEvent = (id, value) => {
        if (matchPathname()) {
          const posOffset = $('#__contentPositioning').valueAsNumber;
          const widthOffset = ($('#__contentWidth').valueAsNumber - 990) / 2;
          let safeMax = Math.max(safeOffset - widthOffset, 0);
          if (Math.abs(posOffset) > safeMax) {
            safeMax = posOffset > 0 ? safeMax : -safeMax;
            $('#__contentPositioning').value = safeMax.toString();
            featureStyles.toggleScalable('__cp', true, safeMax);
            configPreferences.contentPositioning.value = safeMax;
            if (id === '__contentWidth') featureStyles.toggleScalable('__cw', true, value);
          } else {
            switch (id) {
              case '__contentPositioning':
                featureStyles.toggleScalable('__cp', true, value);
                break;
              case '__contentWidth':
                featureStyles.toggleScalable('__cw', true, value);
                break;
              case '__messagingScale':
                featureStyles.toggleScalable('__ms', configPreferences.revertMessagingRedesign.value, value);
                break;
            }
          }
          if (pathname === 'likes') {
            const gridWidth = $(keyToCss('gridded')).clientWidth;
            const gridItemWidth = Math.fround(100 / Math.round(gridWidth / 178));
            featureStyles.toggleScalable('__gs', true, gridItemWidth);
          }
        }
      };
      const initialChecks = () => {
        if ($a('#__m').length) { // initial status checks to determine whether to inject or not
          console.log('no need to unfuck');
          return false;
        } else {
          console.log('unfucking dashboard...');
          return true;
        }
      };
      const followingAsDefault = async function () {
        waitFor(keyToCss('timeline')).then(() => {
          if (isDashboard() &&
            $(keyToCss('timeline')).attributes.getNamedItem('data-timeline').value.includes('/v2/tabs/for_you')) {
            window.tumblr.navigate('/dashboard/following');
            console.log('navigating to following');
          }
        });
      };
      const configMenu = (version, obj = {}) => {
        const menuShell = $str(`
          <div id="__m">
          <div id="__in">
            <h1>dashboard unfucker v${version}</h1>
            <button id="__ab">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" role="presentation" style="--icon-color-primary: rgba(var(--white-on-dark), 0.65);">
                <use href="#managed-icon__ellipsis"></use>
              </svg>
            </button>
            <button id="__cb">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" role="presentation" style="--icon-color-primary: rgba(var(--white-on-dark), 0.65);">
                <use href="#managed-icon__settings"></use>
              </svg>
            </button>
          </div>
          <div id="__a" style="display: none;">
            <div class="infoHeader">
              <span>about</span>
            </div>
            <ul id="__am">
            </ul>
          </div>
          <div id="__c" style="display: none;">
            <div id="__cio">
              <button id="__co" class="iOButton">export</button>
              <button id="__ci" class="iOButton">import</button>
            </div>
            <div class="infoHeader">
              <span>general configuration</span>
            </div>
            <ul id="__ct"></ul>
            <li class="infoHeader" style="flex-flow: column wrap">
              <span style="width: 100%;">advanced configuration</span>
              <span style="width: 100%; font-size: .8em;">requires a page reload</span>
            </li>
            <ul id="__cta"></ul>
          </div>
        </div>
        `);
        const info = [
          { url: 'https://github.com/enchanted-sword/dashboard-unfucker', text: 'source' },
          { url: 'https://github.com/enchanted-sword/dashboard-unfucker/blob/main/changelog.md', text: 'changelog' },
          { url: 'https://github.com/enchanted-sword/dashboard-unfucker/issues/', text: 'report a bug' },
          { url: 'https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker.user.js', text: 'update' },
          { url: 'https://tumblr.com/dragongirlsnout', text: 'my tumblr!' },
          { url: 'https://www.paypal.com/paypalme/dragongirled', text: 'support my work!' }
        ];

        const infoList = menuShell.querySelector('#__am');
        const infoEntry = (obj = {}) => $str(`
          <li>
            <a target="_blank" href="${obj.url}">${obj.text}</a>
          </li>
        `);
        const configs = {
          hideDashboardTabs: 'hide dashboard tabs',
          collapseCaughtUp: "collapse the 'changes', 'staff picks', etc. carousel",
          hideRecommendedBlogs: 'hide recommended blogs',
          hideRecommendedTags: 'hide recommended tags',
          // originalHeaders: 'revert the post header design and re-add user avatars beside posts',
          originalHeaders: 're-add user avatars beside posts',
          hideTumblrRadar: 'hide tumblr radar',
          hideExplore: 'hide explore',
          hideTumblrShop: 'hide tumblr shop',
          hideBadges: 'hide badges',
          highlightLikelyBots: 'highlight likely bots in activity feed',
          showFollowingLabel: 'show who follows you in the activity feed',
          displayVoteCounts: 'display exact vote counts on poll answers',
          votelessResults: 'display poll results without voting',
          disableScrollingAvatars: 'disable avatars scrolling with posts',
          revertActivityFeedRedesign: 'revert activity feed redesign',
          revertMessagingRedesign: 'revert messaging redesign',
          contentPositioning: 'content positioning',
          contentWidth: 'content width',
          messagingScale: 'messaging window scale',
          disableTumblrDomains: 'disable tumblr domains',
          revertSearchbarRedesign: 'revert searchbar update',
          enableCustomTabs: 'enable customizable dashboard tabs',
          enableReblogPolls: 'enable adding polls to reblogs',
          disableTagNag: 'disable "post without tags" nag',
          reAddHomeNotifications: 're-add unread post notifications to the corner of the home icon',
          showNsfwPosts: 'show hidden NSFW posts in the timeline',
          originalEditorHeaders: 'revert the post editor header design'
        };
        const configEntry = (obj = {}) => {
          const entry = [];

          if (obj.type === 'checkbox') {
            if (obj.name === 'revertMessagingRedesign') {
              entry.push($str(`
                <li active="${!!obj.value}">
                  <span>${configs[obj.name]}</span>
                  <input class="configInput" type="checkbox" id="__${obj.name}" name="${obj.name}" ${obj.value}>
                  <label for="__${obj.name}">Toggle</label>
                </li>
              `));
              entry.push($str(`
                <ul class="submenu">
                  <li>
                    <span>use blog colors</span>
                    <input 
                      class="subConfigInput" 
                      type="radio" 
                      id="__messaging1" 
                      name="revertMessagingRedesign" 
                      index="1"
                      ${obj.style === '1' ? 'checked' : ''}
                    >
                    <label for="__messaging1">Toggle</label>
                  </li>
                  <li>
                    <span>use theme colors</span>
                    <input 
                      class="subConfigInput" 
                      type="radio" 
                      id="__messaging2" 
                      name="revertMessagingRedesign" 
                      index="2"
                      ${obj.style === '2' ? 'checked' : ''}
                    >
                    <label for="__messaging2">Toggle</label>
                  </li>
                  <li active="${obj.style === '3'}">
                    <span>use custom colors</span>
                    <input 
                      class="subConfigInput" 
                      type="radio" 
                      id="__messaging3" 
                      name="revertMessagingRedesign" 
                      index="3" 
                      ${obj.style === '3' ? 'checked' : ''}
                    >
                    <label for="__messaging3">Toggle</label>
                  </li>
                  <ul class="submenu">
                    <li>
                      <span style="flex-basis: 100%;">message color</span>
                      <input 
                        class="textInput msgHexSelect" 
                        type="text" 
                        placeholder="${obj.messageColor || 'f0f0f0'}" 
                        pattern="[a-f\\d]{6}" 
                        maxlength="6"
                        name="messageColor"
                      >
                      <span></span>
                    </li>
                    <li>
                      <span style="flex-basis: 100%;">background color</span>
                      <input 
                        class="textInput msgHexSelect" 
                        type="text" 
                        placeholder="${obj.backgroundColor || 'ffffff'}" 
                        pattern="[a-f\\d]{6}" 
                        maxlength="6"
                        name="backgroundColor"
                      >
                      <span></span>
                    </li>
                    <li>
                      <span style="flex-basis: 100%;">text color</span>
                      <input 
                        class="textInput msgHexSelect" 
                        type="text" 
                        placeholder="${obj.textColor || '121212'}" 
                        pattern="[a-f\\d]{6}" 
                        maxlength="6"
                        name="textColor"
                      >
                      <span></span>
                    </li>
                  </ul>
                </ul>
              `));
            } else {
              entry.push($str(`
                <li>
                  <span>${configs[obj.name]}</span>
                  <input class="configInput" type="checkbox" id="__${obj.name}" name="${obj.name}" ${obj.value}>
                  <label for="__${obj.name}">Toggle</label>
                </li>
              `));
            }
          } else if (obj.type === 'range') {
            if (obj.name === 'contentPositioning') {
              entry.push($str(`
                <li>
                  <span>${configs[obj.name]}</span>
                  <div class="rangeInput">
                    <input class="configInput" type="range" id="__${obj.name}" name="${obj.name}" list="__cp" min="-${safeOffset}" max="${safeOffset}" step="1" value="${obj.value}">
                    <datalist id="__cps">
                      <option value="-${safeOffset}" label="left"></option>
                      <option value="0" label="default"></option>
                      <option value="${safeOffset}" label="right"></option>
                    </datalist>
                  </div>
                </li>
              `));
            } else if (obj.name === 'contentWidth') {
              entry.push($str(`
                <li>
                  <span>${configs[obj.name]}</span>
                  <div class="rangeInput">
                  <input class="configInput" type="range" id="__contentWidth" name="contentWidth" list="__cw" min="990" max="${windowWidth}" step="0.5" value="${configPreferences.contentWidth.value}">
                    <datalist id="__cws">
                    <option value="990" label="default"></option>
                    <option value="${windowWidth}" label="full width"></option>
                    </datalist>
                  </div>
                </li>
              `));
            } else if (obj.name === 'messagingScale') {
              entry.push($str(`
                <li>
                  <span>${configs[obj.name]}</span>
                  <div class="rangeInput">
                  <input class="configInput" type="range" id="__messagingScale" name="messagingScale" list="__mss" min="1" max ="2" step="0.05" value="${configPreferences.messagingScale.value}">
                    <datalist id="__mss">
                      <option value="1" label="1x"></option>
                      <option value="1.5" label="1.5x"></option>
                      <option value="2" label="2x"></option>
                    </datalist>
                  </div>
                </li>
              `));
            }
          }

          return entry;
        };
        const generalList = menuShell.querySelector('#__ct');
        const advancedList = menuShell.querySelector('#__cta');

        info.forEach(infoItem => infoList.append(infoEntry(infoItem)));
        Object.keys(obj).forEach(key => {
          const configItem = obj[key];
          configItem.name = key;
          if (typeof configItem === 'object') {
            if (configItem.advanced) {
              advancedList.append(...configEntry(configItem));
            } else {
              generalList.append(...configEntry(configItem));
            }
          }
        });

        return menuShell;
      };
      const cta = $str(`
        <div class="__cta-div">
          <div>
            <h3>with regards to recent events,</h3>
            <p>this project will no longer be actively maintained, and the development of the Dashboard Plus extension is being shelved.</p>
            <p>despite the fact that tumblr as a website is largely propped up by LGBTQ+ content creators, many of whom are trans women, the way this website has treated and continues to treat trans women is utterly disgusting. </p>
            <p>from the harassment trans women face from this site's users, many of whom claim to be trans allies or are even trans themselves, to transphobic moderators targeting trans women and selling bans for money, all the way to the CEO of the website directly confronting a trans woman and threatening legal action against her for inactionable threats, tumblr has made it clear that it is by no means the queerest place on earth.</p>
            <p>some of my trans sisters may remain on tumblr, even when faced with constant vitriol. i am deeply proud of them and their visibility in the face of hostility, however after seeing recent events unfold, and after being <a href="https://www.tumblr.com/dragongirlsnout/742816811736760320/speechless" target="_blank">directly confronted by tumblr's CEO himself in a digusting display of indifference</a>, i myself have decided to move onto better pursuits for the larger part. tumblr no longer holds the same shine for me that it did five years ago, and i can no longer justify spending hours of my time every week pouring more work and love into this site than any member of staff ever did.</p>
            <p>i thank you all for the support you've given me in the past 8 months, whether through donations, contributions to the script, or even just sending me a kind message. i would ask that you show the same generosity and kindness to other trans girls in my absence, and especially to those who <i>don't</i> code, or write stories, or draw art. every trans girl is valuable, and their worth is more than any arbitrary set of talents. and a little love can go a long way.</p>
            <p>yours truly,</p>
            <img width="160" alt="dragongirlsnout" title="dragongirlsnout" src="https://64.media.tumblr.com/ddfd786c6517f2cda29c4295723ccba4/5ebdb69cac43d4bb-82/s400x600/b5d56fb5b0d3fac531b32ad23abff6cd93239684.png">
          </div>
          <footer>
            <a href="https://cohost.org/minecraft" target="_blank" title="@minecraft on cohost">
              <svg role="img" aria-label="cohost" viewBox="0 0 506 128" xmlns="http://www.w3.org/2000/svg" class="__cohost-logo" fill="">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M142.814 106.403C131.705 113.206 118.897 118.552 104.39 122.439C88.2779 126.756 73.0919 128.487 58.8317 127.631C44.5716 126.775 32.4222 123.055 22.3834 116.471C12.3446 109.887 5.57634 100.068 2.07868 87.0142C-1.43905 73.886 -0.492012 61.9799 4.9198 51.2958C10.3316 40.6118 19.0083 31.3714 30.95 23.5747C42.8917 15.7779 56.9185 9.72092 73.0304 5.40379C89.0677 1.1066 104.193 -0.627685 118.406 0.200922C127.955 0.757684 136.568 2.6028 144.246 5.73626C147.995 7.26657 151.521 9.10414 154.824 11.249C164.89 17.7858 171.672 27.581 175.17 40.6346C178.667 53.6882 177.697 65.5807 172.258 76.312C171.498 77.8112 170.675 79.2823 169.789 80.7261C169.163 77.9074 167.906 75.4497 166.018 73.353C165.091 72.3236 164.061 71.3784 162.926 70.5172C160.603 68.7538 157.845 67.3429 154.652 66.2845C149.898 64.7092 144.602 63.9216 138.763 63.9216C132.896 63.9216 127.58 64.7024 122.813 66.2641C118.046 67.8259 114.257 70.1752 111.446 73.3122C108.635 76.4492 107.23 80.4078 107.23 85.188C107.23 89.9411 108.635 93.8928 111.446 97.0434C114.257 100.194 118.046 102.564 122.813 104.153C127.58 105.741 132.896 106.536 138.763 106.536C140.143 106.536 141.493 106.492 142.814 106.403ZM91.9944 97.9397C90.8808 99.1348 88.9185 100.404 86.1074 101.749C83.2963 103.093 79.9081 104.227 75.9427 105.151C71.9773 106.074 67.7132 106.536 63.1502 106.536C59.1577 106.536 55.2466 106.149 51.417 105.375C47.5875 104.601 44.1245 103.372 41.0283 101.688C37.932 100.004 35.4672 97.8039 33.6339 95.0879C31.8006 92.3719 30.8839 89.0719 30.8839 85.188C30.8839 81.2498 31.8006 77.9227 33.6339 75.2066C35.4672 72.4906 37.932 70.3042 41.0283 68.6475C44.1245 66.9907 47.5875 65.7888 51.417 65.0419C55.2466 64.295 59.1577 63.9216 63.1502 63.9216C67.7403 63.9216 71.9773 64.329 75.8612 65.1438C79.7451 65.9586 83.079 67.0246 85.8629 68.3419C88.6469 69.6592 90.6635 71.0647 91.9129 72.5585L81.4834 79.4028C79.9624 77.7461 77.6538 76.4221 74.5575 75.4307C71.4613 74.4394 67.6996 73.9437 63.2725 73.9437C61.0997 73.9437 58.9065 74.1135 56.6929 74.4529C54.4793 74.7925 52.4491 75.3696 50.6022 76.1844C48.7554 76.9992 47.2683 78.1399 46.1412 79.6066C45.014 81.0732 44.4504 82.9337 44.4504 85.188C44.4504 87.4151 45.014 89.2553 46.1412 90.7083C47.2683 92.1614 48.7554 93.3157 50.6022 94.1712C52.4491 95.0268 54.4793 95.6311 56.6929 95.9842C58.9065 96.3373 61.0997 96.5138 63.2725 96.5138C67.6181 96.5138 71.3866 95.9706 74.5779 94.8842C77.7692 93.7978 80.0167 92.5484 81.3204 91.1361L91.9944 97.9397ZM138.763 96.3508C144.439 96.3508 148.839 95.3323 151.963 93.2953C155.086 91.2583 156.648 88.5559 156.648 85.188C156.648 81.7386 155.079 79.0294 151.942 77.0603C148.805 75.0912 144.412 74.1066 138.763 74.1066C133.086 74.1066 128.666 75.0912 125.502 77.0603C122.338 79.0294 120.756 81.7386 120.756 85.188C120.756 88.6102 122.338 91.3262 125.502 93.3361C128.666 95.3459 133.086 96.3508 138.763 96.3508Z" fill="currentColor"></path>
                <path d="M194.473 106.424V42.5023H207.737V72.5055C210.187 70.215 213.403 68.4904 217.385 67.3319C221.366 66.1733 225.888 65.594 230.948 65.594C238.592 65.594 244.285 67.2054 248.027 70.4281C251.769 73.6508 253.64 78.871 253.64 86.0889V106.424H240.297V87.2474C240.297 84.078 239.824 81.6543 238.878 79.9764C237.933 78.2984 236.415 77.1465 234.324 76.5206C232.233 75.8947 229.457 75.5818 225.994 75.5818C222.984 75.5818 220.135 75.9413 217.445 76.6604C214.755 77.3796 212.524 78.4183 210.753 79.7766C208.982 81.135 207.976 82.7596 207.737 84.6506V106.424H194.473V106.424Z" fill="currentColor"></path>
                <path d="M394.498 106.615C387.518 106.615 381.312 106.167 375.88 105.27C370.448 104.374 366.36 103.22 363.617 101.808L373.313 93.9039C374.943 94.8273 377.707 95.649 381.604 96.3687C385.502 97.0884 389.895 97.4484 394.784 97.4484C400.352 97.4484 404.69 97.0816 407.8 96.3483C410.91 95.615 412.465 94.6101 412.465 93.3335C412.465 92.573 411.766 91.962 410.367 91.5002C408.968 91.0385 406.7 90.6379 403.563 90.2984C400.426 89.9589 396.237 89.6262 390.995 89.3003C382.466 88.7299 375.941 87.4398 371.419 85.43C366.897 83.4201 364.636 80.3781 364.636 76.3041C364.636 74.1041 365.512 72.2233 367.264 70.6616C369.015 69.0998 371.378 67.8301 374.352 66.8524C377.326 65.8746 380.681 65.1548 384.415 64.6931C388.15 64.2314 391.986 64.0005 395.924 64.0005C404.1 64.0005 410.455 64.503 414.991 65.5079C419.527 66.5128 422.256 67.3005 423.18 67.8709L414.217 76.7523C413.809 76.4535 412.961 76.1072 411.67 75.7133C410.38 75.3196 408.819 74.9325 406.985 74.5523C405.152 74.172 403.21 73.8529 401.159 73.5949C399.109 73.3369 397.119 73.2078 395.191 73.2078C392.04 73.2078 389.168 73.3233 386.574 73.5541C383.981 73.785 381.923 74.1381 380.402 74.6134C378.881 75.0887 378.121 75.7202 378.121 76.5078C378.121 77.5399 379.486 78.2936 382.215 78.7689C384.945 79.2442 389.637 79.6991 396.291 80.1337C399.713 80.3781 403.169 80.738 406.659 81.2133C410.15 81.6886 413.341 82.3812 416.233 83.2911C419.126 84.2009 421.448 85.4163 423.2 86.9373C424.952 88.4583 425.828 90.3595 425.828 92.641C425.828 95.194 425.006 97.3532 423.363 99.1187C421.72 100.884 419.445 102.324 416.539 103.437C413.633 104.551 410.292 105.359 406.517 105.861C402.742 106.364 398.735 106.615 394.498 106.615Z" fill="currentColor"></path>
                <path d="M449.364 76.7974V67.4755H469.77V53.3752H482.617V67.4755H506V76.7974H482.617V98.0654H501.3V106.643H469.77V76.7974H449.364Z" fill="currentColor"></path>
                <path d="M308.663 106.615C302.797 106.615 297.48 105.82 292.713 104.232C287.947 102.643 284.158 100.273 281.347 97.1224C278.536 93.9718 277.13 90.02 277.13 85.267C277.13 80.4868 278.536 76.5282 281.347 73.3912C284.158 70.2542 287.947 67.9048 292.713 66.3431C297.48 64.7814 302.797 64.0005 308.663 64.0005C314.503 64.0005 319.799 64.7882 324.552 66.3635C329.305 67.9387 333.094 70.2949 335.918 73.4319C338.743 76.5689 340.155 80.5139 340.155 85.267C340.155 90.02 338.743 93.9718 335.918 97.1224C333.094 100.273 329.305 102.643 324.552 104.232C319.799 105.82 314.503 106.615 308.663 106.615ZM308.663 96.4298C314.34 96.4298 318.74 95.4113 321.863 93.3743C324.986 91.3373 326.548 88.6348 326.548 85.267C326.548 81.8176 324.98 79.1084 321.843 77.1393C318.706 75.1701 314.312 74.1856 308.663 74.1856C302.987 74.1856 298.566 75.1701 295.402 77.1393C292.238 79.1084 290.656 81.8176 290.656 85.267C290.656 88.6892 292.238 91.4052 295.402 93.415C298.566 95.4249 302.987 96.4298 308.663 96.4298Z" fill="currentColor"></path>
              </svg>
            </a>
            <button id="__cta-close">dismiss</button>
          </footer>
        </div>
      `);
      const initializePreferences = () => {
        mutationManager.start(fixMasonryNotes, masonryNotesSelector);

        waitFor(containerSelector).then(() => {
          if (state.routeName === 'peepr-route' && !matchPathname()) $(containerSelector).setAttribute('data-blog-container', '');
        });

        if (configPreferences.disableTagNag.value) window.localStorage.setItem(tsKey, Number.MAX_SAFE_INTEGER);

        if (configPreferences.collapseCaughtUp.value || configPreferences.hideRecommendedBlogs.value || configPreferences.hideRecommendedTags.value) mutationManager.start(labelCells, carouselCellSelector);
        featureStyles.build('__cc', `
          [data-watermark-carousel-title-cell] { position: relative !important; }
          [data-watermark-carousel-title-cell] > div { visibility: hidden; position: absolute !important; max-width: 100%; }
          [data-watermark-carousel-title-cell] > div canvas { visibility: hidden; }
          [data-watermark-carousel-cell] > div {
            height: 0px;
            overflow-y: hidden;
            border: 4px solid rgb(var(--white));
            border-radius: 3px;
          }
        `, '', configPreferences.collapseCaughtUp.value);

        featureStyles.build('__rb', `
          [data-blog-carousel-cell] { position: relative !important; }
          [data-blog-carousel-cell] > div { visibility: hidden; position: absolute !important; max-width: 100%; }
          [data-blog-carousel-cell] > div canvas { visibility: hidden; }
          [data-blog-carousel-cell] ${keyToCss('carouselWrapper')} { display: none !important }
        `, '', configPreferences.hideRecommendedBlogs.value);
        waitFor(keyToCss('recommendedBlogs')).then(() => {
          toggle(find($a(keyToCss('sidebarItem')), keyToCss('recommendedBlogs')), !configPreferences.hideRecommendedBlogs.value);
          toggle(find($a(keyToCss('desktopContainer')), keyToCss('recommendedBlogs')), !configPreferences.hideRecommendedBlogs.value);
        });

        featureStyles.build('__rt', `
          [data-tag-carousel-cell] { position: relative !important; }
          [data-tag-carousel-cell] > div { visibility: hidden; position: absolute !important; max-width: 100%; }
          [data-tag-carousel-cell] > div canvas { visibility: hidden; }
          [data-tag-carousel-cell] ${keyToCss('carouselWrapper')} { display: none !important }
        `, '', configPreferences.hideRecommendedTags.value);

        if (configPreferences.originalHeaders.value) {
          addUserPortrait();
          mutationManager.start(fixHeader, postSelector);
          mutationManager.start(fixHeaderAvatar, postHeaderTargetSelector);
        }

        waitFor(keyToCss('radar')).then(() => {
          toggle(find($a(keyToCss('sidebarItem')), keyToCss('radar')), !configPreferences.hideTumblrRadar.value);
        });

        if (isDashboard()) {
          waitFor(keyToCss('timelineHeader')).then(() => {
            toggle($(keyToCss('timelineHeader')), !configPreferences.hideDashboardTabs.value);
          });
        }

        waitFor(keyToCss('menuRight')).then(() => {
          toggle(find($a(keyToCss('menuContainer')), 'use[href="#managed-icon__explore"]'), !configPreferences.hideExplore.value);
          toggle(find($a(keyToCss('menuContainer')), 'use[href="#managed-icon__shop"]'), !configPreferences.hideTumblrShop.value);
        });

        if (configPreferences.highlightLikelyBots.value || configPreferences.showFollowingLabel.value) {
          mutationManager.start(scanNotes, noteSelector);
        }
        featureStyles.build('__ps', `
          ${keyToCss('pollAnswerPercentage')} { position: relative; bottom: 4px; }
          ${keyToCss('results')} { overflow: hidden; }`, '', configPreferences.displayVoteCounts.value);
        if (configPreferences.displayVoteCounts.value) mutationManager.start(detailPolls, answerSelector);

        if (configPreferences.votelessResults.value) mutationManager.start(pollResults, voteSelector);

        featureStyles.build('__oe', `
          #glass-container ${keyToCss('menuContainer')} {
            border-bottom: none !important;

            ${keyToCss('avatarWrapper')} {
              position: absolute;
              top: -6px;
              left: -100px;
            }
            ${keyToCss('avatar')} {
              &, img {
                width: 64px !important;
                height: 64px !important;
              }
            }
            ${keyToCss('selectedBlogName')}${keyToCss('hasAvatar')} { margin-left: 0 !important; }
          }
        `, '', configPreferences.originalEditorHeaders.value);

        featureStyles.build('__bs', `${keyToCss('badgeContainer')}, ${keyToCss('peeprHeaderBadgesWrapper')} { display: none; }`, '', configPreferences.hideBadges.value);
        if (matchPathname()) {
          featureStyles.buildScalable('__cp', `${containerSelector} { left: $NUMpx; }`, '', true, configPreferences.contentPositioning.value);
          featureStyles.buildScalable('__cw', `${containerSelector} { max-width: $NUMpx; }`, '', true, configPreferences.contentWidth.value);
          featureStyles.buildScalable('__gs', `${keyToCss('gridTimelineObject')} { width: calc($NUM% - 2px) !important; }`, '', true, 0);
          if (configPreferences.contentWidth.value > 51.5 && pathname === 'likes') {
            waitFor(keyToCss('gridded')).then(() => {
              const gridWidth = $(keyToCss('gridded')).clientWidth;
              const gridItemWidth = Math.fround(100 / Math.round(gridWidth / 178));
              featureStyles.toggleScalable('__gs', true, gridItemWidth);
            });
          }
        }
        featureStyles.build('__acs', `
          [role="tablist"] { padding: 0 !important; }
          [role="tablist"] ${keyToCss('button')}${keyToCss('tab')} {
            font-size: 1rem !important;
            line-height: 1.5 !important;
            padding: 8px !important;
            border-radius: unset !important;
            background: none !important;
          }
          [role="tablist"] ${keyToCss('button')}${keyToCss('tab')}[aria-selected="true"] {
            color: rgb(var(--accent)) !important;
            box-shadow: inset 0px -2px 0px rgb(var(--accent));
          }
          [role="tablist"] ${keyToCss('button')}${keyToCss('tab')}:first-of-type [tabindex] { font-size: 0; }
          [role="tablist"] ${keyToCss('button')}${keyToCss('tab')}:first-of-type [tabindex]::after {
            font-size: 1rem;
            content: "${tr('All')}";
          }
          [role="tabpanel"] ${keyToCss('dateSeparator')} {
            background: rgba(var(--black),.07) !important;
            padding: 8px 16px important;
          }
          [role="tabpanel"] ${keyToCss('backgroundColor')} { border-top: 1px solid rgba(var(--black),.13); }
          ${keyToCss('linkToActivity')} {
            padding: 0 !important;
            height: 30px !important;
          }
          [role="tabpanel"] ${keyToCss('avatarWrapper')} ${keyToCss('avatar')},[role="tabpanel"] ${keyToCss('anonymousAvatar')},
          [role="tabpanel"] ${keyToCss('avatar')} img {
            height: 25px !important;
            width: 25px !important;
          }
          [role="tabpanel"] ${keyToCss('verticallyCentered')} { align-self: start !important; }
          [role="tabpanel"] ${keyToCss('avatarWrapperInner')},[role="tabpanel"] ${keyToCss('circleAvatar')} {border-radius: 3px !important; }
          [role="tabpanel"] ${keyToCss('badge')} ${keyToCss('border')},
          [role="tabpanel"] ${keyToCss('rollupBadge')} ${keyToCss('border')},
          [role="tabpanel"] ${keyToCss('rollupAvatar')} {border: none !important; }
          [role="tabpanel"] ${keyToCss('underlined')} span { text-decoration: none !important; }
          ${keyToCss('linkToActivity')} a { color: rgba(var(--black),.65) !important; }
        `, '', configPreferences.revertActivityFeedRedesign.value);

        featureStyles.buildScalable('__ms', `
          ${keyToCss('conversationWindow')} {
            border-radius: 5px;
            width: calc(280px * $NUM); 
            height: calc(500px * $NUM);
            max-height: calc(100vh - 80px) !important;
          }
          ${keyToCss('conversationWindow')} ${keyToCss('headerDesktop')} {
            border-radius: 5px 5px 0 0 !important;
            background: rgba(255,255,255,.1);
            backdrop-filter: blur(6px);
            padding: 8px;
          }
          ${keyToCss('conversationWindow')} ${keyToCss('footer')} {
            padding: 4px;
            border-radius: 0 0 5px 5px !important;
          }
          ${keyToCss('conversationWindow')} ${keyToCss('timestamp')} {
            text-align: center !important;
            margin: 14px 0;
            font-size: 14px;
          }
          ${keyToCss('messages')} { background: transparent !important; }
          ${keyToCss('message')} img { width: 100% !important; }
          ${keyToCss('conversation')} ${keyToCss('textareaContainer')} { border-radius: 3px; }
          ${keyToCss('minimizedConversation')} ${keyToCss('avatarWrapper')} {
            background: transparent !important;
            padding: 0 !important;
          }
          ${keyToCss('minimizedConversation')} ${keyToCss('avatar')}, ${keyToCss('minimizedConversation')} img {
            width: 48px !important;
            height: 48px !important;
          }
        `, `${keyToCss('conversationWindow')} {
          width: calc(400px * $NUM); 
          height: calc(560px * $NUM);
          max-height: calc(100vh - 80px) !important;
        }`, configPreferences.revertMessagingRedesign.value, configPreferences.messagingScale.value);
        if (configPreferences.revertMessagingRedesign.value) {
          mutationManager.start(styleMessaging, conversationSelector);
        }

        featureStyles.build('__as', `.__stickyContainer > ${keyToCss('avatar')} { position: static !important; }`, '', configPreferences.disableScrollingAvatars.value);

        observer.observe(target, { childList: true, subtree: true });
      };
      const setupButtons = () => {
        $('#__cb').addEventListener('click', () => {
          if ($('#__c').style.display === 'none') {
            $('#__cb svg').style.setProperty('--icon-color-primary', 'rgb(var(--white-on-dark))');
          } else $('#__cb svg').style.setProperty('--icon-color-primary', 'rgba(var(--white-on-dark),.65)');
          toggle($('#__c'));
        });
        $('#__ab').addEventListener('click', () => {
          if ($('#__a').style.display === 'none') {
            $('#__ab svg').style.setProperty('--icon-color-primary', 'rgb(var(--white-on-dark))');
          } else $('#__ab svg').style.setProperty('--icon-color-primary', 'rgba(var(--white-on-dark),.65)');
          toggle($('#__a'));
        });
        $('#__co').addEventListener('click', () => {
          const configExport = new Blob([JSON.stringify(configPreferences, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(configExport);
          const exportLink = document.createElement('a');
          const date = new Date();
          const yy = date.getFullYear().toString();
          const mm = (date.getDay() + 1).toString();
          const dd = date.getDate().toString();
          exportLink.href = url;
          exportLink.download = `dashboard unfucker config export ${mm}-${dd}-${yy}`;

          document.documentElement.append(exportLink);
          exportLink.click();
          exportLink.remove();
          URL.revokeObjectURL(url);
        });
        $('#__ci').addEventListener('click', () => {
          const input = document.createElement('input');
          input.id = '__cii';
          input.type = 'file';
          input.accept = 'application/json';
          input.addEventListener('change', async function () {
            const [file] = this.files;

            if (file) {
              let msg;
              let obj = await file.text();
              try {
                obj = JSON.parse(obj);
              } catch (e) {
                console.error('failed to import preferences from file!', e);
              }
              if (typeof obj === 'object' && obj.lastVersion) {
                configPreferences = obj;
                updatePreferences();
                console.info('imported preferences from file!');
                msg = $str('<span id="__im">successfully imported preferences from file!</span>');
                document.getElementById('__cio').append(msg);
                await delay(100);
                css(msg, { opacity: '1' });
                await delay(3000);
                css(msg, { opacity: '0' });
                await delay(700);
                msg.remove();
              } else {
                msg = $str('<span id="__im">invalid JSON data!</span>');
                document.getElementById('__cio').append(msg);
                await delay(100);
                css(msg, { opacity: '1' });
                await delay(3000);
                css(msg, { opacity: '0' });
                await delay(700);
                msg.remove();
              }
            }
          });
          input.click();
        });
        $a('.configInput').forEach(currentValue => {
          currentValue.addEventListener('change', event => {
            const name = event.target.attributes.getNamedItem('name').value;
            if (event.target.attributes.getNamedItem('type').value === 'checkbox') {
              configPreferences[name].value = event.target.matches(':checked') ? 'checked' : '';
              checkboxEvent(event.target.id, event.target.matches(':checked'));
              if (event.target.closest('li').attributes.getNamedItem('active')) {
                event.target.closest('li').attributes.getNamedItem('active').value = configPreferences[name].value ? 'true' : 'false';
              }
            } else {
              configPreferences[name].value = event.target.valueAsNumber;
              rangeEvent(event.target.id, event.target.valueAsNumber);
            }
            updatePreferences();
          });
        });
        $a('.subConfigInput').forEach(currentValue => {
          currentValue.addEventListener('change', event => {
            const name = event.target.attributes.getNamedItem('name').value;
            const index = event.target.attributes.getNamedItem('index').value;
            if (event.target.matches(':checked')) configPreferences[name].style = index;
            checkboxEvent(event.target.id, event.target.matches(':checked'));
            if (event.target.closest('li').attributes.getNamedItem('active')) {
              event.target.closest('li').attributes.getNamedItem('active').value = 'true';
            } else if (event.target.closest('.submenu').querySelector("[active='true]")) {
              event.target.closest('.submenu').querySelector("[active='true]").attributes.getNamedItem('active').value = 'false';
            }
            updatePreferences();
          });
        });
        $a('.msgHexSelect').forEach(currentValue => {
          currentValue.addEventListener('change', event => {
            const name = event.target.attributes.getNamedItem('name').value;
            configPreferences.revertMessagingRedesign[name] = event.target.value;
            if (configPreferences.revertMessagingRedesign.value) mutationManager.start(styleMessaging, conversationSelector);
            updatePreferences();
          });
        });
      };

      const unfuck = async function () {
        if (!initialChecks()) return;

        const menu = configMenu(version, configPreferences);
        pathname = window.location.pathname.split('/')[1];

        window.requestAnimationFrame(() => {
          document.head.appendChild(styleElement);
          followingAsDefault();
          if (matchPathname()) {
            waitFor(keyToCss('sidebar')).then(() => {
              waitFor(keyToCss('sidebarContent')).then(() => {
                hide($(keyToCss('sidebarContent')));
              });
              $(keyToCss('sidebar')).insertBefore(menu, $(`${keyToCss('sidebar')} aside`));
              if (configPreferences.lastVersion !== version) {
                $('#__in').append($str("<span class='__n'>new!</span>"));
                $('#__cb').append($str("<span class='__n'></span>"));
                $('#__ab').append($str("<span class='__n'></span>"));
                $('#__in').addEventListener('click', () => { $a('.__n').forEach(value => hide(value)); });
                configPreferences.lastVersion = version;
                updatePreferences();

              }
              if (configPreferences.showCta) {
                $(keyToCss('sidebar')).insertBefore(cta, $(`${keyToCss('sidebar')} aside`));
                $('#__cta-close').addEventListener('click', () => {
                  configPreferences.showCta = false;
                  updatePreferences();
                  $('.__cta-div').remove();
                });
              }
              setupButtons();
            });
          }
          initializePreferences();
        });
        console.log('dashboard fixed!');
      };

      console.info(JSON.parse(atob(state.obfuscatedFeatures)));
      console.info(featureSet);

      unfuck();

      window.setTimeout(() => { //added post fallback. does it work? who knows
        dummyValue = false;
        updatePreferences();
      }, 900000)

      window.addEventListener('resize', () => {
        if (!$('#__m')) return;

        windowWidth = window.innerWidth;
        safeOffset = (windowWidth - 1000) / 2;
        $('#__contentPositioning').attributes.getNamedItem('min').value = `-${safeOffset}`;
        $('#__contentPositioning').attributes.getNamedItem('max').value = `${safeOffset}`;
        $('#__contentWidth').attributes.getNamedItem('max').value = `${windowWidth}`;
        $('#__cps').innerHTML = `
          <option value="-${safeOffset}" label="left"></option>
          <option value="0" label="default"></option>
          <option value="${safeOffset}" label="right"></option>
        `;
        $('#__cws').innerHTML = `
          <option value="990" label="default"></option>
          <option value="${windowWidth}" label="full width"></option>
        `;
      });
      window.tumblr.on('navigation', () => window.setTimeout(() => {
        unfuck().then(() => {
          window.setTimeout(() => {
            if (!$a('#__m').length) unfuck();
          }, 400);
        }).catch(() =>
          window.setTimeout(unfuck, 400)
        );
      }, 400
      ));
    });
  });
};
const getNonce = () => {
  const { nonce } = [...document.scripts].find(script => script.nonce) || '';
  if (nonce === '') console.error('empty script nonce attribute: script may not inject');
  return nonce;
};
const script = () => $( `
  <script id="__u" nonce="${getNonce()}">
    const unfuckDashboard = ${main.toString()};
    unfuckDashboard("${getNonce()}");
  </script>
` );
if ($( 'head' ).length === 0) {
  const newNodes = [];
  const findHead = () => {
    const nodes = newNodes.splice(0);
    if (nodes.length !== 0 && (nodes.some(node => node.matches('head') || node.querySelector('head') !== null))) {
      const head = nodes.find(node => node.matches('head'));
      $( head ).append(script());
    }
  };
  const observer = new MutationObserver(mutations => {
    const nodes = mutations
      .flatMap(({ addedNodes }) => [...addedNodes])
      .filter(node => node instanceof Element)
      .filter(node => node.isConnected);
    newNodes.push(...nodes);
    findHead();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
} else $( document.head ).append(script());
