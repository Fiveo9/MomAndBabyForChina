<script setup>
import DefaultTheme from "vitepress/theme";
import { onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vitepress";
import mediumZoom from "medium-zoom";
import SponsorButton from "./components/SponsorButton.vue";

const { Layout } = DefaultTheme;
const router = useRouter();

// Setup medium zoom with the desired options
const setupMediumZoom = () => {
  mediumZoom("[data-zoomable]", {
    background: "transparent",
  });
};

const normalizeCsvText = (value) => value.replace(/[\u200b-\u200d\ufeff]/g, "").replace(/\s+/g, " ").trim();

const resolveUrl = (value) => {
  if (!value) return "";

  try {
    return new URL(value, window.location.href).href;
  } catch {
    return value;
  }
};

const getImageExportText = (img) => {
  const src = resolveUrl(img.currentSrc || img.getAttribute("src") || "");
  const fileName = (() => {
    try {
      const pathName = new URL(src).pathname;
      return decodeURIComponent(pathName.split("/").pop() || "");
    } catch {
      return "";
    }
  })();
  const label = normalizeCsvText(img.alt || img.title || fileName || "截图");

  return src ? `[截图: ${label}] ${src}` : `[截图: ${label}]`;
};

const getCellExportText = (cell) => {
  const clone = cell.cloneNode(true);

  clone.querySelectorAll("br").forEach((br) => {
    br.replaceWith(document.createTextNode("\n"));
  });

  clone.querySelectorAll("img").forEach((img) => {
    img.replaceWith(document.createTextNode(getImageExportText(img)));
  });

  clone.querySelectorAll("a").forEach((link) => {
    const text = normalizeCsvText(link.textContent);
    const href = resolveUrl(link.getAttribute("href") || link.href || "");
    const value = href && text && !text.includes(href) ? `${text} (${href})` : text || href;

    link.replaceWith(document.createTextNode(value));
  });

  return normalizeCsvText(clone.textContent || "");
};

const escapeCsvValue = (value) => {
  const text = String(value ?? "");

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
};

const getCsvFileName = () => {
  const pageTitle = normalizeCsvText(document.querySelector("h1")?.textContent || document.title || "table");
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-");
  const safeTitle = pageTitle.replace(/[\\/:*?"<>|]/g, "-").slice(0, 40) || "table";

  return `${safeTitle}-${timestamp}.csv`;
};

const exportTableToCsv = (table) => {
  const rows = Array.from(table.rows).map((row) => {
    return Array.from(row.cells).map((cell) => escapeCsvValue(getCellExportText(cell))).join(",");
  });
  const csvContent = `\ufeff${rows.join("\n")}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = getCsvFileName();
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};

const getTableFromAction = (target) => {
  const root = target.closest("[data-table-plugin]");

  return root?.querySelector("table") || null;
};

const handleTableToolChange = (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) return;

  const action = target.dataset.tablePluginAction;
  const table = getTableFromAction(target);

  if (!table) return;

  if (action === "fixed-header") {
    table.classList.toggle("table__fixed-header", target.checked);
    target.setAttribute("aria-pressed", String(target.checked));
  }

  if (action === "fixed-first-column") {
    table.classList.toggle("table__fixed-first-column", target.checked);
    target.setAttribute("aria-pressed", String(target.checked));
  }
};

const handleTableToolClick = (event) => {
  if (!(event.target instanceof Element)) return;

  const target = event.target.closest('[data-table-plugin-action="export-csv"]');

  if (!(target instanceof HTMLButtonElement)) return;

  const table = getTableFromAction(target);

  if (!table) return;

  exportTableToCsv(table);
};

// Apply medium zoom on load
onMounted(() => {
  setupMediumZoom();
  document.addEventListener("change", handleTableToolChange);
  document.addEventListener("click", handleTableToolClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("change", handleTableToolChange);
  document.removeEventListener("click", handleTableToolClick);
});

// Subscribe to route changes to re-apply medium zoom effect
router.onAfterRouteChanged = setupMediumZoom;
</script>

<template>
  <Layout />
  <SponsorButton />
</template>

<style>
.medium-zoom-overlay {
  backdrop-filter: blur(5rem);
}

.medium-zoom-overlay,
.medium-zoom-image--opened {
  z-index: 999;
}
</style>
