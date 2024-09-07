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
    
    let customerId = document.getElementById('customer-id').value.trim();
    const nickname = document.getElementById('nickname').value.trim();

    if (!customerId || !nickname) {
        alert('お客様番号とニックネームを入力してください。');
        return;
    }

    // 顧客IDの正規化（頭の0を消去）
    customerId = parseInt(customerId, 10).toString();
    console.log(`正規化された顧客ID: ${customerId}`);

    // ニックネームをFirebaseに保存
    db.ref('customers/' + customerId + '/nickname').set(nickname)
    .then(() => {
        document.getElementById('nickname-status').innerText = 'ニックネームが正常に登録されました';
        console.log('ニックネームの登録に成功しました');
    })
    .catch((error) => {
        console.error('ニックネームの登録中にエラーが発生しました:', error);
        document.getElementById('nickname-status').innerText = 'ニックネームの登録に失敗しました';
    });
});
