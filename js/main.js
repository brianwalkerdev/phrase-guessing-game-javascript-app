/**
 * Wheel of Success - Interactive Word Guessing Game
 * Players guess letters to reveal a hidden phrase with 5 lives
 */

// DOM element references
const qwerty = document.getElementById("qwerty");
const phrase = document.getElementById("phrase");
const overlay = document.getElementById("overlay");

// Game state
let missed = 0;
let phraseArray = [];

// Phrases for the game
const phrases = [
  "the elephant in the room",
  "the cat in the hat",
  "the dog ate my homework",
  "the cow jumped over the moon",
  "the fox in the forest",
];

/**
 * Get a random phrase from the phrases array and split it into characters
 * @param {Array} arr - Array of phrase strings
 * @returns {Array} Array of characters
 */
function getRandomPhraseAsArray(arr) {
  const randomPhrase = arr[Math.floor(Math.random() * arr.length)];
  return randomPhrase.split("");
}

/**
 * Display the phrase on the page as a series of list items
 * @param {Array} arr - Array of characters to display
 */
function addPhraseToDisplay(arr) {
  const phraseUl = document.querySelector("#phrase ul");
  arr.forEach(char => {
    const li = document.createElement("li");
    li.textContent = char;
    li.className = char === " " ? "space" : "letter";
    phraseUl.appendChild(li);
  });
}

/**
 * Check if the selected letter is in the phrase
 * @param {HTMLElement} button - The button element that was clicked
 * @returns {string|null} The matched letter or null if not found
 */
function checkLetter(button) {
  const letter = button.textContent;
  const letterElements = document.querySelectorAll(".letter");
  let match = null;
  
  letterElements.forEach(letterEl => {
    if (letterEl.textContent === letter) {
      letterEl.classList.add("show");
      match = letter;
    }
  });
  
  return match;
}

/**
 * Remove a life from the scoreboard when a wrong letter is guessed
 */
function removeLife() {
  const liveHearts = document.querySelectorAll(".tries img");
  if (missed < liveHearts.length) {
    liveHearts[missed].src = "images/lostHeart.png";
    liveHearts[missed].alt = "Lost heart";
    missed++;
  }
}

/**
 * Check if the player has won or lost the game
 */
function checkWin() {
  const letterShown = document.querySelectorAll(".show");
  const letterTotal = document.querySelectorAll(".letter");
  
  if (letterShown.length === letterTotal.length) {
    overlay.className = "win";
    overlay.style.display = "flex";
    overlay.children[0].textContent = "Congratulations!";
    overlay.children[1].textContent = "Play Again";
  } else if (missed >= 5) {
    overlay.className = "lose";
    overlay.style.display = "flex";
    overlay.children[0].textContent = "Game Over";
    overlay.children[1].textContent = "Try Again";
  }
}

/**
 * Reset the game to its initial state
 */
function resetGame() {
  // Reset game state
  missed = 0;
  
  // Clear the phrase display
  const phraseUl = document.querySelector("#phrase ul");
  phraseUl.innerHTML = "";
  
  // Reset all keyboard buttons
  const buttons = document.querySelectorAll("#qwerty button");
  buttons.forEach(button => {
    button.className = "";
    button.disabled = false;
  });
  
  // Reset all hearts
  const hearts = document.querySelectorAll(".tries img");
  hearts.forEach(heart => {
    heart.src = "images/liveHeart.png";
    heart.alt = "Live heart";
  });
  
  // Get new phrase and display it
  phraseArray = getRandomPhraseAsArray(phrases);
  addPhraseToDisplay(phraseArray);
  
  // Hide overlay
  overlay.style.display = "none";
}

/**
 * Handle letter button clicks
 * @param {Event} e - Click event
 */
function handleLetterClick(e) {
  const button = e.target;
  if (button.tagName === "BUTTON" && !button.disabled) {
    button.className = "chosen";
    button.disabled = true;
    
    const letterFound = checkLetter(button);
    if (letterFound === null) {
      removeLife();
    }
    
    checkWin();
  }
}

// Initialize the game
function initGame() {
  phraseArray = getRandomPhraseAsArray(phrases);
  addPhraseToDisplay(phraseArray);
  
  // Set up event listeners
  const startButton = document.querySelector(".btn__reset");
  startButton.addEventListener("click", resetGame);
  
  qwerty.addEventListener("click", handleLetterClick);
  
  // Add keyboard support
  // Keyboard support moved outside to prevent duplicate listeners
}

// Start the game when the page loads
initGame();

// Add keyboard support (only once)
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (/^[a-z]$/.test(key)) {
    const allButtons = document.querySelectorAll("#qwerty button");
    for (let btn of allButtons) {
      if (btn.textContent === key && !btn.disabled) {
        btn.click();
        break;
      }
    }
  }
});
