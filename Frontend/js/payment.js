// ==========================================
// SSV HOTEL PAYMENT PAGE
// ==========================================

const orderData = localStorage.getItem("currentOrder");

if (!orderData) {
    alert("No order found.");
    window.location.href = "order.html";
}

const order = JSON.parse(orderData);

// Show Order Details
document.getElementById("payName").textContent = order.customerName;
document.getElementById("payMobile").textContent = order.mobile;
document.getElementById("payItem").textContent = order.itemName;
document.getElementById("payQuantity").textContent = order.quantity;
document.getElementById("payTotal").textContent = "₹" + order.total;
document.getElementById("payAdvance").textContent = "₹" + order.advance;

// Payment Button
const payBtn = document.getElementById("payNowBtn");

payBtn.addEventListener("click", function () {

    payBtn.disabled = true;
    payBtn.innerHTML = "Processing Payment...";

    setTimeout(function () {

        order.paymentStatus = "Paid";
        order.orderStatus = "Preparing";
        order.paymentTime = new Date().toLocaleString();
        order.orderID = localStorage.getItem("orderID");

        fetch("http://127.0.0.1:5000/api/payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                order_id: order.orderID,
                paid_amount: order.advance,
                payment_method: document.querySelector(
                    'input[name="paymentMethod"]:checked'
                ).value
            })
        })

        .then(res => res.json())

        .then(data => {

            console.log(data);

            localStorage.setItem(
                "currentOrder",
                JSON.stringify(order)
            );

            if (typeof showToast === "function") {
                showToast("✅ Payment Successful");
            }

            setTimeout(() => {
                window.location.href = "receipt.html";
            }, 800);

        })

        .catch(err => {

            console.error(err);

            alert("Payment update failed.");

            payBtn.disabled = false;
            payBtn.innerHTML = "💳 Pay Advance Now";

        });

    }, 2000);

});