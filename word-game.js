let boxSelectorArray = [];
let boxText = new Array(30);
let currentRow = 0;
let currentCol = 0;
const GET_URL = 'https://words.dev-apis.com/word-of-the-day'
const POST_URL = 'https://words.dev-apis.com/validate-word'
let word

async function getWord() {
    const promise = await fetch(GET_URL);
    const wordOfDay = await promise.json();
    return wordOfDay;
}

getWord().then(function (WOD) {
    let crazy = new String(WOD.word)
    word = crazy
})

console.log(word)
initBoxes()


let inputKey = document.addEventListener("keydown", function (event) {
    currentInput = (event.key).toUpperCase();
    isLetter = /^[A-Z]$/.test(String(currentInput));
    if (isLetter === true && currentCol <= 4 && currentRow <= 5) { addLetter(currentInput) }
    else if (currentInput === "BACK" || currentInput === "BACKSPACE") { backspace() }
    else if (currentInput === "ENTER" && currentCol === 5 && currentRow <= 5) { evalGuess() }
})

let inputClicks = document.addEventListener("click", function (event) {
    currentInput = (event.target.innerText).toUpperCase();
    isLetter = /^[A-Z]$/.test(String(currentInput));
    if (isLetter === true && currentCol <= 4 && currentRow <= 5) { addLetter(currentInput) }
    else if (currentInput === "BACK" || currentInput === "BACKSPACE") { backspace() }
    else if (currentInput === "ENTER" && currentCol === 5 && currentRow <= 5) { evalGuess() }
})


function initBoxes() {
    for (let i = 0; i < 30; i++) {
        boxString = '.box' + i;
        boxSelectorArray.push(document.querySelector(boxString));
    }
}

function concatBoxes(row) {
    word = ''
    for (let i = 0; i < 5; i++) {
        word += boxText[row, i];
    }
    return word
}

function addLetter(letter) {
    boxSelectorArray[currentCol + currentRow * 5].textContent = letter;
    boxText[currentCol + currentRow * 5] = letter;
    if (currentCol != 5) { currentCol++ }
}

function backspace() {
    if (currentCol != 0) { currentCol-- }
    boxSelectorArray[currentCol + currentRow * 5].textContent = "";
    boxText[currentCol + currentRow * 5] = "";

}

function evalGuess() {
    wordBuffer = word.toUpperCase();
    for (let i = 0; i < 5; i++) {
        if (boxSelectorArray[i + currentRow * 5].textContent === wordBuffer[i]) {
            boxSelectorArray[i + currentRow * 5].style.backgroundColor = "#00FF00";
            wordBuffer = wordBuffer.substring(0, i) + '*' + wordBuffer.substring(i + 1);
        }
    }
    for (let i = 0; i < 5; i++) {
        if (boxSelectorArray[i + currentRow * 5].textContent != wordBuffer[i]) {
            if (wordBuffer.includes(boxSelectorArray[i + currentRow * 5].textContent)) {
                boxSelectorArray[i + currentRow * 5].style.backgroundColor = 'yellow';
                wordBuffer = wordBuffer.substring(0, i) + '*' + wordBuffer.substring(i + 1);
            }
        }
    }
    currentRow++;
    currentCol = 0;
}
