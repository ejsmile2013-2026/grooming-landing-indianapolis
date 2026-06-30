// Google Apps Script — append form submissions to this Sheet + send email backup
// SETUP: paste this into a new Apps Script project bound to your "Indianapolis Leads" Sheet,
// deploy as Web App (Execute as: Me, Access: Anyone), copy the /exec URL,
// then set it as Vercel env var SHEETS_WEBHOOK_URL in the grooming-landing-indianapolis project.
//
// LEAD TEMPERATURE (column K = "Temp") is auto-scored on each submission:
//   +1 if phone is present
//   +1 if locations is "2-3" or "4+" (multi-site = bigger business)
//   +1 if goal field is filled
//   +1 if inquiries is "30-100" or "100+" (real volume)
//   Score 3-4 → 🔴 hot   Score 2 → 🟡 warm   Score 0-1 → ⚪ cold
//
// Green (🟢) is intentionally NOT used here — it is reserved for success statuses
// such as: replied, call booked, closed, paid. Add those manually in a separate column.
//
// To populate Temp on existing rows that were created before this column existed,
// open this script and click Run → backfillTemp (one-time).

const NOTIFY_EMAIL = 'njasik@icloud.com';

function classifyTemp(d) {
  let score = 0;
  if (d.phone && String(d.phone).trim()) score++;
  if (d.locations === '2-3' || d.locations === '4+') score++;
  if (d.goal && String(d.goal).trim()) score++;
  if (d.inquiries === '30-100' || d.inquiries === '100+') score++;
  if (score >= 3) return '🔴 hot';
  if (score === 2) return '🟡 warm';
  return '⚪ cold';
}

function ensureTempHeader(sheet) {
  if (sheet.getRange('K1').getValue() !== 'Temp') {
    sheet.getRange('K1')
      .setValue('Temp')
      .setFontWeight('bold')
      .setBackground('#0ea5e9')
      .setFontColor('#ffffff');
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Source', 'Owner Name', 'Email', 'Phone',
                       'Locations', 'Goal', 'Inquiries', 'Message', 'Language', 'Temp']);
      sheet.getRange('A1:K1').setFontWeight('bold').setBackground('#0ea5e9').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    } else {
      ensureTempHeader(sheet);
    }

    const temp = classifyTemp(data);

    sheet.appendRow([
      new Date(),
      data.source    || '',
      data.ownerName || '',
      data.email     || '',
      data.phone     || '',
      data.locations || '',
      data.goal      || '',
      data.inquiries || '',
      data.message   || '',
      data.lang      || '',
      temp
    ]);

    // Email backup
    const subject = '🐾 New Indianapolis lead — ' + temp + ' — ' + (data.source || 'form');
    const body =
      'Temp:        ' + temp + '\n' +
      'Source:      ' + (data.source    || '-') + '\n' +
      'Name:        ' + (data.ownerName || '-') + '\n' +
      'Email:       ' + (data.email     || '-') + '\n' +
      'Phone:       ' + (data.phone     || '-') + '\n' +
      'Locations:   ' + (data.locations || '-') + '\n' +
      'Goal:        ' + (data.goal      || '-') + '\n' +
      'Inquiries:   ' + (data.inquiries || '-') + '\n' +
      'Message:     ' + (data.message   || '-') + '\n' +
      'Language:    ' + (data.lang      || '-') + '\n' +
      'Submitted:   ' + new Date().toISOString() + '\n\n' +
      'Live proposal: https://grooming-landing-indianapolis.vercel.app/proposal-us.html';
    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, temp: temp }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('Indianapolis leads webhook is alive. Use POST.');
}

// One-time helper — run from the editor (Run ▶ backfillTemp) to populate
// the Temp column for rows that were created before this column existed.
// Reads columns E (Phone), F (Locations), G (Goal), H (Inquiries) from each row.
function backfillTemp() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  ensureTempHeader(sheet);
  if (lastRow < 2) return;

  const values = sheet.getRange(2, 5, lastRow - 1, 4).getValues(); // E..H for rows 2..lastRow
  const temps = values.map(function (row) {
    const phone     = row[0];
    const locations = row[1];
    const goal      = row[2];
    const inquiries = row[3];
    return [classifyTemp({ phone: phone, locations: locations, goal: goal, inquiries: inquiries })];
  });
  sheet.getRange(2, 11, temps.length, 1).setValues(temps);
}
