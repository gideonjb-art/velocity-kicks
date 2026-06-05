// payment.js - Put this in a separate file

// Initialize Supabase
const supabase = window.supabase.createClient(PROJECT_URL, ANON_KEY);

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