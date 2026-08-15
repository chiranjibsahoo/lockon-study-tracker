// Helper for Google Sheets Web App Synchronization

export async function fetchFromGoogleSheet(webAppUrl) {
  if (!webAppUrl || !webAppUrl.trim()) return null;
  try {
    const response = await fetch(`${webAppUrl.trim()}?action=getData`, {
      method: 'GET',
      redirect: 'follow',
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const result = await response.json();
    if (result && result.status === 'success' && result.data) {
      return result.data;
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch from Google Sheet:', err);
    return null;
  }
}

export async function saveToGoogleSheet(webAppUrl, allData) {
  if (!webAppUrl || !webAppUrl.trim()) return false;
  try {
    const response = await fetch(webAppUrl.trim(), {
      method: 'POST',
      mode: 'no-cors', // Apps Script web apps often require no-cors or redirect handling
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'saveData',
        data: allData,
      }),
    });
    return true;
  } catch (err) {
    console.error('Failed to save to Google Sheet:', err);
    return false;
  }
}

export const APPS_SCRIPT_TEMPLATE = `
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("LOCKON_DB");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("LOCKON_DB");
  }
  var cellValue = sheet.getRange("A1").getValue();
  var data = {};
  if (cellValue) {
    try {
      data = JSON.parse(cellValue);
    } catch (err) {}
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "success", data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    if (contents.action === "saveData" && contents.data) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("LOCKON_DB");
      if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("LOCKON_DB");
      }
      sheet.getRange("A1").setValue(JSON.stringify(contents.data));
      
      // Also format human readable sheets for easy viewing
      exportHumanReadableData(contents.data);
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function exportHumanReadableData(d) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Study Log Sheet
  if (d.studyLog && d.studyLog.length) {
    var slSheet = ss.getSheetByName("Study Logs") || ss.insertSheet("Study Logs");
    slSheet.clear();
    slSheet.appendRow(["ID", "Date", "Subject", "Duration (Min)", "Topic", "Study Type"]);
    d.studyLog.forEach(function(row) {
      slSheet.appendRow([row.id, row.date, row.subject, row.duration, row.topic, row.studyType]);
    });
  }
  
  // Test Results Sheet
  if (d.testResults && d.testResults.length) {
    var trSheet = ss.getSheetByName("Test Results") || ss.insertSheet("Test Results");
    trSheet.clear();
    trSheet.appendRow(["ID", "Date", "Category", "Subject", "Test Name", "Marks Obtained", "Max Marks", "Rank", "Difficulty"]);
    d.testResults.forEach(function(row) {
      trSheet.appendRow([row.id, row.date, row.category, row.subject, row.testName, row.marksObtained, row.maxMarks, row.rank || "-", row.difficulty]);
    });
  }
}
`;
