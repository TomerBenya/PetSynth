#!/bin/bash
# Update image URLs in app/pets.db from db.sqlite

sqlite3 db.sqlite "SELECT 'UPDATE pets SET image_url = ''' || image_url || ''' WHERE id = ''' || id || ''';' FROM pets;" | sqlite3 app/pets.db

echo "✅ Image URLs updated in app/pets.db"
echo ""
echo "Verifying..."
sqlite3 app/pets.db "SELECT name, substr(image_url, 1, 60) FROM pets LIMIT 3;"
