// ==========================================
// SSV HOTEL ADMIN SETTINGS
// ==========================================

// Elements
const hotelName = document.getElementById("hotelName");
const pricePerRoti = document.getElementById("pricePerRoti");
const upiID = document.getElementById("upiID");
const phoneNumber = document.getElementById("phoneNumber");
const hotelAddress = document.getElementById("hotelAddress");

const qrImage = document.getElementById("qrImage");
const qrPreview = document.getElementById("qrPreview");

const saveBtn = document.getElementById("saveSettings");

// ==========================================
// LOAD SETTINGS
// ==========================================

window.addEventListener("load", function () {

    hotelName.value = localStorage.getItem("hotelName") || "SSV HOTEL";

    pricePerRoti.value = localStorage.getItem("pricePerRoti") || "10";

    upiID.value = localStorage.getItem("upiID") || "7075094490@ybl";

    phoneNumber.value = localStorage.getItem("phoneNumber") || "7075094490";

    hotelAddress.value =
        localStorage.getItem("hotelAddress") ||
        "Shiva Nagar, Dharamavaram";

    const savedQR = localStorage.getItem("hotelQR");

    if (savedQR) {

        qrPreview.src = savedQR;

    } else {

        qrPreview.src = "";

    }

});

// ==========================================
// QR IMAGE PREVIEW
// ==========================================
qrImage.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        console.log(e.target.result); // should be a long string

        qrPreview.src = e.target.result;

        localStorage.setItem("hotelQR", e.target.result);

    };

    reader.readAsDataURL(file);

});

// ==========================================
// SAVE SETTINGS
// ==========================================

saveBtn.addEventListener("click", function(){

    localStorage.setItem(
        "hotelName",
        hotelName.value
    );

    localStorage.setItem(
        "pricePerRoti",
        pricePerRoti.value
    );

    localStorage.setItem(
        "upiID",
        upiID.value
    );

    localStorage.setItem(
        "phoneNumber",
        phoneNumber.value
    );

    localStorage.setItem(
        "hotelAddress",
        hotelAddress.value
    );

    alert("✅ Settings Saved Successfully!");

});