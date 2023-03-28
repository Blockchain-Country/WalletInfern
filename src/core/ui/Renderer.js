class Renderer {
  constructor(app) {
    this.app = app;
  }

  renderUI() {
    this.renderCurrency();
    this.renderBallance();
    this.renderAddress();
    this.renderQrCode();
  }

  renderCurrency() {
    let element = document.getElementById("currency_name");
    element.innerHTML = this.app.getCurrency();
  }

  renderBallance() {
    let element = document.getElementById("ballance_text");
    this.app.getBallance().then((balance) => {
      element.innerHTML = balance;
    });
  }

  renderAddress() {
    let element = document.getElementById("address_text");
    this.app.getAddress().then((address) => {
      element.innerHTML = address;
    });
  }

  renderQrCode() {
    let element = document.getElementById("qr_address");
    this.app.getAddress().then((address) => {
      element.value = address;
    });
  }
}

module.exports = Renderer;
