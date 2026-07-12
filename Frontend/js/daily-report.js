async function loadReport(){

    const response = await fetch(
        "http://127.0.0.1:5000/api/admin/daily-report"
    );

    const result = await response.json();

    if(result.success){

        document.getElementById("reportDate").textContent =
            new Date().toLocaleDateString();

        document.getElementById("totalOrders").textContent =
            result.report.total_orders;

        document.getElementById("totalRotis").textContent =
            result.report.total_rotis;

        document.getElementById("totalRevenue").textContent =
            result.report.total_revenue;

    }else{

        alert(result.message);

    }

}

loadReport();