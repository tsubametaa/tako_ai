import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  extractContextTopics,
  type Source,
} from '../src/lib/features/sources/domain/source.ts';

describe('source context topic extraction', () => {
  it('deduplicates context topics case-insensitively and ignores generic labels', () => {
    const sources: Source[] = [
      { id: '1', title: 'Modul A.pdf', topic: 'Konsep Dasar AI', snippet: '' },
      { id: '2', title: 'Modul A.pdf', topic: 'konsep dasar ai', snippet: '' },
      { id: '3', title: 'Modul B.pdf', section: 'Sumber 3', snippet: '' },
      { id: '4', title: 'Modul B.pdf', section: 'S4', snippet: '' },
      { id: '5', title: 'Modul C.pdf', topic: 'Perancangan Sistem AI', snippet: '' },
      { id: '6', title: 'Modul D.pdf', topic: 'Etika & Bias Data', snippet: '' },
      { id: '7', title: 'Modul E.pdf', topic: 'Prompt Engineering', snippet: '' },
    ];

    assert.deepEqual(extractContextTopics(sources), [
      'Konsep Dasar AI',
      'Perancangan Sistem AI',
      'Etika & Bias Data',
    ]);
  });

  it('returns empty array when sources have no topic metadata', () => {
    const sources: Source[] = [
      { id: '1', title: 'Modul A.pdf', section: 'Sumber 1', snippet: '' },
    ];
    assert.deepEqual(extractContextTopics(sources), []);
    assert.deepEqual(extractContextTopics(undefined), []);
  });
});
