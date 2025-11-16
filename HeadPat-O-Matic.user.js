/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details. */
// ==UserScript==
// @name         HeadPat-O-Matic (Legacy) (v3)
// @namespace    Celinyanko
// @version      0.3
// @description  A BCAR-style compact button to perform activity on everyone in room, with all configs centralized
// @author       Celiko, Likolisu, Kanon
// @include      /^https:\/\/(www\.)?bondageprojects\.elementfx\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include      /^https:\/\/(www\.)?bondage-europe\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include      /^https:\/\/(www\.)?bondage-asia\.com\/(C|c)lub\/R\d+\/?$/
// @require      https://awdrrawd.github.io/liko-Plugin-Repository/Plugins/expand/bcmodsdk.js
// @match        http://localhost:*/*
// @grant        none
// ==/UserScript==

(function () {
  function loadStupidButton() {
    const version = 0.3;
    const purpose = "Headpat"; // change as required
    const duplicateCheck = `Headpat-O-Matic_v${version}_${purpose}`;

    const modApi = bcModSdk.registerMod({
      name: "HeadPat-O-Matic",
      fullName: "HeadPat-O-Matic",
      version: version.toString() + "(" + purpose + ")",
      repository: ` https://github.com/Celinyanko/HeadPat-O-Matic-Legacy/`,
    });
    ("use strict");

    // change name as required when duplicating
    if (window[duplicateCheck]) return;
    window[duplicateCheck] = true;

    console.log(`[HEADPAT-O-MATIC]: v${version} (${purpose}) ready!`);


    // === 🔧 Global Settings ===
    // change these as required when duplicating
    const buttonNumber = 0; // Determines button position
    const buttonId = `headpatOMaticButton${buttonNumber}`;// Rename this if duplicating
    const buttonText = "🫳";
    const focusGroupName = "ItemHead"; // get from AssetGroup
    const activityName = "Pet"; // action name string（ Pet、Slap ）- WARNING: MAY BREAK IN R122!!!

    const buttonSize = 24;
    const topOffset = `calc(50% - ${buttonSize}px - ${buttonNumber * buttonSize}px)`; //Button location: middle left side, stacking vertically up
    const buttonColor = "#302010"; // background colour
    const textColor = "#ffccd5";
    const checkInterval = 1000; // msec interval check if we're actually in a chatroom to draw button
    const delayTime = 500; // msec delay between actioning against chatroom members

    // Struggle/Permission blocked dialogues: Change as required
    const permissionErrorStrings = [
      "$SOURCE was about to headpat $TARGET but decided not.",
      "$SOURCE had thoughts of headpatting $TARGET but shied away.",
      "$TARGET's A.T. Field proved to be too powerful for $SOURCE's terrible attempt at headpatting.",
      "$TARGET's magical defenses proved to be too inpenetrable for $SOURCE's wishes to headpat them.",
      "$TARGET dodged $SOURCE's headpat.",
      "$TARGET's evasion skill was too high for $SOURCE's accuracy.",
    ];

    const boundUpErrorStrings = [
      "$SOURCE tried to extend their limbs but struggles in their bondage.",
      "$SOURCE had various thoughts of headpatting the room members but is physically incapable of doing so.",
      "$SOURCE whimpers in their predicament.",
      "Squeeks and ruffling can be heard from $SOURCE's general direction.",
      "$SOURCE could only imagine petting the room's occupants.",
      "Cute sounds emerge from $SOURCE.",
      "$SOURCE's evasion skill seems a little inadequate.",
    ];

    const errors = new Map([
      ["bound", { strs: boundUpErrorStrings, self_only: true, } ],
      ["permission", { strs: permissionErrorStrings, self_only: false, } ],
    ]);

    // I actually hate this function
    function randomErrorString(error_type, C = null) {
      const error_obj = errors.get(error_type);
      if (!error_obj.self_only && !C) return; // silently do nothing

      const index = Math.floor(Math.random() * error_obj.strs.length);

      let str = error_obj.strs[index];
      str = str.replaceAll("$SOURCE", CharacterNickname(Player));
      if (!error_obj.self_only) str = str.replaceAll("$TARGET", CharacterNickname(C));

      return str;
    }


    const activity = { Activity: ActivityFemale3DCG.find(e => e.Name === activityName) }; // kind of bullshit

    // fuck off with that undefined bullshit
    function targetGroup() {
      return AssetGroup.find(e => e.Name === focusGroupName);
    }

    // === 💡 action delay ===
    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function isTargetReachable(C) {
      return !InventoryIsBlockedByDistance(C) && ActivityPossibleOnGroup(C, focusGroupName);
    }

    function isActivityAllowed(C) {
      return ServerChatRoomGetAllowItem(Player, C) && ActivityCanBeDone(C, activityName, focusGroupName);
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
        opacity: 0.75,
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
        if (typeof ChatRoomCharacter === "undefined" && !Array.isArray(ChatRoomCharacter)) return;

        if (Player.CanInteract()) {
          for (const C of ChatRoomCharacter.filter((C) => C != Player)) {
            if (!isTargetReachable(C)) continue;

            await delay(delayTime);

            if (isActivityAllowed(C)) {
              // TODO: different error message for each permission type failure
              ActivityRun(Player, C, targetGroup(), activity);
              continue;
            }

            const permissionErrorString = randomErrorString("permission", C);

            const dict = {
              Tag: "Beep",
              Text: permissionErrorString,
            };
            const obj = {
              Content: "Beep",
              Type: "Action",
              Dictionary: [dict],
            };
            ServerSend("ChatRoomChat", obj);
            console.log("ChatRoomChat", obj);

            // TODO if not lazy: custom one-fits-all flavour text for blocked slot
          }

          return;
        }

        const boundUpError = randomErrorString("bound");

        const dict = {
          Tag: "Beep",
          Text: boundUpError,
        };
        const obj = {
          Content: "Beep",
          Type: "Action",
          Dictionary: [dict],
        };
        ServerSend("ChatRoomChat", obj);
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
  }

  // AssetGroup must return a value
  function waitToLoad()
  {
    // fucking save me
    if(typeof AssetGroup !== 'undefined' && Array.isArray(AssetGroup) && ChatRoomCharacterViewIsActive() === true) {
      loadStupidButton();

    } else {
      console.log("[HEADPAT-O-MATIC]: Waiting for AssetGroup to exist... ");

      setTimeout(waitToLoad, 3000);
    }
  }

  // initialise!
  waitToLoad();
})();

