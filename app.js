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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const customerId = document.getElementById('customer-id').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);

    if (!customerId) {
        alert('お客様番号を入力してください。');
        return;
    }

    if (isNaN(amount)) {
        alert('有効な金額を入力してください。');
        return;
    }

    // トランザクションデータを保存する
    db.ref('customers/' + customerId + '/transactions').push({
        amount: amount,
        date: new Date().toISOString()
    }).then(() => {
        // 残高を更新する
        return db.ref('customers/' + customerId + '/balance').transaction(function(currentBalance) {
            return (currentBalance || 0) + amount;
        });
    }).then(() => {
        document.getElementById('transaction-status').innerText = 'Transaction successful';
        // 送信後にデータを表示
        displayCustomerData(customerId);
        displayTopCustomers();  // トップ10ランキングも表示
    }).catch((error) => {
        console.error('Error:', error);
        document.getElementById('transaction-status').innerText = 'Transaction failed';
    });
});

// データの表示
function displayCustomerData(customerId) {
    const customerDataElement = document.getElementById('customer-data');
    db.ref('customers/' + customerId).once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data) {
            let transactions = '';
            if (data.transactions) {
                transactions = Object.values(data.transactions).map(transaction => {
                    return `<li>Amount: ${transaction.amount}, Date: ${transaction.date}</li>`;
                }).join('');
            }
            customerDataElement.innerHTML = `
                <h3>Customer ID: ${customerId}</h3>
                <p>Balance: ${data.balance || 0}</p>
                <h4>Transactions:</h4>
                <ul>${transactions}</ul>
            `;
        } else {
            customerDataElement.innerHTML = `<p>No data found for Customer ID: ${customerId}</p>`;
        }
    }).catch((error) => {
        console.error('Error fetching data:', error);
        customerDataElement.innerHTML = `<p>Error fetching data for Customer ID: ${customerId}</p>`;
    });
}

// トップ10ランキングを表示する
function displayTopCustomers() {
    const topCustomersElement = document.getElementById('top-customers');
    
    db.ref('customers').orderByChild('balance').limitToLast(10).once('value').then(snapshot => {
        const customers = [];
        snapshot.forEach(childSnapshot => {
            const customerId = childSnapshot.key;
            const customerData = childSnapshot.val();
            const balance = customerData.balance || 0;
            customers.push({ customerId, balance });
        });

        // 残高で降順にソート
        customers.sort((a, b) => b.balance - a.balance);

        // トップ10を表示
        topCustomersElement.innerHTML = customers.map((customer, index) => `
            <li>Rank ${index + 1}: Customer ID: ${customer.customerId}, Balance: ${customer.balance}</li>
        `).join('');
    }).catch((error) => {
        console.error('Error fetching top customers:', error);
        topCustomersElement.innerHTML = `<p>Error fetching top customers.</p>`;
    });
}

// 初期表示時にトップ10を表示
displayTopCustomers();
