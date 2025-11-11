const pool = require('./pool');
const { addPokemonToTeam, addTrainer } = require("./queries")
require("dotenv").config();

async function ensureTeamsTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        trainer TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Teams table ensured.');
  } finally {
    client.release();
  }
}

async function ensureTeamPokemonsTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_pokemons (
        team_id INT REFERENCES teams(id) ON DELETE CASCADE,
        pokemon_id INT REFERENCES pokemon_cards(id) ON DELETE CASCADE,
        PRIMARY KEY (team_id, pokemon_id)
      );
    `);
    console.log('team_pokemons table ensured.');
  } finally {
    client.release();
  }
}

async function makeTeam(trainer, team) {
  await ensureTeamsTable();
  await ensureTeamPokemonsTable();
  await addTrainer(trainer);

  for (const pokemonName of team) {
    await addPokemonToTeam(trainer, pokemonName);
  }

  console.log(`${trainer}'s team initialized: ${team.join(", ")}`);
}

(async () => {
  await makeTeam("Ash", ["Pikachu", "Bulbasaur"]);
  await makeTeam("Bob", ["parasect", "victreebel"]);
  await addPokemonToTeam("Ash", "Charizard");
})();
