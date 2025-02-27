const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const dataPath = path.join(__dirname, 'data', 'products.json');

const readData = () => {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
};

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST' && req.url === '/add-product') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const newProduct = JSON.parse(body);
            const products = readData();
            const lastId = products.length ? Math.max(...products.map(p => p.id)) : 0;
            newProduct.id = lastId + 1;
            newProduct.price = Math.floor(Number(newProduct.price));
            newProduct.categories = newProduct.categories.split(',').map(cat => cat.trim());
            const productWithId = { id: newProduct.id, ...newProduct };

            products.push(productWithId);
            writeData(products);
            res.end(JSON.stringify({ message: 'Товар добавлен.', product: productWithId }));
        });
    } else if (req.method === 'POST' && req.url === '/edit-product') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const updatedProduct = JSON.parse(body);
            const products = readData();
            const index = products.findIndex(p => p.id === Number(updatedProduct.id));
            if (index !== -1) {
                updatedProduct.id = Number(updatedProduct.id);
                updatedProduct.price = Math.floor(Number(updatedProduct.price));
                updatedProduct.categories = updatedProduct.categories.split(',').map(cat => cat.trim());

                products[index] = { ...products[index], ...updatedProduct };

                writeData(products);
                res.end(JSON.stringify({ message: 'Товар обновлён.' }));
            } else {
                res.end(JSON.stringify({ message: 'Товар не найден.' }));
            }
        });
    } else if (req.method === 'POST' && req.url === '/delete-product') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { id } = JSON.parse(body);
            const products = readData();
            const newProducts = products.filter(p => p.id !== Number(id));
            if (newProducts.length < products.length) {
                writeData(newProducts);
                res.end(JSON.stringify({ message: 'Товар удалён.' }));
            } else {
                res.end(JSON.stringify({ message: 'Товар не найден.' }));
            }
        });
    } else if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const filePath = path.join(__dirname, 'public', 'admin.html');
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Не найдено.' }));
    }
});

server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
