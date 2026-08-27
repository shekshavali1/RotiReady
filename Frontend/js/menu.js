const API = "https://rotiready-production-9cd6.up.railway.app/api/menu";

let allMenu = [];

// Load menu when page opens
loadMenu();

function loadMenu() {

    fetch(API)
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                allMenu = data.menu;

                filterMenu("Morning");

            } else {

                alert(data.message);

            }

        })
        .catch(err => console.log(err));

}

// ===============================
// FILTER MENU
// ===============================

function filterMenu(category) {

    document.querySelectorAll(".menu-tab").forEach(btn => {

        btn.classList.remove("active");

        if (btn.textContent.includes(category)) {

            btn.classList.add("active");

        }

    });

    let html = "";

    const menu = allMenu.filter(item => item.category === category);

    if (menu.length === 0) {

        html = `
            <h3 style="text-align:center;width:100%;">
                No Menu Available
            </h3>
        `;
    }

    menu.forEach(item => {

        html += `
        <div class="food-card">

            <img
                src="${
                    item.image
                    ? `https://rotiready-production-9cd6.up.railway.app/uploads/${item.image}`
                    : 'images/no-image.png'
                }"
                class="food-image"
                alt="${item.item_name}">

            <div class="food-content">

                <h3 class="food-name">
                    ${item.item_name}
                </h3>

                <div class="food-price">
                    ₹${item.price}
                </div>

                <button
                    class="order-btn"
                    onclick="selectItem('${item.item_name}', ${item.price})">
                    🛒 Order Now
                </button>

            </div>

        </div>
        `;

    });

    document.getElementById("menuList").innerHTML = html;

}

// ===============================
// SELECT ITEM
// ===============================

function selectItem(name, price) {

    const selectedItem = {
        name: name,
        price: price
    };

    localStorage.setItem(
        "selectedItem",
        JSON.stringify(selectedItem)
    );

    window.location.href = "order.html";

}