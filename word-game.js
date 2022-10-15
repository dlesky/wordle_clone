init();

async function init() {
    const GET_URL = 'https://words.dev-apis.com/word-of-the-day';
    const POST_URL = 'https://words.dev-apis.com/validate-word';
    const promise = await fetch(GET_URL);
    const { word: wordOfDay } = await promise.json();


    let boxSelectorArray = [];
    let boxText = new Array(30);
    let currentRow = 0;
    let currentCol = 0;

    initBoxes();
    let word = wordOfDay;

    async function validate(wordToTest) {
        const objectToTest = { word: wordToTest };
        try {
            const promise = await fetch(POST_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(objectToTest)
            });
            const data = await promise.json();
            if (data.validWord === true) { evalGuess() }
            else { deleteRow() }
            if (!promise.ok) {
                console.log(data.description);
                return;
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    let inputKey = document.addEventListener("keydown", function (event) {
        currentInput = (event.key).toUpperCase();
        isLetter = /^[A-Z]$/.test(String(currentInput));
        if (isLetter === true && currentCol <= 4 && currentRow <= 5) { addLetter(currentInput) }
        else if (currentInput === "BACK" || currentInput === "BACKSPACE") { backspace() }
        else if (currentInput === "ENTER" && currentCol === 5 && currentRow <= 5) {
            validate(concatBoxes(currentRow))
        }
    })

    let inputClicks = document.addEventListener("click", function (event) {
        currentInput = (event.target.innerText).toUpperCase();
        isLetter = /^[A-Z]$/.test(String(currentInput));
        if (isLetter === true && currentCol <= 4 && currentRow <= 5) { addLetter(currentInput) }
        else if (currentInput === "BACK" || currentInput === "BACKSPACE") { backspace() }
        else if (currentInput === "ENTER" && currentCol === 5 && currentRow <= 5) {
            validate(concatBoxes(currentRow))
        }
    })

    function evalGuess() {
        wordBuffer = wordOfDay.toUpperCase();
        guess = concatBoxes(currentRow)
        for (let i = 0; i < 5; i++) {
            if (boxSelectorArray[i + currentRow * 5].textContent === wordBuffer[i]) {
                boxSelectorArray[i + currentRow * 5].style.backgroundColor = "#00FF00";
                wordBuffer = wordBuffer.substring(0, i) + '*' + wordBuffer.substring(i + 1);
            }
        }
        for (let i = 0; i < 5; i++) {
            if (wordBuffer.includes(boxSelectorArray[i + currentRow * 5].textContent)) {
                boxSelectorArray[i + currentRow * 5].style.backgroundColor = 'yellow';
                j = letterToFirstIndex(wordBuffer, boxSelectorArray[i + currentRow * 5].textContent)
                wordBuffer = wordBuffer.substring(0, j) + '*' + wordBuffer.substring(j + 1);
            }

        }
        if (guess === wordOfDay.toUpperCase()) {
            alert("Nice Work! You Won!");
        }
        else {
            if (currentRow === 5) { alert(`The word was ${wordOfDay.toUpperCase()}. Thanks for playing!`) }
            else { alert("Not quite! Try again!") }
        }
        currentRow++;
        currentCol = 0;
        updateKeyColor(guess);
    }


    function initBoxes() {
        for (let i = 0; i < 30; i++) {
            boxString = '.box' + i;
            boxSelectorArray.push(document.querySelector(boxString));
        }
    }


    function concatBoxes(row) {
        word = ''
        for (let index = 0; index < 5; index++) {
            word += boxText[index + row * 5];
        }
        return word
    }

    function deleteRow() {
        alert("Woah nelley. My source tells me that ain't English")
        for (let index = 0; index < 5; index++) {
            boxText[index + currentRow * 5] = ''
            boxSelectorArray[index + currentRow * 5].textContent = ''
        }
        currentCol = 0
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

    function updateKeyColor(guess) {
        for (let i = 0; i < 5; i++) {
            className = "." + guess[i];
            classLetter = document.querySelector(className);
            classLetter.style.backgroundColor = 'grey'
        }

    }

    function letterToFirstIndex(inputWord, inputLetter) {
        for (let i = 0; i < word.length; i++) {
            if (inputWord[i] === inputLetter) {
                return i;
                break;
            }
        }
    }

}

