/* app.js */

// Select Element 
const productsEl = document.querySelector(".products");
const cartItemsEl = document.querySelector(".cart-items");
const subtotalEl = document.querySelector(".subtotal");
const totalItemsInCartEl = document.querySelector(".total-items-in-cart");



// A function to render the products
function renderProducts() {
    // Each product in the products array from the products.js file
    // Add it to the 'products class in the HTML file
    products.forEach( (product) => {
        productsEl.innerHTML += `
            <div class="item">
                <div class="item-container">
                    <div class="item-img">
                        <img src="${product.imgSrc}" alt="${product.name}">
                    </div>
                    <div class="desc">
                        <h2>${product.name}</h2>
                        <h2><small>€</small>${product.price}</h2>
                        <p>
                            ${product.description}
                        </p>
                    </div>
                    <div class="add-to-wishlist">
                        <img src="./icons/heart.png" alt="add to wish list">
                    </div>
                    <div class="add-to-cart" onclick="addToCart(${product.id})">
                        <img src="./icons/bag-plus.png" alt="add to cart">
                    </div>
                </div>
            /div>
        `;
    });
}

renderProducts();

// cart array. If nothing is in the local storage for the cart, then
// assign the cart variable and empty array. 
let cart =  JSON.parse(localStorage.getItem("CART")) || [];
updateCart();

// Add to Cart
function addToCart(id) {
    // Check if the product is already in the cart
    if (cart.some( item => item.id === id)) {
        changeNumberOfUnits("plus", id);
    } else {

        // find the correct t-shirt in the products array by using the id
        const item = products.find( product => product.id === id);
        // add the item to the cart
        cart.push({
            ...item,
            numberOfUnits : 1,
        });
    }

    updateCart();
}

function updateCart() {
    renderCartItems();
    renderSubtotal();

    // save cart to local storage
    // The JSON.stringify() method converts a JavaScript object or value to a JSON string.
    localStorage.setItem("CART", JSON.stringify(cart));
}


function renderSubtotal() {
    let totalPrice = 0;
    let totalItems = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.numberOfUnits;
        totalItems += item.numberOfUnits;
    });

    subtotalEl.innerHTML = `Subtotal (${totalItems} items: €${totalPrice.toFixed(2)})`;
    totalItemsInCartEl.innerHTML = totalItems;
}

function renderCartItems() {
    // clear before adding anything to the cart
    cartItemsEl.innerHTML = "";

    cart.forEach( item => {
        cartItemsEl.innerHTML += `
            <div class="cart-item">
                <div class="item-info" onclick="removeItemFromCart(${item.id})">
                    <img src="${item.imgSrc}" alt="${item.name}">
                    <h4>${item.name}</h4>
                </div>
                <div class="unit-price">
                    <small>$</small>${item.price}
                </div>
                <div class="units">
                    <div class="btn minus" onclick="changeNumberOfUnits('minus', ${item.id})">-</div>
                    <div class="number">${item.numberOfUnits}</div>
                    <div class="btn plus" onclick="changeNumberOfUnits('plus', ${item.id})">+</div>           
                </div>
            </div>
        `;
    });
}

// remove items from cart
function removeItemFromCart(id) {
    // The filter method is passed a function with a condition, it will remove/ filter
    // any items from the cart that is not the id passed into the function
    cart = cart.filter( item => item.id != id );

    updateCart();
}

// change the number of units for an item
function changeNumberOfUnits(action, id) {
    // map will run the function on every element in the cart and return
    // a new array
    cart = cart.map( item => {
        let numberOfUnits = item.numberOfUnits;

        // Check the id of each item in the cart to see if it's
        // the item we want to change the quanity of
        if (item.id === id) {
            if (action === "minus" && numberOfUnits > 1) 
                numberOfUnits--;
            else if (action === "plus" &&  numberOfUnits < item.instock)
                numberOfUnits++;
        }
        return {
            ...item,
            numberOfUnits, // the property is the same name as the variable 
            // declared above, therefore it's value will be assigned to the 
            // property of the same name 
        }
    });

    updateCart();
}