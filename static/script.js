const apiUrl = 'http://127.0.0.1:5000/api';
// Base URL without "/api"

/**
 * Helper function to send API requests
 * @param {string} endpoint - API endpoint to call
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {object} [data] - Data to send with the request (optional)
 * @returns {Promise<object|null>} - Parsed JSON response or null on failure
 */
async function apiRequest(endpoint, method, data = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (data) options.body = JSON.stringify(data);

        const response = await fetch(`${apiUrl}/${endpoint}`, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        alert(`Error: ${error.message}`);
        return null;
    }
}

/** --------------------- Authentication --------------------- **/

/**
 * Handle user registration
 */
async function register() {
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!username || !password) {
        alert('Please provide both username and password');
        return;
    }

    const data = await apiRequest('register', 'POST', { username, password });
    const message = document.getElementById('registerMessage');
    if (data && data.message) {
        message.textContent = data.message;
        message.style.color = 'green';
        toggleVisibility('registerSection', 'loginSection');
    } else {
        message.textContent = data.error;
        message.style.color = 'red';
    }
}

/**
 * Handle user login
 */
async function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) {
        alert('Please provide both username and password');
        return;
    }

    const data = await apiRequest('login', 'POST', { username, password });
    const message = document.getElementById('loginMessage');
    if (data && data.message) {
        message.textContent = data.message;
        message.style.color = 'green';
        toggleVisibility('loginSection', ['bikeInventorySection', 'customerManagementSection']);
    } else {
        message.textContent = data.error;
        message.style.color = 'red';
    }
}


/** --------------------- CRUD for Bikes --------------------- **/

async function insertBikeData() {
    const bikeId = document.getElementById('bikeId').value.trim();
    const bikeModel = document.getElementById('bikeModel').value.trim();

    if (!bikeId || !bikeModel) {
        alert('Please enter both Bike ID and Model');
        return;
    }

    const bikeData = { id: bikeId, model: bikeModel };
    const data = await apiRequest('bikes', 'POST', bikeData);

    if (data) {
        alert(`Bike added successfully: ${data.bike.model}`);
        clearInputFields(['bikeId', 'bikeModel']);
        await getBikes(); // Refresh the list after successful addition
    }
}

async function getBikes() {
    const bikes = await apiRequest('bikes', 'GET');
    const list = document.getElementById('bikesList');
    list.innerHTML = `<h3>Bike Inventory</h3>${formatList(bikes, 'id', 'model')}`;
}

async function updateBikeData() {
    const bikeId = document.getElementById('bikeId').value.trim();
    const bikeModel = document.getElementById('bikeModel').value.trim();

    if (!bikeId || !bikeModel) {
        alert('Please enter both Bike ID and new Model');
        return;
    }

    const bikeData = { model: bikeModel };
    const data = await apiRequest(`bikes/${bikeId}`, 'PUT', bikeData);

    if (data) {
        alert(`Bike updated successfully: ${data.model}`);
        clearInputFields(['bikeId', 'bikeModel']);
        await getBikes(); // Refresh the list after successful update
    }
}

async function deleteBike() {
    const bikeId = document.getElementById('bikeId').value.trim();

    if (!bikeId) {
        alert('Please enter a Bike ID to delete');
        return;
    }

    const data = await apiRequest(`bikes/${bikeId}`, 'DELETE');

    if (data) {
        alert(`Bike deleted successfully`);
        clearInputFields(['bikeId']);
        await getBikes(); // Refresh the list after successful deletion
    }
}

/** --------------------- CRUD for Customers --------------------- **/

async function insertCustomerData() {
    const customerId = document.getElementById('customerId').value.trim();
    const customerName = document.getElementById('customerName').value.trim();
    const customerContact = document.getElementById('customerContact').value.trim();

    if (!customerId || !customerName || !customerContact) {
        alert('Please enter Customer ID, Name, and Contact');
        return;
    }

    const customerData = { id: customerId, name: customerName, contact: customerContact };
    const data = await apiRequest('customers', 'POST', customerData);

    if (data) {
        alert(`Customer added successfully: ${data.customer.name}`);
        clearInputFields(['customerId', 'customerName', 'customerContact']);
        await getCustomers(); // Refresh the list after successful addition
    }
}

async function getCustomers() {
    const customers = await apiRequest('customers', 'GET');
    const list = document.getElementById('customersList');
    list.innerHTML = `<h3>Customer Profiles</h3>${formatList(customers, 'id', 'name', 'contact')}`;
}

async function updateCustomerData() {
    const customerId = document.getElementById('customerId').value.trim();
    const customerName = document.getElementById('customerName').value.trim();
    const customerContact = document.getElementById('customerContact').value.trim();

    if (!customerId || !customerName || !customerContact) {
        alert('Please enter Customer ID, new Name, and new Contact');
        return;
    }

    const customerData = { name: customerName, contact: customerContact };
    const data = await apiRequest(`customers/${customerId}`, 'PUT', customerData);

    if (data) {
        alert(`Customer updated successfully: ${data.name}`);
        clearInputFields(['customerId', 'customerName', 'customerContact']);
        await getCustomers(); // Refresh the list after successful update
    }
}

async function deleteCustomer() {
    const customerId = document.getElementById('customerId').value.trim();

    if (!customerId) {
        alert('Please enter a Customer ID to delete');
        return;
    }

    const data = await apiRequest(`customers/${customerId}`, 'DELETE');

    if (data) {
        alert(`Customer deleted successfully`);
        clearInputFields(['customerId']);
        await getCustomers(); // Refresh the list after successful deletion
    }
}

/** --------------------- Utility Functions --------------------- **/

function formatList(items, ...keys) {
    if (!items || items.length === 0) return '<p>No items available.</p>';
    return items
        .map(item => `<p>${keys.map(key => `<strong>${key}</strong>: ${item[key]}`).join(', ')}</p>`)
        .join('');
}

function clearInputFields(fieldIds) {
    fieldIds.forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = '';
    });
}

/**
 * Toggle visibility of sections
 * @param {string} hideId - ID of the section to hide
 * @param {string|string[]} showIds - ID(s) of the section(s) to show
 */
function toggleVisibility(hideId, showIds) {
    document.getElementById(hideId).style.display = 'none';
    if (Array.isArray(showIds)) {
        showIds.forEach(id => (document.getElementById(id).style.display = 'block'));
    } else {
        document.getElementById(showIds).style.display = 'block';
    }
}

/** --------------------- Event Listeners --------------------- **/

// Authentication Event Listeners
document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('registerBtn').addEventListener('click', register);

// Bike Event Listeners
document.getElementById('addBikeBtn').addEventListener('click', insertBikeData);
document.getElementById('showBikesBtn').addEventListener('click', getBikes);
document.getElementById('updateBikeBtn').addEventListener('click', updateBikeData);
document.getElementById('deleteBikeBtn').addEventListener('click', deleteBike);

// Customer Event Listeners
document.getElementById('addCustomerBtn').addEventListener('click', insertCustomerData);
document.getElementById('showCustomersBtn').addEventListener('click', getCustomers);
document.getElementById('updateCustomerBtn').addEventListener('click', updateCustomerData);
document.getElementById('deleteCustomerBtn').addEventListener('click', deleteCustomer);
