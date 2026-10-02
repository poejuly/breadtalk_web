document.addEventListener('DOMContentLoaded', function() {
    const products = {
        'country-sourdough': {
            name: 'Country Sourdough',
            description: 'Slow-fermented for a crisp crust and a soft, tangy crumb.',
            category: 'BAKERY FAVORITE',
            image: 'img/bread1.jpg',
            price: 50.00
        },
        'honey-oat-loaf': {
            name: 'Honey Oat Loaf',
            description: 'Soft-baked bread finished with golden oats and a touch of honey.',
            category: 'OVEN-FRESH',
            image: 'img/bread2.jpg',
            price: 20.10
        },
        'butter-croissant': {
            name: 'Butter Croissant',
            description: 'Delicate, flaky layers baked until golden with real butter.',
            category: 'BAKED THIS MORNING',
            image: 'img/bread3.jpg',
            price: 11.20
        },
        'cinnamon-brioche': {
            name: 'Cinnamon Swirl Brioche',
            description: 'Enriched brioche ribboned with cinnamon and brown sugar.',
            category: 'BAKERY FAVORITE',
            image: 'img/bread4.jpg',
            price: 11.20
        },
        'seeded-multigrain': {
            name: 'Seeded Multigrain',
            description: 'A hearty wholegrain loaf topped with toasted mixed seeds.',
            category: 'OVEN-FRESH',
            image: 'img/bread5.jpg',
            price: 11.20
        },
        'soft-milk-bread': {
            name: 'Soft Milk Bread',
            description: 'Light, pillowy bread with a tender crumb and a gentle sweetness.',
            category: 'BAKED THIS MORNING',
            image: 'img/bread6.jpg',
            price: 11.20
        },
        'classic-espresso': {
            name: 'Classic Espresso',
            description: 'A rich, full-bodied shot pulled fresh from our house-roasted beans.',
            category: 'COFFEE FAVORITE',
            image: 'img/coffee4.jpg',
            price: 50.00
        },
        'silky-cafe-latte': {
            name: 'Silky Cafe Latte',
            description: 'Espresso blended with steamed milk and a smooth layer of foam.',
            category: 'BARISTA-CRAFTED',
            image: 'img/coffee5.jpg',
            price: 20.10
        },
        'classic-cappuccino': {
            name: 'Classic Cappuccino',
            description: 'A balanced espresso with velvety steamed milk and airy foam.',
            category: 'BARISTA-CRAFTED',
            image: 'img/coffee6.jpg',
            price: 11.20
        },
        'chilled-iced-coffee': {
            name: 'Chilled Iced Coffee',
            description: 'Freshly brewed coffee poured over ice for a crisp, refreshing sip.',
            category: 'SERVED CHILLED',
            image: 'img/coffee7.jpg',
            price: 11.20
        },
        'chocolate-mocha': {
            name: 'Chocolate Mocha',
            description: 'Espresso, steamed milk, and rich chocolate finished with soft foam.',
            category: 'COFFEE FAVORITE',
            image: 'img/coffee8.jpg',
            price: 11.20
        },
        'slow-steeped-cold-brew': {
            name: 'Slow-Steeped Cold Brew',
            description: 'Slow-steeped for a smooth, mellow coffee with a naturally sweet finish.',
            category: 'SERVED CHILLED',
            image: 'img/coffee9.jpg',
            price: 11.20
        }
    };
    const storageKey = 'breadtalk-cart';
    const starterCart = [
        { id: 'country-sourdough', quantity: 1 },
        { id: 'honey-oat-loaf', quantity: 1 },
        { id: 'butter-croissant', quantity: 2 }
    ];

    function loadCart() {
        try {
            const savedCart = localStorage.getItem(storageKey);
            if (savedCart === null) {
                return starterCart.map(function(item) { return { ...item }; });
            }
            const parsedCart = JSON.parse(savedCart);
            if (!Array.isArray(parsedCart)) {
                return [];
            }
            return parsedCart.filter(function(item) {
                return item && products[item.id] && Number.isFinite(Number(item.quantity));
            }).map(function(item) {
                return {
                    id: item.id,
                    quantity: Math.min(20, Math.max(1, Math.floor(Number(item.quantity))))
                };
            });
        } catch (error) {
            return starterCart.map(function(item) { return { ...item }; });
        }
    }

    function saveCart(items) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(items));
            return true;
        } catch (error) {
            return false;
        }
    }

    const cartItems = document.getElementById('cart-items');
    if (!cartItems) {
        document.querySelectorAll('.shopBtn[data-product-id]').forEach(function(button) {
            button.addEventListener('click', function() {
                const cart = loadCart();
                const productId = button.dataset.productId;
                const existingItem = cart.find(function(item) { return item.id === productId; });

                if (existingItem) {
                    existingItem.quantity = Math.min(20, existingItem.quantity + 1);
                } else if (products[productId]) {
                    cart.push({ id: productId, quantity: 1 });
                }

                if (!saveCart(cart)) {
                    window.alert('Your browser could not save the cart. Please enable site storage and try again.');
                    return;
                }
                window.location.href = 'cart.html';
            });
        });
        return;
    }

    const checkoutForm = document.getElementById('checkout-form');
    const visaFields = document.getElementById('visa-fields');
    const kpayFields = document.getElementById('kpay-fields');
    const checkoutMessage = document.getElementById('checkout-message');
    const deliveryFee = 2.50;

    function createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        if (text) {
            element.textContent = text;
        }
        return element;
    }

    function renderCart(items) {
        cartItems.replaceChildren();
        items.forEach(function(item) {
            const product = products[item.id];
            if (!product) {
                return;
            }

            const row = createElement('article', 'cart-item');
            row.dataset.productId = item.id;
            row.dataset.price = product.price.toFixed(2);

            const image = createElement('img', 'cart-item-image');
            image.src = product.image;
            image.alt = product.name;
            row.append(image);

            const info = createElement('div', 'cart-item-info');
            info.append(createElement('p', 'cart-item-category', product.category));
            info.append(createElement('h3', '', product.name));
            info.append(createElement('p', 'cart-item-note', product.description));
            const removeButton = createElement('button', 'cart-remove');
            removeButton.type = 'button';
            removeButton.setAttribute('aria-label', 'Remove ' + product.name);
            removeButton.textContent = 'Remove';
            info.append(removeButton);
            row.append(info);

            const quantityLabel = createElement('label', 'cart-quantity-label', 'Qty');
            const quantityInput = createElement('input', 'cart-quantity');
            quantityInput.type = 'number';
            quantityInput.min = '1';
            quantityInput.max = '20';
            quantityInput.value = item.quantity;
            quantityInput.setAttribute('aria-label', 'Quantity of ' + product.name);
            quantityLabel.append(quantityInput);
            row.append(quantityLabel);

            const price = createElement('p', 'cart-item-price', '$');
            price.append(createElement('span', 'line-total', (product.price * item.quantity).toFixed(2)));
            row.append(price);
            cartItems.append(row);
        });
    }

    function getCartFromRows() {
        return Array.from(cartItems.querySelectorAll('.cart-item')).map(function(item) {
            return {
                id: item.dataset.productId,
                quantity: Number(item.querySelector('.cart-quantity').value)
            };
        });
    }

    function updateCart() {
        const items = Array.from(cartItems.querySelectorAll('.cart-item'));
        let subtotal = 0;
        let itemCount = 0;

        items.forEach(function(item) {
            const quantityInput = item.querySelector('.cart-quantity');
            const quantity = Math.min(20, Math.max(1, Number(quantityInput.value) || 1));
            const price = Number(item.dataset.price);
            quantityInput.value = quantity;
            item.querySelector('.line-total').textContent = (price * quantity).toFixed(2);
            subtotal += price * quantity;
            itemCount += quantity;
        });

        const delivery = items.length ? deliveryFee : 0;
        document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('cart-delivery').textContent = delivery.toFixed(2);
        document.getElementById('cart-total').textContent = (subtotal + delivery).toFixed(2);
        document.getElementById('item-count').textContent = itemCount + (itemCount === 1 ? ' item' : ' items');
        document.getElementById('cart-empty').hidden = items.length > 0;
        document.getElementById('checkout-button').disabled = items.length === 0;
        saveCart(getCartFromRows());
    }

    function updatePaymentFields() {
        const paymentMethod = checkoutForm.querySelector('input[name="payment"]:checked').value;
        visaFields.hidden = paymentMethod !== 'visa';
        kpayFields.hidden = paymentMethod !== 'kpay';
        visaFields.querySelectorAll('input').forEach(function(input) {
            input.required = paymentMethod === 'visa';
        });
        kpayFields.querySelector('input').required = paymentMethod === 'kpay';
    }

    cartItems.addEventListener('input', function(event) {
        if (event.target.matches('.cart-quantity')) {
            updateCart();
        }
    });

    cartItems.addEventListener('click', function(event) {
        const removeButton = event.target.closest('.cart-remove');
        if (removeButton) {
            removeButton.closest('.cart-item').remove();
            updateCart();
        }
    });

    checkoutForm.addEventListener('change', function(event) {
        if (event.target.name === 'payment') {
            updatePaymentFields();
        }
    });

    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const paymentMethod = checkoutForm.querySelector('input[name="payment"]:checked').value;
        const paymentNames = {
            cash: 'cash on delivery',
            visa: 'Visa',
            kpay: 'KPay'
        };
        checkoutMessage.textContent = 'Thanks, ' + checkoutForm.elements.name.value.trim() + '! Your order is ready. Payment is set to ' + paymentNames[paymentMethod] + '. This demo does not process payments.';
        checkoutMessage.hidden = false;
    });

    renderCart(loadCart());
    updatePaymentFields();
    updateCart();
});