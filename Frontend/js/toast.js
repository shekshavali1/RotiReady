function showToast(message, type = "success") {

    let bgColor = "#28a745"; // Success (Green)

    if (type === "error") {
        bgColor = "#dc3545"; // Red
    } else if (type === "warning") {
        bgColor = "#ffc107"; // Yellow
    } else if (type === "info") {
        bgColor = "#007bff"; // Blue
    }

    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
            background: bgColor,
            borderRadius: "10px",
            fontWeight: "600"
        }
    }).showToast();
}