// payment.js - M-Pesa Integration
console.log("payment.js loading...");

const SUPABASE_URL = "https://wylhbyrpmotecjdtjrae.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bGhieXJwbW90ZWNqZHRqcmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTIyNzIsImV4cCI6MjA5MzQ4ODI3Mn0.HAy0JxHy913xB6DwApP72SmWG_8hR_Kj9nAqAJXEWfU";

// Main payment function
window.initiateMpesaPayment = async function(phone, amount, orderDetails) {
    console.log("initiateMpesaPayment called with:", phone, amount);
    
    try {
        // Format phone number
        let formattedPhone = phone.toString().replace(/\s/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '254' + formattedPhone.substring(1);
        } else if (!formattedPhone.startsWith('254')) {
            formattedPhone = '254' + formattedPhone;
        }
        
        console.log("Formatted phone:", formattedPhone);
        console.log("Amount:", amount);
        
        // Call your Supabase Edge Function
        const response = await fetch(`${SUPABASE_URL}/functions/v1/mpesa-stk-push`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                phone: formattedPhone,
                amount: parseInt(amount),
                order_details: orderDetails
            })
        });
        
        const data = await response.json();
        console.log("STK Push Response:", data);
        
        if (data.success || data.checkoutRequestID) {
            return { 
                success: true, 
                checkoutRequestID: data.checkoutRequestID,
                message: data.message || "STK Push sent successfully"
            };
        } else {
            return { 
                success: false, 
                error: data.message || data.error || "Payment request failed" 
            };
        }
    } catch (error) {
        console.error("Payment initiation error:", error);
        return { 
            success: false, 
            error: error.message || "Network error. Please try again." 
        };
    }
};

console.log("payment.js loaded successfully. initiateMpesaPayment available:", typeof window.initiateMpesaPayment);
