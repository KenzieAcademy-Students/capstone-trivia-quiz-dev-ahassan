// To run this assignment, right click on index.html in the Visual Studio Code file explorer to the left
// and select "Open with Live Server"
// YOUR CODE HERE!
let userScore = 0; // user's score, starting at 0
let currentQuestion; // current question object
let questions = []; // an array to store the questions being fetched

let containerElement = document.getElementById("category-container"); 
let questionContainer = document.getElementById("question-container"); 
let questionElement = document.getElementById("question");
let answerForm = document.getElementById("answer-form");
let userAnswerInput = document.getElementById("user-answer");
let questionsRemainingElement = document.getElementById("questions-remaining");
let scoreElement = document.getElementById("score");
let congratulatoryMessageElement = document.getElementById("correct-answer-message");
let errorElement = document.getElementById("error-message");


// function to fetch a random question from the API
async function fetchQuestion() {
  try {
    let response = await fetch('https://jservice.kenzie.academy/api/random-clue?valid=true');
    let data = await response.json();
    console.log('successfully fetched question:', data);

    // returns the fetched question info
    return data;
  } catch (error) {
    console.error('failed fetching question:', error);
    return null;
  }
}

function displayNextQuestion() {
  if (questions.length > 0) {
    currentQuestion = questions.pop();
    questionElement.textContent = currentQuestion.question; // Displays the question on the page
    questionContainer.style.display = 'block';
    questionsRemainingElement.textContent = `Questions Remaining: ${questions.length}`;
    errorElement.style.display = 'none';
    congratulatoryMessageElement.style.display = 'none';
    enableAnswerForm();
  } else {
    endGame();
  }
}

// starts the game by fetching and displaying the first question

async function startGame() {
  userScore = 0;
  scoreElement.textContent = 'Score: 0';

  try {
    questions = [];
    for (let i = 0; i < 10; i++) { // for loop to fetch 10 questions from the API and to get added to the questions array.
      let question = await fetchQuestion();
      if (question) {
        questions.push(question);
      } else {
        throw new Error("Unable to fetch question. Please try again.");
      }
    }

    displayNextQuestion(); // Display the first question
  } catch (error) {
    console.error(error.message);
  }
}

function enableAnswerForm() {
  userAnswerInput.disabled = false;
  answerForm.addEventListener('submit', handleAnswerSubmit);
}

function disableAnswerForm() {
  userAnswerInput.disabled = true;
  answerForm.removeEventListener('submit', handleAnswerSubmit);
}

function handleAnswerSubmit(event) {
  event.preventDefault();
  let userAnswer = userAnswerInput.value.trim();
  checkUserAnswer(userAnswer);
}

function checkUserAnswer(userAnswer) {
  if (!currentQuestion) {
    console.error('No question available');
    return;
  }

  let correctAnswer = currentQuestion.answer;
  let formattedUserAnswer = userAnswer.toLowerCase();
  let formattedCorrectAnswer = correctAnswer.toLowerCase();

  if (formattedUserAnswer === formattedCorrectAnswer) {
    userScore++;
    updateScoreDisplay();
    showCongratulatoryMessage();
  } else {
    showIncorrectAnswer();
  }

  currentQuestion = null; // Resets the current question to fetch a new one
  setTimeout(displayNextQuestion, 2000);
}

function updateScoreDisplay() {
  scoreElement.textContent = `Score: ${userScore}`;
}

function showCongratulatoryMessage() {
    congratulatoryMessageElement.textContent = `Correct! Your score is ${userScore}.`;
    congratulatoryMessageElement.style.display = 'block';
    congratulatoryMessageElement.classList.add('correct'); 
  
    // Clears the user's answer input field
    userAnswerInput.value = '';
  }
  
  function showIncorrectAnswer() {
    errorElement.textContent = `Incorrect! The correct answer was: ${currentQuestion.answer}`;
    errorElement.style.display = 'block';
    errorElement.classList.add('incorrect'); 
  
    
    userAnswerInput.value = '';
  }
  
  function resetMessages() {
    congratulatoryMessageElement.style.display = 'none';
    congratulatoryMessageElement.classList.remove('correct');
    errorElement.style.display = 'none';
    errorElement.classList.remove('incorrect');
  }
  
  function endGame() {
    resetMessages(); 
    questionContainer.innerHTML = `
      <p>Game Over..</p>
      <p>Your final score is: ${userScore}</p>
      <p>Press F5 or refresh the page to play again.</p>
    `;
  }

containerElement.style.display = 'block';
questionContainer.style.display = 'none';
startGame(); // Calls the startGame function to start the game.
