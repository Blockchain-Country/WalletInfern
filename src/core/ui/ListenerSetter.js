class ListenerSetter {
    constructor(app) {
        this.app = app;
    }

    setEventListener() {
        this.setSendListener();
        this.setDisplayModalListener();
        this.setCloseModalListener();
    }

    setSendListener() {
        let address_input = document.getElementById("address_input");
        let amount_input = document.getElementById("amount_input");
        let submitBtn = document.getElementById("submit");
        submitBtn.addEventListener("click", (event) => {
            const to = address_input.value;
            const amount = amount_input.value;
            submitBtn.disabled = true;
            this.app.sendFunds(to, amount).then((result) => {
                alert(result);
                submitBtn.disabled = false; // Enable submit button after event is completed
                amount_input.value = null;
                address_input.value = null;
            }).catch((error) => {
                alert(error);
                submitBtn.disabled = false; // Enable submit button on error
            });
        });
    }

    setDisplayModalListener() {
        let currencyName = "";
        let buttons = document.getElementsByClassName("w3_button");
        let modal = document.querySelector(".modal");
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
        let modal = document.querySelector('.modal');
        let closeModal = document.querySelector('.close_modal');
        let address_input = document.getElementById("address_input");
        let amount_input = document.getElementById("amount_input");
        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
            amount_input.value = null;
            address_input.value = null;
        });
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
                amount_input.value = null;
                address_input.value = null;
            }
        })
    }
}

module.exports = ListenerSetter;
