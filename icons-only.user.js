// ==UserScript==
// @name         tumblr icon fix
// @version      1.1
// @description  re-adds icons besides posts and fixes post headers
// @author       dragongirlsnout
// @match        https://www.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @downloadURL  https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/icons-only.user.js
// @updateURL    https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/icons-only.user.js
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// ==/UserScript==

var $ = window.jQuery;
let tr;
let keyToCss;
const postSelector = "[tabindex='-1'][data-id] article";
const newNodes = [];
const target = document.getElementById("root");

const getUtilities = async function () {
  let retries = 0;
  while (retries++ < 1000
    && (typeof unsafeWindow.tumblr === "undefined"
    || typeof unsafeWindow.tumblr.getCssMap === "undefined"
    || typeof unsafeWindow.tumblr.languageData === "undefined")) {
      await new Promise((resolve) => setTimeout(resolve));
  }
  const cssMap = await unsafeWindow.tumblr.getCssMap();
  const keyToClasses = (...keys) => keys.flatMap(key => cssMap[key]).filter(Boolean);
  const keyToCss = (...keys) => `:is(${keyToClasses(...keys).map(className => `.${className}`).join(", ")})`;
  const tr = (string) => `${unsafeWindow.tumblr.languageData.translations[string] || string}`
  return { keyToCss, tr };
};

getUtilities().then(({ keyToCss, tr }) => {
  const $styleElement = $(`
    <style>
      ${keyToCss("navigationWrapper")} {
        position: relative;
        right: 85px;
      }
      ${keyToCss("timelineHeader")} {
        left: -85px;
        width: calc(100% + 85px);
      }
      .__stickyContainer {
        color: RGB(var(--white-on-dark));
        pointer-events: none;
        height: 100%;
        position: absolute;
        left: -85px;
      } 
      .__avatarOuter {
        pointer-events: auto;
        top: calc(20px + var(--dashboard-tabs-header-height,0px));
        transition: top .25s;
        position: -webkit-sticky;
        position: sticky;
      }
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
      .__anonymous {
        background-image: url(/pop/src/assets/images/avatar/anonymous_avatar_40-3af33dc0.png);
        background-size: 100% 100%;
        border-radius: var(--border-radius-small);
      }
    </style>
  `);
  const newAvatar = (blog) => $(`
    <div class="__stickyContainer" data-testid="sticky-avatar-container">
      <div class="__avatarOuter">
        <div class="__avatarWrapper" role="figure" aria-label="${tr("avatar")}">
          <span data-testid="controlled-popover-wrapper" class="__targetWrapper">
            <span class="__targetWrapper">
              <a href="https://${blog}.tumblr.com/" title="${blog}" target="_blank" rel="noopener" role="link" class="__blogLink" tabindex="0">
                <div class="__avatarInner" style="width: 64px; height: 64px;">
                  <div class="__avatarWrapperInner">
                    <div class="__placeholder" style="padding-bottom: 100%;">
                      <img
                      class="__avatarImage"
                      src="https://api.tumblr.com/v2/blog/${blog}/avatar"
                      sizes="64px" 
                      alt="${tr("Avatar")}" 
                      style="width: 64px; height: 64px;" 
                      loading="eager">
                    </div>
                  </div>
                </div>
              </a>
            </span>
          </span>
        </div>
      </div>
    </div>
  `);
  const fixHeader = posts => {
    for (const post of posts) {
      let $post = $(post);
      let $header = $post.find(`header${keyToCss("header")}`);
      let parent = "";
      if (location.pathname.split("/").includes("inbox")
        || location.pathname.split("/").includes("messages")) {
        parent = $header.find(keyToCss("blogLink")).eq(1).text()
          || "anon";
      } else {
        parent = $header.find(keyToCss("blogLink")).eq(0).text()
        || $post.find(`[aria-label="${tr("Reblog")}"]`)?.attr("href").split("/")[2];
      }
      if ($header.find(keyToCss("rebloggedFromName")).length) {
        $header.find(keyToCss("reblogged")).hide();
        let $rebloggedFrom = $header.find(keyToCss("rebloggedFromName"));
        let $reblogIcon = $header.find(keyToCss("reblogIcon"));
        $reblogIcon.css("margin-left", "2px");
        $reblogIcon.insertBefore($rebloggedFrom);
        $rebloggedFrom.css("margin-left", "5px");
      } else if ($header.find(keyToCss("avatar")).length) {
        $header.find(keyToCss("avatar")).hide();
      } else {
        $header.find(keyToCss("reblogged")).hide();
        let $reblogIcon = $header.find(keyToCss("reblogIcon"));
        $reblogIcon.css("margin-left", "2px");
        $reblogIcon.appendTo($header.find(keyToCss("attribution")));
        $header.find($(keyToCss("followButton"))).eq(0).hide();
        let $label = $post.find(keyToCss("label")).eq(0).clone();
        $label.insertAfter($reblogIcon);
        $label.css({display: "inline", marginLeft: "5px"});
        $label.find(keyToCss("attribution")).css("color", "rgba(var(--black),.65)");
      }
      if (parent !== "anon") $post.prepend(newAvatar(parent));
      else {
        $header.find(keyToCss("attribution")).css("font-weight", "bold");
        $post.prepend(
          $(`
            <div class="__stickyContainer" data-testid="sticky-avatar-container">
              <div class="__avatarOuter">
                <figure class="__anonymous" aria-label="${tr("Anonymous avatar")}" style="width: 64px; height: 64px;"></figure>
              </div>
            </div>
          `)
        );
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

  fixHeader($(postSelector));
  $("head").append($styleElement);
  observer.observe(target, { childList: true, subtree: true });
});