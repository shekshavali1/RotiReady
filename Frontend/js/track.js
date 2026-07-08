
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

//updateTimeline(result.order.order_status);
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

    resultCard.innerHTML = `

    <div class="track-result">

        <h2>📦 Order Details</h2>

        <div class="track-row">

            <span>Order ID</span>

            <strong>${order.order_id}</strong>

        </div>

        <div class="track-row">

            <span>Customer</span>

            <strong>${order.full_name}</strong>

        </div>

        <div class="track-row">

            <span>Mobile</span>

            <strong>${order.mobile}</strong>

        </div>

        <div class="track-row">

            <span>Quantity</span>

            <strong>${order.quantity} Rotis</strong>

        </div>

        <div class="track-row">

            <span>Total Amount</span>

            <strong>₹${order.total_amount}</strong>

        </div>

        <div class="track-row">

            <span>Advance Paid</span>

            <strong>₹${order.advance_amount}</strong>

        </div>

        <div class="track-row">

            <span>Remaining Amount</span>

            <strong>₹${order.remaining_amount}</strong>

        </div>

        <div class="track-row">

            <span>Pickup Date</span>

            <strong>${order.pickup_date}</strong>

        </div>

        <div class="track-row">

            <span>Pickup Time</span>

            <strong>${order.pickup_time}</strong>

        </div>

        <div class="track-row">

            <span>Payment Status</span>

            <strong>${order.payment_status}</strong>

        </div>

        <div class="track-row">

            <span>Order Status</span>

          <strong
    id="liveStatus"
    class="${order.order_status.toLowerCase()}">

    ${order.order_status}

</strong>
        </div>

    </div>

    `;

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

        }

    }

    catch(error){

        console.log(error);

    }

}, 5000);