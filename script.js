const ttlQuestionCount = 10;

const userData = {};

let allQuestions = [];
let selectedQuestions = [];

const userSelecetedAnswer = [];

let currentQuestionIdx = 0;

let mark = 0;

let ttlTime = 600;

const selectRandomQuestion = () => {
  let i = 0;
  let shuffledQuestion = allQuestions.sort(() => {
    return 5 - Math.floor(Math.random() * 10);
  });

  selectedQuestions = shuffledQuestion.slice(0, ttlQuestionCount);
};

const showQuestion = () => {
  const currentQuestion = selectedQuestions[currentQuestionIdx];

  const questionContainer = document.getElementById("questionContainer");

  questionContainer.innerHTML = `
        <h4>Question ${currentQuestionIdx + 1}: ${currentQuestion.question}</h4>
        ${currentQuestion.answers
          .map((ans, idx) => {
            return `
          <div>
          <label>
          <input type="radio" name="answer" value="${idx}">${ans}</label></div>`;
          })
          .join(" ")}
    `;
};

const showAnswer = () => {
  const answerContainer = document.getElementById("answerContainer");

  //   const firstQuestion = selectedQuestions[0];

  answerContainer.innerHTML = selectedQuestions
    .map(
      (question, qNo) => `
        <div>
            <p>Question ${qNo + 1}: ${question.question}</p>

            ${question.answers
              .map((ans, ansIdx) => {
                let color = "black";

                if (question.correct == ansIdx) {
                  color = "green";
                } else if (userSelecetedAnswer[qNo] == ansIdx) {
                  color = "red";
                }

                return `
              <p style="color: ${color}">${ans}</p>
                `;
              })
              .join(" ")}
        </div>
    `
    )
    .join(" ");
};

const formatTimer = (duration) => {
  let seconds = Math.floor(duration % 60);
  let minutes = Math.floor((duration / 60) % 60);
  let hours = Math.floor(duration / (60 * 60));

  return `${String(hours).padStart(2, 0)} : ${String(minutes).padStart(
    2,
    0
  )} : ${String(seconds).padStart(2, 0)}`;
};

const showTimer = () => {
  const timer = document.getElementById("timer");
  timer.innerText = formatTimer(ttlTime);

  let timerInterval = setInterval(() => {
    ttlTime--;
    console.log("ttlTime", ttlTime);
    timer.innerText = formatTimer(ttlTime);
    if (ttlTime == 0) {
      clearInterval(timerInterval);
      loadPage("Result.html");
    }
  }, 1000);
};

const initiasePage = (path) => {
  if (path == "Landing.html") {
    document.getElementById("userForm").addEventListener("submit", (e) => {
      e.preventDefault();

      let userName = document.getElementById("name").value;
      let userMail = document.getElementById("email").value;

      userData.name = userName;
      userData.email = userMail;

      loadPage("Instruction.html");
    });
  } else if (path == "Instruction.html") {
    document.getElementById("startQuiz").addEventListener("click", (e) => {
      loadPage("Quiz.html");
    });
  } else if (path == "Quiz.html") {
    showTimer();
    showQuestion();

    document.getElementById("next").addEventListener("click", () => {
      let selectedAnswer = document.querySelector(
        'input[name="answer"]:checked'
      );

      if (
        selectedAnswer.value == selectedQuestions[currentQuestionIdx].correct
      ) {
        mark++;
      }

      userSelecetedAnswer[currentQuestionIdx] = selectedAnswer.value;

      currentQuestionIdx++;
      if (currentQuestionIdx < ttlQuestionCount) showQuestion();
      else loadPage("Result.html");
    });
  } else if (path == "Result.html") {
    document.getElementById(
      "mark"
    ).textContent = `You're score is ${mark} / ${ttlQuestionCount}`;
    showAnswer();
  }
};

const loadPage = (path) => {
  fetch(`./page/${path}`)
    .then((data) => data.text())
    .then((html) => {
      document.getElementById("app").innerHTML = html;
      initiasePage(path);
    })
    .catch((err) => {
      console.log(err);
    });
};

//Once the DOM loaded the only the script js need to start
document.addEventListener("DOMContentLoaded", () => {
  loadPage("Landing.html");
  fetch("questions.json")
    .then((data) => data.json())
    .then((questions) => {
      //   console.log("question", questions);
      allQuestions = questions;
      selectRandomQuestion();
    });
});
