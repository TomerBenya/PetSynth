const API_BASE = 'http://localhost:8787';
let currentToken = null;
let pets = [];

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  currentToken = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  // Require authentication
  if (!currentToken) {
    window.location.href = '/login';
    return;
  }

  // Display username
  if (username) {
    document.getElementById('username-display').textContent = 'Welcome, ' + username;
  }

  // Load pets
  loadPets();
});

function showError(msg) {
  const el = document.getElementById('error');
  el.textContent = msg;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
  document.getElementById('error').style.display = 'none';
}

function showLoading() {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('pet-grid').style.display = 'none';
  document.getElementById('empty-state').style.display = 'none';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('pet-grid').style.display = 'grid';
}

window.handleLogout = function() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = '/login';
}

window.handleSearch = function(event) {
  event.preventDefault();
  const query = document.getElementById('search-input').value;

  // Update URL with query parameter
  const url = new URL(window.location);
  if (query.trim()) {
    url.searchParams.set('q', query);
  } else {
    url.searchParams.delete('q');
  }
  window.history.pushState({}, '', url);

  // Reload pets
  loadPets();
}

window.clearSearch = function() {
  // Clear search input
  document.getElementById('search-input').value = '';

  // Remove query parameter from URL
  const url = new URL(window.location);
  url.searchParams.delete('q');
  window.history.pushState({}, '', url);

  // Reload pets
  loadPets();
}

async function loadPets() {
  hideError();
  showLoading();

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q') || '';

  const url = new URL(API_BASE + '/api/pets');
  if (query) {
    url.searchParams.set('q', query);
  }

  try {
    // No auth header required for GET /api/pets
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Failed to fetch pets');
    }

    const data = await res.json();
    pets = data.items || [];

    hideLoading();

    if (pets.length === 0) {
      document.getElementById('empty-state').style.display = 'block';
      document.getElementById('pet-grid').innerHTML = '';
    } else {
      document.getElementById('empty-state').style.display = 'none';
      renderPets(pets);
    }
  } catch (err) {
    hideLoading();
    showError('Failed to load pets. Please try again.');
    console.error('Error loading pets:', err);
  }
}

function renderPets(pets) {
  const grid = document.getElementById('pet-grid');
  grid.innerHTML = '';

  pets.forEach(pet => {
    const card = createPetCard(pet);
    grid.appendChild(card);
  });
}

function createPetCard(pet) {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.cssText = 'display: flex; flex-direction: column; height: 100%; transition: transform 0.2s, box-shadow 0.2s;';

  card.onmouseenter = function() {
    this.style.transform = 'translateY(-4px)';
    this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  };

  card.onmouseleave = function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
  };

  const priceFormatted = '$' + ((pet.priceCents || 0) / 100).toFixed(2);
  const petName = pet.name || 'Unnamed Pet';
  const petSpecies = pet.species || 'Unknown species';
  const imageAlt = petName + ' — ' + petSpecies;

  card.innerHTML = `
    <a href="/pet/${pet.id}" style="text-decoration: none; color: inherit; flex: 1; display: flex; flex-direction: column;">
      <div style="width: 100%; padding-top: 75%; position: relative; background-color: #f3f4f6; border-radius: 0.5rem 0.5rem 0 0; overflow: hidden;">
        <img
          src="${pet.imageUrl || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(petName)}"
          alt="${imageAlt}"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"
          onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'"
        />
      </div>
      <div style="padding: 1rem; flex: 1; display: flex; flex-direction: column;">
        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.125rem; font-weight: 600; color: #111827;">
          ${petName}
        </h3>
        <p style="margin: 0 0 0.75rem 0; font-size: 0.875rem; color: #6b7280;">
          ${petSpecies}
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
          <span style="font-size: 1.125rem; font-weight: 700; color: #2563eb;">
            ${priceFormatted}
          </span>
          <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; background: #dbeafe; color: #1e40af; border-radius: 0.25rem; text-transform: capitalize;">
            ${pet.status || 'seed'}
          </span>
        </div>
      </div>
    </a>
  `;

  // Add "Add to My Store" button if user is logged in
  if (currentToken) {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'padding: 0 1rem 1rem 1rem;';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add to My Store';
    addButton.className = 'btn btn-primary';
    addButton.style.cssText = 'width: 100%; padding: 0.75rem;';
    addButton.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      handleAddToStore(pet.id, addButton);
    };

    buttonContainer.appendChild(addButton);
    card.appendChild(buttonContainer);
  }

  return card;
}

async function handleAddToStore(petId, button) {
  if (!currentToken) {
    showError('Please log in to add pets to your store');
    return;
  }

  // Disable button and show loading state
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Adding...';
  button.style.opacity = '0.6';
  button.style.cursor = 'not-allowed';

  try {
    const res = await fetch(API_BASE + '/api/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + currentToken
      },
      body: JSON.stringify({ petId })
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        showError('Session expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }
      throw new Error(data.error || 'Failed to add pet to store');
    }

    // Success! Update button to show success state
    button.textContent = '✓ Added to Store';
    button.style.backgroundColor = '#16a34a';
    button.style.opacity = '1';

    // Optionally reload the page after a short delay
    setTimeout(() => {
      loadPets();
    }, 1000);

  } catch (err) {
    // Re-enable button on error
    button.disabled = false;
    button.textContent = originalText;
    button.style.opacity = '1';
    button.style.cursor = 'pointer';

    showError(err.message || 'Failed to add pet to store. Please try again.');
    console.error('Error adding pet to store:', err);
  }
}
