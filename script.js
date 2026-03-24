/***********************
 * GLOBAL STATE
 ***********************/
let clickOrder = [];
let clicked = 0;
let timer = 0;
let interval = null;
let score = 0;
let hardBracketLeft = false;

/***********************
 * TIMER
 ***********************/
function startTimer() {
  timer = 0;
  document.getElementById("time").innerText = timer;
  interval = setInterval(() => {
    timer++;
    document.getElementById("time").innerText = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
}

/***********************
 * MATH HELPERS
 ***********************/
function apply(a, op, b) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? "error" : a / b;
  if (op === "^") return Math.pow(a, b);
  return "error";
}

function precedence(op) {
  if (op === "^") return 0;            // Order
  if (op === "*" || op === "/") return 1;
  return 2;                            // + -
}

function symbol(op) {
  if (op === "*") return "×";
  if (op === "/") return "÷";
  return op;
}

/***********************
 * BUILD EXPRESSION UI
 ***********************/
function buildExpression(n1, op1, n2, op2, n3, level) {

  if (level === "easy") {
    return `
      ${n1}
      <button class="operator" data-id="op1">${symbol(op1)}</button>
      ${n2}
      <button class="operator" data-id="op2">${symbol(op2)}</button>
      ${n3}
    `;
  }

  if (level === "medium") {
    return `
      ${n1}
      <button class="operator" data-id="op1">${symbol(op1)}</button>
      (
        ${n2}
        <button class="operator" data-id="op2">${symbol(op2)}</button>
        ${n3}
      )
    `;
  }

  // HARD
  if (hardBracketLeft) {
    return `
      (
        ${n1}
        <button class="operator" data-id="op1">${symbol(op1)}</button>
        ${n2}
      )
      <button class="operator" data-id="op2">${symbol(op2)}</button>
      ${n3}
    `;
  }

  return `
    ${n1}
    <button class="operator" data-id="op1">${symbol(op1)}</button>
    (
      ${n2}
      <button class="operator" data-id="op2">${symbol(op2)}</button>
      ${n3}
    )
  `;
}

/***********************
 * GENERATE
 ***********************/
function generate() {
  resetGame();

  const level = document.getElementById("level").value;
  const n1 = Number(document.getElementById("n1").value);
  const n2 = Number(document.getElementById("n2").value);
  const n3 = Number(document.getElementById("n3").value);
  const op1 = document.getElementById("op1").value;
  const op2 = document.getElementById("op2").value;

  hardBracketLeft = level === "hard" && Math.random() < 0.5;

  // ✅ CLICK ORDER LOGIC
  if (level === "medium") {
    // bracket first
    clickOrder = ["op2", "op1"];
  }
  else if (level === "hard") {
    // bracketed operator always first
    clickOrder = hardBracketLeft
      ? ["op1", "op2"]
      : ["op2", "op1"];
  }
  else {
    // ✅ EASY: precedence + LEFT → RIGHT for same precedence
    if (precedence(op1) < precedence(op2)) {
      clickOrder = ["op1", "op2"];
    } else if (precedence(op1) > precedence(op2)) {
      clickOrder = ["op2", "op1"];
    } else {
      // 🔥 FIX: same precedence → LEFT TO RIGHT
      clickOrder = ["op1", "op2"];
    }
  }

  clicked = 0;

  document.getElementById("expression").innerHTML =
    buildExpression(n1, op1, n2, op2, n3, level);

  document.querySelectorAll(".operator").forEach(btn => {
    btn.onclick = () =>
      handleClick(btn, n1, op1, n2, op2, n3, level);
  });

  startTimer();
}

/***********************
 * CLICK HANDLER
 ***********************/
function handleClick(btn, n1, op1, n2, op2, n3, level) {
  if (btn.dataset.id !== clickOrder[clicked]) {
    btn.classList.add("wrong");
    document.getElementById("message").innerText =
      "❌ Follow BODMAS order";
    return;
  }

  btn.classList.add("correct");
  btn.disabled = true;
  clicked++;

  if (clicked === clickOrder.length) {
    stopTimer();
    score += Math.max(10, 100 - timer);
    document.getElementById("score").innerText = score;
    explain(n1, op1, n2, op2, n3, level);
  }
}

/***********************
 * CORRECT CALCULATION
 ***********************/
function explain(n1, op1, n2, op2, n3, level) {
  let html = "<b>Why this order?</b><br>";
  let r1, r2;

  if (level === "easy") {
    if (clickOrder[0] === "op1") {
      r1 = apply(n1, op1, n2);
      if (r1 === "error") return showError();
      r2 = apply(r1, op2, n3);
      if (r2 === "error") return showError();
      html += `Step 1: ${n1} ${op1} ${n2} = ${r1}<br>`;
      html += `Step 2: ${r1} ${op2} ${n3} = ${r2}`;
    } else {
      r1 = apply(n2, op2, n3);
      if (r1 === "error") return showError();
      r2 = apply(n1, op1, r1);
      if (r2 === "error") return showError();
      html += `Step 1: ${n2} ${op2} ${n3} = ${r1}<br>`;
      html += `Step 2: ${n1} ${op1} ${r1} = ${r2}`;
    }
  }

  else if (level === "medium") {
    r1 = apply(n2, op2, n3);
    if (r1 === "error") return showError();
    r2 = apply(n1, op1, r1);
    if (r2 === "error") return showError();
    html += `Step 1: (${n2} ${op2} ${n3}) = ${r1}<br>`;
    html += `Step 2: ${n1} ${op1} ${r1} = ${r2}`;
  }

  else {
    if (hardBracketLeft) {
      r1 = apply(n1, op1, n2);
      if (r1 === "error") return showError();
      r2 = apply(r1, op2, n3);
      if (r2 === "error") return showError();
      html += `Step 1: (${n1} ${op1} ${n2}) = ${r1}<br>`;
      html += `Step 2: ${r1} ${op2} ${n3} = ${r2}`;
    } else {
      r1 = apply(n2, op2, n3);
      if (r1 === "error") return showError();
      r2 = apply(n1, op1, r1);
      if (r2 === "error") return showError();
      html += `Step 1: (${n2} ${op2} ${n3}) = ${r1}<br>`;
      html += `Step 2: ${n1} ${op1} ${r1} = ${r2}`;
    }
  }

  document.getElementById("message").innerText = "✅ Correct!";
  document.getElementById("explanation").innerHTML = html;
}

/***********************
 * ERROR HANDLING
 ***********************/
function showError() {
  document.getElementById("message").innerText =
    "❌ Error: Division by zero";
  document.getElementById("explanation").innerHTML = "";
}

/***********************
 * RESET
 ***********************/
function resetGame() {
  stopTimer();
  clicked = 0;
  document.getElementById("expression").innerHTML = "";
  document.getElementById("explanation").innerHTML = "";
  document.getElementById("message").innerText =
    "Click operators in correct BODMAS order";
}
