/** @jsxImportSource hono/jsx */
import { Hono } from 'hono';
import { Layout } from '../../server/views/Layout';

const generate = new Hono();

generate.get('/', (c) => {
  return c.html(
    <Layout title="Generate Pet - PetSynth">
      <div style="max-width: 800px; margin: 2rem auto; padding: 0 1rem;">
        <h1 style="margin-bottom: 2rem;">Generate AI Pet</h1>

        {/* Error banner */}
        <div id="error" role="alert" aria-live="assertive" style="display: none;" class="error"></div>

        {/* Login required message */}
        <div id="login-required" style="display: none; text-align: center; padding: 4rem 1rem;">
          <p style="font-size: 1.25rem; margin-bottom: 1rem; color: #6b7280;">
            Please log in to generate pets
          </p>
          <a href="/login" class="btn btn-primary">
            Go to Login
          </a>
        </div>

        {/* Generate form */}
        <div id="generate-form" style="display: none;">
          <div class="card">
            <form onsubmit="handleGenerate(event); return false;">
              <div class="form-group">
                <label for="prompt" class="form-label">
                  Describe your dream pet
                </label>
                <textarea
                  id="prompt"
                  name="prompt"
                  rows="4"
                  required
                  class="form-input"
                  placeholder="E.g., A playful orange tabby cat with green eyes and a fluffy tail..."
                  style="resize: vertical; min-height: 100px;"
                ></textarea>
                <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280;">
                  Be creative! Describe the species, appearance, personality traits, and any special features.
                </p>
              </div>

              <button type="submit" id="generate-btn" class="btn btn-primary" style="width: 100%;">
                Generate Pet
              </button>
            </form>
          </div>

          {/* Loading indicator */}
          <div id="generating" style="display: none; text-align: center; padding: 3rem; margin-top: 2rem;" class="card">
            <p style="color: #6b7280; font-size: 1.125rem; margin-bottom: 1rem;">Generating your pet...</p>
            <p style="color: #6b7280; font-size: 0.875rem;">This may take a few moments</p>
          </div>

          {/* Generated pet preview */}
          <div id="pet-preview" style="display: none; margin-top: 2rem;">
            {/* Will be populated by JavaScript */}
          </div>
        </div>
      </div>

      <script src="/js/generate.js"></script>
    </Layout>
  );
});

export default generate;
