const fs = require("fs");
const path = require("path");

let total = 0;
let rejected = 0;

function walk(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((f) => {
    const p = path.join(dir, f);

    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith(".json")) {
      total++;

      try {
        JSON.parse(fs.readFileSync(p, "utf8"));
      } catch (e) {
        rejected++;
      }
    }
  });
}

walk("experiments/schema-benchmark/data");

console.log("Total artifacts:", total);
console.log("Parse rejected:", rejected);
