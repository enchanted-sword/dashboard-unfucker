// ==UserScript==
// @name         iconfix
// @version      2.1
// @description  fixes tumblr post headers
// @author       dragongirlsnout
// @match        https://www.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @downloadURL  https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/iconfix.user.js
// @updateURL    https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/iconfix.user.js
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

/* globals tumblr */

'use strict';
var $ = window.jQuery;
const main = async function () {
  let state = window.___INITIAL_STATE___;
  const $a = selector => document.querySelectorAll(selector);
  const $str = str => {
    let elem = document.createElement("div");
    elem.innerHTML = str;
    elem = elem.firstElementChild;
    return elem;
  };
  const css = (elem, properties = {}) => {
    for (let property in properties) {
      elem.style[property] = properties[property];
    };
  };
  const hide = elem => {
    if (elem.length) elem.forEach(item => item.style.display = "none");
    else elem.style.display = "none";
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
  const getUtilities = async function () {
    let retries = 0;
    while (retries++ < 1000 && (typeof window.tumblr === "undefined" || typeof window.tumblr.getCssMap === "undefined")) {
      await new Promise((resolve) => setTimeout(resolve));
    }
    const cssMap = await window.tumblr.getCssMap();
    const keyToClasses = (...keys) => keys.flatMap(key => cssMap[key]).filter(Boolean);
    const keyToCss = (...keys) => `:is(${keyToClasses(...keys).map(className => `.${className}`).join(", ")})`;
    return { keyToClasses, keyToCss, };
  };
  const featureSet = [{"name": "reblogRedesignNew", "value": false}];
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
  document.addEventListener("DOMContentLoaded", () => {
    getUtilities().then(({ keyToCss, keyToClasses }) => {
      const postSelector = "[tabindex='-1'][data-id] article";
      const newNodes = [];
      const target = document.getElementById("root");
      const reblogIcon = () => $str(`
        <span class="__reblogIcon">
          <svg xmlns="http://www.w3.org/2000/svg" height="15" width="15" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);">
            <use href="#managed-icon__reblog-compact"></use>
          </svg>
        </span>
      `);
      const fetchNpf = obj => {
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
      const fixHeader = posts => {
        for (const post of posts) {  
          try {
            const { id } = fetchNpf(post);
            post.id = `post${id}`;

            const header = post.querySelector(keyToCss("header"));
            let attribution = header.querySelector(keyToCss("attribution"));
            const reblogParent = attribution.querySelector(keyToCss("targetWrapperInline")).cloneNode(true);
            let rebloggedFrom = attribution.querySelector(keyToCss("rebloggedFromName"));

            if (rebloggedFrom) {
              rebloggedFrom = rebloggedFrom.cloneNode(true);
            } else {
              const labels = post.querySelectorAll(`:scope ${keyToCss("username")} ${keyToCss("label")}`);
              if (labels.length !== 0) {
                rebloggedFrom = labels.item(labels.length - 1).cloneNode(true);
                const classes = keyToClasses("rebloggedFromName");
                rebloggedFrom.classList.add(...classes);
                css(rebloggedFrom.querySelector(keyToCss("attribution")), { "color": "rgba(var(--black),.65)" });
                const follow = rebloggedFrom.querySelector(keyToCss("followButton"));
                if (follow) hide(follow);
              }
            }

            attribution.innerHTML = "";
            attribution.append(reblogParent);
            if (rebloggedFrom) {
              attribution.append(reblogIcon());
              attribution.append(rebloggedFrom);
            }
          } catch (e) {
            console.error("an error occurred processing a post header:", e);
            console.error(post);
            console.error(fetchNpf(post));
          };
        };
      };
      const sortNodes = () => {
        const nodes = newNodes.splice(0);
        if (nodes.length !== 0 && (nodes.some(node => node.matches(postSelector) || node.querySelector(postSelector)))) {
          const posts = [
            ...nodes.filter(node => node.matches(postSelector)),
            ...nodes.flatMap(node => [...node.querySelectorAll(postSelector)])
          ].filter((value, index, array) => index === array.indexOf(value));
          if (posts.length) fixHeader(posts);
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
      const unfuck = async function () {
        requestAnimationFrame(() => {
          observer.observe(target, { childList: true, subtree: true });
          fixHeader(Array.from($a(postSelector)));
        });
        console.log("headers fixed!");
      };
      const style = $str(`
        <style>
          ${keyToCss("main")}${keyToCss("reblogRedesignEnabled")} { max-width: 625px !important; }
          ${keyToCss("tabsHeader")}${keyToCss("reblogRedesignEnabled")} { margin-left: -93px !important ;}
          ${keyToCss("mainContentWrapper")}${keyToCss("reblogRedesignEnabled")} { min-width: 890px !important; flex-basis: 890px !important; }

          article header > ${keyToCss("avatar")} { display: none !important }

          .__reblogIcon {
            height: 14px;
            display: inline-block;
            transform: translateY(3px);
            margin: 0 5px;
          }
        </style>
      `);
      document.head.appendChild(style);

      unfuck();
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
const getNonce = () => {
  const { nonce } = [...document.scripts].find(script => script.getAttributeNames().includes("nonce")) || "";
  return nonce;
}
const script = $(`
  <script id="__u" nonce="${getNonce()}">
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
      script.attr("nonce", getNonce());
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
if (script.attr("nonce") === "") console.error("empty script nonce attribute: script may not inject");