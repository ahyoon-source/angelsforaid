/**
 * Angels for Aid ✦ form receiver
 *
 * Paste this whole file into Extensions → Apps Script on your Google Sheet,
 * then deploy it as a web app (see SPOTTED-SETUP.md). It receives two forms:
 *   spotted.html → the "Submissions" tab, plus a folder for each angel (a Google Doc of their
 *                  answers and their photos) inside "Angels for Aid ✦ Angels spotted"
 *   write.html   → the "Newsletter pieces" tab, plus a folder for each piece (a formatted
 *                  Google Doc and its images) inside "Angels for Aid ✦ Pieces"
 *
 * After pasting a new version, run "tidy" once to neaten the tabs you already have.
 */
const FORMS = {
  spotted: {
    sheet: "Submissions",
    folder: "Angels for Aid ✦ Angels spotted",
    first: ["Sent", "Status", "Read it", "Folder", "Name", "Location", "Occupation", "Instagram", "Cause", "Connection to the cause"],
    last: ["Photos", "Formatted post", "Submission code"],
    statuses: ["New", "Posted"],
    narrow: { "Sent": 140, "Status": 110, "Read it": 110, "Folder": 110, "Name": 150, "Location": 140, "Instagram": 140, "Cause": 180 },
    maxPhotos: 8
  },
  piece: {
    sheet: "Newsletter pieces",
    folder: "Angels for Aid ✦ Pieces",
    first: ["Sent", "Status", "Read it", "Folder", "Title", "Name", "Topic", "Word count", "Email", "Instagram / TikTok", "Location", "Subtitle"],
    last: ["Piece", "Bio", "Images", "Image credits", "Ready for Substack"],
    statuses: ["New", "Reviewing", "Scheduled", "Published", "Declined"],
    narrow: { "Sent": 140, "Status": 120, "Read it": 110, "Folder": 110, "Title": 260, "Name": 150, "Topic": 170, "Word count": 100, "Email": 200 },
    maxPhotos: 4
  }
};
const HEADER_COLOR = "#f9e1ea";
const ROW_HEIGHT = 42;       // every answer row stays this tall; click a cell to read all of it
const WIDE = 260;            // width for long-answer columns

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const d = JSON.parse(e.postData.contents);
    const form = FORMS[d.type] || FORMS.spotted;
    // Treat everything people type as plain text, never as a spreadsheet formula.
    const fields = {};
    Object.keys(d.fields || {}).forEach(k => {
      const v = d.fields[k];
      fields[k] = typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v;
    });
    const name = String(fields["Name"] || "").slice(0, 200);
    if (!name) return reply({ ok: false, error: "missing name" });

    // Each submission gets its own folder for its Doc and photos.
    const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HHmm");
    const label = d.type === "piece" ? `${String(fields["Title"] || "Untitled").slice(0, 120)} by ${name}` : name;
    const folder = getFolder(form.folder).createFolder(`${label} (${stamp})`);
    // Photos: anyone with the link can view, so they can go on the blog.
    const files = [];
    (d.photos || []).slice(0, form.maxPhotos).forEach((b64, i) => {
      const blob = Utilities.newBlob(Utilities.base64Decode(b64), "image/jpeg", `${name} ${stamp} (${i + 1}).jpg`);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      files.push(file);
    });
    const photoLinks = files.map(f => f.getUrl()).join("\n");

    const values = Object.assign({}, fields, { "Sent": new Date(), "Status": "New" });
    const docUrl = d.type === "piece" ? makePieceDoc(d.fields || {}, files, folder) : makeSpottedDoc(d.fields || {}, files, folder);
    values["Read it"] = `=HYPERLINK("${docUrl}","Open the doc")`;
    values["Folder"] = `=HYPERLINK("${folder.getUrl()}","Open folder")`;
    if (d.type === "piece") {
      values["Images"] = photoLinks;
      values["Ready for Substack"] = String(d.post || "");
    } else {
      values["Photos"] = photoLinks;
      values["Formatted post"] = String(d.post || "");
      values["Submission code"] = JSON.stringify({
        answers: d.answers || {},
        photos: files.map(f => "https://drive.google.com/thumbnail?id=" + f.getId() + "&sz=w1600")
      });
    }

    lock.waitLock(20000);
    const sheet = getSheet(form);
    const headers = ensureHeaders(sheet, Object.keys(values), form.last[0]);
    sheet.appendRow(headers.map(h => (h in values ? values[h] : "")));
    formatRows(sheet, sheet.getLastRow(), 1);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) + " [v4] " + String(err.stack || "").split("\n").slice(0, 3).join(" ") });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the web app URL in a browser shows this, so you can check it's live.
// It also lists the spreadsheet and tabs this script writes to, to help spot setup problems.
function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabs = ss.getSheets().map(s => `  ${s.getName()} (${s.getLastColumn()} columns)`).join("\n");
  return ContentService.createTextOutput(
    `Angels for Aid form receiver is running ✦ (v4)\n\nSpreadsheet: ${ss.getName()}\nTabs:\n${tabs}`);
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- the Google Doc for each newsletter piece ---------- */
function makePieceDoc(f, imageFiles, folder) {
  const title = String(f["Title"] || "Untitled");
  const doc = DocumentApp.create(`${title} by ${f["Name"]}`);
  const body = doc.getBody();
  body.setMarginLeft(72).setMarginRight(72);

  body.appendParagraph(title).setHeading(DocumentApp.ParagraphHeading.TITLE);
  if (f["Subtitle"]) body.appendParagraph(String(f["Subtitle"])).setHeading(DocumentApp.ParagraphHeading.SUBTITLE);
  const byline = "By " + f["Name"] + (f["Instagram / TikTok"] ? " (" + f["Instagram / TikTok"] + ")" : "");
  body.appendParagraph(byline).editAsText().setItalic(true);
  const meta = [f["Topic"], f["Word count"] ? f["Word count"] + " words" : "", f["Location"]].filter(String).join("  ✦  ");
  if (meta) body.appendParagraph(meta).editAsText().setFontSize(9).setForegroundColor("#8a7680");

  if (imageFiles[0]) addImage(body, imageFiles[0]);

  String(f["Piece"] || "").split(/\r?\n/).forEach(line => {
    if (line.trim()) body.appendParagraph(line.trim()).setSpacingAfter(10).setLineSpacing(1.3);
  });

  imageFiles.slice(1).forEach(file => addImage(body, file));

  if (f["Bio"] || f["Image credits"]) {
    body.appendHorizontalRule();
    if (f["Bio"]) body.appendParagraph("About the writer: " + f["Bio"]).editAsText().setItalic(true);
    if (f["Image credits"]) body.appendParagraph("Images: " + f["Image credits"]).editAsText().setFontSize(9);
  }

  return finishDoc(doc, folder);
}

/* ---------- the Google Doc for each spotted angel ---------- */
function makeSpottedDoc(f, imageFiles, folder) {
  const name = String(f["Name"] || "Angel");
  const doc = DocumentApp.create(`${name} ✦ Angel spotted`);
  const body = doc.getBody();
  body.setMarginLeft(72).setMarginRight(72);

  body.appendParagraph(name).setHeading(DocumentApp.ParagraphHeading.TITLE);
  const meta = [f["Occupation"], f["Location"], f["Instagram"]].filter(String).join("  ✦  ");
  if (meta) body.appendParagraph(meta).editAsText().setItalic(true);

  if (imageFiles[0]) addImage(body, imageFiles[0]);

  // Every other answer, as the question followed by what they wrote.
  const skip = ["Name", "Occupation", "Location", "Instagram"];
  Object.keys(f).filter(k => skip.indexOf(k) === -1 && String(f[k] || "").trim()).forEach(q => {
    body.appendParagraph(q).setHeading(DocumentApp.ParagraphHeading.HEADING3);
    String(f[q]).split(/\r?\n/).forEach(line => {
      if (line.trim()) body.appendParagraph(line.trim()).setSpacingAfter(8).setLineSpacing(1.3);
    });
  });

  imageFiles.slice(1).forEach(file => addImage(body, file));
  return finishDoc(doc, folder);
}

function finishDoc(doc, folder) {
  const body = doc.getBody(), first = body.getChild(0);
  if (body.getNumChildren() > 1 && first.getType() === DocumentApp.ElementType.PARAGRAPH && !first.asParagraph().getText()) {
    body.removeChild(first);
  }
  doc.saveAndClose();
  const file = DriveApp.getFileById(doc.getId());
  file.moveTo(folder);
  return file.getUrl();
}

function addImage(body, file) {
  const img = body.appendImage(file.getBlob());
  const max = 450;
  if (img.getWidth() > max) {
    img.setHeight(Math.round(img.getHeight() * max / img.getWidth())).setWidth(max);
  }
  img.getParent().asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER).setSpacingAfter(12);
}

/* ---------- sheet layout ---------- */
function getSheet(form) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(form.sheet);
  if (!sheet) sheet = ss.insertSheet(form.sheet);
  // A brand-new or empty tab gets its header row.
  if (sheet.getLastColumn() === 0) {
    sheet.appendRow(form.first.concat(form.last));
    layout(sheet, form);
  }
  return sheet;
}

// Header colors, frozen header row, column widths, the Status dropdown, and compact rows.
function layout(sheet, form) {
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, lastCol)
    .setFontWeight("bold").setBackground(HEADER_COLOR).setWrap(true).setVerticalAlignment("middle");
  sheet.setRowHeight(1, 48);
  headers.forEach((h, i) => sheet.setColumnWidth(i + 1, form.narrow[h] || WIDE));

  const statusCol = headers.indexOf("Status") + 1;
  if (statusCol > 0) {
    const rule = SpreadsheetApp.newDataValidation().requireValueInList(form.statuses, true).setAllowInvalid(true).build();
    sheet.getRange(2, statusCol, Math.max(sheet.getMaxRows() - 1, 1), 1).setDataValidation(rule);
  }
  const sentCol = headers.indexOf("Sent") + 1;
  if (sentCol > 0) sheet.getRange(2, sentCol, Math.max(sheet.getMaxRows() - 1, 1), 1).setNumberFormat("mmm d, yyyy h:mm am/pm");

  if (sheet.getLastRow() > 1) formatRows(sheet, 2, sheet.getLastRow() - 1);
}

// Keeps rows short: long answers are clipped to one line. Click a cell (or open the Doc) to read it all.
function formatRows(sheet, startRow, count) {
  const range = sheet.getRange(startRow, 1, count, sheet.getLastColumn());
  range.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP).setVerticalAlignment("middle");
  sheet.setRowHeightsForced(startRow, count, ROW_HEIGHT);
}

// Adds a column for any field the sheet doesn't have yet, so new questions just work.
function ensureHeaders(sheet, keys, insertBefore) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  keys.filter(k => headers.indexOf(k) === -1).forEach(k => {
    const at = headers.indexOf(insertBefore);
    if (at > -1) {
      sheet.insertColumnBefore(at + 1);
      sheet.getRange(1, at + 1).setValue(k).setFontWeight("bold").setBackground(HEADER_COLOR);
      headers.splice(at, 0, k);
    } else {
      sheet.getRange(1, headers.length + 1).setValue(k).setFontWeight("bold").setBackground(HEADER_COLOR);
      headers.push(k);
    }
  });
  return headers;
}

function getFolder(name) {
  const it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}

/** Run this once from the editor to create the tabs and folders and approve permissions. */
function setup() {
  Object.keys(FORMS).forEach(k => {
    getSheet(FORMS[k]);
    getFolder(FORMS[k].folder);
  });
}

/** Run this once after updating the script to neaten the tabs you already have. */
function tidy() {
  setup();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(FORMS).forEach(k => {
    const form = FORMS[k], sheet = ss.getSheetByName(form.sheet);
    if (!sheet) return;
    ensureHeaders(sheet, ["Read it", "Folder"], form.first[4]);
    layout(sheet, form);
  });
}
