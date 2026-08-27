// ==========================================
// SSV HOTEL - PAYMENT PAGE
// ==========================================

const orderData =
    localStorage.getItem("currentOrder");

if (!orderData) {

    alert("No order found.");

    window.location.href =
        "order.html";

}

const order =
    JSON.parse(orderData);

// ==========================================
// SHOW ORDER
// ==========================================

document.getElementById(
    "payName"
).textContent =
    order.customerName || "-";

document.getElementById(
    "payMobile"
).textContent =
    order.mobile || "-";

document.getElementById(
    "payItem"
).textContent =
    order.itemName || "-";

document.getElementById(
    "payQuantity"
).textContent =
    order.quantity || 0;

document.getElementById(
    "payTotal"
).textContent =
    "₹" + (order.total || 0);

document.getElementById(
    "payAdvance"
).textContent =
    "₹" + (order.advance || 0);

// ==========================================
// PAYMENT
// ==========================================

const payBtn =
    document.getElementById("payNowBtn");

payBtn.addEventListener(
    "click",
    function() {

        const paymentMethod =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );

        if (!paymentMethod) {

            alert(
                "Please select a payment method."
            );

            return;

        }

        payBtn.disabled = true;

        payBtn.innerHTML =
            "Processing Payment...";

        setTimeout(function() {

            fetch(`${API_BASE}/api/payment`, {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    order_id:
                        order.orderID ||
                        localStorage.getItem("orderID"),

                    paid_amount:
                        order.advance,

                    payment_method:
                        paymentMethod.value

                })

            })

            .then(res => res.json())

            .then(data => {

                console.log(data);

                if (data.success) {

                    order.paymentStatus =
                        "Paid";

                    order.orderStatus =
                        "Preparing";

                    order.paymentTime =
                        new Date()
                            .toLocaleString();

                    localStorage.setItem(
                        "currentOrder",
                        JSON.stringify(order)
                    );

                    if (
                        typeof showToast ===
                        "function"
                    ) {

                        showToast(
                            "✅ Payment Successful"
                        );

                    }

                    setTimeout(() => {

                        window.location.href =
                            "receipt.html";

                    }, 800);

                }

                else {

                    alert(
                        data.message ||
                        "Payment failed."
                    );

                    payBtn.disabled =
                        false;

                    payBtn.innerHTML =
                        "💳 Pay Advance Now";

                }

            })

            .catch(error => {

                console.error(
                    "Payment Error:",
                    error
                );

                alert(
                    "Payment update failed."
                );

                payBtn.disabled =
                    false;

                payBtn.innerHTML =
                    "💳 Pay Advance Now";

            });

        }, 2000);

    }
);