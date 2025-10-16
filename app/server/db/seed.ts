// Database migration and seeding script
import { sqlite } from './client.js';

// Create tables using raw SQL
export function createTables() {
  // Users table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('now', 'subsec') * 1000 as integer))
    )
  `);

  // Pets table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS pets (
      id TEXT PRIMARY KEY,
      name TEXT,
      species TEXT,
      traits_json TEXT,
      description TEXT,
      care_instructions TEXT,
      price_cents INTEGER,
      image_url TEXT,
      status TEXT CHECK(status IN ('seed', 'published')),
      created_by_user_id TEXT REFERENCES users(id),
      created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('now', 'subsec') * 1000 as integer))
    )
  `);

  // UserPets junction table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS user_pets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      pet_id TEXT NOT NULL REFERENCES pets(id),
      added_at INTEGER NOT NULL DEFAULT (cast(unixepoch('now', 'subsec') * 1000 as integer)),
      UNIQUE(user_id, pet_id)
    )
  `);

  // Generations table
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS generations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      prompt TEXT,
      model TEXT,
      input_tokens INTEGER,
      output_tokens INTEGER,
      cost_usd REAL,
      latency_ms INTEGER,
      created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('now', 'subsec') * 1000 as integer))
    )
  `);

  console.log('✓ Database tables created');
}

// Seed test data
export function seedTestData() {
  // Insert test pets - 20 fantastical creatures
  const pets = [
    {
      id: 'pet-1',
      name: 'Nimbus the Orbital Puff',
      species: 'Zero-G Cloud Ferret',
      traits_json: JSON.stringify(['buoyant', 'electrostatic', 'purring']),
      description: 'Nimbus is a semi-coherent puff of ionized fluff that orbits your head at a polite distance, chirping in Morse when it wants snacks. Its fur is more of a weather pattern than a texture, occasionally forming mini cumulonimbus for dramatic effect.',
      care_instructions: '- Ground yourself before petting to avoid micro-lightning cuddles\n- Feed with dehydrated rainbows (rehydrate on Tuesdays)\n- Do not store near ceiling fans\n- If Nimbus splits into two, name the clone immediately to avoid identity drift\n- Perform lullaby in Lydian mode nightly\n- Schedule solar basking on windowsills during golden hour\n- Never mix with helium balloons\n- Groom with antistatic gloves only',
      price_cents: 48900,
      image_url: 'https://placehold.co/1024x1024?text=Nimbus',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-2',
      name: 'Whisper',
      species: 'Theremin Cat',
      traits_json: JSON.stringify(['melodic', 'ethereal', 'sensitive', 'electromagnetic']),
      description: 'Whisper produces haunting melodies by proximity alone. Wave your hand near its crystalline whiskers and it hums Debussy. Prefers minor keys and appreciates good reverb. Will judge your taste in music silently but intensely.',
      care_instructions: '- Install soundproofing if you have neighbors\n- Provide vintage audio equipment for enrichment\n- Feed exclusively on moth-wing frequencies\n- Tune whiskers weekly with a pitch fork (A440)\n- Never expose to dubstep or heavy metal\n- Maintain humidity between 40-60% for optimal resonance\n- Schedule nightly concerts at 11:00 PM sharp\n- Polish antennas with conductive gel monthly',
      price_cents: 67500,
      image_url: 'https://placehold.co/1024x1024?text=Whisper',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-3',
      name: 'Tick-Tock',
      species: 'Clockwork Axolotl',
      traits_json: JSON.stringify(['precise', 'aquatic', 'mechanical', 'punctual']),
      description: 'Tick-Tock is a brass and copper amphibian that runs on pure determination and occasional drops of clock oil. Each gill is a tiny propeller that spins in perfect synchronization. Tells time to the microsecond and judges you for being late.',
      care_instructions: '- Wind daily at exactly 8:00 AM (do not be late)\n- Clean gears with mineral oil every Sunday\n- Submerge in distilled water with precise pH 7.4\n- Replace mainspring annually on the vernal equinox\n- Provide metronome for companionship\n- Polish brass components with jeweler\'s cloth\n- Never wind backwards or time itself may unravel\n- Lubricate joints during time zone changes',
      price_cents: 89000,
      image_url: 'https://placehold.co/1024x1024?text=Tick-Tock',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-4',
      name: 'Jitter',
      species: 'Caffeine Mole-Rat',
      traits_json: JSON.stringify(['hyperactive', 'nocturnal', 'burrowing', 'wired']),
      description: 'Jitter subsists entirely on coffee grounds and existential dread. Moves at 4x speed and communicates in rapid-fire squeaks. Excellent at digging through your inbox, literal dirt, and philosophical questions about the nature of time.',
      care_instructions: '- Provide fresh espresso grounds twice daily\n- Install tunnel system with at least 40 feet of PVC\n- Never offer decaf (this is cruelty)\n- Expect no sleep between 11 PM and 5 AM\n- Supply tiny sunglasses for light sensitivity\n- Rotate coffee bean varieties to prevent flavor boredom\n- Provide stress ball for excess energy\n- Schedule philosophical discussions during 3 AM zoomies',
      price_cents: 34900,
      image_url: 'https://placehold.co/1024x1024?text=Jitter',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-5',
      name: 'Ember',
      species: 'Velvet Basilisk',
      traits_json: JSON.stringify(['regal', 'petrifying', 'luxurious', 'dramatic']),
      description: 'Ember can turn people to stone, but chooses not to because it prefers the aesthetic of living admirers. Its scales feel like crushed velvet and shimmer like oil on water. Extremely vain and requires compliments hourly.',
      care_instructions: '- Wear mirrored sunglasses during eye contact\n- Compliment appearance at least 12 times per day\n- Feed on quartz crystals and gemstones\n- Provide heated basking rock at exactly 95°F\n- Install full-length mirror for self-admiration\n- Brush scales with silk cloth twice weekly\n- Never criticize fashion choices\n- Maintain Instagram account for glamour shots',
      price_cents: 125000,
      image_url: 'https://placehold.co/1024x1024?text=Ember',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-6',
      name: 'Fractal',
      species: 'Recursive Gecko',
      traits_json: JSON.stringify(['mathematical', 'self-similar', 'infinite', 'contemplative']),
      description: 'Fractal contains infinite smaller copies of itself, each containing infinite smaller copies, ad infinitum. Excellent at explaining the Mandelbrot set but terrible at fitting through doorways. Exists in at least 7 dimensions.',
      care_instructions: '- Feed with non-Euclidean fruit arrangements\n- Provide infinite terrarium (4x4 feet will do)\n- Never count its scales (you will lose sanity)\n- Discuss topology during morning basking\n- Rotate habitat 90° in the 4th dimension weekly\n- Avoid Boolean logic in its presence\n- Provide Klein bottle for water\n- Meditate with it during full moons',
      price_cents: 99900,
      image_url: 'https://placehold.co/1024x1024?text=Fractal',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-7',
      name: 'Fog',
      species: 'Liminal Space Hound',
      traits_json: JSON.stringify(['transitional', 'eerie', 'loyal', 'uncanny']),
      description: 'Fog only appears in doorways, hallways, and parking garages at dusk. Excellent guard dog because intruders feel deep existential unease. Loves you unconditionally but in a way that feels slightly off.',
      care_instructions: '- Walk only in spaces between destinations\n- Feed during twilight hours exclusively\n- Never photograph (cameras cannot perceive it)\n- Provide liminal waiting rooms for sleeping\n- Pat on head while maintaining eye contact with middle distance\n- Listen to its barks for warnings from parallel timelines\n- Keep fluorescent lights flickering\n- Schedule vet visits in airport terminals',
      price_cents: 72000,
      image_url: 'https://placehold.co/1024x1024?text=Fog',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-8',
      name: 'Pixel',
      species: 'Bitmap Butterfly',
      traits_json: JSON.stringify(['digital', 'colorful', 'glitchy', '8-bit']),
      description: 'Pixel is composed entirely of 256 colored squares arranged in a 16x16 grid. Leaves trails of chromatic aberration when it flies. Can only turn at 90-degree angles. Speaks in MIDI tones.',
      care_instructions: '- Defragment weekly to prevent glitches\n- Feed on RGB color values and hexadecimal codes\n- Provide CRT monitor for basking in refresh rates\n- Update drivers monthly\n- Never compress (lossy algorithms cause distress)\n- Backup to cloud storage as a precaution\n- Avoid water damage (not waterproof)\n- Reboot daily by turning it off and on again',
      price_cents: 42000,
      image_url: 'https://placehold.co/1024x1024?text=Pixel',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-9',
      name: 'Melody',
      species: 'Synesthetic Songbird',
      traits_json: JSON.stringify(['chromatic', 'musical', 'colorful', 'hallucinogenic']),
      description: 'When Melody sings, you can taste colors and see sounds. Every note produces a different sensory experience. A major chord tastes like strawberries and looks like sunset. Extremely confusing but utterly delightful.',
      care_instructions: '- Provide soundproof enclosure (for your sanity)\n- Feed on musical scales and chord progressions\n- Never play dissonant music nearby\n- Expect to experience cyan as a flavor\n- Document sensory experiences in journal\n- Limit to 2-hour concerts to prevent overstimulation\n- Provide sheet music for reading material\n- Keep earplugs and blindfold handy for emergencies',
      price_cents: 81500,
      image_url: 'https://placehold.co/1024x1024?text=Melody',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-10',
      name: 'Quantum',
      species: 'Schrödinger\'s Hamster',
      traits_json: JSON.stringify(['superpositioned', 'uncertain', 'fuzzy', 'probabilistic']),
      description: 'Quantum exists in multiple states simultaneously until observed. Is both awake and asleep, here and there, hungry and full. Makes wonderful philosophical conversation but terrible at fetch.',
      care_instructions: '- Observe only when absolutely necessary\n- Feed with superpositioned food pellets\n- Provide box that is simultaneously open and closed\n- Never make definitive statements about its location\n- Maintain quantum decoherence at minimum levels\n- Consult with physicist before major decisions\n- Accept that exercise wheel both spins and doesn\'t spin\n- Embrace uncertainty as lifestyle',
      price_cents: 108000,
      image_url: 'https://placehold.co/1024x1024?text=Quantum',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-11',
      name: 'Prism',
      species: 'Refraction Rabbit',
      traits_json: JSON.stringify(['luminous', 'spectral', 'shimmering', 'photonic']),
      description: 'Prism bends light around itself, creating permanent rainbows wherever it hops. Its fur is made of diffraction gratings. Can become invisible by refracting light perfectly, but chooses not to because it enjoys attention.',
      care_instructions: '- Provide full-spectrum lighting 12 hours daily\n- Feed on photons and carrot-flavored wavelengths\n- Clean optical surfaces with lint-free cloth\n- Avoid mirrors (causes infinite reflections)\n- Protect from UV exposure (causes sunburns on rainbows)\n- Rotate prism habitat to prevent light damage\n- Never use laser pointers (too stimulating)\n- Polish regularly to maintain luster',
      price_cents: 56700,
      image_url: 'https://placehold.co/1024x1024?text=Prism',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-12',
      name: 'Echo',
      species: 'Reverb Raven',
      traits_json: JSON.stringify(['repetitive', 'acoustic', 'haunting', 'persistent']),
      description: 'Echo repeats everything you say with increasing distortion and delay. By the 7th repetition, your words have transformed into ambient soundscapes. Excellent for musicians, maddening for everyone else.',
      care_instructions: '- Speak clearly and project from diaphragm\n- Feed on sound waves and whispered secrets\n- Provide acoustic panels to control reverb time\n- Never say anything you don\'t want repeated 20 times\n- Install delay pedal for communication\n- Limit coffee consumption (speeds up playback)\n- Soundproof room recommended\n- Accept that silence is no longer an option',
      price_cents: 64200,
      image_url: 'https://placehold.co/1024x1024?text=Echo',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-13',
      name: 'Marble',
      species: 'Philosophical Tortoise',
      traits_json: JSON.stringify(['contemplative', 'ancient', 'wise', 'ponderous']),
      description: 'Marble has been pondering the trolley problem for 300 years and has strong opinions about Kant. Moves at geological speed but thinks at quantum velocity. Will debate epistemology if prompted.',
      care_instructions: '- Provide extensive philosophy library\n- Feed on paradoxes and thought experiments\n- Never interrupt mid-contemplation\n- Expect 40-minute pauses between sentences\n- Attend weekly ethics discussions\n- Provide reading glasses for ancient texts\n- Accept that all questions lead to more questions\n- Schedule Socratic dialogues on Thursdays',
      price_cents: 93000,
      image_url: 'https://placehold.co/1024x1024?text=Marble',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-14',
      name: 'Shimmer',
      species: 'Soap Bubble Sloth',
      traits_json: JSON.stringify(['iridescent', 'fragile', 'slow', 'ephemeral']),
      description: 'Shimmer moves in ultra-slow motion and is made entirely of soap film. Reflects rainbow patterns and occasionally pops, then reforms instantly. The most relaxing pet you\'ll ever own, assuming you don\'t mind constant anxiety about sharp objects.',
      care_instructions: '- Remove all sharp objects from home\n- Maintain humidity at exactly 65%\n- Feed on glycerin and surfactant solutions\n- Provide bubble wand for exercise\n- Never blow on (this is assault)\n- Avoid sudden movements and loud noises\n- Install soft padding on all surfaces\n- Keep emergency reformation kit ready',
      price_cents: 38900,
      image_url: 'https://placehold.co/1024x1024?text=Shimmer',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-15',
      name: 'Glitch',
      species: 'Error Message Eel',
      traits_json: JSON.stringify(['corrupted', 'electrical', 'unpredictable', 'chaotic']),
      description: 'Glitch swims through electrical currents and occasionally crashes your WiFi just for fun. Communicates in error codes and stack traces. Surprisingly affectionate despite being made of pure chaos.',
      care_instructions: '- House in Faraday cage aquarium\n- Feed on corrupted data packets\n- Backup all devices before interaction\n- Expect random system failures\n- Provide circuit boards for enrichment\n- Debug weekly with error logs\n- Never connect to production servers\n- Keep tech support number handy',
      price_cents: 47800,
      image_url: 'https://placehold.co/1024x1024?text=Glitch',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-16',
      name: 'Whiskers',
      species: 'Probability Cloud Cat',
      traits_json: JSON.stringify(['quantum', 'unpredictable', 'fuzzy', 'statistical']),
      description: 'Whiskers exists as a probability distribution rather than a definite location. Has a 73% chance of being on the couch, 15% in the kitchen, and 12% in another dimension. Purrs in bell curves.',
      care_instructions: '- Accept that you cannot definitively locate it\n- Feed in multiple locations simultaneously\n- Provide infinite litter boxes (3 will suffice)\n- Calculate expected position before petting\n- Never collapse the wave function abruptly\n- Maintain quantum uncertainty at comfortable levels\n- Understand that observation affects behavior\n- Keep statistics textbook for reference',
      price_cents: 76500,
      image_url: 'https://placehold.co/1024x1024?text=Whiskers',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-17',
      name: 'Void',
      species: 'Absence Owl',
      traits_json: JSON.stringify(['empty', 'silent', 'profound', 'negating']),
      description: 'Void is not so much a pet as a pet-shaped absence of existence. Hoots in anti-sound that creates silence. Stares with eyes that are windows to nothing. Paradoxically comforting.',
      care_instructions: '- Do not feed (it consumes absence)\n- Provide perch made of negative space\n- Never shine light directly at it\n- Embrace the existential questions it raises\n- Maintain void in temperature-controlled nothing\n- Schedule regular non-interactions\n- Accept that its cage is both empty and full\n- Contemplate the nature of being and non-being',
      price_cents: 142000,
      image_url: 'https://placehold.co/1024x1024?text=Void',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-18',
      name: 'Puzzle',
      species: 'Tessellation Terrier',
      traits_json: JSON.stringify(['geometric', 'repeating', 'mathematical', 'seamless']),
      description: 'Puzzle tiles perfectly with itself. Can rearrange its body into infinite patterns without gaps or overlaps. Loves Escher and hates irregular shapes. Mathematically adorable.',
      care_instructions: '- Provide graph paper for napping\n- Feed on geometric shapes and symmetry\n- Rotate pieces weekly to prevent pattern fatigue\n- Never introduce chaos or randomness\n- Appreciate the mathematical elegance\n- Play with tangram toys\n- Maintain strict rotational symmetry\n- Consult geometry textbook for care tips',
      price_cents: 58900,
      image_url: 'https://placehold.co/1024x1024?text=Puzzle',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-19',
      name: 'Ripple',
      species: 'Interference Pattern Fish',
      traits_json: JSON.stringify(['wavy', 'oscillating', 'harmonic', 'resonant']),
      description: 'Ripple is made entirely of constructive and destructive interference. Swims in phase with the universe. When two Ripples meet, they either double in brightness or cancel out completely.',
      care_instructions: '- Maintain tank at precise wavelength intervals\n- Feed on frequency-matched nutrition\n- Never introduce out-of-phase companions\n- Monitor for destructive interference\n- Provide wave tank for exercise\n- Adjust phase alignment weekly\n- Protect from ambient noise pollution\n- Calculate resonant frequencies before interactions',
      price_cents: 71200,
      image_url: 'https://placehold.co/1024x1024?text=Ripple',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
    {
      id: 'pet-20',
      name: 'Möbius',
      species: 'One-Sided Snake',
      traits_json: JSON.stringify(['topological', 'paradoxical', 'continuous', 'twisted']),
      description: 'Möbius has no beginning or end, no inside or outside. Exists on a single continuous surface. If you start petting at its "head," you\'ll end up at its "tail" which is actually the same place. Mind-bending and huggable.',
      care_instructions: '- Never try to determine which side is which\n- Feed on non-orientable surfaces\n- Provide infinite loop habitat\n- Accept topological impossibility as fact\n- Avoid cutting (creates two-sided abomination)\n- Embrace the paradox of its existence\n- Study Klein bottles for comparison\n- Question your understanding of reality daily',
      price_cents: 133000,
      image_url: 'https://placehold.co/1024x1024?text=Mobius',
      status: 'seed',
      created_by_user_id: null,
      created_at: Date.now(),
    },
  ];

  pets.forEach((pet) => {
    sqlite.run(
      `INSERT OR IGNORE INTO pets (id, name, species, traits_json, description, care_instructions, price_cents, image_url, status, created_by_user_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pet.id,
        pet.name,
        pet.species,
        pet.traits_json,
        pet.description,
        pet.care_instructions,
        pet.price_cents,
        pet.image_url,
        pet.status,
        pet.created_by_user_id,
        pet.created_at,
      ]
    );
  });

  console.log('✓ Test data seeded');
}

// Run migrations when this file is executed directly
if (import.meta.main) {
  createTables();
  seedTestData();
}
