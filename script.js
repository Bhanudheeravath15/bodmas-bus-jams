let expectedOrder = [];
let currentIndex = 0;

function getPriority(op) {
  if (op === "*" || op === "/") return 1;
  return 2;
}

function generateExpression() {
  const n1 = document.getElementById("n1").value;
  const n2 = document.getElementById("n2").value;
  const n3 = document.getElementById("n3").value;
  const op1 = document.getElementById("op1").value;
  const op2 = document.getElementById("op2").value;

  if (!n1 || !n2 || !n3) {
    alert("Please enter all numbers");
    return;
  }

  const expressionDiv = document.getElementById("expression");
  expressionDiv.innerHTML = "";

  const operators = [
    { symbol: op1, priority: getPriority(op1), id: "op1" },
    { symbol: op2, priority: getPriority(op2), id: "op2" }
  ];

  // Expected BODMAS order
  expectedOrder = [...operators].sort((a, b) => a.priority - b.priority);
  currentIndex = 0;

  expressionDiv.innerHTML = `
    <span class="number">${n1}</span>
    <button class="operator" data-id="op1">${op1}</button>
    <span class="number">${n2}</span>
    <button class="operator" data-id="op2">${op2}</button>
    <span class="number">${n3}</span>
  `;

  document.querySelectorAll(".operator").forEach(btn => {
    btn.addEventListener("click", () => handleClick(btn));
  });

  document.getElementById("message").innerText =
    "Click operators in correct BODMAS order";
}

function handleClick(button) {
  const expectedId = expectedOrder[currentIndex].id;

  if (button.dataset.id === expectedId) {
    button.classList.add("correct");
    button.disabled = true;
    currentIndex++;

    if (currentIndex === expectedOrder.length) {
      document.getElementById("message").innerText =
        "Correct! Expression solved 🎉";
    } else {
      document.getElementById("message").innerText =
        "Good! Now next operator ✅";
    }
  } else {
    button.classList.add("wrong");
    document.getElementById("message").innerText =
      "Wrong order! Follow BODMAS ❌";
    setTimeout(() => button.classList.remove("wrong"), 600);
  }
}

function resetGame() {
  document.getElementById("expression").innerHTML = "";
  document.getElementById("message").innerText = "";
}