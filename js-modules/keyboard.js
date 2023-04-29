// import buttons first
import { allButtons } from "./buttons.js";

const en = "en";
const ru = "ru";
const lowerCase = "normal";
const capitalCase = "shifted";
const autoLang = "keyboardLang";
class keyboardBlock {
  constructor() {
    this.language = localStorage.getItem(autoLang) || en;
    this.capitalize = lowerCase;
    this.capslocked = false;
  }

  chooseLanguage() {
    this.language = this.language === en ? ru : en;
  }

  makeButton() {
    const part = document.createDocumentFragment();
    const keyCodes = Object.keys(allButtons);
    keyCodes.forEach((key) => {
      const button = document.createElement("div");
      button.textContent = allButtons[key].key[this.capitalize][this.language];
      button.classList.add("keyboard__button");
      button.classList.add(`keyboard__button_width_${allButtons[key].width}`);
      button.dataset.code = key;
      part.appendChild(button);
    });

    return part;
  }

  capitalShift() {
    this.capitalize = this.capitalize === lowerCase ? capitalCase : lowerCase;
  }

  capslockToggle() {
    this.capslocked = !this.capslocked;
  }

  showButton() {
    const keyboardBtns = document.querySelectorAll("keyboard__button");
    for (let i = 0; i < keyboardBtns.length; i += 1) {
      keyboardBtns[i].textContent =
        allButtons[keyboardBtns[i].dataset.code].key[this.capitalize][
          this.language
        ];
    }
  }

  init() {
    const conteiner = document.createElement("div");
    conteiner.classList.add("conteiner");
    const textblock = document.createElement("textarea");
    textblock.classList.add("textblock");
    conteiner.appendChild(textblock);
    const keyboard = document.createElement("div");
    keyboard.classList.add("keyboard");
    const language = document.createElement("div");
    language.innerHTML =
      '<div class="lang"><p>Change language: <span>alt</span> + <span>shift</span></p></div>';
    language.classList.add("language");
    conteiner.appendChild(keyboard);
    keyboard.appendChild(this.makeButton());
    conteiner.appendChild(language);
    document.body.appendChild(conteiner);
    const shiftKey = document.querySelectorAll('[data-code*="Shift"');
    const capslockKey = document.querySelector('[data-code="CapsLock"');
    capslockKey.classList.add("keyboard__button_capslock");
    document.addEventListener("keydown", (e) => {
      if (allButtons[e.code]) {
        e.preventDefault();
        if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
          if (
            !Array.from(shiftKey).some((element) =>
              element.classList.contains("keyboard__button_active")
            )
          ) {
            this.capitalShift();
          }
          this.showButton();
        }
      }
    });
    window.addEventListener("beforeunload", () => {
      localStorage.setItem(autoLang, this.language);
    });
  }
}

export default keyboardBlock;
