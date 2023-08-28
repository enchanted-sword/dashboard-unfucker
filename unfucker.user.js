// ==UserScript==
// @name         dashboard unfucker
// @version      3.6.6
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
  const version = "3.6.6";
  const updateSrc = "https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker.user.js";
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
  let featureSet = [
    {"name": "redpopDesktopVerticalNav", "value": false},
    {"name": "redpopVirtualScroller", "value": false},
    {"name": "liveCustomMarqueeData", "value": false},
    {"name": "liveStreaming", "value": false},
    {"name": "liveStreamingUserAllowed", "value": false},
    {"name": "liveStreamingUserEnabled", "value": false},
    {"name": "liveStreamingWeb", "value": false},
    {"name": "liveSteamingWebPayments", "value": false},
    {"name": "domainsSettings", "value": false},
    {"name": "activityRedesignM3", "value": false},
    {"name": "messagingRedesign", "value": false},
    {"name": "experimentalBlockEditorIsOnlyEditor", "value": false},
    {"name": "tumblrEditorForceTextPostType", "value": false},
    {"name": "configurableTabbedDash", "value": true},
    {"name": "allowAddingPollsToReblogs", "value": true},
    {"name": "tagSuggestionTwoStepDialog", "value": false},
    {"name": "redpopUnreadNotificationsOnTab", "value": false},
    {"name": "reblogRedesignNew", "value": false},
    {"name": "crowdsignalPollsNpf", "value": true},
    {"name": "crowdsignalPollsCreate", "value": true},
    {"name": "adFreeCtaBanner", "value": false}
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
  }
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
    let obf = JSON.parse(atob(obfuscatedFeatures)); // convert from base64, parse from string
    for (let x of featureSet) {
      console.log(x);
      obf[x.name] = x.value;
    }
    console.log(obf);
    return btoa(JSON.stringify(obf)); // compress back to string, convert to base64
  };
  const waitFor = (selector, retried = 0,) => new Promise((resolve) => {
    if ($a(selector).length) { resolve() } else if (retried < 25) { requestAnimationFrame(() => waitFor(selector, retried + 1).then(resolve)) }
  });
  const updatePreferences = (arr) => {
    localStorage.setItem("configPreferences", JSON.stringify(arr))
  };
  const isDashboard = () => ["dashboard", ""].includes(location.pathname.split("/")[1]);
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

  if (storageAvailable("localStorage")
    && localStorage.getItem("configPreferences")
    && JSON.parse(localStorage.getItem("configPreferences")).length === 17) {
    featureSet = [{"name": "adFreeCtaBanner", "value": false}]
    let pref = JSON.parse(localStorage.getItem("configPreferences"));
    featureSet = [
      {"name": "redpopDesktopVerticalNav", "value": !pref[5].value},
      {"name": "redpopVirtualScroller", "value": !pref[6].value},
      {"name": "liveCustomMarqueeData", "value": !pref[7].value},
      {"name": "liveStreaming", "value": !pref[7].value},
      {"name": "liveStreamingUserAllowed", "value": !pref[7].value},
      {"name": "liveStreamingUserEnabled", "value": !pref[7].value},
      {"name": "liveStreamingWeb", "value": !pref[7].value},
      {"name": "liveSteamingWebPayments", "value": !pref[7].value},
      {"name": "domainsSettings", "value": !pref[8].value},
      {"name": "activityRedesignM3", "value": !pref[9].value},
      {"name": "messagingRedesign", "value": !pref[10].value},
      {"name": "experimentalBlockEditorIsOnlyEditor", "value": !pref[11].value},
      {"name": "tumblrEditorForceTextPostType", "value": !pref[11].value},
      {"name": "configurableTabbedDash", "value": pref[12].value?true:false},
      {"name": "allowAddingPollsToReblogs", "value": pref[13].value?true:false},
      {"name": "tagSuggestionTwoStepDialog", "value": !pref[14].value},
      {"name": "redpopUnreadNotificationsOnTab", "value": !pref[15].value},
      {"name": "reblogRedesignNew", "value": !pref[16].value},
      {"name": "crowdsignalPollsNpf", "value": true},
      {"name": "crowdsignalPollsCreate", "value": true},
      {"name": "adFreeCtaBanner", "value": false}
    ];
  };
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
  waitFor("head").then(() => {
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
    document.head.appendChild(style);
  });

  document.addEventListener("DOMContentLoaded", () => {
    getUtilities().then(({ keyToCss }) => {
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
          ${keyToCss("navItem")}:has(use[href="#managed-icon__sparkle) { display: none !important; }
        </style>
      `);
      const fixHeader = posts => {
        for (const post of posts) {
          const header = post.querySelector(`:scope header${keyToCss("header")}`);
          if (!header.querySelector(`:scope ${keyToCss("rebloggedFromName")}`)
          && header.querySelector(`:scope ${keyToCss("reblogIcon")}`)) {
            hide(header.querySelector(`:scope ${keyToCss("followButton")}`));
            let label = post.querySelector(`:scope ${keyToCss("label")}`).cloneNode(true);
            header.querySelector(`:scope ${keyToCss("reblogIcon")}`).after(label);
            css(label, { "display": "inline", "marginLeft": "5px" });
            css(label.querySelector(`:scope ${keyToCss("attribution")}`), { "color": "rgba(var(--black),.65)" });
          }
        }
      };
      const sortPosts = () => {
        const nodes = newNodes.splice(0);
        if (nodes.length !== 0 && (nodes.some(node => node.matches(postSelector) || node.querySelector(postSelector) !== null))) {
          const posts = [
            ...nodes.filter(node => node.matches(postSelector)),
            ...nodes.flatMap(node => [...node.querySelectorAll(postSelector)])
          ].filter((value, index, array) => index === array.indexOf(value));
          fixHeader(posts);
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
          case "__c6":
            $("#__c11,#__c17").click();
            toggle($("#__c11").parentElement, value);
            toggle($("#__c17").parentElement, value);
          break;
        }
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
      const getPreferences = () => {
        let preferences = [
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
          { type: "checkbox", value: "checked" }
        ];
        if (storageAvailable("localStorage")) {
          if (!localStorage.getItem("configPreferences") || JSON.parse(localStorage.getItem("configPreferences")).length < preferences.length) {
            updatePreferences(preferences);
            console.log("initialized preferences");
          } else {
            preferences = JSON.parse(localStorage.getItem("configPreferences"));
          };
        };
        return preferences;
      };
      const configMenu = (version, updateSrc, configPreferences) => $str(`
        <div id="__m">
          <div id="__in">
            <h1>dashboard unfucker v${version}a</h1>
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
              <li style="flex-flow: column wrap">
                <span style="width: 100%;">version: <b>v${version}a</b></span><br>
                <span style="width: 100%;">type "<b>a</b>" uses window property feature toggles. if you persistently encounter errors with the script, try type <b>\"b\"</b></span>
              </li>
              <li>
                <a target="_blank" href="https://github.com/enchanted-sword/dashboard-unfucker">source</a>
              </li>
              <li>
                <a target="_blank" href="https://github.com/enchanted-sword/dashboard-unfucker/issues/new?labels=bug&projects=&template=bug_report.md&title=">report a bug</a>
              </li>
              <li>
                <a target="_blank" href="${updateSrc}">update</a>
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
              </ul>
              <ul id="__cta">
                <li class="infoHeader" style="flex-flow: column wrap">
                <span style="width: 100%;">advanced configuration</span>
                <span style="width: 100%; font-size: .8em;">requires a page reload</span>
              </li>
              <li>
                <span>revert vertical nav layout</span>
                <input class="configInput" type="checkbox" id="__c6" name="5" ${configPreferences[5].value}>
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
            </ul>
          </div>
        </div>
      `);
      const initializePreferences = (pref) => {
        if(isDashboard()) {
          waitFor(keyToCss("timelineHeader")).then(() => {
            toggle($(keyToCss("timelineHeader")), !pref[0].value);
          });
          waitFor(keyToCss("recommendedBlogs")).then(() => {
            toggle(find($a(keyToCss("sidebarItem")), keyToCss("recommendedBlogs")), !pref[1].value);
          });
          waitFor(keyToCss("radar")).then(() => {
            toggle(find($a(keyToCss("sidebarItem")), keyToCss("radar")), !pref[2].value);
          });
        };
        waitFor(keyToCss("menuRight")).then(() => {
          toggle(find($a(keyToCss("menuContainer")), 'use[href="#managed-icon__explore"]'), !pref[3].value);
          toggle(find($a(keyToCss("menuContainer")), 'use[href="#managed-icon__shop"]'), !pref[4].value);
        });
        if (!$("#__c6").matches(":checked")) {
          hide($("#__c11").parentElement);
          hide($("#__c17").parentElement);
          if ($("#__c11").matches(":checked")) $("#__c11").click();
          if ($("#__c17").matches(":checked")) $("#__c17").click();
        }
        if ($("#__c8").matches(":checked")) {
          $("#__s").innerText =`
            ${$("#__s").innerText}
            ${keyToCss("navItem")}:has(use[href="#managed-icon__earth"]) { display: none !important; }
          `;
        };
        if ($("#__c17").matches(":checked")) {
          fixHeader(Array.from($a(postSelector)));
          observer.observe(target, { childList: true, subtree: true });
        };
      };
      const unfuck = async function () {
        if (!initialChecks()) return;

        let configPreferences = getPreferences();
        const menu = configMenu(version, updateSrc, configPreferences);

        document.documentElement.appendChild(menu);
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
        $a(".configInput").forEach(currentValue => {currentValue.addEventListener("change", (event) => {
          configPreferences[Number(event.target.attributes.getNamedItem("name").value)].value = event.target.matches(":checked") ? "checked" : "";
          checkboxEvent(event.target.id, event.target.matches(":checked"));
          updatePreferences(configPreferences);
        })});
        requestAnimationFrame(() => {
          document.head.appendChild(styleElement);
          initializePreferences(configPreferences);
          followingAsDefault();
          if (matchPathname()) {
            waitFor(keyToCss("sidebar")).then(() => {
              $(keyToCss("sidebar")).insertBefore(menu, $(`${keyToCss("sidebar")} aside`));
            });
          };
          if (!storageAvailable("localStorage")) {
            hide($("#__cta"));
          }
        });
        console.log("dashboard fixed!");
      }
      
      unfuck();
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
$("head").append(script);