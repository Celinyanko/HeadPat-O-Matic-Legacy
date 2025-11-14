/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details. */
// ==UserScript==
// @name         HeadPat-O-Matic (Legacy)
// @namespace    Celinyanko
// @version      0.1a
// @description  A BCAR-style compact button to perform activity on everyone in room, with all configs centralized
// @author       Celiko, Likolisu
// @include      /^https:\/\/(www\.)?bondageprojects\.elementfx\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include      /^https:\/\/(www\.)?bondage-europe\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include      /^https:\/\/(www\.)?bondage-asia\.com\/(C|c)lub\/R\d+\/?$/
// @match        http://localhost:*/*
// @grant        none
// ==/UserScript==
//SDK
var bcModSdk=function(){"use strict";const o="1.2.0";function e(o){alert("Mod ERROR:\n"+o);const e=new Error(o);throw console.error(e),e}const t=new TextEncoder;function n(o){return!!o&&"object"==typeof o&&!Array.isArray(o)}function r(o){const e=new Set;return o.filter((o=>!e.has(o)&&e.add(o)))}const i=new Map,a=new Set;function c(o){a.has(o)||(a.add(o),console.warn(o))}function s(o){const e=[],t=new Map,n=new Set;for(const r of f.values()){const i=r.patching.get(o.name);if(i){e.push(...i.hooks);for(const[e,a]of i.patches.entries())t.has(e)&&t.get(e)!==a&&c(`ModSDK: Mod '${r.name}' is patching function ${o.name} with same pattern that is already applied by different mod, but with different pattern:\nPattern:\n${e}\nPatch1:\n${t.get(e)||""}\nPatch2:\n${a}`),t.set(e,a),n.add(r.name)}}e.sort(((o,e)=>e.priority-o.priority));const r=function(o,e){if(0===e.size)return o;let t=o.toString().replaceAll("\r\n","\n");for(const[n,r]of e.entries())t.includes(n)||c(`ModSDK: Patching ${o.name}: Patch ${n} not applied`),t=t.replaceAll(n,r);return(0,eval)(`(${t})`)}(o.original,t);let i=function(e){var t,i;const a=null===(i=(t=m.errorReporterHooks).hookChainExit)||void 0===i?void 0:i.call(t,o.name,n),c=r.apply(this,e);return null==a||a(),c};for(let t=e.length-1;t>=0;t--){const n=e[t],r=i;i=function(e){var t,i;const a=null===(i=(t=m.errorReporterHooks).hookEnter)||void 0===i?void 0:i.call(t,o.name,n.mod),c=n.hook.apply(this,[e,o=>{if(1!==arguments.length||!Array.isArray(e))throw new Error(`Mod ${n.mod} failed to call next hook: Expected args to be array, got ${typeof o}`);return r.call(this,o)}]);return null==a||a(),c}}return{hooks:e,patches:t,patchesSources:n,enter:i,final:r}}function l(o,e=!1){let r=i.get(o);if(r)e&&(r.precomputed=s(r));else{let e=window;const a=o.split(".");for(let t=0;t<a.length-1;t++)if(e=e[a[t]],!n(e))throw new Error(`ModSDK: Function ${o} to be patched not found; ${a.slice(0,t+1).join(".")} is not object`);const c=e[a[a.length-1]];if("function"!=typeof c)throw new Error(`ModSDK: Function ${o} to be patched not found`);const l=function(o){let e=-1;for(const n of t.encode(o)){let o=255&(e^n);for(let e=0;e<8;e++)o=1&o?-306674912^o>>>1:o>>>1;e=e>>>8^o}return((-1^e)>>>0).toString(16).padStart(8,"0").toUpperCase()}(c.toString().replaceAll("\r\n","\n")),d={name:o,original:c,originalHash:l};r=Object.assign(Object.assign({},d),{precomputed:s(d),router:()=>{},context:e,contextProperty:a[a.length-1]}),r.router=function(o){return function(...e){return o.precomputed.enter.apply(this,[e])}}(r),i.set(o,r),e[r.contextProperty]=r.router}return r}function d(){for(const o of i.values())o.precomputed=s(o)}function p(){const o=new Map;for(const[e,t]of i)o.set(e,{name:e,original:t.original,originalHash:t.originalHash,sdkEntrypoint:t.router,currentEntrypoint:t.context[t.contextProperty],hookedByMods:r(t.precomputed.hooks.map((o=>o.mod))),patchedByMods:Array.from(t.precomputed.patchesSources)});return o}const f=new Map;function u(o){f.get(o.name)!==o&&e(`Failed to unload mod '${o.name}': Not registered`),f.delete(o.name),o.loaded=!1,d()}function g(o,t){o&&"object"==typeof o||e("Failed to register mod: Expected info object, got "+typeof o),"string"==typeof o.name&&o.name||e("Failed to register mod: Expected name to be non-empty string, got "+typeof o.name);let r=`'${o.name}'`;"string"==typeof o.fullName&&o.fullName||e(`Failed to register mod ${r}: Expected fullName to be non-empty string, got ${typeof o.fullName}`),r=`'${o.fullName} (${o.name})'`,"string"!=typeof o.version&&e(`Failed to register mod ${r}: Expected version to be string, got ${typeof o.version}`),o.repository||(o.repository=void 0),void 0!==o.repository&&"string"!=typeof o.repository&&e(`Failed to register mod ${r}: Expected repository to be undefined or string, got ${typeof o.version}`),null==t&&(t={}),t&&"object"==typeof t||e(`Failed to register mod ${r}: Expected options to be undefined or object, got ${typeof t}`);const i=!0===t.allowReplace,a=f.get(o.name);a&&(a.allowReplace&&i||e(`Refusing to load mod ${r}: it is already loaded and doesn't allow being replaced.\nWas the mod loaded multiple times?`),u(a));const c=o=>{let e=g.patching.get(o.name);return e||(e={hooks:[],patches:new Map},g.patching.set(o.name,e)),e},s=(o,t)=>(...n)=>{var i,a;const c=null===(a=(i=m.errorReporterHooks).apiEndpointEnter)||void 0===a?void 0:a.call(i,o,g.name);g.loaded||e(`Mod ${r} attempted to call SDK function after being unloaded`);const s=t(...n);return null==c||c(),s},p={unload:s("unload",(()=>u(g))),hookFunction:s("hookFunction",((o,t,n)=>{"string"==typeof o&&o||e(`Mod ${r} failed to patch a function: Expected function name string, got ${typeof o}`);const i=l(o),a=c(i);"number"!=typeof t&&e(`Mod ${r} failed to hook function '${o}': Expected priority number, got ${typeof t}`),"function"!=typeof n&&e(`Mod ${r} failed to hook function '${o}': Expected hook function, got ${typeof n}`);const s={mod:g.name,priority:t,hook:n};return a.hooks.push(s),d(),()=>{const o=a.hooks.indexOf(s);o>=0&&(a.hooks.splice(o,1),d())}})),patchFunction:s("patchFunction",((o,t)=>{"string"==typeof o&&o||e(`Mod ${r} failed to patch a function: Expected function name string, got ${typeof o}`);const i=l(o),a=c(i);n(t)||e(`Mod ${r} failed to patch function '${o}': Expected patches object, got ${typeof t}`);for(const[n,i]of Object.entries(t))"string"==typeof i?a.patches.set(n,i):null===i?a.patches.delete(n):e(`Mod ${r} failed to patch function '${o}': Invalid format of patch '${n}'`);d()})),removePatches:s("removePatches",(o=>{"string"==typeof o&&o||e(`Mod ${r} failed to patch a function: Expected function name string, got ${typeof o}`);const t=l(o);c(t).patches.clear(),d()})),callOriginal:s("callOriginal",((o,t,n)=>{"string"==typeof o&&o||e(`Mod ${r} failed to call a function: Expected function name string, got ${typeof o}`);const i=l(o);return Array.isArray(t)||e(`Mod ${r} failed to call a function: Expected args array, got ${typeof t}`),i.original.apply(null!=n?n:globalThis,t)})),getOriginalHash:s("getOriginalHash",(o=>("string"==typeof o&&o||e(`Mod ${r} failed to get hash: Expected function name string, got ${typeof o}`),l(o).originalHash)))},g={name:o.name,fullName:o.fullName,version:o.version,repository:o.repository,allowReplace:i,api:p,loaded:!0,patching:new Map};return f.set(o.name,g),Object.freeze(p)}function h(){const o=[];for(const e of f.values())o.push({name:e.name,fullName:e.fullName,version:e.version,repository:e.repository});return o}let m;const y=void 0===window.bcModSdk?window.bcModSdk=function(){const e={version:o,apiVersion:1,registerMod:g,getModsInfo:h,getPatchingInfo:p,errorReporterHooks:Object.seal({apiEndpointEnter:null,hookEnter:null,hookChainExit:null})};return m=e,Object.freeze(e)}():(n(window.bcModSdk)||e("Failed to init Mod SDK: Name already in use"),1!==window.bcModSdk.apiVersion&&e(`Failed to init Mod SDK: Different version already loaded ('1.2.0' vs '${window.bcModSdk.version}')`),window.bcModSdk.version!==o&&alert(`Mod SDK warning: Loading different but compatible versions ('1.2.0' vs '${window.bcModSdk.version}')\nOne of mods you are using is using an old version of SDK. It will work for now but please inform author to update`),window.bcModSdk);return"undefined"!=typeof exports&&(Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=y),y}();
//SDK end

(function () {
  const modApi = bcModSdk.registerMod({
    //change name as required when duplicating
    name: "HeadPat-O-Matic",
    fullName: "HeadPat-O-Matic",
    version: "0.1 Now with Item Perms, map distance and actions respect!",
    repository: ` https://github.com/Celinyanko/HeadPat-O-Matic-Legacy/`,
  });
  ("use strict");

  //change name as required when duplicating
  if (window.PatAllLegacyButtonLoaded) return;
  window.PatAllLegacyButtonLoaded = true;

  // === 🔧 Global Settings ===
  //change these as required when duplicating
  const buttonNumber = 0;
  const buttonId = `headpatOMaticButton${buttonNumber}`;//Rename this if duplicating
  const buttonText = "🫳";
  const focusGroupName = "ItemHead";
  const activityName = "Pet"; // action name string（ Pet、Slap ）- WARNING: MAY BREAK IN R122!!!

  const buttonSize = 24;
  const topOffset = `calc(50% - ${buttonSize}px - ${buttonNumber * buttonSize}px)`; // Button location: Lower left side, slightly below center
  const buttonColor = "#302010"; //background colour
  const textColor = "#ffccd5";
  const checkInterval = 1000; // how often to check if we're actually in a chatroom to draw button

  const delayTime = 500; // delay between actioning against chatroom members

  // === 💡 action delay ===
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // === 🎯 netcode magic ===
  function makeActivityPacket(target) {
    return {
      Content: `ChatOther-${focusGroupName}-${activityName}`,
      Type: "Activity",
      Dictionary: [
        { SourceCharacter: Player.MemberNumber },
        { TargetCharacter: target },
        { Tag: "FocusAssetGroup", FocusGroupName: focusGroupName },
        { ActivityName: activityName },
      ],
    };
  }

  // === 🧱 create and draw button ===
  let btn = null;

  function createStyledButton() {
    if (btn) return;

    btn = document.createElement("div");
    btn.id = buttonId;
    btn.innerText = buttonText;

    Object.assign(btn.style, {
      position: "fixed",
      top: topOffset,
      left: "0px",
      width: `${buttonSize}px`,
      height: `${buttonSize}px`,
      backgroundColor: buttonColor,
      color: textColor,
      border: "1px solid #888",
      borderRadius: "0px",
      fontSize: "9px",
      fontWeight: "bold",
      textAlign: "center",
      lineHeight: "24px",
      whiteSpace: "nowrap",
      cursor: "pointer",
      zIndex: "1000",
      userSelect: "none",
      display: "none",
    });

    btn.onclick = async () => {
      if (typeof ChatRoomCharacter !== "undefined" && Array.isArray(ChatRoomCharacter)) {
        let randSeed = Math.random();
        let msg = null;

        if (Player.CanInteract()) {
          for (const C of ChatRoomCharacter) {

            //change as required
            const permissionsError = [
              {Tag: "Beep",Text: `${CharacterNickname(Player)} was about to headpat ${CharacterNickname(C)} but decided not.`,},
              {Tag: "Beep",Text: `${CharacterNickname(Player)} had thoughts of headpatting ${CharacterNickname(C)} but shied away`,},
              {Tag: "Beep",Text: `${CharacterNickname(C)}'s A.T. Field proved to be too powerful for ${CharacterNickname(Player)}'s terrible attempt at headpatting`,},
              {Tag: "Beep",Text: `${CharacterNickname(C)}'s magical defenses proved to be too inpenetrable for ${CharacterNickname(Player)}'s wishes to headpat them'`,},
              {Tag: "Beep",Text: `${CharacterNickname(C)} dodged ${CharacterNickname(Player)}'s headpat`,},
              {Tag: "Beep",Text: `${CharacterNickname(C)}'s evasion skill was too high for ${CharacterNickname(Player)}'s accuracy`,},
            ];
            const permissionsErrorLength = permissionsError.length;

            let interactionPermissionCheck = ServerChatRoomGetAllowItem(Player,C);//people get very angry otherwise
            let activityDistanceBlocked = InventoryIsBlockedByDistance(C);//we're in map room and we're too far
            let activityPermissionCheck = ActivityCanBeDone(C,`${activityName}`,`${focusGroupName}`);//e.g. do they hate headpats?
            let activitySlotNotBlockedCheck = ActivityPossibleOnGroup(C,`${focusGroupName}`)//slot is not blocked (e.g. in a crate)

            let randomDeny = randSeed * permissionsErrorLength;

            if (C.MemberNumber !== Player.MemberNumber) {
              if (activityDistanceBlocked === false && activitySlotNotBlockedCheck === true)
              {
                if (interactionPermissionCheck === true && activityPermissionCheck === true)
                {
                  //TODO: different error message for each permission type failure
                  const packet = makeActivityPacket(C.MemberNumber);
                  ServerSend("ChatRoomChat", packet);
                }
                else
                {
                  randomDeny = randomDeny + 1;
                  randomDeny = Math.floor(randSeed + randomDeny);

                  while (randomDeny > permissionsErrorLength) {randomDeny = randomDeny - permissionsErrorLength;}
                  const dict = permissionsError[Math.floor(randomDeny)];
                  ServerSend("ChatRoomChat", {Content: "Beep",Type: "Action",Dictionary: [dict],});
                }
                //else return nothing if we're too far in a map so we don't spam the chatroom, but you can technically spit out a message "but failed to reach XYZ!"
                //TODO if not lazy: custom one-fits-all flavour text for blocked slot
              }
              await delay(delayTime);
            }
          }
        }
        else
        {
          //change as required
          const boundUpError = [
            {Tag: "Beep",Text: `${CharacterNickname(Player)} tried to extend their limbs but struggles in their bondage`,},
            {Tag: "Beep",Text: `${CharacterNickname(Player)} had various thoughts of headpatting the room members but is physically incapable of doing so`,},
            {Tag: "Beep",Text: `${CharacterNickname(Player)} whimpers in their predicament`,},
            {Tag: "Beep",Text: `Squeeks and ruffling can be heard from ${CharacterNickname(Player)}'s general direction'`,},
            {Tag: "Beep",Text: `${CharacterNickname(Player)} could only imagine petting the room's occupants`,},
            {Tag: "Beep",Text: `Cute sounds emerge from ${CharacterNickname(Player)}`,},
            {Tag: "Beep",Text: `${CharacterNickname(Player)}'s evasion skill seems a little inadequate`,},
          ];

          const dict = boundUpError[Math.floor(randSeed * boundUpError.length)];
          ServerSend("ChatRoomChat", {Content: "Beep",Type: "Action",Dictionary: [dict],});
        }
      }
    };

    document.body.appendChild(btn);
  }

  // === 👀 update display ===
  function updateButtonVisibility() {
    const inRoom =
      CurrentScreen === "ChatRoom" &&
      typeof ChatRoomCharacter !== "undefined" &&
      Array.isArray(ChatRoomCharacter) &&
      document.getElementById("InputChat");

    if (!btn) createStyledButton();
    btn.style.display = inRoom ? "block" : "none";
  }

  // === ⏱️ Check for button visibility periodically ===
  setInterval(updateButtonVisibility, checkInterval);
})();
