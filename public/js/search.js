document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('caughtPokemon');
  const searchMatches = document.getElementById('searchMatches');

  const showPokemonThatMatchSearch = (search) => {
    return pokemons.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  };

input.addEventListener("input", (e) => {
  const value = e.target.value.trim();

  if (!value) {
    searchMatches.innerHTML = "";
    return;
  }

  const matches = showPokemonThatMatchSearch(value);
  searchMatches.innerHTML = "";

  const fragment = document.createDocumentFragment();

  matches.forEach((p) => {
    const container = document.createElement("div");
    container.className = "match"; // give it a class so you can style

    const text = document.createElement("div");
    text.textContent = p.name;

    const img = document.createElement("img");
    img.src = p.sprite;

    container.append(text, img);
    container.tabIndex = 0;

    container.onclick = () => {
      input.value = p.name;
      searchMatches.innerHTML = "";
      input.focus();
    };

    container.onkeydown = (ev) => {
      if (ev.key === "Enter") container.click();
    };

    fragment.appendChild(container);
  });

  searchMatches.appendChild(fragment);
});

});
