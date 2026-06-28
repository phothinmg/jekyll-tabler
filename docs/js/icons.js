const iconBtns = document.querySelectorAll("[data-tabler-icon]");
(() => {
    const searchInput = document.querySelector("#icon-search-input");
    // 1. Select your "No icons found" element
    const noResultsMessage = document.querySelector("#no-results-message");

    function filterIcons(searchTerm = "") {
        const cleanTerm = searchTerm.trim().toLowerCase();
        let visibleCount = 0;

        iconBtns.forEach((btn) => {
            const label = (btn.getAttribute("aria-label") || "").toLowerCase();

            // 2. Partial keyword matching (.includes allows partial words)
            if (cleanTerm === "" || label.includes(cleanTerm)) {
                btn.style.display = "inline-flex";
                visibleCount++; // Track how many match
            } else {
                btn.style.display = "none";
            }
        });

        // 3. Toggle the "No icons found" message based on the count
        if (noResultsMessage) {
            if (visibleCount === 0) {
                noResultsMessage.style.display = "block"; // Show message
            } else {
                noResultsMessage.style.display = "none"; // Hide message
            }
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            filterIcons(event.target.value);
        });
    }

    // Initialize layout
    filterIcons();
})();

(() => {
    const defaultSize = "24";
    const defaultColor = "currentColor";

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
        const code = dialog.querySelector("[data-tabler-code]");
        const status = dialog.querySelector("[data-tabler-status]");
        const previewIcon = dialog.querySelector("svg[data-jekyll-tabler-icon]");
        const tagName = tablerType === "filled" ? "tabler_filled" : "tabler";
        const sizeValue = sizeInput?.value || "";
        const colorValue = colorInput?.value || "";
        const resolvedSize = sizeValue.trim() === "" ? defaultSize : sizeValue.trim();
        const resolvedColor =
            colorValue.trim() === "" ? defaultColor : colorValue.trim();
        const liquidTag = buildLiquidTag(tagName, iconName, sizeValue, colorValue);

        if (code) {
            code.textContent = liquidTag;
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

    iconBtns.forEach((btn) => {
        const tablerType = (
            btn.getAttribute("data-tabler-type") || ""
        ).toLowerCase();
        const controlArea = (btn.getAttribute("aria-controls") || "").toLowerCase();
        const iconName = (btn.getAttribute("aria-label") || "").toLowerCase();
        const dialog = document.getElementById(controlArea);
        if (!dialog) return;
        const closeBtn = dialog.querySelector("[data-tabler-close]");
        const copyBtn = dialog.querySelector("[data-tabler-copy]");
        const sizeInput = dialog.querySelector("[data-tabler-size]");
        const colorInput = dialog.querySelector("[data-tabler-color]");
        const status = dialog.querySelector("[data-tabler-status]");
        if (!closeBtn || !copyBtn || !sizeInput || !colorInput || !status) return;
        btn.addEventListener("click", () => {
            sizeInput.value = "";
            colorInput.value = "";
            syncDialog(dialog, tablerType, iconName);
            dialog.showModal();
        });
        closeBtn.addEventListener("click", () => dialog.close());
        sizeInput.addEventListener("input", () => {
            syncDialog(dialog, tablerType, iconName);
        });
        colorInput.addEventListener("input", () => {
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
})();
