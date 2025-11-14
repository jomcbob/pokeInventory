const pool = require("./pool");
require("dotenv").config();

async function dbGetAllPokemon() {
  try {
    const { rows } = await pool.query("SELECT * FROM pokemon_cards");
    return rows;
  } catch (err) {
    console.error(err)
    return []
  }
}

async function dbGetCardByName(name) {
  try {
    const { rows } = await pool.query("SELECT * FROM pokemon_cards WHERE name = $1", [name]);
    return rows || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function dbGetAllTeams() {
  const getTeamsSQL = `
SELECT
  t.trainer,
  COALESCE(
    json_agg(
      json_build_object(
        'name', p.name,
        'types', p.types,
        'sprite', p.sprite,
        'stage', p.stage
      )
    ) FILTER (WHERE p.id IS NOT NULL),
    '[]'
  ) AS team,
  t.created_at AS team_created_at
FROM teams t
LEFT JOIN team_pokemons tp ON t.id = tp.team_id
LEFT JOIN pokemon_cards p ON tp.pokemon_id = p.id
GROUP BY t.id
ORDER BY t.id;

`;

  try {
    const { rows } = await pool.query(getTeamsSQL);
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function addTrainer(trainerName) {
  const client = await pool.connect();
  try {
    // Check if a trainer with the same name (case-insensitive) already exists
    const result = await client.query(
      `SELECT 1 FROM teams WHERE LOWER(trainer) = LOWER($1)`,
      [trainerName]
    );

    if (result.rowCount === 0) {
      await client.query(
        `INSERT INTO teams (trainer) VALUES ($1)`,
        [trainerName]
      );
    } else {
      console.log(`Trainer "${trainerName}" already exists.`);
      return false
    }
  } finally {
    client.release();
  }
}


async function checkIfTeamIsFull(trainerName) {
  const client = await pool.connect();
  const countRes = await client.query(
    `SELECT COUNT(*) AS count FROM team_pokemons 
   WHERE team_id = (SELECT id FROM teams WHERE LOWER(trainer) = LOWER($1))`,
    [trainerName]
  );
  const currentCount = parseInt(countRes.rows[0].count, 10);

  console.log(`DEBUG: Team ${trainerName} has ${currentCount} Pokémon`);

  if (currentCount >= 6) {
    console.log(`Team ${trainerName} already has 6 Pokémon. Cannot add more.`);
    return true
  }
  return false
}

async function addPokemonToTeam(trainerName, pokemonName) {
  console.log("Function called with:", trainerName, pokemonName);
  const client = await pool.connect();
  try {
    // Get trainer ID
    const teamRes = await client.query(`SELECT id FROM teams WHERE LOWER(trainer) = LOWER($1)`, [trainerName]);
    if (!teamRes.rows[0]) throw new Error("Trainer not found");
    const teamId = teamRes.rows[0].id;

    // Get Pokémon ID from pokemon_cards
    console.log('pokemon name' + " " + pokemonName)
    const pokeRes = await client.query(`SELECT id FROM pokemon_cards WHERE LOWER(name) = LOWER($1)`, [pokemonName]);
    if (!pokeRes.rows[0]) throw new Error("Pokémon not found");
    const pokeId = pokeRes.rows[0].id;

    // Insert into join table
    await client.query(
      `INSERT INTO team_pokemons (team_id, pokemon_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [teamId, pokeId]
    );

    console.log(`Added ${pokemonName} to ${trainerName}'s team.`);
  } finally {
    client.release();
  }
}

async function dbGetRandomPokemonName(req, res) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT name FROM pokemon_cards ORDER BY RANDOM() LIMIT 1;`,
    );
    return rows[0].name
  } finally {
    client.release();
  }
}

async function deleteTeam(trainerName) {
  const client = await pool.connect();
  try {
    return await client.query(
      `DELETE FROM teams WHERE LOWER(trainer) = LOWER($1)`,
      [trainerName]
    );

  } finally {
    client.release();
  }
}

async function lastPokemonOnTeamDeleted(trainerName) {
  const client = await pool.connect();
  try {
    const countRes = await client.query(
      `SELECT COUNT(*) AS count FROM team_pokemons 
      WHERE team_id = (SELECT id FROM teams WHERE LOWER(trainer) = LOWER($1))`,
      [trainerName]
    );
    const currentCount = parseInt(countRes.rows[0].count, 10);
    return currentCount === 0;
  } finally {
    client.release();
  }
}

async function deletePokemonFromTeam(trainerName, pokemonName) {
  const client = await pool.connect();
  try {
    return await client.query(
      `
      DELETE FROM team_pokemons tp
      USING teams t, pokemon_cards pc
      WHERE tp.team_id = t.id
        AND tp.pokemon_id = pc.id
        AND LOWER(t.trainer) = LOWER($1)
        AND LOWER(pc.name) = LOWER($2)
      `,
      [trainerName, pokemonName]
    );
  } finally {
    client.release();
  }
}

async function dbGetPokemonTeam(trainerName) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `
      SELECT p.*
      FROM pokemon_cards p
      JOIN team_pokemons tp ON p.id = tp.pokemon_id
      JOIN teams t ON tp.team_id = t.id
      WHERE LOWER(t.trainer) = LOWER($1)
      `,
      [trainerName]
    );
    return rows;
  } finally {
    client.release();
  }
}


module.exports = {
  dbGetAllPokemonNames: dbGetAllPokemon,
  dbGetCardByName,
  dbGetAllTeams,
  addPokemonToTeam,
  addTrainer,
  checkIfTeamIsFull,
  dbGetRandomPokemonName,
  deleteTeam,
  deletePokemonFromTeam,
  dbGetPokemonTeam,
  lastPokemonOnTeamDeleted
};