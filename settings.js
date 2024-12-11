// Character Management UI

let characters = [];
let editingCharacterId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadCharacters();
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById('addCharacter').addEventListener('click', () => showModal());
  document.getElementById('cancelEdit').addEventListener('click', hideModal);
  document.getElementById('characterForm').addEventListener('submit', handleCharacterSubmit);
  
  // Setup trait input handling
  const traitInput = document.querySelector('.trait-input');
  traitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTrait(e.target.value);
      e.target.value = '';
    }
  });
}

function loadCharacters() {
  chrome.storage.sync.get('characters', (data) => {
    characters = data.characters || [];
    renderCharacterList();
  });
}

function renderCharacterList() {
  const container = document.getElementById('characterList');
  container.innerHTML = '';
  
  characters.forEach(char => {
    const card = createCharacterCard(char);
    container.appendChild(card);
  });
}

function createCharacterCard(character) {
  const card = document.createElement('div');
  card.className = 'character-card';
  
  card.innerHTML = `
    <div class="character-header">
      <div class="character-name">${character.name}</div>
      <div class="character-actions">
        <button class="btn secondary" onclick="editCharacter('${character.id}')">Edit</button>
        <button class="btn danger" onclick="deleteCharacter('${character.id}')">Delete</button>
      </div>
    </div>
    <div class="character-tone">Tone: ${character.tone}</div>
    <div class="traits-container">
      ${character.traits.map(trait => `<span class="trait-tag">${trait}</span>`).join('')}
    </div>
    <div class="patterns-container">
      <small>Response Patterns:</small>
      <ul>
        ${character.responsePatterns.map(pattern => `<li>${pattern}</li>`).join('')}
      </ul>
    </div>
  `;
  
  return card;
}

function showModal(characterId = null) {
  editingCharacterId = characterId;
  const modal = document.getElementById('characterModal');
  const form = document.getElementById('characterForm');
  const title = document.getElementById('modalTitle');
  
  if (characterId) {
    const character = characters.find(c => c.id === characterId);
    title.textContent = 'Edit Character';
    populateForm(character);
  } else {
    title.textContent = 'Add Character';
    form.reset();
    document.getElementById('traitsList').innerHTML = '';
  }
  
  modal.classList.remove('hidden');
}

function hideModal() {
  document.getElementById('characterModal').classList.add('hidden');
  editingCharacterId = null;
}

function populateForm(character) {
  document.getElementById('charName').value = character.name;
  document.getElementById('charTone').value = character.tone;
  
  const traitsList = document.getElementById('traitsList');
  traitsList.innerHTML = '';
  character.traits.forEach(trait => addTrait(trait));
  
  document.getElementById('patterns').value = character.responsePatterns.join('\n');
}

function addTrait(trait) {
  if (!trait.trim()) return;
  
  const traitsList = document.getElementById('traitsList');
  const traitElement = document.createElement('span');
  traitElement.className = 'trait-tag';
  traitElement.innerHTML = `
    ${trait}
    <button type="button" onclick="this.parentElement.remove()" class="trait-remove">&times;</button>
  `;
  traitsList.appendChild(traitElement);
}

function handleCharacterSubmit(e) {
  e.preventDefault();
  
  const formData = {
    id: editingCharacterId || generateId(),
    name: document.getElementById('charName').value,
    tone: document.getElementById('charTone').value,
    traits: Array.from(document.getElementById('traitsList').children)
      .map(t => t.textContent.trim()),
    responsePatterns: document.getElementById('patterns').value
      .split('\n')
      .filter(p => p.trim())
  };
  
  if (editingCharacterId) {
    const index = characters.findIndex(c => c.id === editingCharacterId);
    characters[index] = formData;
  } else {
    characters.push(formData);
  }
  
  saveCharacters();
  hideModal();
}

function editCharacter(characterId) {
  showModal(characterId);
}

function deleteCharacter(characterId) {
  if (confirm('Are you sure you want to delete this character?')) {
    characters = characters.filter(c => c.id !== characterId);
    saveCharacters();
  }
}

function saveCharacters() {
  chrome.storage.sync.set({ characters }, () => {
    renderCharacterList();
  });
}

function generateId() {
  return 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Handle trait removal
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('trait-remove')) {
    e.target.parentElement.remove();
  }
});