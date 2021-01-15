const RANDOM_QUOTE_API_URL = ("http://api.quotable.io/random" as unknown) as URL;
const quoteDisplayElement = document.getElementById(
  "quoteDisplay"
) as HTMLDivElement;
const quoteInputElement = document.getElementById(
  "quoteInput"
) as HTMLTextAreaElement;
const timerElement = document.getElementById("timer") as HTMLDivElement;

let round = 1;
// Add 'input' event listener to quoteInputElement
quoteInputElement.addEventListener("input", () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll("span"); //span contains quote
  // @ts-ignore
  const arrayValue = quoteInputElement.value.split(""); // Break input elements into array of letters

  // Time Taken
  // if (round != 1) {
  //   let timeTaken = getTimerTime();
  //   let letters = arrayQuote.length;

  //   const resultBox = document.querySelector("div.result");
  //   const score = document.createElement("p");
  //   score.classList.add("score");
  //   score.innerText = `Round:${round}=> ${letters} in ${timeTaken} seconds.`;
  //   resultBox.insertBefore(score, resultBox.childNodes[0]);
  // }
  round++;
  console.log(` Round:${round} `);

  let correct = true;

  // QuoteDisplayElement will contain an array of span each having 1 char of the quote
  // Now, for each element of the quote
  // NOTE Here we compare index to index and 1 char/loop so if the backspace will decrement the index
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index]; // Store the char

    if (character == null) {
      // In case of no/null input
      characterSpan.classList.remove("correct"); // Remove Green-Correct
      characterSpan.classList.remove("incorrect"); // Remove Red-Incorrect
      correct = false;
    } else if (character === characterSpan.innerText) {
      // If input  char === char in span quote for the same index
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
      // correct is not initialized to true so that the user can return to previous index(backspace) where correct is true by default and if then he
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });

  // If every element is correct
  if (correct) {
    const timeTaken = Math.round(getTimerTime() * 0.0166667);
    const letters = arrayQuote.length;

    createOneScoreBoard();
    const resultBox = document.querySelector("div.scoreboard");
    const score = document.createElement("p");
    score.classList.add("score");
    score.innerText = `✔${letters}🔤characters in ${timeTaken}⏱minutes.`;
    resultBox.insertBefore(score, resultBox.childNodes[1]);
    renderNewQuote();
  }
});

// Score Board creating function that only runs once because we only want one scoreboard and multiple scores
function once(fn, context) {
  let result;

  return function () {
    if (fn) {
      result = fn.apply(context || this, arguments);
      fn = null;
    }

    return result;
  };
}

// Usage
const createOneScoreBoard = once(() => {
  const scoreboard = document.createElement("div");
  scoreboard.classList.add("scoreboard");
  const header = document.createElement("h3");
  header.innerText = " 💯 SCORES ⏱ ";
  scoreboard.appendChild(header);
  document.body.appendChild(scoreboard);
  console.log("Score Board Created🔤⏲💯✔");
});

// @ts-ignore
function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => {
      return { quote: data.content, author: data.author };
    }); //Quote
}

// @ts-ignore
async function renderNewQuote() {
  const quoteObj = await getRandomQuote();
  const quote = `${quoteObj.author}: ${quoteObj.quote}`;

  quoteDisplayElement.innerHTML = ""; // Clear the previous quote

  // Display the Quote char by char each in a span
  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });

  // QuoteDisplayElement will contain an array of span each having 1 char of the quote
  // @ts-ignore
  quoteInputElement.value = null; // Clear Input textarea

  // Start Timer when quote is rendered
  startTimer();
}

// @ts-ignore
let startTime;
// @ts-ignore
function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date(); // Get Time at the start
  setInterval(() => {
    // Set interval is not precise for calculating time
    timerElement.innerText = getTimerTime();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000); // Round off the time in seconds
}

// Render new quote after completing the previous
renderNewQuote();
