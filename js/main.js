let quizApp = document.querySelector(".quiz-app");
let questionsCountSpan = document.querySelector(".quiz-info .count span");
let countdownSpan = document.querySelector(".countdown span");
let bulletsDiv = document.querySelector(".bullets");
let spansContainer = document.querySelector(".bullets .spans-container");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".quiz-app .answers-area");
let submitButton = document.querySelector(".quiz-app .submit-button");

let total = 0;
let currentIndex = 0;
let numOfQuestions = 10;
let arrayOfQuestions = [];
let qnum = 1;
let countdownInterval;
let qTime = 15; // the time in seconds

let myData;
async function getQuestions() {
  try {
    if (location.pathname === '/indexAr.html') {
      myData = await fetch("../questions-ar.json");
    } else if(location.pathname === '/indexEn.html') {
      myData = await fetch("../questions.json");
    }
    let questions = await myData.json();
    
    // Generating a specific number of random objects(questions with it's answers)
    while (arrayOfQuestions.length < numOfQuestions) {
      let randomIndex = Math.floor(Math.random() * questions.length);
      if (!arrayOfQuestions.includes(questions[randomIndex])) {
        arrayOfQuestions.push(questions[randomIndex]);
      }
    }

    createBullets(arrayOfQuestions.length);
    addQuestion(arrayOfQuestions[currentIndex], arrayOfQuestions.length);

    countdown(qTime, questions.length);

    submitButton.onclick = () => {
      let rightAnswer = arrayOfQuestions[currentIndex].right_answer;
      currentIndex++;
      qnum++;
      checkAnswer(rightAnswer);
      quizArea.innerHTML = "";
      answersArea.innerHTML = "";
      addQuestion(arrayOfQuestions[currentIndex], arrayOfQuestions.length);
      handleBullets();
      clearInterval(countdownInterval);
      countdown(qTime, arrayOfQuestions.length);
      showResult(arrayOfQuestions.length);
    };
  } catch (error) {
    console.log(error);
  }
}
getQuestions();

function createBullets(num) {
  questionsCountSpan.textContent = num;
  for (let i = 1; i <= num; i++) {
    let spanBullet = document.createElement('span');
    if (i === 1) spanBullet.className = 'done';
    spansContainer.appendChild(spanBullet);
  }
}

function addQuestion(obj, count) {
  if (currentIndex < count) {
    let q = document.createElement("h2");
    q.textContent = `${qnum}- ${obj.question}`;
    q.style.userSelect = 'none';
    quizArea.appendChild(q);

    let answersArray = [];
    for (let i = 1; i <= 4; i++) {
      let answerDiv = document.createElement("div");
      answerDiv.className = "answer";

      let qInput = document.createElement("input");
      qInput.setAttribute("type", "radio");
      qInput.setAttribute("name", "question");
      qInput.setAttribute("id", `answer_${i}`);
      qInput.dataset.answer = obj[`answer_${i}`];

      let qLabel = document.createElement("label");
      qLabel.htmlFor = `answer_${i}`;
      qLabel.style.userSelect = "none";
      qLabel.textContent = obj[`answer_${i}`];

      answerDiv.appendChild(qInput);
      answerDiv.appendChild(qLabel);
      answersArray.push(answerDiv);
    }
    let randomNumbersArray = []
    // Generating four identical random numbers from 0 to 3
    while(randomNumbersArray.length < 4) {
      let randomValue = Math.floor(Math.random() * 4);
      if (!randomNumbersArray.includes(randomValue)) {
        randomNumbersArray.push(randomValue);
      }
    }
    for (let num of randomNumbersArray){
      answersArea.appendChild(answersArray[num]);
    }
  }
}

function checkAnswer(rAnswer) {
  let answers = document.getElementsByName("question");
  let checkedAnswer='';
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      checkedAnswer = answers[i].dataset.answer;
      break;
    }
  }
  if (rAnswer === checkedAnswer) {
    total++;
  }
}

function handleBullets() {
  let bullets = document.querySelectorAll(".bullets .spans-container span");
  let arrayOfBullets = Array.from(bullets);
  arrayOfBullets.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = 'done';
    }
  });
}

function showResult(count) {
  if (currentIndex === count) {
    quizApp.remove();

    let finalDiv = document.createElement('div');
    finalDiv.id = 'finalDiv';
    finalDiv.textContent = 'Thanks'
    finalDiv.style.cssText = 'display: flex; place-content: center; position: absolute; top: 50%; left: 50%;\
    transform: translate(-50%, -50%); padding: 20px; font-size: 50px; color: #009688; background-color: #00968824;';
    document.body.appendChild(finalDiv);

    if (location.pathname === '/indexAr.html') {
      if (total > count / 2 && total <= count) {
        Swal.fire({
          icon: "success",
          title: "أحسنت 😍",
          html: `لقد أجتزت الإختبار بنجاح وحصلت على ${total} من ${count}. <br/>
          <strong>هل تريد أخذ إختبار آخر؟</strong>`,
          showDenyButton: true,
          confirmButtonText: "نعم",
          confirmButtonColor: "#2196f3",
          denyButtonText: `لا`,
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload(true);
          } else if (result.isDenied) {
            window.location.pathname = "/";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "حظ سعيد المرة القادمة 😢",
          html: `للاسف لم تجتاز الامتحان حيث انك حصلت على ${total} من ${count}.
          <br/><strong>حاول مرة اخرى؟</strong>`,
          showDenyButton: true,
          confirmButtonText: "نعم",
          confirmButtonColor: "#2196f3",
          denyButtonText: `لا`,
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload(true);
          } else if (result.isDenied) {
            window.location.pathname = "/";
          }
        });
      }
    } else if (location.pathname === '/indexEn.html') {
      if (total > count / 2 && total <= count) {
        Swal.fire({
          icon: "success",
          title: "Congratulations 😍",
          html: `You passed the Exam and you get ${total} from ${count}. <br/>
          <strong>Do you want to take a new Test again?</strong>`,
          showDenyButton: true,
          confirmButtonText: "Yes",
          confirmButtonColor: "#2196f3",
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload(true);
          } else if (result.isDenied) {
            window.location.pathname = "/";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "HardLuck 😢",
          html: `Unfortunately, you failed in the Exam, as you get ${total} from ${count}.
          <br/><strong>Try again?</strong>`,
          showDenyButton: true,
          confirmButtonText: "Yes",
          confirmButtonColor: "#2196f3",
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload(true);
          } else if (result.isDenied) {
            window.location.pathname = "/";
          }
        });
      }
    }
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    countdownInterval = setInterval(function () {
      let minutes =
        parseInt(duration / 60) < 10
          ? `0${parseInt(duration / 60)}`
          : `${parseInt(duration / 60)}`;
      let seconds =
        parseInt(duration % 60) < 10
          ? `0${parseInt(duration % 60)}`
          : `${parseInt(duration % 60)}`;

      countdownSpan.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}