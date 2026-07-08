// ==========================================
// SSV HOTEL PAYMENT PAGE
// ==========================================

// Load Order
const order = JSON.parse(localStorage.getItem("currentOrder"));

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

const payBtn =
document.getElementById("payNowBtn");

payBtn.addEventListener("click", function () {

    payBtn.disabled = true;

    payBtn.innerHTML =
    "Processing Payment...";

    setTimeout(async function () {

    try {

        const response = await fetch("http://127.0.0.1:5000/api/order", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                full_name: order.customerName,

                mobile: order.mobile,

                quantity: order.quantity,

                pickup_date: order.pickupDate,

                pickup_time: order.pickupTime,

                instructions: order.instructions

            })

        });

        const result = await response.json();

        if(result.success){

            order.orderID = result.order_id;

            order.paymentStatus = "Paid";

            order.orderStatus = "Preparing";

            order.paymentTime = new Date().toLocaleString();

            localStorage.setItem(
                "currentOrder",
                JSON.stringify(order)
            );

            window.location.href = "receipt.html";

        }

        else{

            alert(result.error);

            payBtn.disabled = false;

            payBtn.innerHTML = "Pay Advance";

        }

    }

    catch(error){

        console.log(error);

        alert("Unable to connect to server.");

        payBtn.disabled = false;

        payBtn.innerHTML = "Pay Advance";

    }

},2000);

});