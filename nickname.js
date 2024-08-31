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

document.getElementById('nickname-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const customerId = document.getElementById('customer-id').value.trim();
    const nickname = document.getElementById('nickname').value.trim();

    if (!customerId || !nickname) {
        alert('IDとニックネームを入力してください。');
        return;
    }

    // ニックネームを保存する
    db.ref('customers/' + customerId + '/nickname').set(nickname)
    .then(() => {
        document.getElementById('nickname-status').innerText = 'Nickname registered successfully';
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('nickname-status').innerText = 'Failed to register nickname';
    });
});
