import Stripe from "stripe";
import { ENV } from "@/config/env";

/**
 * ============================================================================
 * STRIPE SDK CLIENT CONFIGURATION
 * ============================================================================
 * 
 * In development / test mode:
 * 1. You use secret keys starting with `sk_test_...`
 * 2. You can simulate real card payments using Stripe test card numbers:
 *    - Card Number: 4242 4242 4242 4242
 *    - Expiry Date: Any valid future date (e.g., 12/28)
 *    - CVC: Any 3-digit number (e.g., 123)
 *    - Postal Code: Any 5-digit zip code (e.g., 10001)
 * 3. Never expose your secret key (`sk_test_...` or `sk_live_...`) to frontend!
 *    The secret key is only used here on the backend server.
 */

// If no key is set yet, we fall back to a dummy key so the server doesn't crash on boot.
const stripeSecretKey = ENV.STRIPE_SECRET_KEY || "sk_test_placeholder";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20", // Pin to standard API version
  typescript: true,
});

