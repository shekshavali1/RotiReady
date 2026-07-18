
// ==========================================
// TRACK ORDER
// ==========================================
let currentOrderID = "";
let currentMobile = "";

const trackForm = document.getElementById("trackForm");

const resultCard = document.getElementById("resultCard");

trackForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const orderID =
        document.getElementById("orderID").value.trim();

    const mobile =
        document.getElementById("mobile").value.trim();

    try{

        const response = await fetch(
            "http://127.0.0.1:5000/api/track-order",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    order_id:orderID,

                    mobile:mobile

                })
            }
        );

        const result = await response.json();

        if(result.success){

    currentOrderID = orderID;
    currentMobile = mobile;

    showOrder(result.order);

updateTimeline(result.order.order_status);

updateStatusMessage(result.order.order_status);
}

        else{

            alert(result.message);

        }

    }

    catch(error){

    console.error(error);

    alert(error);

}
});
// ==========================================
// SHOW ORDER DETAILS
// ==========================================
function showOrder(order){

    resultCard.style.display = "block";

    document.getElementById("showOrderID").textContent =
        order.order_id;

    document.getElementById("showCustomer").textContent =
        order.full_name;

    document.getElementById("showStatus").textContent =
        order.order_status;

    document.getElementById("showDate").textContent =
        order.pickup_date;

    document.getElementById("showTime").textContent =
        order.pickup_time;
        startCountdown(
    order.pickup_date,
    order.pickup_time
);
document.getElementById("showMobile").textContent =
    order.mobile;

document.getElementById("showQuantity").textContent =
    order.quantity + " Rotis";

document.getElementById("showTotal").textContent =
    "₹" + order.total_amount;

document.getElementById("showAdvance").textContent =
    "₹" + order.advance_amount;

document.getElementById("showRemaining").textContent =
    "₹" + order.remaining_amount;

document.getElementById("showPayment").textContent =
    order.payment_status;
}
// ==========================================
// UPDATE TIMELINE
// ==========================================

function updateTimeline(status){

    document
        .querySelectorAll(".timeline-item")
        .forEach(item => {

            item.classList.remove("active");

        });

    // Order Confirmed
    document
        .querySelector(".timeline-item")
        .classList.add("active");

    // Preparing
    if(status === "Preparing" ||
       status === "Ready" ||
       status === "Completed"){

        document
            .getElementById("preparingStep")
            .classList.add("active");

    }

    // Ready
    if(status === "Ready" ||
       status === "Completed"){

        document
            .getElementById("readyStep")
            .classList.add("active");

    }

    // Completed
    if(status === "Completed"){

        document
            .getElementById("completedStep")
            .classList.add("active");

    }
}

// ==========================================
// PICKUP COUNTDOWN
// ==========================================

let countdownTimer;

function startCountdown(date, time){

    clearInterval(countdownTimer);

    const pickup = new Date(date + " " + time);

    countdownTimer = setInterval(function(){

        const now = new Date();

        const diff = pickup - now;

        if(diff <= 0){

            document.getElementById("countdown").innerHTML =
            "🎉 Ready for Pickup";

            clearInterval(countdownTimer);

            return;

        }

        const hours =
        Math.floor(diff / (1000 * 60 * 60));

        const minutes =
        Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        const seconds =
        Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML =

            hours + "h " +

            minutes + "m " +

            seconds + "s";

    },1000);

}
// ==========================================
// LIVE ORDER STATUS (AUTO REFRESH)
// ==========================================

setInterval(async function(){

    if(currentOrderID === "" || currentMobile === ""){
        return;
    }

    try{

        const response = await fetch(
            "http://127.0.0.1:5000/api/track-order",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    order_id: currentOrderID,

                    mobile: currentMobile

                })

            }
        );

        const result = await response.json();

        if(result.success){

          
            showOrder(result.order);

updateTimeline(result.order.order_status);

updateStatusMessage(result.order.order_status);

        }

    }

    catch(error){

        console.log(error);

    }

}, 5000);
// ==========================================
// LIVE STATUS MESSAGE
// ==========================================

function updateStatusMessage(status){

    const box = document.getElementById("statusMessage");

    box.style.display = "block";

    box.className = "status-message";

    if(status === "Preparing"){

        box.classList.add("preparing");

        box.innerHTML =
        "👨‍🍳 Your delicious rotis are being prepared.";

    }

    else if(status === "Ready"){

        box.classList.add("ready");

        box.innerHTML =
        "🎉 Your order is ready! Please collect it from SSV HOTEL.";

    }

    else if(status === "Completed"){

        box.classList.add("completed");

        box.innerHTML =
        "✅ Thank you! Your order has been completed.";

    }

}