#!/bin/bash
# Update database to use local image paths

echo "🔄 Updating database to use local image paths..."

for i in {1..20}; do
  sqlite3 app/pets.db "UPDATE pets SET image_url = '/images/pets/pet-${i}.png' WHERE id = 'pet-${i}';"
done

echo "✅ Updated all 20 pets to use local images"
echo ""
echo "Verifying..."
sqlite3 app/pets.db "SELECT id, name, image_url FROM pets WHERE status='seed' LIMIT 3;"
