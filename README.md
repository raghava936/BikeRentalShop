# BikeRentalShopAPI

# Bike Rental Shop API

This is a simple Bike Rental Shop API built with Flask and SQLite. It allows you to manage bike and customer data for a bike rental service. The API provides endpoints to add and retrieve bikes and customers from a database.

## Features

- **Bike Management**:
  - Add bikes with a unique `id` and `model`.
  - Retrieve a list of all bikes.
  
- **Customer Management**:
  - Add customers with `id`, `name`, and `contact` details.
  - Retrieve a list of all customers.

- **Frontend**: 
  - The app includes a simple HTML interface to interact with the backend.

## Technology Stack

- **Flask**: A lightweight Python web framework.
- **SQLite**: A serverless, self-contained SQL database engine.
- **CORS**: Enabled for cross-origin requests (if the frontend is hosted on a different domain/port).
- **Python 3.x**

## Setup Instructions

### Prerequisites

Make sure you have the following installed:
- Python 3.x
- `pip` for installing Python packages

### 1. Clone the repository

```bash
git clone https://github.com/your-username/BikeRentalShopAPI.git
cd BikeRentalShopAPI
