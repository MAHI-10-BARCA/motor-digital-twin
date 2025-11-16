// static/dashboard.js

let tempVibChart;
let currentSpeedChart;

function initCharts() {
  const tempVibCtx = document.getElementById("tempVibChart").getContext("2d");
  const currentSpeedCtx = document
    .getElementById("currentSpeedChart")
    .getContext("2d");

  tempVibChart = new Chart(tempVibCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Temperature (°C)",
          data: [],
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Vibration (mm/s)",
          data: [],
          borderWidth: 2,
          borderDash: [5, 4],
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "#e5e7eb" },
        },
      },
      scales: {
        x: {
          ticks: { color: "#9ca3af" },
        },
        y: {
          ticks: { color: "#9ca3af" },
        },
      },
    },
  });

  currentSpeedChart = new Chart(currentSpeedCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Current (A)",
          data: [],
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Speed (RPM)",
          data: [],
          borderWidth: 2,
          borderDash: [5, 4],
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "#e5e7eb" },
        },
      },
      scales: {
        x: {
          ticks: { color: "#9ca3af" },
        },
        y: {
          ticks: { color: "#9ca3af" },
        },
      },
    },
  });
}

async function fetchLatest() {
  try {
    const res = await fetch("/api/latest");
    const json = await res.json();
    if (!json.ok) return;

    const d = json.data;

    document.getElementById("temp-value").textContent = d.temp.toFixed(2);
    document.getElementById("vibration-value").textContent =
      d.vibration.toFixed(2);
    document.getElementById("current-value").textContent =
      d.current.toFixed(2);
    document.getElementById("speed-value").textContent = d.speed.toFixed(1);
    document.getElementById("baseline-score").textContent =
      d.baseline_score.toFixed(3);
    document.getElementById("fault-class").textContent = d.fault_class;

    // Set fault badge
    const badge = document.getElementById("fault-status-badge");
    if (d.fault_class === "Normal") {
      badge.textContent = "Normal";
      badge.style.background = "#16a34a33";
      badge.style.color = "#4ade80";
    } else {
      badge.textContent = d.fault_class;
      badge.style.background = "#b91c1c33";
      badge.style.color = "#fca5a5";
    }

    // Motor animation speed + color mapping
    const rotor = document.getElementById("motor-rotor");
    rotor.classList.remove("motor-fast", "motor-danger");
    if (d.speed > 1450 || d.vibration > 6 || d.temp > 95) {
      rotor.classList.add("motor-danger");
    } else if (d.speed > 1425 || d.vibration > 4 || d.temp > 85) {
      rotor.classList.add("motor-fast");
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchHistory() {
  try {
    const res = await fetch("/api/history");
    const json = await res.json();
    if (!json.ok) return;

    const data = json.data;

    const labels = data.map((d) =>
      new Date(d.timestamp).toLocaleTimeString("en-IN", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
    const temps = data.map((d) => d.temp);
    const vibes = data.map((d) => d.vibration);
    const currents = data.map((d) => d.current);
    const speeds = data.map((d) => d.speed);

    tempVibChart.data.labels = labels;
    tempVibChart.data.datasets[0].data = temps;
    tempVibChart.data.datasets[1].data = vibes;
    tempVibChart.update();

    currentSpeedChart.data.labels = labels;
    currentSpeedChart.data.datasets[0].data = currents;
    currentSpeedChart.data.datasets[1].data = speeds;
    currentSpeedChart.update();
  } catch (err) {
    console.error(err);
  }
}

function initExportButton() {
  const btn = document.getElementById("export-btn");
  btn.addEventListener("click", () => {
    window.location.href = "/export/csv";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCharts();
  initExportButton();
  fetchLatest();
  fetchHistory();

  // Polling for live updates
  setInterval(fetchLatest, 3000);
  setInterval(fetchHistory, 5000);
});
