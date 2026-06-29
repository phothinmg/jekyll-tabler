const utils = require("./utils.js");
const path = require("path");
const { matter } = require("./matter.js");
// /**
//  *
//  * @param {string} input
//  */
// const createFileName = (input) => {
//     const split = input.split("-");
//     if (split.length > 1) {
//         return `ti_${split.join("_")}`;
//     } else {
//         return `ti_${input}`;
//     }
// };

/**
 * @param {"outline"|"filled"} type
 */
const baseIcons = async (type) => {
    const files = utils.globeIcons(type);
    const result = [];
    for (const file of files) {
        const fileName = path.basename(file).split(".")[0].trim();
        // const fileName = createFileName(file_name);
        const fileContent = await utils.readFile(file);
        const { data, content } = matter(fileContent);
        result.push({
            name: `ti-${fileName}`,
            content,
            data,
        });
    }
    return result;
};
/**
 * @param {"outline"|"filled"} type
 */
const groupedCategories = async (type) => {
    const iconsArray = await baseIcons(type);
    const grouped = Object.groupBy(iconsArray, (item) => item.data.category);
    return grouped;
};
/**
 * @param {"outline"|"filled"} type
 */
const writeBaseIcons = async (type) => {
    const filePath = utils.resolvePath(`assets/${type}.yml`);
    const iconsArray = await baseIcons(type);
    const result = [];
    for (const obj of iconsArray) {
        const yml = utils.yamlSingleObject(obj.content, obj.name);
        result.push(yml);
    }
    const yaml = `${utils.bannerText}\n${result.join("\n")}`;
    await utils.writeFile(filePath, yaml);
};

/**
 * @param {"outline"|"filled"} type
 */
const writeCategoryIcons = async (type) => {
    const filePath = utils.resolvePath(`docs/_data/${type}.yml`);
    const iconsArray = await baseIcons(type);
    const result = [];
    for (const obj of iconsArray) {
        const yml = utils.yamlSingleObject(obj.content, obj.name);
        result.push(yml);
    }
    const yaml = `${utils.bannerText}\n${result.join("\n")}`;
    await utils.writeFile(filePath, yaml);
};

module.exports = { writeBaseIcons, writeCategoryIcons };
