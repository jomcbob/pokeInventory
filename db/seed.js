const pool = require('./pool');
require("dotenv").config();

async function ensurePokemon_cardsTable() {
  const client = await pool.connect();
  try {
    await client.query(`
    CREATE TABLE IF NOT EXISTS pokemon_cards (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    types TEXT[],
    sprite TEXT,
    stage INT,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);

    console.log('pokemon_cards Table ensured.');
  } finally {
    client.release();
  }
}

async function getStage(name) {
    if (name.includes('-')) {
    console.log(`Skipping alternate form: ${name}`);
    return
  }
  
  const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
  if (!speciesRes.ok) {
    console.warn(`Skipping stage fetch for ${name} (species not found)`);
    return null;
  }

  const speciesData = await speciesRes.json();

  const evoRes = await fetch(speciesData.evolution_chain.url);
  if (!evoRes.ok) {
    console.warn(`Skipping evolution chain for ${name} (not found)`);
    return null;
  }

  const evoData = await evoRes.json();

  let stage = 0;
  let current = evoData.chain;
  while (current) {
    if (current.species.name === name.toLowerCase()) break;
    if (current.evolves_to.length > 0) {
      current = current.evolves_to.find(evo => evo.species.name === name.toLowerCase()) || current.evolves_to[0];
      stage++;
    } else {
      break;
    }
  }

  return stage;
}

async function getPokemonData(name) {

  if (name.includes('-')) {
    console.log(`Skipping alternate form: ${name}`);
    return
  }
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!res.ok) throw new Error(`Pokémon not found: ${name}`);

    const data = await res.json();

    const stage = await getStage(name);

    const result = {
      name: data.name,
      types: data.types.map(t => t.type.name),
      sprite: data.sprites.front_default,
      stage: stage,
    };

    await insertPokemon(result)
    return result
  } catch (err) {
    console.error(err);
  }
}

async function insertPokemon(p) {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO pokemon_cards (name, types, sprite, stage)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (name) DO NOTHING`,
      [p.name, p.types, p.sprite, p.stage]
    );
    console.log(`Inserted ${p.name} into database.`);
  } finally {
    client.release();
  }
}

async function fetchAllPokemon() {
  await ensurePokemon_cardsTable()

  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1302');
  const data = await res.json();
  const all = data.results.map(p => p.name);

  const batchSize = 20;
  for (let i = 0; i < all.length; i += batchSize) {
    const batch = all.slice(i, i + batchSize);
    console.log(`Processing batch ${i / batchSize + 1} (${i + 1}-${i + batch.length})`);
    await Promise.all(batch.map(name => getPokemonData(name)));
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('✅ Done importing all Pokémon.');
  return await client.end();
}

fetchAllPokemon();