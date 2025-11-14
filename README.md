# HeadPat-O-Matic-Legacy
A silly monkey injector script for BC that adds a button which performs an action on everyone as as available. It obeys:
* interaction permission (e.g. user setting e.g. whitelist+)
* action permission (do they hate headpats?)
* range check (if on a map)
* if the slot is blocked by an item (e.g. they're in a crate)

Features a random flavour text picker when an error occurs due to lack of permission or if the player is physically incapable of performing the action

TODO:
- action selector
- softcode configurable flavour texts
- iterate through new actions and generate new buttons as needed
- more customisable flavour text pool instead of having to edit the code directly
- single-target single actions (e.g. if you interact with someone, you shouldn't throw the action for the entire room)
- split file into multiple files
- autoupdater (hopefully i dont break shit while people use it!)

[One click install](https://github.com/Celinyanko/HeadPat-O-Matic-Legacy/raw/refs/heads/main/HeadPat-O-Matic.user.js) for your monkey injector (This is NOT self updating!)

## How to add multiple actions

Currently this add-on does not feature multiple-action support (TODO!) but you can duplicate your mod and modify the following lines to add more actions

Button:
* `buttonNumber` (required! one number per button!)
* `buttonText` (so you know what you're clicking)

Action:
* `focusGroupName` (as required for the action)
* `activityName` (as required)

Flavour Text:
* `permissionsError` (as required)
* `boundUpError` (as required)

___

Known Issues:
* Blocked check doesn't work with gags?
* decode ActivityAsset for item interactions
