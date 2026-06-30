/**
 * @param {{name:string;type:"outline"|"filled";ds:string[];}} icon
 * @param {number}[size]
 * @param {string}[color]
 */
function getIcon(icon, size, color) {
    const _size = size ?? 24;
    const _color = color ?? "currentColor";
    const outlineSvg = `<svg
     xmlns="http://www.w3.org/2000/svg"
     width=${_size}
     height=${_size}
     viewBox="0 0 24 24"
     fill="none"
     stroke=${_color}
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round"
     class="jekyll-tabler-icon ${icon.name}"
     data-jekyll-tabler-icon>
    <path
     stroke="none"
     d="M0 0h24v24H0z"
     fill="none" />
     ${icon.ds.map((d) => `<path d="${d}" />`).join("\n")}
     </svg>
     `;
    const filledSvg = `<svg
     xmlns="http://www.w3.org/2000/svg"
     width=${_size}
     height=${_size}
     viewBox="0 0 24 24"
     fill=${_color}
     class="jekyll-tabler-icon ${icon.name}"
     data-jekyll-tabler-icon>
    <path
     stroke="none"
     d="M0 0h24v24H0z"
     fill="none" />
     ${icon.ds.map((d) => `<path d="${d}" />`)}
     </svg>
     `;

    return icon.type === "filled" ? filledSvg : outlineSvg;
}
