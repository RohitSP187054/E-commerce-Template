const products = [
    { id: 1, name: "Neon Wireless Headphones", category: "electronics", price: 2999, image: "https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg", description: "Immersive audio with neon LED accents and noise cancellation." },
    { id: 2, name: "Cyber Sneakers", category: "fashion", price: 3999, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", description: "Futuristic sneakers with glow-in-the-dark soles." },
    { id: 3, name: "Holo Smartwatch", category: "electronics", price: 4999, image: "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg", description: "Holographic display smartwatch with fitness tracking." },
    { id: 4, name: "Neo Backpack", category: "accessories", price: 1999, image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg", description: "Sleek backpack with USB charging port." },
    { id: 5, name: "Carbon Fiber Wallet", category: "accessories", price: 999, image: "https://images.unsplash.com/photo-1601592996763-f05c9c80a7f1?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Minimalist wallet with RFID protection." },
    { id: 6, name: "True Wireless Pods", category: "electronics", price: 2499, image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg", description: "Crystal-clear audio in a compact design." },
    { id: 7, name: "Neon Sunglasses", category: "accessories", price: 799, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f", description: "Polarized lenses with neon frames." },
    { id: 8, name: "Quantum Laptop", category: "electronics", price: 99999, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45", description: "Ultra-fast laptop with quantum processing." },
    { id: 9, name: "Pro DSLR Camera", category: "electronics", price: 84999, image: "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg", description: "Professional-grade camera for stunning visuals." },
    { id: 10, name: "Holo Smartphone", category: "electronics", price: 29999, image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg", description: "Holographic display smartphone with AI camera." },
    { id: 11, name: "VR Gaming Console", category: "electronics", price: 49999, image: "https://images.pexels.com/photos/3945659/pexels-photo-3945659.jpeg", description: "Immersive VR gaming with 8K resolution." },
    { id: 12, name: "Smart Fitness Band", category: "accessories", price: 1999, image: "https://plus.unsplash.com/premium_photo-1681433383783-661b519b154a?q=80&w=2660&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Track your fitness with real-time analytics." }
];

const getOrders = () => {
    return JSON.parse(localStorage.getItem('orders')) || [];
};

const saveOrders = (orders) => {
    localStorage.setItem('orders', JSON.stringify(orders));
};

const getUserProfile = () => {
    return JSON.parse(localStorage.getItem('userProfile')) || {
        name: "Alex Neo",
        email: "alex.neo@neotrend.com",
        address: "123 Future Ave, Mumbai, MH-400001, India",
        avatar: "https://via.placeholder.com/150"
    };
};

const saveUserProfile = (profile) => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
};
