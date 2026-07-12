// ==========================================
// SSV HOTEL RECEIPT PAGE
// ==========================================

// Load Order Data
const order = JSON.parse(localStorage.getItem("currentOrder"));

if (!order) {

    alert("No order found!");

    window.location.href = "order.html";

}

// ==============================
// Display Receipt Details
// ==============================
document.getElementById("receiptOrderID").textContent =
localStorage.getItem("orderID");
document.getElementById("receiptName").textContent =
order.customerName;

document.getElementById("receiptMobile").textContent =
order.mobile;

document.getElementById("receiptQuantity").textContent =
order.quantity + " Rotis";

document.getElementById("receiptTotal").textContent =
"₹" + order.total;

document.getElementById("receiptAdvance").textContent =
"₹" + order.advance;

document.getElementById("receiptRemaining").textContent =
"₹" + order.remaining;

document.getElementById("receiptDate").textContent =
order.pickupDate;

document.getElementById("receiptTime").textContent =
order.pickupTime;

document.getElementById("receiptStatus").textContent =
order.orderStatus;
document.getElementById("receiptPaymentStatus").textContent =
order.paymentStatus;
// ==========================================
// SHOW QR CODE
// ==========================================

const qrImage = document.getElementById("receiptQR");

const qrCode = localStorage.getItem("qrCode");

if (qrImage && qrCode) {

    qrImage.src = qrCode;

}
// ==============================
// Print Receipt
// ==============================

const printBtn =
document.getElementById("printBtn");

printBtn.addEventListener("click", function(){

    window.print();

});

// ==============================
// Download Receipt
// ==============================

// ==============================
// Download / Print Receipt
// ==============================

const downloadBtn =
document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", function(){

    window.print();

});

// ==============================
// Success Message
// ==============================

console.log("Receipt Loaded Successfully.");

console.log(order);