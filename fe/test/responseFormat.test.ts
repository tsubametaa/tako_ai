import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { splitGuidingQuestion } from '../src/lib/features/chat/domain/responseFormat.ts';

describe('assistant response guiding question formatting', () => {
  it('separates trailing Socratic question from a single dense explanation paragraph', () => {
    const sample =
      'Perbedaan utamanya terletak pada apakah data tersebut sudah memiliki label jawaban yang benar (`target`) atau belum. Pada *supervised learning*, model belajar dari pasangan fitur (`X`) dan target (`y`); sedangkan pada *unsupervised learning*, data tidak berlabel sehingga algoritmanya harus mencari pola dan kelompok secara mandiri. Misalnya *clustering* pelanggan masuk ke kategori *unsupervised learning*. Menurutmu, kenapa langkah eksplorasi awal data perusahaan sering memakai *unsupervised learning*?';

    const result = splitGuidingQuestion(sample);
    assert.equal(
      result.guidingQuestion,
      'Menurutmu, kenapa langkah eksplorasi awal data perusahaan sering memakai *unsupervised learning*?',
    );
    assert.ok(result.body.endsWith('*unsupervised learning*.'));
    assert.ok(!result.body.includes('Menurutmu, kenapa'));
  });

  it('separates a standalone trailing question paragraph cleanly', () => {
    const sample =
      'Data latih dipakai untuk melatih model menemukan pola dari contoh berlabel.\n\nMenurutmu, apa akibatnya kalau soal ujiannya sama persis dengan soal latihan?';

    const result = splitGuidingQuestion(sample);
    assert.equal(
      result.body,
      'Data latih dipakai untuk melatih model menemukan pola dari contoh berlabel.',
    );
    assert.equal(
      result.guidingQuestion,
      'Menurutmu, apa akibatnya kalau soal ujiannya sama persis dengan soal latihan?',
    );
  });

  it('does not split short single-question responses or responses ending with code/statements', () => {
    const shortQ = 'Bagian mana yang masih membuatmu bingung?';
    assert.equal(splitGuidingQuestion(shortQ).guidingQuestion, null);

    const statement =
      'Supervised learning selalu memerlukan data berlabel agar model bisa membandingkan prediksi dengan target.';
    assert.equal(splitGuidingQuestion(statement).guidingQuestion, null);

    const codeBlock =
      'Berikut contoh sederhana di Python:\n\n```python\nprint("Halo?")\n```';
    assert.equal(splitGuidingQuestion(codeBlock).guidingQuestion, null);
  });
});
