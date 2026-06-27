const icons = require("./icons.js");

const args = process.argv.slice(2);

if (args.length === 0) {
    icons.writeBaseIcons("filled").catch((er) => console.log(er));
    icons.writeBaseIcons("outline").catch((er) => console.log(er));
} else {
    const base = args[0];
    const cat = args[1];
    if (base) {
        if (base !== "--filled" && base !== "--outline") {
            console.error(`Unknown cli usage "${base}"`);
            process.exit(1);
        }
        if (!cat) {
            if (base === "--filled") {
                icons.writeBaseIcons("filled").catch((er) => console.log(er));
            }
            if (base === "--outline") {
                icons.writeBaseIcons("outline").catch((er) => console.log(er));
            }
        } else {
            if (cat === "--docs") {
                if (base === "--filled") {
                    icons.writeCategoryIcons("filled").catch((er) => console.log(er));
                }
                if (base === "--outline") {
                    icons.writeCategoryIcons("outline").catch((er) => console.log(er));
                }
            } else {
                console.error(`Unknown cli usage "${cat}"`);
                process.exit(1);
            }
        }
    }
}
