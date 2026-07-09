const Product = require('../models/Product');
const Verification = require('../models/Verification');

class VerificationService {
  /**
   * Verify a product authenticity
   * @param {string} uniqueCode - Product unique code
   * @param {string} channel - Channel of verification (app/ussd)
   * @param {string} location - Location of verification
   * @returns {Promise}
   */
  static async verifyProduct(uniqueCode, channel = 'app', location = '') {
    // Find product by unique code
    const product = await Product.findByUniqueCode(uniqueCode);

    if (!product) {
      // Record counterfeit verification BEFORE throwing
      await Verification.create({
        product_id: null,
        channel,
        verification_result: 'counterfeit',
        location,
        scanned_code: uniqueCode
      });

      throw {
        status: 404,
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND',
      };
    }

    // Determine if product is authentic
    // In a real system, you might check against a manufacturing database
    // For now, we'll use the presence in our database as authentic
    const isAuthentic = true;
    const verificationResult = isAuthentic ? 'authentic' : 'counterfeit';

    // Record verification
    const verificationId = await Verification.create({
      product_id: product.id,
      channel,
      verification_result: verificationResult,
      location,
    });

    // Return verification result
    return {
      id: verificationId,
      product,
      verification_result: verificationResult,
      channel,
      verification_time: new Date().toISOString(),
      location,
      message: isAuthentic
        ? 'Product is authentic'
        : 'Product could not be verified as authentic',
    };
  }

  /**
   * Get verification statistics
   * @returns {Promise}
   */
  static async getStatistics() {
    const stats = await Verification.getStatistics();
    return {
      ...stats,
      authentic_percentage: stats.total_verifications > 0
        ? ((stats.authentic_count / stats.total_verifications) * 100).toFixed(2)
        : 0,
    };
  }
}

module.exports = VerificationService;
