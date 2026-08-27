// ==========================================
// SSV HOTEL - TRACK ORDER
// ==========================================

let currentOrderID = "";
let currentMobile = "";

const trackForm =
    document.getElementById("trackForm");

const resultCard =
    document.getElementById("resultCard");

// ==========================================
// TRACK ORDER
// ==========================================

trackForm.addEventListener(
    "submit",
    async function(e) {

        e.preventDefault();

        const orderID =
            document
                .getElementById("orderID")
                .value
                .trim();

        const mobile =
            document
                .getElementById("mobile")
                .value
                .trim();

        try {

            const response =
                await fetch(
                    `${API_BASE}/api/track-order`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            order_id:
                                orderID,

                            mobile:
                                mobile

                        })

                    }
                );

            const result =
                await response.json();

            if (result.success) {

                currentOrderID =
                    orderID;

                currentMobile =
                    mobile;

                showOrder(result.order);

                updateTimeline(
                    result.order.order_status
                );

                updateStatusMessage(
                    result.order.order_status
                );

            }

            else {

                alert(
                    result.message ||
                    "Order not found."
                );

            }

        }

        catch(error) {

            console.error(
                "Track Error:",
                error
            );

            alert(
                "Unable to connect to server."
            );

        }

    }
);

// ==========================================
// SHOW ORDER
// ==========================================

function showOrder(order) {

    resultCard.style.display =
        "block";

    document.getElementById(
        "showOrderID"
    ).textContent =
        order.order_id || "-";

    document.getElementById(
        "showCustomer"
    ).textContent =
        order.customer_name ||
        order.full_name ||
        "-";

    document.getElementById(
        "showStatus"
    ).textContent =
        order.order_status || "-";

    document.getElementById(
        "showDate"
    ).textContent =
        order.pickup_date || "-";

    document.getElementById(
        "showTime"
    ).textContent =
        order.pickup_time || "-";

    document.getElementById(
        "showMobile"
    ).textContent =
        order.mobile || "-";

    document.getElementById(
        "showQuantity"
    ).textContent =
        (order.quantity || 0) +
        " Rotis";

    document.getElementById(
        "showTotal"
    ).textContent =
        "₹" +
        (order.total_amount || 0);

    document.getElementById(
        "showAdvance"
    ).textContent =
        "₹" +
        (order.advance_amount || 0);

    document.getElementById(
        "showRemaining"
    ).textContent =
        "₹" +
        (order.remaining_amount || 0);

    document.getElementById(
        "showPayment"
    ).textContent =
        order.payment_status || "-";

    if (
        order.pickup_date &&
        order.pickup_time
    ) {

        startCountdown(
            order.pickup_date,
            order.pickup_time
        );

    }

}

// ==========================================
// TIMELINE
// ==========================================

function updateTimeline(status) {

    document
        .querySelectorAll(".timeline-item")
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });

    const first =
        document.querySelector(
            ".timeline-item"
        );

    if (first) {

        first.classList.add(
            "active"
        );

    }

    if (
        status === "Preparing" ||
        status === "Ready" ||
        status === "Completed"
    ) {

        document
            .getElementById(
                "preparingStep"
            )
            ?.classList.add("active");

    }

    if (
        status === "Ready" ||
        status === "Completed"
    ) {

        document
            .getElementById(
                "readyStep"
            )
            ?.classList.add("active");

    }

    if (status === "Completed") {

        document
            .getElementById(
                "completedStep"
            )
            ?.classList.add("active");

    }

}

// ==========================================
// COUNTDOWN
// ==========================================

let countdownTimer;

function startCountdown(
    date,
    time
) {

    clearInterval(countdownTimer);

    const pickup =
        new Date(
            date + " " + time
        );

    countdownTimer =
        setInterval(function() {

            const now =
                new Date();

            const diff =
                pickup - now;

            if (diff <= 0) {

                document.getElementById(
                    "countdown"
                ).innerHTML =
                    "🎉 Ready for Pickup";

                clearInterval(
                    countdownTimer
                );

                return;

            }

            const hours =
                Math.floor(
                    diff /
                    (1000 * 60 * 60)
                );

            const minutes =
                Math.floor(
                    (
                        diff %
                        (1000 * 60 * 60)
                    ) /
                    (1000 * 60)
                );

            const seconds =
                Math.floor(
                    (
                        diff %
                        (1000 * 60)
                    ) /
                    1000
                );

            document.getElementById(
                "countdown"
            ).innerHTML =

                hours + "h " +

                minutes + "m " +

                seconds + "s";

        }, 1000);

}

// ==========================================
// LIVE ORDER STATUS
// ==========================================

setInterval(
    async function() {

        if (
            currentOrderID === "" ||
            currentMobile === ""
        ) {

            return;

        }

        try {

            const response =
                await fetch(
                    `${API_BASE}/api/track-order`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            order_id:
                                currentOrderID,

                            mobile:
                                currentMobile

                        })

                    }
                );

            const result =
                await response.json();

            if (result.success) {

                showOrder(
                    result.order
                );

                updateTimeline(
                    result.order
                        .order_status
                );

                updateStatusMessage(
                    result.order
                        .order_status
                );

            }

        }

        catch(error) {

            console.log(error);

        }

    },
    5000
);

// ==========================================
// STATUS MESSAGE
// ==========================================

function updateStatusMessage(status) {

    const box =
        document.getElementById(
            "statusMessage"
        );

    if (!box) {
        return;
    }

    box.style.display =
        "block";

    box.className =
        "status-message";

    if (status === "Preparing") {

        box.classList.add(
            "preparing"
        );

        box.innerHTML =
            "👨‍🍳 Your delicious rotis are being prepared.";

    }

    else if (status === "Ready") {

        box.classList.add(
            "ready"
        );

        box.innerHTML =
            "🎉 Your order is ready! Please collect it from SSV HOTEL.";

    }

    else if (status === "Completed") {

        box.classList.add(
            "completed"
        );

        box.innerHTML =
            "✅ Thank you! Your order has been completed.";

    }

}