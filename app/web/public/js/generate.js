const API_BASE = 'http://localhost:8787';
let currentToken = null;

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  currentToken = localStorage.getItem('token');

  // Check if user is logged in
  if (!currentToken) {
    document.getElementById('login-required').style.display = 'block';
    return;
  }

  document.getElementById('generate-form').style.display = 'block';
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

window.handleGenerate = async function(event) {
  event.preventDefault();
  hideError();

  const prompt = document.getElementById('prompt').value.trim();
  if (!prompt) {
    showError('Please enter a description for your pet');
    return;
  }

  const generateBtn = document.getElementById('generate-btn');
  const originalText = generateBtn.textContent;
  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  document.getElementById('generating').style.display = 'block';
  document.getElementById('pet-preview').style.display = 'none';

  try {
    const res = await fetch(API_BASE + '/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + currentToken
      },
      body: JSON.stringify({ prompt })
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
      throw new Error(data.error || 'Failed to generate pet');
    }

    document.getElementById('generating').style.display = 'none';
    renderPetPreview(data.draft);

  } catch (err) {
    document.getElementById('generating').style.display = 'none';
    showError(err.message || 'Failed to generate pet. Please try again.');
    console.error('Error generating pet:', err);
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = originalText;
  }
}

function renderPetPreview(draft) {
  // Store draft globally so handleAccept can access it
  window.currentDraft = draft;

  const container = document.getElementById('pet-preview');
  const petName = draft.name || 'Unnamed Pet';
  const petSpecies = draft.species || 'Unknown species';
  const priceFormatted = '$' + ((draft.priceCents || 0) / 100).toFixed(2);

  let traits = [];
  try {
    traits = draft.traits || [];
  } catch (e) {
    traits = [];
  }

  container.innerHTML = `
    <div class="card" style="padding: 0; overflow: hidden;">
      <div style="width: 100%; max-height: 400px; overflow: hidden; background: #f3f4f6;">
        <img
          src="${draft.imageUrl || 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(petName)}"
          alt="${petName} — ${petSpecies}"
          style="width: 100%; height: auto; object-fit: cover;"
          onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'"
        />
      </div>

      <div style="padding: 2rem;">
        <h2 style="margin: 0 0 0.5rem 0; font-size: 1.75rem; font-weight: 700;">${petName}</h2>
        <p style="margin: 0 0 1rem 0; font-size: 1.125rem; color: #6b7280;">${petSpecies}</p>

        ${traits.length > 0 ? `
          <div style="margin-bottom: 1.5rem;">
            <h3 style="margin: 0 0 0.75rem 0; font-size: 1rem; font-weight: 600;">Traits</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${traits.map(trait => `
                <span style="padding: 0.5rem 1rem; background: #f3f4f6; border-radius: 0.5rem; font-size: 0.875rem; color: #374151;">
                  ${trait}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${draft.description ? `
          <div style="margin-bottom: 1.5rem;">
            <h3 style="margin: 0 0 0.75rem 0; font-size: 1rem; font-weight: 600;">Description</h3>
            <p style="margin: 0; line-height: 1.6; color: #374151;">${draft.description}</p>
          </div>
        ` : ''}

        <div style="margin-bottom: 1.5rem;">
          <p style="margin: 0; font-size: 1.5rem; font-weight: 700; color: #2563eb;">${priceFormatted}</p>
        </div>

        <div style="display: flex; gap: 1rem;">
          <button onclick="handleAccept()" class="btn btn-primary" style="flex: 1;">
            Accept & Add to Store
          </button>
          <button onclick="handleRegenerate()" class="btn">
            Try Again
          </button>
        </div>
      </div>
    </div>
  `;

  container.style.display = 'block';
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

window.handleAccept = async function() {
  if (!window.currentDraft) {
    showError('No pet to accept');
    return;
  }

  hideError();

  try {
    const res = await fetch(API_BASE + '/api/generate/accept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + currentToken
      },
      body: JSON.stringify(window.currentDraft)
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
      throw new Error(data.error || 'Failed to save pet');
    }

    // Success! Redirect to store
    showError('Pet accepted! Redirecting to your store...');
    setTimeout(() => {
      window.location.href = '/store';
    }, 1500);

  } catch (err) {
    showError(err.message || 'Failed to save pet. Please try again.');
    console.error('Error accepting pet:', err);
  }
}

window.handleRegenerate = function() {
  document.getElementById('pet-preview').style.display = 'none';
  document.getElementById('prompt').focus();
}
