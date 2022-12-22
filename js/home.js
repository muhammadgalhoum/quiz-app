let testEn = document.getElementById("testEn");
testEn.onclick = function () {
  window.location.href = "quiz-app/index-en.html";
  testEn.checked = false;
}

let testAr = document.getElementById("testAr");
testAr.onclick = function () {
  window.location.href = "quiz-app/index-ar.html";
  testAr.checked = false;
};