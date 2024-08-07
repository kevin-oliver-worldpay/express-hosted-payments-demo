require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { XMLBuilder, XMLParser } = require('fast-xml-parser');
const https = require('https');
const xmlFormatter = require('xml-formatter');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Constants
const API_URL = 'https://certtransaction.elementexpress.com/';
const HOSTED_PAYMENT_URL = 'https://certtransaction.hostedpayments.com/';

// XML Builder and Parser configuration
const xmlBuilder = new XMLBuilder({ attributeNamePrefix: "@_", ignoreAttributes: false });
const xmlParser = new XMLParser({ ignoreAttributes: false, parseAttributeValue: true, trimValues: true });

// Helper Functions
function formatXml(xml) {
  return xmlFormatter(xml, {
    indentation: '  ',
    collapseContent: true,
    lineSeparator: '\n'
  });
}

function buildTransactionSetupXml(amount, referenceNumber) {
  return xmlBuilder.build({
    TransactionSetup: {
      "@_xmlns": "https://transaction.elementexpress.com",
      Credentials: {
        AccountID: process.env.ACCOUNT_ID,
        AccountToken: process.env.ACCOUNT_TOKEN,
        AcceptorID: process.env.ACCEPTOR_ID
      },
      Application: {
        ApplicationID: process.env.APPLICATION_ID,
        ApplicationName: process.env.APPLICATION_NAME,
        ApplicationVersion: process.env.APPLICATION_VERSION
      },
      TransactionSetup: {
        TransactionSetupID: "",
        TransactionSetupMethod: "1",
        DeviceInputCode: "0",
        Device: "0",
        Embedded: "1",
        CVVRequired: "0",
        CompanyName: "",
        LogoURL: "",
        Tagline: "",
        AutoReturn: "1",
        WelcomeMessage: "",
        ReturnURL: "http://localhost:3000/transaction-complete",
        ReturnURLTitle: "",
        OrderDetails: ""
      },
      PaymentAccount: {
        PaymentAccountID: "",
        PaymentAccountReferenceNumber: "123",
        PaymentAccountType: "0"
      },
      Address: {
        BillingAddress1: "123 Main",
        BillingZipcode: "85044"
      },
      Transaction: {
        ApprovalNumber: "",
        TransactionAmount: amount,
        MarketCode: "0",
        ReferenceNumber: referenceNumber,
        DuplicateCheckDisableFlag: "1"
      },
      Terminal: {
        TerminalID: "01",
        CVVPresenceCode: "0",
        CardPresentCode: "0",
        CardholderPresentCode: "0",
        CardInputCode: "0",
        TerminalCapabilityCode: "0",
        TerminalEnvironmentCode: "0",
        MotoECICode: "0"
      }
    }
  });
}

// Main Functions
async function createCheckoutSession(amount, referenceNumber) {
  const xmlData = buildTransactionSetupXml(amount, referenceNumber);
  console.log('\nXML Request:', formatXml(xmlData));

  try {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.post(API_URL, xmlData, {
      headers: { 'Content-Type': 'text/xml', 'Accept': 'text/xml' },
      httpsAgent: agent
    });

    console.log('\nXML Response:', formatXml(response.data));
    console.log('\nResponse headers:', response.headers);

    const result = xmlParser.parse(response.data);
    const expressResponseCode = result.TransactionSetupResponse.Response.ExpressResponseCode;
    console.log('ExpressResponseCode:', expressResponseCode, 'Type:', typeof expressResponseCode);

    if (expressResponseCode === 0) {
      const transactionSetupId = result.TransactionSetupResponse.Response.Transaction.TransactionSetupID;
      return `${HOSTED_PAYMENT_URL}?TransactionSetupID=${transactionSetupId}`;
    } else {
      throw new Error(`API Error: ${result.TransactionSetupResponse.Response.ExpressResponseMessage}`);
    }
  } catch (error) {
    console.error('Error setting up transaction:', error);
    throw error;
  }
}

// Route Handlers
app.post('/api/create-checkout', async (req, res) => {
  try {
    const { amount, referenceNumber } = req.body;
    const checkoutUrl = await createCheckoutSession(amount, referenceNumber);
    res.json({ checkoutUrl });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/transaction-complete', (req, res) => {
  const {
    HostedPaymentStatus,
    TransactionID,
    ExpressResponseCode,
    ExpressResponseMessage,
    ApprovalNumber,
    LastFour,
    CardLogo,
    ApprovedAmount,
    BillingAddress1,
    BillingZipcode,
    TranDT
  } = req.query;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Transaction Complete</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1 { color: #333; }
            .transaction-details { background: #f4f4f4; padding: 20px; border-radius: 5px; }
            .transaction-details p { margin: 10px 0; }
            .success { color: green; }
            .error { color: red; }
        </style>
    </head>
    <body>
        <h1>Transaction Complete</h1>
        <div class="transaction-details">
            <p><strong>Status:</strong> <span class="${ExpressResponseCode === '0' ? 'success' : 'error'}">${HostedPaymentStatus}</span></p>
            <p><strong>Transaction ID:</strong> ${TransactionID}</p>
            <p><strong>Response Code:</strong> ${ExpressResponseCode}</p>
            <p><strong>Response Message:</strong> ${ExpressResponseMessage}</p>
            <p><strong>Approval Number:</strong> ${ApprovalNumber}</p>
            <p><strong>Card:</strong> ${CardLogo} (Last Four: ${LastFour})</p>
            <p><strong>Amount:</strong> $${ApprovedAmount}</p>
            <p><strong>Billing Address:</strong> ${BillingAddress1}, ${BillingZipcode}</p>
            <p><strong>Transaction Date:</strong> ${TranDT}</p>
        </div>
        <p><a href="/">Return to Home</a></p>
    </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});