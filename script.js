// ERMS Restaurant Management System JavaScript

// Global state
let currentUser = null;
let currentPage = 'dashboard';
let editingItemId = null;

// Sample data
let menuItems = [
    { id: 1, name: 'Grilled Salmon', category: 'Main Course', price: 28.99, status: 'Available', emoji: '🐟' },
    { id: 2, name: 'Caesar Salad', category: 'Appetizer', price: 12.99, status: 'Available', emoji: '🥗' },
    { id: 3, name: 'Chocolate Cake', category: 'Dessert', price: 8.99, status: 'Out of Stock', emoji: '🍰' },
    { id: 4, name: 'Beef Steak', category: 'Main Course', price: 32.99, status: 'Available', emoji: '🥩' },
    { id: 5, name: 'Mushroom Soup', category: 'Appetizer', price: 9.99, status: 'Available', emoji: '🍄' },
    { id: 6, name: 'Tiramisu', category: 'Dessert', price: 7.99, status: 'Available', emoji: '🍮' }
];

let orders = [
    { id: 1, table: 'Table 5', items: ['Grilled Salmon', 'Caesar Salad'], total: 41.98, status: 'Preparing', time: '10:30 AM' },
    { id: 2, table: 'Table 2', items: ['Beef Steak', 'Chocolate Cake'], total: 41.98, status: 'Ready', time: '10:15 AM' },
    { id: 3, table: 'Table 8', items: ['Caesar Salad'], total: 12.99, status: 'Delivered', time: '10:05 AM' },
    { id: 4, table: 'Table 1', items: ['Mushroom Soup', 'Grilled Salmon'], total: 38.98, status: 'Preparing', time: '10:45 AM' },
    { id: 5, table: 'Table 7', items: ['Tiramisu', 'Caesar Salad'], total: 20.98, status: 'Ready', time: '10:20 AM' }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show login page initially
    showLoginPage();
});

// Event Listeners Setup
function setupEventListeners() {
    // Login functionality
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Menu management
    document.getElementById('addMenuBtn').addEventListener('click', () => openMenuModal());
    document.getElementById('searchMenu').addEventListener('input', filterMenuItems);
    document.getElementById('categoryFilter').addEventListener('change', filterMenuItems);
    
    // Modal functionality
    document.getElementById('closeModal').addEventListener('click', closeMenuModal);
    document.getElementById('cancelModal').addEventListener('click', closeMenuModal);
    document.getElementById('saveModal').addEventListener('click', saveMenuItem);
    
    // Close modal when clicking outside
    document.getElementById('menuModal').addEventListener('click', function(e) {
        if (e.target === this) closeMenuModal();
    });
}

// Login functionality
function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (username && password) {
        currentUser = {
            name: username,
            role: 'Manager'
        };
        
        document.getElementById('userName').textContent = username;
        showMainApp();
        navigateToPage('dashboard');
    } else {
        alert('Please enter both username and password');
    }
}

// Logout functionality
function handleLogout() {
    currentUser = null;
    showLoginPage();
    // Clear form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Show/Hide pages
function showLoginPage() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

function showMainApp() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
}

// Navigation
function navigateToPage(page) {
    currentPage = page;
    
    // Update active navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Show/hide pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(`${page}Page`).classList.add('active');
    
    // Load page content
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'menu':
            loadMenuManagement();
            break;
        case 'orders':
            loadOrdersManagement();
            break;
    }
}

// Dashboard functionality
function loadDashboard() {
    loadRecentOrders();
    loadPopularItems();
}

function loadRecentOrders() {
    const container = document.getElementById('recentOrders');
    const recentOrders = orders.slice(0, 3);
    
    container.innerHTML = recentOrders.map(order => `
        <div class="order-item">
            <div class="order-info">
                <div class="order-details">
                    <h4>${order.table}</h4>
                    <p>${order.items.join(', ')}</p>
                </div>
            </div>
            <div class="order-total">
                <p class="price">$${order.total.toFixed(2)}</p>
                <span class="status-badge status-${order.status.toLowerCase().replace(' ', '-')}">
                    ${order.status}
                </span>
            </div>
        </div>
    `).join('');
}

function loadPopularItems() {
    const container = document.getElementById('popularItems');
    const popularItems = menuItems.filter(item => item.status === 'Available').slice(0, 3);
    
    container.innerHTML = popularItems.map(item => `
        <div class="menu-item">
            <div class="item-info">
                <span class="emoji">${item.emoji}</span>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.category}</p>
                </div>
            </div>
            <p class="item-price">$${item.price.toFixed(2)}</p>
        </div>
    `).join('');
}

// Menu Management functionality
function loadMenuManagement() {
    displayMenuItems();
}

function filterMenuItems() {
    displayMenuItems();
}

function displayMenuItems() {
    const searchTerm = document.getElementById('searchMenu').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    const container = document.getElementById('menuGrid');
    container.innerHTML = filteredItems.map(item => `
        <div class="menu-card">
            <div class="menu-card-image">
                <span class="emoji">${item.emoji}</span>
            </div>
            <h3>${item.name}</h3>
            <p class="category">${item.category}</p>
            <p class="price">$${item.price.toFixed(2)}</p>
            <div class="status">
                <span class="status-badge status-${item.status.toLowerCase().replace(' ', '-')}">
                    ${item.status}
                </span>
            </div>
            <div class="menu-card-actions">
                <button class="edit-btn" onclick="editMenuItem(${item.id})">
                    <i data-lucide="edit-3"></i>
                    Edit
                </button>
                <button class="delete-btn" onclick="deleteMenuItem(${item.id})">
                    <i data-lucide="trash-2"></i>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
    
    // Reinitialize icons
    lucide.createIcons();
}

function openMenuModal(item = null) {
    editingItemId = item ? item.id : null;
    const modal = document.getElementById('menuModal');
    const title = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveModal');
    
    if (item) {
        title.textContent = 'Edit Menu Item';
        saveBtn.textContent = 'Update Item';
        // Fill form with item data
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemPrice').value = item.price;
        document.getElementById('itemStatus').value = item.status;
    } else {
        title.textContent = 'Add New Menu Item';
        saveBtn.textContent = 'Add Item';
        // Clear form
        document.getElementById('itemName').value = '';
        document.getElementById('itemCategory').value = 'Appetizer';
        document.getElementById('itemPrice').value = '';
        document.getElementById('itemStatus').value = 'Available';
    }
    
    modal.classList.remove('hidden');
}

function closeMenuModal() {
    document.getElementById('menuModal').classList.add('hidden');
    editingItemId = null;
}

function saveMenuItem() {
    const name = document.getElementById('itemName').value.trim();
    const category = document.getElementById('itemCategory').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const status = document.getElementById('itemStatus').value;
    
    if (!name || !price) {
        alert('Please fill in all required fields');
        return;
    }
    
    const itemData = {
        name: name,
        category: category,
        price: price,
        status: status,
        emoji: getEmojiForCategory(category)
    };
    
    if (editingItemId) {
        // Update existing item
        const index = menuItems.findIndex(item => item.id === editingItemId);
        if (index !== -1) {
            menuItems[index] = { ...menuItems[index], ...itemData };
        }
    } else {
        // Add new item
        const newId = Math.max(...menuItems.map(item => item.id)) + 1;
        menuItems.push({ id: newId, ...itemData });
    }
    
    closeMenuModal();
    displayMenuItems();
}

function editMenuItem(id) {
    const item = menuItems.find(item => item.id === id);
    if (item) {
        openMenuModal(item);
    }
}

function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        menuItems = menuItems.filter(item => item.id !== id);
        displayMenuItems();
    }
}

function getEmojiForCategory(category) {
    const emojiMap = {
        'Appetizer': '🥗',
        'Main Course': '🍽️',
        'Dessert': '🍰'
    };
    return emojiMap[category] || '🍽️';
}

// Orders Management functionality
function loadOrdersManagement() {
    displayOrders();
}

function displayOrders() {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td class="order-id">#${order.id.toString().padStart(3, '0')}</td>
            <td>${order.table}</td>
            <td>${order.items.join(', ')}</td>
            <td class="order-total">$${order.total.toFixed(2)}</td>
            <td>
                <span class="status-badge status-${order.status.toLowerCase().replace(' ', '-')}">
                    ${order.status}
                </span>
            </td>
            <td>${order.time}</td>
            <td>
                <div class="order-actions">
                    ${order.status === 'Preparing' ? 
                        `<button class="ready-btn" onclick="updateOrderStatus(${order.id}, 'Ready')">
                            <i data-lucide="check"></i>
                            Ready
                        </button>` : ''
                    }
                    ${order.status === 'Ready' ? 
                        `<button class="deliver-btn" onclick="updateOrderStatus(${order.id}, 'Delivered')">
                            <i data-lucide="check"></i>
                            Deliver
                        </button>` : ''
                    }
                    <button class="view-btn" onclick="viewOrder(${order.id})">
                        <i data-lucide="eye"></i>
                        View
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Reinitialize icons
    lucide.createIcons();
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        displayOrders();
        
        // Update dashboard if it's the current page
        if (currentPage === 'dashboard') {
            loadRecentOrders();
        }
    }
}

function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        alert(`Order Details:\n\nOrder ID: #${order.id.toString().padStart(3, '0')}\nTable: ${order.table}\nItems: ${order.items.join(', ')}\nTotal: $${order.total.toFixed(2)}\nStatus: ${order.status}\nTime: ${order.time}`);
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatTime(date) {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Initialize icons when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure Lucide is loaded
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
});