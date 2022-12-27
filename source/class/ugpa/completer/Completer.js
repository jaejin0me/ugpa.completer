qx.Class.define("ugpa.completer.Completer", {
    extend: qx.core.Object,
    implement: [qx.ui.form.IModel],

    construct(model, widget) {
        // noinspection JSAnnotator
        super();
        if (model){
            this.setModel(model);
        }
        this.initPopup(new qx.ui.menu.Menu());
        this.setWidget(widget);
        this.__filterFunc = this.__getFilterModeFunc();
    },

    events: {
        "activated": "qx.event.type.Event",
        "highlighted": "qx.event.type.Event"
    },

    properties: {
        model: {
            init: null,
            apply: "_applyModel",
            event: "changeModel"
        },

        autofocus: {
            init: false,
            check: "Boolean"
        },

        caseSensitivity: {
            init: true,
            check: "Boolean"
        },

        minLength: {
            init: 1
        },

        maxVisibleItems: {
            init: 7,
            check: "Integer"
        },

        widget: {
            init: null,
            apply: "_applyWidget"
        },

        popup: {
            deferredInit: true,
            apply: "_applyPopup"
        },

        filterMode: {
            init: "startsWith",
            check: ["startsWith", "contains", "endsWith"],
            apply: "_applyFilterMode"
        }
    },

    members: {
        _applyModel(model){
        },

        _applyWidget(widget){
            qx.Interface.assertObject(widget, ugpa.completer.IWidget);

            widget.addListener("input", this._onInput, this);
            widget.addListener("click", this._onFocus, this);
            widget.addListener("tap", this._onFocus, this);

            this.__updatePopupWidth();
        },

        __updatePopupWidth(){
            const popup = this.getPopup();
            if (popup){
                const widget = this.getWidget();
                if (widget){
                    popup.setWidth(widget.getWidth());
                }
            }
        },

        _applyPopup(popup){
            qx.Interface.assertObject(popup, ugpa.completer.IPopup);
            this.__updatePopupWidth();
        },

        _applyFilterMode(){
            this.__filterFunc = this.__getFilterModeFunc();
        },

        _onFocus(){
            const value = this.getWidget().getValue();
            if (!value && this.getMinLength() > 0){
                return;
            }
            const popup = this.getPopup();
            popup.show();
            popup.placeToWidget(this.getWidget());

            this.__applyInput(value === null ? "" : value);
        },

        _onInput(e){
            const input = e.getData();
            if (input.length < this.getMinLength()) {
                if (this.getPopup().isVisible()){
                    this.getPopup().hide();
                }
                return;
            }

            this.getPopup().show();
            this.getPopup().placeToWidget(this.getWidget());
            this.__applyInput(input);
        },

        __applyAutofocus(){
            if (this.getAutofocus()){
                const popup = this.getPopup();
                const firstButton = popup.getSelectables()[0];
                if (firstButton){
                    popup.setSelectedButton(firstButton);
                }
            }
        },

        __applyInput(input){
            this.__clearPopup();
            const values = this.__getValuesFromSourceByWord(input);
            values.slice(0, this.getMaxVisibleItems()).forEach(this.__addItemOnPopup, this);
            this.__applyAutofocus();
        },

        __addItemOnPopup(value){
            const button = new qx.ui.menu.Button(value);
            button.addListener("execute", this._onItemPressed, this);
            this.getPopup().add(button);
        },

        _onItemPressed(e){
            const button = e.getTarget();
            this.getWidget().setValue(button.getLabel());
        },

        __clearPopup(){
            const popup = this.getPopup();
            popup.removeAll();
        },

        __getValuesFromSourceByWord(input){
            let values;
            if (!this.getCaseSensitivity()){
                values = this.__filterCaseInsensitiveValues(input);
            } else {
                values = this.__filterCaseSensitiveValues(input);
            }
            return values;
        },

        __filterCaseInsensitiveValues(input){
            input = input.toLowerCase();
            return this.getModel().filter(value =>{
                value = value.toLowerCase();
                return this.__filterFunc(input)(value);
            });
        },

        __filterCaseSensitiveValues(input){
            return this.getModel().filter(this.__filterFunc(input));
        },

        __getFilterModeFunc(){
            const table = {
                startsWith: input => value => value.startsWith(input),
                contains: input => value => value.includes(input),
                endsWith: input => value => value.endsWith(input)
            };
            return table[this.getFilterMode()];
        }
    }
});