const fs = require("fs");
const path = require("path");

let total = 0;
let parseRejected = 0;

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (p.endsWith(".json")) {
      total++;
      try {
        JSON.parse(fs.readFileSync(p, "utf8"));
      } catch (e) {
        parseRejected++;
      }
    }
  }
}

// Parse-only baseline: scan canonical dataset under examples/
walk("examples");

console.log("Experiment 1 (parse-only baseline)");
console.log("Total artifacts:", total);
console.log("Parse rejected:", parseRejected);
console.log("Note: JSON.parse does NOT detect duplicate keys and is insufficient for protocol adjudication.");
