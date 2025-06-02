// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart(container = document.querySelector('.cart-items'), totalElement = document.querySelector('.cart-total'), countElement = document.querySelector('.cart-count')) {
    if (!container || !totalElement || !countElement) return;
    container.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item', 'glass');
        cartItem.setAttribute('draggable', true);
        cartItem.dataset.name = item.name;
        cartItem.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <div class="quantity-controls">
                <button class="quantity-decrement" data-name="${item.name}" aria-label="Decrease quantity">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-increment" data-name="${item.name}" aria-label="Increase quantity">+</button>
            </div>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
            <button class="remove-item" data-name="${item.name}" aria-label="Remove ${item.name}"><i class="fa-solid fa-trash"></i></button>
        `;
        container.appendChild(cartItem);

        gsap.from(cartItem, { opacity: 0, y: 50, duration: 0.5, ease: 'power2.out' });
    });

    countElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalElement.textContent = `Total: ₹${total.toFixed(2)}`;

    // Drag to remove
    container.querySelectorAll('.cart-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', item.dataset.name);
            item.style.opacity = '0.5';
        });
        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
        });
    });

    container.addEventListener('dragover', (e) => e.preventDefault());
    container.addEventListener('drop', (e) => {
        e.preventDefault();
        const name = e.dataTransfer.getData('text');
        cart = cart.filter(item => item.name !== name);
        saveCart();
        updateCart();
    });

    // Quantity controls
    container.querySelectorAll('.quantity-increment').forEach(button => {
        button.addEventListener('click', debounce(() => {
            const name = button.dataset.name;
            const item = cart.find(i => i.name === name);
            if (item) item.quantity++;
            saveCart();
            updateCart();
        }, 200));
    });

    container.querySelectorAll('.quantity-decrement').forEach(button => {
        button.addEventListener('click', debounce(() => {
            const name = button.dataset.name;
            const item = cart.find(i => i.name === name);
            if (item && item.quantity > 1) item.quantity--;
            else cart = cart.filter(i => i.name !== name);
            saveCart();
            updateCart();
        }, 200));
    });

    container.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', debounce(() => {
            const name = button.dataset.name;
            cart = cart.filter(item => item.name !== name);
            saveCart();
            updateCart();
        }, 200));
    });
}

// Page initialization
function initializePage() {
    const cartCount = document.querySelector('.cart-count');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const themeToggle = document.querySelector('.theme-toggle');

    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            gsap.to(navLinksContainer, {
                x: navLinksContainer.classList.contains('active') ? 0 : 300,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            themeToggle.innerHTML = document.body.classList.contains('dark-mode')
                ? '<i class="fa-solid fa-sun"></i>'
                : '<i class="fa-solid fa-moon"></i>';
        });
    }

    document.querySelectorAll('.modal-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalClass = link.dataset.modal;
            const modal = document.querySelector(`.${modalClass}`);
            modal.style.display = 'flex';
            gsap.to(modal, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
        });
    });

    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            gsap.to(modal, {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    modal.style.display = 'none';
                }
            });
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                gsap.to(modal, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                        modal.style.display = 'none';
                    }
                });
            }
        });
    });

    // GSAP ScrollTrigger for animations
    gsap.utils.toArray('.glass, .product-card, .cart-item, .order-item, .profile, .contact').forEach(el => {
        gsap.from(el, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });
}

// Home page
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    const shopNowBtn = document.querySelector('.shop-now');
    const contactForm = document.querySelector('.contact-form');
    const productCarousel = document.querySelector('.product-carousel');

    function loadFeaturedProducts() {
        productCarousel.innerHTML = '';
        const featured = products.slice(0, 6);
        featured.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card', 'glass');
            productCard.dataset.category = product.category;
            productCard.dataset.price = product.price;
            productCard.innerHTML = `
                <a href="product-details.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </a>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>₹${product.price}</p>
                    <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}" aria-label="Add ${product.name} to cart">Add to Cart</button>
                </div>
            `;
            productCarousel.appendChild(productCard);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', debounce(() => {
                const name = button.dataset.name;
                const price = parseFloat(button.dataset.price);
                const item = cart.find(i => i.name === name);

                if (item) {
                    item.quantity++;
                } else {
                    cart.push({ name, price, quantity: 1 });
                }

                saveCart();
                updateCart();
                gsap.to(button, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
                alert(`${name} added to cart!`);
            }, 200));
        });

        document.querySelectorAll('.product-card img').forEach(img => {
            img.onerror = () => {
                img.src = 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg';
            };
        });

        // Carousel animation
        gsap.to('.product-carousel', {
            x: '-=100%',
            duration: 20,
            repeat: -1,
            ease: 'linear',
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % (productCarousel.scrollWidth / 2))
            }
        });
    }

    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', () => {
            gsap.to(window, {
                scrollTo: { y: '.products', offsetY: 80 },
                duration: 1,
                ease: 'power2.out'
            });
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', debounce((e) => {
            e.preventDefault();
            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            if (!name || !email) {
                alert('Please fill in all required fields.');
                return;
            }
            gsap.to(contactForm, { opacity: 0, duration: 0.5, onComplete: () => {
                alert('Message sent! We’ll get back to you soon.');
                contactForm.reset();
                gsap.to(contactForm, { opacity: 1, duration: 0.5 });
            }});
        }, 200));
    }

    loadFeaturedProducts();
    initializePage();

    // Hero animation
    gsap.from('.hero-content', { opacity: 0, y: 100, duration: 1, delay: 0.5, ease: 'power3.out' });
}

// Products page
if (window.location.pathname.includes('products.html')) {
    const categoryFilter = document.querySelector('#category-filter');
    const priceFilter = document.querySelector('#price-filter');
    const productGrid = document.querySelector('.product-grid');
    const loader = document.querySelector('#loader');

    function loadProducts() {
        productGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card', 'glass');
            productCard.dataset.category = product.category;
            productCard.dataset.price = product.price;
            productCard.innerHTML = `
                <a href="product-details.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </a>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>₹${product.price}</p>
                    <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}" aria-label="Add ${product.name} to cart">Add to Cart</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', debounce(() => {
                const name = button.dataset.name;
                const price = parseFloat(button.dataset.price);
                const item = cart.find(i => i.name === name);

                if (item) {
                    item.quantity++;
                } else {
                    cart.push({ name, price, quantity: 1 });
                }

                saveCart();
                updateCart();
                gsap.to(button, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
                alert(`${name} added to cart!`);
            }, 200));
        });

        document.querySelectorAll('.product-card img').forEach(img => {
            img.onerror = () => {
                img.src = 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg';
            };
        });

        // 3D tilt effect
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                gsap.to(card, { rotationX: rotateX, rotationY: rotateY, duration: 0.3, ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.3, ease: 'power2.out' });
            });
        });
    }

    function filterProducts() {
        const category = categoryFilter.value;
        const priceRange = priceFilter.value;
        const products = document.querySelectorAll('.product-card');

        loader.style.display = 'block';
        gsap.to(productGrid, { opacity: 0.5, duration: 0.3 });

        setTimeout(() => {
            products.forEach(product => {
                const productCategory = product.dataset.category;
                const productPrice = parseFloat(product.dataset.price);
                let show = true;

                if (category !== 'all' && productCategory !== category) {
                    show = false;
                }

                if (priceRange !== 'all') {
                    if (priceRange === '0-5000' && (productPrice < 0 || productPrice > 5000)) {
                        show = false;
                    } else if (priceRange === '5000-10000' && (productPrice < 5000 || productPrice > 10000)) {
                        show = false;
                    } else if (priceRange === '10000+' && productPrice <= 10000) {
                        show = false;
                    }
                }

                product.style.display = show ? 'block' : 'none';
                if (show) {
                    gsap.from(product, { opacity: 0, y: 50, duration: 0.5, ease: 'power2.out' });
                }
            });

            loader.style.display = 'none';
            gsap.to(productGrid, { opacity: 1, duration: 0.3 });
        }, 500);
    }

    if (categoryFilter && priceFilter) {
        categoryFilter.addEventListener('change', filterProducts);
        priceFilter.addEventListener('change', filterProducts);
    }

    loadProducts();
    filterProducts();
    initializePage();
}

// Product Details page
if (window.location.pathname.includes('product-details.html')) {
    const productId = new URLSearchParams(window.location.search).get('id');
    const product = products.find(p => p.id === parseInt(productId));
    const productDetails = document.querySelector('.product-details');

    if (product && productDetails) {
        productDetails.classList.add('glass');
        productDetails.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-details-info">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p class="price">₹${product.price}</p>
                <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}" aria-label="Add ${product.name} to cart">Add to Cart</button>
            </div>
        `;

        document.querySelector('.add-to-cart').addEventListener('click', debounce(() => {
            const name = product.name;
            const price = product.price;
            const item = cart.find(i => i.name === name);

            if (item) {
                item.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            saveCart();
            updateCart();
            gsap.to('.add-to-cart', { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
            alert(`${product.name} added to cart!`);
        }, 200));

        document.querySelector('.product-image img').onerror = () => {
            this.src = 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg';
        };

        // Image zoom effect
        const img = document.querySelector('.product-image img');
        img.addEventListener('mousemove', (e) => {
            const rect = img.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            img.style.transformOrigin = `${x}px ${y}px`;
            gsap.to(img, { scale: 1.5, duration: 0.3 });
        });
        img.addEventListener('mouseleave', () => {
            gsap.to(img, { scale: 1, duration: 0.3 });
        });
    }

    initializePage();
}

// Cart page
if (window.location.pathname.includes('cart.html')) {
    const checkoutBtn = document.querySelector('.checkout');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', debounce(() => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            const orders = getOrders();
            const order = {
                id: orders.length + 1,
                date: new Date().toLocaleDateString(),
                items: [...cart],
                total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
            };
            orders.push(order);
            saveOrders(orders);
            cart = [];
            saveCart();
            updateCart();
            gsap.to('.cart', { opacity: 0, duration: 0.5, onComplete: () => {
                alert('Order placed successfully!');
                window.location.href = 'orders.html';
            }});
        }, 200));
    }

    updateCart();
    initializePage();
}

// Orders page
if (window.location.pathname.includes('orders.html')) {
    const ordersTimeline = document.querySelector('.orders-timeline');
    const orders = getOrders();

    if (ordersTimeline) {
        ordersTimeline.innerHTML = '';
        orders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item', 'glass');
            orderItem.innerHTML = `
                <div class="order-header">
                    <h3>Order #${order.id}</h3>
                    <span>${order.date}</span>
                    <span>₹${order.total.toFixed(2)}</span>
                    <button class="toggle-details" aria-label="Toggle order details"><i class="fa-solid fa-chevron-down"></i></button>
                </div>
                <div class="order-details-content" style="display: none;">
                    <ul>
                        ${order.items.map(item => `<li>${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
                    </ul>
                    <a href="order-details.html?id=${order.id}" aria-label="View full order details">View Full Details</a>
                </div>
            `;
            ordersTimeline.appendChild(orderItem);
        });

        document.querySelectorAll('.toggle-details').forEach(button => {
            button.addEventListener('click', () => {
                const details = button.closest('.order-item').querySelector('.order-details-content');
                const isVisible = details.style.display === 'block';
                gsap.to(details, {
                    height: isVisible ? 0 : 'auto',
                    opacity: isVisible ? 0 : 1,
                    duration: 0.5,
                    ease: 'power2.out',
                    onComplete: () => {
                        details.style.display = isVisible ? 'none' : 'block';
                    }
                });
                gsap.to(button.querySelector('i'), { rotation: isVisible ? 0 : 180, duration: 0.3 });
            });
        });
    }

    initializePage();
}

// Order Details page
if (window.location.pathname.includes('order-details.html')) {
    const orderId = new URLSearchParams(window.location.search).get('id');
    const order = getOrders().find(o => o.id === parseInt(orderId));
    const orderDetails = document.querySelector('.order-details');

    if (order && orderDetails) {
        orderDetails.classList.add('glass');
        orderDetails.innerHTML = `
            <h2>Order #${order.id}</h2>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
            <div class="order-details-items">
                <h3>Items</h3>
                <ul>
                    ${order.items.map(item => `<li>${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
                </ul>
            </div>
        `;

        gsap.from('.order-details > *', { opacity: 0, y: 50, stagger: 0.2, duration: 0.8, ease: 'power2.out' });
    }

    initializePage();
}

// Profile page
if (window.location.pathname.includes('profile.html')) {
    const profileForm = document.querySelector('.profile-form');
    const avatarInput = document.querySelector('#avatar');
    const avatarPreview = document.querySelector('#avatar-preview');
    const profile = getUserProfile();

    if (profileForm) {
        profileForm.querySelector('#name').value = profile.name;
        profileForm.querySelector('#email').value = profile.email;
        profileForm.querySelector('#address').value = profile.address;
        avatarPreview.src = profile.avatar;

        profileForm.addEventListener('submit', debounce((e) => {
            e.preventDefault();
            const newProfile = {
                name: profileForm.querySelector('#name').value.trim(),
                email: profileForm.querySelector('#email').value.trim(),
                address: profileForm.querySelector('#address').value.trim(),
                avatar: avatarPreview.src
            };
            if (!newProfile.name || !newProfile.email) {
                alert('Please fill in all required fields.');
                return;
            }
            saveUserProfile(newProfile);
            gsap.to('.profile', { opacity: 0, duration: 0.5, onComplete: () => {
                alert('Profile updated!');
                gsap.to('.profile', { opacity: 1, duration: 0.5 });
            }});
        }, 200));
    }

    if (avatarInput && avatarPreview) {
        avatarInput.addEventListener('change', () => {
            const file = avatarInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    avatarPreview.src = reader.result;
                    gsap.from(avatarPreview, { scale: 0.8, opacity: 0, duration: 0.5, ease: 'power2.out' });
                };
                reader.readAsDataURL(file);
            }
        });
    }

    initializePage();
}
