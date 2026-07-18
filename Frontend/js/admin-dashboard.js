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

const totalRotis = document.getElementById("totalRotis");
const prevPageBtn =
document.getElementById("prevPageBtn");

const nextPageBtn =
document.getElementById("nextPageBtn");

const pageNumber =
document.getElementById("pageNumber");
const averageOrder =
    document.getElementById("averageOrder");

const completedPercent =
    document.getElementById("completedPercent");

const bestSalesDay =
    document.getElementById("bestSalesDay");

// Store Orders

let orders = [];
let lastOrderCount = 0;

// ===========================
// PAGINATION
// ===========================
let currentPage = 1;
const ordersPerPage = 10;
const badge = document.getElementById("liveOrdersBadge");
if (badge) {
    badge.textContent = orders.length;
}

// ===========================
// HOTEL STATUS
// ===========================

const hotelStatusText =
document.getElementById("hotelStatusText");

const toggleHotelBtn =
document.getElementById("toggleHotelBtn");

// Default = Open

if(localStorage.getItem("hotelStatus") === null){

    localStorage.setItem(
        "hotelStatus",
        "OPEN"
    );

}
let ordersChart;
let revenueChart;
let revenueTrendChart;
let feedbacks = [];

// Notification Sound
const notificationSound = new Audio("sound/notification.mp3.wav");
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

            const previousCount = orders.length;

            orders = result.orders;
            currentPage = 1;

// New order detected
if(lastOrderCount > 0 &&
   orders.length > lastOrderCount){

    const latest =
        orders[0];

    showNotification(

        latest.full_name +

        " placed " +

        latest.quantity +

        " Rotis"

    );

}

lastOrderCount = orders.length;

            // Update badge
           

if (badge) {
    badge.textContent = orders.length;
}

            // New order notification
            if(orders.length > previousCount && previousCount !== 0){

                showToast("🔔 New Order Received!");

                notificationSound.currentTime = 0;
notificationSound.play();

            }

            renderOrders();

            updateDashboardCards();

            loadChart();

            loadRevenueChart();

loadRevenueTrendChart();
        }else{

            showToast(result.message);

        }

    }

    catch(error){

        console.log(error);
showToast("Unable to connect to server.");
    }

}

// ==========================================
// SHOW POPUP
// ==========================================

function showNotification(message){

    const popup =
        document.getElementById("notificationPopup");

    document.getElementById(
        "notificationMessage"
    ).textContent = message;

    popup.classList.add("show");

    setTimeout(function(){

        popup.classList.remove("show");

    },5000);

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

    const start = (currentPage - 1) * ordersPerPage;
    const end = start + ordersPerPage;

    const pageOrders = orders.slice(start, end);

    pageOrders.forEach(function(order){

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
                onclick="printKitchenReceipt('${order.order_id}')">

                🖨 Print

                </button>

                <br><br>

                <button
                class="action-btn"
                onclick="updateOrderStatus('${order.order_id}')">

                Update

                </button>

            </td>

        </tr>

        `;

    });

    pageNumber.textContent =
        `Page ${currentPage} of ${Math.ceil(orders.length / ordersPerPage)}`;

    prevPageBtn.disabled = currentPage === 1;

    nextPageBtn.disabled =
        currentPage === Math.ceil(orders.length / ordersPerPage);

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

           showToast("Order Updated Successfully!");

            loadOrders();

        }

        else{

          showToast(result.message);

        }

    }

    catch(error){

        console.log(error);

        showToast("Unable to connect to server.");

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

    // Total Rotis Sold
    let rotis = 0;

    orders.forEach(order => {
        rotis += Number(order.quantity);
    });

    totalRotis.textContent = rotis;

}
// ======================================
// Average Order Value
// ======================================

const avg =
orders.length > 0
? revenue / orders.length
: 0;

averageOrder.textContent =
"₹" + avg.toFixed(2);

// ======================================
// Completed Percentage
// ======================================

const completed =
orders.filter(order =>
order.order_status === "Completed"
).length;

const percent =
orders.length > 0
? (completed / orders.length) * 100
: 0;

completedPercent.textContent =
percent.toFixed(1) + "%";

// ======================================
// Best Sales Day
// ======================================

const dayRevenue = {};

orders.forEach(order=>{

    if(!dayRevenue[order.pickup_date]){

        dayRevenue[order.pickup_date]=0;

    }

    dayRevenue[order.pickup_date]+=
    Number(order.total_amount);

});

let bestDay="--";

let highest=0;

for(const day in dayRevenue){

    if(dayRevenue[day]>highest){

        highest=dayRevenue[day];

        bestDay=day;

    }

}

bestSalesDay.textContent=bestDay;

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
// REVENUE TREND (LAST 7 DAYS)
// ==========================================

function loadRevenueTrendChart(){

    const revenueMap = {};

    // Group revenue by pickup date
    orders.forEach(order => {

        const date = order.pickup_date;

        if(!revenueMap[date]){

            revenueMap[date] = 0;

        }

        revenueMap[date] += Number(order.total_amount);

    });

    const labels = Object.keys(revenueMap);

    const data = Object.values(revenueMap);

    const ctx = document
        .getElementById("revenueTrendChart")
        .getContext("2d");

    if(revenueTrendChart){

        revenueTrendChart.destroy();

    }

    revenueTrendChart = new Chart(ctx,{

        type:"line",

        data:{

            labels:labels,

            datasets:[{

                label:"Revenue (₹)",

                data:data,

                borderColor:"#2ecc71",

                backgroundColor:"rgba(46,204,113,0.2)",

                fill:true,

                tension:0.4

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    display:true
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
loadFeedback();
});

// ==========================================
// AUTO REFRESH EVERY 10 SECONDS
// ==========================================

setInterval(function(){

    loadOrders();

}, 10000);
// ===========================
// HOTEL OPEN / CLOSE
// ===========================

function loadHotelStatus(){

    const status =
    localStorage.getItem("hotelStatus");

    if(status === "OPEN"){

        hotelStatusText.innerHTML =
        "🟢 OPEN";

        hotelStatusText.style.color =
        "green";

        toggleHotelBtn.innerHTML =
        "Close Hotel";

    }

    else{

        hotelStatusText.innerHTML =
        "🔴 CLOSED";

        hotelStatusText.style.color =
        "red";

        toggleHotelBtn.innerHTML =
        "Open Hotel";

    }

}

toggleHotelBtn.addEventListener(
"click",
function(){

    const status =
    localStorage.getItem("hotelStatus");

    if(status === "OPEN"){

        localStorage.setItem(
            "hotelStatus",
            "CLOSED"
        );

    }

    else{

        localStorage.setItem(
            "hotelStatus",
            "OPEN"
        );

    }

    loadHotelStatus();

});

loadHotelStatus();
// ===========================
// AUTO HOTEL TIMING
// ===========================

function autoHotelTiming(){

    const now = new Date();

    const hour = now.getHours();

    // Hotel Open: 3 PM (15:00)
    // Hotel Close: 10 PM (22:00)

    if(hour >= 15 && hour < 22){

        localStorage.setItem(
            "hotelStatus",
            "OPEN"
        );

    }

    else{

        localStorage.setItem(
            "hotelStatus",
            "CLOSED"
        );

    }

    loadHotelStatus();

}

// Check immediately
autoHotelTiming();

// Check every minute
setInterval(autoHotelTiming, 60000);


// ==========================================
// LOAD CUSTOMER FEEDBACK
// ==========================================

async function loadFeedback(){

    try{

        const response = await fetch(
            "http://127.0.0.1:5000/api/admin/feedback"
        );

        const result = await response.json();

        if(result.success){

            feedbacks = result.feedback;

            renderFeedback();

        }

    }

    catch(error){

        console.log(error);

    }

}
// ==========================================
// SHOW FEEDBACK
// ==========================================

function renderFeedback(){

    const container =
        document.getElementById("feedbackContainer");

    if(!container){
        return;
    }

    container.innerHTML = "";

    feedbacks.forEach(function(item){

        container.innerHTML += `

        <div class="review-card">

            <h3>${item.customer_name}</h3>

            <p><strong>Order:</strong> ${item.order_id}</p>

            <p>⭐ ${item.rating}/5</p>

            <p>${item.review}</p>

            <small>${item.created_at}</small>

            <br><br>

            <button
                class="action-btn delete-btn"
                onclick="deleteFeedback(${item.id})">

                Delete

            </button>

        </div>

        `;

    });

}



async function deleteFeedback(id){

    if(!confirm("Delete this review?")){

        return;

    }

    const response = await fetch(
        "http://127.0.0.1:5000/api/admin/delete-feedback",
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                id:id
            })
        }
    );

    const result = await response.json();

    if(result.success){

      showToast("Review Deleted");

        loadFeedback();

    }

}
// ==========================================
// KITCHEN RECEIPT PRINT
// ==========================================

function printKitchenReceipt(orderId){

    // Find the selected order
    const order = orders.find(function(item){

        return item.order_id === orderId;

    });

    if(!order){

        showToast("Order not found.");

        return;

    }

  const receipt = `
<!DOCTYPE html>
<html>

<head>

<title>Kitchen Receipt</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{

    width:300px;

    margin:auto;

    padding:15px;

    font-family:Courier New, monospace;

    color:#000;

}

.header{

    text-align:center;

}

.header h2{

    font-size:24px;

}

.header h3{

    margin-top:5px;

    font-size:18px;

}

.line{

    border-top:2px dashed #000;

    margin:12px 0;

}

.row{

    display:flex;

    justify-content:space-between;

    margin:8px 0;

    font-size:15px;

}

.title{

    font-weight:bold;

}

.big{

    text-align:center;

    font-size:22px;

    font-weight:bold;

    margin:15px 0;

}

.footer{

    text-align:center;

    margin-top:20px;

    font-size:14px;

}

</style>

</head>

<body>

<div class="header">

<h2>🏨 SSV HOTEL</h2>

<h3>KITCHEN ORDER TICKET</h3>

<p>Shiva Nagar, Dharmavaram</p>

<p>☎ 7075094490</p>

</div>

<div class="line"></div>

<div class="row">

<span class="title">Order ID</span>

<span>${order.order_id}</span>

</div>

<div class="row">

<span class="title">Customer</span>

<span>${order.full_name}</span>

</div>

<div class="row">

<span class="title">Mobile</span>

<span>${order.mobile}</span>

</div>

<div class="row">

<span class="title">Pickup Date</span>

<span>${order.pickup_date}</span>

</div>

<div class="row">

<span class="title">Pickup Time</span>

<span>${order.pickup_time || "Not Available"}</span>

</div>

<div class="line"></div>

<div class="big">

🍽️ ${order.quantity} ROTIS

</div>

<div class="line"></div>

<div class="row">

<span class="title">Status</span>

<span>${order.order_status}</span>

</div>

<div class="row">

<span class="title">Advance</span>

<span>₹${order.advance_amount}</span>

</div>

<div class="row">

<span class="title">Balance</span>

<span>₹${order.remaining_amount}</span>

</div>

<div class="line"></div>

<p><b>Instructions</b></p>

<p>

${order.instructions || "No Special Instructions"}

</p>

<div class="line"></div>

<div class="footer">

Printed :
${new Date().toLocaleString()}

<br><br>

★★★★★

<br>

THANK YOU

</div>

</body>

</html>
`;

   const printWindow = window.open("", "_blank");

printWindow.document.write(receipt);

printWindow.document.close();

printWindow.focus();

// Wait for the page to load
printWindow.onload = function(){

    // Open print dialog
    printWindow.print();

    // Automatically close after printing
    printWindow.onafterprint = function(){

        printWindow.close();

    };

}
}


prevPageBtn.addEventListener("click", function(){

    if(currentPage > 1){

        currentPage--;

        renderOrders();

    }

});

nextPageBtn.addEventListener("click", function(){

    if(currentPage < Math.ceil(orders.length / ordersPerPage)){

        currentPage++;

        renderOrders();

    }

});