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

document.getElementById('view-details-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const customerId = document.getElementById('customer-id').value.trim();

    if (!customerId) {
        alert('お客様番号を入力してください。');
        return;
    }

    // 顧客のデータを取得する
    db.ref('customers/' + customerId).once('value').then(snapshot => {
        const customerData = snapshot.val();

        if (customerData) {
            const nickname = customerData.nickname || 'No nickname';
            const balance = customerData.balance || 0;
            const transactions = customerData.transactions || {};
            const lastTransactionDate = getLastTransactionDate(transactions);

            document.getElementById('customer-details').innerHTML = `
                <h2>Customer Details</h2>
                <p><strong>Nickname:</strong> ${nickname}</p>
                <p><strong>Balance:</strong> ${balance}</p>
                <p><strong>Last Transaction Date:</strong> ${lastTransactionDate}</p>
            `;
        } else {
            document.getElementById('customer-details').innerHTML = `<p>No customer found with ID: ${customerId}</p>`;
        }
    }).catch(error => {
        console.error('Error fetching customer data:', error);
        document.getElementById('customer-details').innerHTML = `<p>Error fetching customer data.</p>`;
    });
});

// 最後の取引日時を取得する関数
function getLastTransactionDate(transactions) {
    let lastDate = 'No transactions';
    
    Object.values(transactions).forEach(transaction => {
        if (!lastDate || transaction.date > lastDate) {
            lastDate = transaction.date;
        }
    });

    return lastDate;
}
