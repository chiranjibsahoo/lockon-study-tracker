export const T = (h, m) => h * 60 + m;

export function fmtT(mins) {
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  const ap = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ap}`;
}

export function fmtRange(s, e) {
  return `${fmtT(s)} \u2013 ${fmtT(e)}`;
}

export function minToHM(mins) {
  const sign = mins < 0 ? '-' : '';
  const a = Math.round(Math.abs(mins));
  const h = Math.floor(a / 60);
  const m = a % 60;
  return h > 0 ? `${sign}${h}h ${m}m` : `${sign}${m}m`;
}

export const DOW_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const dowOf = (dateStr) => {
  if (!dateStr) return 'Monday';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return DOW_NAMES[d.getDay()];
  }
  return DOW_NAMES[new Date(dateStr + 'T00:00:00').getDay()];
};

export const getTodayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const TODAY_DATE = getTodayISO();

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const fmtDate = (iso) => {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length === 3) {
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return `${day} ${MONTHS[monthIdx]}`;
  }
  const d = new Date(iso + 'T00:00:00');
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};
