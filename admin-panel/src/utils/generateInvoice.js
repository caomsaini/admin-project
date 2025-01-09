import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateInvoice = (invoiceData) => {
  const doc = new jsPDF();

  // Add Company Logo
  const logoUrl = require("../assets/kaso_black_transparant.png"); // Replace with your logo path
  doc.addImage(logoUrl, "PNG", 10, 10, 50, 20);

  // Header Section
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", 105, 20, "center");

  // Company Details
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Kaso Electronics Private Limited\nB-107, Sweta Park, Near Banga Sanga,\nRNP Park, Bhayander East, Thane, Maharashtra - 401105",
    10,
    40
  );
  doc.text("GSTIN: 27AABCK8741K1Z3", 10, 60);
  doc.text("Phone: +91-9999999999 | Email: support@kaso.com", 10, 70);

  // Invoice Details
  doc.text(`Invoice Number: ${invoiceData.invoiceNumber || "N/A"}`, 140, 40);
  doc.text(`Invoice Date: ${invoiceData.invoiceDate || "N/A"}`, 140, 50);
  doc.text(`Order Number: ${invoiceData.orderNumber || "N/A"}`, 140, 60);
  doc.text(`Order Date: ${invoiceData.orderDate || "N/A"}`, 140, 70);
  doc.text(`Payment Mode: ${invoiceData.paymentMode || "N/A"}`, 140, 80);

  // Customer Details
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 10, 90);
  doc.setFont("helvetica", "normal");
  doc.text(invoiceData.customerName || "N/A", 10, 100);
  doc.text(invoiceData.customerAddress || "N/A", 10, 110);
  doc.text(`GSTIN: ${invoiceData.customerGSTIN || "N/A"}`, 10, 120);

  // Product Table
  const products = invoiceData.products || []; // Safeguard for missing products
  if (products.length > 0) {
    autoTable(doc, {
      startY: 130,
      head: [["S.No", "Product Name", "Color", "HSN Code", "Product No.", "Qty", "Price", "Taxable Value"]],
      body: products.map((product, index) => [
        index + 1,
        product.name,
        product.hsnCode,
        product.quantity,
        `₹${product.price.toFixed(2)}`,
        `₹${product.taxableValue.toFixed(2)}`,
      ]),
      styles: { halign: "center" },
      headStyles: { fillColor: [0, 112, 192], textColor: [255, 255, 255] },
    });
  } else {
    doc.text("No products available.", 10, 130);
  }

  // Total Section
  const tableEndY = doc.lastAutoTable?.finalY + 10 || 140;
  doc.setFont("helvetica", "bold");
  doc.text("Total Amount:", 140, tableEndY);
  doc.text(`₹${(invoiceData.totalAmount || 0).toFixed(2)}`, 180, tableEndY, "right");

  // Footer Section
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Thank you for your business!\nFor any inquiries, contact us at support@kaso.com",
    10,
    doc.internal.pageSize.height - 20
  );

  // Save PDF
  doc.save(`Invoice-${invoiceData.invoiceNumber || "Unknown"}.pdf`);
};

export default generateInvoice;
