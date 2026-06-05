// payment.js - M-Pesa Payment Integration

const SUPABASE_URL = "https://wylhbyrpmotecjdtjrae.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bGhieXJwbW90ZWNqZHRqcmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTIyNzIsImV4cCI6MjA5MzQ4ODI3Mn0.HAy0JxHy913xB6DwApP72SmWG_8hR_Kj9nAqAJXEWfU";

let activePaymentSubscription = null;

// Format phone number to international format
function formatPhoneNumber(phone) {
    let formatted = phone.toString().replace(/\s/g, '');
    if (formatted.startsWith('0')) {
        formatted = '254' + formatted.substring(1);
    } else if (formatted.startsWith('+')) {
        formatted = formatted.substring(1);
    } else if (!formatted.startsWith('254')) {
        formatted = '254' + formatted;
    }
    return formatted;
}

// Validate Kenyan phone number
function validatePhoneNumber(phone) {
    const formatted = formatPhoneNumber(phone);
    const phoneRegex = /^254[17]\d{8}$/;
    return phoneRegex.test(formatted);
}

// Main function to initiate M-Pesa payment
async function initiateMpesaPayment(phone, amount, orderDetails) {
    try {
        const formattedPhone = formatPhoneNumber(phone);
        
        if (!validatePhoneNumber(formattedPhone)) {
            return { 
                success: false, 
                error: "Please enter a valid Kenyan phone number (e.g., 0712345678)" 
            };
        }
        
        if (amount < 1) {
            return { 
                success: false, 
                error: "Amount must be at least KES 1" 
            };
        }
        
        const response = await fetch(`${SUPABASE_URL}/functions/v1/mpesa-stk-push`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                phone: formattedPhone,
                amount: parseInt(amount),
                order_details: orderDetails // Optional: store order info
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Start listening for payment status
            listenForPaymentStatus(data.checkoutRequestID);
            return { 
                success: true, 
                checkoutRequestID: data.checkoutRequestID,
                message: data.message 
            };
        } else {
            return { 
                success: false, 
                error: data.message || "Payment request failed" 
            };
        }
    } catch (error) {
        console.error("Payment error:", error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

// Listen for payment status changes
function listenForPaymentStatus(checkoutRequestID) {
    if (activePaymentSubscription) {
        activePaymentSubscription.unsubscribe();
    }
    
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    activePaymentSubscription = supabaseClient
        .channel('payment-updates')
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'payments',
            filter: `checkout_request_id=eq.${checkoutRequestID}`
        }, (payload) => {
            if (payload.new.status === 'paid') {
                // Payment successful
                window.dispatchEvent(new CustomEvent('paymentSuccess', {
                    detail: payload.new
                }));
                cleanup();
            } else if (payload.new.status === 'failed') {
                // Payment failed
                window.dispatchEvent(new CustomEvent('paymentFailed', {
                    detail: payload.new
                }));
                cleanup();
            }
        })
        .subscribe();
    
    function cleanup() {
        if (activePaymentSubscription) {
            activePaymentSubscription.unsubscribe();
            activePaymentSubscription = null;
        }
    }
    
    // Auto cleanup after 120 seconds
    setTimeout(() => {
        if (activePaymentSubscription) {
            activePaymentSubscription.unsubscribe();
            activePaymentSubscription = null;
        }
    }, 120000);
}

// Make functions available globally
window.initiateMpesaPayment = initiateMpesaPayment;
window.formatPhoneNumber = formatPhoneNumber;
window.validatePhoneNumber = validatePhoneNumber;
