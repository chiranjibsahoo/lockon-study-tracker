import React, { useState } from 'react';
import { Settings, Download, Upload, RotateCcw, Shield, X, Save, Cloud, HelpCircle, Copy, Check } from 'lucide-react';
import { C } from '../data/subjects';
import { APPS_SCRIPT_TEMPLATE } from '../utils/googleSync';

export function SettingsModal({
  profileSettings,
  googleSheetUrl,
  onSaveProfile,
  onSaveSheetUrl,
  onExport,
  onImport,
  onResetDefaults,
  onSyncGoogleSheets,
  isSyncing,
  onClose,
}) {
  const [studentName, setStudentName] = useState(profileSettings.studentName || 'Chiranjib Sahoo');
  const [classGrade, setClassGrade] = useState(profileSettings.classGrade || 'Class 11 PCM');
  const [jeeTargetRank, setJeeTargetRank] = useState(profileSettings.jeeTargetRank || 100);
  const [cbseTargetPct, setCbseTargetPct] = useState(profileSettings.cbseTargetPct || 98);
  const [parentPin, setParentPin] = useState(profileSettings.parentPin || '');
  const [sheetUrl, setSheetUrl] = useState(googleSheetUrl || '');
  const [showScriptGuide, setShowScriptGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveProfile({
      studentName,
      classGrade,
      jeeTargetRank: Number(jeeTargetRank),
      cbseTargetPct: Number(cbseTargetPct),
      parentPin,
    });
    onSaveSheetUrl(sheetUrl);
    onClose();
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.data) {
          onImport(json.data);
          alert('Backup restored successfully!');
          onClose();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="lk-panel w-full max-w-lg overflow-y-auto max-h-[90vh]" style={{ background: C.panel }}>
        <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-800">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-amber" />
            <h2 className="lk-h2">Command Center Settings</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="lk-label">Student Name</label>
              <input
                className="lk-input"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="lk-label">Grade / Stream</label>
              <input
                className="lk-input"
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="lk-label">JEE Target Rank (AIR)</label>
              <input
                className="lk-input"
                type="number"
                value={jeeTargetRank}
                onChange={(e) => setJeeTargetRank(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="lk-label">CBSE Target (%)</label>
              <input
                className="lk-input"
                type="number"
                value={cbseTargetPct}
                onChange={(e) => setCbseTargetPct(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="lk-label flex items-center justify-between">
              <span>Parent View PIN Protection</span>
              <span className="text-[10px] text-gray-400 font-normal">Leave blank for open access</span>
            </label>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-gray-400" />
              <input
                className="lk-input"
                type="password"
                maxLength={6}
                placeholder="Set 4-digit PIN (e.g. 1234)"
                value={parentPin}
                onChange={(e) => setParentPin(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 mt-1">
            <div className="flex items-center justify-between mb-2">
              <div className="lk-eyebrow flex items-center gap-1.5" style={{ marginBottom: 0 }}>
                <Cloud size={13} className="text-teal-400" /> Google Sheets Cloud Sync (Cross-Device)
              </div>
              <button
                type="button"
                className="text-xs text-amber hover:underline flex items-center gap-1"
                onClick={() => setShowScriptGuide(!showScriptGuide)}
              >
                <HelpCircle size={12} /> Setup Guide & Script
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <input
                className="lk-input text-xs"
                placeholder="Paste Google Apps Script Web App URL (https://script.google.com/macros/s/.../exec)"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
              />
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="lk-btn-ghost text-xs py-1.5 flex-1"
                  disabled={!sheetUrl || isSyncing}
                  onClick={() => onSyncGoogleSheets(sheetUrl)}
                >
                  {isSyncing ? 'Syncing with Google Sheet...' : '🔄 Pull & Sync Latest Sheet Data'}
                </button>
                {sheetUrl && (
                  <button
                    type="button"
                    className="lk-btn text-xs py-1.5"
                    style={{ background: '#10B981', color: '#000', fontWeight: 600 }}
                    onClick={() => {
                      const mobileLink = `${window.location.origin}${window.location.pathname}?syncUrl=${encodeURIComponent(sheetUrl.trim())}`;
                      navigator.clipboard.writeText(mobileLink);
                      alert('📱 Mobile Pairing Link copied to clipboard!\n\nSend this link to your phone via WhatsApp/Telegram and open it ONCE. Your phone will auto-sync automatically!');
                    }}
                  >
                    📱 Copy Mobile Link
                  </button>
                )}
              </div>
            </div>

            {showScriptGuide && (
              <div className="mt-3 p-3 bg-gray-900/90 border border-gray-800 rounded-lg text-xs flex flex-col gap-2">
                <div className="font-semibold text-amber">How to link Google Sheets (Free & Realtime):</div>
                <ol className="list-decimal pl-4 flex flex-col gap-1 text-gray-300">
                  <li>Open Google Sheets and click <b>Extensions &gt; Apps Script</b>.</li>
                  <li>Clear any default code and paste the script below into <code>Code.gs</code>.</li>
                  <li>Click <b>Deploy &gt; New deployment</b>.</li>
                  <li>Select type: <b>Web App</b>. Execute as: <b>Me</b>, Access: <b>Anyone</b>.</li>
                  <li>Click <b>Deploy</b>, authorize permissions, and copy the <b>Web App URL</b> here!</li>
                </ol>

                <div className="relative mt-1">
                  <pre className="p-2 bg-black/80 rounded border border-gray-800 overflow-x-auto text-[10px] font-mono text-gray-300 max-h-36">
                    {APPS_SCRIPT_TEMPLATE}
                  </pre>
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded text-[10px] flex items-center gap-1"
                    onClick={() => {
                      navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                    {copied ? 'Copied' : 'Copy Script'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-800 pt-4 mt-1">
            <div className="lk-eyebrow mb-2">Data Management & Backup</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                className="lk-btn-ghost w-full"
                onClick={onExport}
              >
                <Download size={14} /> Export Backup (JSON)
              </button>
              <label className="lk-btn-ghost w-full cursor-pointer flex items-center justify-center">
                <Upload size={14} /> Import Backup (JSON)
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileImport}
                />
              </label>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
            <button
              type="button"
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              onClick={() => {
                if (window.confirm('Reset all data to default seed values? Any custom entries will be lost.')) {
                  onResetDefaults();
                  onClose();
                }
              }}
            >
              <RotateCcw size={13} /> Reset to Defaults
            </button>
            <div className="flex gap-2">
              <button type="button" className="lk-btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="lk-btn">
                <Save size={14} /> Save Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
