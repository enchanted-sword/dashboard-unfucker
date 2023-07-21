// ==UserScript==
// @name         dashboard unfucker
// @version      1.7
// @description  no more shitty twitter ui for pc
// @author       dragongirlsnout
// @match        https://www.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @downloadURL  https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker.js
// @updateURL    https://raw.githubusercontent.com/enchanted-sword/dashboard-unfucker/main/unfucker.js
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// ==/UserScript==

'use strict';

getCssMapUtilities().then(({ keyToClasses, keyToCss }) => {

    var $ = window.jQuery;

    var $styleElement = $("<style>");
    $styleElement.appendTo("html");

    $styleElement.text(`
        @media (min-width: 990px) {
            #__hw { display: flex; }
            ${keyToCss("logoContainer")} { margin-left: 100px; }
            ${keyToCss("searchSidebarItem")} { max-width: 550px; }
            ${keyToCss("navigation")} { border: none; }
            ${keyToCss("post")} ${keyToCss("stickyContainer")} ${keyToCss("avatar")}${keyToCss("newDesktopLayout")} {
                top: calc(70px + var(--dashboard-tabs-header-height,0px))
            }
            ${keyToCss("searchShadow")} { background: none; }
            ${keyToCss("navigationLinks")} {
                display: flex;
                justify-content: flex-end;
                flex-basis: 100%;
                margin-bottom: 0px;
                margin-top: 8px;
            }
            ${keyToCss("navigationLinks")} svg { scale: 1.4; }
            ${keyToCss("blogTile")} { list-style-type: none; }
            ${keyToCss("subNav")} {
                height: 800px;
                overflow-y: scroll;
                background: RGB(var(--white));
                scrollbar-color: rgba(var(--black),.4)rgba(var(--white),.1);
                color: RGB(var(--black));
                position: absolute;
                border-radius: 4px;
                margin-top: 48px;
            }
            ${keyToCss("subNav")} * { color: RGB(var(--black)); }
            ${keyToCss("subNav")} > ${keyToCss("navItem")}, ${keyToCss("accountStats")} li {
                list-style-type: none;
                border-bottom: 1px solid rgba(var(--black),.07);
            }
            #managed-icon__caret-thin { --icon-color-primary: rgba(var(--black),.65); }
            #settings_subnav { height: fit-content; }
            ${keyToCss("createPost")} {
                width: 44px;
                margin-right: 100px;
                margin-left: 10px;
            }
            ${keyToCss("createPost")} > a { border-radius: 3px; }
            @media (max-width: 1150px) {
                ${keyToCss("buttonInner")} { padding: 8px 16px; }
            }

            ${keyToCss("mainContentWrapper")} { display: none !important; }
            ${keyToCss("navigationWrapper")} { display: none !important; }
            ${keyToCss("startChildWrapper")} + ${keyToCss("navInfo")} { display: none !important; }
        }
    `);

    async function $unfuck () {
        if ($("#__hw").length) {
            console.log("no need to unfuck");
            return
        }
        else {console.log("unfucking dashboard...")}
        if (!$(keyToCss("navigationLinks")).length) {
            console.log("page not loaded, retrying...");
            throw "page not loaded";
        }
        var match = ["", "dashboard", "settings", "blog", "domains", "search", "likes", "following", "inbox", "tagged"]
        var compare = window.location.href.split("/")[3].split("?")[0];
        var test = true;
        for (let x in match) {
            if (compare === match[x]) {
                test = true;
                break;
            }
            else {
                test = false;
                continue;
            }
        }
        var $nav = $(keyToCss("navigationLinks")).eq(0);
        var $content = ""
        var $main = $(keyToCss("newDesktopLayout")).eq(0);
        var $bar = $("<div>", {class: keyToClasses("headerWrapper").join(" "), id: "__hw"});
        var $logo = $(keyToCss("logoContainer")).eq(0);
        var $create = $(keyToCss("createPost")).eq(0);
        var $search = ""
        $create.detach();
        $(keyToCss("bluespaceLayout")).prepend($bar);
        $logo.detach()
        $bar.append($logo);
        if (test) {
            var $aside = $(keyToCss("sidebar")).eq(0);
            $search = $(keyToCss("searchSidebarItem")).eq(0);
            $content = $(keyToCss("main")).eq(0);
            $aside.detach();
            $main.append($aside)
            $aside.css({marginLeft: "50px", position: "sticky", top: "54px", height: "fit-content"})
            $aside.children().eq(0).css({width: "320px"});
            $(`${keyToCss("about")}${keyToCss("inSidebar")}${keyToCss("usesNewDimensions")}`).css({position: "fixed", height: "20px", bottom: "0px"});
            $(keyToCss("sidebarItem")).remove();
            $(keyToCss("tabsHeader")).remove();
        }
        else {
            $content = $(`${keyToCss("mainContentWrapper")} ${keyToCss("container")}`).eq(0);
            $search = $(`
            <div class="${keyToClasses("searchSidebarItem").join(" ")}" style="max-width: 550px; width: 100%; padding: 14px 8px 0px 8px" >
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
                            aria-label="Search"
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
        `)
        }
        if (compare === "search" || compare === "tagged") {
            $content.css("max-width", "fit-content");
        }
        $search.detach();
        $bar.append($search);
        $bar.append($nav);
        $bar.append($create);
        $content.detach();
        $main.prepend($content)
        $main.css({border: "none", marginTop: "40px"});
        $nav.children().has('use[href="#managed-icon__explore"]')
            .add($nav.children().has('use[href="#managed-icon__shop"]'))
            .add($nav.children().has('use[href="#managed-icon__live-video"]'))
            .add($nav.children().has('use[href="#managed-icon__earth"]'))
            .add($nav.children().has('use[href="#managed-icon__sparkle"]'))
            .remove();
        var $navli = $(`${keyToCss("subNav")} > ${keyToCss("navItem")}, ${keyToCss("accountStats")} li`);
        $navli.on("mouseenter", function() {$(this).css("background-color", "rgba(var(--black),.07)")});
        $navli.on("mouseleave", function() {$(this).css("background-color", "rgb(var(--white))")});
        $(keyToCss("navSubHeader")).replaceWith(`<div class="${keyToClasses("heading").join(" ")}" style="display: flex;align-items: center;justify-content: space-between;background: rgba(var(--black),.07);height: 36px;padding: 4px 12px 4px 12px;color: rgba(var(--black),.65);"><h3>Blogs</h3><a class="${keyToClasses("headingLink").join(" ")}" style="text-decoration: none;" href="/new/blog">+ New</a></div>`);
        $create.find("a").eq(0).html('<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" role="presentation"><use href="#managed-icon__post"></use></svg>');
        console.log("dashboard fixed!");
    }

    $unfuck();

    window.tumblr.on('navigation', () => requestAnimationFrame(function() {
        $unfuck().catch((e) => {
            window.setTimeout($unfuck, 400)
        });
    }));

});

async function getCssMapUtilities () {
    let retries = 0;
    while (retries++ < 1000 && (typeof tumblr === "undefined" || typeof tumblr.getCssMap === "undefined")) {
        await new Promise((resolve) => setTimeout(resolve));
    }
    const cssMap = await tumblr.getCssMap();
    const keyToClasses = (...keys) => keys.flatMap(key => cssMap[key]).filter(Boolean);
    const keyToCss = (...keys) => `:is(${keyToClasses(...keys).map(className => `.${className}`).join(", ")})`;
    return { keyToClasses, keyToCss };
}
