// Pet card component
import React from 'react';

interface Pet {
  id: string;
  name: string;
  species: string;
  priceCents: number;
  imageUrl: string;
}

interface PetCardProps {
  pet: Pet;
  onAdd?: (petId: string) => void;
  onRemove?: (petId: string) => void;
}

export function PetCard({ pet, onAdd, onRemove }: PetCardProps) {
  const priceFormatted = `$${(pet.priceCents / 100).toFixed(2)}`;

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      }}
    >
      <a
        href={`/pet/${pet.id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div
          style={{
            width: '100%',
            paddingTop: '75%', // 4:3 aspect ratio
            position: 'relative',
            backgroundColor: '#f3f4f6',
          }}
        >
          <img
            src={pet.imageUrl}
            alt={pet.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
        <div style={{ padding: '1rem' }}>
          <h3
            style={{
              margin: '0 0 0.5rem 0',
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
            }}
          >
            {pet.name}
          </h3>
          <p
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            {pet.species}
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: '#2563eb',
              }}
            >
              {priceFormatted}
            </span>
          </div>
        </div>
      </a>
      {(onAdd || onRemove) && (
        <div
          style={{
            padding: '0 1rem 1rem 1rem',
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          {onAdd && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAdd(pet.id);
              }}
              style={{
                flex: 1,
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#1d4ed8')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = '#2563eb')
              }
            >
              Add to Store
            </button>
          )}
          {onRemove && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onRemove(pet.id);
              }}
              style={{
                flex: 1,
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = '#b91c1c')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = '#dc2626')
              }
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}
