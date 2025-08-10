document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const form = document.getElementById('conversion-form');
    const resultList = document.getElementById('result-list');
    const loadingIndicator = document.getElementById('loading');
    const submitButton = document.getElementById('submit-button');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Form submission triggered.');

        loadingIndicator.style.display = 'block';
        submitButton.disabled = true;
        submitButton.textContent = '計算中...';
        resultList.innerHTML = '';

        const formData = {
            drug_before_name: document.getElementById('drug_before_name').value,
            drug_before_dose_mg: `${document.getElementById('drug_before_dose_mg').value}mg`,
            drug_after_name: document.getElementById('drug_after_name').value
        };

        console.log('Sending data to server:', formData);

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('Received response from server:', response);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`サーバーエラー: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            console.log('Parsed JSON result from server:', result);

            // --- 修正箇所 --- //
            // 正しいレスポンス構造からテキストを取得
            const resultText = result?.data?.outputs?.text;

            if (resultText) {
                // テキストを改行で分割してリスト項目を作成
                const items = resultText.split('\n').filter(item => item.trim() !== '');
                items.forEach(itemText => {
                    const li = document.createElement('li');
                    li.textContent = itemText;
                    resultList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = '有効な結果が得られませんでした。レスポンスの構造を確認してください。';
                resultList.appendChild(li);
                // デバッグ用にレスポンス全体を表示
                const pre = document.createElement('pre');
                pre.textContent = JSON.stringify(result, null, 2);
                resultList.appendChild(pre);
            }
            // --- 修正箇所ここまで --- 

        } catch (error) {
            console.error('Error during conversion:', error);
            const li = document.createElement('li');
            li.textContent = `エラーが発生しました: ${error.message}`;
            resultList.appendChild(li);
        } finally {
            loadingIndicator.style.display = 'none';
            submitButton.disabled = false;
            submitButton.textContent = '換算実行';
        }
    });
});