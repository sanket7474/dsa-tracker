// netlify/functions/data.js
//
// CommonJS Netlify Function (matches this repo's "type": "commonjs" in
// package.json — same require/exports style as server.js).
//
// Replaces GET/PUT /api/data for production on Netlify, using Netlify Blobs
// instead of data/data.json on local disk (which doesn't persist on
// serverless platforms).
//
// Local dev is untouched — keep using `npm start` exactly as you do now.
// This function only runs once deployed to Netlify. Netlify serves classic
// functions like this at /.netlify/functions/data — netlify.toml has a
// redirect so your frontend can keep calling /api/data unchanged.

const { connectLambda, getStore } = require("@netlify/blobs");

// Your real, pre-filled data — bundled straight from the repo at build time.
// esbuild (Netlify's function bundler) follows this require() and packages
// data/data.json into the function, so the actual 161 problems you already
// have locally become the seed data here too, instead of blank phases.
const seedData = require("../../data/data.json");

const STORE_NAME = "dsa-tracker-data";
const KEY = "progress";

exports.handler = async (event) => {
  // Required in classic CommonJS ("Lambda compatibility") functions —
  // without this, getStore() below has no way to know which site/store
  // to talk to, and throws MissingBlobsEnvironmentError in production.
  connectLambda(event);

  const store = getStore(STORE_NAME);

  if (event.httpMethod === "GET") {
    let data = await store.get(KEY, { type: "json" });
    if (!data || !data.phases) {
      // First run / empty store — seed it from your actual data.json
      // content (bundled in at build time), not a blank shape.
      data = seedData;
      await store.setJSON(KEY, data);
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  }

  if (event.httpMethod === "PUT") {
    let incoming;
    try {
      incoming = JSON.parse(event.body || "{}");
    } catch {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid JSON body" }),
      };
    }

    if (!incoming || typeof incoming !== "object" || !incoming.phases) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Expected { phases: {...} }" }),
      };
    }

    try {
      await store.setJSON(KEY, incoming);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: true }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: String(err) }),
      };
    }
  }

  return { statusCode: 405, body: "Method not allowed" };
};