/*
  Project Version: v1.0.00
  Update: Office whale shark sightings calendar
  Description: Renders the recorded sightings summary and accessible monthly calendar.
  Data note: Add verified office log entries to SIGHTING_RECORDS below. The sightings value counts recorded sighting reports, not unique whale sharks.
  Date: 2026-11-26
*/

(() => {
  const SIGHTING_RECORDS = [
    { date: "2026-11-20", sightings: 1 },
    { date: "2026-11-25", sightings: 1 }
  ];

  const dateFormatter = new Intl.DateTimeFormat("en-PH", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const monthFormatter = new Intl.DateTimeFormat("en-PH", {
    month: "long",
    year: "numeric"
  });
  const sortedRecords = [...SIGHTING_RECORDS].sort((a, b) => a.date.localeCompare(b.date));
  const recordsByDate = new Map(sortedRecords.map((record) => [record.date, record]));
  const latestRecord = sortedRecords[sortedRecords.length - 1] || null;

  function dateFromIso(isoDate) {
    return new Date(`${isoDate}T12:00:00`);
  }

  function formatDate(isoDate) {
    return dateFormatter.format(dateFromIso(isoDate));
  }

  function formatCount(count) {
    return `${count} ${count === 1 ? "sighting" : "sightings"} recorded`;
  }

  function createWhaleSharkMark() {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("viewBox", "0 0 52 32");
    svg.setAttribute("class", "sighting-whale-mark");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    const silhouette = document.createElementNS(svgNamespace, "path");
    silhouette.setAttribute(
      "d",
      "M3 16c5.2-6.8 19.1-9.1 32.7-5.3L46 4l-3.2 9.2L50 16l-7.2 2.8L46 28l-10.3-6.7C22.1 25.1 8.2 22.8 3 16Z"
    );
    svg.append(silhouette);

    const dorsalFin = document.createElementNS(svgNamespace, "path");
    dorsalFin.setAttribute("d", "m18 10.4 4.1-6 5.2 5.5");
    dorsalFin.setAttribute("class", "sighting-whale-fin");
    svg.append(dorsalFin);

    [12, 17, 22, 27, 32].forEach((x, index) => {
      const spot = document.createElementNS(svgNamespace, "circle");
      spot.setAttribute("cx", String(x));
      spot.setAttribute("cy", index % 2 === 0 ? "14" : "17");
      spot.setAttribute("r", "0.9");
      spot.setAttribute("class", "sighting-whale-spot");
      svg.append(spot);
    });

    return svg;
  }

  function initLatestSummary() {
    if (!latestRecord) return;

    document.querySelectorAll("[data-latest-sighting-date]").forEach((element) => {
      element.textContent = formatDate(latestRecord.date);
    });
    document.querySelectorAll("[data-latest-sighting-count]").forEach((element) => {
      element.textContent = formatCount(latestRecord.sightings);
    });
  }

  function initCalendar() {
    const calendar = document.querySelector("[data-sighting-calendar]");
    if (!calendar) return;

    const monthLabel = calendar.querySelector("[data-sighting-month-label]");
    const monthStatus = calendar.querySelector("[data-sighting-month-status]");
    const calendarCaption = calendar.querySelector("[data-sighting-calendar-caption]");
    const calendarGrid = calendar.querySelector("[data-sighting-calendar-grid]");
    const detail = calendar.querySelector("[data-sighting-calendar-detail]");
    const previousButton = calendar.querySelector("[data-sighting-month-previous]");
    const nextButton = calendar.querySelector("[data-sighting-month-next]");

    if (!monthLabel || !calendarGrid || !detail || !previousButton || !nextButton) return;

    const initialDate = latestRecord ? dateFromIso(latestRecord.date) : new Date();
    let visibleMonth = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
    let selectedDate = latestRecord?.date || null;

    function updateSelectedButtons() {
      calendarGrid.querySelectorAll("[data-sighting-date]").forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          button.dataset.sightingDate === selectedDate ? "true" : "false"
        );
      });
    }

    function showRecord(record) {
      selectedDate = record.date;
      detail.textContent = `${formatDate(record.date)}: ${formatCount(record.sightings)}.`;
      updateSelectedButtons();
    }

    function createCalendarDay(day, monthRecords) {
      const cell = document.createElement("td");
      const isoDate = [
        visibleMonth.getFullYear(),
        String(visibleMonth.getMonth() + 1).padStart(2, "0"),
        String(day).padStart(2, "0")
      ].join("-");
      const record = recordsByDate.get(isoDate);

      if (!record) {
        const dayNumber = document.createElement("span");
        dayNumber.className = "sighting-calendar-day-number";
        dayNumber.textContent = String(day);
        cell.append(dayNumber);
        return cell;
      }

      const button = document.createElement("button");
      button.className = "sighting-calendar-day has-sighting";
      button.type = "button";
      button.dataset.sightingDate = isoDate;
      button.setAttribute("aria-label", `${formatDate(isoDate)}: ${formatCount(record.sightings)}`);
      button.setAttribute("aria-pressed", "false");

      const dayNumber = document.createElement("span");
      dayNumber.className = "sighting-calendar-day-number";
      dayNumber.textContent = String(day);

      button.append(dayNumber, createWhaleSharkMark());
      button.addEventListener("pointerenter", () => showRecord(record));
      button.addEventListener("focus", () => showRecord(record));
      button.addEventListener("click", () => showRecord(record));
      cell.append(button);

      monthRecords.push(record);
      return cell;
    }

    function renderMonth() {
      const year = visibleMonth.getFullYear();
      const month = visibleMonth.getMonth();
      const monthName = monthFormatter.format(visibleMonth);
      const firstWeekday = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const monthRecords = [];

      monthLabel.textContent = monthName;
      if (calendarCaption) calendarCaption.textContent = `${monthName} whale shark sighting records`;
      if (monthStatus) monthStatus.textContent = "";
      calendarGrid.replaceChildren();

      const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
      let week = document.createElement("tr");

      for (let cellIndex = 0; cellIndex < totalCells; cellIndex += 1) {
        const day = cellIndex - firstWeekday + 1;

        if (day < 1 || day > daysInMonth) {
          const emptyCell = document.createElement("td");
          emptyCell.className = "sighting-calendar-empty";
          emptyCell.setAttribute("aria-hidden", "true");
          week.append(emptyCell);
        } else {
          week.append(createCalendarDay(day, monthRecords));
        }

        if ((cellIndex + 1) % 7 === 0) {
          calendarGrid.append(week);
          week = document.createElement("tr");
        }
      }

      if (monthStatus) {
        monthStatus.textContent = monthRecords.length
          ? `${monthRecords.length} ${monthRecords.length === 1 ? "date" : "dates"} with recorded sightings.`
          : `No sighting entries are available in the digital log for ${monthName}.`;
      }

      if (monthRecords.length) {
        const selectedRecord =
          monthRecords.find((record) => record.date === selectedDate) || monthRecords[0];
        showRecord(selectedRecord);
      } else {
        selectedDate = null;
        detail.textContent = `No recorded sighting entries are available for ${monthName}.`;
      }
    }

    previousButton.addEventListener("click", () => {
      visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
      renderMonth();
    });
    nextButton.addEventListener("click", () => {
      visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
      renderMonth();
    });

    renderMonth();
  }

  function init() {
    initLatestSummary();
    initCalendar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
