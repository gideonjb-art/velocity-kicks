// payment.js - Complete payment logic
// This file handles ALL M-Pesa functionality

const PROJECT_URL = "https://wylhbyrpmotecjdtjrae.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bGhieXJwbW90ZWNqZHRqcmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTIyNzIsImV4cCI6MjA5MzQ4ODI3Mn0.HAy0JxHy913xB6DwApP72SmWG_8hR_Kj9nAqAJXEWfU"; // Get from Settings → API

// Initialize Supabase
const supabase = window.supabase.createClient(PROJECT_URL, ANON_KEY);

let activeSubscription = null;

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

// Main function to initiate payment
async function initiatePayment(phone, amount) {
    try {
        const formattedPhone = formatPhoneNumber(phone);
        
        const response = await fetch(`${PROJECT_URL}/functions/v1/mpesa-stk-push`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ANON_KEY}`
            },
            body: JSON.stringify({
                phone: formattedPhone,
                amount: parseInt(amount)
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
    if (activeSubscription) {
        activeSubscription.unsubscribe();
    }
    
    activeSubscription = supabase
        .channel('payment-updates')
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'payments',
            filter: `checkout_request_id=eq.${checkoutRequestID}`
        }, (payload) => {
            if (payload.new.status === 'paid') {
                // Trigger custom event that your main script can listen to
                window.dispatchEvent(new CustomEvent('paymentSuccess', {
                    detail: payload.new
                }));
                cleanup();
            } else if (payload.new.status === 'failed') {
                window.dispatchEvent(new CustomEvent('paymentFailed', {
                    detail: payload.new
                }));
                cleanup();
            }
        })
        .subscribe();
    
    function cleanup() {
        if (activeSubscription) {
            activeSubscription.unsubscribe();
            activeSubscription = null;
        }
    }
    
    // Auto cleanup after 60 seconds
    setTimeout(() => {
        if (activeSubscription) {
            activeSubscription.unsubscribe();
            activeSubscription = null;
        }
    }, 60000);
}

// Make functions available globally
window.initiatePayment = initiatePayment;
window.formatPhoneNumber = formatPhoneNumber;