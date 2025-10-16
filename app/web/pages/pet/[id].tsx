/** @jsxImportSource hono/jsx */
import { Hono } from 'hono';
import { Layout } from '../../../server/views/Layout';

const pet = new Hono();

pet.get('/:id', (c) => {
  const petId = c.req.param('id');

  return c.html(
    <Layout title="Pet Detail - PetSynth">
      <div style="max-width: 900px; margin: 2rem auto; padding: 0 1rem;">
        <div style="margin-bottom: 2rem;">
          <a href="/catalog" style="color: #2563eb; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;">
            ← Back to Catalog
          </a>
        </div>

        {/* Error banner */}
        <div id="error" role="alert" aria-live="assertive" style="display: none;" class="error"></div>

        {/* Loading indicator */}
        <div id="loading" style="text-align: center; padding: 3rem;">
          <p style="color: #6b7280; font-size: 1.125rem;">Loading pet details...</p>
        </div>

        {/* Pet detail content */}
        <div id="pet-detail" style="display: none;">
          {/* Content will be loaded dynamically */}
        </div>

        {/* Not found state */}
        <div id="not-found" style="display: none; text-align: center; padding: 4rem 1rem;">
          <p style="font-size: 1.25rem; margin-bottom: 1rem; color: #6b7280;">Pet not found</p>
          <a href="/catalog" class="btn btn-primary">Browse Catalog</a>
        </div>
      </div>

      <script src="/js/pet-detail.js"></script>
    </Layout>
  );
});

export default pet;
