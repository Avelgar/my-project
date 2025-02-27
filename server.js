const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/products', (req, res) => {
    fs.readFile('./data/products.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
