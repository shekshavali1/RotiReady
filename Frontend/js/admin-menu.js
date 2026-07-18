const API = "http://127.0.0.1:5000/api/menu";

loadMenu();

function loadMenu(){

fetch(API)

.then(res=>res.json())

.then(data=>{

let html="";

data.menu.forEach(item=>{

html+=`

<tr>

<td>${item.id}</td>

<td>
<img
src="http://127.0.0.1:5000/uploads/${item.image}">
</td>

<td>${item.item_name}</td>

<td>₹${item.price}</td>

<td>${item.category}</td>

<td>${item.status}</td>

<td>

<button onclick="editMenu(${item.id})">
Edit
</button>

<button
style="background:red"
onclick="deleteMenu(${item.id})">

Delete

</button>

</td>

</tr>

`;

});

document.getElementById("menuTable").innerHTML=html;

});

}
function deleteMenu(id){

    if(!confirm("Delete this menu item?")){
        return;
    }

    fetch(API + "/" + id,{

        method:"DELETE"

    })

    .then(res=>res.json())

    .then(data=>{

        alert(data.message);

        loadMenu();

    })

    .catch(err=>console.log(err));

}
function editMenu(id) {

    // Find selected item
    const item = document.querySelectorAll("#menuTable tr")[id - 1];

    const item_name = prompt("Food Name");
    if (item_name === null) return;

    const price = prompt("Price");
    if (price === null) return;

    const category = prompt("Morning / Evening");
    if (category === null) return;

    const status = prompt("Available / Unavailable");
    if (status === null) return;

    const formData = new FormData();

    formData.append("item_name", item_name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("status", status);

    // keep old image
    formData.append("old_image", "");

    fetch(API + "/" + id, {
        method: "PUT",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);

        if (data.success) {
            alert(data.message);
            loadMenu();
        } else {
            alert(data.message);
        }
    })
    .catch(err => {
        console.error(err);
        alert("Update Failed");
    });

}
function addMenu() {

    const formData = new FormData();

    formData.append("item_name", document.getElementById("itemName").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("category", document.getElementById("category").value);
    formData.append("status", document.getElementById("status").value);

    const image = document.getElementById("image").files[0];

    if (image) {
        formData.append("image", image);
    }

    fetch(API, {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {

        alert(data.message);

        loadMenu();

    })
    .catch(err => {

        console.error(err);

    });

}