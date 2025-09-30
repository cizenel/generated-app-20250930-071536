import { useState } from 'react';
import { toast } from 'sonner';
type ExportableData = Record<string, any>[];
export function useDataExport(data: ExportableData, fileName: string) {
  const [isExporting, setIsExporting] = useState(false);
  const exportToExcel = async () => {
    if (isExporting) return;
    setIsExporting(true);
    toast.info('Exporting to Excel...');
    try {
      // eslint-disable-next-line import/no-unresolved
      const xlsx = await import('xlsx');
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Data');
      xlsx.writeFile(workbook, `${fileName}.xlsx`);
      toast.success('Exported to Excel successfully!');
    } catch (error) {
      console.error('Excel export failed:', error);
      toast.error('Failed to export to Excel.');
    } finally {
      setIsExporting(false);
    }
  };
  const exportToPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    toast.info('Exporting to PDF...');
    try {
      // eslint-disable-next-line import/no-unresolved
      const { jsPDF } = await import('jspdf');
      // eslint-disable-next-line import/no-unresolved
      const { autoTable } = await import('jspdf-autotable');
      const doc = new jsPDF();
      const headers = Object.keys(data[0] || {});
      const body = data.map(row => headers.map(header => row[header]));
      autoTable(doc, {
        head: [headers],
        body: body,
        didDrawPage: (data) => {
          doc.text(fileName, data.settings.margin.left, 15);
        },
      });
      doc.save(`${fileName}.pdf`);
      toast.success('Exported to PDF successfully!');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export to PDF.');
    } finally {
      setIsExporting(false);
    }
  };
  const exportToDocx = async () => {
    // Note: This is a simplified DOCX export. For complex layouts, a more robust library might be needed.
    if (isExporting) return;
    setIsExporting(true);
    toast.info('Exporting to DOCX...');
    try {
        const headers = Object.keys(data[0] || {});
        let content = `<h1>${fileName}</h1><table border="1"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
        data.forEach(row => {
            content += `<tr>${headers.map(h => `<td>${row[h]}</td>`).join('')}</tr>`;
        });
        content += '</tbody></table>';
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Export HTML to Word Document</title></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + content + footer;
        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = `${fileName}.doc`;
        fileDownload.click();
        document.body.removeChild(fileDownload);
        toast.success('Exported to DOCX successfully!');
    } catch (error) {
        console.error('DOCX export failed:', error);
        toast.error('Failed to export to DOCX.');
    } finally {
        setIsExporting(false);
    }
  };
  return {
    isExporting,
    exportToExcel,
    exportToPdf,
    exportToDocx,
  };
}