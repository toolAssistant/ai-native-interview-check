import test from "node:test";
import assert from "node:assert/strict";

const APP_URL = new URL("../index.html", import.meta.url).href;
const DEBUG_BASE = "http://127.0.0.1:9222";

async function createTarget() {
  const response = await fetch(`${DEBUG_BASE}/json/new?about:blank`, { method: "PUT" });
  assert.equal(response.ok, true, "failed to create Chrome DevTools target");
  return response.json();
}

async function closeTarget(targetId) {
  await fetch(`${DEBUG_BASE}/json/close/${targetId}`);
}

async function connectToTarget(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 1;
  const inflight = new Map();
  const listeners = new Map();

  socket.addEventListener("message", (event) => {
    const payload = JSON.parse(event.data);
    if (payload.id && inflight.has(payload.id)) {
      const { resolve, reject } = inflight.get(payload.id);
      inflight.delete(payload.id);
      if (payload.error) reject(new Error(payload.error.message));
      else resolve(payload.result);
      return;
    }

    const handlers = listeners.get(payload.method);
    if (handlers) handlers.forEach((handler) => handler(payload.params));
  });

  function on(method, handler) {
    if (!listeners.has(method)) listeners.set(method, new Set());
    listeners.get(method).add(handler);
    return () => listeners.get(method)?.delete(handler);
  }

  function send(method, params = {}) {
    const id = nextId++;
    socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      inflight.set(id, { resolve, reject });
    });
  }

  async function evaluate(expression) {
    const result = await send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    return result.result?.value;
  }

  async function click(selector) {
    return evaluate(`
      (() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return false;
        el.click();
        return true;
      })()
    `);
  }

  async function setInputValue(selector, value) {
    return evaluate(`
      (() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return false;
        el.value = ${JSON.stringify(value)};
        el.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
      })()
    `);
  }

  async function waitFor(checkExpression, { timeoutMs = 8000, intervalMs = 100 } = {}) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const value = await evaluate(checkExpression);
      if (value) return value;
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    throw new Error(`Timed out waiting for expression: ${checkExpression}`);
  }

  return { socket, send, on, evaluate, click, setInputValue, waitFor };
}

test("candidate self-check primary flow works in a real browser", async () => {
  const target = await createTarget();
  const client = await connectToTarget(target.webSocketDebuggerUrl);

  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");

    const loaded = new Promise((resolve) => {
      const off = client.on("Page.loadEventFired", () => {
        off();
        resolve();
      });
    });

    await client.send("Page.navigate", { url: APP_URL });
    await loaded;

    await client.evaluate("localStorage.clear()");
    const reloaded = new Promise((resolve) => {
      const off = client.on("Page.loadEventFired", () => {
        off();
        resolve();
      });
    });
    await client.send("Page.reload", { ignoreCache: true });
    await reloaded;

    assert.equal(await client.evaluate("document.title"), "AI-Native 面试自查向导 · 候选人交互式训练页");
    assert.equal(await client.evaluate("document.querySelector('#routeScreen').hidden"), false);
    assert.equal(await client.evaluate("document.querySelector('#questionScreen').hidden"), true);

    assert.equal(await client.click('[data-start-route="undecided"]'), true);
    await client.waitFor("document.querySelector('#questionScreen').hidden === false");
    assert.match(await client.evaluate("document.querySelector('#questionTitle').textContent"), /Issue/u);

    for (let i = 0; i < 6; i += 1) {
      const answer = `这是第 ${i + 1} 题的自测答案。我会先给上下文，再给约束和验收条件，避免 AI 继续 askuser。`;
      assert.equal(await client.setInputValue("#answerInput", answer), true);
      assert.equal(await client.click("#unlockRubricButton"), true);
      await client.waitFor("document.querySelector('#rubricPanel').hidden === false");
      assert.equal(await client.click('[data-score=\"4\"]'), true);

      assert.equal(await client.click("#nextButton"), true);

      if (i < 5) {
        await client.waitFor("document.querySelector('#questionScreen').hidden === false");
      }
    }

    await client.waitFor("document.querySelector('#resultScreen').hidden === false");
    assert.match(await client.evaluate("document.querySelector('#resultHeadline').textContent"), /基本功|短板|竞争力/u);
    assert.match(await client.evaluate("document.querySelector('#resultScoreBig').textContent"), /24 \/ 30/);
    assert.ok(await client.evaluate("document.querySelectorAll('#moduleResults .module-card').length >= 3"));
    assert.ok(await client.evaluate("document.querySelectorAll('#recommendations .recommendation').length >= 1"));
  } finally {
    client.socket.close();
    await closeTarget(target.id);
  }
});

test("rubric can be unlocked without minimum length interception", async () => {
  const target = await createTarget();
  const client = await connectToTarget(target.webSocketDebuggerUrl);

  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");

    const loaded = new Promise((resolve) => {
      const off = client.on("Page.loadEventFired", () => {
        off();
        resolve();
      });
    });

    await client.send("Page.navigate", { url: APP_URL });
    await loaded;

    await client.evaluate("localStorage.clear()");
    const reloaded = new Promise((resolve) => {
      const off = client.on("Page.loadEventFired", () => {
        off();
        resolve();
      });
    });
    await client.send("Page.reload", { ignoreCache: true });
    await reloaded;

    assert.equal(await client.click('[data-start-route="undecided"]'), true);
    await client.waitFor("document.querySelector('#questionScreen').hidden === false");

    assert.equal(await client.setInputValue("#answerInput", "短答案"), true);
    assert.equal(await client.click("#unlockRubricButton"), true);
    await client.waitFor("document.querySelector('#rubricPanel').hidden === false");
  } finally {
    client.socket.close();
    await closeTarget(target.id);
  }
});
