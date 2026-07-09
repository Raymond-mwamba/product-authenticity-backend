const Product = require('../models/Product');
const Verification = require('../models/Verification');

/**
 * Handle USSD Callbacks from Africa's Talking
 * Expects POST request body to contain:
 * - sessionId: String
 * - serviceCode: String
 * - phoneNumber: String
 * - text: String (e.g. "", "1", "1*TB-2024-001", "2")
 */
exports.handleUSSDCallback = async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  let response = '';

  try {
    // text contains the raw inputs separated by *
    // e.g. "" -> main menu
    // "1" -> option 1 (verify)
    // "1*TB-2024-001" -> option 1, then product code input
    // "2" -> option 2 (help)
    const textStr = text ? String(text).trim() : '';
    const parts = textStr === '' ? [] : textStr.split('*').map(p => p.trim());

    if (parts.length === 0) {
      // Main menu: show options
      response = `CON Welcome to Product Verification System\n`;
      response += `1. Verify Product\n`;
      response += `2. Get Help`;
    } else if (parts[0] === '1') {
      if (parts.length === 1) {
        // Option 1 chosen, prompt for code
        response = `CON Enter the Product Unique Code:`;
      } else {
        // Code entered by user (parts[1])
        const uniqueCode = parts[1];

        // Search for product in the database
        const product = await Product.findByUniqueCode(uniqueCode);

        if (product) {
          // Log verification as authentic
          await Verification.create({
            product_id: product.id,
            channel: 'ussd',
            verification_result: 'authentic',
            location: 'USSD Session',
          });

          response = `END ✓ AUTHENTIC\n`;
          response += `Product: ${product.name}\n`;
          response += `Mfr: ${product.manufacturer_name}\n`;
          response += `Contact: ${product.contact_info || 'N/A'}`;
        } else {
          // Log verification as counterfeit
          await Verification.create({
            product_id: null,
            channel: 'ussd',
            verification_result: 'counterfeit',
            location: 'USSD Session',
            scanned_code: uniqueCode
          });

          response = `END ✗ NOT VERIFIED\n`;
          response += `The product code "${uniqueCode}" is not registered.\n`;
          response += `Warning: This product may be counterfeit!`;
        }
      }
    } else if (parts[0] === '2') {
      // Help menu
      response = `END Help Info:\n`;
      response += `Dial the USSD shortcode, select Option 1, and enter the unique code printed on the product's packaging.`;
    } else {
      // Handle invalid main menu selection
      response = `CON Invalid option. Please select:\n`;
      response += `1. Verify Product\n`;
      response += `2. Get Help`;
    }

    // Africa's Talking expects plain text response
    res.set('Content-Type', 'text/plain');
    res.status(200).send(response);
  } catch (error) {
    console.error('USSD Callback Error:', error);
    res.status(200).send('END An error occurred. Please try again.');
  }
};
