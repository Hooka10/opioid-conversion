// .env.localファイルから環境変数を読み込む
require('dotenv').config({ path: '.env.local' });

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 環境変数からDify APIキーを読み込む
const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DIFY_API_URL = 'https://api.dify.ai/v1/workflows/run';

// 起動時にAPIキーの存在をチェック
if (!DIFY_API_KEY) {
    console.error('エラー: DIFY_API_KEYが環境変数に設定されていません。');
    process.exit(1); // エラーでプロセスを終了
}

// Middleware
app.use(express.json());

// Static files serving
app.use(express.static(path.join(__dirname, '/')));

// API endpoint
app.post('/convert', async (req, res) => {
    console.log('Received request on /convert with body:', req.body);

    const { drug_before_name, drug_after_name, drug_before_dose_mg } = req.body;

    if (!drug_before_name || !drug_after_name || !drug_before_dose_mg) {
        return res.status(400).json({ error: '必要な情報が不足しています。' });
    }

    const difyPayload = {
        inputs: { drug_before_name, drug_after_name, drug_before_dose_mg },
        response_mode: 'blocking',
        user: `user-${Date.now()}`
    };

    try {
        const difyResponse = await fetch(DIFY_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DIFY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(difyPayload)
        });

        const responseData = await difyResponse.json();
        console.log('Dify API response data:', responseData);

        if (!difyResponse.ok) {
            throw new Error(`Dify API Error: ${difyResponse.status} ${JSON.stringify(responseData)}`);
        }

        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error calling Dify API:', error.message);
        res.status(500).json({ error: 'Dify APIへのリクエスト中にエラーが発生しました。' });
    }
});

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
