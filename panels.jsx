// Collapsible panel components

// --- CollapsibleSection: a terminal-style foldable panel ---
function CollapsibleSection({ title, icon, defaultOpen = false, children, borderColor = '#D9773E' }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [animClass, setAnimClass] = React.useState(defaultOpen ? 'panel-open' : 'panel-closed');

  const toggle = () => {
    if (open) {
      setAnimClass('panel-closing');
      setTimeout(() => { setOpen(false); setAnimClass('panel-closed'); }, 250);
    } else {
      setOpen(true);
      setAnimClass('panel-opening');
      setTimeout(() => setAnimClass('panel-open'), 20);
    }
  };

  const headerStyle = {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '6px 10px', cursor: 'pointer', userSelect: 'none',
    color: borderColor, fontWeight: 'bold',
    borderBottom: open ? `1px solid ${borderColor}33` : 'none',
    transition: 'background 0.2s',
    background: 'transparent',
  };

  const bodyStyle = {
    overflow: 'hidden',
    maxHeight: (animClass === 'panel-open') ? '2000px' : (animClass === 'panel-opening' ? '2000px' : '0px'),
    opacity: (animClass === 'panel-open' || animClass === 'panel-opening') ? 1 : 0,
    transition: 'max-height 0.4s ease, opacity 0.3s ease',
    padding: open ? '8px 10px' : '0 10px',
  };

  const indicator = open ? '[-]' : '[+]';

  return React.createElement('div', {
    style: {
      border: `1px solid ${borderColor}44`,
      marginBottom: '4px',
      background: '#0D0D0D',
    }
  },
    React.createElement('div', {
      style: headerStyle,
      onClick: toggle,
      onMouseEnter: (e) => e.currentTarget.style.background = `${borderColor}11`,
      onMouseLeave: (e) => e.currentTarget.style.background = 'transparent',
    },
      React.createElement('span', { style: { color: '#888', fontFamily: 'monospace', fontSize: '12px' } }, indicator),
      React.createElement('span', null, icon || ''),
      React.createElement('span', null, title),
      React.createElement('span', { style: { marginLeft: 'auto', color: '#555', fontSize: '11px' } },
        open ? '折叠' : '展开'
      )
    ),
    open && React.createElement('div', { style: bodyStyle }, children)
  );
}
window.CollapsibleSection = CollapsibleSection;


// --- StatusBar: the top-level collapsed terminal bar ---
function StatusBar({ data, borderColor = '#D9773E', rightSlot }) {
  const [expanded, setExpanded] = React.useState(false);
  const sys = data.system;

  const barStyle = {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '8px 12px', cursor: 'pointer', userSelect: 'none',
    background: '#0A0A0A',
    borderBottom: `1px solid ${borderColor}66`,
    color: '#AAA', fontSize: '13px',
    transition: 'background 0.2s',
  };

  return React.createElement('div', null,
    React.createElement('div', {
      style: barStyle,
      onClick: () => setExpanded(v => !v),
      onMouseEnter: (e) => e.currentTarget.style.background = '#111',
      onMouseLeave: (e) => e.currentTarget.style.background = '#0A0A0A',
    },
      React.createElement('span', { style: { color: borderColor, fontWeight: 'bold' } }, expanded ? '▼' : '►'),
      React.createElement('span', { style: { color: borderColor } }, '秋叶原情报终端'),
      React.createElement('span', { style: { color: '#555' } }, '│'),
      React.createElement('span', null, `📅 ${sys.date}`),
      React.createElement('span', { style: { color: '#555' } }, '│'),
      React.createElement('span', null, `⏰ ${sys.time}`),
      React.createElement('span', { style: { color: '#555' } }, '│'),
      React.createElement('span', null, `📍 ${sys.location || '未知'}`),
      React.createElement('span', {
        style: { marginLeft: 'auto', display: 'inline-flex', alignItems: 'center' },
        onClick: (e) => e.stopPropagation(),
      },
        rightSlot != null ? rightSlot : React.createElement(BlinkCursor, { color: borderColor })
      )
    ),
    expanded && React.createElement(ExpandedTerminal, { data, borderColor })
  );
}
window.StatusBar = StatusBar;


// --- ExpandedTerminal: the full interface when statusbar is expanded ---
function ExpandedTerminal({ data, borderColor }) {
  return React.createElement('div', {
    style: { background: '#0A0A0A', padding: '4px 0' }
  },
    // Organization panel
    React.createElement(CollapsibleSection, {
      title: '组织情报一览', icon: '🏴', borderColor,
    },
      React.createElement(OrgPanel, { orgs: data.organizations, borderColor })
    ),
    // Character panel
    React.createElement(CollapsibleSection, {
      title: '角色档案', icon: '👤', borderColor,
    },
      React.createElement(CharPanel, { chars: data.characters, borderColor })
    ),
    // Posts panel
    React.createElement(CollapsibleSection, {
      title: '帖子情报流', icon: '📋', borderColor, defaultOpen: true,
    },
      React.createElement(PostFeed, { posts: data.posts, borderColor })
    )
  );
}
window.ExpandedTerminal = ExpandedTerminal;
