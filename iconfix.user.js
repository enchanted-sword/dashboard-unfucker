// ==UserScript==
// @name         iconfix
// @version      2.0
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
  const hide = elem => {elem.style.display = "none"};
  const css = (elem, properties = {}) => {
    for (let property in properties) {
      elem.style[property] = properties[property];
    };
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
            };
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
        sortNodes();
      });
      const unfuck = async function () {
        requestAnimationFrame(() => {
          observer.observe(target, { childList: true, subtree: true });
          fixHeader(Array.from($a(postSelector)));
        });
        console.log("dashboard fixed!");
      };
      let style = document.createElement("div");
      style.innerHTML = `
        <style>
          ${keyToCss("main")}${keyToCss("reblogRedesignEnabled")} { max-width: 625px !important; }
          ${keyToCss("tabsHeader")}${keyToCss("reblogRedesignEnabled")} { margin-left: -93px !important ;}
          ${keyToCss("mainContentWrapper")}${keyToCss("reblogRedesignEnabled")} { min-width: 890px !important; flex-basis: 890px !important; }
        </style>
      `;
      style = style.firstElementChild;
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
