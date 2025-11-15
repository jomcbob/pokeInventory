this is an assiment for the invetory project on the odin project course https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application
the assinment was 
Set up an Express project and a new PostgreSQL database.
Before you begin, take a moment to write down all of the database tables and its fields you’ll need, as well as the relations between them. For example:
In a game management app, there can be a game, genre, and developer entity. A game can have one or multiple developers and genres. Similarly a developer can develop multiple games.
In a pokemon management app, there can be a pokemon, trainer and a type entity. Each pokemon must be contained in a type. While a trainer can have multiple pokemons.
Any sufficient inventory app will have relations and constraints against its entities. Figure out these database particulars for your inventory app.

here i decided i was going to do a pokemon mangement app i have three db tabls pokemon_cards which i have a script that pulls all of those cards from pokeapi https://pokeapi.co/
and fills table

Set up the routes and controllers you’re going to need.
Create all of the ‘READ’ views (i.e. view category, and view item).
Create all the forms and build out the controllers you need for the create and update actions.
Figure out the delete functionality. What happens if you try to delete a category with items in it? Should it delete all the items as well? Should it just remove the category from the items? Or something else? This specific behavior will depend on your app’s requirements.
Once you’re confident with your project, add dummy data via a script to your local database. Do this again when you deploy.
Deploy it and show off what you’ve done!
Extra credit
Make it pretty!
We will learn about creating users with secure passwords in a later lesson, but for now we don’t want just anyone to be able to delete and edit items in our inventory! Figure out how to protect destructive actions (like deleting and updating) by making users enter a secret admin password to confirm the action.
