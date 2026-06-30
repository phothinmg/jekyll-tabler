const fs = require("fs");
const path = require("path");

const bannerText = `# Tabler Icons\n# https://tabler.io/icons\n# cspell:disable`;

/**
 *
 * @param {string} input
 * @returns {string}
 */
const resolvePath = (input) => path.resolve(process.cwd(), input);
const isPlainObject = (input) =>
    typeof input === "object" &&
    !Array.isArray(input) &&
    Object.keys(input).length === 0;

/**
 *
 * @param {string} filePath
 * @returns {Promise<string>}
 */
const readFile = async function (filePath) {
    filePath = resolvePath(filePath);
    if (!fs.existsSync(filePath)) {
        console.error(`${filePath} dose not exist`);
        process.exit(1);
    }
    const content = await fs.promises.readFile(filePath, "utf8");
    return content;
};

/**
 *
 * @param {string} filePath
 * @param {string} content
 */
const writeFile = async function (filePath, content) {
    filePath = resolvePath(filePath);
    if (!fs.existsSync(path.dirname(filePath))) {
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    }
    await fs.promises.writeFile(filePath, content);
};
/**
 * @param {"outline"|"filled"} type
 */
const globeIcons = (type) => {
    const folderPath = resolvePath(`./tabler-icon/icons/${type}/*.svg`);
    const files = fs.globSync(folderPath);
    return files;
};

const yamlSingleObject = function (content, name) {
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
};

const jsonSingleObject = function (content, name, type, cat) {
    const re = /<path\s+d="(.*)"\s+\/>/;

    const lines = content.split("\n");
    const obj = {
        iconName: name,
        iconType: type,
        category: cat,
        ds: [],
    };

    for (let i = 0; i < lines.length; i++) {
        const m = re.exec(lines[i]);
        if (m) obj.ds.push(m[1]);
    }
    return obj;
};

module.exports = {
    bannerText,
    resolvePath,
    readFile,
    writeFile,
    yamlSingleObject,
    isPlainObject,
    globeIcons,
    jsonSingleObject,
};
