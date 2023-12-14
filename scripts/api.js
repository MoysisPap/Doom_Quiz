// Importing presetDataSet from dataset.js
import { presetDataSet } from "./dataset.js";

// Function to fetch quiz questions from an API
export async function getQuiz() {
  // URL of the quiz API
  let url =
    "https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple";
  // Fetching data from the API
  let response = await fetch(url);
  let data = await response.json();
  // Decoding HTML entities in the data and returning the result
  // If API fails, fallback to preset data set
  const result = decode(data.results || (await presetDataSet()));
  return result;
}

// Function to decode HTML entities in the dataset
function decode(dataset) {
  // Map over each item in the dataset
  let result = dataset.map(function (data) {
    // Decode the question and answers
    data.question = decodeHtmlEntities(data.question);
    data.correct_answer = decodeHtmlEntities(data.correct_answer);
    let incorrectAnswers = data.incorrect_answers.map(function (answer) {
      return decodeHtmlEntities(answer);
    });
    data.incorrect_answers = incorrectAnswers;
    return data;
  });
  return result;
}

// Utility function to convert HTML entities to readable text
// e.g. Nvidia&#039;s ==> Nvidia's
function decodeHtmlEntities(html) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(html, "text/html");
  return doc.documentElement.textContent;
}
