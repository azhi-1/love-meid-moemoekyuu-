// Organization and Character sub-panels

function OrgPanel({ orgs, borderColor }) {
  const entries = Object.entries(orgs);
  return React.createElement('div', { style: { fontSize: '13px' } },
    React.createElement('pre', {
      style: { color: borderColor, margin: '0 0 6px 0', fontSize: '11px', lineHeight: 1.4 }
    }, ASCII.sectionTop),
    entries.map(([name, info], i) =>
      React.createElement('div', { key: name, style: { marginBottom: i < entries.length - 1 ? '8px' : 0 } },
        React.createElement('div', { style: { display: 'flex', gap: '8px', alignItems: 'baseline' } },
          React.createElement('span', { style: { color: borderColor } }, ASCII.bullet),
          React.createElement('span', { style: { color: '#E5C07B', fontWeight: 'bold' } }, name),
        ),
        React.createElement('div', { style: { paddingLeft: '20px', color: '#AAA' } },
          React.createElement('div', null,
            React.createElement('span', { style: { color: '#666' } }, '势力范围: '),
            info.territory
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: '#666' } }, '当前状态: '),
            React.createElement('span', { style: { color: '#98C379' } }, info.status)
          ),
        ),
        i < entries.length - 1 && React.createElement('pre', {
          style: { color: '#333', margin: '6px 0 2px 0', fontSize: '11px' }
        }, ASCII.miniSep)
      )
    ),
    React.createElement('pre', {
      style: { color: borderColor, margin: '6px 0 0 0', fontSize: '11px', lineHeight: 1.4 }
    }, ASCII.sectionBot)
  );
}
window.OrgPanel = OrgPanel;


function CharPanel({ chars, borderColor }) {
  const entries = Object.entries(chars);
  return React.createElement('div', { style: { fontSize: '13px' } },
    React.createElement('pre', {
      style: { color: borderColor, margin: '0 0 6px 0', fontSize: '11px', lineHeight: 1.4 }
    }, ASCII.sectionTop),
    entries.map(([name, info], i) =>
      React.createElement('div', { key: name, style: { marginBottom: '8px' } },
        // Name + rank
        React.createElement('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' } },
          React.createElement('span', { style: { color: borderColor } }, ASCII.diamond),
          React.createElement('span', { style: { color: '#E5C07B', fontWeight: 'bold' } }, name),
          React.createElement(RankBadge, { rank: info.rank, fallbackColor: info.color || borderColor, bracket: false }),
        ),
        // Details
        React.createElement('div', { style: { paddingLeft: '20px', color: '#AAA', lineHeight: 1.7 } },
          React.createElement('div', null,
            React.createElement('span', { style: { color: '#666' } }, '所属: '),
            info.organization
          ),
          React.createElement('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' } },
            React.createElement('span', { style: { color: '#666' } }, '好感: '),
            React.createElement(AffectionBar, { value: info.affection }),
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: '#666' } }, '关系: '),
            React.createElement('span', { style: { color: getRelationColor(info.relation) } }, info.relation),
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: '#666' } }, '位置: '),
            React.createElement('span', { style: { color: '#7EB8DA' } }, info.location),
          ),
        ),
        i < entries.length - 1 && React.createElement('pre', {
          style: { color: '#333', margin: '6px 0 2px 0', fontSize: '11px' }
        }, ASCII.miniSep)
      )
    ),
    React.createElement('pre', {
      style: { color: borderColor, margin: '6px 0 0 0', fontSize: '11px', lineHeight: 1.4 }
    }, ASCII.sectionBot)
  );
}
window.CharPanel = CharPanel;
