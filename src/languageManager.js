import data from "./languageData.json";

class LanguageManager {
    constructor(language="en") {
        this.language = language;
        this.validCharRegEx = new RegExp(data[language]["validChar"]);
        this.specialCharRegEx = new RegExp(data[language]["specialChar"]);
        this.wordSeparatorRegEx = new RegExp(data[language]["wordSeparator"]);
        this.keyboardRows = data[language]["keyboardRows"];
        this.phrases = data[language]["words"];
        /*
            Create an array of indices in the phrase array.
            This array will be used to select random phrases.
        */
        this.wordIndices = this.phrases.map((_, i) => i);
        console.log(this.wordIndices); 
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
        /*
        Of the indices of all phrases that have not yet been chosen, choose
        an index at random. Then, replace it with the highest-numbered index.
        This should prevent the user from encountering the same phrase two
        games in a row, until all phrases have been encountered at least once.
        */
        if(this.wordIndices.length <= 0)
            this.wordIndices = this.phrases.map((_, i) => i);
        console.log(this.wordIndices);
        var randomInt = Math.floor(Math.random() * this.wordIndices.length);
        var phraseIndex = this.wordIndices[randomInt];

        if(randomInt === this.wordIndices.length-1)
            this.wordIndices.pop();
        else
            this.wordIndices[randomInt] = this.wordIndices.pop();
        return this.phrases[phraseIndex];
    }
}

let languageManager = new LanguageManager();
export default languageManager;