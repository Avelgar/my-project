const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/products', (req, res) => {
    fs.readFile('./data/products.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        
        const products = JSON.parse(data);
        const category = req.query.category;
        if (category) {
            const filteredProducts = products.filter(product => 
                product.categories.includes(category)
            );
            return res.json(filteredProducts);
        }

        res.json(products);
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});