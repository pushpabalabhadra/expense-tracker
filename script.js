
console.log("JavaScript connected successfully!");

// Get HTML elements
const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionList = document.getElementById("transaction-list");

// Load transactions from LocalStorage
let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

// Save transactions in LocalStorage
function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

// Add Transaction Function
transactionForm.addEventListener("submit", function(event) {

    // Prevent page refresh
    event.preventDefault();

    // Get input values
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    // Validate input
    if (description === "" || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter valid transaction details!");
        return;
    }

    // Create transaction object
    const transaction = {
        id: Date.now() + Math.random(),
        description: description,
        amount: amount,
        type: type
    };

    // Add transaction to array
    transactions.push(transaction);

    // Save in LocalStorage
    saveTransactions();

    // Display transactions and update dashboard
    displayTransactions();
    updateSummary();

    // Clear form
    transactionForm.reset();
});

// Display Transactions Function
function displayTransactions() {

    transactionList.innerHTML = "";

    transactions.forEach(function(transaction) {

        const li = document.createElement("li");

        // Create description
        const name = document.createElement("span");
        name.textContent = transaction.description;

        // Create amount
        const amount = document.createElement("span");

        const sign = transaction.type === "income" ? "+" : "-";

        amount.textContent = sign + "₹" + transaction.amount.toFixed(2);

        amount.style.color =
            transaction.type === "income" ? "green" : "red";

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.style.backgroundColor = "#e74c3c";
        deleteButton.style.padding = "8px 12px";
        deleteButton.style.fontSize = "13px";

        // Delete transaction
        deleteButton.addEventListener("click", function() {

            transactions = transactions.filter(function(item) {
                return item.id !== transaction.id;
            });

            // Save updated transactions
            saveTransactions();

            // Refresh display and dashboard
            displayTransactions();
            updateSummary();
        });

        // Add elements to list item
        li.appendChild(name);
        li.appendChild(amount);
        li.appendChild(deleteButton);

        transactionList.appendChild(li);
    });
}

// Calculate Income, Expenses and Balance
function updateSummary() {

    // Calculate total income
    const totalIncome = transactions
        .filter(transaction => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);

    // Calculate total expenses
    const totalExpenses = transactions
        .filter(transaction => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);

    // Calculate balance
    const balance = totalIncome - totalExpenses;

    // Update HTML elements
    document.getElementById("income").textContent =
        "₹" + totalIncome.toFixed(2);

    document.getElementById("expense").textContent =
        "₹" + totalExpenses.toFixed(2);

    document.getElementById("balance").textContent =
        "₹" + balance.toFixed(2);
}

// Initialize dashboard
displayTransactions();
updateSummary();
