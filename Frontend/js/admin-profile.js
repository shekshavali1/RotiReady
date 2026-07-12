// ==========================================
// SSV HOTEL ADMIN PROFILE
// ==========================================

// Elements

const profileImage = document.getElementById("profileImage");
const profilePreview = document.getElementById("profilePreview");

const adminName = document.getElementById("adminName");
const adminEmail = document.getElementById("adminEmail");
const adminPhone = document.getElementById("adminPhone");

const currentPassword =
document.getElementById("currentPassword");

const newPassword =
document.getElementById("newPassword");

const confirmPassword =
document.getElementById("confirmPassword");

const joinedDate =
document.getElementById("joinedDate");

const lastLogin =
document.getElementById("lastLogin");

const saveProfile =
document.getElementById("saveProfile");

const resetProfile =
document.getElementById("resetProfile");

const showPassword =
document.getElementById("showPassword");

// ==========================================
// LOAD PROFILE
// ==========================================

window.onload = function(){

    adminName.value =
    localStorage.getItem("adminName") || "";

    adminEmail.value =
    localStorage.getItem("adminEmail") || "";

    adminPhone.value =
    localStorage.getItem("adminPhone") || "";

    currentPassword.value =
    localStorage.getItem("adminPassword") || "";

    const image =
    localStorage.getItem("adminProfileImage");

    if(image){

        profilePreview.src = image;

    }

    // Joined Date

    if(!localStorage.getItem("joinedDate")){

        const today =
        new Date().toLocaleDateString();

        localStorage.setItem(
            "joinedDate",
            today
        );

    }

    joinedDate.value =
    localStorage.getItem("joinedDate");

    // Last Login

    const loginTime =
    new Date().toLocaleString();

    lastLogin.value = loginTime;

};
// ==========================================
// PROFILE IMAGE UPLOAD
// ==========================================

profileImage.addEventListener("change", function(){

    const file = this.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        profilePreview.src = e.target.result;

        localStorage.setItem(
            "adminProfileImage",
            e.target.result
        );

    };

    reader.readAsDataURL(file);

});


// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

showPassword.addEventListener("change", function(){

    const type = this.checked ? "text" : "password";

    currentPassword.type = type;
    newPassword.type = type;
    confirmPassword.type = type;

});


// ==========================================
// SAVE PROFILE
// ==========================================

saveProfile.addEventListener("click", function(){

    if(
        adminName.value.trim()==="" ||
        adminEmail.value.trim()==="" ||
        adminPhone.value.trim()===""
    ){

        alert("Please fill all fields.");

        return;

    }

    if(
        newPassword.value !== "" &&
        newPassword.value !== confirmPassword.value
    ){

        alert("New Password and Confirm Password do not match.");

        return;

    }

    localStorage.setItem(
        "adminName",
        adminName.value
    );

    localStorage.setItem(
        "adminEmail",
        adminEmail.value
    );

    localStorage.setItem(
        "adminPhone",
        adminPhone.value
    );

    if(newPassword.value !== ""){

        localStorage.setItem(
            "adminPassword",
            newPassword.value
        );

    }

    alert("✅ Profile Updated Successfully!");

});


// ==========================================
// RESET PROFILE
// ==========================================

resetProfile.addEventListener("click", function(){

    if(confirm("Reset all profile information?")){

        adminName.value="";
        adminEmail.value="";
        adminPhone.value="";

        currentPassword.value="";
        newPassword.value="";
        confirmPassword.value="";

        profilePreview.src="images/profile.png";

        localStorage.removeItem("adminName");
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("adminPhone");
        localStorage.removeItem("adminPassword");
        localStorage.removeItem("adminProfileImage");

        alert("Profile Reset Successfully.");

    }

});