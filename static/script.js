const apiUrl = 'http://127.0.0.1:5000/api';

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

/** --------------------- CRUD for Bikes --------------------- **/

/**
 * Insert new bike data
 */
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

/**
 * Fetch and display all bikes
 */
async function getBikes() {
    const bikes = await apiRequest('bikes', 'GET');
    const list = document.getElementById('bikesList');
    list.innerHTML = `<h3>Bike Inventory</h3>${formatList(bikes, 'id', 'model')}`;
}

/**
 * Update bike data
 */
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

/**
 * Delete a bike
 */
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

/**
 * Insert new customer data
 */
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

/**
 * Fetch and display all customers
 */
async function getCustomers() {
    const customers = await apiRequest('customers', 'GET');
    const list = document.getElementById('customersList');
    list.innerHTML = `<h3>Customer Profiles</h3>${formatList(customers, 'id', 'name', 'contact')}`;
}

/**
 * Update customer data
 */
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

/**
 * Delete a customer
 */
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

/**
 * Utility function to format a list of items into HTML
 * @param {Array} items - List of items to display
 * @param {string[]} keys - Keys for the fields
 * @returns {string} - Formatted HTML string
 */
function formatList(items, ...keys) {
    if (!items || items.length === 0) return '<p>No items available.</p>';
    return items
        .map(item => `<p>${keys.map(key => `<strong>${key}</strong>: ${item[key]}`).join(', ')}</p>`)
        .join('');
}

/**
 * Utility function to clear input fields
 * @param {string[]} fieldIds - Array of input field IDs to clear
 */
function clearInputFields(fieldIds) {
    fieldIds.forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = '';
    });
}

/** --------------------- Event Listeners --------------------- **/

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
