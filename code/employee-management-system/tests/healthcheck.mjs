const base = process.env.API_URL || "http://localhost:5000";
const response = await fetch(base + "/api/health");
if (!response.ok) throw new Error("Health endpoint returned HTTP " + response.status);
const result = await response.json();
if (result.status !== "ok") throw new Error("Unexpected health response");
console.log("EMS API health check passed:", result);
