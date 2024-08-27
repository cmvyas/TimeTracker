document.addEventListener("DOMContentLoaded", function () {
  const page = document.location.pathname;

  if (page.includes("index.html")) {
    // Daily tracker page
    const addButton = document.getElementById("addButton");
    const clearButton = document.getElementById("clearButton");
    const addNumberInput = document.getElementById("addNumberInput");
    const totalOutput = document.getElementById("totalOutput");
    const statusFill = document.getElementById("statusFill");
    const statusLabel = document.getElementById("statusLabel");

    let currentTotal = parseFloat(localStorage.getItem("currentTotal")) || 0;
    updateTotalOutput();
    updateStatusBar();
    updateWeeklyData();

    addButton.addEventListener("click", function () {
      console.log("Add button clicked"); // Debugging statement
      const numberToAdd = parseFloat(addNumberInput.value);
      if (!isNaN(numberToAdd)) {
        currentTotal += numberToAdd;
        localStorage.setItem("currentTotal", currentTotal);
        updateTotalOutput();
        updateStatusBar();
        updateWeeklyData();
        addNumberInput.value = ""; // Clear input field
      } else {
        alert("Please enter a valid number");
      }
    });

    clearButton.addEventListener("click", function () {
      console.log("Clear button clicked"); // Debugging statement
      currentTotal = 0;
      localStorage.setItem("currentTotal", currentTotal);
      updateTotalOutput();
      updateStatusBar();
      updateWeeklyData();
    });

    addNumberInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        addButton.click();
      }
    });

    function updateTotalOutput() {
      totalOutput.textContent = `Total: ${currentTotal}`;
    }

    function updateStatusBar() {
      const statusLow = 100;
      const statusMedium = 230;
      const statusAlmostThere = 300;
      const statusMaximum = 420;

      let status = "Low";
      const fillWidth = (currentTotal / statusMaximum) * 100; // Percentage width

      statusFill.style.width = `${fillWidth}%`;

      if (currentTotal >= statusLow && currentTotal < statusMedium) {
        status = "Low";
      } else if (
        currentTotal >= statusMedium &&
        currentTotal < statusAlmostThere
      ) {
        status = "Way to go";
      } else if (
        currentTotal >= statusAlmostThere &&
        currentTotal < statusMaximum
      ) {
        status = "Almost There";
      } else if (currentTotal >= statusMaximum) {
        status = "All set for day";
      }

      statusLabel.textContent = `Status: ${status}`;
    }

    function updateWeeklyData() {
      const weeklyData = JSON.parse(localStorage.getItem("weeklyData")) || {};
      const today = new Date();
      const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

      // Update weekly data with current total for the current day
      weeklyData[dayName] = currentTotal;

      localStorage.setItem("weeklyData", JSON.stringify(weeklyData));
    }
  } else if (page.includes("weekly.html")) {
    // Weekly report page
    const ctx = document.getElementById("weeklyChart").getContext("2d");
    drawWeeklyChart(ctx);

    document
      .getElementById("backToHome")
      .addEventListener("click", function () {
        window.location.href = "index.html";
      });
  }
});

function drawWeeklyChart(ctx) {
  console.log("Drawing weekly chart"); // Debugging statement
  const weeklyData = JSON.parse(localStorage.getItem("weeklyData")) || {};

  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const data = dayNames.map((day) => weeklyData[day] || 0);

  const chart = new Chart(ctx, {
    type: "bar", // Use bar chart type
    data: {
      labels: dayNames,
      datasets: [
        {
          label: "Daily Total",
          data: data,
          backgroundColor: "rgba(83, 109, 254, 0.2)",
          borderColor: "#536493",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  const totalTime = data.reduce((acc, curr) => acc + curr, 0);
  const totalTimeElement = document.getElementById("totalTime");
  const targetComparisonElement = document.getElementById("targetComparison");
  const statusElement = document.getElementById("status");

  totalTimeElement.textContent = `Total Time for the Week: ${totalTime}`;
  targetComparisonElement.textContent = `Target: 2100`;

  const target = 2100;
  if (totalTime >= target) {
    statusElement.textContent = "Status: Achieved Target";
  } else {
    statusElement.textContent = "Status: Below Target";
  }
}
