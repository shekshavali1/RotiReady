// ===============================
// SSV HOTEL - ORDER PAGE
// ===============================

const PRICE_PER_ROTI = 10;

// Elements
const minusBtn = document.getElementById("minusBtn");
const plusBtn = document.getElementById("plusBtn");
const quantityInput = document.getElementById("quantity");

const summaryQuantity = document.getElementById("summaryQuantity");
const totalAmount = document.getElementById("totalAmount");
const advanceAmount = document.getElementById("advanceAmount");
const remainingAmount = document.getElementById("remainingAmount");

const orderForm = document.getElementById("orderForm");

// ===============================
// Update Price
// ===============================

function updateSummary() {

    let qty = parseInt(quantityInput.value);

    let total = qty * PRICE_PER_ROTI;

    let advance = total / 2;

    let remaining = total - advance;

    summaryQuantity.textContent = qty;

    totalAmount.textContent = "₹" + total;

    advanceAmount.textContent = "₹" + advance;

    remainingAmount.textContent = "₹" + remaining;

}

// ===============================
// Increase Quantity
// ===============================

plusBtn.addEventListener("click", function () {

    quantityInput.value++;

    updateSummary();

});

// ===============================
// Decrease Quantity
// ===============================

minusBtn.addEventListener("click", function () {

    if (quantityInput.value > 1) {

        quantityInput.value--;

        updateSummary();

    }

});

// ===============================
// Set Minimum Date
// ===============================

const pickupDate = document.getElementById("pickupDate");

const today = new Date().toISOString().split("T")[0];

pickupDate.min = today;

async function placeOrder(orderData) {

    try {

        const response = await fetch("http://127.0.0.1:5000/api/order", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(orderData)

        });

        const result = await response.json();

        if(result.success){

            alert("Order Placed Successfully!");

            localStorage.setItem("orderID", result.order_id);

localStorage.setItem(
    "qrCode",
    "http://127.0.0.1:5000/static/qr/" + result.order_id + ".png"
);

window.location.href = "receipt.html";

        }else{

            alert(result.error);

        }

    } catch(err){

        alert("Server Connection Failed!");

        console.log(err);

    }

}

// ===============================
// Form Submit
// ===============================

orderForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = document.getElementById("customerName").value.trim();

    const mobile = document.getElementById("mobileNumber").value.trim();

    const date = pickupDate.value;

    const time = document.getElementById("pickupTime").value;

    const instructions =
        document.getElementById("instructions").value;

    const quantity =
        parseInt(quantityInput.value);

    if (name === "") {

        alert("Please enter your name.");

        return;

    }

    if (!/^[0-9]{10}$/.test(mobile)) {

        alert("Enter a valid 10-digit mobile number.");

        return;

    }

    if (date === "") {

        alert("Select pickup date.");

        return;

    }

    if (time === "") {

        alert("Select pickup time.");

        return;

    }

    const total = quantity * PRICE_PER_ROTI;

    const advance = total / 2;

    const remaining = total - advance;

    const order = {

        customerName: name,

        mobile: mobile,

        pickupDate: date,

        pickupTime: time,

        instructions: instructions,

        quantity: quantity,

        total: total,

        advance: advance,

        remaining: remaining

    };

    

   placeOrder({

    full_name: name,
    mobile: mobile,
    quantity: quantity,
    pickup_date: date,
    pickup_time: time,
    instructions: instructions

});

});

// ===============================
// Initial Summary
// ===============================

updateSummary();