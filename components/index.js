import { words } from "./game-words.js";

// DOM elements

const virtualKeyboard = document.querySelector(".user-part__keyboard");
const keys = Array.from(document.querySelectorAll(".key"));
const wordContainer = document.querySelector(".user-part__word-container");
const encryptedWordContainer = wordContainer.querySelector(".user-part__word");
const hint = wordContainer.querySelector(".user-part__hint");
const error = wordContainer.querySelector(".user-part__errors");
const popup = document.querySelector(".popup");
const popupMessage = popup.querySelector(".message");
const popupWord = popup.querySelector(".word");
const popupButton = popup.querySelector("button");

// game state
let incorrectGuesses = 0;
let currentGameWord;
const alreadyClicked = [];

startGame();

// start game functionality

function startGame() {
  const gameWordObj = chooseNewWord(words);
  console.log(gameWordObj.word);
  placeInfo(gameWordObj);
}

function chooseNewWord(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  const randomObj = arr[randomIndex];
  arr.splice(randomIndex, 1);

  return randomObj;
}

function placeInfo(gameWordObj) {
  currentGameWord = gameWordObj.word;
  let encryptedWord = [];
  for (let i = 0; i < gameWordObj.word.length; i++) {
    encryptedWord.push("_");
  }
  encryptedWordContainer.textContent = encryptedWord.join(" ");
  hint.textContent = `Hint: ${gameWordObj.hint}`;
  error.textContent = `Incorrect guesses: ${incorrectGuesses}/6`;
}

// event-listeners and handlers for keyboard

virtualKeyboard.addEventListener("click", handleClick);

document.addEventListener("keydown", handleClick);

function handleClick(event) {
  if (
    (event.type === "click" && !event.target.classList.contains("key")) ||
    (event.type === "keydown" && event.keyCode < 65 && event.keyCode > 90)
  )
    return;
  let keyValue =
    event.type === "click"
      ? event.target.textContent.toLowerCase()
      : event.key.toLowerCase();
  let keyButton =
    event.type === "click"
      ? event.target
      : keys.find((key) => key.textContent.toLowerCase() === keyValue);
  // play only if the button wasn't already clicked
  if (!alreadyClicked.includes(keyValue) && incorrectGuesses < 6) {
    alreadyClicked.push(keyValue);
    keyButton.classList.add("key-pressed");
    gameFunctionality(keyValue);
  }
}

// game functionality

function gameFunctionality(keyValue) {
  const wordArr = currentGameWord.split("");
  const updatedWord = encryptedWordContainer.textContent.split(" ");

  if (wordArr.includes(keyValue)) {
    for (let i = 0; i < wordArr.length; i++) {
      if (wordArr[i] === keyValue) {
        updatedWord[i] = keyValue;
      }
    }
    encryptedWordContainer.textContent = updatedWord.join(" ");
  } else {
    incorrectGuesses++;
    showPartOfHangman(incorrectGuesses);
    error.textContent = `Incorrect guesses: ${incorrectGuesses}/6`;
  }
  checkGame(updatedWord);
}

function checkGame(updatedWord) {
  if (updatedWord.join("") === currentGameWord) {
    showPopup("Congratulations, you won!", currentGameWord);
  } else if (incorrectGuesses >= 6) {
    showPopup("I'm sorry, the game is over", currentGameWord);
  }
}

const hangmanParts = [
  document.querySelector(".head"),
  document.querySelector(".body"),
  document.querySelector(".left-hand"),
  document.querySelector(".right-hand"),
  document.querySelector(".left-foot"),
  document.querySelector(".right-foot"),
];

function showPartOfHangman(error) {
  switch (error) {
    case 1:
      hangmanParts[0].classList.add("show");
      break;
    case 2:
      hangmanParts[1].classList.add("show");
      break;
    case 3:
      hangmanParts[2].classList.add("show");
      break;
    case 4:
      hangmanParts[3].classList.add("show");
      break;
    case 5:
      hangmanParts[4].classList.add("show");
      break;
    case 6:
      hangmanParts[5].classList.add("show");
      break;
    default:
      break;
  }
}

// event-listeners and handlers for popup

function showPopup(message) {
  popupMessage.textContent = message;
  popupWord.textContent = `Correct word: ${currentGameWord}`;
  popup.classList.add("popup-is-opened");
}

popupButton.addEventListener("click", handlePopupClick);
document.addEventListener("keydown", handlePopupClick);

function handlePopupClick(event) {
  if (
    (event.type === "keydown" &&
      event.key === "Enter" &&
      popup.classList.contains("popup-is-opened")) ||
    event.type === "click"
  ) {
    clearGame();
    startGame();
    popup.classList.remove("popup-is-opened");
  }
}

function clearGame() {
  incorrectGuesses = 0;
  alreadyClicked.length = 0;
  currentGameWord = "";

  keys.forEach((key) => {
    if (key.classList.contains("key-pressed")) {
      key.classList.remove("key-pressed");
    }
  });
  hangmanParts.forEach((part) => {
    part.classList.remove("show");
  });
}
