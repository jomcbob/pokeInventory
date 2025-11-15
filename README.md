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

*(Other tables like Trainer or Type can be added if needed, depending on app complexity.)*

---

## Database Schema - Pokémon Management App

### Tables and Relationships

#### pokemon_cards
| Field           | Type        | Description                     |
|-----------------|------------|---------------------------------|
| id              | SERIAL PK  | Unique identifier               |
| name            | VARCHAR    | Pokémon card name               |
| type_id         | INT FK     | References `types.id`           |
| trainer_id      | INT FK     | References `trainers.id` (optional) |
| hp              | INT        | Pokémon hit points              |
| attack          | INT        | Pokémon attack stat             |
| defense         | INT        | Pokémon defense stat            |
| created_at      | TIMESTAMP  | Record creation time            |
| updated_at      | TIMESTAMP  | Record update time              |

#### types
| Field           | Type        | Description                     |
|-----------------|------------|---------------------------------|
| id              | SERIAL PK  | Unique identifier               |
| name            | VARCHAR    | Pokémon type (e.g., Fire, Water)|
| description     | TEXT       | Type description (optional)     |
| created_at      | TIMESTAMP  | Record creation time            |
| updated_at      | TIMESTAMP  | Record update time              |

#### trainers
| Field           | Type        | Description                     |
|-----------------|------------|---------------------------------|
| id              | SERIAL PK  | Unique identifier               |
| name            | VARCHAR    | Trainer name                     |
| created_at      | TIMESTAMP  | Record creation time            |
| updated_at      | TIMESTAMP  | Record update time              |

### Relationships
- Each `pokemon_card` **must belong to one `type`** (one-to-many).  
- Each `trainer` **can have multiple `pokemon_cards`** (one-to-many).  
- Deleting a `type` or `trainer` may require cascading rules or custom logic for associated `pokemon_cards`.

---

## Routes & Controllers
- **Read Views:**  
  - View all categories  
  - View individual item  

- **Create/Update Actions:**  
  - Forms and controllers for adding new Pokémon cards  
  - Updating existing cards  

- **Delete Actions:**  
  - Decide behavior when deleting a category with items:  
    - Delete all items in the category?  
    - Remove category reference from items?  
    - Custom behavior based on app requirements  

---

## Additional Steps
1. Add dummy data to the local database via script.  
2. Repeat dummy data setup when deploying.  
3. Deploy the app and showcase the project.  

---

## Extra Credit
- Improve the UI design to make it visually appealing.  
- Protect destructive actions (delete/update) with a secret admin password until user authentication is implemented.
