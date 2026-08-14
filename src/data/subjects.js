import { Atom, FlaskConical, Calculator, Languages, Laptop, Dumbbell, BookOpen } from 'lucide-react';

export const C = {
  bg: '#0A1119',
  bgAlt: '#0D1520',
  panel: '#121C29',
  panel2: '#17222F',
  border: '#233145',
  borderLight: '#2C3D55',
  text: '#EDF1F7',
  textMute: '#8B98AC',
  textFaint: '#57657A',
  amber: '#E8A33D',
  amberSoft: '#3B2E19',
  teal: '#45C4B0',
  tealSoft: '#153631',
  positive: '#5FD3A0',
  positiveSoft: '#173229',
  negative: '#E2604F',
  negativeSoft: '#3A2019',
  violet: '#C77DDA',
};

export const SUBJECTS = [
  { key: 'Physics', label: 'Physics', icon: Atom, color: '#5B9EE8', freq: 'daily' },
  { key: 'Chemistry', label: 'Chemistry', icon: FlaskConical, color: '#45C4B0', freq: 'daily' },
  { key: 'Mathematics', label: 'Mathematics', icon: Calculator, color: '#E8A33D', freq: 'daily' },
  { key: 'English', label: 'English', icon: Languages, color: '#C77DDA', freq: 'weekly' },
  { key: 'IT', label: 'Information Technology', icon: Laptop, color: '#8FA6C9', freq: 'weekly' },
  { key: 'PE', label: 'Physical Education', icon: Dumbbell, color: '#E2604F', freq: 'weekly' },
];

export const subjInfo = (key) => SUBJECTS.find((s) => s.key === key) || { label: key, icon: BookOpen, color: '#8FA6C9' };

export const CATEGORY_COLORS = { 
  'School Test': '#5B9EE8', 
  'Institute Test': '#E8A33D', 
  'PW Test': '#45C4B0', 
  Other: '#8FA6C9' 
};

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
