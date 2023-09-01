// ==UserScript==
// @name         dashboard unfucker
// @version      4.1.3
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
const wait = (retried = 0,) => new Promise((resolve) => {
  if ($("head").length) { resolve() } else if (retried < 25) { requestAnimationFrame(() => wait(retried + 1).then(resolve)) }
});
const main = async function () {
  const version = "4.1.3";
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
  let configPreferences = [
    { type: "checkbox", value: "" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "checked" },
    { type: "checkbox", value: "" },
    { type: "checkbox", value: "" },
    { type: "range", value: 0},
    { type: "range", value: 990}
  ];
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
    if ($a(selector).length) { resolve() } else if (retried < 25) { requestAnimationFrame(() => waitFor(selector, retried + 1).then(resolve)) }
  });
  const updatePreferences = () => {
    localStorage.setItem("configPreferences", JSON.stringify(configPreferences))
  };
  const isDashboard = () => ["dashboard", ""].includes(location.pathname.split("/")[1]);
  const notMasonry = () => !["search", "tagged", "explore"].includes(location.pathname.split("/")[1]);
  const getUtilities = async function () {
    let retries = 0;
    while (retries++ < 1000 && (typeof window.tumblr === "undefined" || typeof window.tumblr.getCssMap === "undefined")) {
      await new Promise((resolve) => setTimeout(resolve));
    }
    const cssMap = await window.tumblr.getCssMap();
    const keyToClasses = (...keys) => keys.flatMap(key => cssMap[key]).filter(Boolean);
    const keyToCss = (...keys) => `:is(${keyToClasses(...keys).map(className => `.${className}`).join(", ")})`;
    return { keyToCss, keyToClasses };
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
    if (!localStorage.getItem("configPreferences") || JSON.parse(localStorage.getItem("configPreferences")).length < configPreferences.length) {
      if (!localStorage.getItem("configPreferences")) {
        updatePreferences();
        console.log("initialized preferences");
      } else {
        const oldPreferences = JSON.parse(localStorage.getItem("configPreferences"));
        const diff = oldPreferences.length - configPreferences.length;
        configPreferences = oldPreferences.concat(configPreferences.slice(diff));
      };
    } else {
      configPreferences = JSON.parse(localStorage.getItem("configPreferences"));
      if (configPreferences[20].value < 990) {
        configPreferences[20].value = 990;
        updatePreferences();
      }
    };
  };
  const featureSet = [
    {"name": "redpopDesktopVerticalNav", "value": false},
    {"name": "redpopVirtualScroller", "value": !configPreferences[6].value},
    {"name": "liveCustomMarqueeData", "value": !configPreferences[7].value},
    {"name": "liveStreaming", "value": !configPreferences[7].value},
    {"name": "liveStreamingUserAllowed", "value": !configPreferences[7].value},
    {"name": "liveStreamingUserEnabled", "value": !configPreferences[7].value},
    {"name": "liveStreamingWeb", "value": !configPreferences[7].value},
    {"name": "liveSteamingWebPayments", "value": !configPreferences[7].value},
    {"name": "domainsSettings", "value": !configPreferences[8].value},
    {"name": "activityRedesignM3", "value": !configPreferences[9].value},
    {"name": "messagingRedesign", "value": !configPreferences[10].value},
    {"name": "experimentalBlockEditorIsOnlyEditor", "value": !configPreferences[11].value},
    {"name": "tumblrEditorForceTextPostType", "value": !configPreferences[11].value},
    {"name": "configurableTabbedDash", "value": configPreferences[12].value?true:false},
    {"name": "allowAddingPollsToReblogs", "value": configPreferences[13].value?true:false},
    {"name": "tagSuggestionTwoStepDialog", "value": !configPreferences[14].value},
    {"name": "redpopUnreadNotificationsOnTab", "value": !configPreferences[15].value},
    {"name": "reblogRedesignNew", "value": !configPreferences[16].value},
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
    getUtilities().then(({ keyToCss, keyToClasses }) => {
      let windowWidth = window.innerWidth;
      let safeOffset = (windowWidth - 1000) / 2;
      const postSelector = "[tabindex='-1'][data-id] article";
      const newNodes = [];
      const target = document.getElementById("root");
      const styleElement = $str(`
        <style id='__s'>
          #__m { margin-bottom: 20px; }
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
          button.configReset {
            width: fit-content;
            margin: 8px auto 0;
            padding: 4px 8px;
            background: rgba(var(--black),.07)
          }
          ${keyToCss("navItem")}:has(use[href="#managed-icon__sparkle"]) { display: none !important; }
          ${keyToCss("bluespaceLayout")} > ${keyToCss("container")} { position: relative; }
          ${keyToCss("main")} {
            flex: 1;
            min-width: 0;
            max-width: none !important;
          }
          ${keyToCss("postColumn")} { max-width: calc(100% - 85px); }
          ${keyToCss("post")}, ${keyToCss("post")} > * { max-width: 100%; }
          ${keyToCss("cell")},
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
      const fetchNpf = post => { //shoutout to xkit rewritten for showing me this method
        const fiberKey = Object.keys(post).find(key => key.startsWith("__reactFiber"));
        let fiber = post[fiberKey];
        
        while (fiber !== null) {
          const { timelineObject } = fiber.memoizedProps || {};
          if (timelineObject !== undefined) {
            return timelineObject;
          } else {
            fiber = fiber.return;
          };
        }
      }
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
              const number = formattedNoteCount.attributes.getNamedItem("title").value.split(" ")[0];
              const blackText = formattedNoteCount.querySelector(`:scope ${keyToCss("blackText")}`);
              blackText.innerText = number;
            });
          } catch (e) {
            console.error("an error occurred processing a post's notes:", e);
            console.error(post);
            console.error(fetchNpf(post));
          };
        };
      };
      const sortPosts = () => {
        const nodes = newNodes.splice(0);
        if (nodes.length !== 0 && (nodes.some(node => node.matches(postSelector) || node.querySelector(postSelector) !== null))) {
          const posts = [
            ...nodes.filter(node => node.matches(postSelector)),
            ...nodes.flatMap(node => [...node.querySelectorAll(postSelector)])
          ].filter((value, index, array) => index === array.indexOf(value));
          if (configPreferences[16].value) fixHeader(posts);
          if (configPreferences[17].value) recountNotes(posts);
        }
        else return
      };
      const observer = new MutationObserver(mutations => {
        const nodes = mutations
        .flatMap(({ addedNodes }) => [...addedNodes])
        .filter(node => node instanceof Element)
        .filter(node => node.isConnected);
        newNodes.push(...nodes);
        sortPosts();
      });
      const checkboxEvent = (id, value) => {
        switch (id) {
          case "__c1":
            toggle($(keyToCss("timelineHeader")), !value);
            break;
          case "__c2":
            toggle(find($a(keyToCss("sidebarItem")), keyToCss("recommendedBlogs")), !value);
            break;
          case "__c3":
            toggle(find($a(keyToCss("sidebarItem")), keyToCss("radar")), !value);
            break;
          case "__c4":
            toggle(find($a(keyToCss("menuContainer")), 'use[href="#managed-icon__explore"]'), !value);
            break;
          case "__c5":
            toggle(find($a(keyToCss("menuContainer")), 'use[href="#managed-icon__shop"]'), !value);
            break;
          case "__c19":
            if (configPreferences[18].value) {
              document.getElementById("__bs").innerText = `${keyToCss("badgeContainer")} { display: none; }`;
            } else { document.getElementById("__bs").innerText = "" };
            break;
        }
      };
      const rangeEvent = (id, value) => {
        if (matchPathname() && notMasonry()) {
          const posOffset = $("#__c20").valueAsNumber;
          const widthOffset = ($("#__c21").valueAsNumber - 990) / 2;
          let safeMax = Math.max(safeOffset - widthOffset, 0);
          if (Math.abs(posOffset) > safeMax) {
            safeMax = posOffset > 0 ? safeMax : -safeMax;
            $("#__c20").value = safeMax.toString();
            css($(`${keyToCss("bluespaceLayout")} > ${keyToCss("container")}`), { "left": `${safeMax}px`});
            configPreferences[19].value = safeMax;
            if (id === "__c21") css($(`${keyToCss("bluespaceLayout")} > ${keyToCss("container")}`), { "max-width": `${value}px`});
          } else {
            switch (id) {
              case "__c20":
                css($(`${keyToCss("bluespaceLayout")} > ${keyToCss("container")}`), { "left": `${value}px`});
                break;
              case "__c21":
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
            throw "navigating tabs";
          } else if (isDashboard) {
            waitFor(keyToCss("timelineOptionsItemWrapper")).then(() => {
              if ($a(keyToCss("timelineOptionsItemWrapper"))[0].querySelectorAll("a[href='/dashboard/stuff_for_you']").length) {
                let forYou = find($(keyToCss("timelineOptionsItemWrapper")), "a[href='/dashboard/stuff_for_you']");
                let following = find($(keyToCss("timelineOptionsItemWrapper")), "a[href='/dashboard/following']");
                forYou.before(following);
              }
            });
          }
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
                <input class="configInput" type="checkbox" id="__c1" name="0" ${configPreferences[0].value}>
              </li>
              <li>
                <span>hide recommended blogs</span>
                <input class="configInput" type="checkbox" id="__c2" name="1" ${configPreferences[1].value}>
              </li>
              <li>
                <span>hide tumblr radar</span>
                <input class="configInput" type="checkbox" id="__c3" name="2" ${configPreferences[2].value}>
              </li>
              <li>
                <span>hide explore</span>
                <input class="configInput" type="checkbox" id="__c4" name="3" ${configPreferences[3].value}>
              </li>
              <li>
                <span>hide tumblr shop</span>
                <input class="configInput" type="checkbox" id="__c5" name="4" ${configPreferences[4].value}>
              </li>
              <li>
                <span>hide badges</span>
                <input class="configInput" type="checkbox" id="__c19" name="18" ${configPreferences[18].value}>
              </li>
              <li>
                <span>content positioning</span>
                <div class="rangeInput">
                  <input class="configInput" type="range" id="__c20" name="19" list="__cp" min="-${safeOffset}" max="${safeOffset}" step="1" value="${configPreferences[19].value}">
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
                  <input class="configInput" type="range" id="__c21" name="20" list="__cw" min="990" max="${windowWidth}" step="0.5" value="${configPreferences[20].value}">
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
                <input class="configInput" type="checkbox" id="__c7" name="6" ${configPreferences[6].value}>
              </li>
              <li>
                <span>disable tumblr live</span>
                <input class="configInput" type="checkbox" id="__c8" name="7" ${configPreferences[7].value}>
              </li>
              <li>
                <span>disable tumblr domains</span>
                <input class="configInput" type="checkbox" id="__c9" name="8" ${configPreferences[8].value}>
              </li>
              <li>
                <span>revert activity feed redesign</span>
                <input class="configInput" type="checkbox" id="__c10" name="9" ${configPreferences[9].value}>
              </li>
              <li>
                <span>revert messaging redesign</span>
                <input class="configInput" type="checkbox" id="__c11" name="10" ${configPreferences[10].value}>
              </li>
              <li>
                <span>allow legacy post editor</span>
                <input class="configInput" type="checkbox" id="__c12" name="11" ${configPreferences[11].value}>
              </li>
              <li>
                <span>enable customizable dashboard tabs</span>
                <input class="configInput" type="checkbox" id="__c13" name="12" ${configPreferences[12].value}>
              </li>
              <li>
                <span>enable adding polls to reblogs</span>
                <input class="configInput" type="checkbox" id="__c14" name="13" ${configPreferences[13].value}>
              </li>
              <li>
                <span>disable "post without tags" nag</span>
                <input class="configInput" type="checkbox" id="__c15" name="14" ${configPreferences[14].value}>
              </li>
              <li>
                <span>re-add unread post notifications to the corner of the home icon</span>
                <input class="configInput" type="checkbox" id="__c16" name="15" ${configPreferences[15].value}>
              </li>
              <li>
                <span>revert post header changes</span>
                <input class="configInput" type="checkbox" id="__c17" name="16" ${configPreferences[16].value}>
              </li>
              <li>
                <span>display full note counts</span>
                <input class="configInput" type="checkbox" id="__c18" name="17" ${configPreferences[17].value}>
              </li>
            </ul>
          </div>
        </div>
      `);
      const initializePreferences = () => {
        const containerSelector = `${keyToCss("bluespaceLayout")} > ${keyToCss("container")}`;
        if(isDashboard()) {
          waitFor(keyToCss("timelineHeader")).then(() => {
            toggle($(keyToCss("timelineHeader")), !configPreferences[0].value);
          });
          waitFor(keyToCss("recommendedBlogs")).then(() => {
            toggle(find($a(keyToCss("sidebarItem")), keyToCss("recommendedBlogs")), !configPreferences[1].value);
          });
          waitFor(keyToCss("radar")).then(() => {
            toggle(find($a(keyToCss("sidebarItem")), keyToCss("radar")), !configPreferences[2].value);
          });
        };
        waitFor(keyToCss("menuRight")).then(() => {
          toggle(find($a(keyToCss("menuContainer")), 'use[href="#managed-icon__explore"]'), !configPreferences[3].value);
          toggle(find($a(keyToCss("menuContainer")), 'use[href="#managed-icon__shop"]'), !configPreferences[4].value);
        });
        if (configPreferences[7].value) {
          $("#__s").innerText +=`${keyToCss("navItem")}:has(use[href="#managed-icon__earth"]) { display: none !important; }`;
        };
        if (configPreferences[16].value || configPreferences[17].value) {
          observer.observe(target, { childList: true, subtree: true });
        }
        if (configPreferences[16].value) {
          fixHeader(Array.from($a(postSelector)));
        };
        if (configPreferences[17].value) {
          recountNotes(Array.from($a(postSelector)));
        };
        const badgeStyle = document.createElement("style");
        badgeStyle.id = "__bs";
        document.head.appendChild(badgeStyle);
        if (configPreferences[18].value) {
          badgeStyle.innerText = `${keyToCss("badgeContainer")} { display: none; }`;
        };
        if (matchPathname() && notMasonry()) {
          waitFor(containerSelector).then(() => {
            css($(containerSelector), { "left": `${configPreferences[19].value}px`, "max-width": `${configPreferences[20].value}px` });
          });
          const gridStyle = document.createElement("style");
          gridStyle.id = "__gs";
          document.head.appendChild(gridStyle);
          if (configPreferences[20].value > 51.5 && location.pathname.split("/")[1] === "likes") {
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
                  configPreferences[Number(event.target.attributes.getNamedItem("name").value)].value = event.target.matches(":checked") ? "checked" : "";
                  checkboxEvent(event.target.id, event.target.matches(":checked"));
                } else {
                  configPreferences[Number(event.target.attributes.getNamedItem("name").value)].value = event.target.valueAsNumber;
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
        $("#__c20").attributes.getNamedItem("min").value = `-${safeOffset}`;
        $("#__c20").attributes.getNamedItem("max").value = `${safeOffset}`;
        $("#__c21").attributes.getNamedItem("max").value = `${windowWidth}`;
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
      window.tumblr.on('navigation', () => window.setTimeout(
        unfuck().then(() => {
          window.setTimeout(() => {
            if (!$a("#__m").length) unfuck();
          }, 400)
        }).catch((e) => 
          window.setTimeout(unfuck, 400)
        ), 400
      ));
    });
  });
};
const { nonce } = [...document.scripts].find(script => script.getAttributeNames().includes("nonce")) || "";
const script = $(`
  <script nonce="${nonce}">
    const unfuckDashboard = ${main.toString()};
    unfuckDashboard();
  </script>
`);
wait().then(() => $("head").append(script));
