const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

const productsFilePath = './data/products.json';

// Получение всех товаров
app.get('/admin/products', (req, res) => {
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        res.json(JSON.parse(data));
    });
});

// Добавление новых товаров
app.post('/admin/products', (req, res) => {
    const newProducts = req.body;

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        const products = JSON.parse(data);
        const updatedProducts = [...products, ...newProducts];
        fs.writeFile(productsFilePath, JSON.stringify(updatedProducts, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи файла');
            }
            res.status(201).send('Товары добавлены');
        });
    });
});

// Редактирование товара по ID
app.put('/admin/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProduct = req.body;

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        const products = JSON.parse(data);
        const productIndex = products.findIndex(product => product.id === productId);
        if (productIndex === -1) {
            return res.status(404).send('Товар не найден');
        }
        products[productIndex] = { ...products[productIndex], ...updatedProduct };
        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи файла');
            }
            res.send('Товар обновлен');
        });
    });
});

// Удаление товара по ID
app.delete('/admin/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        const products = JSON.parse(data);
        const updatedProducts = products.filter(product => product.id !== productId);
        fs.writeFile(productsFilePath, JSON.stringify(updatedProducts, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи файла');
            }
            res.send('Товар удален');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Административный сервер запущен на http://localhost:${PORT}`);
});
