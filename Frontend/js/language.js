// ==========================================
// SSV HOTEL MULTI LANGUAGE SYSTEM
// ==========================================

// ---------- Safe Functions ----------

function setText(id, value){

    const element = document.getElementById(id);

    if(element){

        element.textContent = value;

    }

}

function setHTML(id, value){

    const element = document.getElementById(id);

    if(element){

        element.innerHTML = value;

    }

}

function setPlaceholder(id, value){

    const element = document.getElementById(id);

    if(element){

        element.placeholder = value;

    }

}

// ==========================================
// TRANSLATIONS
// ==========================================

const translations = {

    en:{

        // NAVBAR

        navHome:"Home",
        navOrder:"Order Now",
        navTrack:"Track Order",
        navContact:"Contact",

        // HOME PAGE

        heroTitle:"Fresh Rotis Ready Before You Arrive",

        heroText:"Order delicious handmade rotis online and pick them up without waiting in line.",

        orderNow:"Order Now",

        trackNow:"Track Order",


        // English
menuTitle: "Today's Menu",
menuSubtitle: "Fresh food served daily at SSV HOTEL",

morningMenu: "Morning Menu",
morningTime: "6:00 AM – 11:00 AM",

eveningMenu: "Evening Menu",
eveningTime: "4:00 PM – 10:00 PM",

dosa: "Dosa",
puri: "Puri",
roti: "Roti",

        // ORDER PAGE

        orderTitle:"Place Your Order",
        orderDescription: "Order fresh rotis online from <strong>SSV HOTEL</strong> and skip the waiting queue.",

        customerDetails:"Customer Details",

        fullName:"Full Name",

        mobile:"Mobile Number",

        pickupDate:"Pickup Date",

        pickupTime:"Pickup Time",

        instructions:"Instructions",

        quantity:"Quantity",

        summary:"Order Summary",

        price:"Price Per Roti",

        total:"Total Amount",

        advance:"Advance (50%)",

        remaining:"Remaining Amount",

        continuePayment:"Continue to Payment →",

        backHome:"← Back to Home",

        note1:"✅ Pay only <strong>50%</strong> now.",

        note2:"💰 Pay the remaining amount when you collect your order.",

        // PLACEHOLDERS

        namePlaceholder:"Enter your full name",

        mobilePlaceholder:"Enter your mobile number",

        instructionPlaceholder:"Optional (Example: Make rotis soft)"

    },

    te:{

        // NAVBAR

        navHome:"హోమ్",

        navOrder:"ఆర్డర్",

        navTrack:"ఆర్డర్ ట్రాక్",

        navContact:"సంప్రదించండి",

        // HOME PAGE

        heroTitle:"మీరు వచ్చేలోపు తాజా రొట్టెలు సిద్ధంగా ఉంటాయి",

        heroText:"ఆన్‌లైన్‌లో రొట్టెలను ఆర్డర్ చేసి వేచి ఉండకుండా తీసుకెళ్లండి.",

        orderNow:"ఇప్పుడే ఆర్డర్ చేయండి",

        trackNow:"ఆర్డర్ ట్రాక్ చేయండి",

        // Telugu
menuTitle: "ఈరోజు మెనూ",
menuSubtitle: "SSV HOTEL లో ప్రతిరోజూ తాజా ఆహారం",

morningMenu: "ఉదయం మెనూ",
morningTime: "ఉదయం 6:00 – 11:00",

eveningMenu: "సాయంత్రం మెనూ",
eveningTime: "సాయంత్రం 4:00 – 10:00",

dosa: "దోసె",
puri: "పూరీ",
roti: "రొట్టె",

        // ORDER PAGE

        orderTitle:"మీ ఆర్డర్ ఇవ్వండి",
        orderDescription: "<strong>SSV HOTEL</strong> నుండి తాజా రొట్టెలను ఆన్‌లైన్‌లో ఆర్డర్ చేసి వేచి ఉండే సమయాన్ని ఆదా చేయండి.",

        customerDetails:"కస్టమర్ వివరాలు",

        fullName:"పూర్తి పేరు",

        mobile:"మొబైల్ నంబర్",

        pickupDate:"తీసుకెళ్లే తేదీ",

        pickupTime:"తీసుకెళ్లే సమయం",

        instructions:"సూచనలు",

        quantity:"సంఖ్య",

        summary:"ఆర్డర్ సారాంశం",

        price:"ఒక రొట్టె ధర",

        total:"మొత్తం",

        advance:"ముందస్తు చెల్లింపు (50%)",

        remaining:"మిగిలిన మొత్తం",

        continuePayment:"చెల్లింపుకు కొనసాగండి →",

        backHome:"← హోమ్‌కు తిరిగి వెళ్ళండి",

        note1:"✅ ఇప్పుడు <strong>50%</strong> మాత్రమే చెల్లించండి.",

        note2:"💰 మిగిలిన మొత్తాన్ని ఆర్డర్ తీసుకునే సమయంలో చెల్లించండి.",

        // PLACEHOLDERS

        namePlaceholder:"మీ పూర్తి పేరు నమోదు చేయండి",

        mobilePlaceholder:"మీ మొబైల్ నంబర్ నమోదు చేయండి",

        instructionPlaceholder:"ఐచ్చికం (ఉదా: రొట్టెలు మెత్తగా చేయండి)"

    }

};
// ==========================================
// CHANGE LANGUAGE
// ==========================================

function changeLanguage(lang){

    localStorage.setItem("language", lang);

    // ---------------- NAVBAR ----------------

    setText("navHome", translations[lang].navHome);

    setText("navOrder", translations[lang].navOrder);

    setText("navTrack", translations[lang].navTrack);

    setText("navContact", translations[lang].navContact);

    setText("trackOrderText", translations[lang].trackNow);

    // ---------------- HOME PAGE ----------------

    setText("heroTitle", translations[lang].heroTitle);

    setText("heroText", translations[lang].heroText);

    setText("orderNowText", translations[lang].orderNow);

    setText("menuTitle", translations[lang].menuTitle);
setText("menuSubtitle", translations[lang].menuSubtitle);

setText("morningMenu", translations[lang].morningMenu);
setText("morningTime", translations[lang].morningTime);

setText("eveningMenu", translations[lang].eveningMenu);
setText("eveningTime", translations[lang].eveningTime);

setText("dosaText", translations[lang].dosa);
setText("puriText", translations[lang].puri);
setText("rotiText", translations[lang].roti);

    

    // ---------------- ORDER PAGE ----------------

    setText("orderTitle", translations[lang].orderTitle);
setHTML(
    "orderDescription",
    translations[lang].orderDescription
);
    setText("customerDetailsTitle", translations[lang].customerDetails);

    setText("summaryTitle", translations[lang].summary);

    setText("nameLabel", translations[lang].fullName);

    setText("mobileLabel", translations[lang].mobile);

    setText("dateLabel", translations[lang].pickupDate);

    setText("timeLabel", translations[lang].pickupTime);

    setText("instructionLabel", translations[lang].instructions);

    setText("quantityLabel", translations[lang].quantity);
setText("summaryQuantityLabel", translations[lang].quantity);
    setText("priceLabel", translations[lang].price);

    setText("totalLabel", translations[lang].total);

    setText("advanceLabel", translations[lang].advance);

    setText("remainingLabel", translations[lang].remaining);

    setText("continueBtnText", translations[lang].continuePayment);

    setText("backHomeText", translations[lang].backHome);

    setHTML("note1", translations[lang].note1);

    setHTML("note2", translations[lang].note2);

    // ---------------- PLACEHOLDERS ----------------

    setPlaceholder(
        "customerName",
        translations[lang].namePlaceholder
    );

    setPlaceholder(
        "mobileNumber",
        translations[lang].mobilePlaceholder
    );

    setPlaceholder(
        "instructions",
        translations[lang].instructionPlaceholder
    );

    // ---------------- LANGUAGE BUTTON ----------------

    const enBtn = document.getElementById("englishBtn");

    const teBtn = document.getElementById("teluguBtn");

    if(enBtn && teBtn){

        enBtn.classList.remove("active");

        teBtn.classList.remove("active");

        if(lang === "en"){

            enBtn.classList.add("active");

        }else{

            teBtn.classList.add("active");

        }

    }

}
// ==========================================
// BUTTON EVENTS
// ==========================================

const englishBtn = document.getElementById("englishBtn");

const teluguBtn = document.getElementById("teluguBtn");

if(englishBtn){

    englishBtn.addEventListener("click", function(){

        changeLanguage("en");

    });

}

if(teluguBtn){

    teluguBtn.addEventListener("click", function(){

        changeLanguage("te");

    });

}

// ==========================================
// LOAD SAVED LANGUAGE
// ==========================================

const savedLanguage =
localStorage.getItem("language") || "en";

changeLanguage(savedLanguage);