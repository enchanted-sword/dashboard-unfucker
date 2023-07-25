// ==UserScript==
// @name         dashboard unfucker
// @version      1.9
// @description  no more shitty twitter ui for pc
// @author       dragongirlsnout
// @match        https://www.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @downloadURL  https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker.js
// @updateURL    https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker.js
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// ==/UserScript==

/* globals tumblr */

'use strict';

getUtilities().then(({ keyToClasses, keyToCss, tr }) => {

    var $ = window.jQuery;

    var $styleElement = $("<style id='__s'>");
    $styleElement.appendTo("html");
    $styleElement.text(`
        ${keyToCss("startChildWrapper")} + ${keyToCss("navInfo")} { display: none !important; }
        #__h {
            display: flex;
            margin: auto;
            max-width: 1716px;
            padding: 0 20px 0;
            align-items: center;
            height: 55px;
        }
        ${keyToCss("createPost")} {
            width: 44px;
            margin-left: 10px;
        }
        ${keyToCss("createPost")} > a {
            border-radius: 3px !important;
            padding: 5px 12px !important;
        }
        ${keyToCss("navigationLinks")} svg { scale: 1.4; }
        ${keyToCss("navigationLinks")} {
            display: flex;
            flex-basis: 100%;
            margin: 0;
        }
        ${keyToCss("navigationLinks")} > ${keyToCss("navItem")} { border: none !important; }
        @media (max-width: 980px) {
            ${keyToCss("logoContainer")} {
                scale: 0.75;
                padding: 16px 16px 0px;
            }
            ${keyToCss("navigationLinks")} {
                justify-content: center;
            }
            ${keyToCss("mobileLayout")} {
                display: flex;
                justify-content: center;
            }
        }

        @media (min-width: 990px) {
            ${keyToCss("searchSidebarItem")} {
                max-width: 550px;
                height: unset;
                padding: 0 8px;
            }
            ${keyToCss("navigation")} { border: none; }
            ${keyToCss("post")} ${keyToCss("stickyContainer")} ${keyToCss("avatar")}${keyToCss("newDesktopLayout")} {
                top: calc(70px + var(--dashboard-tabs-header-height,0px))
            }
            ${keyToCss("searchShadow")} { background: none; }
            ${keyToCss("blogTile")} { list-style-type: none; }
            ${keyToCss("subNav")} {
                background: RGB(var(--white));
                scrollbar-color: rgba(var(--black),.4)rgba(var(--white),.1);
                color: RGB(var(--black));
                position: absolute;
                border-radius: 4px;
                margin-top: 48px;
            }
            ${keyToCss("bluespaceLayout")} > ${keyToCss("newDesktopLayout")} {
                border: none !important;
                margin-top: 40px;
            }
            ${keyToCss("navigationLinks")} {
                justify-content: flex-end;
            }
            ${keyToCss("notificationBadgeIn")} { top: -70% !important; }
            ${keyToCss("timelineHeader")} { border: none; }
            ${keyToCss("mainContentWrapper")} {
                min-width: unset !important;
                flex-basis: unset !important;
            }
            ${keyToCss("main")} { border: none !important; }
            ${keyToCss("navigationWrapper")} { display: none !important; }
            ${keyToCss("navSubHeader")} {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: rgba(var(--black),.07);
                height: 36px;
                padding: 4px 12px 4px 12px;
                color: rgba(var(--black),.65);
            }
            ${keyToCss("navSubHeader")} a { text-decoration: none; }
            ${keyToCss("navSubHeader")} + ul {
                width: 100%;
                padding: 0 !important;
            }
            ${keyToCss("timelineHeaderNavInner")} { "justify-content", "center"; }
            ${keyToCss("sidebar")} {
                margin-left: 30px !important;
                position: sticky;
                top: 54px;
                height: fit-content;
            }
            ${keyToCss("sidebar")} aside { width: 320px; }
            ${keyToCss("about")}${keyToCss("inSidebar")}${keyToCss("usesNewDimensions")} {
                position: fixed;
                height: 20px;
                bottom: 0;
            }
            ${keyToCss("searchbarContainer")} {
                padding: 0;
                border: none;
                margin: 0;
            }
            #account_subnav {
                height: 85vh;
                width: 240px;
                overflow-y: scroll;
                overscroll-behavior: none;
                scrollbar-width: thin;
            }
            #settings_subnav {
                height: fit-content;
                z-index: 1;
                top: 96px;
                left: 8px;
                border: 2px solid rgba(var(--black),.14);
            }
            ${keyToCss("subNav")} * { color: RGB(var(--black)) !important; }
            ${keyToCss("subNav")} ${keyToCss("endChildWrapper")} { color: rgba(var(--black),.65) !important; }
            ${keyToCss("subNav")} > ${keyToCss("navItem")}, ${keyToCss("accountStats")} li {
                list-style-type: none;
                border-bottom: 1px solid rgba(var(--black),.07);
            }
            ${keyToCss("subNav")} use { --icon-color-primary: rgba(var(--black),.65) }
            ${keyToCss("subNav")} > ${keyToCss("navItem")}:hover, ${keyToCss("accountStats")} li:hover {
                background-color: rgba(var(--black),.07);
            }
            ${keyToCss("subNav")} svg { scale: 1; }
            ${keyToCss("navInfo")} ${keyToCss("childWrapper")} {
                display: flex;
                align-items: center;
            }
            #settings_button ${keyToCss("navLink")} { justify-content: flex-start; }
            ${keyToCss("heading")} {
                position: sticky;
                top: 0;
                height: 36px;
                background: RGB(var(--white));
                z-index: 1;
                padding: 5px 20px 5px 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: .875rem;
                color: rgba(var(--black),.65) !important;
                line-height: 1.5;
                box-sizing: border-box;
            }
            ${keyToCss("heading")}::before {
                position: absolute;
                top: 0;
                right: 0;
                width: 100%;
                height: 36px;
                content: "";
                background: rgba(var(--black),.07)
            }
            ${keyToCss("childWrapper")} > svg {
                margin-right: 10px;
            }
            @media (max-width: 1150px) {
                ${keyToCss("navItem")} ${keyToCss("buttonInner")} { padding: 8px 16px !important; }
            }
        }
    `);

    const waitFor = (selector, retried = 0) => new Promise(resolve => {
        $(selector).length
            ? resolve()
            : retried < 25 && requestAnimationFrame(() => waitFor(selector, retried + 1).then(resolve));
    });

    function newSearch () {
        console.log("no search bar found, creating new search bar");
        var $search = $(`
            <div class="${keyToClasses("searchSidebarItem").join(" ")}" style="max-width: 550px; width: 100%;" >
                <div class="${keyToClasses("formContainer").join(" ")}">
                <span data-testid="controlled-popover-wrapper" class="${keyToClasses("targetWrapper").join(" ")}">
                    <span class="${keyToClasses("targetWrapper").join(" ")}">
                    <form method="GET" action="/search" role="search" class="${keyToClasses("form").join(" ")}">
                        <div class="${keyToClasses("searchbarContainer").join(" ")}">
                        <div class="${keyToClasses("searchIcon").join(" ")}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" role="presentation" >
                            <use href="#managed-icon__search"></use>
                             </svg>
                        </div>
                        <input
                            name="q"
                            type="text"
                            autocomplete="off"
                            aria-label="${tr("Search")}"
                            class="${keyToClasses("searchbar").join(" ")}"
                            placeholder="Search Tumblr"
                            autocapitalize="sentences"
                            value=""
                        />
                        </div>
                    </form>
                    </span>
                </span>
                </div>
            </div>
        `);
        $("#__h").append($search);
    }

    async function $unfuck ($styleElement) {
        if ($(keyToCss("headerWrapper")).length) {
            console.log("no need to unfuck");
            if (!$("#__h").length) {$("#__s").remove()}
            return
        }
        if (["/dashboard", "/"].includes(location.pathname) && $(keyToCss("timeline")).attr("data-timeline") === "/v2/tabs/for_you") {
            window.tumblr.navigate("/dashboard/following");
            return
        }
        else {console.log("unfucking dashboard...")}

        if (!$(keyToCss("navigationLinks")).length) {
            console.log("page not loaded, retrying...");
            throw "page not loaded";
        }
        var match = [
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
                    "reblog",
                    "edit"
                    ];
        var $nav = $(keyToCss("navigationLinks")).eq(0);
        var $content = ""
        var $main = $(keyToCss("newDesktopLayout")).eq(0);
        var $bar = $("<nav>", {class: keyToClasses("headerWrapper").join(" "), id: "__hw"});
        var $header = $("<header>", {id: "__h"});
        var $logo = $(keyToCss("logoContainer")).eq(0);
        var $create = $(keyToCss("createPost")).eq(0);
        var $heading = $(`<div class=${keyToClasses("heading").join(" ")}><h3>Account</h3></div>`);
        var $likeIcon = $(`<svg xmlns="http://www.w3.org/2000/svg" height="18" width="20" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);"><use href="#managed-icon__like-filled"></use></svg>`);
        var $followingIcon = $(`<svg xmlns="http://www.w3.org/2000/svg" height="21" width="20" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);"><use href="#managed-icon__following"></use></svg>`);
        var $starIcon = $(`<svg xmlns="http://www.w3.org/2000/svg" height="21" width="20" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);"><use href="#managed-icon__star-outline"></use></svg>`);
        var $helpIcon = $(`<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);"><use href="#managed-icon__posts-ask"></use></svg>`);
        var $coinsIcon = $(`<svg xmlns="http://www.w3.org/2000/svg" height="21" width="20" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);"><use href="#managed-icon__coins"></use></svg>`);
        var $keyboardIcon = $(`<svg xmlns="http://www.w3.org/2000/svg" height="12" width="20" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);"><use href="#managed-icon__keyboard"></use></svg>`);
        var $paletteIcon = $(`<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);"><use href="#managed-icon__palette"></use></svg>`);
        $create.detach();
        $(keyToCss("bluespaceLayout")).prepend($bar);
        $logo.detach()
        $bar.append($header)
        $header.append($logo);
        if (match.includes(location.pathname.split("/")[1])) {
            waitFor(keyToCss("searchSidebarItem")).then(() => {
                var $search = $(keyToCss("searchSidebarItem")).eq(0);
                $search.insertAfter($logo);
            });
            $content = $(keyToCss("main")).eq(0);
            if (["/dashboard", "/"].includes(location.pathname)) {
                waitFor(keyToCss("timelineOptionsWrapper")).then(() => {
                    if ($(keyToCss("timelineOptionsItemWrapper")).first().has("a[href='/dashboard/stuff_for_you']").length ? true : false) {
                        var $forYou = $(keyToCss("timelineOptionsItemWrapper")).has("a[href='/dashboard/stuff_for_you']");
                        var $following = $(keyToCss("timelineOptionsItemWrapper")).has("a[href='/dashboard/following']");
                        $forYou.insertAfter($following);
                    }
                });
            }

        }
        else {
            $content = $(`${keyToCss("mainContentWrapper")} ${keyToCss("container")}`).eq(0);
            newSearch();
        }
        if (["search", "tagged"].includes(location.pathname.split("/")[1])) {
            $content.css("max-width", "fit-content");
        }
        $header.append($nav);
        $header.append($create);
        $main.prepend($content)
        var $navItems = $nav.children();
        $navItems.has('use[href="#managed-icon__explore"]')
            .add($navItems.has('use[href="#managed-icon__shop"]'))
            .add($navItems.has('use[href="#managed-icon__live-video"]'))
            .add($navItems.has('use[href="#managed-icon__earth"]'))
            .add($navItems.has('use[href="#managed-icon__sparkle"]'))
            .css("display", "none");
        var $home = $navItems.has('use[href="#managed-icon__home"]');
        var $inbox = $navItems.has('use[href="#managed-icon__mail"]');
        var $messages = $navItems.has('use[href="#managed-icon__messaging"]');
        $inbox.insertAfter($home);
        $messages.insertAfter($inbox);
        var $subnav = $(keyToCss("subNav"));
        $create.find("a").eq(0).html('<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" role="presentation"><use href="#managed-icon__post"></use></svg>');
        $(document).on("click", (x) => {
            if ($(`${keyToCss("subNav")}:hover`).length) {return}
            if ($subnav.eq(0).attr("hidden") ? false : true) {
                document.getElementById("account_button").click();
            }
            if ($subnav.eq(1).attr("hidden") ? false : true) {
                document.getElementById("settings_button").click();
            }
        });
        var $accountSubnav = $("#account_subnav");
        $accountSubnav.prepend($heading);
        $heading.append($(keyToCss("logoutButton")));
        $(`a[href="/likes"] ${keyToCss("childWrapper")}`).prepend($likeIcon);
        $(`a[href="/following"] ${keyToCss("childWrapper")}`).prepend($followingIcon);
        var $settingsWrapper = $("<li>", {class: `${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}`});
        var $settings = $("#settings_button");
        $settingsWrapper.insertAfter($subnav.children("li").has("span:contains('Following')"));
        $settingsWrapper.append($settings);
        $settings.children("span").eq(0).append("Settings");
        $("#settings_subnav").insertAfter($settings);
        $(`a[href="/changes"] ${keyToCss("childWrapper")}`).prepend($starIcon);
        $(`a[href="/help"] ${keyToCss("childWrapper")}`).prepend($helpIcon);
        $(`a[href="/live/shop"] ${keyToCss("childWrapper")}`).prepend($coinsIcon);
        $(`button span:contains("Keyboard shortcuts")`).eq(0).prepend($keyboardIcon);
        var $paletteWrapper = $("<li>", {class: `${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}`});
        var $palette = $(`button[aria-label="${tr("Change palette")}"]`);
        $paletteWrapper.insertAfter($subnav.children("li").has("span:contains('Keyboard shortcuts')"));
        $paletteWrapper.append($palette);
        $palette.children("span").eq(0).prepend($paletteIcon);
        if (["blog", "likes", "following"].includes(location.pathname.split("/")[1])) { document.getElementById("account_button").click(); }
        $header.append($("<nav>"));
        console.log("dashboard fixed!");
    }

    $unfuck();

    window.tumblr.on('navigation', () => requestAnimationFrame(function() {
        $unfuck().catch((e) => {
            window.setTimeout($unfuck, 400)
        });
    }));
});

async function getUtilities () {
    let retries = 0;
    while (retries++ < 1000 && (typeof tumblr === "undefined" || typeof tumblr.getCssMap === "undefined" || typeof tumblr.languageData === "undefined")) {
        await new Promise((resolve) => setTimeout(resolve));
    }
    const cssMap = await tumblr.getCssMap();
    const keyToClasses = (...keys) => keys.flatMap(key => cssMap[key]).filter(Boolean);
    const keyToCss = (...keys) => `:is(${keyToClasses(...keys).map(className => `.${className}`).join(", ")})`;
    const tr = (string) => `${window.tumblr.languageData.translations[string] || string}`
    return { keyToClasses, keyToCss, tr };
}
