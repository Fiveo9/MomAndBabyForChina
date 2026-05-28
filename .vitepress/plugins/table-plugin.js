/**
 * VitePress 表格插件
 * 为所有 Markdown 表格添加工具栏、滚动容器和导出能力所需的标记。
 */

function tablePlugin(md) {
  const defaultTableOpen = md.renderer.rules.table_open || function (tokens, idx, options, env, renderer) {
    return renderer.renderToken(tokens, idx, options);
  };

  const defaultTableClose = md.renderer.rules.table_close || function (tokens, idx, options, env, renderer) {
    return renderer.renderToken(tokens, idx, options);
  };

  md.renderer.rules.table_open = function (tokens, idx, options, env, renderer) {
    let result = '<div class="table-plugin" data-table-plugin>';
    result += '<div class="table-plugin__toolbar" aria-label="表格工具">';
    result += '<label class="table-plugin__number">固定行数<input type="number" min="0" value="0" inputmode="numeric" data-table-plugin-action="fixed-rows" aria-label="固定行数"></label>';
    result += '<label class="table-plugin__number">固定列数<input type="number" min="0" value="0" inputmode="numeric" data-table-plugin-action="fixed-columns" aria-label="固定列数"></label>';
    result += '<button class="table-plugin__export" type="button" data-table-plugin-action="export-csv">导出表格</button>';
    result += '</div>';
    result += '<div class="table-plugin__scroll">';
    result += defaultTableOpen(tokens, idx, options, env, renderer);

    return result;
  };

  md.renderer.rules.table_close = function (tokens, idx, options, env, renderer) {
    return `${defaultTableClose(tokens, idx, options, env, renderer)}</div></div>`;
  };
}

export default tablePlugin;
