const API_BASE = 'http://localhost:8787';
let currentToken = null;
let pets = [];

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  currentToken = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  // Check if user is logged in
  if (!currentToken) {
    showLoginRequired();
    return;
  }

  // Display username
  if (username) {
    document.getElementById('username-display').textContent = 'Welcome, ' + username;
  }

  // Load store pets
  loadStore();
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

function showLoginRequired() {
  document.getElementById('login-required').style.display = 'block';
  document.getElementById('loading').style.display = 'none';
  document.getElementById('pet-grid').style.display = 'none';
  document.getElementById('empty-state').style.display = 'none';
}

function showLoading() {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('login-required').style.display = 'none';
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

async function loadStore() {
  hideError();
  showLoading();

  try {
    const res = await fetch(API_BASE + '/api/store', {
      headers: {
        'Authorization': 'Bearer ' + currentToken
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        showLoginRequired();
        return;
      }
      throw new Error('Failed to fetch store');
    }

    const data = await res.json();
    pets = data || [];

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
    showError('Failed to load your store. Please try again.');
    console.error('Error loading store:', err);
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
        </div>
      </div>
    </a>
  `;

  // Add Remove button
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'padding: 0 1rem 1rem 1rem;';

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.className = 'btn';
  removeButton.style.cssText = 'width: 100%; padding: 0.75rem; background-color: #dc2626; color: white; border: none;';
  removeButton.onmouseover = function() {
    this.style.backgroundColor = '#b91c1c';
  };
  removeButton.onmouseout = function() {
    this.style.backgroundColor = '#dc2626';
  };
  removeButton.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    handleRemove(pet.id, removeButton);
  };

  buttonContainer.appendChild(removeButton);
  card.appendChild(buttonContainer);

  return card;
}

async function handleRemove(petId, button) {
  if (!currentToken) {
    showError('Please log in to remove pets');
    return;
  }

  // Confirm removal
  if (!confirm('Are you sure you want to remove this pet from your store?')) {
    return;
  }

  // Disable button and show loading state
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Removing...';
  button.style.opacity = '0.6';
  button.style.cursor = 'not-allowed';

  try {
    const res = await fetch(API_BASE + '/api/store/' + petId, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + currentToken
      }
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
      throw new Error(data.error || 'Failed to remove pet');
    }

    // Success! Refresh the store
    loadStore();

  } catch (err) {
    // Re-enable button on error
    button.disabled = false;
    button.textContent = originalText;
    button.style.opacity = '1';
    button.style.cursor = 'pointer';

    showError(err.message || 'Failed to remove pet. Please try again.');
    console.error('Error removing pet:', err);
  }
}
