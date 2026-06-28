// display icons par page and search icons
function iconsDisplay() {
    const iconBtns = Array.from(document.querySelectorAll("[data-tabler-icon]"));
    const searchInput = document.querySelector("#icon-search-input");
    const noResultsMessage = document.querySelector("#no-results-message");

    // 1. Create or select a container for the navigation bar
    const paginationContainer = document.querySelector("#pagination-container");

    // Pagination Configuration
    const itemsPerPage = 70;
    let currentPage = 1;
    let filteredIcons = []; // Stores only the icons matching the search

    function filterIcons(searchTerm = "") {
        const cleanTerm = searchTerm.trim().toLowerCase();

        // Step 1: Filter icons matching the search term
        filteredIcons = iconBtns.filter((btn) => {
            const label = (btn.getAttribute("data-tabler-name") || "").toLowerCase();
            return cleanTerm === "" || label.includes(cleanTerm);
        });

        // Step 2: Reset to page 1 whenever a new search is performed
        currentPage = 1;

        // Step 3: Render the layout
        updateDisplay();
    }

    function updateDisplay() {
        const totalItems = filteredIcons.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Step 4: Toggle "No results" message
        if (noResultsMessage) {
            noResultsMessage.style.display = totalItems === 0 ? "block" : "none";
        }

        // Step 5: Loop through ALL icons to set display rules
        iconBtns.forEach((btn) => {
            // First, hide everything by default
            btn.style.display = "none";
        });

        if (totalItems > 0) {
            // Calculate slice indexes for the current page
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

            // Show only the 100 matching icons belonging to the current page
            for (let i = startIndex; i < endIndex; i++) {
                filteredIcons[i].style.display = "inline-flex";
            }
        }

        // Step 6: Render the navigation elements (< 1 2 ... >)
        renderPaginationControls(totalPages);
    }

    function renderPaginationControls(totalPages) {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = ""; // Clear existing buttons

        // Don't show pagination if there is only 1 page or no items
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
                updateDisplay();
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
                    updateDisplay();
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
                updateDisplay();
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
        nav.appendChild(nextBtn);

        paginationContainer.appendChild(nav);
    }

    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            filterIcons(event.target.value);
        });
    }

    // Initialize layout
    filterIcons();
}
// pop up for each icon
function iconPopUp() {
    const defaultSize = "24";
    const defaultColor = "currentColor";
    const defaultPickerColor = "#000000";

    const iconBtns = document.querySelectorAll("[data-tabler-icon]");
    const iconDialogs = document.querySelectorAll("[data-tabler-dialog]");

    function getDialogObj() {
        /**
         * @type {{el:Element;idx:number;}[]}
         */
        const dialogObj = [];

        iconDialogs.forEach((el, idx) => {
            dialogObj.push({ el, idx });
        });
        return dialogObj;
    }

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
        const previewIcon = dialog.querySelector("svg[data-jekyll-tabler-icon]");
        const tagName = tablerType === "filled" ? "tabler_filled" : "tabler";
        const sizeValue = sizeInput?.value || "";
        const usesDefaultColor =
            !colorInput || colorInput.dataset.touched !== "true";
        const colorValue = usesDefaultColor ? "" : colorInput.value || "";
        const resolvedSize =
            sizeValue.trim() === "" ? defaultSize : sizeValue.trim();
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

    iconBtns.forEach((btn, idx) => {
        const tablerType = (
            btn.getAttribute("data-tabler-type") || ""
        ).toLowerCase();
        // const controlArea = (btn.getAttribute("aria-controls") || "").toLowerCase();
        const iconName = (btn.getAttribute("data-tabler-name") || "").toLowerCase();
        // const dialog = document.getElementById(controlArea);
        const dialogObj = getDialogObj();
        const dia = dialogObj.find((dia) => dia.idx === idx);
        if (!dia) return;
        const dialog = dia.el;
        const closeBtn = dialog.querySelector("[data-tabler-close]");
        const copyBtn = dialog.querySelector("[data-tabler-copy]");
        const sizeInput = dialog.querySelector("[data-tabler-size]");
        const colorInput = dialog.querySelector("[data-tabler-color]");
        const status = dialog.querySelector("[data-tabler-status]");
        if (!closeBtn || !copyBtn || !sizeInput || !colorInput || !status) return;
        btn.addEventListener("click", () => {
            sizeInput.value = "";
            colorInput.value = getThemeTextColor(dialog);
            colorInput.dataset.touched = "false";
            syncDialog(dialog, tablerType, iconName);
            dialog.showModal();
        });
        closeBtn.addEventListener("click", () => dialog.close());
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

// Initialize all

iconsDisplay();
iconPopUp();
