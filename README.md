# Pokémon Management Inventory Project
**Course:** [The Odin Project - Node.js Inventory Application](https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application)

## Assignment Overview
Set up an Express project and a new PostgreSQL database. Before starting, define all database tables, fields, and their relationships.

### Example References
- **Game management app**  
  - Entities: Game, Genre, Developer  
  - Relationships:  
    - A game can have one or multiple developers and genres.  
    - A developer can develop multiple games.  

- **Pokémon management app**  
  - Entities: Pokémon, Trainer, Type  
  - Relationships:  
    - Each Pokémon must belong to a type.  
    - A trainer can have multiple Pokémon.  

> Any sufficient inventory app will require defined relations and constraints between its entities.

---

## My Project Plan
I decided to create a **Pokémon Management App**.

### Database Tables
1. **pokemon_cards**  
   - Populated via script from [PokeAPI](https://pokeapi.co/)  
   - Stores all Pokémon card data  
   - Stores `id` to connect to `team_pokemons`

2. **team_pokemons**  
   - Stores `id` of card and `id` of trainer  

3. **teams**  
   - Stores trainer  
   - Stores `id` to connect to `team_pokemons`

---

## Database Schema - Pokémon Management App

### pokemon_cards
| Field      | Type       | Description                |
|-----------|-----------|----------------------------|
| id        | SERIAL PK | Unique identifier          |
| name      | TEXT      | Pokémon card name          |
| types     | TEXT[]    | Pokémon types (1–2)       |
| sprite    | TEXT      | Pokémon sprite URL         |
| stage     | INT       | Evolution stage            |
| created_at| TIMESTAMP | Record creation time       |

CREATE TABLE IF NOT EXISTS pokemon_cards (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    types TEXT[],
    sprite TEXT,
    stage INT,
    created_at TIMESTAMP DEFAULT NOW()
);

### teams
| Field      | Type       | Description                |
|-----------|-----------|----------------------------|
| id        | SERIAL PK | Unique identifier          |
| trainer   | TEXT      | Trainer name (unique)      |
| created_at| TIMESTAMP | Record creation time       |

CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    trainer TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

### team_pokemons
| Field       | Type   | Description                         |
|------------|--------|-------------------------------------|
| team_id    | INT FK | References `teams.id`               |
| pokemon_id | INT FK | References `pokemon_cards.id`       |

CREATE TABLE IF NOT EXISTS team_pokemons (
    team_id INT REFERENCES teams(id) ON DELETE CASCADE,
    pokemon_id INT REFERENCES pokemon_cards(id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, pokemon_id)
);

### Relationships
- Each `pokemon_card` **can belong to one or two types**.  
- Each `trainer` **can have up to six `pokemon_cards`**.  
- Deleting a `trainer` deletes all the Pokémon cards in that team.

---

## Routes & Controllers
- Currently only one route: **teams**  
- As the app grows and new categories are added, the file structure allows easy expansion.

---

## Additional Steps
1. Add dummy data to the local database via scripts:  
   - One script pulls all Pokémon from PokeAPI.  
   - Another script creates starter teams.  
2. Repeat dummy data setup when deploying (both remote and local scripts exist).  
3. Deploy the app and showcase the project: [Live Site](https://pokeinventory.up.railway.app)

---

## Extra Credit
- Improved UI design; this is the best UI I’ve made so far.  
- Protected destructive actions (delete/update) with a secret admin password.  
- Adding teams and Pokémon is still open to anyone for convenience.

