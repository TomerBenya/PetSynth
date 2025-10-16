/** @jsxImportSource hono/jsx */
import { Hono } from 'hono';
import { Layout } from '../../server/views/Layout';

const catalog = new Hono();

catalog.get('/', (c) => {
  // Get search query from URL
  const searchQuery = c.req.query('q') || '';

  return c.html(
    <Layout title="Pet Catalog - PetSynth">
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <h1 style="margin: 0;">Pet Catalog</h1>
          <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <span id="username-display" style="color: #6b7280;"></span>
            <a href="/store" class="btn">My Store</a>
            <button onclick="handleLogout()" class="btn">Logout</button>
          </div>
        </div>

        {/* Search form */}
        <form onsubmit="handleSearch(event); return false;" style="margin-bottom: 2rem;">
          <div style="display: flex; gap: 0.5rem;">
            <label for="search-input" style="position: absolute; left: -10000px; top: auto; width: 1px; height: 1px; overflow: hidden;">
              Search pets by name, species, or description
            </label>
            <input
              type="text"
              id="search-input"
              name="q"
              placeholder="Search..."
              class="form-input"
              style="flex: 1; min-width: 0;"
              value={searchQuery}
            />
            <button type="submit" class="btn btn-primary">
              Search
            </button>
            {searchQuery && (
              <button type="button" onclick="clearSearch()" class="btn">
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Error banner */}
        <div id="error" role="alert" aria-live="assertive" style="display: none;" class="error"></div>

        {/* Loading indicator */}
        <div id="loading" style="text-align: center; padding: 3rem; display: none;">
          <p style="color: #6b7280; font-size: 1.125rem;">Loading pets...</p>
        </div>

        {/* Pet grid */}
        <div
          id="pet-grid"
          style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;"
        >
          {/* Pets will be loaded here dynamically */}
        </div>

        {/* Empty state */}
        <div id="empty-state" style="display: none; text-align: center; padding: 4rem 1rem; color: #6b7280;">
          <p style="font-size: 1.125rem; margin-bottom: 0.5rem;">No pets found</p>
          {searchQuery && (
            <p style="margin-top: 0.5rem;">
              Try a different search term or{' '}
              <button onclick="clearSearch()" style="color: #2563eb; text-decoration: underline; background: none; border: none; cursor: pointer; font-size: inherit;">
                view all pets
              </button>
            </p>
          )}
        </div>
      </div>

      <script src="/js/catalog.js"></script>
    </Layout>
  );
});

export default catalog;
