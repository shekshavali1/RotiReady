// ==========================================
// SSV HOTEL - ORDER PAGE
// ==========================================

const selectedItem = JSON.parse(
    localStorage.getItem("selectedItem")
);

if (!selectedItem) {

    alert("Please select an item first.");

    window.location.href = "index.html";

}

// ==========================================
// ELEMENTS
// ==========================================

const minusBtn =
    document.getElementById("minusBtn");

const plusBtn =
    document.getElementById("plusBtn");

const quantityInput =
    document.getElementById("quantity");

const summaryQuantity =
    document.getElementById("summaryQuantity");

const totalAmount =
    document.getElementById("totalAmount");

const advanceAmount =
    document.getElementById("advanceAmount");

const remainingAmount =
    document.getElementById("remainingAmount");

const pickupDate =
    document.getElementById("pickupDate");

const continueBtn =
    document.getElementById("continueBtn");

const loadingSpinner =
    document.getElementById("loadingSpinner");

// ==========================================
// MINIMUM DATE
// ==========================================

pickupDate.min =
    new Date().toISOString().split("T")[0];

// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSummary() {

    const qty =
        parseInt(quantityInput.value) || 1;

    const total =
        qty * Number(selectedItem.price);

    const advance =
        total / 2;

    const remaining =
        total - advance;

    summaryQuantity.textContent =
        qty;

    totalAmount.textContent =
        "₹" + total;

    advanceAmount.textContent =
        "₹" + advance;

    remainingAmount.textContent =
        "₹" + remaining;

}

// ==========================================
// PLUS
// ==========================================

plusBtn.addEventListener("click", function() {

    quantityInput.value =
        parseInt(quantityInput.value) + 1;

    updateSummary();

});

// ==========================================
// MINUS
// ==========================================

minusBtn.addEventListener("click", function() {

    if (
        parseInt(quantityInput.value) > 1
    ) {

        quantityInput.value =
            parseInt(quantityInput.value) - 1;

        updateSummary();

    }

});

// ==========================================
// CONTINUE
// ==========================================

continueBtn.addEventListener(
    "click",
    function() {

        const name =
            document
                .getElementById("customerName")
                .value
                .trim();

        const mobile =
            document
                .getElementById("mobileNumber")
                .value
                .trim();

        const date =
            document
                .getElementById("pickupDate")
                .value;

        const time =
            document
                .getElementById("pickupTime")
                .value;

        const instructions =
            document
                .getElementById("instructions")
                .value
                .trim();

        const quantity =
            parseInt(quantityInput.value);

        if (name === "") {

            showToast(
                "Please enter your name",
                "warning"
            );

            return;

        }

        if (!/^[0-9]{10}$/.test(mobile)) {

            showToast(
                "Enter valid mobile number",
                "warning"
            );

            return;

        }

        if (date === "") {

            showToast(
                "Select pickup date",
                "warning"
            );

            return;

        }

        if (time === "") {

            showToast(
                "Select pickup time",
                "warning"
            );

            return;

        }

        const total =
            quantity * Number(selectedItem.price);

        const advance =
            total / 2;

        const remaining =
            total - advance;

        const order = {

            customerName: name,

            mobile: mobile,

            itemName: selectedItem.name,

            pickupDate: date,

            pickupTime: time,

            instructions: instructions,

            quantity: quantity,

            total: total,

            advance: advance,

            remaining: remaining

        };

        if (loadingSpinner) {

            loadingSpinner.style.display =
                "flex";

        }

        fetch(`${API_BASE}/api/order`, {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                customer_name: name,

                mobile: mobile,

                item_name: selectedItem.name,

                quantity: quantity,

                total_amount: total,

                pickup_date: date,

                pickup_time: time,

                instructions: instructions

            })

        })

        .then(res => res.json())

        .then(result => {

            if (loadingSpinner) {

                loadingSpinner.style.display =
                    "none";

            }

            console.log(result);

            if (result.success) {

                order.orderID =
                    result.order_id;

                order.orderStatus =
                    "Pending";

                order.paymentStatus =
                    "Pending";

                localStorage.setItem(
                    "orderID",
                    result.order_id
                );

                localStorage.setItem(
                    "currentOrder",
                    JSON.stringify(order)
                );

                showToast(
                    "Order Created Successfully"
                );

                setTimeout(function() {

                    window.location.href =
                        "payment.html";

                }, 800);

            }

            else {

                alert(
                    result.error ||
                    result.message ||
                    "Order creation failed."
                );

            }

        })

        .catch(error => {

            if (loadingSpinner) {

                loadingSpinner.style.display =
                    "none";

            }

            console.error(
                "Order Error:",
                error
            );

            alert(
                "Server Connection Failed"
            );

        });

    }
);

// ==========================================
// INITIAL SUMMARY
// ==========================================

updateSummary();

// ==========================================
// HOTEL STATUS
// ==========================================

function checkHotelStatus() {

    const hour =
        new Date().getHours();

    const closedBox =
        document.getElementById(
            "hotelClosedBox"
        );

    const orderContainer =
        document.querySelector(
            ".order-container"
        );

    if (!closedBox || !orderContainer) {
        return;
    }

    // Open: 3 PM - 10 PM
    if (hour >= 15 && hour < 22) {

        closedBox.style.display =
            "none";

        orderContainer.style.display =
            "flex";

    }

    else {

        closedBox.style.display =
            "block";

        orderContainer.style.display =
            "none";

    }

}

checkHotelStatus();

setInterval(
    checkHotelStatus,
    60000
);