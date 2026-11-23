import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createGame, gameReducer, opinion, wonElection } from '../src/game/engine.js';
import { calculateBalance } from '../src/game/economy.js';
import { events } from '../src/game/events.js';

// Run the unmodified, pinned MVP script with a minimal DOM. It is an independent
// oracle: formulas and event data are not copied into expected test values.
function originalGame() {
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, { style: {}, appendChild() {}, textContent: '', innerHTML: '' });
    return elements.get(id);
  };
  const context = vm.createContext({ document: { getElementById: element,
    querySelectorAll: () => [], createElement: () => ({}) },
    location: { reload() {} }, Math: Object.create(Math) });
  const source = readFileSync(new URL('./fixtures/mvp-0.1.html', import.meta.url), 'utf8').split('<script>')[1].split('</script>')[0];
  vm.runInContext(source, context);
  return code => JSON.parse(vm.runInContext(`JSON.stringify((()=>{${code}})())`, context) ?? 'null');
}

const snapshot = 'return {year,tax,changes,scores,balance,used}';
const assertOriginal = (state, run) => {
  const { year, tax, changes, scores, balance, used } = state;
  assert.deepEqual({ year, tax, changes, scores, balance, used }, run(snapshot));
};

test('initial economy, tax yield and allocations remain unchanged', () => {
  assert.equal(calculateBalance(0, [0,0,0,0,0,0]), -150);
  assert.equal(calculateBalance(1, [0,0,0,0,0,0]), -55);
  assert.equal(calculateBalance(0, [10,-20,0,0,0,0]), -140);
  assert.deepEqual(createGame().scores, [50,50,50,50,50,50]);
});

test('every event choice and all budget slider values match the original MVP', () => {
  // 51 tax values × 8 events × 3 choices, with all 41 allocation steps.
  for (let taxStep = -20; taxStep <= 30; taxStep++) {
    const run = originalGame();
    for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
      for (let choice = 0; choice < 3; choice++) {
        let state = createGame();
        const tax = taxStep / 10;
        const changes = state.changes.map((_, i) => ((taxStep + 20 + eventIndex * 3 + choice + i * 7) % 41) * 10 - 200);
        state = gameReducer(state, { type: 'tax', value: tax });
        changes.forEach((value, index) => { state = gameReducer(state, { type: 'allocation', index, value }); });
        run(`year=0;tax=${tax};changes=${JSON.stringify(changes)};scores=names.map(()=>50);used=[];update();`);
        assertOriginal(state, run);
        const random = (eventIndex + .5) / events.length;
        state = gameReducer(state, { type: 'decide', random });
        run(`Math.random=()=>${random};budgetEffect();event();`);
        assertOriginal(state, run);
        state = gameReducer(state, { type: 'choose', index: choice });
        run(`balance+=events[${eventIndex}].c[${choice}][1];modify(events[${eventIndex}].c[${choice}][2]);report(events[${eventIndex}].c[${choice}][0]);`);
        assertOriginal(state, run);
      }
    }
  }
});

test('full four-year terms preserve resets, accumulated opinion and no repeated events', () => {
  for (let scenario = 0; scenario < 20; scenario++) {
    const run = originalGame();
    let state = createGame();
    for (let year = 0; year < 4; year++) {
      const tax = (scenario % 6) - 2;
      state = gameReducer(state, { type: 'tax', value: tax });
      run(`tax=${tax};update();`);
      const random = (scenario + .5) / 20;
      state = gameReducer(state, { type: 'decide', random });
      run(`Math.random=()=>${random};budgetEffect();event();`);
      const choice = scenario % 3;
      state = gameReducer(state, { type: 'choose', index: choice });
      run(`balance+=events[used[used.length-1]].c[${choice}][1];modify(events[used[used.length-1]].c[${choice}][2]);report(events[used[used.length-1]].c[${choice}][0]);`);
      assertOriginal(state, run);
      assert.equal(new Set(state.used).size, year + 1);
      assert.ok(state.scores.every(x => x >= 0 && x <= 100));
      state = gameReducer(state, { type: 'next' });
      if (year < 3) { run('year++;changes=areas.map(()=>0);tax=0;update();'); assertOriginal(state, run); }
    }
    assert.equal(state.year, 3);
    assert.equal(state.phase, 'election');
    assert.equal(wonElection(state.scores), run('return Math.round(scores.reduce((a,b)=>a+b,0)/6)>=52'));
    assert.deepEqual(gameReducer(state, { type: 'restart' }), createGame());
  }
});

test('election uses the rounded average and the original 52-point threshold', () => {
  assert.equal(opinion([51.5,51.5,51.5,51.5,51.5,51.5]), 52);
  assert.equal(wonElection(Array(6).fill(51.5)), true);
  assert.equal(wonElection(Array(6).fill(51.49)), false);
});

test('phase guards prevent applying a decision twice', () => {
  const event = gameReducer(createGame(), { type: 'decide', random: 0 });
  assert.equal(gameReducer(event, { type: 'decide', random: .5 }), event);
  const result = gameReducer(event, { type: 'choose', index: 0 });
  assert.equal(gameReducer(result, { type: 'choose', index: 0 }), result);
});

test('exhausted event pool resets without changing the MVP selection rule', () => {
  const state = { ...createGame(), used: events.map((_, i) => i) };
  assert.deepEqual(gameReducer(state, { type: 'decide', random: .999 }).used, [7]);
});


test('MVP report keeps event costs in the summary while restoring the budget header', () => {
  let state = gameReducer(createGame(), { type: 'decide', random: 0 });
  state = gameReducer(state, { type: 'choose', index: 0 });
  assert.equal(state.summaryBalance, -215);
  assert.equal(state.balance, -150);
});
