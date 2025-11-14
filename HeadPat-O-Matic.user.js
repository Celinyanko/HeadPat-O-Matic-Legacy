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
// @require      https://awdrrawd.github.io/liko-Plugin-Repository/Plugins/expand/bcmodsdk.js
// @match        http://localhost:*/*
// @grant        none
// ==/UserScript==

(function () {
  const modApi = bcModSdk.registerMod({
    //change name as required when duplicating
    name: "HeadPat-O-Matic",
    fullName: "HeadPat-O-Matic",
    version: "0.2",
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
                  while (randomDeny >= permissionsErrorLength)
                    {randomDeny = randomDeny - permissionsErrorLength;}
                  let denyPicker = Math.floor(randomDeny);
                  const dict = permissionsError[Math.floor(denyPicker)];
                  ServerSend("ChatRoomChat", {Content: "Beep",Type: "Action",Dictionary: [dict],});
                  console.log("ChatRoomChat", {Content: "Beep",Type: "Action",Dictionary: [dict],})
                  randomDeny = randomDeny + 1;
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
