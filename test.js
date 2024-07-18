document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');
    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const totalBill = document.getElementById('total-bill');
    const checkoutBtn = document.getElementById('checkout-btn');
    const contactForm = document.getElementById('contact-form');

    let cart = [];

    // Fetch products from local db.json
    async function fetchProducts(query = '') {
        const response = await fetch('http://localhost:3000/products');
        const products = await response.json();
        return products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
    }

    // Render products on the page
    function renderProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <img src="${product.image}" alt="${product.name}">
                <p>$${product.price.toFixed(2)}</p>
                <button data-id="${product.id}">Add to Cart</button>
            `;
            productElement.querySelector('button').addEventListener('click', () => addToCart(product));
            productList.appendChild(productElement);
        });
    }

    // Add product to cart
    function addToCart(product) {
        cart.push(product);
        renderCart();
    }

    // Remove product from cart
    function removeFromCart(productId) {
        cart = cart.filter(product => product.id !== productId);
        renderCart();
    }

    // Render cart items on the page
    function renderCart() {
        cartItems.innerHTML = '';
        cart.forEach(product => {
            const cartItem = document.createElement('li');
            cartItem.innerHTML = `
                ${product.name} - $${product.price.toFixed(2)} 
                <button data-id="${product.id}">Remove</button>
            `;
            cartItem.querySelector('button').addEventListener('click', () => removeFromCart(product.id));
            cartItems.appendChild(cartItem);
        });
        // Calculate the total bill by summing the prices of all items in the cart
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        // Display the total bill on the page
        totalBill.textContent = `Total: $${total.toFixed(2)}`;
    }

    // Handle search button click
    searchBtn.addEventListener('click', async () => {
        const query = searchBar.value;
        const products = await fetchProducts(query);
        renderProducts(products);
    });

    // Handle checkout button click
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Thank you for shopping with us!');
        } else {
            alert('Cart is empty!');
        }
    });

    // Handle contact form submission
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const feedback = formData.get('feedback');
        console.log(`Name: ${name}, Email: ${email}, Feedback: ${feedback}`);
        alert('Thank you for your feedback!');
        contactForm.reset();
    });

    // Initial fetch and render of products
    fetchProducts().then(renderProducts);
});
