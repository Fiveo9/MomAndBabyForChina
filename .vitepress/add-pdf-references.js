import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取项目根目录
const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'assets');
const referencesFile = path.join(rootDir, 'pages', '90-参考资料.md');

// 读取assets目录中的所有PDF文件
function getPdfFiles() {
  try {
    const files = fs.readdirSync(assetsDir);
    return files.filter(file =>
      path.extname(file).toLowerCase() === '.pdf' &&
      fs.statSync(path.join(assetsDir, file)).isFile()
    );
  } catch (error) {
    console.error('读取assets目录时出错:', error);
    return [];
  }
}

// 生成参考资料中的PDF列表
function generatePdfList(pdfFiles) {
  let content = '\n## 附录：PDF参考资料\n\n';

  pdfFiles.forEach(file => {
    const fileName = path.basename(file, '.pdf');
    const fileUrl = `/assets/${encodeURIComponent(file)}`;
    content += `- [${fileName}](${fileUrl})\n`;
  });

  return content;
}

// 更新参考资料文件
function updateReferencesFile() {
  try {
    const pdfFiles = getPdfFiles();

    if (pdfFiles.length === 0) {
      console.log('未找到PDF文件');
      return;
    }

    // 读取现有文件内容
    let content = fs.readFileSync(referencesFile, 'utf-8');

    // 移除可能已存在的附录部分（更加精确的正则表达式）
    const appendixRegex = /\n## 附录：PDF参考资料\n[\s\S]*?(?=\n##[^#]|$)/g;
    content = content.replace(appendixRegex, '');

    console.log(content.match(appendixRegex))

    // 确保文件末尾有换行符
    if (!content.endsWith('\n')) {
      content += '\n';
    }

    // 添加新的PDF列表
    content += generatePdfList(pdfFiles);

    // 写入文件
    fs.writeFileSync(referencesFile, content, 'utf-8');

    console.log(`成功添加 ${pdfFiles.length} 个PDF文件到参考资料`);
  } catch (error) {
    console.error('更新参考资料文件时出错:', error);
  }
}

// 执行更新
updateReferencesFile();
