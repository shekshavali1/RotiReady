async function loadHistory() {

    const mobile = document.getElementById("mobile").value;

    const response = await fetch(
        "http://127.0.0.1:5000/api/order-history",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mobile: mobile
            })
        }
    );

    const result = await response.json();

    const history = document.getElementById("history");

    history.innerHTML = "";

    if (!result.success || result.orders.length === 0) {

        history.innerHTML = "<h3>No Orders Found</h3>";

        return;
    }

    result.orders.forEach(order => {

        history.innerHTML += `
        <div class="card">

            <h3>${order.order_id}</h3>

            <p>🍽 Quantity : ${order.quantity}</p>

            <p>💰 Total : ₹${order.total_amount}</p>

            <p>📅 Pickup : ${order.pickup_date}</p>

            <p>📌 Status : ${order.order_status}</p>

            <p>💳 Payment : ${order.payment_status}</p>

        </div>
        `;

    });

}