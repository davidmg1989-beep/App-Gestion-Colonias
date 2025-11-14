import { describe, it, expect } from 'vitest';
import { generateCats } from '../data/mockData';

describe('generateCats', () => {
  it('generates the correct total number of cats', () => {
    const cats = generateCats('colony-test', { females: 2, sterilizedFemales: 1, males: 3, castratedMales: 1, kittens: 2 });
    // Expected: sterilizedFemales (1) + remaining females (1) + castratedMales (1) + remaining males (2) + kittens (2) = 7
    expect(cats.length).toBe(7);
  });

  it('sets genders and ages appropriately for kittens', () => {
    const cats = generateCats('colony-test', { females: 0, sterilizedFemales: 0, males: 0, castratedMales: 0, kittens: 3 });
    expect(cats.every(c => c.age === 'Cachorro')).toBe(true);
    expect(cats.length).toBe(3);
  });
});
