import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  extractDisplayName,
  getTimeGreeting,
  STARTER_PROMPTS,
} from '../src/lib/features/chat/domain/greeting.ts';

describe('chat empty state greeting helpers', () => {
  it('normalizes uppercase Indonesian names and skips common Muhammad prefix', () => {
    assert.equal(extractDisplayName('MUHAMMAD FIRZY MUTTAQIN'), 'Firzy');
    assert.equal(extractDisplayName('M. Rizki Pratama'), 'Rizki');
    assert.equal(extractDisplayName('Budi Santoso'), 'Budi');
    assert.equal(extractDisplayName('muhammad'), 'Muhammad');
    assert.equal(extractDisplayName('  '), 'Sobat KKA');
    assert.equal(extractDisplayName(null), 'Sobat KKA');
  });

  it('returns time-appropriate salutations across all four periods', () => {
    assert.equal(getTimeGreeting(new Date(2026, 10, 22, 7, 30)).period, 'morning');
    assert.equal(getTimeGreeting(new Date(2026, 10, 22, 7, 30)).salutation, 'Selamat pagi');

    assert.equal(getTimeGreeting(new Date(2026, 10, 22, 12, 15)).period, 'afternoon');
    assert.equal(getTimeGreeting(new Date(2026, 10, 22, 12, 15)).salutation, 'Selamat siang');

    assert.equal(getTimeGreeting(new Date(2026, 10, 22, 16, 45)).period, 'evening');
    assert.equal(getTimeGreeting(new Date(2026, 10, 22, 16, 45)).salutation, 'Selamat sore');

    assert.equal(getTimeGreeting(new Date(2026, 10, 22, 0, 49)).period, 'night');
    assert.equal(getTimeGreeting(new Date(2026, 10, 22, 0, 49)).salutation, 'Selamat malam');
  });

  it('provides 4 starter prompts', () => {
    assert.equal(STARTER_PROMPTS.length, 4);
  });
});
