const productNameInput = document.getElementById('productName');
const sellingPriceInput = document.getElementById('sellingPrice');
const addProductButton = document.getElementById('addProductButton');
const productList = document.getElementById('productList');
const totalValueSpan = document.getElementById('totalValue');

let totalValue = 0;
const apiBaseUrl = 'https://crudcrud.com/api/4694697b69e545edb7b7218dd1b18fcf/products';


async function fetchProducts() {
    try {
        const response = await fetch(apiBaseUrl);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        
        productList.innerHTML = '';
        totalValue = 0;

        products.forEach(product => displayProduct(product));
        updateTotalValue();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProduct(product) {
    const listItem = document.createElement('li');
    listItem.textContent = product.name + ' - Rs.' + product.price.toFixed(2);
    listItem.setAttribute('data-id', product._id);
    listItem.setAttribute('data-price', product.price);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteProduct(product._id, parseFloat(product.price)));

    listItem.appendChild(deleteButton);
    productList.appendChild(listItem);

    totalValue += product.price;
}

function updateTotalValue() {
    totalValueSpan.textContent = totalValue.toFixed(2);
}

async function addProduct() {
    const productName = productNameInput.value.trim();
    const sellingPrice = parseFloat(sellingPriceInput.value);

    if (productName === '' || isNaN(sellingPrice) || sellingPrice <= 0) {
        alert('Please enter valid product name and price.');
        return;
    }

    const newProduct = { name: productName, price: sellingPrice };

    try {
        const response = await fetch(apiBaseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct),
        });
        if (!response.ok) throw new Error('Failed to add product');
        const createdProduct = await response.json();
        displayProduct(createdProduct);
        updateTotalValue();

        productNameInput.value = '';
        sellingPriceInput.value = '';
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

async function deleteProduct(productId, price) {
    try {
        const response = await fetch(apiBaseUrl + '/' + productId, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete product');

        const listItem = [...productList.children].find(function(item) {
            return item.getAttribute('data-id') === productId;
        });
        if (listItem) productList.removeChild(listItem);

        totalValue -= price;
        updateTotalValue();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

addProductButton.addEventListener('click', addProduct);

fetchProducts();
