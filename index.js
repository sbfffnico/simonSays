// waits until DOM is loaded
$(document).ready(() => {
  // set initial variables
  let choices = ["green", "red", "blue", "yellow"];
  let gamePattern = [];
  let userPattern = [];
  let gameStarted = false;
  let roundCount = 0;
  let audio = {
    wrong: "https://cdn.freesound.org/previews/648/648462_11771918-lq.mp3",
    green: "https://cdn.freesound.org/previews/186/186669_2731232-lq.mp3",
    red: "https://cdn.freesound.org/previews/3/3515_6997-lq.mp3",
    yellow: "https://cdn.freesound.org/previews/391/391649_7368738-lq.mp3",
    blue: "https://cdn.freesound.org/previews/643/643139_14142921-lq.mp3",
  };

  // displays previous high score if one is found
  if(localStorage.getItem('highScore')) {
    $("#highscore").text(`High score: ${localStorage.getItem('highScore')}`);
  }
  else {
    $("#highscore").text(`High score: 0`);
  }

  // simulates the button lighting up
  const lightUp = (color) => {
    $(`#${color}`).addClass(`${color}Pressed`);
  }
  // stops the button lighting up after 100ms
  const removeLight = (color) => {
    setTimeout(() => {$(`#${color}`).removeClass(`${color}Pressed`);}, 100);
  }
  // combines lightUp and removeLight functions for easier use
  const flashColor = (color) => {
    playSound(audio[color]);
    lightUp(color);
    removeLight(color);
  }
  // selects choice at random to later be added to full pattern
  const randomChoice = (choices) => {
    return Math.floor(Math.random() * choices.length);
  }
  const playSound = (sound) => {
    var audio = new Audio(sound);
    audio.play();
  }

  // adjusts text within the start button to avoid wrapping
  const fixStartText = () => {
    if (roundCount == 1) {
      $("#startText").css("font-size","0.9rem");
    }
    else if (roundCount >= 10 && roundCount < 100) {
      $("#startText").css("font-size","0.8rem");
    }
    else if (roundCount >= 100 && roundCount < 1000) {
      $("#startText").css("font-size","0.7rem");
    }
    else if (roundCount >= 1000 && roundCount < 10000) {
      $("#startText").css("font-size","0.6rem");
    }
  }

  // prints text to document to advise player the round is over
  const congratulate = () => {
    $("#heading").text("SIMON SAYS... GOOD JOB!");
    setTimeout(() => {$("#heading").text("SIMON SAYS")}, 1000);
  }

  // prints text to document to advise player they have lost and resets variables
  const gameOver = () => {
    playSound(audio.wrong);
    $("#heading").text(`SIMON SAYS... GAME OVER AT ROUND ${roundCount}`);
    $("#startText").css("font-size","0.6rem");
    $("#startText").text(`Play Again?`);
    gameStarted = false;
    gamePattern = [];
    let highScore = roundCount > 0 ? roundCount - 1 : 0;
    if (localStorage.getItem('highScore') < highScore) {
      localStorage.setItem('highScore', highScore);
    }
    $("#highscore").text(`High score: ${localStorage.getItem('highScore')}`);
    console.log(localStorage.getItem('highScore'));
    roundCount = 0;
  }

  // allows for full sequence to play without overlap using intervals
  function lightSequence() {
    let tempPattern = [...gamePattern];
    let intervalID = setInterval(() => {
      let color = tempPattern.splice(0,1);
      flashColor(color);
      if(tempPattern.length == 0) {
        clearInterval(intervalID);
      }
    }, 600);
  }

  // adds to the pattern for the next round
  const nextRound = () => {
    userPattern = [];
    roundCount += 1;
    $("#startText").text(`Round ${roundCount}`);
    fixStartText();

    gamePattern.push(choices[randomChoice(choices)]);
    lightSequence();
  }

  // checks the pattern to see if the player is correct
  const checkPattern = (currentRound) => {
    if(userPattern[currentRound] === gamePattern[currentRound]) {
      if(userPattern.length === gamePattern.length) {
        congratulate();
        setTimeout(() => {nextRound();},1000);
      }
    }
    else {
      gameOver();
    }
  }

  // checks if game button has been clicked
  $(".box").click(function () {
    let color = $(this).attr('id');
    flashColor(color);
    if(gameStarted && userPattern.length < gamePattern.length) {
      userPattern.push(color);
      checkPattern(userPattern.length-1);
    }
  });

  // starts the game if not already started
  $("#start").click(function () {
    if (!gameStarted) {
      $("#heading").text(`SIMON SAYS`);
      nextRound();
      gameStarted = true;
    }
  })
});

