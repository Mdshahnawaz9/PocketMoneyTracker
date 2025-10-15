// ====== Get Elements ======
const totalMoneyInput = document.getElementById("totalMoneyInput");
const setMoneyBtn = document.getElementById("setMoneyBtn");
const totalMoneyDisplay = document.getElementById("totalMoney");
const totalSpentDisplay = document.getElementById("totalSpent");
const remainingMoneyDisplay = document.getElementById("remainingMoney");

const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseDateInput = document.getElementById("expenseDate");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseList = document.getElementById("expenseList");

const goalNameInput = document.getElementById("goalName");
const goalTargetInput = document.getElementById("goalTarget");
const goalSavedInput = document.getElementById("goalSaved");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalList = document.getElementById("goalList");


const toggleThemeBtn = document.getElementById("toggleThemeBtn");
const lightStyle = document.getElementById("light-style");
const darkStyle = document.getElementById("dark-style");

// ====== Variables ======
let totalMoney = 0;
let totalSpent = 0;
let goals = [];
let darkModeEnabled = false;

// ====== Set Total Money ======
setMoneyBtn.addEventListener("click", () => {
  const value = Number(totalMoneyInput.value);
  if (value > 0) {
    totalMoney = value;
    updateDashboard();
    totalMoneyInput.value = "";
  } else {
    alert("Please enter a valid amount!");
  }
});

// ====== Add Expense ======
addExpenseBtn.addEventListener("click", () => {
  const name = expenseNameInput.value.trim();
  const amount = Number(expenseAmountInput.value);
  const date = expenseDateInput.value;

  if (!name || amount <= 0 || !date) {
    alert("Please fill all fields correctly!");
    return;
  }

  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${name}</td>
    <td>${amount}</td>
    <td>${date}</td>
    <td><button class="delete-btn">❌</button></td>
  `;

  row.querySelector(".delete-btn").addEventListener("click", () => {
    totalSpent -= amount;
    row.remove();
    updateDashboard();
  });

  expenseList.appendChild(row);
  totalSpent += amount;
  updateDashboard();

  expenseNameInput.value = "";
  expenseAmountInput.value = "";
  expenseDateInput.value = "";
});

// ====== Add Goal ======
addGoalBtn.addEventListener("click", () => {
  const name = goalNameInput.value.trim();
  const target = Number(goalTargetInput.value);
  const saved = Number(goalSavedInput.value);

  if (!name || target <= 0 || saved < 0 || saved > target) {
    alert("Please enter valid goal details!");
    return;
  }

  const goal = {
    id: Date.now(),
    name,
    target,
    saved
  };

  goals.push(goal);
  renderGoals();

  goalNameInput.value = "";
  goalTargetInput.value = "";
  goalSavedInput.value = "";
});

// ====== Render Goals List ======
function renderGoals() {
  goalList.innerHTML = "";

  goals.forEach((goal) => {
    const progressPercent = Math.min((goal.saved / goal.target) * 100, 100).toFixed(1);
    const remainingToSave = Math.max(goal.target - goal.saved, 0);

    const goalItem = document.createElement("div");
    goalItem.classList.add("goal-item");

    goalItem.innerHTML = `
      <h4>${goal.name}</h4>
      <p>Target: ₹${goal.target} | Saved: ₹${goal.saved}</p>
      <div class="progress-bar">
        <div class="progress" style="width: ${progressPercent}%"></div>
      </div>
      <p>${progressPercent}% completed</p>
      <p><strong>Remaining to Save:</strong> ₹${remainingToSave}</p>
      ${progressPercent < 100 ? `
        <input type="number" placeholder="Add more savings" class="add-saving-input" />
        <button class="update-goal-btn">Update Savings</button>
      ` : `<p class="goal-complete-msg">🎉 Goal Completed!</p>`}
      <button class="delete-goal-btn">❌ Delete</button>
    `;

    // Update savings handler
    const updateBtn = goalItem.querySelector(".update-goal-btn");
    const savingInput = goalItem.querySelector(".add-saving-input");

    if (updateBtn && savingInput) {
      updateBtn.addEventListener("click", () => {
        const addAmount = Number(savingInput.value);
        if (addAmount <= 0 || goal.saved + addAmount > goal.target) {
          alert("Invalid savings amount.");
          return;
        }

        goal.saved += addAmount;

        if (goal.saved >= goal.target) {
          alert(`🎯 Goal "${goal.name}" completed!`);
        }

        renderGoals();
      });
    }

    // Delete goal handler
    const deleteBtn = goalItem.querySelector(".delete-goal-btn");
    deleteBtn.addEventListener("click", () => {
      goals = goals.filter((g) => g.id !== goal.id);
      renderGoals();
    });

    goalList.appendChild(goalItem);
  });
}

// ====== Update Dashboard ======
function updateDashboard() {
  totalMoneyDisplay.innerText = totalMoney;
  totalSpentDisplay.innerText = totalSpent;
  const remaining = totalMoney - totalSpent;
  remainingMoneyDisplay.innerText = remaining >= 0 ? remaining : 0;
  remainingMoneyDisplay.style.color = remaining < 0 ? "red" : "#333";
}

// ====== Toggle Theme ======
toggleThemeBtn.addEventListener("click", () => {
  darkModeEnabled = !darkModeEnabled;

  if (darkModeEnabled) {
    lightStyle.disabled = true;
    darkStyle.disabled = false;
    toggleThemeBtn.textContent = " Light Mode";
  } else {
    lightStyle.disabled = false;
    darkStyle.disabled = true;
    toggleThemeBtn.textContent = " Dark Mode";
  }
});

