let selectedQuestions = [];
let allQuestions = [];
let ttlQuestionCount = 10;
let currentQuestionIdx = 0;
let mark = 0;
let userData = {}

//dom load
document.addEventListener("DOMContentLoaded", () => {
    loadPage("Landing.html");
    questions();

    // console.log(selectedQuestions);

})

//initiasePage

const initiasePage = (path) => {
    if (path == "Landing.html") {
        document.getElementById("userForm").addEventListener("submit", (e) => {
            e.preventDefault();
            userData.name = document.getElementById("name").value
            userData.email = document.getElementById("email").value
            // console.log(userData);
            loadPage("Instruction.html")
        })
    } else if (path == "Instruction.html") {
        document.getElementById("startQuiz").addEventListener("click", () => {
            loadPage("Quiz.html")
            // showQuestion()
            // alert('hhh')

        })
    } else if (path === "Quiz.html") {
        showTimer()
        showQuestion()
        document.getElementById("next").addEventListener("click", () => {
            // mark
            let selectedAnswer = document.querySelector('input[name="answer"]:checked');

            if(selectedAnswer.value == selectedQuestions[currentQuestionIdx].correct){
                mark++
                // console.log(mark);
            }

            //next 
            if (currentQuestionIdx < selectedQuestions.length - 1) {
                currentQuestionIdx++;
                showQuestion();
            } else {
                loadPage("Result.html")
               
            }
        });

        document.getElementById("previous").addEventListener("click", () => {
            if (currentQuestionIdx < selectedQuestions.length - 1) {

                if (currentQuestionIdx == 0) {
                    alert("First Question")
                } else {
                    currentQuestionIdx--;
                    // console.log(currentQuestionIdx);
                    showQuestion();
                }
            }
        })
    }else if(path == "Result.html"){
        if(mark < 3){
            document.getElementById("details").innerHTML = `Hi, ${userData.name}.... Better luck next time We will send next test link to ${userData.email}`
        }else{
            document.getElementById("details").innerHTML = `Hi, ${userData.name}.... We will send next round details to ${userData.email}`
        }
        document.getElementById("mark").innerHTML = `Hey Your Score is ${mark}/10`
    }
}

//fetch question from array object
const questions = () => {
    fetch("questions.json")
        .then((data) => data.json())
        .then((question) => {
            // console.log(question);
            allQuestions = question;
            // console.log(allQuestions);
            selectRandomQuestion();
        })
}

// need to fetch random 10 questions
const selectRandomQuestion = () => {
    let i = 0;
    let shuffledQuestion = allQuestions.sort(() => {
        return 5 - Math.floor(Math.random() * 10);
    });

    selectedQuestions = shuffledQuestion.slice(0, ttlQuestionCount);
    //   console.log(selectedQuestions);
};

// show question in quiz page

const showQuestion = () => {
    const currentQuestion = selectedQuestions[currentQuestionIdx];

    const questionContainer = document.getElementById("questionContainer");

    questionContainer.innerHTML = `
          <h4>Question ${currentQuestionIdx + 1}: ${currentQuestion.question}</h4>
          ${currentQuestion.answers
            .map((ans, idx) => {
                return `
            <div class="opt">
            <label>
            <input type="radio" name="answer" value="${idx}">${ans}</label></div>`;
            })
            .join(" ")}
      `;
};

// timer
function showTimer() {
    const timerElement = document.getElementById('timer');
    let remainingTime = 10 * 60; // 10 minutes in seconds

    const interval = setInterval(() => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (remainingTime > 0) {
            remainingTime--;
        } else {
            clearInterval(interval);
            console.log('10 minutes are up!');
        }
    }, 1000);
}

//call pages

const loadPage = (path) => {
    fetch(`./page/${path}`)
        .then((data) => data.text())
        .then((html) => {
            // console.log("gdgdg");
            document.getElementById("app").innerHTML = html;
            initiasePage(path);
        });

}