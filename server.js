require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { XMLBuilder, XMLParser } = require('fast-xml-parser');
const https = require('https');
const xmlFormatter = require('xml-formatter');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

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

function buildTransactionSetupXml(amount, referenceNumber, method) {
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
        Embedded: method === 'redirect' ? "0" : "1",
        AutoReturn: "1",
        ReturnURL: method === 'redirect' 
        ? `${BASE_URL}/transaction-complete.html` 
        : `${BASE_URL}/transition.html`,
        ReturnURLTitle: "Return to Merchant",
        OrderDetails: "",
        ProcessTransactionTitle: "Complete Your Payment",
        EnableCaptcha: "0",
        HPType: "0"
      },
      PaymentAccount: {
        PaymentAccountID: "",
        PaymentAccountReferenceNumber: referenceNumber,
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

async function createCheckoutSession(amount, referenceNumber, method) {
  const xmlData = buildTransactionSetupXml(amount, referenceNumber, method);
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
    console.log('\nParsed Response:', JSON.stringify(result, null, 2));

    if (!result || !result.TransactionSetupResponse) {
      throw new Error('Invalid response format from API');
    }

    const expressResponseCode = result.TransactionSetupResponse.Response?.ExpressResponseCode;
    console.log('ExpressResponseCode:', expressResponseCode, 'Type:', typeof expressResponseCode);

    if (expressResponseCode === 0) {
      const transactionSetupId = result.TransactionSetupResponse.Response?.Transaction?.TransactionSetupID;
      if (!transactionSetupId) {
        throw new Error('TransactionSetupID not found in the response');
      }
      return `${HOSTED_PAYMENT_URL}?TransactionSetupID=${transactionSetupId}`;
    } else {
      const errorMessage = result.TransactionSetupResponse.Response?.ExpressResponseMessage || 'Unknown API Error';
      throw new Error(`API Error: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error setting up transaction:', error);
    if (error.response) {
      console.error('API Response:', error.response.data);
      console.error('API Status:', error.response.status);
      console.error('API Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error details:', error.message);
    }
    throw new Error('Failed to set up transaction. Check server logs for details.');
  }
}

// Main Functions
async function createCheckoutSession(amount, referenceNumber, method) {
  const xmlData = buildTransactionSetupXml(amount, referenceNumber, method);
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
    const { amount, referenceNumber, method } = req.body;
    const checkoutUrl = await createCheckoutSession(amount, referenceNumber, method);
    res.json({ checkoutUrl });
  } catch (error) {
    console.error('Error in /api/create-checkout:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session', 
      details: error.message,
      // Only include stack trace in development environment
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});