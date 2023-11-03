// ==UserScript==
// @name         dashboard unfucker
// @version      5.3.0
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

/* globals tumblr */

'use strict';
var $ = window.jQuery;
const main = async function () {
  const version = "5.3.0";
  const match = [
    "",
    "dashboard",
    "settings",
    "blog",
    "domains",
    "search",
    "likes",
    "following",
    "inbox",
    "tagged",
    "explore",
    "reblog"
  ];
  let state = window.___INITIAL_STATE___;
  let configPreferences = {
    lastVersion: version,
    hideDashboardTabs: { type: "checkbox", value: "" },
    hideRecommendedBlogs: { type: "checkbox", value: "" },
    hideTumblrRadar: { type: "checkbox", value: "" },
    hideExplore: { type: "checkbox", value: "" },
    hideTumblrShop: { type: "checkbox", value: "checked" },
    hideBadges: { type: "checkbox", value: "" },
    highlightLikelyBots: { type: "checkbox", value: "" },
    showFollowingLabel: { type: "checkbox", value: "" },
    contentPositioning: { type: "range", value: 0},
    contentWidth: { type: "range", value: 990},
    messagingScale: { type: "range", value: 1},
    disableTumblrLive: { type: "checkbox", value: "checked" },
    disableTumblrDomains: { type: "checkbox", value: "checked" },
    revertActivityFeedRedesign: { type: "checkbox", value: "checked" },
    revertSearchbarRedesign: { type: "checkbox", value: "checked" },
    enableCustomTabs: { type: "checkbox", value: "" },
    enableReblogPolls: { type: "checkbox", value: "" },
    disableTagNag: { type: "checkbox", value: "checked" },
    reAddHomeNotifications: { type: "checkbox", value: "checked" },
    displayVoteCounts: { type: "checkbox", value: "" },
    showNsfwPosts: { type: "checkbox", value: "" },
    disableScrollingAvatars: { type: "checkbox", value: ""}
  };
  let pathname = location.pathname.split("/")[1];
  const $a = selector => document.querySelectorAll(selector);
  const $ = selector => document.querySelector(selector);
  const $str = str => {
    let elem = document.createElement("div");
    elem.innerHTML = str;
    elem = elem.firstElementChild;
    return elem;
  };
  const hide = elem => {
    if (elem.length) elem.forEach(item => item.style.display = "none");
    else elem.style.display = "none";
  };
  const show = elem => {
    if (elem.length) elem.forEach(item => item.style.display = null);
    else elem.style.display = null;
  };
  const toggle = (elem, toggle = "ignore") => {
    if (toggle === "ignore") {
      elem.style.display === "none" ?
        show(elem)
        : hide(elem);
    } else {
      toggle === true ?
        show(elem)
        : hide(elem);
    }
  };
  const css = (elem, properties = {}) => {
    for (let property in properties) {
      elem.style[property] = properties[property];
    };
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
    nodeList.forEach(currentValue => {currentValue.remove()})
  }
  const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms));
  const matchPathname = () => match.includes(pathname);
  const isDashboard = () => ["dashboard", ""].includes(pathname);
  const notMasonry = () => !["search", "tagged", "explore"].includes(pathname);
  const storageAvailable = type => { //thanks mdn web docs!
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException && (
          e.code === 22
          || e.code === 1014
          || e.name === "QuotaExceededError"
          || e.name === "NS_ERROR_DOM_QUOTA_REACHED"
          ) &&
          storage &&
          storage.length !== 0
      );
    }
  };
  const modifyInitialTimeline = (obj, context, value) => {
    if (!obj || !value) return "";
    else if (context === "dashboard") {
      obj = obj.dashboardTimeline.response.timeline.elements;
    } else if (context === "peepr") {
      obj = obj.initialTimeline.objects
    };
    obj.forEach(post => {
      post.isNsfw = false;
      post.isModified = true;
    });
    return obj;
  };
  const modifyObfuscatedFeatures = (obfuscatedFeatures, featureSet) => {
    let obf = JSON.parse(atob(obfuscatedFeatures));
    for (let x of featureSet) {
      obf[x.name] = x.value;
    }
    return btoa(JSON.stringify(obf));
  };
  const waitFor = (selector, retried = 0,) => new Promise((resolve) => {
    if ($a(selector).length) { resolve() } else if (retried < 50) { requestAnimationFrame(() => waitFor(selector, retried + 1).then(resolve)) }
  });
  const updatePreferences = () => {
    localStorage.setItem("configPreferences", JSON.stringify(configPreferences))
  };
  const getUtilities = async function () {
    let retries = 0;
    while (retries++ < 1000 && (typeof window.tumblr === "undefined" || typeof window.tumblr.getCssMap === "undefined")) {
      await new Promise((resolve) => setTimeout(resolve));
    }
    const cssMap = await window.tumblr.getCssMap();
    const keyToClasses = (...keys) => keys.flatMap(key => cssMap[key]).filter(Boolean);
    const keyToCss = (...keys) => `:is(${keyToClasses(...keys).map(className => `.${className}`).join(", ")})`;
    const tr = string => `${window.tumblr.languageData.translations[string] || string}`;
    return { keyToClasses, keyToCss, tr };
  };
  const style = $str(`
    <style>
      #adBanner + div:not(#glass-container) > div:first-child {
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
  const timelineSelector = /\/api\/v2\/timeline/;
  const peeprSelector = new RegExp(`/\/api\/v2\/blog\/${pathname}\/posts/`);
  const isPostFetch = input => {
    if (timelineSelector.test(input) || peeprSelector.test(input)) return true;
    else return false;
  };
  const oldFetch = window.fetch;

  if (storageAvailable("localStorage")) {
    if (!localStorage.getItem("configPreferences") || Array.isArray(JSON.parse(localStorage.getItem("configPreferences")))) {
      updatePreferences();
      console.log("initialized preferences");
    } else {
      const currentPreferences = JSON.parse(localStorage.getItem("configPreferences"));
      const currentKeys = Object.keys(currentPreferences);
      for (const key in configPreferences) {
        if (currentKeys.includes(key)) {
          configPreferences[key] = currentPreferences[key];
        };
      };
      updatePreferences();
    };
  };
  if (configPreferences.showNsfwPosts.value) {
    window.fetch = async (input, options) => {
      const response = await oldFetch(input, options);
      let content = await response.text();
      if (isPostFetch(input)) {
        console.info(`modified data fetched from ${input}`);
        content = JSON.parse(content);
        const elements = content.response.timeline.elements;
        elements.forEach(post => {
          post.isNsfw = false;
          post.isModified = true;
        });
        content = JSON.stringify(content);
      };
      return new Response(content, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
      });
    };
  };
  const featureSet = [
    {"name": "redpopDesktopVerticalNav", "value": false},
    {"name": "liveCustomMarqueeData", "value": !configPreferences.disableTumblrLive.value},
    {"name": "liveStreaming", "value": !configPreferences.disableTumblrLive.value},
    {"name": "liveStreamingUserAllowed", "value": !configPreferences.disableTumblrLive.value},
    {"name": "liveStreamingUserEnabled", "value": !configPreferences.disableTumblrLive.value},
    {"name": "liveStreamingWeb", "value": !configPreferences.disableTumblrLive.value},
    {"name": "liveSteamingWebPayments", "value": !configPreferences.disableTumblrLive.value},
    {"name": "domainsSettings", "value": !configPreferences.disableTumblrDomains.value},
    {"name": "activityRedesignM3", "value": !configPreferences.revertActivityFeedRedesign.value},
    {"name": "improvedSearchTypeahead", "value": !configPreferences.revertSearchbarRedesign.value},
    {"name": "configurableTabbedDash", "value": configPreferences.enableCustomTabs.value?true:false},
    {"name": "allowAddingPollsToReblogs", "value": configPreferences.enableReblogPolls.value?true:false},
    {"name": "tagSuggestionTwoStepDialog", "value": !configPreferences.disableTagNag.value},
    {"name": "redpopUnreadNotificationsOnTab", "value": !configPreferences.reAddHomeNotifications.value},
    {"name": "reblogRedesignNew", "value": false},
    {"name": "redpopDesktopVerticalNav", "value": false},
    {"name": "crowdsignalPollsNpf", "value": true},
    {"name": "crowdsignalPollsCreate", "value": true},
    {"name": "adFreeCtaBanner", "value": false}
  ];
  Object.defineProperty(window, "___INITIAL_STATE___", { // thanks twilight-sparkle-irl!
    set(x) {
      state = x;
    },
    get() {
      try {
        return {
          ...state,
          Dashboard: modifyInitialTimeline(state.Dashboard, "dashboard", configPreferences.showNsfwPosts.value),
          PeeprRoute: modifyInitialTimeline(state.PeeprRoute, "peepr", configPreferences.showNsfwPosts.value),
          obfuscatedFeatures: modifyObfuscatedFeatures(state.obfuscatedFeatures, featureSet)
        };
      } catch (e) {
        console.error("Failed to modify features", e);
      }
      return state;
    },
    enumerable: true,
    configurable: true,
  });
  document.head.appendChild(style);
  document.addEventListener("DOMContentLoaded", () => {
    getUtilities().then(({ keyToCss, keyToClasses, tr }) => {
      let windowWidth = window.innerWidth;
      let safeOffset = (windowWidth - 1000) / 2;
      const postSelector = "[tabindex='-1'][data-id] article";
      const noteSelector = `[aria-label="${tr("Notification")}"],[aria-label="${tr("Unread Notification")}"]`;
      const answerSelector = "[data-testid='poll-answer']:not(.pollDetailed)";
      const newNodes = [];
      const target = document.getElementById("root");
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
          #__m li {
            list-style-type: none;
            padding: 8px 12px;
            border-bottom: 1px solid rgba(var(--black),.07);
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: rgb(var(--black));
          }
          #__m li span { max-width: 240px; }
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
          .configInput[type="checkbox"] {
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

          #tumblr { --dashboard-tabs-header-height: 0px !important; }
          ${keyToCss("navItem")}:has(use[href="#managed-icon__sparkle"]) { display: none !important; }
          ${keyToCss("bluespaceLayout")} > ${keyToCss("container")} { position: relative; }
          ${keyToCss("main")} {
            position: relative;
            flex: 1;
            min-width: 0;
            max-width: none !important;
          }
          ${keyToCss("main")}:not(${keyToCss("body")} > ${keyToCss("main")}) {
            top: -100px;
            padding-top: 100px;
          }
          ${keyToCss("body")} > header,
          ${keyToCss("body")} > ${keyToCss("toolbar")} {
            z-index: 1;
          }
          ${keyToCss("tabsHeader")} {
            top: 0;
            position: relative;
          }
          ${keyToCss("postColumn")} { max-width: calc(100% - 85px); }
          ${keyToCss("post")}, ${keyToCss("post")} > * { max-width: 100%; }
          ${keyToCss("cell")},
          ${keyToCss("link")},
          ${keyToCss("reblog")},
          ${keyToCss("videoBlock")},
          ${keyToCss("videoBlock")} iframe,
          ${keyToCss("audioBlock")} { max-width: none !important; }
          ${keyToCss("queueSettings")} {
            width: calc(100% - 85px);
            box-sizing: border-box;
          }

          [data-timeline] article { border-radius: 3px !important; }
          article header { border-radius: 3px 3px 0 0 !important; }

          ${keyToCss("toastHolder")} { display: none; }
        </style>
      `);
      const labelContainer = (label, icon, desc) => $str(`
        <div class="customLabelContainer ${keyToClasses("generalLabelContainer").join(" ")}" label="${label}" style="margin-left: 5px;">
          ${label}
          <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" class="${keyToClasses("secondaryIconContainer").join(" ")}" role="presentation" style="--icon-color-primary: rgb(var(--${label === "Follows You" ? "blue" : "red"}))">
            <use href="#managed-icon__${icon}"></use>
          </svg>
          <span class="customLabelInfo ${icon}">${desc}</span>
        </div>
      `);
      const fetchNpf = obj => { //shoutout to xkit rewritten for showing me this method
        const fiberKey = Object.keys(obj).find(key => key.startsWith("__reactFiber"));
        let fiber = obj[fiberKey];

        while (fiber !== null) {
          const { timelineObject } = fiber.memoizedProps || {};
          if (timelineObject !== undefined) {
            return timelineObject;
          } else {
            fiber = fiber.return;
          };
        };
      };
      const fetchPercentage = obj => {
        const fiberKey = Object.keys(obj).find(key => key.startsWith("__reactFiber"));
        let fiber = obj[fiberKey];

        while (fiber !== null) {
          const { percentage } = fiber.memoizedProps || {};
          if (percentage !== undefined) {
            return percentage;
          } else {
            fiber = fiber.return;
          };
        };
      };
      const fetchNote = obj => {
        const fiberKey = Object.keys(obj).find(key => key.startsWith("__reactFiber"));
        let fiber = obj[fiberKey];

        while (fiber !== null) {
          const { notification } = fiber.memoizedProps || {};
          if (notification !== undefined) {
            return notification;
          } else {
            fiber = fiber.return;
          };
        };
      };
      const fixHeader = posts => {
        for (const post of posts) {
          const header = post.querySelector(`:scope header${keyToCss("header")}`);
          if (!header.querySelector(`:scope ${keyToCss("rebloggedFromName")}`)
          && header.querySelector(`:scope ${keyToCss("reblogIcon")}`)) {
            try {
              const follow = header.querySelector(`:scope ${keyToCss("followButton")}`);
              if (follow) hide(follow);
              const labels = post.querySelectorAll(`:scope ${keyToCss("username")} ${keyToCss("label")}`);
              const label = labels.item(labels.length - 1).cloneNode(true);
              header.querySelector(`:scope ${keyToCss("reblogIcon")}`).after(label);
              const classes = keyToClasses("rebloggedFromName")
              label.classList.add(...classes);
              css(label, { "display": "inline", "marginLeft": "5px" });
              css(label.querySelector(`:scope ${keyToCss("attribution")}`), { "color": "rgba(var(--black),.65)" });
            } catch (e) {
              console.error("an error occurred processing a post header:", e);
              console.error(post);
              console.error(fetchNpf(post));
            };
          };
        };
      };
      const scanNotes = notes => {
        for (const note of notes) {
          try {
            const { followingYou, mutuals, type, fromTumblelogUuid } = fetchNote(note);
            if (configPreferences.highlightLikelyBots.value && type === "follower") {
              window.tumblr.apiFetch(`/v2/blog/${fromTumblelogUuid}/info`).then(response => {
                const { title, name, posts, likes } = response.response.blog;
                if ((posts === 0 && title === tr("Untitled"))
                || (likes === 0 && title === tr("Untitled"))
                || (name === title && posts === 1)) {
                  hide(note.querySelector(".customLabelContainer"));
                  css(note, { "backgroundColor": "rgba(255,37,47,.15)" });
                  note.querySelector(keyToCss("blogLinkUserAttribution")).append(labelContainer("Possible Bot", "warning-circle", "This blog may be a bot; block at your own discretion. This feature is a component of dashboard unfucker."));
                };
              });
            };
            if (configPreferences.showFollowingLabel.value && followingYou && !mutuals && !note.querySelector(".customLabelContainer")) {
              note.querySelector(keyToCss("blogLinkUserAttribution")).append(labelContainer("Follows You", "profile-checkmark", "This blog follows you. This feature is a component of dashboard unfucker."));
            };
          } catch (e) {
            console.error("an error occurred processing a notification:", e);
            console.error(note);
            console.error(fetchNote(note));
          };
        };
      };
      const detailPolls = answers => {
        for (const answer of answers) {
          if (answer.classList.contains("pollDetailed")) continue;
          const post = answer.closest(postSelector);
          const answers = Array.from(post.querySelectorAll(`:scope [data-testid="poll-answer"]`));
          const voteCount = Number(post.querySelector(keyToCss("pollSummary")).innerText.replace(/,/, "").match(/\d+/)[0]);
          answers.forEach((element) => {
            const percentage = fetchPercentage(element);
            element.append($str(`<span class="answerVoteCount">(${Math.round(voteCount * percentage / 100)})</span>`));
            element.classList.add("pollDetailed");
          });
        }
      };
      const mutationManager = Object.freeze({
        listeners: new Map(),
        start (func, selector) {
          if (this.listeners.has(func)) this.stop(func);
          this.listeners.set(func, selector);
          func(Array.from($a(selector)));
        },
        stop (func) {this.listeners.delete(func);}
      });
      const sortNodes = () => {
        const nodes = newNodes.splice(0);
        if (nodes.length === 0) return
        for ( const [func, selector] of mutationManager.listeners) {
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
      const checkboxEvent = (id, value) => {
        switch (id) {
          case "__hideDashboardTabs":
            toggle($(keyToCss("timelineHeader")), !value);
            break;
          case "__hideRecommendedBlogs":
            toggle(find($a(keyToCss("sidebarItem")), keyToCss("recommendedBlogs")), !value);
            break;
          case "__hideTumblrRadar":
            toggle(find($a(keyToCss("sidebarItem")), keyToCss("radar")), !value);
            break;
          case "__hideExplore":
            toggle(find($a(keyToCss("menuContainer")), 'use[href="#managed-icon__explore"]'), !value);
            break;
          case "__hideTumblrShop":
            toggle(find($a(keyToCss("menuContainer")), 'use[href="#managed-icon__shop"]'), !value);
            break;
          case "__hideBadges":
            if (value) {
              document.getElementById("__bs").innerText = `${keyToCss("badgeContainer")} { display: none; }`;
            } else { document.getElementById("__bs").innerText = "" };
            break;
          case "__highlightLikelyBots":
            if (value) {
              mutationManager.start(scanNotes, noteSelector);
            } else {
              remove($a("[label='Possible Bot']"));
              if (!mutationManager.listeners.has(scanNotes)) mutationManager.stop(scanNotes);
            }
            break;
          case "__showFollowingLabel":
            if (value) mutationManager.start(scanNotes, noteSelector);
            else {
              remove($a("[label='Follows You']"));
              if (!mutationManager.listeners.has(scanNotes)) mutationManager.stop(scanNotes);
            }
            break;
          case "__displayVoteCounts":
            if (value) {
              mutationManager.start(detailPolls, answerSelector);
              document.getElementById("__ps").innerText = `
                ${keyToCss("pollAnswerPercentage")} { position: relative; bottom: 4px; }
                ${keyToCss("results")} { overflow: hidden; }
              `;
            }
            else {
              mutationManager.stop(detailPolls);
              document.getElementById("__ps").innerText = "";
              remove($a(".answerVoteCount"));
              $a(".pollDetailed").forEach(elem => elem.classList.remove("pollDetailed"));
            }
            break;
          case "__disableScrollingAvatars":
            if (value) document.getElementById("__as").innerText = `${keyToCss("stickyContainer")} > ${keyToCss("avatar")} { position: static !important; }`;
            else document.getElementById("__as").innerText = "";
            break;
        };
      };
      const rangeEvent = (id, value) => {
        if (matchPathname() && notMasonry()) {
          const posOffset = $("#__contentPositioning").valueAsNumber;
          const widthOffset = ($("#__contentWidth").valueAsNumber - 990) / 2;
          let safeMax = Math.max(safeOffset - widthOffset, 0);
          if (Math.abs(posOffset) > safeMax) {
            safeMax = posOffset > 0 ? safeMax : -safeMax;
            $("#__contentPositioning").value = safeMax.toString();
            css($(`${keyToCss("bluespaceLayout")} > ${keyToCss("container")}`), { "left": `${safeMax}px`});
            configPreferences.contentPositioning.value = safeMax;
            if (id === "__contentWidth") css($(`${keyToCss("bluespaceLayout")} > ${keyToCss("container")}`), { "max-width": `${value}px`});
          } else {
            switch (id) {
              case "__contentPositioning":
                css($(`${keyToCss("bluespaceLayout")} > ${keyToCss("container")}`), { "left": `${value}px`});
                break;
              case "__contentWidth":
                css($(`${keyToCss("bluespaceLayout")} > ${keyToCss("container")}`), { "max-width": `${value}px`});
                break;
              case "__messagingScale":
                $("#__ms").innerText = `
                  ${keyToCss("conversationWindow")} { 
                    width: calc(280px * ${value}); 
                    height: calc(450px * ${value});
                  }
                `;
                break;
            };
          };
          if (pathname === "likes") {
            const gridWidth = $(keyToCss("gridded")).clientWidth;
            const gridItemWidth = Math.fround(100 / Math.round(gridWidth / 178));
            $("#__gs").innerText = `${keyToCss("gridTimelineObject")} { width: calc(${gridItemWidth}% - 2px) !important; }`;
          };
        };
      };
      const initialChecks = () => {
        if ($a("#__m").length) { //initial status checks to determine whether to inject or not
          console.log("no need to unfuck");
          return false;
        } else {
          console.log("unfucking dashboard...");
          return true;
        };
      };
      const followingAsDefault = async function () {
        waitFor(keyToCss("timeline")).then(() => {
          if (isDashboard()
            && $(keyToCss("timeline")).attributes.getNamedItem("data-timeline").value.includes("/v2/tabs/for_you")) {
            window.tumblr.navigate("/dashboard/following");
            console.log("navigating to following");
          };
        });
      };
      const configMenu = (version) => $str(`
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
              <li>
                <a target="_blank" href="https://github.com/enchanted-sword/dashboard-unfucker">source</a>
              </li>
              <li>
                <a target="_blank" href="https://github.com/enchanted-sword/dashboard-unfucker/blob/main/changelog.md">changelog</a>
              </li>
              <li>
                <a target="_blank" href="https://github.com/enchanted-sword/dashboard-unfucker/issues/">report a bug</a>
              </li>
              <li>
                <a target="_blank" href="https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker.user.js">update</a>
              </li>
              <li>
                <a target="_blank" href="https://tumblr.com/dragongirlsnout">my tumblr!</a>
              </li>
              <li>
                <a target="_blank" href="https://www.paypal.com/paypalme/dragongirled">support my work!</a>
              </li>
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
            <ul id="__ct">
              <li>
                <span>hide dashboard tabs</span>
                <input class="configInput" type="checkbox" id="__hideDashboardTabs" name="hideDashboardTabs" ${configPreferences.hideDashboardTabs.value}>
                <label for="__hideDashboardTabs">Toggle</label>
              </li>
              <li>
                <span>hide recommended blogs</span>
                <input class="configInput" type="checkbox" id="__hideRecommendedBlogs" name="hideRecommendedBlogs" ${configPreferences.hideRecommendedBlogs.value}>
                <label for="__hideRecommendedBlogs">Toggle</label>
              </li>
              <li>
                <span>hide tumblr radar</span>
                <input class="configInput" type="checkbox" id="__hideTumblrRadar" name="hideTumblrRadar" ${configPreferences.hideTumblrRadar.value}>
                <label for="__hideTumblrRadar">Toggle</label>
              </li>
              <li>
                <span>hide explore</span>
                <input class="configInput" type="checkbox" id="__hideExplore" name="hideExplore" ${configPreferences.hideExplore.value}>
                <label for="__hideExplore">Toggle</label>
              </li>
              <li>
                <span>hide tumblr shop</span>
                <input class="configInput" type="checkbox" id="__hideTumblrShop" name="hideTumblrShop" ${configPreferences.hideTumblrShop.value}>
                <label for="__hideTumblrShop">Toggle</label>
              </li>
              <li>
                <span>hide badges</span>
                <input class="configInput" type="checkbox" id="__hideBadges" name="hideBadges" ${configPreferences.hideBadges.value}>
                <label for="__hideBadges">Toggle</label>
              </li>
              <li>
                <span>highlight likely bots in the activity feed</span>
                <input class="configInput" type="checkbox" id="__highlightLikelyBots" name="highlightLikelyBots" ${configPreferences.highlightLikelyBots.value}>
                <label for="__highlightLikelyBots">Toggle</label>
              </li>
              <li>
                <span>show who follows you in the activity feed</span>
                <input class="configInput" type="checkbox" id="__showFollowingLabel" name="showFollowingLabel" ${configPreferences.showFollowingLabel.value}>
                <label for="__showFollowingLabel">Toggle</label>
              </li>
              <li>
                <span>display exact vote counts on poll answers</span>
                <input class="configInput" type="checkbox" id="__displayVoteCounts" name="displayVoteCounts" ${configPreferences.displayVoteCounts.value}>
                <label for="__displayVoteCounts">Toggle</label>
              </li>
              <li>
                <span>disable avatars scrolling with posts</span>
                <input class="configInput" type="checkbox" id="__disableScrollingAvatars" name="disableScrollingAvatars" ${configPreferences.disableScrollingAvatars.value}>
                <label for="__disableScrollingAvatars">Toggle</label>
              </li>
              <li>
                <span>content positioning</span>
                <div class="rangeInput">
                  <input class="configInput" type="range" id="__contentPositioning" name="contentPositioning" list="__cp" min="-${safeOffset}" max="${safeOffset}" step="1" value="${configPreferences.contentPositioning.value}">
                  <datalist id="__cp">
                    <option value="-${safeOffset}" label="left"></option>
                    <option value="0" label="default"></option>
                    <option value="${safeOffset}" label="right"></option>
                  </datalist>
                </div>
              </li>
              <li>
                <span>content width</span>
                <div class="rangeInput">
                  <input class="configInput" type="range" id="__contentWidth" name="contentWidth" list="__cw" min="990" max="${windowWidth}" step="0.5" value="${configPreferences.contentWidth.value}">
                  <datalist id="__cw">
                    <option value="990" label="default"></option>
                    <option value="${windowWidth}" label="full width"></option>
                  </datalist>
                </div>
              </li>
              <li>
                <span>messaging window scale</span>
                <div class="rangeInput">
                  <input class="configInput" type="range" id="__messagingScale" name="messagingScale" list="__mss" min="1" max ="2" step="0.05" value="${configPreferences.messagingScale.value}">
                  <datalist id="__mss">
                    <option value="1" label="1x"></option>
                    <option value="1.5" label="1.5x"></option>
                    <option value="2" label="2x"></option>
                  </datalist>
                </div>
              </li>
            </ul>
            <li class="infoHeader" style="flex-flow: column wrap">
              <span style="width: 100%;">advanced configuration</span>
              <span style="width: 100%; font-size: .8em;">requires a page reload</span>
            </li>
            <ul id="__cta">
              <li>
                <span>disable tumblr live</span>
                <input class="configInput" type="checkbox" id="__disableTumblrLive" name="disableTumblrLive" ${configPreferences.disableTumblrLive.value}>
                <label for="__disableTumblrLive">Toggle</label>
              </li>
              <li>
                <span>disable tumblr domains</span>
                <input class="configInput" type="checkbox" id="__disableTumblrDomains" name="disableTumblrDomains" ${configPreferences.disableTumblrDomains.value}>
                <label for="__disableTumblrDomains">Toggle</label>
              </li>
              <li>
                <span>revert activity feed redesign</span>
                <input class="configInput" type="checkbox" id="__revertActivityFeedRedesign" name="revertActivityFeedRedesign" ${configPreferences.revertActivityFeedRedesign.value}>
                <label for="__revertActivityFeedRedesign">Toggle</label>
              </li>
              <li>
                <span>revert searchbar update</span>
                <input class="configInput" type="checkbox" id="__revertSearchbarRedesign" name="revertSearchbarRedesign" ${configPreferences.revertSearchbarRedesign.value}>
                <label for="__revertSearchbarRedesign">Toggle</label>
              </li>
              <li>
                <span>enable customizable dashboard tabs</span>
                <input class="configInput" type="checkbox" id="__enableCustomTabs" name="enableCustomTabs" ${configPreferences.enableCustomTabs.value}>
                <label for="__enableCustomTabs">Toggle</label>
              </li>
              <li>
                <span>enable adding polls to reblogs</span>
                <input class="configInput" type="checkbox" id="__enableReblogPolls" name="enableReblogPolls" ${configPreferences.enableReblogPolls.value}>
                <label for="__enableReblogPolls">Toggle</label>
              </li>
              <li>
                <span>disable "post without tags" nag</span>
                <input class="configInput" type="checkbox" id="__disableTagNag" name="disableTagNag" ${configPreferences.disableTagNag.value}>
                <label for="disableTagNag">Toggle</label>
              </li>
              <li>
                <span>re-add unread post notifications to the corner of the home icon</span>
                <input class="configInput" type="checkbox" id="__reAddHomeNotifications" name="reAddHomeNotifications" ${configPreferences.reAddHomeNotifications.value}>
                <label for="__reAddHomeNotifications">Toggle</label>
              </li>
              <li>
                <span>show hidden NSFW posts in the timeline</span>
                <input class="configInput" type="checkbox" id="__showNsfwPosts" name="showNsfwPosts" ${configPreferences.showNsfwPosts.value}>
                <label for="__showNsfwPosts">Toggle</label>
              </li>
            </ul>
          </div>
        </div>
      `);
      const initializePreferences = () => {
        const containerSelector = `${keyToCss("bluespaceLayout")} > ${keyToCss("container")}`;

        mutationManager.start(fixHeader, postSelector);

        waitFor(keyToCss("recommendedBlogs")).then(() => {
          toggle(find($a(keyToCss("sidebarItem")), keyToCss("recommendedBlogs")), !configPreferences.hideRecommendedBlogs.value);
        });
        waitFor(keyToCss("radar")).then(() => {
          toggle(find($a(keyToCss("sidebarItem")), keyToCss("radar")), !configPreferences.hideTumblrRadar.value);
        });
        if (isDashboard()) {
          waitFor(keyToCss("timelineHeader")).then(() => {
            toggle($(keyToCss("timelineHeader")), !configPreferences.hideDashboardTabs.value);
          });
        };
        waitFor(keyToCss("menuRight")).then(() => {
          toggle(find($a(keyToCss("menuContainer")), 'use[href="#managed-icon__explore"]'), !configPreferences.hideExplore.value);
          toggle(find($a(keyToCss("menuContainer")), 'use[href="#managed-icon__shop"]'), !configPreferences.hideTumblrShop.value);
        });
        if (configPreferences.highlightLikelyBots.value || configPreferences.showFollowingLabel.value) {
          mutationManager.start(scanNotes, noteSelector);
        };
        const pollStyle = document.createElement("style");
        pollStyle.id = "__ps";
        document.head.appendChild(pollStyle);
        if (configPreferences.displayVoteCounts.value) {
          mutationManager.start(detailPolls, answerSelector);
          pollStyle.innerText = `
            ${keyToCss("pollAnswerPercentage")} { position: relative; bottom: 4px; }
            ${keyToCss("results")} { overflow: hidden; }
          `;
        };
        const badgeStyle = document.createElement("style");
        badgeStyle.id = "__bs";
        document.head.append(badgeStyle);
        if (configPreferences.hideBadges.value) {
          badgeStyle.innerText = `${keyToCss("badgeContainer")} { display: none; }`;
        };
        if (matchPathname() && notMasonry()) {
          waitFor(containerSelector).then(() => {
            css($(containerSelector), { "left": `${configPreferences.contentPositioning.value}px`, "max-width": `${configPreferences.contentWidth.value}px` });
          });
          const gridStyle = document.createElement("style");
          gridStyle.id = "__gs";
          document.head.append(gridStyle);
          if (configPreferences.contentWidth.value > 51.5 && pathname === "likes") {
            waitFor(keyToCss("gridded")).then(() => {
              const gridWidth = $(keyToCss("gridded")).clientWidth;
              const gridItemWidth = Math.fround(100 / Math.round(gridWidth / 178));
              gridStyle.innerText = `${keyToCss("gridTimelineObject")} { width: calc(${gridItemWidth}% - 2px) !important; }`;
            });
          };
        };
        const messagingStyle = document.createElement("style");
        messagingStyle.id = "__ms";
        document.head.append(messagingStyle);
        messagingStyle.innerText = `
          ${keyToCss("conversationWindow")} { 
            width: calc(280px * ${configPreferences.messagingScale.value}); 
            height: calc(450px * ${configPreferences.messagingScale.value});
          }
        `;
        const avatarStyle = document.createElement("style");
        avatarStyle.id = "__as";
        document.head.append(avatarStyle);
        if (configPreferences.disableScrollingAvatars.value) {
          avatarStyle.innerText = `${keyToCss("stickyContainer")} > ${keyToCss("avatar")} { position: static !important; }`;
        }
        
        observer.observe(target, { childList: true, subtree: true });
      };
      const setupButtons = () => {
        $("#__cb").addEventListener("click", () => {
          if ($("#__c").style.display === "none") {
            $("#__cb svg").style.setProperty("--icon-color-primary", "rgb(var(--white-on-dark))");
          } else $("#__cb svg").style.setProperty("--icon-color-primary", "rgba(var(--white-on-dark),.65)");
          toggle($("#__c"));
        });
        $("#__ab").addEventListener("click", () => {
          if ($("#__a").style.display === "none") {
            $("#__ab svg").style.setProperty("--icon-color-primary", "rgb(var(--white-on-dark))");
          } else $("#__ab svg").style.setProperty("--icon-color-primary", "rgba(var(--white-on-dark),.65)");
          toggle($("#__a"));
        });
        $("#__co").addEventListener("click", () => {
          const configExport = new Blob([JSON.stringify(configPreferences, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(configExport);
          const exportLink = document.createElement("a");
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
        $("#__ci").addEventListener("click", () => {
          const input = document.createElement("input");
          input.id = "__cii";
          input.type = "file";
          input.accept = "application/json";
          input.addEventListener("change", async function () {
            const [file] = this.files;

            if (file) {
              let msg;
              let obj = await file.text();
              obj = JSON.parse(obj);
              if (typeof obj === "object" && obj.lastVersion) {
                configPreferences = obj;
                updatePreferences();
                console.info("imported preferences from file!");
                msg = $str(`<span id="__im">successfully imported preferences from file!</span>`);
                document.getElementById("__cio").append(msg);
                await delay(100);
                css(msg, { "opacity": "1" });
                await delay(3000);
                css(msg, { "opacity": "0" });
                await delay(700);
                msg.remove();
              } else {
                console.error("failed to import preferences from file!");
                msg = $str(`<span id="__im">failed to import preferences from file!</span>`);
                document.getElementById("__cio").append(msg);
                await delay(100);
                css(msg, { "opacity": "1" });
                await delay(3000);
                css(msg, { "opacity": "0" });
                await delay(700);
                msg.remove();
              }
            }
          });
          input.click();
        });
        $a(".configInput").forEach(currentValue => {currentValue.addEventListener("change", event => {
          if (event.target.attributes.getNamedItem("type").value === "checkbox") {
            configPreferences[event.target.attributes.getNamedItem("name").value].value = event.target.matches(":checked") ? "checked" : "";
            checkboxEvent(event.target.id, event.target.matches(":checked"));
          } else {
            configPreferences[event.target.attributes.getNamedItem("name").value].value = event.target.valueAsNumber;
            rangeEvent(event.target.id, event.target.valueAsNumber);
          };
          updatePreferences();
        })});
      };
      const unfuck = async function () {
        if (!initialChecks()) return;

        const menu = configMenu(version);
        pathname = location.pathname.split("/")[1];

        requestAnimationFrame(() => {
          document.head.appendChild(styleElement);
          followingAsDefault();
          if (matchPathname()) {
            waitFor(keyToCss("sidebar")).then(() => {
              waitFor(keyToCss("sidebarContent")).then(() => {
                hide($(keyToCss("sidebarContent")));
              });
              $(keyToCss("sidebar")).insertBefore(menu, $(`${keyToCss("sidebar")} aside`));
              if (configPreferences.lastVersion !== version) {
                $("#__in").append($str("<span class='__n'>new!</span>"));
                $("#__cb").append($str("<span class='__n'></span>"));
                $("#__ab").append($str("<span class='__n'></span>"));
                $("#__in").addEventListener("click", () => {$a(".__n").forEach(value => hide(value))});
                configPreferences.lastVersion = version;
                updatePreferences();
              };
              setupButtons();
            });
          };
          initializePreferences();
        });
        console.log("dashboard fixed!");
      };

      console.info(JSON.parse(atob(state.obfuscatedFeatures)));
      console.info(featureSet);

      unfuck();

      window.addEventListener("resize", () => {
        windowWidth = window.innerWidth;
        safeOffset = (windowWidth - 1000) / 2;
        $("#__contentPositioning").attributes.getNamedItem("min").value = `-${safeOffset}`;
        $("#__contentPositioning").attributes.getNamedItem("max").value = `${safeOffset}`;
        $("#__contentWidth").attributes.getNamedItem("max").value = `${windowWidth}`;
        $("#__cp").innerHTML = `
          <option value="-${safeOffset}" label="left"></option>
          <option value="0" label="default"></option>
          <option value="${safeOffset}" label="right"></option>
        `;
        $("#__cw").innerHTML = `
          <option value="990" label="default"></option>
          <option value="${windowWidth}" label="full width"></option>
        `;
      });
      window.tumblr.on('navigation', () => window.setTimeout(() => {
        unfuck().then(() => {
          window.setTimeout(() => {
            if (!$a("#__m").length) unfuck();
          }, 400)
        }).catch((e) =>
          window.setTimeout(unfuck, 400)
        )}, 400
      ));
    });
  });
};
const { nonce } = [...document.scripts].find(script => script.getAttributeNames().includes("nonce")) || "";
const script = $(`
  <script id="__u" nonce="${nonce}">
    const unfuckDashboard = ${main.toString()};
    unfuckDashboard();
  </script>
`);
if ($("head").length === 0) {
  const newNodes = [];
  const findHead = () => {
    const nodes = newNodes.splice(0);
    if (nodes.length !== 0 && (nodes.some(node => node.matches("head") || node.querySelector("head") !== null))) {
      const head = nodes.find(node => node.matches("head"));
      $(head).append(script);
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
} else $(document.head).append(script);