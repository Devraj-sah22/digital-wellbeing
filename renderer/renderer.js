// renderer/renderer.js
// Chart is loaded globally from chart.min.js

window.addEventListener("DOMContentLoaded", () => {
  console.log("Renderer loaded");

  const startBtn = document.getElementById("startBtn");
  const currentAppEl = document.getElementById("currentApp");

  const barCanvas = document.getElementById("barChart");
  const pieCanvas = document.getElementById("pieChart");

  // ✅ Initialize charts AFTER DOM is ready
  const barChart = new Chart(barCanvas, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Time (seconds)",
          data: [],
          backgroundColor: "rgba(56, 189, 248, 0.7)"
        }
      ]
    },
    options: {
      responsive: true,
      animation: { duration: 400 },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  const pieChart = new Chart(pieCanvas, {
    type: "pie",
    data: {
      labels: [],
      datasets: [
        {
          data: []
        }
      ]
    },
    options: {
      responsive: true,
      animation: { duration: 400 }
    }
  });

  // ✅ Start tracking button (NOW IT WILL WORK)
  startBtn.addEventListener("click", () => {
    console.log("🖱 Start Tracking clicked");
    window.api.startTracking();
    startBtn.innerText = "Tracking...";
    startBtn.disabled = true;
  });

  // ✅ Receive real-time updates
  window.api.onUsageUpdate((data) => {
    currentAppEl.innerText = data.currentApp || "None";

    const apps = Object.keys(data.appUsage);
    const times = apps.map(app =>
      Number(data.appUsage[app].toFixed(1))
    );

    barChart.data.labels = apps;
    barChart.data.datasets[0].data = times;
    barChart.update();

    pieChart.data.labels = apps;
    pieChart.data.datasets[0].data = times;
    pieChart.update();
  });
});