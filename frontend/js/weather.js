const LAT = 14.93, LON = 120.82;
let live = null;

const $ = (id) => document.getElementById(id);

async function loadLive() {
  $("weather-status").textContent = "Loading...";
  $("save-weather-btn").disabled = true;

  try {
    const r = await fetch(`/api/external/weather?lat=${LAT}&lon=${LON}`);
    if (!r.ok) throw new Error();
    const data = await r.json();

    const c = data.current || {};
    $("temp").textContent = c.temperature_2m ?? "--";
    $("wind").textContent = c.wind_speed_10m ?? "--";
    $("rain").textContent = c.precipitation ?? "--";
    $("fetchedAt").textContent = c.time ? new Date(c.time).toLocaleString() : new Date().toLocaleString();

    live = {
      location: "Candaba, Pampanga",
      latitude: LAT,
      longitude: LON,
      temperature: c.temperature_2m ?? null,
      windSpeed: c.wind_speed_10m ?? null,
      precipitation: c.precipitation ?? null,
      fetchedAt: c.time ? new Date(c.time) : new Date(),
      apiSource: "open-meteo"
    };

    $("weather-status").textContent = "Live weather loaded.";
    $("save-weather-btn").disabled = false;
  } catch {
    $("weather-status").textContent = "Failed to load weather.";
    live = null;
  }
}

async function loadSaved() {
  const ul = $("saved-weather-list");
  ul.innerHTML = "<li>Loading...</li>";

  const r = await fetch("/api/weather-snapshots");
  if (!r.ok) return (ul.innerHTML = "<li>Failed to load.</li>");

  const items = await r.json();
  if (!items.length) return (ul.innerHTML = "<li>No saved records yet.</li>");

  ul.innerHTML = items.map(x => `
    <li>
      ${x.location || "Location"} — ${x.temperature ?? "--"}°C
      <button data-id="${x._id}">Delete</button>
    </li>
  `).join("");

  ul.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", async () => {
      await fetch(`/api/weather-snapshots/${btn.dataset.id}`, { method: "DELETE" });
      loadSaved();
    });
  });
}

async function saveLive() {
  if (!live) return;
  await fetch("/api/weather-snapshots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(live)
  });
  loadSaved();
}

document.addEventListener("DOMContentLoaded", () => {
  $("save-weather-btn").addEventListener("click", saveLive);
  loadLive();
  loadSaved();
});
