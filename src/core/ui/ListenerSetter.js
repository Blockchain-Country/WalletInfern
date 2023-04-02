class ListenerSetter {
    constructor(app) {
        this.app = app;
    }

    setEventListener() {
        this.setSendListener();
        this.setDisplayModalListener();
        this.setCloseModalListener();
        // this.setOpenModalListener();
    }

    setSendListener() {
        document.getElementById("submit").addEventListener("click", (event) => {
            const to = document.getElementById("address_input").value;
            const amount = document.getElementById("amount_input").value;
            this.app.sendFunds(to, amount).then((result) => {
                alert(result);
            });
        });
    }

    setDisplayModalListener() {
        let currencyName = "";
        const buttons = document.getElementsByClassName("w3_button");
        const modal = document.getElementsByClassName("modal")[0]; // get the first element in the collection
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", (event) => {
                // let currencyNameText = event.target.textContent;
                currencyName = event.target.id;
                this.app.changeCurrency(currencyName)
                // let element = document.getElementById("currency_name");
                // element.innerHTML = currencyNameText;
                modal.style.display = "block";
            });
        }
    }

    setCloseModalListener(event) {
        let elements = document.getElementsByClassName("close_modal");
        const modal = document.getElementsByClassName("modal")[0];
        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", () => {
                modal.style.display = "none";
                document.getElementById("address_input").value = "";
                document.getElementById("amount_input").value = "";
            });
        }
    }

    // setOpenModalListener() {
    //   const buttons = document.getElementsByClassName("w3_button");
    //   const modal = document.getElementsByClassName("modal")[0]; // get the first element in the collection
    //   for (let i = 0; i < buttons.length; i++) {
    //     buttons[i].addEventListener("click", () => {
    //       modal.style.display = "block";
    //     });
    //   }
    // }
}

module.exports = ListenerSetter;
