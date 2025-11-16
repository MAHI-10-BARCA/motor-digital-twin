// static/app.js

let tempChart, vibChart, currChart, speedChart;

function createLineChart(ctx, label) {
    return new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderWidth: 2,
                tension: 0.25,
                borderColor: "#38bdf8"
            }]
        },
        options: {
            responsive: true,
            animation: false,
            plugins: { legend: { display: false } }
        }
    });
}

async function fetchData() {
    try {
        const res = await fetch("/api");
        const data = await res.json();

        const latest = data.latest;
        const history = data.history || [];

        // ====== TOP CARDS ======
        document.getElementById("tempValue").innerText =
            latest.temp.toFixed(2) + " °C";

        document.getElementById("vibValue").innerText =
            latest.vibration.toFixed(2) + " mm/s";

        document.getElementById("currValue").innerText =
            latest.current.toFixed(2) + " A";

        document.getElementById("speedValue").innerText =
            latest.speed.toFixed(0) + " RPM";

        document.getElementById("healthValue").innerText =
            latest.health.toFixed(1);

        document.getElementById("faultLabel").innerText =
            latest.fault_class;

        document.getElementById("ai-advice").innerText =
            latest.advice;

        // ====== CHART DATA ======
        const labels = history.map(p =>
            new Date(p.timestamp * 1000).toLocaleTimeString()
        );

        const temps = history.map(p => p.temp);
        const vibs = history.map(p => p.vibration);
        const currents = history.map(p => p.current);
        const speeds = history.map(p => p.speed);

        if (!tempChart) {
            tempChart = createLineChart(document.getElementById("tempChart"), "Temperature");
            vibChart  = createLineChart(document.getElementById("vibChart"), "Vibration");
            currChart = createLineChart(document.getElementById("currChart"), "Current");
            speedChart= createLineChart(document.getElementById("speedChart"), "Speed");
        }

        tempChart.data.labels = labels;
        tempChart.data.datasets[0].data = temps;
        tempChart.update();

        vibChart.data.labels = labels;
        vibChart.data.datasets[0].data = vibs;
        vibChart.update();

        currChart.data.labels = labels;
        currChart.data.datasets[0].data = currents;
        currChart.update();

        speedChart.data.labels = labels;
        speedChart.data.datasets[0].data = speeds;
        speedChart.update();

    } catch (err) {
        console.error("API error:", err);
    }
}

// Run every 1 sec
fetchData();
setInterval(fetchData, 1000);
