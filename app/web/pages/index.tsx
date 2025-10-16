/** @jsxImportSource hono/jsx */
import { Hono } from 'hono';
import { Layout } from '../../server/views/Layout';

const index = new Hono();

index.get('/', (c) => {
  return c.html(
    <Layout title="PetSynth 9000 - AI Pet Generation">
      <div style="max-width: 1000px; margin: 0 auto; padding: 3rem 1rem;">
        {/* Hero Section */}
        <div style="text-align: center; margin-bottom: 4rem;">
          <h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 1rem; background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            PetSynth 9000
          </h1>
          <p style="font-size: 1.5rem; color: #6b7280; margin-bottom: 2rem;">
            Generate AI-powered virtual pets with personality
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="/catalog" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.125rem; text-decoration: none; display: inline-block;">
              Browse Catalog
            </a>
            <a href="/generate" class="btn" style="padding: 1rem 2rem; font-size: 1.125rem; text-decoration: none; display: inline-block; background: white; border: 2px solid #2563eb; color: #2563eb;">
              Generate Pet
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 4rem;">
          <div class="card" style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🤖</div>
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; color: #111827;">
              AI Generation
            </h3>
            <p style="color: #6b7280; line-height: 1.6;">
              Describe your dream pet and let our AI bring it to life with unique traits and characteristics
            </p>
          </div>

          <div class="card" style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🏪</div>
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; color: #111827;">
              Your Store
            </h3>
            <p style="color: #6b7280; line-height: 1.6;">
              Build your personal collection of pets and manage them in your own virtual store
            </p>
          </div>

          <div class="card" style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎨</div>
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; color: #111827;">
              Unique Designs
            </h3>
            <p style="color: #6b7280; line-height: 1.6;">
              Every pet is one-of-a-kind with AI-generated images, traits, and care instructions
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div class="card" style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; text-align: center; padding: 3rem 2rem;">
          <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">
            Ready to create your perfect pet?
          </h2>
          <p style="font-size: 1.125rem; margin-bottom: 2rem; opacity: 0.9;">
            Join thousands of users creating unique virtual companions
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="/login" class="btn" style="padding: 1rem 2rem; font-size: 1.125rem; text-decoration: none; display: inline-block; background: white; color: #2563eb;">
              Get Started
            </a>
            <a href="/catalog" class="btn" style="padding: 1rem 2rem; font-size: 1.125rem; text-decoration: none; display: inline-block; background: transparent; border: 2px solid white; color: white;">
              View Catalog
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style="text-align: center; margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #e5e7eb; color: #6b7280;">
          <p>
            <a href="/health" style="color: #2563eb; text-decoration: none;">System Health</a>
            {' · '}
            <a href="/api/pets" style="color: #2563eb; text-decoration: none;">API Docs</a>
          </p>
        </div>
      </div>
    </Layout>
  );
});

export default index;
