// Importing functions from other modules
import { getQuiz } from "./api.js";
import { shuffleArray } from "./utils.js";

// Constants for quiz mechanics
const NEXT_QUESTION_SHIFT_DELAY = 600; // Delay in milliseconds before showing the next question
const ANSWER_LABEL = "answer__label"; // Class for answer labels
const ANSWER_LABEL_RIGHT = "answer__label_right"; // Class for correct answer label
const ANSWER_LABEL_WRONG = "answer__label_wrong"; // Class for incorrect answer label

// Global variables for tracking quiz state
let score = 0; // User's score
let quizzes = []; // Array of quiz questions
let players = []; // Array of players' scores and names
let scoreFormEl; // Element for the score submission form
let quizEl; // Element for the quiz container
let currentQuiz; // Current quiz question being displayed

// Call the main function when the script is loaded
await main();

// Main function to initialize the quiz
async function main() {
  // Fetch quiz questions and initialize global variables
  quizzes = await getQuiz();
  players = JSON.parse(localStorage.getItem("nameData")) || [];
  scoreFormEl = document.querySelector("#form-name");
  quizEl = document.querySelector("#quiz");
  shiftQuiz(); // Display the first quiz question
}

// Function to shift to the next quiz question
function shiftQuiz() {
  let questionNumber = 10 - quizzes.length;
  currentQuiz = quizzes.shift(); // Get the next quiz question
  renderQuiz(currentQuiz, questionNumber); // Render the quiz question
}

// Function to render the quiz question and answers
function renderQuiz(quiz, questionNumber) {
  // Display the quiz question
  renderQuestion(quizEl, quiz, questionNumber);

  // Create a fieldset element for the answers
  let fieldSetEl = document.createElement("fieldset");
  fieldSetEl.classList.add("answers");
  fieldSetEl.addEventListener("click", clickAnswerHandler);
  quizEl.append(fieldSetEl);

  // Get shuffled answers for the current question
  let answers = assembleAnswers(quiz);

  // Render each answer as a radio button
  for (let i = 0; i < answers.length; i++) {
    let answer = answers[i];
    let id = `answer_${i}`;
    renderAnswer(fieldSetEl, answer, id);
  }
}

// Function to display the quiz question
function renderQuestion(quizEl, quiz, questionNumber) {
  let questionEl = document.createElement("div");
  questionEl.classList.add("Quizquestions");
  questionEl.innerText = `Question ${questionNumber + 1}: ${quiz.question}`;
  quizEl.append(questionEl);
}

// Event handler for clicking an answer
function clickAnswerHandler(e) {
  let value = e.target.value;
  if (!value) return; // Ignore clicks that are not on answers

  // Reset styles for all answer labels
  let answers = document.querySelectorAll(`.${ANSWER_LABEL}`);
  for (let answer of answers) {
    answer.classList.remove(ANSWER_LABEL_RIGHT, ANSWER_LABEL_WRONG);
  }

  // Highlight the selected answer
  let labelEl = document.querySelector(`label[for=${e.target.id}]`);
  if (currentQuiz.correct_answer === value) {
    score += 1; // Increase score for correct answer
    labelEl.classList.add(ANSWER_LABEL_RIGHT);
  } else {
    labelEl.classList.add(ANSWER_LABEL_WRONG);
  }

  // Render the next question after a delay
  setTimeout(renderNextQuiz, NEXT_QUESTION_SHIFT_DELAY);
}

// Function to render the next quiz question or show the score form
function renderNextQuiz() {
  quizEl.innerHTML = ""; // Clear the current quiz content

  if (quizzes.length === 0) {
    // If all questions have been answered, show the score form
    scoreFormEl.style.display = "flex";
    let playerScore = document.querySelector("#score__yours");
    playerScore.innerText = score; // Display the player's score
  } else {
    shiftQuiz(); // Display the next quiz question
  }
}

// Function to assemble a list of shuffled answers
function assembleAnswers(quiz) {
  let answers = [quiz.correct_answer]; // Start with the correct answer

  // Add all incorrect answers to the array
  for (let i = 0; i < quiz.incorrect_answers.length; i++) {
    answers.push(quiz.incorrect_answers[i]);
  }

  return shuffleArray(answers); // Shuffle and return the answers
}

// Function to render a single answer as a radio button
function renderAnswer(fieldSetEl, answer, id) {
  let answerEl = document.createElement("input");
  answerEl.type = "radio";
  answerEl.id = id;
  answerEl.name = "quiz";
  answerEl.value = answer;

  let labelEl = document.createElement("label");
  labelEl.classList.add(ANSWER_LABEL);
  labelEl.htmlFor = id;
  labelEl.innerText = answer;

  fieldSetEl.append(answerEl, labelEl);
}

// Event listener for the score submission form
scoreFormEl.addEventListener("submit", scoreFormSubmitHandler);

// Handler for submitting the score form
function scoreFormSubmitHandler(e) {
  e.preventDefault(); // Prevent default form submission behavior

  let name = document.querySelector("#Name");
  // Add the player's score to the players array
  players.push({
    name: name.value || "Anonymous", // Use 'Anonymous' if no name is entered
    score: score,
  });
  // Update the players data in local storage
  localStorage.setItem("nameData", JSON.stringify(players));

  // Redirect to the index page
  window.location.href = "./index.html";
}
