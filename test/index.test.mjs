import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const html = fs.readFileSync(path.resolve('index.html'), 'utf8');

test('candidate self-check wizard shell exists', () => {
  assert.match(html, /AI-Native .*自查/u);
  assert.match(html, /id="routeScreen"/);
  assert.match(html, /id="questionScreen"/);
  assert.match(html, /id="resultScreen"/);
});

test('question bank and render flow are defined in script', () => {
  assert.match(html, /const questionBank = \[/);
  assert.match(html, /function renderQuestion\(/);
  assert.match(html, /function renderResults\(/);
});

test('results include diagnostic language instead of interviewer verdicts', () => {
  assert.match(html, /高风险信号/);
  assert.match(html, /岗位倾向/);
  assert.doesNotMatch(html, /面试评分记录表/);
});
