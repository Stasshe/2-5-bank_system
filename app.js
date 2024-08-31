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

document.addEventListener('DOMContentLoaded', function() {
    // URLの最後のパラメータを取得し、プルダウンのデフォルトに設定
    const urlParams = new URLSearchParams(window.location.search);
    const sourceFromUrl = urlParams.get('source');
    
    if (sourceFromUrl) {
        const selectElement = document.getElementById('income-source');
        const option = Array.from(selectElement.options).find(opt => opt.value === sourceFromUrl);
        if (option) {
            selectElement.value = sourceFromUrl;
        }
    }
});

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

    // トランザクションデータを保存する
    db.ref('customers/' + customerId + '/transactions').push({
        amount: amount,
        date: new Date().toISOString(),
        source: incomeSource
    }).then(() => {
        // 残高を更新する
        return db.ref('customers/' + customerId + '/balance').transaction(function(currentBalance) {
            return (currentBalance || 0) + amount;
        });
    }).then((result) => {
        if (!result.committed) {
            console.error("Transaction not committed:", result);
            document.getElementById('transaction-status').innerText = 'Transaction failed';
            return;
        }
        document.getElementById('transaction-status').innerText = 'Transaction successful';
        displayCustomerData(customerId);
        displayTopCustomers();
    }).catch((error) => {
        console.error('Error:', error);
        document.getElementById('transaction-status').innerText = 'Transaction failed';
    });
});


// トップ10ランキングを表示する
function displayTopCustomers() {
    const topCustomersElement = document.getElementById('top-customers');
    
    db.ref('customers').orderByChild('balance').limitToLast(10).once('value').then(snapshot => {
        const customers = [];
        snapshot.forEach(childSnapshot => {
            const customerData = childSnapshot.val();
            const balance = customerData.balance || 0;
            const nickname = customerData.nickname || 'No nickname';  // ニックネームを取得
            customers.push({ nickname, balance });
        });

        // 残高で降順にソート
        customers.sort((a, b) => b.balance - a.balance);

        // トップ10を表示 (IDを非表示)
        topCustomersElement.innerHTML = customers.map((customer, index) => `
            <li>${index + 1 + "位" }, 名前: ${customer.nickname}, 預金額: ${customer.balance}</li>
        `).join('');
    }).catch((error) => {
        console.error('Error fetching top customers:', error);
        topCustomersElement.innerHTML = `<p>Error fetching top customers.</p>`;
    });
}

// 初期表示時にトップ10を表示
displayTopCustomers();
