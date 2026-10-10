
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = Number(localStorage.getItem("budget")) || 0;

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function formatMoney(amount) {
    return "GH₵ " + amount.toFixed(2);
}

function calculateTotal() {
    let total = 0;

    for (let i = 0; i < expenses.length; i++) {
        total += expenses[i].amount;
    }

    return total;
}


let budgetForm = document.getElementById("budgetForm");

if (budgetForm) {

    let budgetInput = document.getElementById("budget");
    let budgetMessage = document.getElementById("budgetMessage");

    if (budget > 0) {
        budgetInput.value = budget;
    }

    budgetForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let newBudget = Number(budgetInput.value);

        if (newBudget <= 0 || !Number.isFinite(newBudget)) {
            budgetMessage.textContent = "Enter a valid budget.";
            budgetMessage.className = "warning";
            return;
        }

        budget = newBudget;
        localStorage.setItem("budget", budget);

        budgetMessage.textContent = "Budget saved successfully!";
        budgetMessage.className = "success";

        displayHome();
    });

    displayHome();
}

function displayHome() {
    let total = calculateTotal();
    let remaining = budget - total;

    document.getElementById("homeBudget").textContent =
        formatMoney(budget);

    document.getElementById("homeSpent").textContent =
        formatMoney(total);

    document.getElementById("homeRemaining").textContent =
        formatMoney(remaining);
}


let expenseForm = document.getElementById("expenseForm");

if (expenseForm) {

    let dateInput = document.getElementById("expenseDate");

    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    dateInput.value = year + "-" + month + "-" + day;

    expenseForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("expenseName").value.trim();
        let amount = Number(
            document.getElementById("expenseAmount").value
        );
        let category = document.getElementById("expenseCategory").value;
        let date = document.getElementById("expenseDate").value;

        let message = document.getElementById("expenseMessage");

        if (name === "" || !Number.isFinite(amount) ||
            amount <= 0 || category === "" || date === "") {

            message.textContent = "Please enter valid expense details.";
            message.className = "warning";
            return;
        }

        let newExpense = {
            name: name,
            amount: amount,
            category: category,
            date: date
        };
        expenses.push(newExpense);

        saveExpenses();

        message.textContent = "Expense added successfully!";
        message.className = "success";

        expenseForm.reset();
        dateInput.value = year + "-" + month + "-" + day;

        displayExpenses();
    });

    document.getElementById("categoryFilter")
        .addEventListener("change", displayExpenses);

    displayExpenses();
}

function displayExpenses() {

    let table = document.getElementById("expenseTable");
    let filter = document.getElementById("categoryFilter").value;

    table.innerHTML = "";

    for (let i = 0; i < expenses.length; i++) {

        let expense = expenses[i];

        if (filter === "All" || expense.category === filter) {

            let row = document.createElement("tr");

            let nameCell = document.createElement("td");
            nameCell.textContent = expense.name;

            let categoryCell = document.createElement("td");
            categoryCell.textContent = expense.category;

            let amountCell = document.createElement("td");
            amountCell.textContent = formatMoney(expense.amount);

            let dateCell = document.createElement("td");
            dateCell.textContent = expense.date;

            let actionCell = document.createElement("td");
            let deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";

            deleteButton.addEventListener("click", function () {
                deleteExpense(i);
            });

            actionCell.appendChild(deleteButton);

            row.appendChild(nameCell);
            row.appendChild(categoryCell);
            row.appendChild(amountCell);
            row.appendChild(dateCell);
            row.appendChild(actionCell);

            table.appendChild(row);
        }
    }

    if (table.children.length === 0) {
        let row = document.createElement("tr");
        let cell = document.createElement("td");

        cell.colSpan = 5;
        cell.textContent = "No expenses found.";
        cell.style.textAlign = "center";

        row.appendChild(cell);
        table.appendChild(row);
    }

    document.getElementById("expenseTotal").textContent =
        "Total: " + formatMoney(calculateTotal());
}

function deleteExpense(index) {

    let answer = confirm("Do you want to delete this expense?");

    if (answer) {
        expenses.splice(index, 1);
        saveExpenses();
        displayExpenses();
    }
}


let summaryBudget = document.getElementById("summaryBudget");

if (summaryBudget) {
    displaySummary();
}

function displaySummary() {

    let total = calculateTotal();
    let remaining = budget - total;

    document.getElementById("summaryBudget").textContent =
        formatMoney(budget);

    document.getElementById("summarySpent").textContent =
        formatMoney(total);

    document.getElementById("summaryRemaining").textContent =
        formatMoney(remaining);

    let status = document.getElementById("budgetStatus");

    if (budget === 0) {
        status.textContent = "Set your budget on the Home page.";
        status.className = "warning";
    } else if (total > budget) {
        status.textContent = "Warning: You have exceeded your budget!";
        status.className = "warning";
    } else if (total === budget) {
        status.textContent = "You have used your entire budget.";
        status.className = "warning";
    } else {
        status.textContent = "Good job! You are within your budget.";
        status.className = "success";
    }

    let categories = [
        "Food",
        "Transport",
        "Academic",
        "Entertainment",
        "Other"
    ];

    let categoryTable = document.getElementById("categoryTable");
    categoryTable.innerHTML = "";

    for (let i = 0; i < categories.length; i++) {

        let categoryTotal = 0;

        for (let j = 0; j < expenses.length; j++) {
            if (expenses[j].category === categories[i]) {
                categoryTotal += expenses[j].amount;
            }
        }

        let row = document.createElement("tr");

        let categoryCell = document.createElement("td");
        categoryCell.textContent = categories[i];

        let amountCell = document.createElement("td");
        amountCell.textContent = formatMoney(categoryTotal);

        row.appendChild(categoryCell);
        row.appendChild(amountCell);

        categoryTable.appendChild(row);
    }

    document.getElementById("expenseCount").textContent =
        expenses.length;

    let highest = 0;
    let highestName = "None";

    for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].amount > highest) {
            highest = expenses[i].amount;
            highestName = expenses[i].name;
        }
    }

    if (expenses.length > 0) {
        document.getElementById("highestExpense").textContent =
            highestName + " (" + formatMoney(highest) + ")";
    } else {
        document.getElementById("highestExpense").textContent = "None";
    }

    let average = 0;

    if (expenses.length > 0) {
        average = total / expenses.length;
    }

    document.getElementById("averageExpense").textContent =
        formatMoney(average);
}
