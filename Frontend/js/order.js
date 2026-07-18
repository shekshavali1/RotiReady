// ===============================
// SSV HOTEL - ORDER PAGE
// ===============================

const PRICE_PER_ROTI = 10;

// ===============================
// Elements
// ===============================

const minusBtn = document.getElementById("minusBtn");
const plusBtn = document.getElementById("plusBtn");
const quantityInput = document.getElementById("quantity");

const summaryQuantity = document.getElementById("summaryQuantity");
const totalAmount = document.getElementById("totalAmount");
const advanceAmount = document.getElementById("advanceAmount");
const remainingAmount = document.getElementById("remainingAmount");

const pickupDate = document.getElementById("pickupDate");
const continueBtn = document.getElementById("continueBtn");
const loadingSpinner = document.getElementById("loadingSpinner");

// ===============================
// Minimum Date
// ===============================

pickupDate.min = new Date().toISOString().split("T")[0];

// ===============================
// Update Summary
// ===============================

function updateSummary() {

    const qty = parseInt(quantityInput.value);

    const total = qty * PRICE_PER_ROTI;

    const advance = total / 2;

    const remaining = total - advance;

    summaryQuantity.textContent = qty;

    totalAmount.textContent = "₹" + total;

    advanceAmount.textContent = "₹" + advance;

    remainingAmount.textContent = "₹" + remaining;

}

// ===============================
// Quantity Buttons
// ===============================

plusBtn.addEventListener("click", () => {

    quantityInput.value++;

    updateSummary();

});

minusBtn.addEventListener("click", () => {

    if (quantityInput.value > 1) {

        quantityInput.value--;

        updateSummary();

    }

});

// ===============================
// Continue Button
// ===============================

continueBtn.addEventListener("click", function () {

    const name = document.getElementById("customerName").value.trim();

    const mobile = document.getElementById("mobileNumber").value.trim();

    const date = document.getElementById("pickupDate").value;

    const time = document.getElementById("pickupTime").value;

    const instructions = document.getElementById("instructions").value;

    const quantity = parseInt(quantityInput.value);

    if (name === "") {

        showToast("Please enter your name", "warning");

        return;

    }

    if (!/^[0-9]{10}$/.test(mobile)) {

        showToast("Enter valid mobile number", "warning");

        return;

    }

    if (date === "") {

        showToast("Select pickup date", "warning");

        return;

    }

    if (time === "") {

        showToast("Select pickup time", "warning");

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

    .then(res => res.json())

    .then(result => {

        if (loadingSpinner) {

            loadingSpinner.style.display = "none";

        }

        console.log(result);

        if (result.success) {

            order.orderID = result.order_id;

            localStorage.setItem("orderID", result.order_id);

            localStorage.setItem("currentOrder", JSON.stringify(order));

            showToast("Order Created Successfully");

            setTimeout(function(){

                window.location.href = "payment.html";

            },800);

        }

        else{

            alert(result.error || result.message);

        }

    })

    .catch(err=>{

        if (loadingSpinner) {

            loadingSpinner.style.display = "none";

        }

        console.error(err);

        alert("Server Connection Failed");

    });

});

// ===============================
// Initial Summary
// ===============================

updateSummary();

// ===============================
// Hotel Opening Time
// ===============================

function checkHotelStatus(){

    const hour = new Date().getHours();

    const closedBox = document.getElementById("hotelClosedBox");

    const orderContainer = document.querySelector(".order-container");

    if(hour>=15 && hour<22){

        closedBox.style.display="none";

        orderContainer.style.display="flex";

    }

    else{

        closedBox.style.display="block";

        orderContainer.style.display="none";

    }

}

checkHotelStatus();

setInterval(checkHotelStatus,60000);