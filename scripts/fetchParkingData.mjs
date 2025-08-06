import fs from "fs/promises";
import axios from "axios";

const SENSOR_URL =
  "https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/on-street-parking-bay-sensors/records?limit=100";

// Replace this with your real token (you can move it to .env later)
const APP_TOKEN = "470d3ba55962a4b3a7f2383f7fa51b95789eb121422fa9d5ecabe335";

const fetchData = async () => {
  try {
    const res = await axios.get(SENSOR_URL, {
      headers: {
        "X-App-Token": APP_TOKEN,
      },
    });

    const results = res.data.results;

    const parsed = results
      .filter(
        (item) =>
          item.location?.lat && item.location?.lon && item.status_description
      )
      .map((item) => ({
        id: item.kerbsideid,
        status: item.status_description,
        lat: parseFloat(item.location.lat),
        lng: parseFloat(item.location.lon),
        zone: item.zone_number ?? null,
        lastUpdated: item.status_timestamp ?? null,
      }));

    await fs.writeFile("public/db.json", JSON.stringify(parsed, null, 2));
    console.log(`✅ Saved ${parsed.length} parking bays to public/db.json`);
  } catch (err) {
    console.error(
      "❌ Fetch failed:",
      err?.response?.status,
      err?.response?.data || err.message
    );
  }
};

fetchData();
