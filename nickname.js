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
