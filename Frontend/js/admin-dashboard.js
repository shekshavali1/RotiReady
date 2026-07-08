// ==========================================
// SSV HOTEL ADMIN DASHBOARD
// ==========================================
const statusFilter =
    document.getElementById("statusFilter");
    const dateFilter =
    document.getElementById("dateFilter");
const ordersBody = document.getElementById("ordersBody");

const searchOrder = document.getElementById("searchOrder");

const refreshBtn = document.getElementById("refreshBtn");
const exportExcelBtn =
    document.getElementById("exportExcelBtn");
    const exportPdfBtn =
    document.getElementById("exportPdfBtn");

const logoutBtn = document.getElementById("logoutBtn");

const logoutModal = document.getElementById("logoutModal");

const confirmLogout = document.getElementById("confirmLogout");

const cancelLogout = document.getElementById("cancelLogout");

// Dashboard Cards

const totalOrders = document.getElementById("totalOrders");

const todayOrders = document.getElementById("todayOrders");

const totalRevenue = document.getElementById("totalRevenue");

const pendingOrders = document.getElementById("pendingOrders");

// Store Orders

let orders = [];
let ordersChart;
let revenueChart;

// ==========================================
// CHECK ADMIN LOGIN
// ==========================================

if(localStorage.getItem("adminLoggedIn") !== "true"){

    window.location.href = "admin-login.html";

}
// ==========================================
// LOAD ALL ORDERS
// ==========================================

async function loadOrders(){

    try{

        const response = await fetch(
            "http://127.0.0.1:5000/api/admin/orders"
        );

        const result = await response.json();

        if(result.success){

            orders = result.orders;

            renderOrders();

            updateDashboardCards();
            loadChart();
            loadRevenueChart();

        }else{

            alert(result.message);

        }

    }

    catch(error){

        console.log(error);

        alert("Unable to connect to server.");

    }

}

// ==========================================
// RENDER ORDERS
// ==========================================

function renderOrders(){

    ordersBody.innerHTML = "";

    if(orders.length === 0){

        ordersBody.innerHTML = `

        <tr>

            <td colspan="11">

                No Orders Found

            </td>

        </tr>

        `;

        return;

    }

    orders.forEach(function(order){

        ordersBody.innerHTML += `

        <tr>

            <td>${order.order_id}</td>

            <td>${order.full_name}</td>

            <td>${order.mobile}</td>

            <td>${order.quantity}</td>

            <td>₹${order.total_amount}</td>

            <td>₹${order.advance_amount}</td>

            <td>₹${order.remaining_amount}</td>

            <td>${order.pickup_date}</td>

            <td>${order.payment_status}</td>

            <td>

                <span class="status ${order.order_status.toLowerCase()}">

                    ${order.order_status}

                </span>

            </td>

            <td>

          <button
    class="action-btn"
    onclick="updateOrderStatus('${order.order_id}')">

    Update

</button>
            </td>

        </tr>

        `;

    });

}


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

async function updateOrderStatus(orderID){

    try{

        const response = await fetch(
            "http://127.0.0.1:5000/api/update-order-status",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    order_id:orderID

                })
            }
        );

        const result = await response.json();

        if(result.success){

            alert("Order Updated Successfully!");

            loadOrders();

        }

        else{

            alert(result.message);

        }

    }

    catch(error){

        console.log(error);

        alert("Unable to connect to server.");

    }

}
// ==========================================
// DASHBOARD CARDS
// ==========================================

function updateDashboardCards(){

    totalOrders.textContent = orders.length;

    const pending =
        orders.filter(order =>
            order.order_status === "Preparing"
        ).length;

    pendingOrders.textContent = pending;

    const today = new Date().toISOString().split("T")[0];

    const todayCount =
        orders.filter(order =>
            order.pickup_date === today
        ).length;

    todayOrders.textContent = todayCount;

    let revenue = 0;

    orders.forEach(order => {

        revenue += Number(order.total_amount);

    });

    totalRevenue.textContent = "₹" + revenue;

}
// ==========================================
// ORDER ANALYTICS CHART
// ==========================================

function loadChart(){

    const preparing =
        orders.filter(order =>
            order.order_status === "Preparing"
        ).length;

    const ready =
        orders.filter(order =>
            order.order_status === "Ready"
        ).length;

    const completed =
        orders.filter(order =>
            order.order_status === "Completed"
        ).length;

    const ctx = document
        .getElementById("ordersChart")
        .getContext("2d");

    if(ordersChart){
        ordersChart.destroy();
    }

    ordersChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: [
                "Preparing",
                "Ready",
                "Completed"
            ],

            datasets: [{

                label: "Orders",

                data: [
                    preparing,
                    ready,
                    completed
                ],

                backgroundColor: [
                    "#f39c12",
                    "#3498db",
                    "#2ecc71"
                ],

                borderRadius: 10

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: false

                }

            }

        }

    });

}

// ==========================================
// REVENUE PIE CHART
// ==========================================

function loadRevenueChart(){

    const totalRevenue =
        orders.reduce((sum, order) =>
            sum + Number(order.total_amount), 0);

    const advanceRevenue =
        orders.reduce((sum, order) =>
            sum + Number(order.advance_amount), 0);

    const remainingRevenue =
        orders.reduce((sum, order) =>
            sum + Number(order.remaining_amount), 0);

    const ctx = document
        .getElementById("revenueChart")
        .getContext("2d");

    if(revenueChart){
        revenueChart.destroy();
    }

    revenueChart = new Chart(ctx,{

        type:"pie",

        data:{

            labels:[
                "Advance Paid",
                "Remaining Payment"
            ],

            datasets:[{

                data:[
                    advanceRevenue,
                    remainingRevenue
                ],

                backgroundColor:[
                    "#2ecc71",
                    "#e74c3c"
                ]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                title:{
                    display:true,
                    text:"Total Revenue ₹" + totalRevenue
                }

            }

        }

    });

}
// ==========================================
// EXPORT TO EXCEL
// ==========================================

function exportToExcel(){

    const worksheet = XLSX.utils.json_to_sheet(orders);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Orders"
    );

    XLSX.writeFile(
        workbook,
        "SSV_Hotel_Orders.xlsx"
    );

}
// ==========================================
// EXPORT TO PDF
// ==========================================

function exportToPDF(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("SSV HOTEL - Orders Report", 14, 20);

    const tableData = [];

    orders.forEach(order => {

        tableData.push([

            order.order_id,
            order.full_name,
            order.mobile,
            order.quantity,
            "₹" + order.total_amount,
            order.order_status

        ]);

    });

    doc.autoTable({

        head: [[
            "Order ID",
            "Customer",
            "Mobile",
            "Qty",
            "Amount",
            "Status"
        ]],

        body: tableData,

        startY: 30

    });

    doc.save("SSV_Hotel_Orders.pdf");

}
// ==========================================
// SEARCH ORDERS
// ==========================================

searchOrder.addEventListener("keyup", function(){

    const keyword =
        this.value.toLowerCase();

    const filteredOrders =
        orders.filter(order =>

            order.order_id.toLowerCase().includes(keyword) ||

            order.mobile.includes(keyword)

        );

    ordersBody.innerHTML = "";

    if(filteredOrders.length === 0){

        ordersBody.innerHTML = `

        <tr>

            <td colspan="11">

                No Matching Orders

            </td>

        </tr>

        `;

        return;

    }

    filteredOrders.forEach(function(order){

        ordersBody.innerHTML += `

        <tr>

            <td>${order.order_id}</td>

            <td>${order.full_name}</td>

            <td>${order.mobile}</td>

            <td>${order.quantity}</td>

            <td>₹${order.total_amount}</td>

            <td>₹${order.advance_amount}</td>

            <td>₹${order.remaining_amount}</td>

            <td>${order.pickup_date}</td>

            <td>${order.payment_status}</td>

            <td>

                <span class="status ${order.order_status.toLowerCase()}">

                    ${order.order_status}

                </span>

            </td>

            <td>

                <button
    class="action-btn"
    onclick="updateOrderStatus('${order.order_id}')">

    Update

</button>

            </td>

        </tr>

        `;

    });

});
// ==========================================
// FILTER BY STATUS
// ==========================================

statusFilter.addEventListener("change", function(){

    const status = this.value;

    if(status === "All"){

        renderOrders();

        return;

    }

    const filteredOrders = orders.filter(order =>

        order.order_status === status

    );

    ordersBody.innerHTML = "";

    filteredOrders.forEach(function(order){

        ordersBody.innerHTML += `

        <tr>

            <td>${order.order_id}</td>

            <td>${order.full_name}</td>

            <td>${order.mobile}</td>

            <td>${order.quantity}</td>

            <td>₹${order.total_amount}</td>

            <td>₹${order.advance_amount}</td>

            <td>₹${order.remaining_amount}</td>

            <td>${order.pickup_date}</td>

            <td>${order.payment_status}</td>

            <td>

                <span class="status ${order.order_status.toLowerCase()}">

                    ${order.order_status}

                </span>

            </td>

            <td>

                <button
                    class="action-btn"
                    onclick="updateOrderStatus('${order.order_id}')">

                    Update

                </button>

            </td>

        </tr>

        `;

    });

});
// ==========================================
// FILTER BY DATE
// ==========================================

dateFilter.addEventListener("change", function(){

    const selectedDate = this.value;

    if(selectedDate === ""){

        renderOrders();

        return;

    }

    const filteredOrders = orders.filter(order =>

        order.pickup_date === selectedDate

    );

    ordersBody.innerHTML = "";

    if(filteredOrders.length === 0){

        ordersBody.innerHTML = `

        <tr>

            <td colspan="11">

                No Orders Found

            </td>

        </tr>

        `;

        return;

    }

    filteredOrders.forEach(function(order){

        ordersBody.innerHTML += `

        <tr>

            <td>${order.order_id}</td>

            <td>${order.full_name}</td>

            <td>${order.mobile}</td>

            <td>${order.quantity}</td>

            <td>₹${order.total_amount}</td>

            <td>₹${order.advance_amount}</td>

            <td>₹${order.remaining_amount}</td>

            <td>${order.pickup_date}</td>

            <td>${order.payment_status}</td>

            <td>

                <span class="status ${order.order_status.toLowerCase()}">

                    ${order.order_status}

                </span>

            </td>

            <td>

                <button
                    class="action-btn"
                    onclick="updateOrderStatus('${order.order_id}')">

                    Update

                </button>

            </td>

        </tr>

        `;

    });

});

// ==========================================
// REFRESH BUTTON
// ==========================================

refreshBtn.addEventListener("click", function(){

    loadOrders();
   

});
exportExcelBtn.addEventListener("click", function(){

    exportToExcel();

});
exportPdfBtn.addEventListener("click", function(){

    exportToPDF();

});
// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener("click", function(e){

    e.preventDefault();

    logoutModal.style.display = "flex";

});

cancelLogout.addEventListener("click", function(){

    logoutModal.style.display = "none";

});

confirmLogout.addEventListener("click", function(){

    localStorage.removeItem("adminLoggedIn");

    localStorage.removeItem("adminName");

    window.location.href = "admin-login.html";

});

window.addEventListener("click", function(e){

    if(e.target === logoutModal){

        logoutModal.style.display = "none";

    }

});

// ==========================================
// PAGE INITIALIZATION
// ==========================================

window.addEventListener("load", function(){

    loadOrders();

});

// ==========================================
// AUTO REFRESH EVERY 30 SECONDS
// ==========================================

setInterval(function(){

    loadOrders();

}, 30000);
