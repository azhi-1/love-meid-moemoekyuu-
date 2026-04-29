// Post feed and individual post components

function PostFeed({ posts, borderColor }) {
  const [page, setPage] = React.useState(0);
  const perPage = 3;
  const total = posts.length;
  const visible = posts.slice(page * perPage, (page + 1) * perPage);

  return React.createElement('div', null,
    visible.map((post, i) =>
      React.createElement('div', { key: post.id, style: { marginBottom: '10px' } },
        post.type === 'character_post'
          ? React.createElement(CharacterPost, { post, borderColor })
          : React.createElement(NewsPost, { post, borderColor }),
      )
    ),
    total > perPage && React.createElement('div', {
      style: { display: 'flex', justifyContent: 'center', gap: '16px', padding: '8px 0', color: '#666', fontSize: '12px' }
    },
      React.createElement('span', {
        style: { cursor: page > 0 ? 'pointer' : 'default', color: page > 0 ? borderColor : '#333' },
        onClick: () => page > 0 && setPage(p => p - 1)
      }, '◄ 上一页'),
      React.createElement('span', null, `${page + 1}/${Math.ceil(total / perPage)}`),
      React.createElement('span', {
        style: { cursor: (page + 1) * perPage < total ? 'pointer' : 'default', color: (page + 1) * perPage < total ? borderColor : '#333' },
        onClick: () => (page + 1) * perPage < total && setPage(p => p + 1)
      }, '下一页 ►'),
    )
  );
}
window.PostFeed = PostFeed;


// --- Character Post (diary style) ---
function CharacterPost({ post, borderColor }) {
  const c = post.color || borderColor;
  const [collapsed, setCollapsed] = React.useState(false);

  return React.createElement('div', {
    style: {
      background: 'linear-gradient(135deg, #1a1410 0%, #12100e 100%)',
      border: `1px solid ${c}44`,
      position: 'relative',
      overflow: 'hidden',
    }
  },
    // Paper texture overlay
    React.createElement('div', {
      style: {
        position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${c} 3px, ${c} 4px)`,
      }
    }),
    // Header
    React.createElement('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px',
        borderBottom: `1px dashed ${c}33`, cursor: 'pointer', flexWrap: 'wrap',
      },
      onClick: () => setCollapsed(v => !v),
    },
      React.createElement('span', { style: { color: '#555', fontSize: '11px', fontFamily: 'monospace' } }, collapsed ? '[+]' : '[-]'),
      React.createElement('span', { style: { color: c, fontWeight: 'bold' } }, post.author),
      React.createElement(RankBadge, { rank: post.rank, fallbackColor: c, bracket: true }),
      React.createElement('span', { style: { color: '#555', fontSize: '11px', marginLeft: 'auto' } }, post.timestamp),
    ),
    !collapsed && React.createElement('div', { style: { padding: '10px 12px', position: 'relative' } },
      // Location
      React.createElement('div', { style: { color: '#7EB8DA', fontSize: '11px', marginBottom: '6px' } },
        `📍 ${post.location}`
      ),
      // Content (italic for diary)
      React.createElement('div', {
        style: {
          color: '#CCC', fontStyle: 'italic', lineHeight: 1.7, whiteSpace: 'pre-wrap',
          padding: '8px 0', borderTop: `1px dotted ${c}22`, borderBottom: `1px dotted ${c}22`,
          margin: '4px 0',
        }
      }, post.content),
      // Trajectory
      post.trajectory && post.trajectory.length > 0 && React.createElement('div', {
        style: { color: '#888', fontSize: '12px', marginTop: '8px' }
      },
        React.createElement('span', { style: { color: '#666' } }, '🗺 轨迹: '),
        React.createElement('span', { style: { color: '#E5C07B' } }, ASCII.trajectory(post.trajectory))
      ),
      // Replies
      post.replies && post.replies.length > 0 && React.createElement(ReplySection, { replies: post.replies, borderColor: c })
    ),
  );
}
window.CharacterPost = CharacterPost;


// --- News Post (headline style) ---
function NewsPost({ post, borderColor }) {
  const c = post.color || borderColor;
  const [collapsed, setCollapsed] = React.useState(false);

  return React.createElement('div', {
    style: {
      background: '#0D0D0D',
      border: `1px solid ${c}66`,
      borderLeft: `3px solid ${c}`,
    }
  },
    // Header with heavy ASCII
    React.createElement('pre', {
      style: { color: c, margin: 0, padding: '4px 10px 0', fontSize: '10px', lineHeight: 1.2, overflow: 'hidden' }
    }, '╔══════════════════════ BREAKING NEWS ══════════════════════╗'),
    React.createElement('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px',
        cursor: 'pointer', flexWrap: 'wrap',
      },
      onClick: () => setCollapsed(v => !v),
    },
      React.createElement('span', { style: { color: '#555', fontSize: '11px', fontFamily: 'monospace' } }, collapsed ? '[+]' : '[-]'),
      React.createElement('span', { style: { color: c, fontWeight: 'bold', fontSize: '15px' } }, '⚡ ' + post.author),
      React.createElement(RankBadge, { rank: post.rank, fallbackColor: c, bracket: false }),
      React.createElement('span', { style: { color: '#555', fontSize: '11px', marginLeft: 'auto' } }, post.timestamp),
    ),
    !collapsed && React.createElement('div', { style: { padding: '6px 12px 10px' } },
      React.createElement('pre', {
        style: { color: `${c}66`, margin: '0 0 6px 0', fontSize: '10px' }
      }, '╠═══════════════════════════════════════════════════════════╣'),
      React.createElement('div', {
        style: { color: '#DDD', lineHeight: 1.7, whiteSpace: 'pre-wrap' }
      }, post.content),
      React.createElement('pre', {
        style: { color: `${c}66`, margin: '8px 0 0 0', fontSize: '10px' }
      }, '╚═══════════════════════════════════════════════════════════╝'),
      post.replies && post.replies.length > 0 && React.createElement(ReplySection, { replies: post.replies, borderColor: c })
    ),
  );
}
window.NewsPost = NewsPost;


// --- Reply Section (BBS floor style) ---
function ReplySection({ replies, borderColor }) {
  const [expanded, setExpanded] = React.useState(false);

  return React.createElement('div', { style: { marginTop: '10px' } },
    React.createElement('div', {
      style: {
        color: '#666', fontSize: '12px', cursor: 'pointer', userSelect: 'none',
        display: 'flex', alignItems: 'center', gap: '6px',
      },
      onClick: () => setExpanded(v => !v),
    },
      React.createElement('span', null, expanded ? '▼' : '►'),
      React.createElement('span', null, `回帖 (${replies.length}层)`),
    ),
    expanded && React.createElement('div', { style: { marginTop: '6px' } },
      replies.map((reply, i) =>
        React.createElement('div', {
          key: i,
          style: {
            display: 'flex', gap: '8px', padding: '6px 0 6px 8px',
            borderLeft: `2px solid ${reply.color || borderColor}44`,
            marginBottom: '4px', fontSize: '13px',
          }
        },
          React.createElement('div', null,
            React.createElement('div', { style: { display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2px' } },
              React.createElement('span', { style: { color: '#555', fontSize: '10px', fontFamily: 'monospace' } }, `${i + 1}F`),
              React.createElement('span', { style: { color: reply.color || borderColor, fontWeight: 'bold', fontSize: '12px' } }, reply.author),
            ),
            React.createElement('div', { style: { color: '#BBB' } }, reply.content),
          )
        )
      )
    )
  );
}
window.ReplySection = ReplySection;
