const API = "http://127.0.0.1:5000/api/menu";

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

    // Active button

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
        src="http://127.0.0.1:5000/uploads/${item.image}"
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
            onclick="location.href='order.html?id=${item.id}'">
            🛒 Order Now
        </button>

    </div>

</div>
`;

    });

    document.getElementById("menuList").innerHTML = html;

}