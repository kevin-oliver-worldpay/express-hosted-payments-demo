# Express Checkout Demo

This project demonstrates a simple checkout process using Express.js and the Element Express payment gateway.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed Node.js (version 12.x or later) and npm.
* You have an Element Express account with the necessary credentials.

## Setup

1. Clone this repository to your local machine:

   ```
   git clone https://github.com/yourusername/express-checkout-demo.git
   cd express-checkout-demo
   ```

2. Install the project dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory of the project and add your Element Express credentials:

   ```
   ACCOUNT_ID=your_account_id
   ACCOUNT_TOKEN=your_account_token
   ACCEPTOR_ID=your_acceptor_id
   APPLICATION_ID=your_application_id
   APPLICATION_NAME=your_application_name
   APPLICATION_VERSION=your_application_version
   PORT=3000
   ```

   Replace the `your_*` placeholders with your actual Element Express credentials.

## Running the Application

To start the server, run:

```
npm start
```

The server will start, and you should see a message:

```
Server running at http://localhost:3000
```

## Usage

1. Open a web browser and navigate to `http://localhost:3000`.
2. You should see the home page of the checkout demo.
3. Follow the on-screen instructions to initiate a checkout process.
4. After completing the payment on the Element Express hosted payment page, you will be redirected back to the application where you can see the transaction details.

## API Endpoints

- `POST /api/create-checkout`: Creates a new checkout session
  - Body: `{ "amount": "10.00", "referenceNumber": "123456" }`
  - Returns: `{ "checkoutUrl": "https://..." }`

- `GET /transaction-complete`: Handles the redirect from Element Express after payment completion
  - Query Parameters: Various transaction details provided by Element Express

## Troubleshooting

If you encounter any issues:

1. Make sure all environment variables in the `.env` file are correctly set.
2. Check the console output for any error messages.
3. Ensure you're using a supported version of Node.js.

## Contributing

Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Express.js
- Element Express Payment Gateway

For more information about the Element Express API, please refer to their official documentation.