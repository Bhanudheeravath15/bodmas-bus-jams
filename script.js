let currentPriority = 1; // 1 = × ÷, 2 = + -

const operators = document.querySelectorAll(".operator");
const message = document.getElementById("message");

operators.forEach(op => {
  op.addEventListener("click", () => {
    const priority = parseInt(op.dataset.priority);

    if (priority === currentPriority) {
      op.classList.add("correct");
      op.disabled = true;
      message.innerText = "Correct! ✅";

      // Move to next priority
      if (currentPriority === 1) {
        currentPriority = 3; // next is +
      } else {
        message.innerText = "Expression solved! 🎉";
        saveScore();
      }
    } else {
      op.classList.add("wrong");
      message.innerText = "Wrong order! Remember BODMAS 😅";
      setTimeout(() => op.classList.remove("wrong"), 600);
    }
  });
});

function resetGame() {
  currentPriority = 1;
  message.innerText = "";
  operators.forEach(op => {
    op.disabled = false;
    op.classList.remove("correct", "wrong");
  });
}

function saveScore() {
  fetch("save_score.php", {
    method: "POST",
    body: JSON.stringify({ score: 1 })
  });
}
``