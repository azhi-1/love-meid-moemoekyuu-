// ASCII art assets and utility components
const ASCII = {
  // Top banner
  banner: `
╔══════════════════════════════════════════════════════════════════╗
║  ░█▀▀░█░█░█▀▀░▀█▀░█▀▀░█▄█░░░█▀▄░█▀▄░█▀▀░░░▀█▀░█▀▀░█▀▄░█▄█  ║
║  ░▀▀█░░█░░▀▀█░░█░░█▀▀░█░█░░░█▀▄░█▀▄░▀▀█░░░░█░░█▀▀░█▀▄░█░█  ║
║  ░▀▀▀░░▀░░▀▀▀░░▀░░▀▀▀░▀░▀░░░▀▀░░▀▀░░▀▀▀░░░░▀░░▀▀▀░▀░▀░▀░▀  ║
║            >>> 秋 叶 原 冥 途 战 争 · 情 报 终 端 <<<            ║
╚══════════════════════════════════════════════════════════════════╝`.trim(),

  // Section headers
  sectionTop:    '┌─────────────────────────────────────────────────────┐',
  sectionBot:    '└─────────────────────────────────────────────────────┘',
  sectionDiv:    '├─────────────────────────────────────────────────────┤',
  
  // Post borders (character_post - diary)
  diaryTop:      '╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮',
  diaryBot:      '╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯',
  diaryDiv:      '┊···············································┊',

  // Post borders (news_post)
  newsTop:       '╔═══════════════════════════════════════════════════════╗',
  newsBot:       '╚═══════════════════════════════════════════════════════╝',
  newsDiv:       '╠═══════════════════════════════════════════════════════╣',

  // Reply borders
  replyMark:     '┃▌',

  // Small decorations
  bullet:        '►',
  arrow:         '→',
  cursor:        '█',
  dot:           '·',
  star:          '★',
  diamond:       '◆',

  // Trajectory arrow builder
  trajectory: (arr) => arr.join(' → '),

  // Rank badges
  rankBadge: (rank) => `【${rank}】`,

  // Mini separator
  miniSep: '─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─',

  // Status bar decorations  
  statusLeft:  '◄',
  statusRight: '►',
};

window.ASCII = ASCII;

// --- Typing animation hook ---
function useTypingEffect(text, speed = 30, trigger = true) {
  const [displayed, setDisplayed] = React.useState('');
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!trigger) { setDisplayed(''); setDone(false); return; }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, trigger]);

  return [displayed, done];
}
window.useTypingEffect = useTypingEffect;

// --- Blinking cursor component ---
function BlinkCursor({ color = '#D9773E' }) {
  const [on, setOn] = React.useState(true);
  React.useEffect(() => {
    const iv = setInterval(() => setOn(v => !v), 530);
    return () => clearInterval(iv);
  }, []);
  return React.createElement('span', {
    style: { color, opacity: on ? 1 : 0, fontWeight: 'bold' }
  }, '█');
}
window.BlinkCursor = BlinkCursor;

// --- Relation color mapping ---
function getRelationColor(relation) {
  const map = {
    '陌生人': '#666666',
    '相识': '#7EB8DA',
    '朋友': '#98C379',
    '挚友': '#E5C07B',
    '恋人': '#E06C75'
  };
  return map[relation] || '#888';
}
window.getRelationColor = getRelationColor;

// --- Affection bar ---
function AffectionBar({ value, max = 100 }) {
  const filled = Math.round((value / max) * 20);
  const empty = 20 - filled;
  const color = value > 80 ? '#E06C75' : value > 60 ? '#E5C07B' : value > 40 ? '#98C379' : '#7EB8DA';
  return React.createElement('span', { style: { fontFamily: 'monospace' } },
    React.createElement('span', { style: { color } }, '█'.repeat(filled)),
    React.createElement('span', { style: { color: '#333' } }, '░'.repeat(empty)),
    React.createElement('span', { style: { color: '#888', marginLeft: '4px' } }, `${value}/${max}`)
  );
}
window.AffectionBar = AffectionBar;

// --- Rank style map: 按职级关键字匹配差异化样式 ---
// 顺序敏感：先特殊后通用，第一个命中即返回
const RANK_STYLE = [
  { match: /SYSTEM|系统播报|播报/i, icon: '⚡', accent: '#E5C07B', pulse: true,  invertBg: true },
  { match: /头目|老大|店长|店主|经营者/,    icon: '♛', accent: '#E5C07B', pulse: false },
  { match: /No\.\s*1|首席|ACE/i,            icon: '★', accent: '#E5C07B', pulse: false },
  { match: /武斗派|打手|護衛|护卫/,          icon: '✊', accent: '#FF6B6B', pulse: false },
  { match: /军师|参謀|参谋/,                icon: '♜', accent: '#C678DD', pulse: false },
  { match: /副手|二把手|秘书|干部|幹部/,    icon: '◇', accent: '#C678DD', pulse: false },
  { match: /情报屋|情報屋|内线|間者|探/,    icon: '✦', accent: '#7EB8DA', pulse: false },
  { match: /新人|見習|见习/,                icon: '◦', accent: '#98C379', pulse: false },
];

function getRankStyle(rank) {
  if (!rank) return null;
  return RANK_STYLE.find(s => s.match.test(rank)) || null;
}
window.getRankStyle = getRankStyle;

// --- RankBadge: 统一徽章渲染组件 ---
// rank: 职级文本; fallbackColor: 默认背景色（通常为作者color）; bracket: 是否包【】
function RankBadge({ rank, fallbackColor, bracket = false }) {
  if (!rank) return null;
  const style = getRankStyle(rank);
  const text = bracket ? `【${rank}】` : rank;

  // 默认（无映射命中）：维持原有外观
  if (!style) {
    return React.createElement('span', {
      style: {
        color: '#0D0D0D', background: fallbackColor,
        padding: '1px 6px', fontSize: '10px', fontWeight: 'bold',
      }
    }, text);
  }

  // SYSTEM 等需要反色 + 脉冲：深底亮字
  const baseStyle = style.invertBg
    ? {
        color: style.accent, background: '#0D0D0D',
        padding: '1px 6px', fontSize: '10px', fontWeight: 'bold',
        border: `1px solid ${style.accent}`,
      }
    : {
        color: '#0D0D0D', background: fallbackColor,
        padding: '1px 6px', fontSize: '10px', fontWeight: 'bold',
        border: `1px solid ${style.accent}`,
        boxShadow: `0 0 4px ${style.accent}66`,
      };

  return React.createElement('span', {
    className: style.pulse ? 'rank-pulse' : undefined,
    style: baseStyle,
  },
    React.createElement('span', { style: { marginRight: '3px' } }, style.icon),
    text
  );
}
window.RankBadge = RankBadge;
