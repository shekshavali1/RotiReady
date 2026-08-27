// ==========================================
// SSV HOTEL - FEEDBACK
// ==========================================

const order =
    JSON.parse(
        localStorage.getItem(
            "currentOrder"
        )
    );

if (!order) {

    alert("No Order Found!");

    window.location.href =
        "index.html";

}

// ==========================================
// ORDER DETAILS
// ==========================================

document.getElementById(
    "feedbackOrderID"
).textContent =
    order.orderID || "-";

document.getElementById(
    "feedbackCustomer"
).textContent =
    order.customerName || "-";

// ==========================================
// STAR RATING
// ==========================================

const stars =
    document.querySelectorAll(".star");

let rating = 0;

stars.forEach(star => {

    star.addEventListener(
        "click",
        function() {

            rating =
                Number(
                    this.dataset.value
                );

            stars.forEach(s =>
                s.classList.remove(
                    "active"
                )
            );

            for (
                let i = 0;
                i < rating;
                i++
            ) {

                stars[i].classList.add(
                    "active"
                );

            }

        }
    );

});

// ==========================================
// SUBMIT
// ==========================================

const submitBtn =
    document.getElementById(
        "submitReviewBtn"
    );

submitBtn.addEventListener(
    "click",
    async function() {

        if (rating === 0) {

            alert(
                "Please select a rating."
            );

            return;

        }

        const review =
            document
                .getElementById(
                    "reviewText"
                )
                .value
                .trim();

        try {

            const response =
                await fetch(
                    `${API_BASE}/api/feedback`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            order_id:
                                order.orderID,

                            customer_name:
                                order.customerName,

                            mobile:
                                order.mobile,

                            rating:
                                rating,

                            review:
                                review

                        })

                    }
                );

            const result =
                await response.json();

            if (result.success) {

                alert(
                    "⭐ Thank you for your feedback!"
                );

                window.location.href =
                    "index.html";

            }

            else {

                alert(
                    result.message ||
                    "Feedback submission failed."
                );

            }

        }

        catch(error) {

            console.error(
                "Feedback Error:",
                error
            );

            alert(
                "Server Connection Failed!"
            );

        }

    }
);

// ==========================================
// SKIP
// ==========================================

const skipBtn =
    document.getElementById(
        "skipFeedback"
    );

if (skipBtn) {

    skipBtn.addEventListener(
        "click",
        function() {

            window.location.href =
                "index.html";

        }
    );

}