import React from "react";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";

const flattenObject = (obj, prefix = "") => {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? prefix + "." : "";
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], pre + key));
    } else {
      acc[pre + key] = obj[key];
    }
    return acc;
  }, {});
};

const ExcelDownloadButton = ({ data, fileName }) => {
  const handleDownload = () => {
    if (!data || !data.length) {
      alert("No data to download!");
      return;
    }
    // Flatten the nested objects in data
    const flattenedData = data.map((item) => flattenObject(item));

    // Create a new worksheet
    const ws = XLSX.utils.json_to_sheet(flattenedData);

    // Calculate column widths
    const columnWidths = [];
    XLSX.utils.sheet_to_json(ws, { header: 1 }).forEach((row) => {
      row.forEach((cell, columnIndex) => {
        if (cell !== null && cell !== undefined) {
          // Check for null or undefined values
          const cellWidth = cell.toString().length * 1.5; // Adjust this factor according to your preference
          if (
            !columnWidths[columnIndex] ||
            columnWidths[columnIndex] < cellWidth
          ) {
            columnWidths[columnIndex] = cellWidth;
          }
        }
      });
    });

    // Apply column widths
    ws["!cols"] = columnWidths.map((width) => ({ width }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <div>
      <Button variant="primary" onClick={handleDownload}>
        Download Report
      </Button>
    </div>
  );
};

export default ExcelDownloadButton;
