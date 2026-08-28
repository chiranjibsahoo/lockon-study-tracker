// Helper for Google Sheets Web App Synchronization

export function isValidWebAppUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim();
  return clean.includes('script.google.com') && clean.includes('/exec');
}

export function getUrlValidationError(url) {
  if (!url || !url.trim()) return null;
  const clean = url.trim();
  if (clean.includes('docs.google.com/spreadsheets')) {
    return '⚠️ You pasted the Google Sheet link! Please deploy Apps Script as Web App and paste the /exec URL.';
  }
  if (clean.includes('script.google.com/home/projects') || clean.includes('script.google.com/edit')) {
    return '⚠️ You pasted the Script Editor link! Click Deploy > New Deployment and copy the Web App URL ending in /exec.';
  }
  if (!clean.includes('/exec') || !clean.includes('script.google.com')) {
    return '⚠️ Invalid Web App URL format. Must look like: https://script.google.com/macros/s/.../exec';
  }
  return null;
}

export async function fetchFromGoogleSheet(webAppUrl) {
  if (!webAppUrl || !webAppUrl.trim() || !isValidWebAppUrl(webAppUrl)) return null;
  try {
    const cleanUrl = webAppUrl.trim();
    const fetchUrl = cleanUrl.includes('?') ? `${cleanUrl}&action=getData&t=${Date.now()}` : `${cleanUrl}?action=getData&t=${Date.now()}`;
    const response = await fetch(fetchUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const result = await response.json();
    if (result) {
      if (result.data !== undefined && result.data !== null) return result.data;
      if (result.status === 'success' && result.data) return result.data;
      if (result.ok && result.data) return result.data;
      if (result.testResults || result.studyLog || result.timetable) return result;
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch from Google Sheet:', err);
    return null;
  }
}

export async function saveToGoogleSheet(webAppUrl, allData) {
  if (!webAppUrl || !webAppUrl.trim() || !isValidWebAppUrl(webAppUrl)) return false;
  try {
    const cleanUrl = webAppUrl.trim();
    await fetch(cleanUrl, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script web apps require no-cors in browser
      headers: {
        'Content-Type': 'text/plain', // text/plain avoids CORS preflight OPTIONS request blocking
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
      
      // Format human readable sheets for easy viewing
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
    trSheet.appendRow(["ID", "Date", "Category", "Subject", "Test Name", "Marks Obtained", "Max Marks", "Rank", "Percentile", "Projected AIR", "Difficulty"]);
    d.testResults.forEach(function(row) {
      trSheet.appendRow([row.id, row.date, row.category, row.subject, row.testName, row.marksObtained, row.maxMarks, row.rank || "-", row.percentile || "-", row.expectedRank || "-", row.difficulty]);
    });
  }
}
`;
