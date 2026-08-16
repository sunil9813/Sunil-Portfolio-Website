const sanitizePdfText = (value = "") => String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const wrapText = (value = "", max = 92) => {
  const words = String(value).split(/\s+/);
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + " " + word).trim().length > max) {
      lines.push(currentLine.trim());
      currentLine = word;
      return;
    }
    currentLine = `${currentLine} ${word}`.trim();
  });

  if (currentLine) lines.push(currentLine);
  return lines.length ? lines : [""];
};

const createSimplePdf = ({ title = "Document", lines = [] }) => {
  const content = ["BT", "/F1 22 Tf", "50 780 Td", `(${sanitizePdfText(title)}) Tj`, "/F1 10 Tf", "0 -32 Td"];
  const safeLines = lines.flatMap((line) => wrapText(line));

  safeLines.forEach((line) => {
    content.push(`(${sanitizePdfText(line)}) Tj`);
    content.push("0 -15 Td");
  });
  content.push("ET");

  const stream = content.join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${Buffer.byteLength(stream)} >> stream\n${stream}\nendstream endobj`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${object}\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
};

const escapePdfLiteral = sanitizePdfText;

const truncatePdfText = (value = "", max = 80) => {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
};

const approximateTextWidth = (text, fontSize) => String(text || "").length * fontSize * 0.48;

const addText = (content, { text, x, y, size = 12, font = "F1", color = "0 0 0", align = "left" }) => {
  const safeText = escapePdfLiteral(text);
  const textWidth = approximateTextWidth(text, size);
  const resolvedX = align === "center" ? x - textWidth / 2 : align === "right" ? x - textWidth : x;
  content.push("BT");
  content.push(`${color} rg`);
  content.push(`/${font} ${size} Tf`);
  content.push(`${resolvedX.toFixed(2)} ${y.toFixed(2)} Td`);
  content.push(`(${safeText}) Tj`);
  content.push("ET");
};

const addRect = (content, { x, y, width, height, fill, stroke, strokeWidth = 1 }) => {
  content.push("q");
  if (fill) content.push(`${fill} rg`);
  if (stroke) {
    content.push(`${stroke} RG`);
    content.push(`${strokeWidth} w`);
  }
  content.push(`${x} ${y} ${width} ${height} re`);
  content.push(fill && stroke ? "B" : fill ? "f" : "S");
  content.push("Q");
};

const addLine = (content, { x1, y1, x2, y2, stroke = "0 0 0", strokeWidth = 1 }) => {
  content.push("q");
  content.push(`${stroke} RG`);
  content.push(`${strokeWidth} w`);
  content.push(`${x1} ${y1} m`);
  content.push(`${x2} ${y2} l`);
  content.push("S");
  content.push("Q");
};

const addPath = (content, { commands, fill, stroke, strokeWidth = 1 }) => {
  content.push("q");
  if (fill) content.push(`${fill} rg`);
  if (stroke) {
    content.push(`${stroke} RG`);
    content.push(`${strokeWidth} w`);
  }
  content.push(commands.join("\n"));
  content.push(fill && stroke ? "B" : fill ? "f" : "S");
  content.push("Q");
};

const addCircle = (content, { x, y, radius, fill, stroke, strokeWidth = 1 }) => {
  const c = radius * 0.5522847498;
  addPath(content, {
    fill,
    stroke,
    strokeWidth,
    commands: [
      `${x + radius} ${y} m`,
      `${x + radius} ${y + c} ${x + c} ${y + radius} ${x} ${y + radius} c`,
      `${x - c} ${y + radius} ${x - radius} ${y + c} ${x - radius} ${y} c`,
      `${x - radius} ${y - c} ${x - c} ${y - radius} ${x} ${y - radius} c`,
      `${x + c} ${y - radius} ${x + radius} ${y - c} ${x + radius} ${y} c`,
      "h",
    ],
  });
};

const addQrPattern = (content, { x, y, size = 76, seed = "" }) => {
  const modules = 21;
  const cell = size / modules;
  const drawModule = (row, col, fill = "0.03 0.04 0.06") => {
    addRect(content, {
      x: x + col * cell,
      y: y + (modules - row - 1) * cell,
      width: cell * 0.92,
      height: cell * 0.92,
      fill,
    });
  };
  const drawFinder = (row, col) => {
    for (let r = 0; r < 7; r += 1) {
      for (let c = 0; c < 7; c += 1) {
        const edge = r === 0 || c === 0 || r === 6 || c === 6;
        const center = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        if (edge || center) drawModule(row + r, col + c);
      }
    }
  };

  addRect(content, { x: x - 5, y: y - 5, width: size + 10, height: size + 10, fill: "1 1 1" });
  drawFinder(0, 0);
  drawFinder(0, 14);
  drawFinder(14, 0);

  let hash = 0;
  String(seed || "certificate").split("").forEach((char) => {
    hash = (hash * 31 + char.charCodeAt(0)) % 9973;
  });

  for (let row = 0; row < modules; row += 1) {
    for (let col = 0; col < modules; col += 1) {
      const inFinder =
        (row < 8 && col < 8) ||
        (row < 8 && col > 12) ||
        (row > 12 && col < 8);
      if (inFinder) continue;
      const value = (row * 17 + col * 29 + hash + row * col) % 7;
      if (value === 0 || value === 2 || value === 5) drawModule(row, col);
    }
  }
};

const addCertificateSeal = (content, { x, y }) => {
  addPath(content, {
    fill: "0.04 0.17 0.33",
    commands: [
      `${x - 42} ${y - 12} m`,
      `${x - 72} ${y - 12} l`,
      `${x - 62} ${y - 28} l`,
      `${x - 72} ${y - 44} l`,
      `${x - 26} ${y - 44} l`,
      "h",
    ],
  });
  addPath(content, {
    fill: "0.04 0.17 0.33",
    commands: [
      `${x + 42} ${y - 12} m`,
      `${x + 72} ${y - 12} l`,
      `${x + 62} ${y - 28} l`,
      `${x + 72} ${y - 44} l`,
      `${x + 26} ${y - 44} l`,
      "h",
    ],
  });
  addCircle(content, { x, y, radius: 43, fill: "0.95 0.74 0.38", stroke: "0.74 0.48 0.17", strokeWidth: 1.5 });
  addCircle(content, { x, y, radius: 34, fill: "0.04 0.17 0.33", stroke: "1.00 0.92 0.66", strokeWidth: 1.4 });
  addCircle(content, { x, y, radius: 25, stroke: "1.00 0.92 0.66", strokeWidth: 0.7 });
  addText(content, { text: "PROFESSIONAL", x, y: y + 4, size: 6.5, font: "F2", color: "1 1 1", align: "center" });
  addText(content, { text: "CERTIFIED", x, y: y - 9, size: 8.5, font: "F2", color: "1.00 0.92 0.66", align: "center" });
};

const addRibbon = (content, { side = "left", offset = 0, color = "0 0 0", width = 24 }) => {
  const isLeft = side === "left";
  const xEdge = isLeft ? 0 : 842;
  const xInner = isLeft ? 88 + offset : 754 - offset;
  const xOuter = isLeft ? xInner - width : xInner + width;

  addPath(content, {
    fill: color,
    commands: isLeft
      ? [
          `${xEdge} 310 m`,
          `${xInner} 430 ${xOuter} 520 ${xInner} 595 c`,
          `${xOuter} 595 l`,
          `${xOuter - 8} 508 ${xInner - width} 410 ${xEdge} 350 c`,
          "h",
        ]
      : [
          `${xEdge} 310 m`,
          `${xInner} 430 ${xOuter} 520 ${xInner} 595 c`,
          `${xOuter} 595 l`,
          `${xOuter + 8} 508 ${xInner + width} 410 ${xEdge} 350 c`,
          "h",
        ],
  });
};

const addBottomRibbon = (content, { side = "left", offset = 0, color = "0 0 0", width = 24 }) => {
  const isLeft = side === "left";
  const xEdge = isLeft ? 0 : 842;
  const xInner = isLeft ? 100 + offset : 742 - offset;
  const xOuter = isLeft ? xInner - width : xInner + width;

  addPath(content, {
    fill: color,
    commands: isLeft
      ? [
          `${xEdge} 304 m`,
          `${xInner} 178 ${xOuter} 82 ${xInner} 0 c`,
          `${xOuter} 0 l`,
          `${xOuter - 8} 90 ${xInner - width} 186 ${xEdge} 254 c`,
          "h",
        ]
      : [
          `${xEdge} 304 m`,
          `${xInner} 178 ${xOuter} 82 ${xInner} 0 c`,
          `${xOuter} 0 l`,
          `${xOuter + 8} 90 ${xInner + width} 186 ${xEdge} 254 c`,
          "h",
        ],
  });
};

const createCertificatePdf = ({
  certificateId = "CERTIFICATE",
  student = "Student",
  course = "Course",
  completedOn = "-",
  issuedOn = "-",
  verifyUrl = "",
  brand = "Gorkcoder",
} = {}) => {
  const pageWidth = 842;
  const pageHeight = 595;
  const content = [];
  const safeStudent = truncatePdfText(student, 54);
  const safeCourse = truncatePdfText(course, 62);

  addRect(content, { x: 0, y: 0, width: pageWidth, height: pageHeight, fill: "0.05 0.05 0.24" });
  addRect(content, { x: 17, y: 17, width: pageWidth - 34, height: pageHeight - 34, fill: "1 1 1" });
  addRect(content, { x: 25, y: 25, width: pageWidth - 50, height: pageHeight - 50, stroke: "0.83 0.88 0.88", strokeWidth: 1.1 });
  addRect(content, { x: 34, y: 34, width: pageWidth - 68, height: pageHeight - 68, stroke: "0.92 0.96 0.95", strokeWidth: 0.8 });

  addText(content, { text: "G", x: pageWidth / 2 - 12, y: 526, size: 28, font: "F2", color: "0.05 0.65 0.39", align: "center" });
  addText(content, { text: "C", x: pageWidth / 2 + 11, y: 526, size: 28, font: "F2", color: "0.05 0.65 0.39", align: "center" });
  addText(content, { text: brand.toLowerCase(), x: pageWidth / 2, y: 508, size: 9, font: "F2", color: "0.05 0.65 0.39", align: "center" });
  addQrPattern(content, { x: 724, y: 468, size: 72, seed: certificateId });
  addText(content, { text: "Scan to verify", x: 760, y: 450, size: 8, font: "F1", color: "0.22 0.24 0.28", align: "center" });

  addText(content, { text: "G", x: 421, y: 183, size: 290, font: "F2", color: "0.92 0.98 0.95", align: "center" });
  addText(content, { text: "coder", x: 421, y: 78, size: 80, font: "F2", color: "0.94 0.98 0.96", align: "center" });

  addText(content, { text: "CERTIFICATE OF COMPLETION", x: pageWidth / 2, y: 445, size: 30, font: "F2", color: "0.11 0.13 0.18", align: "center" });
  addText(content, { text: "This certifies that", x: pageWidth / 2, y: 393, size: 11, font: "F2", color: "0.34 0.36 0.42", align: "center" });
  addText(content, { text: safeStudent, x: pageWidth / 2, y: 350, size: 20, font: "F2", color: "0.13 0.15 0.20", align: "center" });
  addText(content, { text: "has successfully completed all required lessons and is hereby declared a", x: pageWidth / 2, y: 303, size: 10.5, font: "F2", color: "0.22 0.24 0.30", align: "center" });
  addText(content, { text: safeCourse, x: pageWidth / 2, y: 264, size: 24, font: "F2", color: "0.14 0.16 0.21", align: "center" });

  addCertificateSeal(content, { x: pageWidth / 2, y: 207 });
  addText(content, { text: "The candidate has completed the course at the Professional level.", x: pageWidth / 2, y: 143, size: 10.5, font: "F2", color: "0.24 0.26 0.32", align: "center" });
  addText(content, { text: `Issued on ${issuedOn}`, x: pageWidth / 2, y: 108, size: 10.5, font: "F2", color: "0.34 0.36 0.42", align: "center" });

  addLine(content, { x1: 592, y1: 92, x2: 722, y2: 92, stroke: "0.18 0.19 0.22", strokeWidth: 1.2 });
  addText(content, { text: "Sunil", x: 657, y: 101, size: 24, font: "F3", color: "0.04 0.05 0.07", align: "center" });
  addText(content, { text: "Sunil B.K", x: 657, y: 70, size: 10.5, font: "F2", color: "0.16 0.17 0.22", align: "center" });
  addText(content, { text: `for ${brand}`, x: 657, y: 56, size: 9.5, font: "F2", color: "0.16 0.17 0.22", align: "center" });

  addText(content, { text: "Verify completion at", x: 39, y: 55, size: 8.5, font: "F2", color: "0.18 0.20 0.25" });
  addText(content, { text: truncatePdfText(verifyUrl, 76), x: 39, y: 41, size: 8, font: "F2", color: "0.06 0.21 0.35" });
  addText(content, { text: `Certificate ID: ${certificateId}`, x: 39, y: 76, size: 8.5, font: "F1", color: "0.42 0.45 0.50" });

  const stream = content.join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj",
    "6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Times-Italic >> endobj",
    `7 0 obj << /Length ${Buffer.byteLength(stream)} >> stream\n${stream}\nendstream endobj`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${object}\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
};

const createInvoicePdf = ({
  invoiceNumber = "-",
  status = "paid",
  customer = {},
  items = [],
  subtotal = 0,
  discountAmount = 0,
  total = 0,
  paymentMethod = "-",
  transactionId = "-",
  invoiceDate = "-",
  paidAt = "-",
  expiresAt = "-",
  refundStatus = "none",
  verificationUrl = "",
} = {}) => {
  const pageWidth = 612;
  const pageHeight = 792;
  const content = [];
  const safeStatus = String(status || "unpaid").toUpperCase();
  const statusColor = status === "paid" ? "0.73 0.97 0.82" : status === "refunded" ? "0.74 0.86 1" : status === "failed" || status === "cancelled" ? "1 0.78 0.82" : "1 0.92 0.67";
  const statusTextColor = status === "paid" ? "0.02 0.38 0.25" : status === "refunded" ? "0.08 0.22 0.52" : status === "failed" || status === "cancelled" ? "0.56 0.07 0.12" : "0.52 0.32 0.04";

  addRect(content, { x: 0, y: 0, width: pageWidth, height: pageHeight, fill: "0.06 0.08 0.11" });
  addCircle(content, { x: 70, y: 748, radius: 145, fill: "0.05 0.36 0.34" });
  addCircle(content, { x: 542, y: 742, radius: 155, fill: "0.26 0.16 0.42" });
  addRect(content, { x: 34, y: 30, width: 544, height: 732, fill: "0.07 0.10 0.13", stroke: "0.16 0.23 0.27", strokeWidth: 1.1 });

  addText(content, { text: "GORKCODER", x: 72, y: 718, size: 22, font: "F2", color: "1 1 1" });
  addText(content, { text: "DIGITAL PRODUCT INVOICE", x: 72, y: 698, size: 8.5, font: "F2", color: "0.49 0.91 0.88" });
  addText(content, { text: `#${invoiceNumber}`, x: 540, y: 718, size: 11, font: "F2", color: "0.78 0.71 1", align: "right" });
  addRect(content, { x: 466, y: 688, width: 74, height: 22, fill: statusColor });
  addText(content, { text: safeStatus, x: 503, y: 695, size: 8, font: "F2", color: statusTextColor, align: "center" });

  addText(content, { text: "INVOICE", x: 72, y: 654, size: 38, font: "F2", color: "1 1 1" });
  addText(content, { text: "Secure order receipt for digital access, courses, notes, and projects.", x: 72, y: 632, size: 9.5, color: "0.62 0.68 0.75" });

  addRect(content, { x: 72, y: 552, width: 210, height: 58, fill: "0.10 0.15 0.19", stroke: "0.19 0.27 0.31", strokeWidth: 0.8 });
  addText(content, { text: "BUYER", x: 88, y: 590, size: 7.5, font: "F2", color: "0.49 0.91 0.88" });
  addText(content, { text: truncatePdfText(customer.name || "Customer", 28), x: 88, y: 574, size: 13, font: "F2", color: "0.86 0.78 1" });
  addText(content, { text: truncatePdfText(customer.email || "-", 34), x: 88, y: 559, size: 8.5, color: "0.68 0.72 0.78" });

  addRect(content, { x: 314, y: 552, width: 226, height: 58, fill: "0.11 0.10 0.19", stroke: "0.22 0.20 0.31", strokeWidth: 0.8 });
  addText(content, { text: "PAYMENT", x: 330, y: 590, size: 7.5, font: "F2", color: "0.49 0.91 0.88" });
  addText(content, { text: `${String(paymentMethod || "-").toUpperCase()} / ${formatCurrencyForPdf(total)}`, x: 330, y: 574, size: 13, font: "F2", color: "1 1 1" });
  addText(content, { text: `Paid: ${paidAt}   Expires: ${expiresAt}`, x: 330, y: 559, size: 8.5, color: "0.68 0.72 0.78" });

  addRect(content, { x: 72, y: 494, width: 468, height: 28, fill: "0.17 0.20 0.25" });
  addText(content, { text: "DESCRIPTION", x: 88, y: 504, size: 8, font: "F2", color: "0.49 0.91 0.88" });
  addText(content, { text: "QTY", x: 386, y: 504, size: 8, font: "F2", color: "0.49 0.91 0.88", align: "right" });
  addText(content, { text: "AMOUNT", x: 522, y: 504, size: 8, font: "F2", color: "0.49 0.91 0.88", align: "right" });

  let y = 464;
  const visibleItems = (items.length ? items : [{ title: "Digital product", productModel: "Product", quantity: 1, price: total }]).slice(0, 8);
  visibleItems.forEach((item) => {
    addText(content, { text: truncatePdfText(item.title || "Item", 55), x: 88, y, size: 9.5, font: "F2", color: "0.94 0.96 0.98" });
    addText(content, { text: String(item.productModel || "Digital Product"), x: 88, y: y - 13, size: 7.5, color: "0.48 0.54 0.62" });
    addText(content, { text: String(item.quantity || 1), x: 386, y, size: 9, color: "0.76 0.80 0.86", align: "right" });
    addText(content, { text: formatCurrencyForPdf(Number(item.price || 0) * Number(item.quantity || 1)), x: 522, y, size: 9, color: "0.76 0.80 0.86", align: "right" });
    addLine(content, { x1: 88, y1: y - 24, x2: 522, y2: y - 24, stroke: "0.17 0.22 0.27", strokeWidth: 0.6 });
    y -= 42;
  });

  addRect(content, { x: 332, y: 228, width: 208, height: 86, fill: "0.10 0.14 0.18", stroke: "0.18 0.24 0.29", strokeWidth: 0.8 });
  addText(content, { text: "Subtotal", x: 350, y: 288, size: 9, color: "0.62 0.68 0.75" });
  addText(content, { text: formatCurrencyForPdf(subtotal), x: 522, y: 288, size: 9, font: "F2", color: "0.86 0.90 0.95", align: "right" });
  addText(content, { text: "Discount", x: 350, y: 267, size: 9, color: "0.62 0.68 0.75" });
  addText(content, { text: `- ${formatCurrencyForPdf(discountAmount)}`, x: 522, y: 267, size: 9, font: "F2", color: "0.18 0.85 0.50", align: "right" });
  addLine(content, { x1: 350, y1: 252, x2: 522, y2: 252, stroke: "0.20 0.25 0.30", strokeWidth: 0.8 });
  addText(content, { text: "Grand Total", x: 350, y: 232, size: 15, font: "F2", color: "0.86 0.78 1" });
  addText(content, { text: formatCurrencyForPdf(total), x: 522, y: 232, size: 16, font: "F2", color: "1 1 1", align: "right" });

  addRect(content, { x: 72, y: 156, width: 468, height: 44, fill: "0.08 0.44 0.48", stroke: "0.22 0.35 0.52", strokeWidth: 0.7 });
  addText(content, { text: "Transaction", x: 90, y: 180, size: 8, font: "F2", color: "1 1 1" });
  addText(content, { text: truncatePdfText(transactionId, 42), x: 90, y: 166, size: 8, color: "0.86 0.92 0.98" });
  addText(content, { text: invoiceDate, x: 522, y: 172, size: 9, font: "F2", color: "1 1 1", align: "right" });

  addRect(content, { x: 72, y: 84, width: 294, height: 48, fill: "0.10 0.14 0.18", stroke: "0.18 0.24 0.29", strokeWidth: 0.8 });
  addText(content, { text: "Support", x: 88, y: 112, size: 8, font: "F2", color: "0.49 0.91 0.88" });
  addText(content, { text: "Need help? Contact support@gorkcoder.com from your account dashboard.", x: 88, y: 96, size: 8, color: "0.62 0.68 0.75" });
  addText(content, { text: refundStatus && refundStatus !== "none" ? `Refund status: ${refundStatus}` : "Refund status: none", x: 88, y: 76, size: 8, color: "0.62 0.68 0.75" });

  addQrPattern(content, { x: 444, y: 70, size: 70, seed: verificationUrl || invoiceNumber });
  addText(content, { text: "Invoice proof", x: 479, y: 56, size: 8, font: "F2", color: "0.62 0.68 0.75", align: "center" });
  addText(content, { text: "Sunil B.K", x: 72, y: 44, size: 17, font: "F3", color: "1 1 1" });
  addText(content, { text: "This is a computer-generated invoice and does not require a physical signature.", x: 306, y: 32, size: 8, color: "0.52 0.58 0.65", align: "center" });

  const stream = content.join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj",
    "6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Times-Italic >> endobj",
    `7 0 obj << /Length ${Buffer.byteLength(stream)} >> stream\n${stream}\nendstream endobj`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${object}\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
};

const formatCurrencyForPdf = (value = 0) => `Rs. ${Number(value || 0).toLocaleString()}`;

module.exports = { createSimplePdf, createCertificatePdf, createInvoicePdf };
