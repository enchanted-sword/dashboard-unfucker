// ==UserScript==
// @name         iconfix
// @version      2.3
// @description  fixes tumblr post headers
// @author       dragongirlsnout
// @match        https://www.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @downloadURL  https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/iconfix.user.js
// @updateURL    https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/iconfix.user.js
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

/* globals tumblr */

'use strict';
var $ = window.jQuery;
const main = async function () {
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
    const tr = string => `${window.tumblr.languageData.translations[string] || string}`;
    return { keyToClasses, keyToCss, tr };
  };
  
  getUtilities().then(({ keyToCss, keyToClasses, tr }) => {
    const state = window.___INITIAL_STATE___
    const userName = state.queries.queries[0].state.data.user.name;

    const postSelector = '[tabindex="-1"][data-id] article';
    const postHeaderTargetSelector = `[data-timeline]:not([data-timeline*='posts/'],${keyToCss('masonry')}) [tabindex='-1'][data-id] article:not(.ΘΔavatarFixed)`;
    const newNodes = [];
    const target = document.getElementById("root");

    const userAvatar = name => $str(`
      <div class="ΘΔavatarOuter">
        <div class="ΘΔavatarWrapper" role="figure" aria-label="${tr("avatar")}">
          <span class="ΘΔtargetWrapper">
            <a href="https://${name}.tumblr.com/" title="${name}" target="_blank" rel="noopener" role="link" class="ΘΔblogLink" tabindex="0">
              <div class="ΘΔavatarInner" style="width: 64px; height: 64px;">
                <div class="ΘΔavatarWrapperInner">
                  <div class="ΘΔplaceholder" style="padding-bottom: 100%;">
                    <img
                    class="ΘΔavatarImage"
                    src="https://api.tumblr.com/v2/blog/${name}/avatar"
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
    const addUserPortrait = () => {
      const bar = $(`${keyToCss('postColumn')} > ${keyToCss('bar')}`);
      if (bar) {
        const userAvatarWrapper = $str('<div class="ΘΔuserAvatarWrapper"></div>');
        bar.prepend(userAvatarWrapper);
        userAvatarWrapper.append(userAvatar(userName));
        userAvatarWrapper.querySelector('.ΘΔblogLink').addEventListener('click', () => window.tumblr.navigate(`/${userName}`));
      }
    };
    const fixHeaderAvatar = posts => {
      for (const post of posts) {
        try {
          const stickyContainer = $str(`<div class="ΘΔstickyContainer"></div>`);
          const avatar = post.querySelector(`header > ${keyToCss('avatar')}`);

          post.prepend(stickyContainer);
          stickyContainer.append(avatar);
          post.classList.add('ΘΔavatarFixed');
        } catch (e) {
          console.error('an error occurred processing a post avatar:', e);
          console.error(post);
          console.error(fetchNpf(post));
        }
      }
    };
    const reblogIcon = () => $str(`
      <span class="ΘΔreblogIcon">
        <svg xmlns="http://www.w3.org/2000/svg" height="15" width="15" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);">
          <use href="#managed-icon__reblog-compact"></use>
        </svg>
      </span>
    `);
    const fixHeader = posts => {
      for (const post of posts) {
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
          if (rebloggedFrom && !header.querySelector('.ΘΔreblogIcon')) {
            rebloggedFrom.before(reblogIcon());
          }

          post.classList.add('ΘΔheaderFixed');
        } catch (e) {
          console.error('an error occurred processing a post header:', e);
          console.error(post);
          console.error(fetchNpf(post));
        }
      }
    };
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

    const sortNodes = () => {
      const nodes = newNodes.splice(0);
      if (nodes.length !== 0 && (nodes.some(node => node.matches(postSelector) || node.querySelector(postSelector)))) {
        const posts = [
          ...nodes.filter(node => node.matches(postSelector)),
          ...nodes.flatMap(node => [...node.querySelectorAll(postSelector)])
        ].filter((value, index, array) => index === array.indexOf(value));
        if (posts.length) fixHeader(posts);
      }
      if (nodes.length !== 0 && (nodes.some(node => node.matches(postHeaderTargetSelector) || node.querySelector(postHeaderTargetSelector)))) {
        const posts = [
          ...nodes.filter(node => node.matches(postHeaderTargetSelector)),
          ...nodes.flatMap(node => [...node.querySelectorAll(postHeaderTargetSelector)])
        ].filter((value, index, array) => index === array.indexOf(value));
        if (posts.length) fixHeaderAvatar(posts);
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

    const style = $str(`
      <style>
        div:not(${keyToCss('mainContentIsMasonry')}) > div > ${keyToCss("main")}${keyToCss("reblogRedesignEnabled")} { max-width: 625px !important; }
        ${keyToCss("tabsHeader")} { margin-left: -93px !important ;}
        ${keyToCss("mainContentWrapper")}${keyToCss("reblogRedesignEnabled")} { min-width: 890px !important; flex-basis: 890px !important; }

        [data-timeline]:not([data-timeline*='posts/'],${keyToCss('masonry')}) [tabindex='-1'][data-id] article.ΘΔheaderFixed header ${keyToCss('communityLabel')} { display: none !important; }

        .ΘΔreblogIcon {
          height: 14px;
          display: inline-block;
          transform: translateY(3px);
          margin: 0 5px;
        }

        .ΘΔuserAvatarWrapper {
          top: 0;
          position: absolute;
          left: -84px;
        }
        .ΘΔuserAvatarWrapper > .ΘΔavatarOuter {
          position: absolute !important;
          top: 0 !important;
        }
        .ΘΔstickyContainer {
          color: RGB(var(--white-on-dark));
          height: 100%;
          position: absolute;
          left: -84px;
        }
        .ΘΔstickyContainer > ${keyToCss('avatar')} {
          position: sticky;
          top: 18px;
          transition: top .25s;
        }
        .ΘΔstickyContainer ${keyToCss('blogLink')} > ${keyToCss('avatar')},
          .ΘΔstickyContainer ${keyToCss('blogLink')} > ${keyToCss('avatar')} img,
          .ΘΔstickyContainer ${keyToCss('anonymous')} {
          width: 64px !important;
          height: 64px !important;
        }
        .ΘΔstickyContainer ${keyToCss('blogLink')} > ${keyToCss('subavatar')},
          .ΘΔstickyContainer ${keyToCss('blogLink')} > ${keyToCss('subavatar')} img {
          width: 24px !important;
          height: 24px !important;
        }
        .ΘΔstickyContainer ${keyToCss('badge')} { display: none; }
        .ΘΔavatarOuter {
          position: sticky;
          top: 18px;
          transition: top .25s;
        }
        .ΘΔavatarWrapper { position: relative; }
        .ΘΔblogLink {
          cursor: pointer;
          word-break: break-word;
          text-decoration: none;
        }
        .ΘΔtargetWrapper {
          width: inherit;
          vertical-align: top;
          display: inline-block;
        }
        .ΘΔavatarInner { position: relative; }
        .ΘΔavatarWrapperInner {
          border-radius: var(--border-radius-small);
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .ΘΔplaceholder {
          width: 100%;
          line-height: 0;
          position: relative;
        }
        .ΘΔavatarImage {
          position: absolute;
          top: 0;
          left: 0;
          object-fit: cover;
          visibility: visible;
        }
      </style>
    `);

    const unfuck = async function () {
      requestAnimationFrame(() => {
        observer.observe(target, { childList: true, subtree: true });
        fixHeader(Array.from($a(postSelector)));
        fixHeaderAvatar(Array.from($a(postHeaderTargetSelector)));

        addUserPortrait();

        document.head.appendChild(style);
      });
      console.log("icons fixed!");
    };

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