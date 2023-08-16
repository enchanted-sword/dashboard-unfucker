// ==UserScript==
// @name         dashboard unfucker
// @version      3.3.0
// @description  no more shitty twitter ui for pc
// @author       dragongirlsnout
// @match        https://www.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @downloadURL  https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker-noflags.user.js
// @updateURL    https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker-noflags.user.js
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// ==/UserScript==

/* globals tumblr */

'use strict';

const version = "3.3.0";
const type = "b"
const updateSrc = "https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker-noflags.user.js"
const pathname = location.pathname.split("/")[1];

const storageAvailable = (type) => { //thanks mdn web docs!
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
                e.code === 22 ||
                e.code === 1014 ||
                e.name === "QuotaExceededError" ||
                e.name === "NS_ERROR_DOM_QUOTA_REACHED"
            ) &&
            storage &&
            storage.length !== 0
        );
    }
}

var $ = window.jQuery;

const waitFor = (selector, retried = 0,) => new Promise((resolve) => {
    if ($(selector).length) { resolve() } else if (retried < 25) { requestAnimationFrame(() => waitFor(selector, retried + 1).then(resolve)) }
});

const updatePreferences = (arr) => {
    localStorage.setItem("configPreferences", JSON.stringify(arr))
}

getUtilities().then(({ keyToClasses, keyToCss, tr }) => {

    var $styleElement = $("<style id='__s'>");
    $styleElement.appendTo("html");
    $styleElement.text(`
        #__h {
            display: flex;
            margin: auto;
            max-width: 1716px;
            padding: 0 20px 0;
            align-items: center;
            height: 55px;
        }
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
        ${keyToCss("addFreeCtaBanner")} { display: none !important; }
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
            ${keyToCss("tabsHeader")} { margin-top: 0 !important; }
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
                overflow-x: hidden;
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
            ${keyToCss("subNav")} a,${keyToCss("subNav")} ${keyToCss("childWrapper")},${keyToCss("subNav")} ${keyToCss("blogName")} { color: RGB(var(--black)) !important; }
            ${keyToCss("subNav")} ${keyToCss("endChildWrapper")},${keyToCss("subNav")} ${keyToCss("count")},${keyToCss("reorderButton")},${keyToCss("subNav")} ${keyToCss("blogTitle")} { color: rgba(var(--black),.65) !important; }
            ${keyToCss("navSubHeader")} a { color: rgba(var(--black),.65) !important; }
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
            ${keyToCss("startChildWrapper")} + ${keyToCss("navInfo")}:not(.__subnavItem div) {
                display: none !important;
            }
            #settings_button_new ${keyToCss("navLink")} { justify-content: flex-start; }
            ${keyToCss("heading")} {
                position: sticky;
                top: 0;
                height: 36px;
                width: 240px !important;
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
                background: rgba(var(--black),.07);
                pointer-events: none;
            }
            ${keyToCss("childWrapper")} > svg {
                margin-right: 10px;
            }
            @media (max-width: 1150px) {
                ${keyToCss("navItem")} ${keyToCss("buttonInner")} { padding: 8px 16px !important; }
            }
        }
    `);

    function newSearch() {
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

    function checkboxEvent(id, value) {
        if (id === "__c1") {
            $(keyToCss("timelineHeader")).toggle(!value);
        }
        else if (id === "__c2") {
            $(keyToCss("sidebarItem")).has(keyToCss("recommendedBlogs")).toggle(!value);
        }
        else if (id === "__c3") {
            $(keyToCss("sidebarItem")).has(keyToCss("radar")).toggle(!value);
        }
        else if (id === "__c4") {
            $(keyToCss("navItem")).has('use[href="#managed-icon__explore"]').toggle(!value);
        }
        else if (id === "__c5") {
            $(keyToCss("navItem")).has('use[href="#managed-icon__shop"]').toggle(!value);
        }
        else if (id === "__c6") {
            $(keyToCss("navItem")).has('use[href="#managed-icon__live-video"]')
                .add($(keyToCss("navItem")).has('use[href="#managed-icon__coins"]'))
                .add($(keyToCss("listTimelineObject")).has(keyToCss("liveMarqueeTitle"))).toggle(!value);
        }
        else if (id === "__c7") {
            $(keyToCss("navItem")).has('use[href="#managed-icon__earth"]').toggle(!value);
        }
        else if (id === "__c8") {
            $(keyToCss("navItem")).has('use[href="#managed-icon__sparkle"]').toggle(!value);
        }
    }
    async function $unfuck() {
        if ($(keyToCss("headerWrapper")).length) {
            console.log("no need to unfuck");
            if (!$("#__h").length) { $("#__s").remove() }
            return
        } else if (["/dashboard", "/"].includes(pathname) && $(keyToCss("timeline")).attr("data-timeline").split("?")[0] === "/v2/tabs/for_you") {
            window.tumblr.navigate("/dashboard/following");
            console.log("navigating to following");
            throw "navigating tabs";
        } else if (!$(keyToCss("navigationLinks")).length) {
            console.log("page not loaded, retrying...");
            throw "page not loaded";
        } else { console.log("unfucking dashboard...") }
        var configPreferences = [
            { type: "checkbox", value: "checked" },
            { type: "checkbox", value: "checked" },
            { type: "checkbox", value: "checked" },
            { type: "checkbox", value: "checked" },
            { type: "checkbox", value: "checked" },
            { type: "checkbox", value: "checked" },
            { type: "checkbox", value: "checked" },
            { type: "checkbox", value: "checked" },
            { type: "range", value: "0" }
        ];
        if (storageAvailable("localStorage")) {
            if (!localStorage.getItem("configPreferences") || JSON.parse(localStorage.getItem("configPreferences")).length < 9) {
                updatePreferences(configPreferences)
            }
            else {
                configPreferences = JSON.parse(localStorage.getItem("configPreferences"));
            }
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
            "reblog"
        ];
        var $nav = $(keyToCss("navigationLinks")).eq(0);
        var $content = ""
        var $main = $(keyToCss("newDesktopLayout")).eq(0);
        var $bar = $("<nav>", { class: keyToClasses("headerWrapper").join(" "), id: "__hw" });
        var $header = $("<header>", { id: "__h" });
        var $logo = $(keyToCss("logoContainer")).eq(0);
        var $create = $(keyToCss("createPost")).eq(0);
        var $heading = $(`<div class="${keyToClasses("heading").join(" ")}"><h3>Account</h3></div>`);
        var $likeIcon = $(`<svg xmlns="http://www.w3.org/2000/svg" height="18" width="20" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);"><use href="#managed-icon__like-filled"></use></svg>`);
        var $followingIcon = $(`<svg xmlns="http://www.w3.org/2000/svg" height="21" width="20" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);"><use href="#managed-icon__following"></use></svg>`);
        var $starIcon = $(`<svg xmlns="http://www.w3.org/2000/svg" height="21" width="20" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);"><use href="#managed-icon__star-outline"></use></svg>`);
        var $helpIcon = $(`<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);"><use href="#managed-icon__posts-ask"></use></svg>`);
        var $coinsIcon = $(`<svg xmlns="http://www.w3.org/2000/svg" height="21" width="20" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);"><use href="#managed-icon__coins"></use></svg>`);
        var $keyboardIcon = $(`<svg xmlns="http://www.w3.org/2000/svg" height="12" width="20" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);"><use href="#managed-icon__keyboard"></use></svg>`);
        var $paletteIcon = $(`<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" role="presentation" style="--icon-color-primary: rgba(var(--black), 0.65);"><use href="#managed-icon__palette"></use></svg>`);
        var $menu = $(`
                <div id="__m">
                    <div id="__in">
                        <h1>dashboard unfucker v${version}b</span></h1>
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
                                <span style="width: 100%;">version: <b>v${version}b</b></span><br>
                                <span style="width: 100%;">type "<b>b</b>" uses jQuery instead of window property feature toggles</span>
                            </li>
                            <li>
                                <a target="_blank" href="https://github.com/enchanted-sword/dashboard-unfucker">source</a>
                            </li>
                            <li>
                                <a target="_blank" href="https://github.com/enchanted-sword/dashboard-unfucker/issues/new">report a bug</a>
                            </li>
                            <li>
                                <a target="_blank" href="${updateSrc}">update</a>
                            </li>
                            <li>
                                <a target="_blank" href="https://tumblr.com/dragongirlsnout">my tumblr!</a>
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
                                <span>hide tumblr live</span>
                                <input class="configInput" type="checkbox" id="__c6" name="5" ${configPreferences[5].value}>
                            </li>
                            <li>
                                <span>hide domains</span>
                                <input class="configInput" type="checkbox" id="__c7" name="6" ${configPreferences[6].value}>
                            </li>
                            <li>
                                <span>hide ad-free</span>
                                <input class="configInput" type="checkbox" id="__c8" name="7" ${configPreferences[7].value}>
                            </li>
                            <li>
                                <span>content positioning</span>
                                <input class="configInput" type="range" id="c9" name="8" min="-500" max="500" step="1" value="${configPreferences[8].value}">
                            </li>
                        </ul>
                    </div>
                </div>
            `)
        $("html").append($menu);
        $("#__cb").on("click", () => {
            if ($("#__c").is(":hidden")) {
                $("#__cb svg").css("--icon-color-primary", "rgb(var(--white-on-dark))");
            } else { $("#__cb svg").css("--icon-color-primary", "rgba(var(--white-on-dark),.65)") }
            $("#__c").toggle();
        });
        $("#__ab").on("click", () => {
            if ($("#__a").is(":hidden")) {
                $("#__ab svg").css("--icon-color-primary", "rgb(var(--white-on-dark))");
            } else { $("#__ab svg").css("--icon-color-primary", "rgba(var(--white-on-dark),.65)") }
            $("#__a").toggle();
        });
        $(".configInput").on("change", function () {
            if ($(this).attr("type") === "checkbox") {
                configPreferences[Number($(this).attr("name"))].value = $(this).is(":checked") ? "checked" : "";
                checkboxEvent($(this).attr("id"), $(this).is(":checked"));
            }
            else {
                configPreferences[Number($(this).attr("name"))].value = $(this).val();
                if ($(keyToCss("main")).length && !["search", "tagged"].includes(pathname)) {
                    $(keyToCss("main")).css("margin-left", `${$(this).val()}px`);
                }
            }
            updatePreferences(configPreferences);
        });
        $(keyToCss("timelineHeader")).toggle(!$("#__c1").is(":checked"));
        $(keyToCss("navItem")).has('use[href="#managed-icon__explore"]').toggle(!$("#__c4").is(":checked"));
        $(keyToCss("navItem")).has('use[href="#managed-icon__shop"]').toggle(!$("#__c5").is(":checked"));
        $(keyToCss("navItem")).has('use[href="#managed-icon__live-video"]')
            .add($(keyToCss("navItem")).has('use[href="#managed-icon__coins"]'))
            .add($(keyToCss("listTimelineObject")).has(keyToCss("liveMarqueeTitle"))).toggle(!$("#__c6").is(":checked"));
        $(keyToCss("navItem")).has('use[href="#managed-icon__earth"]').toggle(!$("#__c7").is(":checked"));
        $(keyToCss("navItem")).has('use[href="#managed-icon__sparkle"]').toggle(!$("#__c8").is(":checked"));
        if ($(keyToCss("main")).length && !["search", "tagged"].includes(pathname)) {
            $main.css("margin-left", $("#__c9").val());
        } else $main.css("margin-left", "100px");
        $create.detach();
        $(keyToCss("bluespaceLayout")).prepend($bar);
        $logo.detach()
        $bar.append($header)
        $header.append($logo);
        if (match.includes(pathname)) {
            waitFor(keyToCss("searchSidebarItem")).then(() => {
                var $search = $(keyToCss("searchSidebarItem")).eq(0);
                $search.insertAfter($logo);
                $(keyToCss("sidebarItem")).has(keyToCss("recommendedBlogs")).toggle(!$("#__c2").is(":checked"));
                $(keyToCss("sidebarItem")).has(keyToCss("radar")).toggle(!$("#__c3").is(":checked"));
            });
            $content = $(keyToCss("main")).eq(0);
            if (["/dashboard", "/"].includes(pathname)) {
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
        if (["search", "tagged"].includes(pathname)) {
            $content.css("max-width", "fit-content");
        }
        $header.append($nav);
        $header.append($create);
        $(keyToCss("navSubHeader")).addClass(keyToClasses("heading").join(" "));
        $main.prepend($content);
        var $navItems = $nav.children();
        var $home = $navItems.has('use[href="#managed-icon__home"]');
        var $inbox = $navItems.has('use[href="#managed-icon__mail"]');
        var $messages = $navItems.has('use[href="#managed-icon__messaging"]');
        $inbox.insertAfter($home);
        $messages.insertAfter($inbox);
        var $subnav = $(keyToCss("subNav"));
        $create.find("a").eq(0).html('<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" role="presentation"><use href="#managed-icon__post"></use></svg>');
        $(document).on("click", () => {
            if ($(`${keyToCss("subNav")}:hover`).length) { return }
            if ($subnav.eq(0).attr("hidden") ? false : true) {
                document.getElementById("account_button").click();
            }
        });
        var $accountSubnav = $("#account_subnav");
        $accountSubnav.prepend($heading);
        $heading.append($(keyToCss("logoutButton")));
        $(`[href="/likes"] ${keyToCss("childWrapper")}`).prepend($likeIcon);
        $(`[href="/following"] ${keyToCss("childWrapper")}`).prepend($followingIcon);
        $(keyToCss("navItem")).has("[href='/likes']").addClass("__subnavItem");
        $(keyToCss("navItem")).has("[href='/following']").addClass("__subnavItem");
        var $settings = $(`
            <li class="${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}">
                <button class="${keyToClasses("button")[0]} ${keyToClasses("navLinkButtonWrapper").join(" ")}">
                    <span class="${keyToClasses("buttonInner").join(" ")} ${keyToClasses("navLink").join(" ")}" tabindex="-1" style="width: 100%;">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" role="presentation">
                            <use href="#managed-icon__settings"></use>
                        </svg>
                        <div class="${keyToClasses("navInfo").join(" ")}">
                            <span class="${keyToClasses("childWrapper").join(" ")}" style="font-size: 1rem;">Settings</span>
                            <span class="${keyToClasses("buttonInner").join(" ")} ${keyToClasses("caret").join(" ")}" id="settings_caret" style="transition: transform 200ms ease-in-out 0s;">
                            <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" role="presentation">
                                <use href="#managed-icon__caret-thin"></use>
                            </svg>
                            </span>
                        </div>
                    </span>
                </button>
            </li>
            `);
        var $settingsSubmenu = $(`
            <ul class="${keyToClasses("accountStats").join(" ")}" id="settings_submenu_new" style="margin: 0;">
                <li class="${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}">
                    <a class="${keyToClasses("navLink").join(" ")}" href="/settings/account">
                        <div class="${keyToClasses("navInfo").join(" ")}">
                            <span class="${keyToClasses("childWrapper").join(" ")}">Account</span>
                            </span>
                        </div>
                    </a>
                </li>
                <li class="${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}">
                    <a class="${keyToClasses("navLink").join(" ")}" href="/settings/dashboard">
                        <div class="${keyToClasses("navInfo").join(" ")}">
                            <span class="${keyToClasses("childWrapper").join(" ")}">Dashboard</span>
                        </div>
                    </a>
                </li>
                <li class="${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}">
                    <a class="${keyToClasses("navLink").join(" ")}" href="/settings/notifications">
                        <div class="${keyToClasses("navInfo").join(" ")}">
                            <span class="${keyToClasses("childWrapper").join(" ")}">Notifications</span>
                        </div>
                    </a>
                </li>
                <li class="${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}">
                    <a class="${keyToClasses("navLink").join(" ")}" href="/settings/domains">
                        <div class="${keyToClasses("navInfo").join(" ")}">
                            <span class="${keyToClasses("childWrapper").join(" ")}">Domains</span>
                        </div>
                    </a>
                </li>
                <li class="${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}">
                    <a class="${keyToClasses("navLink").join(" ")}" href="/settings/ad-free-browsing">
                        <div class="${keyToClasses("navInfo").join(" ")}">
                            <span class="${keyToClasses("childWrapper").join(" ")}">Ad-Free Browsing</span>
                        </div>
                    </a>
                </li>
                <li class="${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}">
                    <a class="${keyToClasses("navLink").join(" ")}" href="/settings/purchases">
                        <div class="${keyToClasses("navInfo").join(" ")}">
                            <span class="${keyToClasses("childWrapper").join(" ")}">Payment &amp; purchases</span>
                        </div>
                    </a>
                </li>
                <li class="${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}">
                    <a class="${keyToClasses("navLink").join(" ")}" href="/settings/subscriptions">
                        <div class="${keyToClasses("navInfo").join(" ")}">
                            <span class="${keyToClasses("childWrapper").join(" ")}">Post+ subscriptions</span>
                        </div>
                    </a>
                </li>
                <li class="${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}">
                    <a class="${keyToClasses("navLink").join(" ")}" href="/settings/apps">
                        <div class="${keyToClasses("navInfo").join(" ")}">
                            <span class="${keyToClasses("childWrapper").join(" ")}">Apps</span>
                        </div>
                    </a>
                </li>
                <li class="${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}">
                    <a class="${keyToClasses("navLink").join(" ")}" href="/settings/privacy">
                        <div class="${keyToClasses("navInfo").join(" ")}">
                            <span class="${keyToClasses("childWrapper").join(" ")}">Privacy</span>
                        </div>
                    </a>
                </li>
                <li class="${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}">
                    <a class="${keyToClasses("navLink").join(" ")}" href="/settings/labs">
                        <div class="${keyToClasses("navInfo").join(" ")}">
                            <span class="${keyToClasses("childWrapper").join(" ")}">Labs</span>
                        </div>
                    </a>
                </li>
                <li class="${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}">
                    <a class="${keyToClasses("navLink").join(" ")}" href="/settings/gifts">
                        <div class="${keyToClasses("navInfo").join(" ")}">
                            <span class="${keyToClasses("childWrapper").join(" ")}">Gifts</span>
                        </div>
                    </a>
                </li>
            </ul>
            `);
        $settings.insertAfter($subnav.children("li").has("span:contains('Following')"));
        $settingsSubmenu.insertAfter($settings);
        $settingsSubmenu.hide();
        $settings.on("click", () => {
            if ($settingsSubmenu.is(":hidden")) {
                $("#settings_caret").css("transform", "rotate(180deg)");
            }
            else { $("#settings_caret").css("transform", "rotate(0deg)") }
            $settingsSubmenu.toggle();
        });
        var blogs = window.___INITIAL_STATE___.queries.queries[0].state.data.user.blogs;
        var $blogs = $(keyToCss("blogTile"));
        for (let i = 0; i < blogs.length; ++i) {
            var $blog = $blogs.eq(i);
            var blog = blogs[i];
            var $button = $(`
                <button class="${keyToClasses("button")[0]}" aria-label="${tr("Show Blog Statistics")}">
                    <span class="${keyToClasses("buttonInner").join(" ")} ${keyToClasses("menuTarget").join(" ")}" style="transform: rotate(0deg); display: flex; transition: transform 200ms ease-in-out 0s;" tabindex="-1">
                        <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" role="presentation">
                            <use href="#managed-icon__caret-thin"></use>
                        </svg>
                    </span>
                </button>
            `);
            $blog.find(keyToCss("actionButtons")).append($button);
            var $accountStats = $(`
            <ul class="${keyToClasses("accountStats").join(" ")}">
                <li>
                    <a href="/blog/${blog.name}">
                        <span>Posts</span>
                        <span class="${keyToClasses("count").join(" ")}">${blog.posts? blog.posts: ""}</span>
                    </a>
                </li>
                <li>
                    <a href="/blog/${blog.name}/followers">
                        <span>Followers</span>
                        <span class="${keyToClasses("count").join(" ")}">${blog.followers? blog.followers : ""}</span>
                    </a>
                </li>
                <li id="__${blog.name}-activity">
                    <a href="/blog/${blog.name}/activity">
                        <span>Activity</span>
                    </a>
                </li>
                <li>
                    <a href="/blog/${blog.name}/drafts">
                        <span>Drafts</span>
                        <span class="${keyToClasses("count").join(" ")}">${blog.drafts? blog.drafts : ""}</span>
                    </a>
                </li>
                <li>
                    <a href="/blog/${blog.name}/queue">
                        <span>Queue</span>
                        <span class="${keyToClasses("count").join(" ")}">${blog.queue? blog.queue : ""}</span>
                    </a>
                </li>
                <li>
                    <a href="/blog/${blog.name}/post-plus">
                        <span>Post+</span>
                    </a>
                </li>
                <li>
                    <a href="/blog/${blog.name}/blaze">
                        <span>Tumblr Blaze</span>
                    </a>
                </li>
                <li>
                    <a href="/settings/blog/${blog.name}">
                        <span>Blog settings</span>
                    </a>
                </li>
                <li>
                    <a href="/mega-editor/published/${blog.name}" target="_blank">
                        <span>Mass Post Editor</span>
                    </a>
                </li>
            </ul>
            `);
            $accountStats.insertAfter($blog);
            if (blog.isGroupChannel) {
                var $members = $(`
                    <li>
                        <a href="/blog/${blog.name}/members" target="_blank">
                            <span>Members</span>
                        </a>
                    </li>
                `);
                $members.insertAfter($(`#__${blog.name}-activity`));
            }
            $accountStats.hide()
            $button.on("click", function () {
                if ($(keyToCss("accountStats")).eq(i + 1).is(":hidden")) {
                    $(this).css("transform", "rotate(180deg)");
                }
                else {
                    $(this).css("transform", "rotate(0deg)");
                }
                $(keyToCss("accountStats")).eq(i + 1).toggle();
            });
        }
        $(`button[aria-label="${tr("Show Blog Statistics")}"`).eq(0).trigger("click");
        var $domains = $navItems.has('use[href="#managed-icon__earth"]');
        var $adFree = $navItems.has('use[href="#managed-icon__sparkle"]');
        var $shop = $navItems.has('use[href="#managed-icon__shop"]')
        $domains.insertAfter($settingsSubmenu);
        $adFree.insertAfter($domains);
        $shop.insertAfter($adFree);
        $(`[title="${tr("Settings")}"]`).hide();
        $(`a[href="/changes"] ${keyToCss("childWrapper")}`).prepend($starIcon);
        $(`a[href="/help"] ${keyToCss("childWrapper")}`).prepend($helpIcon);
        $(`a[href="/live/shop"] ${keyToCss("childWrapper")}`).prepend($coinsIcon);
        $(`button span:contains("Keyboard shortcuts")`).eq(0).prepend($keyboardIcon);
        var $paletteWrapper = $("<li>", { class: `${keyToClasses("navItem").join(" ")} ${keyToClasses("newDesktopLayout").join(" ")}` });
        var $palette = $(`button[aria-label="${tr("Change palette")}"]`);
        $paletteWrapper.insertAfter($subnav.children("li").has("span:contains('Keyboard shortcuts')"));
        $paletteWrapper.append($palette);
        $palette.children("span").eq(0).prepend($paletteIcon);
        if (["blog", "likes", "following"].includes(pathname)) { document.getElementById("account_button").click(); }
        $header.append($("<nav>"));
        waitFor(keyToCss("sidebar")).then(() => {
            $(keyToCss("sidebar")).prepend($menu);
        });
        console.log("dashboard fixed!");


    }

    $unfuck();

    window.tumblr.on('navigation', () => requestAnimationFrame(function () {
        $unfuck().catch((e) => {
            window.setTimeout($unfuck, 400)
        });
    }));

    const $iconify = () => {
        let links = $(keyToCss("blogLink")).has(keyToCss("brokenBlog"));
        if (links.length === 0) return
        for (let i = 0; i < links.length; ++i) {
            let link = links.eq(i);
            let wrapper = link.find(keyToCss("avatarWrapperInner"));
            let blog = link.attr("title");
            wrapper.find(keyToCss("brokenBlog")).removeClass();
            wrapper.append($(`
                <div class="${keyToClasses("placeholder").join(" ")}" style="padding-bottom: 100%;">
                    <img class="${keyToClasses("image").join(" ")} ${keyToClasses("visible").join(" ")}" sizes="64px" alt="Avatar" style="width: 64px; height: 64px;" loading="eager" src="https://api.tumblr.com/v2/blog/${blog}/avatar/64">
                </div>
            `)) 
        }
    }

    $(window).on("scroll", () => {
        $iconify();
    });
});

async function getUtilities() {
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