// Google Apps Script — append form submissions to this Sheet + send email backup
// SETUP: paste this into a new Apps Script project bound to your "Indianapolis Leads" Sheet,
// deploy as Web App (Execute as: Me, Access: Anyone), copy the /exec URL,
// then set it as Vercel env var SHEETS_WEBHOOK_URL in the grooming-landing-indianapolis project.

const NOTIFY_EMAIL = 'njasik@icloud.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Source', 'Owner Name', 'Email', 'Phone',
                       'Locations', 'Goal', 'Inquiries', 'Message', 'Language']);
      sheet.getRange('A1:J1').setFontWeight('bold').setBackground('#0ea5e9').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

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
      data.lang      || ''
    ]);

    // Email backup (in addition to Telegram which is sent by the Vercel function)
    const subject = '🐾 New Indianapolis lead — ' + (data.source || 'form');
    const body =
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
      .createTextOutput(JSON.stringify({ ok: true }))
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
