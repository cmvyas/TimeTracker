document.addEventListener("DOMContentLoaded", () => {
  const ticketInput = document.getElementById("ticket-number");
  const timeInput = document.getElementById("time-minutes");
  const addTimeButton = document.getElementById("add-time");
  const totalTimeDisplay = document.getElementById("total-time");
  const statusBarFill = document.getElementById("status-bar-fill");
  const statusText = document.getElementById("status-text");
  const clearButton = document.getElementById("clear-time");

  let totalMinutes = JSON.parse(localStorage.getItem("totalMinutes")) || 0;
  let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

  const updateUI = () => {
    totalTimeDisplay.textContent = `Total Time: ${totalMinutes} minutes`;
    let status = "Low";
    let fillPercentage = (totalMinutes / 420) * 100;

    if (totalMinutes >= 301 && totalMinutes < 420) {
      status = "Almost There";
    } else if (totalMinutes >= 101 && totalMinutes < 300) {
      status = "Medium";
    } else if (totalMinutes >= 0 && totalMinutes <= 100) {
      status = "Low";
    } else if (totalMinutes >= 420) {
      status = "Goal Achieved";
      fillPercentage = 100;
    }

    statusBarFill.style.width = `${fillPercentage}%`;
    statusText.textContent = `Status: ${status}`;
  };

  updateUI();

  addTimeButton.addEventListener("click", () => {
    const ticketNumber = ticketInput.value.trim();
    const timeMinutes = parseInt(timeInput.value);

    if (ticketNumber && timeMinutes > 0) {
      const now = new Date();
      const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
      const date = now.toLocaleDateString();

      tickets.push({ ticket: ticketNumber, time: timeMinutes, weekday, date });
      totalMinutes += timeMinutes;

      localStorage.setItem("tickets", JSON.stringify(tickets));
      localStorage.setItem("totalMinutes", JSON.stringify(totalMinutes));

      ticketInput.value = "";
      timeInput.value = "";
      updateUI();
    }
  });

  clearButton.addEventListener("click", () => {
    totalMinutes = 0;
    tickets = [];

    localStorage.setItem("tickets", JSON.stringify(tickets));
    localStorage.setItem("totalMinutes", JSON.stringify(totalMinutes));

    updateUI();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addTimeButton.click();
    } else if (event.key === "Delete") {
      clearButton.click();
    }
  });
});
