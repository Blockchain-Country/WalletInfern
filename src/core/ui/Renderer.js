class Renderer {
  constructor(app) {
    this.app = app;
  }

  renderUI() {
    this.renderCurrency();
    this.renderBalance();
    this.renderAddress();
  }

  renderCurrency() {
    let element = document.getElementById("currency_name");
    element.innerHTML = this.app.getCurrency();
  }

  renderBalance() {
    let element = document.getElementById("balance_text");
    console.log("Renderer renderBalance before")
    this.app.getCurrentBalance().then((balance) => {
      console.log("Renderer renderBalance:", balance )
      element.innerHTML = `${balance.toFixed(4)} ${this.app.getCurrency()}`;
    });
  }

  renderAddress() {
    let addressTextElement = document.getElementById("address_text");
    let qrElement = document.getElementById("qr_address");
    this.app.getAddress().then((address) => {
      addressTextElement.innerHTML = address;
      qrElement.value = address;
    });
  }
}

module.exports = Renderer;
