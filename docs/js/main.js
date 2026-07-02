const iconTypeStorageKey = "tabler_icon_type";

/**
 *
 * @param {string} str
 * @returns {string}
 */
function capitalizeWords(str) {
    return str
        .split("-")
        .slice(1)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * @param {{name:string;type:"outline"|"filled";ds:string[];}} icon
 * @param {number} [size]
 * @param {string} [color]
 */
function createSvgIcon(icon, size, color) {
    const _size = size ?? 24;
    const _color = "currentColor";
    const outline = ` <svg
        xmlns="http://www.w3.org/2000/svg"
        width=${_size}
        height=${_size}
        viewBox="0 0 24 24"
        fill="none"
        stroke=${_color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="jekyll-tabler-icon ${icon.name}">
        <path
        stroke="none"
        d="M0 0h24v24H0z"
        fill="none"/>
        ${icon.ds.map((d) => `<path d="${d}" />`)}
      </svg>`;
    const filled = ` <svg
        xmlns="http://www.w3.org/2000/svg"
        width=${_size}
        height=${_size}
        viewBox="0 0 24 24"
        fill=${_color}
        aria-hidden="true"
        focusable="false"
        class="jekyll-tabler-icon ${icon.name}">
        <path
        stroke="none"
        d="M0 0h24v24H0z"
        fill="none" />
        ${icon.ds.map((d) => `<path d="${d}" />`)}
      </svg>`;
    if (icon.type === "outline") {
        return outline;
    } else {
        return filled;
    }
}
/**
 * @param {{name:string;type:"outline"|"filled";ds:string[];}} icon
 * @param {number} [size]
 * @param {string} [color]
 */
function createSvgBtn(icon, size, color) {
    const _id = `tabler-${icon.name}-${icon.type}`;
    const btn_id = `${_id}-btn`;
    const svg = createSvgIcon(icon, size, color);
    return `<button
          class="icon_card"
          id=${btn_id}
          aria-label="Tabler Icon ${capitalizeWords(icon.name)}"
          commandFor=${_id}
          command="show-modal"
          data-tooltip=${icon.name}
          data-tabler-name=${icon.name}
          data-tabler-type=${icon.type}>
          ${svg}
        </button>
        <dialog class="icon_dialog" id=${_id} data-tabler-dialog>
          <p class="icon_dialog_name">${icon.name}</p>
           ${svg}
          <div class="icon_dialog_fields">
            <label class="icon_dialog_field">
              <span>Size</span>
              <input
                type="number"
                min="1"
                inputmode="numeric"
                placeholder="24"
                name=${btn_id}
                data-tabler-size />
            </label>
            <label class="icon_dialog_field">
              <span>Color</span>
              <div class="icon_dialog_color_row">
                <input
                  type="color"
                  value="#000000"
                  data-tabler-color />
                <span class="icon_dialog_color_value" data-tabler-color-value>
                  currentColor
                </span>
              </div>
            </label>
          </div>
          <pre class="icon_dialog_code"><code data-tabler-code></code></pre>
          <p
            class="icon_dialog_status"
            data-tabler-status
            aria-live="polite"></p>
          <div class="icon_dialog_actions">
            <button type="button" data-tabler-copy>Copy tag</button>
            <button type="button" commandFor=${_id} command="close" data-tabler-close>Close</button>
          </div>
        </dialog>
        `;
}

/**
 *
 * @param {{name:string;type:"outline"|"filled";ds:string[];}[]} icons
 * @param {number} num // number of icons
 * @param {number} [size]
 * @param {string} [color]
 * @returns {string[]}
 */
const slicedIconBtns = (icons, start, num, size, color) =>
    icons
        .slice(start, start + num)
        .map((icon) => createSvgBtn(icon, size, color));

/**
 *
 * @param {{name:string;type:"outline"|"filled";ds:string[];}[]} icons
 * @param {string} [searchTerm]
 */
const filterIcons = (icons, searchTerm = "") => {
    const cleanTerm = searchTerm.trim().toLowerCase();
    return icons.filter((icon) => {
        return cleanTerm === "" || icon.name.includes(cleanTerm);
    });
};

// -----------------------------------
// ----------------------------------------------------------------
const defaultSize = "24";
const defaultColor = "currentColor";
const defaultPickerColor = "#000000";
/**
 *
 * @param {HTMLDialogElement} dialog
 * @returns
 */
function getThemeTextColor(dialog) {
    const themeColor = getComputedStyle(dialog)
        .getPropertyValue("--color-text-1")
        .trim();

    return themeColor || defaultPickerColor;
}
function buildLiquidTag(tagName, iconName, sizeValue, colorValue) {
    const parts = [tagName, iconName];
    const cleanSize = sizeValue.trim();
    const cleanColor = colorValue.trim();

    if (cleanSize !== "" && cleanSize !== defaultSize) {
        parts.push(`size=${cleanSize}`);
    }

    if (
        cleanColor !== "" &&
        cleanColor.toLowerCase() !== defaultColor.toLowerCase()
    ) {
        parts.push(`color=${cleanColor}`);
    }

    return `{% ${parts.join(" ")} %}`;
}
function syncDialog(dialog, tablerType, iconName) {
    const sizeInput = dialog.querySelector("[data-tabler-size]");
    const colorInput = dialog.querySelector("[data-tabler-color]");
    const colorValueText = dialog.querySelector("[data-tabler-color-value]");
    const code = dialog.querySelector("[data-tabler-code]");
    const status = dialog.querySelector("[data-tabler-status]");
    const previewIcon = dialog.querySelector(".jekyll-tabler-icon");
    const tagName = tablerType === "filled" ? "tabler_filled" : "tabler";
    const sizeValue = sizeInput?.value || "";
    const usesDefaultColor = !colorInput || colorInput.dataset.touched !== "true";
    const colorValue = usesDefaultColor ? "" : colorInput.value || "";
    const resolvedSize = sizeValue.trim() === "" ? defaultSize : sizeValue.trim();
    const resolvedColor =
        colorValue.trim() === "" ? defaultColor : colorValue.trim();
    const liquidTag = buildLiquidTag(tagName, iconName, sizeValue, colorValue);

    if (code) {
        code.textContent = liquidTag;
    }

    if (colorValueText) {
        colorValueText.textContent = usesDefaultColor
            ? defaultColor
            : resolvedColor.toLowerCase();
    }

    if (status) {
        status.textContent = "";
    }

    if (!previewIcon) return liquidTag;

    previewIcon.setAttribute("width", resolvedSize);
    previewIcon.setAttribute("height", resolvedSize);

    if (tablerType === "filled") {
        previewIcon.setAttribute("fill", resolvedColor);
    } else {
        previewIcon.setAttribute("stroke", resolvedColor);
    }

    return liquidTag;
}

function dialogRender() {
    const tablerIconBtns = document.querySelectorAll(".icon_card");
    if (tablerIconBtns.length > 0) {
        tablerIconBtns.forEach((btn) => {
            const tablerType = (
                btn.getAttribute("data-tabler-type") || ""
            ).toLowerCase();
            const iconName = (
                btn.getAttribute("data-tabler-name") || ""
            ).toLowerCase();
            const dialogID = btn.getAttribute("commandFor");
            if (!dialogID) return;
            const dialog = document.getElementById(dialogID);
            if (!dialog) return;
            const copyBtn = dialog.querySelector("[data-tabler-copy]");
            const sizeInput = dialog.querySelector("[data-tabler-size]");
            const colorInput = dialog.querySelector("[data-tabler-color]");
            const status = dialog.querySelector("[data-tabler-status]");
            if (!copyBtn || !sizeInput || !colorInput || !status) return;
            btn.addEventListener("click", () => {
                sizeInput.value = "";
                colorInput.value = getThemeTextColor(dialog);
                colorInput.dataset.touched = "false";
                syncDialog(dialog, tablerType, iconName);
            });
            sizeInput.addEventListener("input", () => {
                syncDialog(dialog, tablerType, iconName);
            });
            colorInput.addEventListener("input", () => {
                colorInput.dataset.touched = "true";
                syncDialog(dialog, tablerType, iconName);
            });
            copyBtn.addEventListener("click", async () => {
                const liquidTag = syncDialog(dialog, tablerType, iconName);

                try {
                    await navigator.clipboard.writeText(liquidTag);
                    status.textContent = "Liquid tag copied.";
                } catch {
                    status.textContent = "Unable to copy automatically.";
                }
            });
            dialog.addEventListener("click", (event) => {
                const rect = dialog.getBoundingClientRect();
                const isInDialog =
                    rect.top <= event.clientY &&
                    event.clientY <= rect.top + rect.height &&
                    rect.left <= event.clientX &&
                    event.clientX <= rect.left + rect.width;
                if (!isInDialog) {
                    dialog.close();
                }
            });
        });
    }
}

//-------------------------------------

/**
 * Fisher–Yates shuffle  Algorithm
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 * @param {Array<unknown>} array
 * @returns {Array<unknown>}
 */
function shuffleArray(array) {
    // Create a shallow copy to prevent mutating the original data
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements using destructuring assignment
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

//-------------------------------------

(() => {
    /**
     * @type {{name:string;type:"outline"|"filled";ds:string[];}[]}
     */
    let filteredIcons = []; // store icons from search input event
    let currentSearchTerm = "";
    const itemsPerPage = 50;
    let currentPage = 1;
    const iconTypeBtns = document.querySelectorAll("[data-tabler-type-btn]");
    /**
     * @type {HTMLInputElement | null}
     */
    const searchInput = document.querySelector("#icon-search-input");
    const noResultsMessage = document.querySelector("#no-results-message");
    /**
     * @type {{name:string;type:"outline"|"filled";ds:string[];}[]}
     */
    const icons = shuffleArray(tabler);
    const outlineIcons = icons.filter((i) => i.type === "outline");
    const filledIcons = icons.filter((i) => i.type === "filled");

    function paginateRender(totalPages) {
        const paginationContainer = document.querySelector("#pagination-container");
        if (!paginationContainer) return;
        paginationContainer.innerHTML = ""; // Clear first
        // if only one page or no page do not show pagination
        if (totalPages <= 1) return;
        const nav = document.createElement("nav");
        nav.className = "pagination-nav";

        // --- Previous Button (<) ---
        const prevBtn = document.createElement("button");
        prevBtn.innerText = "<";
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                main();
                window.scrollTo({ top: 0, behavior: "smooth" }); // Optional: Scroll up
            }
        });
        nav.appendChild(prevBtn);
        // --- Page Numbers Logic (with ellipsis support) ---
        const maxVisibleWindows = 2; // Adjust to show more adjacent pages

        for (let i = 1; i <= totalPages; i++) {
            // Always show first, last, current page, and pages immediately adjacent to current
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - maxVisibleWindows &&
                    i <= currentPage + maxVisibleWindows)
            ) {
                const pageBtn = document.createElement("button");
                pageBtn.innerText = i;
                if (i === currentPage) pageBtn.classList.add("active");

                pageBtn.addEventListener("click", () => {
                    currentPage = i;
                    main();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                });
                nav.appendChild(pageBtn);
            }
            // Render the ellipsis "..." safely where jumps happen
            else if (
                i === currentPage - maxVisibleWindows - 1 ||
                i === currentPage + maxVisibleWindows + 1
            ) {
                const ellipsis = document.createElement("span");
                ellipsis.innerText = "...";
                ellipsis.className = "pagination-ellipsis";
                nav.appendChild(ellipsis);
            }
        }
        // --- Next Button (>) ---
        const nextBtn = document.createElement("button");
        nextBtn.innerText = ">";
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                main();
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
        nav.appendChild(nextBtn);

        paginationContainer.appendChild(nav);
    }

    function setInputPlaceholder() {
        const iconType = localStorage.getItem(iconTypeStorageKey) ?? "all";
        const iconText =
            iconType === "outline"
                ? `outline ${outlineIcons.length}`
                : iconType === "filled"
                    ? `filled ${filledIcons.length}`
                    : `all ${icons.length}`;

        searchInput.setAttribute("placeholder", `Search ${iconText} icons ...`);
    }
    /**
     *
     * @param {string} text
     */
    function setTypeBtnActive(text) {
        for (const btn of iconTypeBtns) {
            const attr = btn.getAttribute("data-tabler-type");
            if (attr === text) {
                if (!btn.classList.contains("active")) {
                    btn.classList.add("active");
                }
            } else {
                if (btn.classList.contains("active")) {
                    btn.classList.remove("active");
                }
            }
        }
    }
    /**
     *
     * @param {HTMLButtonElement} btn
     */
    function iconTypeText(btn) {
        const text = btn.getAttribute("data-tabler-type");
        setTypeBtnActive(text);
        // guard for wrong press same btn
        if (text && text !== localStorage.getItem(iconTypeStorageKey)) {
            localStorage.setItem(iconTypeStorageKey, text);
            setInputPlaceholder();
        }
    }
    /**
     * @param {string} searchTerm
     * @param {boolean} eve
     * @returns {void}
     */
    function main(searchTerm = currentSearchTerm, eve = false) {
        const iconGrid = document.getElementById("icons-display");
        if (!iconGrid) return;
        /**
         * @type {"all"|"outline"|"filled"}
         */
        const iconType = localStorage.getItem(iconTypeStorageKey);
        currentSearchTerm = searchTerm;
        const sourceIcons =
            iconType === "outline"
                ? outlineIcons
                : iconType === "filled"
                    ? filledIcons
                    : icons;

        filteredIcons = filterIcons(sourceIcons, searchTerm);

        const iconsToRender =
            filteredIcons.length > 0 || eve ? filteredIcons : sourceIcons;
        const totalPages = Math.max(
            1,
            Math.ceil(iconsToRender.length / itemsPerPage),
        );
        currentPage = Math.min(currentPage, totalPages);

        iconGrid.innerHTML = slicedIconBtns(
            iconsToRender,
            (currentPage - 1) * itemsPerPage,
            itemsPerPage,
            36,
        ).join("");

        const gridChild = () => iconGrid.children.length;
        if (noResultsMessage) {
            if (gridChild() === 0) {
                noResultsMessage.style.display = "block";
            } else {
                noResultsMessage.style.display = "none";
            }
        }
        dialogRender();
        paginateRender(totalPages);
    }
    // call for DOM onload event
    setInputPlaceholder();
    setTypeBtnActive(localStorage.getItem(iconTypeStorageKey));
    main();

    // add event listener
    iconTypeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            iconTypeText(btn);
            currentPage = 1;
            main(currentSearchTerm, currentSearchTerm.trim() !== "");
        });
    });
    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            currentPage = 1;
            main(event.target.value, true);
        });
    }
    //----------------------------------------------
})();
// ---------------theme
(() => {
    const themeBtn = document.getElementById("data-theme");
    const rootElement = document.documentElement;
    const themeStorageKey = "mmdocs_local_theme";

    if (!themeBtn) return;

    let themeSwitchFrame = null;
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem(themeStorageKey);

        if (savedTheme === "dark" || savedTheme === "light") {
            return savedTheme;
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    };
    const applyTheme = (theme) => {
        rootElement.setAttribute("data-theme", theme);
        rootElement.style.colorScheme = theme;
        themeBtn.setAttribute("aria-pressed", String(theme === "dark"));
        themeBtn.setAttribute(
            "aria-label",
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        );
    };
    applyTheme(getInitialTheme());
    themeBtn.addEventListener("click", () => {
        const currentTheme = rootElement.getAttribute("data-theme");
        const nextTheme = currentTheme === "dark" ? "light" : "dark";

        rootElement.classList.add("theme-switching");
        applyTheme(nextTheme);
        localStorage.setItem(themeStorageKey, nextTheme);

        if (themeSwitchFrame !== null) {
            cancelAnimationFrame(themeSwitchFrame);
        }

        themeSwitchFrame = requestAnimationFrame(() => {
            rootElement.classList.remove("theme-switching");
            themeSwitchFrame = null;
        });
    });
})();
