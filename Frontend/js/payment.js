// ==========================================
// SSV HOTEL PAYMENT PAGE
// ==========================================

// Load Order
const order = JSON.parse(localStorage.getItem("currentOrder"));

// If no order exists, go back to Order page
if (!order) {

    alert("No order found.");

    window.location.href = "order.html";

}

// ================================
// Show Order Details
// ================================

document.getElementById("payName").textContent =
    order.customerName;

document.getElementById("payMobile").textContent =
    order.mobile;

document.getElementById("payQuantity").textContent =
    order.quantity + " Rotis";

document.getElementById("payTotal").textContent =
    "₹" + order.total;

document.getElementById("payAdvance").textContent =
    "₹" + order.advance;

// ================================
// Payment Button
// ================================

const payBtn = document.getElementById("payNowBtn");

payBtn.addEventListener("click", function () {

    // Disable button
    payBtn.disabled = true;

    payBtn.innerHTML = "Processing Payment...";

    // Fake payment loading (2 seconds)
    setTimeout(function () {

        // Update payment details
        order.paymentStatus = "Paid";
        order.orderStatus = "Preparing";
        order.paymentTime = new Date().toLocaleString();

        order.orderID = localStorage.getItem("orderID");
        
        // Save updated order
        localStorage.setItem(
            "currentOrder",
            JSON.stringify(order)
        );

        // Success Notification
        if (typeof showToast === "function") {
            showToast("✅ Payment Successful");
        }

        // Go to Receipt Page
        window.location.href = "receipt.html";

    }, 2000);

});