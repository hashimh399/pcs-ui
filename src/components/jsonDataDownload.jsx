import React from "react";
import * as XLSX from "xlsx";

const DownloadButton = ({ data, fileName }) => {
  const handleDownload = () => {
    if (!data || !data.length) {
      alert("No data to download!");
      return;
    }

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Agent Data");

    // Generate a binary string from the workbook
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Convert binary string to Blob
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Trigger download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.xlsx`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  // Convert string to array buffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  return (
    <button onClick={handleDownload} className="btn btn-primary">
      Download Excel
    </button>
  );
};

export default DownloadButton;
