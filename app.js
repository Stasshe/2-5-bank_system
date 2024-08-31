// Firebaseの初期化
const firebaseConfig = {
    apiKey: "AIzaSyBeBgPZmKE-qRm_TANkWK2_4iBgIjMPNys",
    authDomain: "bankdbfirebase.firebaseapp.com",
    databaseURL: "https://bankdbfirebase-default-rtdb.firebaseio.com",
    projectId: "bankdbfirebase",
    storageBucket: "bankdbfirebase.appspot.com",
    messagingSenderId: "732737141001",
    appId: "1:732737141001:web:6d4ac9a70dc68d39d3fbd8",
    measurementId: "G-FXFE6CNBER"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// トランザクション処理
document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const customerId = document.getElementById('customer-id').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const incomeSource = document.getElementById('income-source').value;

    if (!customerId) {
        alert('お客様番号を入力してください。');
        return;
    }

    if (isNaN(amount)) {
        alert('有効な金額を入力してください。');
        return;
    }

    const customerRef = db.ref('customers/' + customerId);

    customerRef.child('balance').transaction(function(currentBalance) {
        if (currentBalance === null) {
            return amount;
        }
        return currentBalance + amount;
    }).then(result => {
        if (!result.committed) {
            console.error("Transaction not committed:", result);
            document.getElementById('transaction-status').innerText = 'Transaction failed';
            return Promise.reject('Transaction not committed');
        }
        return customerRef.child('transactions').push({
            amount: amount,
            date: new Date().toISOString(),
            source: incomeSource
        });
    }).then(() => {
        document.getElementById('transaction-status').innerText = 'Transaction successful';
        displayCustomerData(customerId);
        displayTopCustomers();
    }).catch((error) => {
        console.error('An error occurred:', error);
        document.getElementById('transaction-status').innerText = 'Transaction failed';
    });
});

// 顧客データの表示
function displayCustomerData(customerId) {
    const customerRef = db.ref('customers/' + customerId);
    customerRef.once('value', (snapshot) => {
        const customerData = snapshot.val();
        if (customerData) {
            document.getElementById('customer-balance').innerText = 'Balance: ' + customerData.balance;
            const transactionsList = document.getElementById('transactions-list');
            transactionsList.innerHTML = '';
            for (let key in customerData.transactions) {
                const transaction = customerData.transactions[key];
                const li = document.createElement('li');
                li.innerText = `Amount: ${transaction.amount}, Date: ${transaction.date}, Source: ${transaction.source}`;
                transactionsList.appendChild(li);
            }
        }
    });
}

// トップ10の顧客ランキング表示
function displayTopCustomers() {
    const customersRef = db.ref('customers');
    customersRef.orderByChild('balance').limitToLast(10).once('value', (snapshot) => {
        const topCustomers = [];
        snapshot.forEach(childSnapshot => {
            const customerData = childSnapshot.val();
            topCustomers.push({
                id: childSnapshot.key,
                balance: customerData.balance,
                nickname: customerData.nickname || 'Anonymous'
            });
        });

        topCustomers.reverse(); // 高い順に並べ替え

        const topList = document.getElementById('top-customers-list');
        topList.innerHTML = '';
        topCustomers.forEach(customer => {
            const li = document.createElement('li');
            li.innerText = `Nickname: ${customer.nickname}, Balance: ${customer.balance}`;
            topList.appendChild(li);
        });
    });
}
