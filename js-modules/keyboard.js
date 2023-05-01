// import buttons first
import allButtons from "./buttons.js";

const engl = "en";
const russ = "ru";
const lowerCase = "normal";
const capitalCase = "shifted";
const autoLang = "keyboardLang";
class keyboardBlock {
  constructor() {
    this.lang = localStorage.getItem(autoLang) || engl;
    this.capitalize = lowerCase;
    this.capslocked = false;
  }

  makeButton() {
    const part = document.createDocumentFragment();
    const keyCodes = Object.keys(allButtons);
    keyCodes.forEach((key) => {
      const button = document.createElement("div");
      button.textContent = allButtons[key].key[this.capitalize][this.lang];
      button.classList.add("keyboard__button");
      button.classList.add(`keyboard__button_width_${allButtons[key].width}`);
      button.dataset.code = key;
      part.appendChild(button);
    });

    return part;
  }

  chooseLanguage() {
    this.lang = this.lang === engl ? russ : engl;
  }

  capitalShift() {
    this.capitalize = this.capitalize === lowerCase ? capitalCase : lowerCase;
  }

  capslockToggle() {
    this.capslocked = !this.capslocked;
  }

  showButton() {
    const keyboardBtns = document.querySelectorAll(".keyboard__button");
    for (let i = 0; i < keyboardBtns.length; i += 1) {
      keyboardBtns[i].textContent =
        allButtons[keyboardBtns[i].dataset.code].key[this.capitalize][
          this.lang
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
      '<div class="lang__add"><p>Change language: <span>alt</span> + <span>ctrl.</br>Created on macOS</span></p></div>';
    language.classList.add("language");
    conteiner.appendChild(keyboard);
    keyboard.appendChild(this.makeButton());
    conteiner.appendChild(language);
    document.body.appendChild(conteiner);
    const shiftKey = document.querySelectorAll('[data-code*="Shift');
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

        document
          .querySelector(`[data-code="${e.code}"]`)
          .classList.add("keyboard__button_active");
        const startText = textblock.selectionStart;
        const indent = "\t";
        const lineBreak = "\n";

        if (allButtons[e.code].type === "print") {
          if (startText === textblock.selectionEnd) {
            textblock.value =
              textblock.value.slice(0, startText) +
              allButtons[e.code].key[this.capitalize][this.lang] +
              textblock.value.slice(textblock.selectionStart);
          } else {
            textblock.setRangeText(
              allButtons[e.code].key[this.capitalize][this.lang]
            );
          }
          textblock.selectionStart = startText + 1;
          textblock.selectionEnd = textblock.selectionStart;
        } else if (allButtons[e.code].type === "func") {
          switch (e.code) {
            case "Backspace":
              if (startText === textblock.selectionEnd) {
                if (startText > 0) {
                  textblock.value =
                    textblock.value.slice(0, startText - 1) +
                    textblock.value.slice(startText);
                  textblock.selectionStart = startText - 1;
                  textblock.selectionEnd = textblock.selectionStart;
                }
              } else {
                textblock.setRangeText("");
              }
              break;
            case "NumpadDecimal":
              if (startText === textblock.selectionEnd) {
                if (startText < textblock.value.length) {
                  textblock.value =
                    textblock.value.slice(0, startText) +
                    textblock.value.slice(startText + 1);
                  textblock.selectionStart = startText;
                  textblock.selectionEnd = textblock.selectionStart;
                }
              } else {
                textblock.setRangeText("");
              }
              break;
            case "Tab":
              if (startText === textblock.selectionEnd) {
                textblock.value =
                  textblock.value.slice(0, startText) +
                  indent +
                  textblock.value.slice(textblock.selectionStart);
              } else {
                textblock.setRangeText(indent);
              }
              textblock.selectionStart = startText + 1;
              textblock.selectionEnd = textblock.selectionStart;
              break;
            case "Enter":
              if (startText === textblock.selectionEnd) {
                textblock.value =
                  textblock.value.slice(0, startText) +
                  lineBreak +
                  textblock.value.slice(textblock.selectionStart);
              } else {
                textblock.setRangeText(lineBreak);
              }
              textblock.selectionStart = startText + 1;
              textblock.selectionEnd = textblock.selectionStart;
              break;
            default:
              break;
          }
        }
      }
    });

    document.addEventListener("keyup", (e) => {
      if (allButtons[e.code]) {
        e.preventDefault();
        document
          .querySelector(`[data-code="${e.code}"]`)
          .classList.remove("keyboard__button_active");

        if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
          this.capitalShift();
          this.showButton();
        }
        if (e.code === "AltLeft" || e.code === "AltRight") {
          if (e.ctrlKey) {
            this.chooseLanguage();
            this.showButton();
          }
        }
        if (e.code === "CapsLock") {
          this.capitalShift();
          this.showButton();
          this.capslockToggle();
          capslockKey.classList.toggle("keyboard__button_capslock_active");
        }
      }
    });

    const mouseOn = (e) => {
      if (e.target.classList.contains("keyboard__button")) {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { code: e.target.dataset.code })
        );
      }
    };
    const mouseOff = (e) => {
      document.dispatchEvent(
        new KeyboardEvent("keyup", { code: e.target.dataset.code })
      );
      e.target.removeEventListener("mouseup", mouseOff);
      e.target.removeEventListener("mouseout", mouseOff);
      textblock.focus();
    };

    document.addEventListener("mousedown", (e) => {
      mouseOn(e);
      e.target.addEventListener("mouseup", mouseOff);
      e.target.addEventListener("mouseout", mouseOff);
    });

    window.addEventListener("beforeunload", () => {
      localStorage.setItem(autoLang, this.lang);
    });
  }
}

export default keyboardBlock;
