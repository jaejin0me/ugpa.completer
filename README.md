# ugpa.completer

![2-Click-Screen-Recorder-20230414-122059 137](https://user-images.githubusercontent.com/22189134/232004212-16c1357c-3d43-482c-a14d-c64da64244b7.gif)

The Completer class provides completions based on an item model.
There are two implementations: one is based on `qx.ui.menu.Menu` and another one on `qx.ui.list.List`.
In the future I gonna leave `qx.ui.list.List` implementation because `qx.ui.menu.Menu` lacks some functionality which can't be added.
Inspired by JQuery UI Autocomplete widget and Qt Completer widget.

See how it looks and works [here](https://goldim.github.io/ugpa.completer/).


# API and Code Samples
So far there is no generated API docs but you may see code of Application Demo in `source` folder. 

# TODO
1. Get rid of menu and list separation - make one widget class
2. Make source as remote url and JSON string
3. Turn on/off icons for autocomplete items
