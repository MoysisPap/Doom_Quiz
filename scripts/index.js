// Function to render the ranking of players based on their scores
function renderRank() {
  // Retrieve player data from local storage or set to empty array if none exists
  let players = JSON.parse(localStorage.getItem("nameData")) || [];
  // Filter out players with scores less than 3
  let scoreGreaterThan3 = players.filter(function (player) {
    return player.score >= 3;
  });
  // Sort players by score in descending order and pick the top ten
  let topTen = scoreGreaterThan3.sort((a, z) => z.score - a.score).slice(0, 10);

  let rank = document.querySelector("#rank");

  // Create a bar for each player in the top ten and append to rank element
  for (let player of topTen) {
    let bar = document.createElement("div");
    // Set player name as attribute for css `content: attr(owner)` to display the player's name
    bar.setAttribute("owner", player.name);
    bar.classList.add("rank__bar");
    // Set bar height proportional to player's score
    bar.style.height = `${(player.score / 10) * 100}%`;
    rank.append(bar);
  }

  // Display placeholder text if no players have sufficient scores
  if (topTen.length === 0) {
    let placeholder = document.createElement("div");
    placeholder.innerText = "No data here";
    rank.append(placeholder);
  }
}

// Call renderRank to display the ranking when the page loads
renderRank();

// Event listener for the 'START' button
let welcomeBtnEl = document.querySelector("#welcome-button");
welcomeBtnEl.addEventListener("click", function () {
  // Add animation class to make it flash when the button is clicked
  welcomeBtnEl.classList.add("animate__flash");
  // Create audio element and play sound
  let audio = new Audio("./dramatic-sound.mp3");

  // Redirect to the quiz page once the sound has finished playing
  audio.addEventListener("ended", function () {
    let quizUrl = "./quiz.html";
    location.href = quizUrl;
  });

  audio.play(); // Start playing the audio
});
