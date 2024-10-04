# eCommerce Store API

This is an eCommerce API built with **NestJS** that allows users to add items to their cart, apply discount codes, and checkout. It also includes admin functionalities for generating discount codes and listing all purchases made by users.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Assumptions](#assumptions)

## Features

### User APIs:

1. **Add to Cart**: Add products to a user's cart.
2. **Checkout**: Validate the cart and apply a discount code if available.

### Admin APIs:

1. **Generate Discount Code**: Create a discount code for every nth order.
2. **List Purchases**: Get the count of items purchased, total purchase amount, discount codes, and total discount applied.

## Technologies Used

- **NestJS**: Backend framework
- **TypeScript**: Language used
- **In-memory storage**: For simplicity, no database is used. All data is stored in-memory.
- **Jest**: Unit testing framework

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rinku122/ecommerce-store.git
   ```

2. Change directory to the project folder:

   ```bash
   cd ecommerce-store
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Running the Application

1. Start the NestJS server:

   ```bash
   npm run start
   ```

2. The API will be running at `http://localhost:3000`.
