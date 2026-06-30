const { loadYaml } = require("@suseejs/yaml");
const utils = require("./utils.js");

async function writeDocsIcon() {
    const filledData = await loadYaml("assets/filled.yml");
    const outlineData = await loadYaml("assets/outline.yml");
    const data = [];
    for (const key in filledData) {
        data.push({
            name: key,
            type: "filled",
            ds: filledData[key],
        });
    }
    for (const key in outlineData) {
        data.push({
            name: key,
            type: "outline",
            ds: outlineData[key],
        });
    }
    const txt = `/**\n* @type {{name:string;type:"outline"|"filled";ds:string[];}[]}\n*/\nconst tabler = Object.freeze(${JSON.stringify(data)});`.trim();
    await utils.writeFile("docs/data/tabler.js", txt);
}

writeDocsIcon().catch((er) => console.log(er));
