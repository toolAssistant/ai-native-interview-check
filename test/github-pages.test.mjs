import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const indexHtml = fs.readFileSync(path.resolve("index.html"), "utf8");
const workflowPath = path.resolve(".github/workflows/deploy-pages.yml");

test("github pages workflow exists and deploys a static site artifact", () => {
  assert.equal(fs.existsSync(workflowPath), true, "missing GitHub Pages workflow");

  const workflow = fs.readFileSync(workflowPath, "utf8");
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /cp index\.html _site\/index\.html/);
});

test("public metadata points to the GitHub Pages URL", () => {
  assert.match(
    indexHtml,
    /<link rel="canonical" href="https:\/\/toolAssistant\.github\.io\/ai-native-interview-check\/">/,
  );
  assert.match(
    indexHtml,
    /<meta property="og:url" content="https:\/\/toolAssistant\.github\.io\/ai-native-interview-check\/">/,
  );
});
