const icons = require("./icons.js");

icons.writeBaseIcons("filled").catch((er) => console.log(er));
icons.writeBaseIcons("outline").catch((er) => console.log(er));
