const express = require("express");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");

const dbPath = path.join(__dirname, "cricketTeam.db");

const app = express();

app.use(express.json());

let db = null;

const initializeDBandServer = async () => {
  try {
    db = await open({
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

const convertToCamelCaseFun = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getQuery = `
      SELECT *
      FROM
      cricket_team;`;
  const playerList = await db.all(getQuery);
  response.send(
    playerList.map((eachPlayer) => convertToCamelCaseFun(eachPlayer))
  );
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getSingleQuery = `
      SELECT *
      FROM
      cricket_team
      WHERE
      player_id = ${playerId};`;
  const player = await db.get(getSingleQuery);
  response.send(convertToCamelCaseFun(player));
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const PostQuery = `
    INSERT INTO
    cricket_team (player_name,jersey_number,role)
    VALUES ('${playerName}',${jerseyNumber},'${role}');`;
  const responseObj = await db.run(PostQuery);
  response.send("player Added to Team");
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updateQuery = `
  UPDATE
  cricket_team
  SET

  player_name='${playerName}',
  jersey_number=${jerseyNumber},
  role='${role}'
  WHERE
  player_id = ${playerId};`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
    cricket_team
    WHERE player_id=${playerId}
    `;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
