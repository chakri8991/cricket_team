const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
const { open } = require("sqlite");
let db = null;
const initializeDBandServer = async () => {
  try {
    let db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running");
    });
  } catch (e) {
    console.log(`db error :${e.message}`);
    process.exit(1);
  }
};
initializeDBandServer();
app.get("/players/", async (request, response) => {
  const getQuery = `
      SELECT *
      FROM
      cricket_team;`;
  const playerList = await db.get(getQuery);
  response.send(playerList);
});
