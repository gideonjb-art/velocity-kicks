// payment.js - Put this in a separate file

// Initialize Supabase
const supabase = window.supabase.createClient(https://wylhbyrpmotecjdtjrae.supabase.co,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bGhieXJwbW90ZWNqZHRqcmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTIyNzIsImV4cCI6MjA5MzQ4ODI3Mn0.HAy0JxHy913xB6DwApP72SmWG_8hR_Kj9nAqAJXEWfU);

// Store active subscriptions
let activeSubscription = null;

export async function initiatePayment(phone, amount) {
    // Format phone
    let formattedPhone = phone.replace(/\s/g, '');
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
    }
    
    try {
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
            return { success: true, checkoutRequestID: data.checkoutRequestID };
        } else {
            return { success: false, error: data.message };
        }
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function listenForPaymentStatus(checkoutRequestID) {
    // Clean up previous subscription if exists
    if (activeSubscription) {
        activeSubscription.unsubscribe();
    }
    
    // Create new subscription
    activeSubscription = supabase
        .channel('payment-updates')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'payments',
                filter: `checkout_request_id=eq.${checkoutRequestID}`
            },
            (payload) => {
                if (payload.new.status === 'paid') {
                    console.log('✅ Payment successful!', payload.new.mpesa_receipt);
                    onPaymentSuccess(payload.new);
                    cleanup();
                } else if (payload.new.status === 'failed') {
                    console.log('❌ Payment failed');
                    onPaymentFailure(payload.new);
                    cleanup();
                }
            }
        )
        .subscribe();
        
    function cleanup() {
        if (activeSubscription) {
            activeSubscription.unsubscribe();
            activeSubscription = null;
        }
    }
}

function onPaymentSuccess(paymentData) {
    // Update your UI here
    document.getElementById('paymentStatus').innerHTML = 
        `✅ Payment successful! Receipt: ${paymentData.mpesa_receipt}`;
    // You can also redirect
    // window.location.href = `/success?receipt=${paymentData.mpesa_receipt}`;
}

function onPaymentFailure(paymentData) {
    document.getElementById('paymentStatus').innerHTML = 
        `❌ Payment failed. Please try again.`;
}