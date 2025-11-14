document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('caughtPokemon');
  const searchMatches = document.getElementById('searchMatches');

  const showPokemonThatMatchSearch = (search) => {
    return pokemons.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  };

  input.addEventListener('input', (e) => {
    if (e.target.value === '') {
      searchMatches.innerHTML = ''
      return
    }
    const matches = showPokemonThatMatchSearch(e.target.value);
    searchMatches.innerHTML = ''

    matches.forEach(p => {
      const container = document.createElement('div');
      const text = document.createElement('div');
      const img = document.createElement('img');

      img.src = p.sprite

      text.textContent = p.name;

      container.onclick = () => {
        e.target.value = p.name; 
        searchMatches.innerHTML = '';
        input.focus();
      }

      container.appendChild(text)
      container.appendChild(img)
      searchMatches.appendChild(container);
    });
  });
});
