const axios = require('axios');

class USSDService {
  constructor() {
    this.apiKey = process.env.USSD_API_KEY;
    this.username = process.env.USSD_USERNAME;
    this.shortCode = process.env.USSD_SHORT_CODE;
    this.apiUrl = 'https://api.sandbox.africastalking.com/ussd/send';
  }

  /**
   * Send USSD response to user
   * @param {string} phoneNumber - User's phone number
   * @param {string} message - Response message
   * @param {boolean} continueSession - Whether to keep session active
   */
  async sendUSSDResponse(phoneNumber, message, continueSession = false) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          username: this.username,
          shortCode: this.shortCode,
          phoneNumber,
          message,
          continueSession,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('USSD Send Error:', error);
      throw error;
    }
  }

  /**
   * Parse USSD input text into structured command
   * @param {string} text - Raw USSD input
   * @returns {Object}
   */
  parseUSSDInput(text) {
    const parts = text.trim().split('*').map((p) => p.trim());

    if (parts.length === 0) {
      return { action: 'menu' };
    }

    const firstInput = parts[0];

    if (firstInput === '1') {
      return { action: 'verify', code: parts[1] || null };
    } else if (firstInput === '2') {
      return { action: 'history' };
    } else if (firstInput === '3') {
      return { action: 'help' };
    }

    return { action: 'menu' };
  }

  /**
   * Format verification result for USSD display
   * @param {Object} result - Verification result
   * @returns {string}
   */
  formatVerificationMessage(result) {
    if (result.verification_result === 'authentic') {
      return `✓ AUTHENTIC\n${result.product.name}\nManufacturer: ${result.product.manufacturer_name}`;
    } else {
      return `✗ NOT VERIFIED\nProduct code may be counterfeit.\nContact authorities if unsure.`;
    }
  }
}

module.exports = new USSDService();
