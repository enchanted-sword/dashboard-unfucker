// ==UserScript==
// @name         dashboard unfucker
// @version      3.0.1
// @description  no more shitty twitter ui for pc
// @author       dragongirlsnout
// @match        https://www.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @downloadURL  https://github.com/enchanted-sword/dashboard-unfucker/blob/main/unfucker.js
// @updateURL    https://github.com/enchanted-sword/dashboard-unfucker/blob/main/unfucker.js
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @run-at       document-start
// ==/UserScript==

/* globals tumblr */

'use strict';

Object.defineProperty(window, "___INITIAL_STATE___", { //thanks twilight-sparkle-irl!
    set(x) {
        let state = x; // copy state
        try {
            let obf = JSON.parse(atob(state.obfuscatedFeatures)); // convert from base64, parse from string
            if (obf.redpopDesktopVerticalNav) {
                obf.redpopDesktopVerticalNav = false; // vertical nav layout
                obf.liveStreamingWeb = false; //no tumblr live
            }
            obf.activityRedesignM3 = false; // ugly activity update
            obf.liveStreaming = false;
            obf.liveCustomMarqueeData = false;
            obf.liveStreamingWebPayments = false;
            obf.adFreeCtaBanner = false; //no annoying popup when using an adblocker
            obf.domainsSettings = false; //turn off tumblr domains
            console.log(obf);
            state.obfuscatedFeatures = btoa(JSON.stringify(obf)); // compress back to string, convert to base64
        } catch (e) {
            console.error("Failed to modify features", e)
        } finally {
            window["unfucked"] = state; // save to proxy variable
        }
    },
    get() {
        return window["unfucked"]; // return proxy variable
    },
    enumerable: true,
    configurable: true
});

var $ = window.jQuery;

const waitFor = (selector, retried = 0,) => new Promise((resolve) => {
    if ($(selector).length) {resolve()}
    else if (retried < 25) {requestAnimationFrame(() => waitFor(selector, retried + 1).then(resolve))}
});

waitFor("head").then(() => {
    const style = document.createElement("style");
    style.innerHTML = `
        #adBanner + div:not(#glass-container) > div:first-child {
            z-index: 100;
            border-bottom: 1px solid rgba(var(--white-on-dark),.13) !important;
            position: -webkit-sticky !important;
            position: sticky !important;
            top: 0 !important;
            min-height: unset !important;
            background-color: RGB(var(--navy));
        }
    `;
    document.head.appendChild(style);
});

function storageAvailable(type) { //thanks mdn web docs!
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } 
    catch (e) {
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

function updatePreferences(arr) {
    localStorage.setItem("configPreferences", JSON.stringify(arr))
}

$(document).ready(() => {
    getUtilities().then(({ keyToCss }) => {
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
            #__c ul {
                margin: 4px;
                padding: 0;
                background: RGB(var(--white));
                border-radius: 3px;
            }
            #__c li {
                list-style-type: none;
                padding: 8px 12px;
                border-bottom: 1px solid rgba(var(--black),.07);
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: rgb(var(--black));
            }
            #__c li:first-of-type {
                background: rgba(var(--black),.07);
                padding: 12px 12px;
                font-weight: bold;
            }
            ${keyToCss("liveMarqueeWrapper")} { display: none; }
        `);

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
                $(keyToCss("menuContainer")).has('use[href="#managed-icon__explore"]').toggle(!value);
            }
            else if (id === "__c5") {
                $(keyToCss("menuContainer")).has('use[href="#managed-icon__shop"]').toggle(!value);
            }
        }

        async function $unfuck () {
            if($("#__c").length) {
                console.log("page already processed")
                return
            }
            if (["/dashboard", "/"].includes(location.pathname) && $(keyToCss("timeline")).attr("data-timeline") === "/v2/tabs/for_you") {
                window.tumblr.navigate("/dashboard/following");
                return
            }
            if (!$(keyToCss("menuRight")).length) {
                console.log("page not loaded, retrying...");
                throw "page not loaded";
            }
            else {console.log("unfucking dashboard...")}
            if (["/dashboard", "/"].includes(location.pathname)) {
                waitFor(keyToCss("timelineOptionsWrapper")).then(() => {
                    if ($(keyToCss("timelineOptionsItemWrapper")).first().has("a[href='/dashboard/stuff_for_you']").length ? true : false) {
                        var $forYou = $(keyToCss("timelineOptionsItemWrapper")).has("a[href='/dashboard/stuff_for_you']");
                        var $following = $(keyToCss("timelineOptionsItemWrapper")).has("a[href='/dashboard/following']");
                        $forYou.insertAfter($following);
                    }
                });
            }
            var configPreferences = [
                {type: "checkbox", value: "checked"},
                {type: "checkbox", value: "checked"},
                {type: "checkbox", value: "checked"},
                {type: "checkbox", value: "checked"},
                {type: "checkbox", value: "checked"},
            ];
            if (storageAvailable("localStorage")) {
                if (!localStorage.getItem("configPreferences")) {
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
            var $info = $(`
                <div id="__in">
                    <h1>dashboard unfucker v3.0.1</h1>
                        <a href="https://github.com/enchanted-sword/dashboard-unfucker/tree/main">
                            <svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" role="presentation" style="--icon-color-primary: rgba(var(--white-on-dark),.65);">
                                <use href="#managed-icon__embed"></use>
                            </svg>
                        </a>
                        <button id="__cb">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" role="presentation" style="--icon-color-primary: rgba(var(--white-on-dark), 0.65);">
                                <use href="#managed-icon__settings"></use>
                            </svg>
                        </button>
                    </div>
                    `);
            var $config = $(`
                <div id="__c">
                    <ul>
                        <li>
                            <span>configuration</span>
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
                    </ul>
                </div>
                `);
            $("html").append($info);
            $("html").append($config);
            $config.hide();
            $("#__cb").on("click", () => {
                if ($config.is(":hidden")) {
                    $("#__cb svg").css("--icon-color-primary", "rgb(var(--white-on-dark))");
                }
                else {$("#__cb svg").css("--icon-color-primary", "rgba(var(--white-on-dark),.65)")}
                $config.toggle();
            });
            $(".configInput").on("change", function () {
                if($(this).attr("type") === "checkbox") {
                    configPreferences[Number($(this).attr("name"))].value = $(this).is(":checked") ? "checked" : "";
                    checkboxEvent($(this).attr("id"), $(this).is(":checked"));
                }
                else {
                    configPreferences[Number($(this).attr("name"))].value = $(this).val();
                    if ($(keyToCss("main")).length) {
                        $(keyToCss("main")).css("margin-left", `${$(this).val()}px`);
                    }
                }
                updatePreferences(configPreferences);
            });
            $(keyToCss("menuContainer")).has('use[href="#managed-icon__live-video"]').add($(keyToCss("navItem")).has('use[href="#managed-icon__coins"]')).add($(keyToCss("listTimelineObject")).has($(keyToCss("liveMarquee")))).hide()
            $(keyToCss("timelineHeader")).toggle(!$("#__c1").is(":checked"));
            $(keyToCss("menuContainer")).has('use[href="#managed-icon__explore"]').toggle(!$("#__c4").is(":checked"));
            $(keyToCss("menuContainer")).has('use[href="#managed-icon__shop"]').toggle(!$("#__c5").is(":checked"));
            if (match.includes(location.pathname.split("/")[1])) {
                waitFor(keyToCss("sidebar")).then(() => {
                    $(keyToCss("sidebar")).prepend($("<div style='margin-bottom: 20px;'>"));
                    $(keyToCss("sidebar")).prepend($config);
                    $(keyToCss("sidebar")).prepend($info);
                    waitFor(keyToCss("searchSidebarItem")).then(() => {
                        $(keyToCss("sidebarItem")).has(keyToCss("recommendedBlogs")).toggle(!$("#__c2").is(":checked"));
                        $(keyToCss("sidebarItem")).has(keyToCss("radar")).toggle(!$("#__c3").is(":checked"));
                    });
                });
            }
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
        while (retries++ < 1000 && (typeof tumblr === "undefined" || typeof tumblr.getCssMap === "undefined")) {
            await new Promise((resolve) => setTimeout(resolve));
        }
        const cssMap = await tumblr.getCssMap();
        const keyToClasses = (...keys) => keys.flatMap(key => cssMap[key]).filter(Boolean);
        const keyToCss = (...keys) => `:is(${keyToClasses(...keys).map(className => `.${className}`).join(", ")})`;
        return { keyToCss };
    }
});
