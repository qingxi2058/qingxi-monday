export const MONDAY_MODES = {
  soul: { label: "人到了，魂没到", accent: "灵魂离岗" },
  meeting: { label: "不想开会", accent: "会议防御" },
  leave: { label: "想请假", accent: "体面撤退" },
  feral: { label: "想发疯但还得上班", accent: "低调发疯" },
};

const INTENSITY_LABELS = {
  low: "轻微摆烂",
  sharp: "正常发疯",
  feral: "彻底没电",
};

const MODE_TEMPLATES = {
  soul: {
    headline: [
      ({ detail, tone }) => `周一的我：${detail}先不聊，我的魂还堵在地铁里。${tone}`,
      ({ detail, tone }) => `今天先别催${detail}，我人虽然上线了，状态还在加载。${tone}`,
    ],
    excuse: [
      ({ detail }) => `今日不在最佳工作状态，建议把${detail}排到午后处理，我先把人类基本功能恢复一下。`,
      ({ detail }) => `关于${detail}，我会在午饭后给出明确回复。现在我的大脑只适合做低风险动作。`,
    ],
    reply: [
      ({ detail }) => `收到，我先把${detail}记上。上午我会先处理最急的一步，中午前给你可执行反馈。`,
      ({ detail }) => `我先不硬扛${detail}，先把关键节点梳清楚，11点前回你。`,
    ],
    caption: [
      ({ detail }) => `周一不是不想干活，是大脑还没接受${detail}已经开始了。`,
      ({ detail }) => `今天的我：能打开电脑，但不保证能立刻面对${detail}。`,
    ],
    reminder: "先做一个最小动作，不要一上来就试图拯救整周。",
  },
  meeting: {
    headline: [
      ({ detail, tone }) => `谁懂，周一一来就聊${detail}，我的灵魂想直接退群。${tone}`,
      ({ detail, tone }) => `周一会议通知一响，我就知道${detail}又要开始消耗我了。${tone}`,
    ],
    excuse: [
      ({ detail }) => `关于${detail}，这场会如果没有明确结论和负责人，建议改成异步，不然大家只是在集体表演清醒。`,
      ({ detail }) => `这件${detail}如果今天一定要开，我建议先明确目标，不然我只能贡献沉默。`,
    ],
    reply: [
      ({ detail }) => `可以开，但麻烦先发一下${detail}的目标和要决策的点，我不想再开一场没有结果的会。`,
      ({ detail }) => `收到。和${detail}相关的部分，我建议先定结论，再决定谁上会。`,
    ],
    caption: [
      ({ detail }) => `真正让我累的不是周一，是周一还要为${detail}参加一场没有结果的会。`,
      ({ detail }) => `当周一的第一件事是${detail}，我就知道今天得靠演技活着。`,
    ],
    reminder: "会上只守一件事：今天到底要定什么，不陪跑题。",
  },
  leave: {
    headline: [
      ({ detail, tone }) => `我不是不想上班，我只是觉得${detail}不值得我今天硬撑。${tone}`,
      ({ detail, tone }) => `如果非要为${detail}出门，那我宁愿先请半天假把人救回来。${tone}`,
    ],
    excuse: [
      ({ detail }) => `今天身体状态不太适合高强度输出，尤其是${detail}这类需要稳定判断的事。我申请半天调整，下午补上。`,
      ({ detail }) => `我今天需要短暂离线恢复一下，不然处理${detail}只会把简单事做复杂。`,
    ],
    reply: [
      ({ detail }) => `我上午需要调一下状态，和${detail}相关的部分我会在下午集中处理。`,
      ({ detail }) => `先报备一下，我上午离线恢复，下午回来把${detail}推进掉。`,
    ],
    caption: [
      ({ detail }) => `长大后才懂，请假不是偷懒，是为了不让${detail}把我榨干。`,
      ({ detail }) => `今天最成熟的决定：承认自己现在不适合正面硬扛${detail}。`,
    ],
    reminder: "请假理由要稳，不要卖惨。重点是恢复后能把事接住。",
  },
  feral: {
    headline: [
      ({ detail, tone }) => `今天谁再拿${detail}找我，我表面说收到，心里已经在辞职了。${tone}`,
      ({ detail, tone }) => `周一最难的不是上班，是还要保持礼貌地面对${detail}。${tone}`,
    ],
    excuse: [
      ({ detail }) => `关于${detail}，我会处理，但建议今天不要再临时加码。再加一点，我的礼貌就要先下班了。`,
      ({ detail }) => `我可以扛${detail}，但前提是今天别再给我塞新变量，不然结果只会更难看。`,
    ],
    reply: [
      ({ detail }) => `收到${detail}。我先处理最关键的一步，剩下的请给我一点人类缓冲时间。`,
      ({ detail }) => `这事我会接，但今天请按优先级来，不然我只能随机发疯。`,
    ],
    caption: [
      ({ detail }) => `成年人周一不发疯，只是因为还要假装能处理${detail}。`,
      ({ detail }) => `周一的体面，是明明被${detail}逼到墙角，还得回一句“收到”。`,
    ],
    reminder: "发疯归发疯，结果里要留一条能真的拿去用的话。",
  },
};

function normalizeMode(mode) {
  return Object.hasOwn(MONDAY_MODES, mode) ? mode : "soul";
}

function normalizeIntensity(intensity) {
  return Object.hasOwn(INTENSITY_LABELS, intensity) ? intensity : "sharp";
}

function cleanDetail(detail) {
  const text = String(detail || "").trim();
  return text || "这摊工作";
}

function pick(items, random) {
  const index = Math.min(items.length - 1, Math.floor(random() * items.length));
  return items[index];
}

function toneForIntensity(intensity) {
  if (intensity === "low") return " 先让我慢慢做人。";
  if (intensity === "feral") return " 我现在全靠职业道德吊着一口气。";
  return " 但我还在努力装成一个正常同事。";
}

export function createMondayKit(options = {}, random = Math.random) {
  const mode = normalizeMode(options.mode);
  const intensity = normalizeIntensity(options.intensity);
  const detail = cleanDetail(options.detail);
  const templates = MODE_TEMPLATES[mode];
  const context = {
    detail,
    tone: toneForIntensity(intensity),
  };

  const headline = pick(templates.headline, random)(context);
  const excuse = pick(templates.excuse, random)(context);
  const reply = pick(templates.reply, random)(context);
  const caption = pick(templates.caption, random)(context);

  return {
    mode,
    modeLabel: MONDAY_MODES[mode].label,
    accent: MONDAY_MODES[mode].accent,
    intensity,
    intensityLabel: INTENSITY_LABELS[intensity],
    headline,
    excuse,
    reply,
    caption,
    reminder: templates.reminder,
    shareText: `今天抽到的周一续命包：${headline} ${caption}`,
  };
}
