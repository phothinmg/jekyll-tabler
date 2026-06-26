const fs = require("fs");
const path = require("path");

const bannerText = `# Tabler Icons\n# https://tabler.io/icons\n# cspell:disable`

function getSingleYAML(content, name) {
    const re = /<path\s+d="(.*)"\s+\/>/;

    const lines = content.split("\n");
    const ds = [];

    for (let i = 0; i < lines.length; i++) {
        const m = re.exec(lines[i]);
        if (m) ds.push(m[1]);
    }
    const yml = `${name}:
${ds.map((d) => ` - ${d}`).join("\n")}`;
    return yml;
}
/**
 *
 * @param {"outline"|"filled"} type
 * @returns
 */
async function getFileObject(type) {
    const folderPath = path.resolve(__dirname, `./tabler/${type}/*.svg`);
    const files = fs.globSync(folderPath);
    const result = [];
    for (const file of files) {
        const fileName = path.basename(file).split(".")[0].trim();
        const fileContent = await fs.promises.readFile(file, "utf8");
        result.push({ name: fileName, content: fileContent });
    }
    return result;
}

async function main(type) {
    const iconsArray = await getFileObject(type);
    const result = [];
    for (const obj of iconsArray) {
        const yml = getSingleYAML(obj.content, obj.name);
        result.push(yml);
    }
    const yaml = `${bannerText}\n${result.join("\n")}`;
    await fs.promises.writeFile(`data/${type}.yml`, yaml);
}

main("outline").catch((er) => console.log(er));
main("filled").catch((er) => console.log(er));
