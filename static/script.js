const apiUrl = 'http://localhost:5000/api';

// Helper function to send POST requests
async function postData(endpoint, data) {
    try {
        const response = await fetch(`${apiUrl}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Failed to add data to ${endpoint}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}

// Helper function to send GET requests
async function getData(endpoint) {
    try {
        const response = await fetch(`${apiUrl}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${endpoint}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}

// Bike Inventory Functions
async function addBike() {
    const bikeId = document.getElementById('bikeId').value;
    const bikeModel = document.getElementById('bikeModel').value;
    const bikeData = { id: bikeId, model: bikeModel };

    // Log data before sending the request
    console.log('Bike Data:', bikeData);

    const data = await postData('bikes', bikeData);
    if (data) {
        document.getElementById('bikeId').value = '';
        document.getElementById('bikeModel').value = '';
        getBikes(); // Refresh bike list
    }
}

async function getBikes() {
    const bikes = await getData('bikes');
    if (bikes) {
        const list = document.getElementById('bikesList');
        list.innerHTML = '<h3>Bike Inventory</h3>' + bikes.map(bike => `<p>ID: ${bike.id}, Model: ${bike.model}</p>`).join('');
    }
}


// Customer Profile Functions
async function addCustomer() {
    const customerId = document.getElementById('customerId').value;
    const customerName = document.getElementById('customerName').value;
    const customerContact = document.getElementById('customerContact').value;
    const customerData = { id: customerId, name: customerName, contact: customerContact };

    const data = await postData('customers', customerData);
    if (data) {
        document.getElementById('customerId').value = '';
        document.getElementById('customerName').value = '';
        document.getElementById('customerContact').value = '';
        getCustomers(); // Refresh customer list
    }
}


async function getCustomers() {
    const customers = await getData('customers');
    if (customers) {
        const list = document.getElementById('customersList');
        list.innerHTML = '<h3>Customer Profiles</h3>' + customers.map(customer => `<p>ID: ${customer.id}, Name: ${customer.name}, Contact: ${customer.contact}</p>`).join('');
    }
}


