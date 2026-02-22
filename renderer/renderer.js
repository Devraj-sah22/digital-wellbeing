import Chart from "../node_modules/chart.js/auto/auto.js";

window.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const currentAppEl = document.getElementById("currentApp");

  const barCtx = document.getElementById("barChart");
  const pieCtx = document.getElementById("pieChart");

  let barChart, pieChart;

  function initCharts() {
    barChart = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [{
          label: "Time (seconds)",
          data: []
        }]
      },
      options: {
        responsive: true,
        animation: { duration: 400 }
      }
    });

    pieChart = new Chart(pieCtx, {
      type: "pie",
      data: {
        labels: [],
        datasets: [{
          data: []
        }]
      },
      options: {
        responsive: true,
        animation: { duration: 400 }
      }
    });
  }

  initCharts();

  startBtn.addEventListener("click", () => {
    console.log("🖱 Button clicked in renderer");
    window.api.startTracking();
    startBtn.innerText = "Tracking...";
    startBtn.disabled = true;
  });

  window.api.onUsageUpdate((data) => {
    currentAppEl.innerText = data.currentApp || "None";

    const apps = Object.keys(data.appUsage);
    const times = apps.map(app => Number(data.appUsage[app].toFixed(1)));

    barChart.data.labels = apps;
    barChart.data.datasets[0].data = times;
    barChart.update();

    pieChart.data.labels = apps;
    pieChart.data.datasets[0].data = times;
    pieChart.update();
  });
});