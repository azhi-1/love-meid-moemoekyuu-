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
// ─────────────────────────────────────────────────────────────────────────────
async function loadData({ timeoutMs = 3000 } = {}) {
  const hasMvu =
    typeof Mvu !== 'undefined' &&
    typeof waitGlobalInitialized === 'function' &&
    typeof waitUntil === 'function' &&
    typeof getVariables === 'function' &&
    typeof getCurrentMessageId === 'function';

  if (!hasMvu) {
    console.info('[mvu-adapter] MVU 接口不可用 (本地预览或非酒馆环境)，使用 MOCK_DATA');
    return window.MOCK_DATA;
  }

  try {
    await waitGlobalInitialized('Mvu');
    await waitUntil(
      () => _.has(getVariables({ type: 'message' }), 'stat_data'),
      { timeout: timeoutMs },
    );

    const variables = Mvu.getMvuData({
      type: 'message',
      message_id: getCurrentMessageId(),
    });
    const stat = _.get(variables, 'stat_data');

    if (!stat) throw new Error('stat_data is empty');

    const adapted = adaptStatData(stat);
    console.info('[mvu-adapter] MVU 数据加载完成', adapted);
    return adapted;
  } catch (e) {
    console.warn('[mvu-adapter] 抓取 MVU 失败，回退到 MOCK_DATA：', e);
    return window.MOCK_DATA;
  }
}
window.loadData = loadData;

// ─────────────────────────────────────────────────────────────────────────────
// subscribeMvuUpdates: 监听 MVU 变量变化，触发回调（供 App 实现自动刷新）
// 在非酒馆环境中是 no-op，返回一个空 dispose 函数
// ─────────────────────────────────────────────────────────────────────────────
function subscribeMvuUpdates(onUpdate) {
  const hasMvuEvents =
    typeof Mvu !== 'undefined' &&
    Mvu.events &&
    typeof eventOn === 'function' &&
    typeof eventRemoveListener === 'function';

  if (!hasMvuEvents) return () => {};

  const handler = (newVars) => {
    try {
      const stat = _.get(newVars, 'stat_data');
      if (stat) onUpdate(adaptStatData(stat));
    } catch (e) {
      console.warn('[mvu-adapter] VARIABLE_UPDATE_ENDED 处理失败：', e);
    }
  };

  eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, handler);
  return () => eventRemoveListener(Mvu.events.VARIABLE_UPDATE_ENDED, handler);
}
window.subscribeMvuUpdates = subscribeMvuUpdates;
