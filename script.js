let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

const form = document.getElementById("transactionForm");

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const dateInput = document.getElementById("date");

const transactionList = document.getElementById("transactionList");


form.addEventListener("submit", function (e) {

    e.preventDefault();

    const transaction = {
        id: Date.now(),
        title: titleInput.value.trim(),
        amount: Number(amountInput.value),
        type: typeInput.value,
        date: dateInput.value
    };

    if (!transaction.title || transaction.amount <= 0 ||
        !Number.isFinite(transaction.amount) || !transaction.date) {
        alert("Please enter valid transaction details.");
        return;
    }

    transactions.push(transaction);
    saveData();
    displayTransactions();
    updateDashboard();
    form.reset();

});

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

function displayTransactions() {

    transactionList.innerHTML = "";

    transactions.forEach(function (item) {
        const row = document.createElement("tr");
        row.className = "border-b";

        const titleCell = document.createElement("td");
        titleCell.className = "p-3";
        titleCell.textContent = item.title;

        const dateCell = document.createElement("td");
        dateCell.className = "p-3";
        dateCell.textContent = item.date;

        const typeCell = document.createElement("td");
        typeCell.className = "p-3";
        typeCell.textContent = item.type;

        const amountCell = document.createElement("td");
        amountCell.className = "p-3 font-semibold";
        amountCell.classList.add(
            item.type === "income" ? "text-green-600" : "text-red-500"
        );
        amountCell.textContent =
            (item.type === "income" ? "+ " : "- ") +
            "৳" + item.amount.toLocaleString();

        const actionCell = document.createElement("td");
        actionCell.className = "p-3";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "text-red-500 hover:text-red-700";

        deleteButton.addEventListener("click", function () {
            deleteTransaction(item.id);
        });

        actionCell.appendChild(deleteButton);

        row.append(
            titleCell,
            dateCell,
            typeCell,
            amountCell,
            actionCell
        );

        transactionList.appendChild(row);

    });

}

function deleteTransaction(id) {

    transactions = transactions.filter(function (item) {
        return item.id !== id;
    });

    saveData();
    displayTransactions();
    updateDashboard();
}

function updateDashboard() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function (item) {

        if (item.type === "income") {
            totalIncome += item.amount;
        } else {
            totalExpense += item.amount;
        }

    });

    const balance = totalIncome - totalExpense;

    document.getElementById("income").textContent =
        "৳" + totalIncome.toLocaleString();

    document.getElementById("expense").textContent =
        "৳" + totalExpense.toLocaleString();

    document.getElementById("balance").textContent =
        "৳" + balance.toLocaleString();

}

displayTransactions();
updateDashboard();
