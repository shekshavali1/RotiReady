// ==========================================
// SSV HOTEL FEEDBACK PAGE
// ==========================================

// Load Order
const order = JSON.parse(localStorage.getItem("currentOrder"));

if (!order) {
    alert("No Order Found!");
    window.location.href = "index.html";
}

// ==========================================
// SHOW ORDER DETAILS
// ==========================================

document.getElementById("fbOrderID").textContent =
    order.orderID || "-";

document.getElementById("fbCustomer").textContent =
    order.customerName;

document.getElementById("fbStatus").textContent =
    order.orderStatus;

// ==========================================
// STAR RATING
// ==========================================

const stars = document.querySelectorAll(".star");

let rating = 0;

stars.forEach((star) => {

    star.addEventListener("click", function () {

        rating = Number(this.dataset.value);

        stars.forEach(s => s.classList.remove("active"));

        for (let i = 0; i < rating; i++) {
            stars[i].classList.add("active");
        }

    });

});

// ==========================================
// SUBMIT FEEDBACK
// ==========================================

const submitBtn = document.getElementById("submitFeedback");

submitBtn.addEventListener("click", async function () {

    if (rating === 0) {
        alert("Please select a rating.");
        return;
    }

    const review =
        document.getElementById("reviewText").value.trim();

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/feedback",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    order_id: order.orderID,

                    customer_name: order.customerName,

                    mobile: order.mobile,

                    rating: rating,

                    review: review

                })

            }
        );

        const result = await response.json();

        if (result.success) {

            alert("⭐ Thank you for your feedback!");

            window.location.href = "index.html";

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.log(error);

        alert("Server Connection Failed!");

    }

});

// ==========================================
// SKIP FEEDBACK
// ==========================================

const skipBtn = document.getElementById("skipFeedback");

if (skipBtn) {

    skipBtn.addEventListener("click", function () {

        window.location.href = "index.html";

    });

}