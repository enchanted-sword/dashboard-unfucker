// ==UserScript==
// @name         dashboard unfucker
// @version      1.2
// @description  no more shitty twitter ui for pc
// @author       dragongirlsnout
// @match        https://www.tumblr.com/
// @match        https://www.tumblr.com/dashboard
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
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
    var $aside = $(keyToCss("sidebar")).eq(0);
    var $search = $aside.find(keyToCss("searchSidebarItem")).eq(0);
    var $nav = $(keyToCss("navigationLinks")).eq(0);
    var $content = $(keyToCss("main")).eq(0);
    var $main = $(keyToCss("newDesktopLayout")).eq(0);
    var $bar = $("<div>", {class: keyToClasses("headerWrapper")[0]});
    var $logo = $(keyToCss("logoContainer")).eq(0);
    var $footer = $(keyToCss("usesNewDimensions")).eq(0);
    var $create = $(keyToCss("createPost")).eq(0);
    $aside.detach();
    $search.detach();
    $create.detach();
    $bar.css({display: "flex"});
    $(keyToCss("bluespaceLayout")).prepend($bar);
    $logo.detach()
    $bar.append($logo);
    $bar.append($search);
    $bar.append($nav);
    $bar.append($create);
    $main.append($content)
    $main.append($aside)
    $logo.css("margin-left", "100px");
    $search.css("max-width", "550px");
    $(keyToCss("mainContentWrapper")).eq(0).remove();
    $(keyToCss("navigationWrapper")).eq(0).remove();
    $(keyToCss("navigation")).css({border: "none"});
    $main.css({border: "none", marginTop: "40px"});
    $aside.css({marginLeft: "50px"})
    $aside.children().eq(0).css({position: "fixed", width: "320px"});
    $(`${keyToCss("about")}${keyToCss("inSidebar")}${keyToCss("usesNewDimensions")}`).css("position", "fixed");
    $(`${keyToCss("post")} ${keyToCss("stickyContainer")} ${keyToCss("avatar")}${keyToCss("newDesktopLayout")}`).css("top", "calc(70px + var(--dashboard-tabs-header-height,0px))");
    $(keyToCss("searchShadow")).css("background", "none");
    $nav.css({display: "flex", justifyContent: "flex-end", flexBasis: "100%", marginBottom: "0px", marginTop: "8px"});
    $nav.children(":nth-child(2),:nth-child(10),:nth-child(11),:nth-child(12)").remove();
    $nav.find("svg").css("scale", "1.4");
    $(`${keyToCss("startChildWrapper")} + ${keyToCss("navInfo")}`).remove();
    $(keyToCss("subNav")).css({height: "800px", overflowY: "scroll", background: "RGB(var(--white))", scrollbarColor: "rgba(var(--black),.4)rgba(var(--white),.1)", color: "RGB(var(--black))", position: "absolute", borderRadius: "4px", marginTop: "48px"});
    $(`${keyToCss("subNav")} *`).css({color: "RGB(var(--black))"});
    $(`${keyToCss("subNav")} li`).css({listStyleType: "none", borderBottom: "rgba(var(--black),.07)"});
    $("#settings_subnav").css("height", "fit-content");
    $(keyToCss("navSubHeader")).replaceWith(`<div class="${keyToClasses("heading")[0]}" style="display: flex;align-items: center;justify-content: space-between;background: rgba(var(--black),.07);height: 36px;padding: 4px 12px 4px 12px;color: rgba(var(--black),.65);"><h3>Blogs</h3><a class="${keyToClasses("headingLink")[0]}" style="text-decoration: none;" href="/new/blog">+ New</a></div>`);
    $footer.css({position: "fixed", height: "20px", bottom: "0px", right: "50px"});
    $create.css({width: "44px", marginRight: "100px", marginLeft: "10px"});
    $create.children().eq(0).css({borderRadius: "3px"});
    $create.find("a").eq(0).html(`<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" role="presentation"><use href="#managed-icon__post"></use></svg>`);
}

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
