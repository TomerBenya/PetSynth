const API_BASE = 'http://localhost:8787';
let currentToken = localStorage.getItem('token');

// Get petId from the URL path
const pathParts = window.location.pathname.split('/');
const petId = pathParts[pathParts.length - 1];

// Load pet details on page load
window.addEventListener('DOMContentLoaded', () => {
  // Require authentication
  if (!currentToken) {
    window.location.href = '/login';
    return;
  }

  loadPetDetail();
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
  document.getElementById('pet-detail').style.display = 'none';
  document.getElementById('not-found').style.display = 'none';
}

function showNotFound() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('pet-detail').style.display = 'none';
  document.getElementById('not-found').style.display = 'block';
}

function showDetail() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('pet-detail').style.display = 'block';
  document.getElementById('not-found').style.display = 'none';
}

async function loadPetDetail() {
  hideError();
  showLoading();

  try {
    const res = await fetch(API_BASE + '/api/pets/' + petId);

    if (!res.ok) {
      if (res.status === 404) {
        showNotFound();
        return;
      }
      throw new Error('Failed to load pet details');
    }

    const pet = await res.json();
    renderPetDetail(pet);
    showDetail();

  } catch (err) {
    showError('Failed to load pet details. Please try again.');
    console.error('Error loading pet:', err);
    document.getElementById('loading').style.display = 'none';
  }
}

function renderPetDetail(pet) {
  const container = document.getElementById('pet-detail');
  const petName = pet.name || 'Unnamed Pet';
  const petSpecies = pet.species || 'Unknown species';
  const imageAlt = petName + ' — ' + petSpecies;
  const priceFormatted = '$' + ((pet.priceCents || 0) / 100).toFixed(2);

  let traits = [];
  try {
    traits = pet.traitsJson ? JSON.parse(pet.traitsJson) : [];
  } catch (e) {
    traits = [];
  }

  const careInstructions = pet.careInstructions || 'No care instructions available.';

  container.innerHTML = `
    <div class="card" style="padding: 0; overflow: hidden;">
      <div style="width: 100%; max-height: 500px; overflow: hidden; background: #f3f4f6;">
        <img
          src="${pet.imageUrl || 'https://via.placeholder.com/800x600?text=' + encodeURIComponent(petName)}"
          alt="${imageAlt}"
          style="width: 100%; height: auto; object-fit: cover;"
          onerror="this.src='https://via.placeholder.com/800x600?text=No+Image'"
        />
      </div>

      <div style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="margin: 0 0 0.5rem 0; font-size: 2rem; font-weight: 700;">${petName}</h1>
            <p style="margin: 0; font-size: 1.125rem; color: #6b7280;">${petSpecies}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0 0 0.5rem 0; font-size: 2rem; font-weight: 700; color: #2563eb;">${priceFormatted}</p>
            <span style="font-size: 0.875rem; padding: 0.25rem 0.75rem; background: #dbeafe; color: #1e40af; border-radius: 0.25rem; text-transform: capitalize;">
              ${pet.status || 'seed'}
            </span>
          </div>
        </div>

        ${traits.length > 0 ? `
          <div style="margin-bottom: 1.5rem;">
            <h3 style="margin: 0 0 0.75rem 0; font-size: 1.125rem; font-weight: 600;">Traits</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${traits.map(trait => `
                <span style="padding: 0.5rem 1rem; background: #f3f4f6; border-radius: 0.5rem; font-size: 0.875rem; color: #374151;">
                  ${trait}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${pet.description ? `
          <div style="margin-bottom: 1.5rem;">
            <h3 style="margin: 0 0 0.75rem 0; font-size: 1.125rem; font-weight: 600;">Description</h3>
            <p style="margin: 0; line-height: 1.6; color: #374151;">${pet.description}</p>
          </div>
        ` : ''}

        <div style="margin-bottom: 1.5rem;">
          <h3 style="margin: 0 0 0.75rem 0; font-size: 1.125rem; font-weight: 600;">Care Instructions</h3>
          <pre style="margin: 0; white-space: pre-wrap; font-family: inherit; line-height: 1.6; color: #374151;">${careInstructions}</pre>
        </div>

        ${currentToken ? `
          <button id="add-to-store-btn" onclick="handleAddToStore()" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.125rem;">
            Add to My Store
          </button>
        ` : `
          <p style="text-align: center; color: #6b7280; margin: 1rem 0;">
            <a href="/login" class="btn btn-primary" style="display: inline-block;">Log in to add to your store</a>
          </p>
        `}
      </div>
    </div>
  `;
}

window.handleAddToStore = async function() {
  if (!currentToken) {
    showError('Please log in to add pets to your store');
    return;
  }

  const button = document.getElementById('add-to-store-btn');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Adding...';
  button.style.opacity = '0.6';

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

    button.textContent = '✓ Added to Store';
    button.style.backgroundColor = '#16a34a';
    button.style.opacity = '1';

    setTimeout(() => {
      window.location.href = '/store';
    }, 1500);

  } catch (err) {
    button.disabled = false;
    button.textContent = originalText;
    button.style.opacity = '1';
    showError(err.message || 'Failed to add pet to store. Please try again.');
    console.error('Error adding pet:', err);
  }
}
