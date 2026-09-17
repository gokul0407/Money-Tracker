const balance = document.querySelector("#balance");
const inc_amt = document.querySelector("#inc-amt");
const exp_amt = document.querySelector("#exp-amt");
const trans = document.querySelector("#trans");
const form = document.querySelector("#form");
const description = document.querySelector("#desc");
const amount = document.querySelector("#amt");

/*
const dummyData = [
    { id: 1, description: "Salary", amount: 5000 },
    { id: 2, description: "Groceries", amount: -200 },
    { id: 3, description: "Rent", amount: -1000 },
    { id: 4, description: "Freelance", amount: 1500 },
    {id: 5, description: "Utilities", amount: -700 }
];

let transactions = dummyData;
*/

const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

function loadTransactionsDetails(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "exp" : "inc");
    item.innerHTML = `
        ${transaction.description} 
        <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</button>
    `;
    trans.appendChild(item);
    //console.log(transaction);
    //console.log(sign);
} 

function deleteTransaction(id) {
    if(confirm ("Are you sure you want to delete this transaction?"
    )) {
        transactions = transactions.filter(transaction => transaction.id != id);
        config();
        updateLocalStorage();
    }
    else{
        return;
    }
    //console.log(id);
}

function updateBalance() {
    const amounts = transactions.map(transaction => transaction.amount);
    //console.log(amounts);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    balance.innerText = `₹  ${total}`;

    const income = amounts.filter(item => item > 0);
    inc_amt.innerHTML = `₹ ${income.reduce((acc, item) => (acc += item), 0).toFixed(2)}`;

    const expense = amounts.filter(item => item < 0);
    exp_amt.innerHTML = `₹ ${Math.abs(expense.reduce((acc, item) => (acc += item), 0)).toFixed(2)}`;
}

function config() {
    trans.innerHTML = "";
    transactions.forEach(loadTransactionsDetails);
    updateBalance();
}

function addTransaction(e){
    e.preventDefault();

    if(description.value.trim() == "" || amount.value.trim() == ""){
        alert("Please enter a description and amount");
    }
    else{
        const transaction = {
            id: uniqueId(),
            description: description.value,
            amount: +amount.value,
        };
        transactions.push(transaction);
        loadTransactionsDetails(transaction);
        description.value = "";
        amount.value = "";
        updateBalance();
        updateLocalStorage();
        config();
    }
}

function uniqueId() {
    return Math.floor(Math.random() * 1000);
}

form.addEventListener("submit", addTransaction)
    

window.addEventListener("load", function () {
    config();
});

function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}
