import data from "./languageData.json";

class LanguageManager {
    constructor(language="en") {
        this.language = language;
        this.validCharRegEx = new RegExp(data[language]["validChar"]);
        this.specialCharRegEx = new RegExp(data[language]["specialChar"]);
        this.wordSeparatorRegEx = new RegExp(data[language]["wordSeparator"]);
        this.keyboardRows = data[language]["keyboardRows"];
        this.phrases = data[language]["words"];
    }

    isValidChar(char) {
        return this.validCharRegEx.test(char);
    }

    isSpecialChar(char) {
        return this.specialCharRegEx.test(char);
    }

    // Note: includes separators but not spaces in returned strings
    getWords(str) {
        return str.split(this.wordSeparatorRegEx);
    }

    getKeyboardRows() {
        return this.keyboardRows;
    }

    getRandomPhrase() {
        var randomInt = Math.floor(Math.random() * this.phrases.length);
        return this.phrases[randomInt];
    }
}

let languageManager = new LanguageManager();
export default languageManager;