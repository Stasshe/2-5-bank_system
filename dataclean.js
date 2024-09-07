



// 全顧客のIDをスキャンして、0がついているIDを修正するスクリプト
function fixCustomerIds() {
    db.ref('customers').once('value').then(snapshot => {
        const updates = {};
        snapshot.forEach(childSnapshot => {
            const customerId = childSnapshot.key;
            const normalizedCustomerId = parseInt(customerId, 10).toString(); // 0を除去して自然数に変換

            if (customerId !== normalizedCustomerId) {
                // 正しいIDにデータを移動する
                updates[`customers/${normalizedCustomerId}`] = childSnapshot.val();
                // 元のIDのデータを削除する
                updates[`customers/${customerId}`] = null;
            }
        });

        // Firebaseを更新
        return db.ref().update(updates);
    }).then(() => {
        console.log('All customer IDs have been normalized.');
    }).catch((error) => {
        console.error('Error normalizing customer IDs:', error);
    });
}

// 実行
fixCustomerIds();
