document.addEventListener("DOMContentLoaded", () => {
  const reportTableBody = document.querySelector("#report-table tbody");
  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  const dayWiseTotal = {};

  tickets.forEach((entry) => {
    const row = document.createElement("tr");
    const ticketCell = document.createElement("td");
    const timeCell = document.createElement("td");
    const dateCell = document.createElement("td");

    ticketCell.textContent = entry.ticket;
    timeCell.textContent = entry.time;
    dateCell.textContent = `${entry.weekday}, ${entry.date}`;

    row.appendChild(ticketCell);
    row.appendChild(timeCell);
    row.appendChild(dateCell);
    reportTableBody.appendChild(row);

    // Calculate day-wise total
    if (!dayWiseTotal[entry.weekday]) {
      dayWiseTotal[entry.weekday] = 0;
    }
    dayWiseTotal[entry.weekday] += entry.time;
  });

  const totalTimeSummary = document.getElementById("total-time-summary");
  totalTimeSummary.innerHTML = "";
  for (const day in dayWiseTotal) {
    const p = document.createElement("p");
    p.textContent = `${day}: ${dayWiseTotal[day]} minutes`;
    totalTimeSummary.appendChild(p);
  }

  const downloadButton = document.getElementById("download-report");

  downloadButton.addEventListener("click", () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Ticket Number,Time (minutes),Weekday,Date\n" +
      tickets
        .map((e) => `${e.ticket},${e.time},${e.weekday},${e.date}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "weekly_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
