/**
 *
 * @param {string} raw
 * @returns {{data:Record<string,unknown>;content:string}}
 */
exports.matter = function (raw) {
    const re = /^<!--([\s\S]*?)-->/;
    const m = re.exec(raw);
    let data = {};
    let content = raw;
    if (m) {
        const fms = m[1].trim().split("\n");
        content = raw.replace(m[0], "").trim();
        for (const fm of fms) {
            let [key, value] = fm.split(":");
            value = key === "category" ? value.toLowerCase() : value;
            data[key] = value;
        }
        if (!Object.keys(data).includes("category")) {
            data["category"] = "other";
        }
    }

    return { data, content };
};
