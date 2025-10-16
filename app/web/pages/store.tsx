/** @jsxImportSource hono/jsx */
import { Hono } from 'hono';
import { Layout } from '../../server/views/Layout';

const store = new Hono();

store.get('/', (c) => {
  return c.html(
    <Layout title="My Store - PetSynth">
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <h1 style="margin: 0;">My Store</h1>
          <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <span id="username-display" style="color: #6b7280;"></span>
            <a href="/catalog" class="btn">Catalog</a>
            <button onclick="handleLogout()" class="btn">Logout</button>
          </div>
        </div>

        {/* Error banner */}
        <div id="error" role="alert" aria-live="assertive" style="display: none;" class="error"></div>

        {/* Login required message */}
        <div id="login-required" style="display: none; text-align: center; padding: 4rem 1rem;">
          <p style="font-size: 1.25rem; margin-bottom: 1rem; color: #6b7280;">
            Please log in to view your store
          </p>
          <a href="/login" class="btn btn-primary">
            Go to Login
          </a>
        </div>

        {/* Loading indicator */}
        <div id="loading" style="text-align: center; padding: 3rem; display: none;">
          <p style="color: #6b7280; font-size: 1.125rem;">Loading your store...</p>
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
          <p style="font-size: 1.25rem; margin-bottom: 1rem;">Your store is empty</p>
          <p style="margin-bottom: 1.5rem;">Add pets from the catalog to get started!</p>
          <a href="/catalog" class="btn btn-primary">
            Browse Catalog
          </a>
        </div>
      </div>

      <script src="/js/store.js"></script>
    </Layout>
  );
});

export default store;
