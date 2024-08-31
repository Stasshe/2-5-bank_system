const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = document.getElementById('amount').value;

    db.ref('transactions').push({
        amount: amount,
        date: new Date().toISOString()
    });

    document.getElementById('transaction-status').innerText = 'Transaction successful';
});

