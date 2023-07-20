// ==UserScript==
// @name         dashboard unfucker
// @version      1.3
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

function $unfuck () {
    if ($(".hlDot").length) {
        console.log("no need to unfuck");
        return
    }
    else {console.log("unfucking dashboard...")}
    var match = ["", "dashboard", "settings", "blog", "domains", "search", "likes", "following", "inbox"]
    var compare = window.location.href.split("/")[3];
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
    var $nav = $(".gM9qK").eq(0);
    var $content = ""
    var $main = $(".ZkG01").eq(0);
    var $bar = $("<div>", {class: "hlDot"});
    var $logo = $(".Gav7q").eq(0);
    var $create = $(".jGgIg").eq(0);
    var $search = ""
    $create.detach();
    $bar.css({display: "flex"});
    $(".D5eCV").prepend($bar);
    $logo.detach()
    $bar.append($logo);
    if (test) {
        var $aside = $(".e1knl").eq(0);
        $search = $(".N5wJr").eq(0);
        $content = $(".lSyOz").eq(0);
        $aside.detach();
        $main.append($aside)
        $aside.css({marginLeft: "50px", position: "sticky", top: "54px", height: "fit-content"})
        $aside.children().eq(0).css({width: "320px"});
        $(".m8mN_._qHCt.j_AvJ").css({position: "fixed", height: "20px", bottom: "0px"});
    }
    else {
        $content = $(".RkANE").eq(0);
        $search = $(`<div class="N5wJr" style="max-width: 550px; width: 100%; padding: 14px 8px 0px 8px;"><div class="Mw2UR"><span data-testid="controlled-popover-wrapper" class="BPf9u"><span class="BPf9u"><form method="GET" action="/search" role="search" class="aogHd"><div class="oPa7v"><div class="Z3WPg"><svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" role="presentation"><use href="#managed-icon__search"></use></svg></div><input name="q" type="text" autocomplete="off" aria-label="Search" class="NaqPB" placeholder="Search Tumblr" autocapitalize="sentences" value=""></div></form></span></span></div></div>`)
    }
    if (compare === "search") {
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
    $("._3xgk").eq(0).remove();
    $(".h_Erh").eq(0).remove();
    $(".FA5JM").css({border: "none"});
    $main.css({border: "none", marginTop: "40px"});
    $(".FtjPK .AD_w7 .JZ10N.y0ud2").css("top", "calc(70px + var(--dashboard-tabs-header-height,0px))");
    $(".zmjaW").css("background", "none");
    $nav.css({display: "flex", justifyContent: "flex-end", flexBasis: "100%", marginBottom: "0px", marginTop: "8px"});
    $nav.children(":nth-child(2),:nth-child(10),:nth-child(11),:nth-child(12)").remove();
    $nav.find("svg").css("scale", "1.4");
    $(".kn4U3 + .a132D").remove();
    $(".jkWYb").css("list-style-type", "none");
    $(".jL4Qq").css({height: "800px", overflowY: "scroll", background: "RGB(var(--white))", scrollbarColor: "rgba(var(--black),.4)rgba(var(--white),.1)", color: "RGB(var(--black))", position: "absolute", borderRadius: "4px", marginTop: "48px"});
    $(".jL4Qq *").css({color: "RGB(var(--black))"});
    var $navli = $(".jL4Qq > .IYrO9,.kbIQf li");
    $navli.css({listStyleType: "none", borderBottom: "1px solid rgba(var(--black),.07)"});
    $navli.on("mouseenter", function() {$(this).css("background-color", "rgba(var(--black),.07)")});
    $navli.on("mouseleave", function() {$(this).css("background-color", "rgb(var(--white))")});
    $("#managed-icon__caret-thin").css("--icon-color-primary", "rgba(var(--black),.65)")
    $("#settings_subnav").css("height", "fit-content");
    $(".h8SQv").replaceWith('<div class="l463r" style="display: flex;align-items: center;justify-content: space-between;background: rgba(var(--black),.07);height: 36px;padding: 4px 12px 4px 12px;color: rgba(var(--black),.65);"><h3>Blogs</h3><a class="Oyvhq" style="text-decoration: none;" href="/new/blog">+ New</a></div>');
    $create.css({width: "44px", marginRight: "100px", marginLeft: "10px"});
    $create.children().eq(0).css({borderRadius: "3px"});
    $create.find("a").eq(0).html('<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" role="presentation"><use href="#managed-icon__post"></use></svg>');
    console.log("dashboard fixed!");
}

$(document).ready($unfuck);

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
