class Renderer {
  constructor(app) {
    this.app = app;
  }

  renderUI() {
    this.renderCurrency();
    this.renderBalance();
    this.renderAddress();
    this.renderQrCode();
  }

  renderCurrency() {
    let element = document.getElementById("currency_name");
    element.innerHTML = this.app.getCurrency();
  }

  renderBalance() {
    let element = document.getElementById("balance_text");
    this.app.getBalance().then((balance) => {
      element.innerHTML = `${balance.toFixed(4)} ${this.app.getCurrency()}`;
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
