// mvu-adapter.jsx
// 数据流适配层：把 MVU schema (中文键) 翻译成前端组件期望的形态 (英文键)
//
//   stat_data ─┐
//              │
//              ▼
//   adaptStatData() ──► front-end data (system / organizations / characters / posts)
//
// 兼容策略：
//   - 在酒馆助手 iframe 内：通过 Mvu.getMvuData 抓取当前楼层 stat_data
//   - 在本地浏览器测试 (file:// 或 python http.server)：检测不到 Mvu 接口，回退 window.MOCK_DATA
//   - 任意一步失败：打印 warn 后兜底，前端组件不感知
//
// 整个 loadData 暴露成 window.loadData，App 组件用 useEffect 调用。

// ─────────────────────────────────────────────────────────────────────────────
// adaptStatData: 中文 schema → 英文前端形态
// ─────────────────────────────────────────────────────────────────────────────
function adaptStatData(stat) {
  if (!stat) return null;

  return {
    system: {
      date:     _.get(stat, '系统变量.日期', ''),
      time:     _.get(stat, '系统变量.时间', ''),
      location: _.get(stat, '系统变量.当前位置', ''),
    },

    organizations: _.mapValues(_.get(stat, '组织表', {}), org => ({
      territory: _.get(org, '势力范围', ''),
      status:    _.get(org, '当前状态', ''),
      color:     _.get(org, 'color', '#D9773E'),
    })),

    characters: _.mapValues(_.get(stat, '角色表', {}), char => ({
      organization: _.get(char, '所属组织', ''),
      rank:         _.get(char, '职级', ''),
      affection:    _.get(char, '好感度', 0),
      relation:     _.get(char, '关系', '陌生人'),
      location:     _.get(char, '当前位置', ''),
      color:        _.get(char, 'color', '#888888'),
    })),

    posts: _.get(stat, '帖子流', []).map((post, i) => ({
      id:         i + 1,
      type:       _.get(post, '帖子类型', 'character_post'),
      author:     _.get(post, '作者', ''),
      color:      _.get(post, 'color', '#D9773E'),
      rank:       _.get(post, '职级', ''),
      timestamp:  _.get(post, '时间戳', ''),
      location:   _.get(post, '当前位置', ''),
      content:    _.get(post, '帖子内容', ''),
      trajectory: _.get(post, '活动轨迹', []),
      replies:    _.get(post, '回帖', []).map(r => ({
        author:  _.get(r, 'character_reply', ''),
        color:   _.get(r, 'color', '#888888'),
        content: _.get(r, '回帖内容', ''),
      })),
    })),
  };
}
window.adaptStatData = adaptStatData;

// ─────────────────────────────────────────────────────────────────────────────
// loadData: 主入口，返回 Promise<frontEndData>
//
// 关键设计：
//   1) 不预检 typeof Mvu —— React useEffect 触发瞬间 Mvu 可能还没注入，
//      必须先 await waitGlobalInitialized('Mvu') 等它就绪。
//   2) 回溯到最后一条 assistant 楼层取 stat_data —— user 楼层不携带 MVU 状态。
//   3) 任意环节出错 → 兜底 MOCK_DATA。
// ─────────────────────────────────────────────────────────────────────────────
async function loadData() {
  // 非酒馆环境（本地 file:// 预览）：酒馆助手接口完全不存在，直接 mock
  if (
    typeof waitGlobalInitialized !== 'function' ||
    typeof getLastMessageId !== 'function' ||
    typeof getChatMessages !== 'function'
  ) {
    console.info('[mvu-adapter] 非酒馆环境，使用 MOCK_DATA');
    return window.MOCK_DATA;
  }

  try {
    // 1) 等 MVU 框架就绪
    await waitGlobalInitialized('Mvu');

    // 2) 回溯找最后一条 assistant 楼层（user 楼层没有 stat_data）
    const lastMsgId = getLastMessageId();
    const assistantMsgs = getChatMessages(`0-${lastMsgId}`, { role: 'assistant' });
    const targetMsgId =
      assistantMsgs.length > 0
        ? assistantMsgs[assistantMsgs.length - 1].message_id
        : lastMsgId;

    // 3) 优先 Mvu.getMvuData，降级 getVariables
    const variables =
      typeof Mvu !== 'undefined' && typeof Mvu.getMvuData === 'function'
        ? Mvu.getMvuData({ type: 'message', message_id: targetMsgId })
        : getVariables({ type: 'message', message_id: targetMsgId });

    // 4) 提取 stat_data（lodash 在酒馆助手 iframe 里默认存在，保险起见兜底）
    const stat =
      typeof _ !== 'undefined' && _.get
        ? _.get(variables, 'stat_data')
        : variables && variables.stat_data;

    if (!stat) throw new Error(`stat_data 为空 (target msg #${targetMsgId})`);

    const adapted = adaptStatData(stat);
    console.info('[mvu-adapter] 已加载 MVU 数据', { targetMsgId, adapted });
    return adapted;
  } catch (e) {
    console.warn('[mvu-adapter] 抓取 MVU 失败，回退 MOCK_DATA：', e);
    return window.MOCK_DATA;
  }
}
window.loadData = loadData;

// ─────────────────────────────────────────────────────────────────────────────
// subscribeMvuUpdates: 监听 MVU 变量变化，触发回调（供 App 实现自动刷新）
// 在非酒馆环境中是 no-op，返回一个空 dispose 函数
//
// 与 loadData 同一个坑：调用瞬间 Mvu 可能还没注入，所以异步 await 它就绪后再绑定。
// ─────────────────────────────────────────────────────────────────────────────
function subscribeMvuUpdates(onUpdate) {
  if (typeof eventOn !== 'function' || typeof eventRemoveListener !== 'function') {
    return () => {};
  }

  let disposed = false;
  let dispose = () => { disposed = true; };

  (async () => {
    try {
      if (typeof waitGlobalInitialized === 'function') {
        await waitGlobalInitialized('Mvu');
      }
      if (disposed || typeof Mvu === 'undefined' || !Mvu.events) return;

      // 事件回调签名因 MVU 版本而异，统一改为重新走一次 loadData，简单且稳。
      const handler = async () => {
        try {
          const data = await loadData();
          onUpdate(data);
        } catch (e) {
          console.warn('[mvu-adapter] VARIABLE_UPDATE_ENDED 处理失败：', e);
        }
      };

      eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, handler);
      dispose = () =>
        eventRemoveListener(Mvu.events.VARIABLE_UPDATE_ENDED, handler);
    } catch (e) {
      console.warn('[mvu-adapter] 监听 MVU 变量失败：', e);
    }
  })();

  return () => dispose();
}
window.subscribeMvuUpdates = subscribeMvuUpdates;
