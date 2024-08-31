const firebaseConfig = {
    apiKey: "AIzaSyBeBgPZmKE-qRm_TANkWK2_4iBgIjMPNys",
    authDomain: "bankdbfirebase.firebaseapp.com",
    databaseURL: "https://bankdbfirebase-default-rtdb.firebaseio.com",
    projectId: "bankdbfirebase",
    storageBucket: "bankdbfirebase.appspot.com",
    messagingSenderId: "732737141001",
    appId: "1:732737141001:web:6d4ac9a70dc68d39d3fbd8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const customerId = document.getElementById('customer-id').value;
    const amount = parseFloat(document.getElementById('amount').value);

    // トランザクションデータを保存する
    db.ref('customers/' + customerId + '/transactions').push({
        amount: amount,
        date: new Date().toISOString()
    });

    // 残高を更新する
    db.ref('customers/' + customerId + '/balance').transaction(function(currentBalance) {
        return (currentBalance || 0) + amount;
    });

    document.getElementById('transaction-status').innerText = 'Transaction successful';
});
