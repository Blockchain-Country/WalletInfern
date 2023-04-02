const Renderer = require("./Renderer");
const ListenerSetter = require("./ListenerSetter");

class WalletUI {
    constructor(app) {
        this.app = app;
        this.renderer = new Renderer(app);
        this.listenerSetter = new ListenerSetter(app);
        this.listenerSetter.setEventListener();
    }

    prepareUI() {
        this.renderer.renderUI();
    }
}

module.exports = WalletUI;
