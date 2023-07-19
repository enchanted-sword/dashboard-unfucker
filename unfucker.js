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

function $unfuck () {
    if ($(".hlDot").length) {
        console.log("no need to unfuck");
        return
    }
    var $aside = $(".e1knl").eq(0);
    var $search = $aside.find(".N5wJr").eq(0);
    var $nav = $(".gM9qK").eq(0);
    var $content = $(".lSyOz").eq(0);
    var $main = $(".ZkG01").eq(0);
    var $bar = $("<div>", {class: "hlDot"});
    var $logo = $(".Gav7q").eq(0);
    var $footer = $(".j_AvJ").eq(0);
    var $create = $(".jGgIg").eq(0);
    $aside.detach();
    $search.detach();
    $create.detach();
    $bar.css({display: "flex"});
    $(".D5eCV").prepend($bar);
    $logo.detach()
    $bar.append($logo);
    $bar.append($search);
    $bar.append($nav);
    $bar.append($create);
    $main.append($content)
    $main.append($aside)
    $logo.css("margin-left", "100px");
    $search.css("max-width", "550px");
    $("._3xgk").eq(0).remove();
    $(".h_Erh").eq(0).remove();
    $(".FA5JM").css({border: "none"});
    $main.css({border: "none", marginTop: "40px"});
    $aside.css({marginLeft: "50px"})
    $aside.children().eq(0).css({position: "fixed", width: "320px"});
    $(".m8mN_._qHCt.j_AvJ").css("position", "fixed");
    $(".FtjPK .AD_w7 .JZ10N.y0ud2").css("top", "calc(70px + var(--dashboard-tabs-header-height,0px))");
    $(".zmjaW").css("background", "none");
    $nav.css({display: "flex", justifyContent: "flex-end", flexBasis: "100%", marginBottom: "0px", marginTop: "8px"});
    $nav.children(":nth-child(2),:nth-child(10),:nth-child(11),:nth-child(12)").remove();
    $nav.find("svg").css("scale", "1.4");
    $(".kn4U3 + .a132D").remove();
    $(".jL4Qq").css({height: "800px", overflowY: "scroll", background: "RGB(var(--white))", scrollbarColor: "rgba(var(--black),.4)rgba(var(--white),.1)", color: "RGB(var(--black))", position: "absolute", borderRadius: "4px", marginTop: "48px"});
    $(".jL4Qq *").css({color: "RGB(var(--black))"});
    $(".jL4Qq li").css({listStyleType: "none", borderBottom: "rgba(var(--black),.07)"});
    $("#settings_subnav").css("height", "fit-content");
    $(".h8SQv").replaceWith(`<div class="l463r" style="display: flex;align-items: center;justify-content: space-between;background: rgba(var(--black),.07);height: 36px;padding: 4px 12px 4px 12px;color: rgba(var(--black),.65);"><h3>Blogs</h3><a class="Oyvhq" style="text-decoration: none;" href="/new/blog">+ New</a></div>`);
    $footer.css({position: "fixed", height: "20px", bottom: "0px", right: "50px"});
    $create.css({width: "44px", marginRight: "100px", marginLeft: "10px"});
    $create.children().eq(0).css({borderRadius: "3px"});
    $create.find("a").eq(0).html(`<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" role="presentation"><use href="#managed-icon__post"></use></svg>`);
}


$(document).ready($unfuck);
