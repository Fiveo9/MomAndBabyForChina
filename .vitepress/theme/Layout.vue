<script setup>
import DefaultTheme from "vitepress/theme";
import { onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vitepress";
import mediumZoom from "medium-zoom";
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

const getTableRootFromAction = (target) => target.closest("[data-table-plugin]");

const getTableSize = (table) => {
  const rows = Array.from(table.rows);
  const columns = rows.reduce((max, row) => Math.max(max, row.cells.length), 0);

  return { rows: rows.length, columns };
};

const clampFixedCount = (value, max) => {
  const count = Number.parseInt(value, 10);

  if (Number.isNaN(count)) return 0;

  return Math.min(Math.max(count, 0), max);
};

const clearTableSticky = (table) => {
  table.classList.remove("table__has-fixed-rows", "table__has-fixed-columns");
  table.querySelectorAll("[data-table-plugin-sticky]").forEach((cell) => {
    delete cell.dataset.tablePluginSticky;
    delete cell.dataset.tablePluginStickyRow;
    delete cell.dataset.tablePluginStickyColumn;
    cell.style.position = "";
    cell.style.top = "";
    cell.style.left = "";
    cell.style.zIndex = "";
  });
};

const getColumnOffsets = (rows, columnCount) => {
  const offsets = [];
  let offset = 0;

  for (let index = 0; index < columnCount; index += 1) {
    offsets[index] = offset;
    offset += rows.find((row) => row.cells[index])?.cells[index]?.getBoundingClientRect().width || 0;
  }

  return offsets;
};

const applyTableSticky = (table, fixedRows, fixedColumns) => {
  const rows = Array.from(table.rows);
  const { rows: maxRows, columns: maxColumns } = getTableSize(table);
  const rowCount = clampFixedCount(fixedRows, maxRows);
  const columnCount = clampFixedCount(fixedColumns, maxColumns);
  const columnOffsets = getColumnOffsets(rows, columnCount);
  let rowOffset = 0;

  clearTableSticky(table);

  table.classList.toggle("table__has-fixed-rows", rowCount > 0);
  table.classList.toggle("table__has-fixed-columns", columnCount > 0);

  rows.forEach((row, rowIndex) => {
    const isFixedRow = rowIndex < rowCount;
    const top = rowOffset;

    if (isFixedRow) {
      rowOffset += row.getBoundingClientRect().height;
    }

    Array.from(row.cells).forEach((cell, columnIndex) => {
      const isFixedColumn = columnIndex < columnCount;

      if (!isFixedRow && !isFixedColumn) return;

      cell.dataset.tablePluginSticky = "";
      cell.style.position = "sticky";

      if (isFixedRow) {
        cell.dataset.tablePluginStickyRow = "";
        cell.style.top = `${top}px`;
      }

      if (isFixedColumn) {
        cell.dataset.tablePluginStickyColumn = "";
        cell.style.left = `${columnOffsets[columnIndex]}px`;
      }

      cell.style.zIndex = isFixedRow && isFixedColumn ? "4" : isFixedRow ? "3" : "2";
    });
  });
};

const syncTablePluginControls = (root) => {
  const table = root.querySelector("table");
  const rowsInput = root.querySelector('[data-table-plugin-action="fixed-rows"]');
  const columnsInput = root.querySelector('[data-table-plugin-action="fixed-columns"]');

  if (!(table instanceof HTMLTableElement) || !(rowsInput instanceof HTMLInputElement) || !(columnsInput instanceof HTMLInputElement)) return;

  const { rows, columns } = getTableSize(table);
  const fixedRows = clampFixedCount(rowsInput.value, rows);
  const fixedColumns = clampFixedCount(columnsInput.value, columns);

  rowsInput.max = String(rows);
  columnsInput.max = String(columns);
  rowsInput.value = String(fixedRows);
  columnsInput.value = String(fixedColumns);

  root.classList.toggle("is-pinned-scroll", fixedRows > 0 || fixedColumns > 0);
  applyTableSticky(table, fixedRows, fixedColumns);
};

const syncAllTablePluginControls = () => {
  document.querySelectorAll("[data-table-plugin]").forEach((root) => {
    syncTablePluginControls(root);
  });
};

let stickyRefreshFrame = 0;

const requestStickyRefresh = () => {
  cancelAnimationFrame(stickyRefreshFrame);
  stickyRefreshFrame = requestAnimationFrame(syncAllTablePluginControls);
};

const handleTableToolInput = (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) return;

  const action = target.dataset.tablePluginAction;
  const root = getTableRootFromAction(target);

  if (!root || (action !== "fixed-rows" && action !== "fixed-columns")) return;

  syncTablePluginControls(root);
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
  syncAllTablePluginControls();
  document.addEventListener("input", handleTableToolInput);
  document.addEventListener("change", handleTableToolInput);
  document.addEventListener("click", handleTableToolClick);
  window.addEventListener("resize", requestStickyRefresh);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(stickyRefreshFrame);
  document.removeEventListener("input", handleTableToolInput);
  document.removeEventListener("change", handleTableToolInput);
  document.removeEventListener("click", handleTableToolClick);
  window.removeEventListener("resize", requestStickyRefresh);
});

// Subscribe to route changes to re-apply medium zoom effect
router.onAfterRouteChanged = () => {
  setupMediumZoom();
  requestStickyRefresh();
};
</script>

<template>
  <Layout />
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
