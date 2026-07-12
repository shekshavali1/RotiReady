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
const loadingSpinner = document.getElementById("loadingSpinner");
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

        showToast("Please enter your name.", "warning");

        return;

    }

    if (!/^[0-9]{10}$/.test(mobile)) {
showToast("Enter a valid 10-digit mobile number.", "warning");

        return;

    }

    if (date === "") {

        showToast("Select pickup date.", "warning");

        return;

    }

    if (time === "") {

        showToast("Select pickup time.", "warning");

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

  // Show Loading Spinner
if (loadingSpinner) {
    loadingSpinner.style.display = "flex";
}

fetch("http://127.0.0.1:5000/api/order", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        full_name: name,
        mobile: mobile,
        quantity: quantity,
        pickup_date: date,
        pickup_time: time,
        instructions: instructions
    })
})
.then(response => response.json())
.then(result => {

    if (loadingSpinner) {
        loadingSpinner.style.display = "none";
    }

    if (result.success) {

        order.orderID = result.order_id;

        localStorage.setItem("orderID", result.order_id);
        localStorage.setItem("currentOrder", JSON.stringify(order));

        showToast("✅ Order Created Successfully");

        setTimeout(() => {
            window.location.href = "payment.html";
        }, 1000);

    } else {

        alert(result.error);

    }

})
.catch(error => {

    if (loadingSpinner) {
        loadingSpinner.style.display = "none";
    }

    console.log(error);
    alert("Unable to connect to server.");

});

});

// ===============================
// Initial Summary
// ===============================

updateSummary();
// ===========================
// AUTO HOTEL STATUS CHECK
// ===========================

function checkHotelStatus(){

    const now = new Date();

    const hour = now.getHours();

    if(hour >= 15 && hour < 22){

        document.getElementById(
            "hotelClosedBox"
        ).style.display = "none";

        document.querySelector(
            ".order-container"
        ).style.display = "flex";

    }

    else{

        document.getElementById(
            "hotelClosedBox"
        ).style.display = "block";

        document.querySelector(
            ".order-container"
        ).style.display = "none";

    }

}

checkHotelStatus();

// Update every minute
setInterval(checkHotelStatus, 60000);

