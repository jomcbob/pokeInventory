const pool = require("./pool");
require("dotenv").config();

async function dbGetAllCards() {
  try {
    const { rows } = await pool.query("SELECT * FROM pokemon_cards");
    console.log(rows)
    return rows;
  } catch (err) {
    console.error(err)
    return []
  }
}

async function dbGetCardByName(name) {
  try {
    const { rows } = await pool.query("SELECT * FROM pokemon_cards WHERE name = $1", [name]);
    console.log(rows)
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
  json_agg(
    json_build_object(
      'name', p.name,
      'types', p.types,
      'sprite', p.sprite,
      'stage', p.stage
    )
  ) AS team,
  t.created_at AS team_created_at
FROM teams t
JOIN team_pokemons tp ON t.id = tp.team_id
JOIN pokemon_cards p ON tp.pokemon_id = p.id
GROUP BY t.id
ORDER BY t.id;
`;

  try {
    const { rows } = await pool.query(getTeamsSQL);
    console.log(JSON.stringify(rows, null, 2));
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function addTrainer(trainerName) {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO teams (trainer) VALUES ($1) ON CONFLICT (trainer) DO NOTHING`,
      [trainerName]
    );
  } finally {
    client.release();
  }
}

async function checkIfTeamIsFull(trainerName) {
  const client = await pool.connect();
  const countRes = await client.query(`SELECT id FROM teams WHERE LOWER(trainer) = LOWER($1)`, [trainerName]);
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



module.exports = {
  dbGetAllCards,
  dbGetCardByName,
  dbGetAllTeams,
  addPokemonToTeam,
  addTrainer,
  checkIfTeamIsFull
};