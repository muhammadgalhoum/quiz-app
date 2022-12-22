let testEn = document.getElementById("testEn");
testEn.onclick = function () {
  window.location.href = "../en/index.html";
  testEn.checked = false;
}

let testAr = document.getElementById("testAr");
testAr.onclick = function () {
  window.location.href = "../ar/index.html";
  testAr.checked = false;
};