// ==UserScript==
// @name         dashboard unfucker
// @version      4.4.2
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
  const version = "4.4.2";
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
    disableVirtualScroller: { type: "checkbox", value: "" },
    disableTumblrLive: { type: "checkbox", value: "checked" },
    disableTumblrDomains: { type: "checkbox", value: "checked" },
    revertActivityFeedRedesign: { type: "checkbox", value: "checked" },
    revertMessagingRedesign: { type: "checkbox", value: "checked" },
    revertSearchbarRedesign: { type: "checkbox", value: "checked" },
    enableCustomTabs: { type: "checkbox", value: "" },
    enableReblogPolls: { type: "checkbox", value: "" },
    disableTagNag: { type: "checkbox", value: "checked" },
    reAddHomeNotifications: { type: "checkbox", value: "checked" },
    displayFullNoteCounts: { type: "checkbox", value: "" }
  };
  const $a = selector => document.querySelectorAll(selector);
  const $ = selector => document.querySelector(selector);
  const $str = str => {
    let elem = document.createElement("div");
    elem.innerHTML = str;
    elem = elem.firstElementChild;
    return elem;
  };
  const hide = elem => {elem.style.display = "none"};
  const show = elem => {elem.style.display = null};
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
  const matchPathname = () => match.includes(location.pathname.split("/")[1]);
  const isDashboard = () => ["dashboard", ""].includes(location.pathname.split("/")[1]);
  const notMasonry = () => !["search", "tagged", "explore"].includes(location.pathname.split("/")[1]);
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
  const featureSet = [
    {"name": "redpopDesktopVerticalNav", "value": false},
    {"name": "redpopVirtualScroller", "value": !configPreferences.disableVirtualScroller.value},
    {"name": "liveCustomMarqueeData", "value": !configPreferences.disableTumblrLive.value},
    {"name": "liveStreaming", "value": !configPreferences.disableTumblrLive.value},
    {"name": "liveStreamingUserAllowed", "value": !configPreferences.disableTumblrLive.value},
    {"name": "liveStreamingUserEnabled", "value": !configPreferences.disableTumblrLive.value},
    {"name": "liveStreamingWeb", "value": !configPreferences.disableTumblrLive.value},
    {"name": "liveSteamingWebPayments", "value": !configPreferences.disableTumblrLive.value},
    {"name": "domainsSettings", "value": !configPreferences.disableTumblrDomains.value},
    {"name": "activityRedesignM3", "value": !configPreferences.revertActivityFeedRedesign.value},
    {"name": "messagingRedesign", "value": !configPreferences.revertMessagingRedesign.value},
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
            margin: 4px;
            padding: 0;
            background: RGB(var(--white));
            border-radius: 3px;
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
          li.infoHeader {
            background: rgba(var(--black),.07);
            padding: 12px 12px;
            font-weight: bold;
          }
          .rangeInput {
            width: 160px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .rangeInput datalist {
            display: flex;
            justify-content: space-between;
          }
          
          .customLabelContainer[label="Possible Bot"]::after {
            content: "about";
            border-bottom: 1px solid #ff252f;
            font-size: 12px;
            margin-left: 5px;
          }
          .customLabelInfo {
            visibility: hidden;
            opacity: 0;
            width: 240px;
            background-color: inherit;
            color: rgb(var(--black));
            text-align: center;
            padding: 2px;
            border-radius: var(--border-radius-small);
            position: absolute;
            z-index: 1;
            top: 24px;
            left: 0;
            transition: opacity 0.5s;
            white-space: initial;
          }
          .customLabelContainer:hover .customLabelInfo {
            visibility: visible;
            opacity: 1;
          }

          #tumblr { --dashboard-tabs-header-height: 0px !important; }
          ${keyToCss("navItem")}:has(use[href="#managed-icon__sparkle"]) { display: none !important; }
          ${keyToCss("bluespaceLayout")} > ${keyToCss("container")} { position: relative; }
          ${keyToCss("main")} {
            position: relative;
            top: -100px;
            flex: 1;
            min-width: 0;
            max-width: none !important;
          }
          ${keyToCss("bar")} {
            top: 100px;
            margin-bottom: 120px;
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
        </style>
      `);
      const labelContainer = (label, color, backgroundColor, icon, desc) => $str(`
        <div class="customLabelContainer ${keyToClasses("generalLabelContainer").join(" ")}" label="${label}" style="margin-left: 5px; color: #${color}; background-color: #${backgroundColor};">
          ${label}
          <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" class="${keyToClasses("secondaryIconContainer").join(" ")}" role="presentation" style="--icon-color-primary: #${color};">
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
      const recountNotes = posts => {
        for (const post of posts) {
          const { id } = fetchNpf(post);
          post.id = `post${id}`;
          try {
            waitFor(`#post${id} ${keyToCss("formattedNoteCount")}`).then(() => {
              const formattedNoteCount = post.querySelector(`:scope ${keyToCss("formattedNoteCount")}`);
              const title = formattedNoteCount.attributes.getNamedItem("title").value.split(" ")
              const number = title[0];
              const descriptor = title[1];
              const blackText = formattedNoteCount.querySelector(`:scope ${keyToCss("blackText")}`);
              blackText.innerText = number;
              formattedNoteCount.childNodes[0].nodeValue = descriptor;
              css(formattedNoteCount, { "overflowWrap": "normal"});
            });
          } catch (e) {
            console.error("an error occurred processing a post's notes:", e);
            console.error(post);
            console.error(fetchNpf(post));
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
                  css(note, { "backgroundColor": "rgba(255,37,47,.15)" });
                  note.querySelector(keyToCss("blogLinkUserAttribution")).append(labelContainer("Possible Bot", "ff252f", "ffe7e7", "warning-circle", "This blog may be a bot; block at your own discretion. This feature is a component of dashboard unfucker"));
                };
              });
            };
            if (configPreferences.showFollowingLabel.value && followingYou && !mutuals && !note.querySelector(".customLabelContainer")) {
              note.querySelector(keyToCss("blogLinkUserAttribution")).append(labelContainer("Follows You", "2552ff", "e7fcff", "profile-checkmark", "This blog follows you. This feature is a component of dashboard unfucker"));
            };
          } catch (e) {
            console.error("an error occurred processing a notification:", e);
            console.error(note);
            console.error(fetchNote(note));
          };
        };
      };
      const sortNodes = () => {
        const nodes = newNodes.splice(0);
        if (nodes.length !== 0 && (nodes.some(node => node.matches(postSelector) || node.querySelector(postSelector) !== null)
          || nodes.some(node => node.matches(noteSelector) ||  node.querySelector(noteSelector) !== null))) {
          const posts = [
            ...nodes.filter(node => node.matches(postSelector)),
            ...nodes.flatMap(node => [...node.querySelectorAll(postSelector)])
          ].filter((value, index, array) => index === array.indexOf(value));
          const notes = [
            ...nodes.filter(node => node.matches(noteSelector)),
            ...nodes.flatMap(node => [...node.querySelectorAll(noteSelector)])
          ].filter((value, index, array) => index === array.indexOf(value));
          fixHeader(posts);
          if (configPreferences.displayFullNoteCounts.value) recountNotes(posts);
          if (configPreferences.highlightLikelyBots.value) scanNotes(notes);
        }
        else return
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
            if (configPreferences.hideBadges.value) {
              document.getElementById("__bs").innerText = `${keyToCss("badgeContainer")} { display: none; }`;
            } else { document.getElementById("__bs").innerText = "" };
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
            };
          };
          if (location.pathname.split("/")[1] === "likes") {
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
            <ul id="__am">
              <li class="infoHeader">
                <span>about</span>
              </li>
              <li>
                <a target="_blank" href="https://github.com/enchanted-sword/dashboard-unfucker">source</a>
              </li>
              <li>
                <a target="_blank" href="https://github.com/enchanted-sword/dashboard-unfucker/blob/main/changelog.md">changelog</a>
              </li>
              <li>
                <a target="_blank" href="https://github.com/enchanted-sword/dashboard-unfucker/issues/new?labels=bug&projects=&template=bug_report.md&title=">report a bug</a>
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
            <ul id="__ct">
              <li class="infoHeader">
                <span>general configuration</span>
              </li>
              <li>
                <span>hide dashboard tabs</span>
                <input class="configInput" type="checkbox" id="__hideDashboardTabs" name="hideDashboardTabs" ${configPreferences.hideDashboardTabs.value}>
              </li>
              <li>
                <span>hide recommended blogs</span>
                <input class="configInput" type="checkbox" id="__hideRecommendedBlogs" name="hideRecommendedBlogs" ${configPreferences.hideRecommendedBlogs.value}>
              </li>
              <li>
                <span>hide tumblr radar</span>
                <input class="configInput" type="checkbox" id="__hideTumblrRadar" name="hideTumblrRadar" ${configPreferences.hideTumblrRadar.value}>
              </li>
              <li>
                <span>hide explore</span>
                <input class="configInput" type="checkbox" id="__hideExplore" name="hideExplore" ${configPreferences.hideExplore.value}>
              </li>
              <li>
                <span>hide tumblr shop</span>
                <input class="configInput" type="checkbox" id="__hideTumblrShop" name="hideTumblrShop" ${configPreferences.hideTumblrShop.value}>
              </li>
              <li>
                <span>hide badges</span>
                <input class="configInput" type="checkbox" id="__hideBadges" name="hideBadges" ${configPreferences.hideBadges.value}>
              </li>
              <li>
                <span>highlight likely bots in the activity feed</span>
                <input class="configInput" type="checkbox" id="__highlightLikelyBots" name="highlightLikelyBots" ${configPreferences.highlightLikelyBots.value}>
              </li>
              <li>
                <span>show who follows you in the activity feed</span>
                <input class="configInput" type="checkbox" id="__showFollowingLabel" name="showFollowingLabel" ${configPreferences.showFollowingLabel.value}>
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
              </ul>
              <ul id="__cta">
                <li class="infoHeader" style="flex-flow: column wrap">
                <span style="width: 100%;">advanced configuration</span>
                <span style="width: 100%; font-size: .8em;">requires a page reload</span>
              </li>
              <li>
                <span>disable "virtual scroller" experiment</span>
                <input class="configInput" type="checkbox" id="__disableVirtualScroller" name="disableVirtualScroller" ${configPreferences.disableVirtualScroller.value}>
              </li>
              <li>
                <span>disable tumblr live</span>
                <input class="configInput" type="checkbox" id="__disableTumblrLive" name="disableTumblrLive" ${configPreferences.disableTumblrLive.value}>
              </li>
              <li>
                <span>disable tumblr domains</span>
                <input class="configInput" type="checkbox" id="__disableTumblrDomains" name="disableTumblrDomains" ${configPreferences.disableTumblrDomains.value}>
              </li>
              <li>
                <span>revert activity feed redesign</span>
                <input class="configInput" type="checkbox" id="__revertActivityFeedRedesign" name="revertActivityFeedRedesign" ${configPreferences.revertActivityFeedRedesign.value}>
              </li>
              <li>
                <span>revert messaging redesign</span>
                <input class="configInput" type="checkbox" id="__revertMessagingRedesign" name="revertMessagingRedesign" ${configPreferences.revertMessagingRedesign.value}>
              </li>
              <li>
                <span>revert searchbar update</span>
                <input class="configInput" type="checkbox" id="__revertSearchbarRedesign" name="revertSearchbarRedesign" ${configPreferences.revertSearchbarRedesign.value}>
              </li>
              <li>
                <span>enable customizable dashboard tabs</span>
                <input class="configInput" type="checkbox" id="__enableReCustomTabs" name="enableCustomTabs" ${configPreferences.enableCustomTabs.value}>
              </li>
              <li>
                <span>enable adding polls to reblogs</span>
                <input class="configInput" type="checkbox" id="__enableReblogPolls" name="enableReblogPolls" ${configPreferences.enableReblogPolls.value}>
              </li>
              <li>
                <span>disable "post without tags" nag</span>
                <input class="configInput" type="checkbox" id="__disableTagNag" name="disableTagNag" ${configPreferences.disableTagNag.value}>
              </li>
              <li>
                <span>re-add unread post notifications to the corner of the home icon</span>
                <input class="configInput" type="checkbox" id="__reAddHomeNotifications" name="reAddHomeNotifications" ${configPreferences.reAddHomeNotifications.value}>
              </li>
              <li>
                <span>display full note counts</span>
                <input class="configInput" type="checkbox" id="__displayFullNoteCounts" name="displayFullNoteCounts" ${configPreferences.displayFullNoteCounts.value}>
              </li>
            </ul>
          </div>
        </div>
      `);
      const initializePreferences = () => {
        const containerSelector = `${keyToCss("bluespaceLayout")} > ${keyToCss("container")}`;

        fixHeader(Array.from($a(postSelector)));
        waitFor(keyToCss("recommendedBlogs")).then(() => {
          toggle(find($a(keyToCss("sidebarItem")), keyToCss("recommendedBlogs")), !configPreferences.hideRecommendedBlogs.value);
        });
        waitFor(keyToCss("radar")).then(() => {
          toggle(find($a(keyToCss("sidebarItem")), keyToCss("radar")), !configPreferences.hideTumblrRadar.value);
        });
        if(isDashboard()) {
          waitFor(keyToCss("timelineHeader")).then(() => {
            toggle($(keyToCss("timelineHeader")), !configPreferences.hideDashboardTabs.value);
          });
        };
        waitFor(keyToCss("menuRight")).then(() => {
          toggle(find($a(keyToCss("menuContainer")), 'use[href="#managed-icon__explore"]'), !configPreferences.hideExplore.value);
          toggle(find($a(keyToCss("menuContainer")), 'use[href="#managed-icon__shop"]'), !configPreferences.hideTumblrShop.value);
        });
        if (configPreferences.disableTumblrLive.value) {
          $("#__s").innerText +=`${keyToCss("navItem")}:has(use[href="#managed-icon__earth"]) { display: none !important; }`;
        };
        if (configPreferences.highlightLikelyBots.value || configPreferences.showFollowingLabel.value || configPreferences.displayFullNoteCounts.value) {
          observer.observe(target, { childList: true, subtree: true });
        }
        if (configPreferences.highlightLikelyBots.value || configPreferences.showFollowingLabel.value) {
          scanNotes(Array.from($a(noteSelector)));
        }
        if (configPreferences.displayFullNoteCounts.value) {
          recountNotes(Array.from($a(postSelector)));
        };
        const badgeStyle = document.createElement("style");
        badgeStyle.id = "__bs";
        document.head.appendChild(badgeStyle);
        if (configPreferences.hideBadges.value) {
          badgeStyle.innerText = `${keyToCss("badgeContainer")} { display: none; }`;
        };
        if (matchPathname() && notMasonry()) {
          waitFor(containerSelector).then(() => {
            css($(containerSelector), { "left": `${configPreferences.contentPositioning.value}px`, "max-width": `${configPreferences.contentWidth.value}px` });
          });
          const gridStyle = document.createElement("style");
          gridStyle.id = "__gs";
          document.head.appendChild(gridStyle);
          if (configPreferences.contentWidth.value > 51.5 && location.pathname.split("/")[1] === "likes") {
            waitFor(keyToCss("gridded")).then(() => {
              const gridWidth = $(keyToCss("gridded")).clientWidth;
              const gridItemWidth = Math.fround(100 / Math.round(gridWidth / 178));
              gridStyle.innerText = `${keyToCss("gridTimelineObject")} { width: calc(${gridItemWidth}% - 2px) !important; }`;
            });
          };
        };
      };
      const unfuck = async function () {
        if (!initialChecks()) return;

        const menu = configMenu(version);

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
            });
          };
          initializePreferences();
        });
        console.log("dashboard fixed!");
      };

      console.log(featureSet);
      console.log(JSON.parse(atob(state.obfuscatedFeatures)));
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
