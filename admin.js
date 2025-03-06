const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;
const DATA_FILE = path.join(__dirname, 'data/products.json');

app.use(express.json());
app.use(express.static('public'));

const readData = () => {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get('/api/products', (req, res) => {
    const products = readData();
    res.json(products);
});

// Добавление товаров
app.post('/api/products', (req, res) => {
    const newProducts = req.body;
    const products = readData();

    const maxId = products.length > 0 ? Math.max(...products.map(product => product.id)) : 0;
    newProducts.forEach((product, index) => {
        const newProduct = {
            id: maxId + index + 1,
            name: product.name,
            price: product.price,
            description: product.description,
            categories: product.categories
        };
        products.push(newProduct);
    });

    writeData(products);
    res.status(201).json(newProducts);
});


// Редактирование товара
app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedProduct = req.body;
    const products = readData();

    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
        if (typeof updatedProduct.categories === 'string') {
            updatedProduct.categories = updatedProduct.categories.split(',').map(category => category.trim());
        }

        products[productIndex] = { ...products[productIndex], ...updatedProduct };
        writeData(products);
        res.json(products[productIndex]);
    } else {
        res.status(404).json({ message: 'Товар не найден' });
    }
});

// Удаление товара
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const products = readData();

    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        writeData(products);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Товар не найден' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}/admin.html`);
});
