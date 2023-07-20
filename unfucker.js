// ==UserScript==
// @name         dashboard unfucker
// @version      1.4
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

var $ = window.jQuery;

function $unfuck ({ keyToClasses, keyToCss }) {
    if ($(keyToCss("headerWrapper")).length) {
        console.log("no need to unfuck");
        return
    }
    else {console.log("unfucking dashboard...")}
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
    var $bar = $("<div>", {class: keyToClasses("headerWrapper").join(" ")});
    var $logo = $(keyToCss("logoContainer")).eq(0);
    var $create = $(keyToCss("createPost")).eq(0);
    var $search = ""
    $create.detach();
    $bar.css({display: "flex"});
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
    }
    else {
        $content = $(keyToCss("container")).eq(0);
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
    $logo.css("margin-left", "100px");
    $search.css("max-width", "550px");
    $(keyToCss("mainContentWrapper")).eq(0).remove();
    $(keyToCss("navigationWrapper")).eq(0).remove();
    $(keyToCss("navigation")).css({border: "none"});
    $main.css({border: "none", marginTop: "40px"});
    $(`${keyToCss("post")} ${keyToCss("stickyContainer")} ${keyToCss("avatar")}${keyToCss("newDesktopLayout")}`).css("top", "calc(70px + var(--dashboard-tabs-header-height,0px))");
    $(keyToCss("searchShadow")).css("background", "none");
    $nav.css({display: "flex", justifyContent: "flex-end", flexBasis: "100%", marginBottom: "0px", marginTop: "8px"});
    $nav.children(":nth-child(2),:nth-child(10),:nth-child(11),:nth-child(12)").remove();
    $nav.find("svg").css("scale", "1.4");
    $(`${keyToCss("startChildWrapper")} + ${keyToCss("navInfo")}`).remove();
    $(keyToCss("blogTile")).css("list-style-type", "none");
    $(keyToCss("subNav")).css({height: "800px", overflowY: "scroll", background: "RGB(var(--white))", scrollbarColor: "rgba(var(--black),.4)rgba(var(--white),.1)", color: "RGB(var(--black))", position: "absolute", borderRadius: "4px", marginTop: "48px"});
    $(`${keyToCss("subNav")} *`).css({color: "RGB(var(--black))"});
    var $navli = $(`${keyToCss("subNav")} > ${keyToCss("navItem")}, ${keyToCss("accountStats")} li`);
    $navli.css({listStyleType: "none", borderBottom: "1px solid rgba(var(--black),.07)"});
    $navli.on("mouseenter", function() {$(this).css("background-color", "rgba(var(--black),.07)")});
    $navli.on("mouseleave", function() {$(this).css("background-color", "rgb(var(--white))")});
    $("#managed-icon__caret-thin").css("--icon-color-primary", "rgba(var(--black),.65)")
    $("#settings_subnav").css("height", "fit-content");
    $(keyToCss("navSubHeader")).replaceWith(`<div class="${keyToClasses("heading").join(" ")}" style="display: flex;align-items: center;justify-content: space-between;background: rgba(var(--black),.07);height: 36px;padding: 4px 12px 4px 12px;color: rgba(var(--black),.65);"><h3>Blogs</h3><a class="${keyToClasses("headingLink").join(" ")}" style="text-decoration: none;" href="/new/blog">+ New</a></div>`);
    $create.css({width: "44px", marginRight: "100px", marginLeft: "10px"});
    $create.children().eq(0).css({borderRadius: "3px"});
    $create.find("a").eq(0).html('<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" role="presentation"><use href="#managed-icon__post"></use></svg>');
    console.log("dashboard fixed!");
}

getCssMapUtilities().then($unfuck);

;(function() {
    var pushState = history.pushState;
    var replaceState = history.replaceState;

    history.pushState = function() {
        pushState.apply(history, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
    };

    history.replaceState = function() {
        replaceState.apply(history, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
    };

    window.addEventListener('popstate', function() {
        window.dispatchEvent(new Event('locationchange'))
    });
})();

window.addEventListener('locationchange', function(){
    console.log("locationchange event occured, unfucking page");
    window.setTimeout($unfuck, 200);
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

getCssMapUtilities().then($unfuck);