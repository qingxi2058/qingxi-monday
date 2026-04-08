import { createMondayKit, MONDAY_MODES } from "./logic.js";

const topReasons = [
  "上午 9 点就开周会",
  "刚坐下就被追进度",
  "周末没休够，灵魂还没回工位",
  "今天只想回一句“收到”",
];

const state = {
  mode: "soul",
  intensity: "sharp",
};

const modeButtons = [...document.querySelectorAll("[data-mode]")];
const intensityButtons = [...document.querySelectorAll("[data-intensity]")];
const detailInput = document.querySelector("#detail-input");
const resultPanel = document.querySelector("#result-panel");
const copiedHint = document.querySelector("#copied-hint");
const topReasonList = document.querySelector("#top-reasons");

const resultFields = {
  summary: document.querySelector("#result-summary"),
  headline: document.querySelector("#result-headline"),
  excuse: document.querySelector("#result-excuse"),
  reply: document.querySelector("#result-reply"),
  caption: document.querySelector("#result-caption"),
  reminder: document.querySelector("#result-reminder"),
};

function renderTopReasons() {
  topReasonList.innerHTML = topReasons
    .map((reason) => `<li>${reason}</li>`)
    .join("");
}

function updateActiveButtons() {
  modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
  intensityButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.intensity === state.intensity);
  });
}

function showCopied(message) {
  copiedHint.textContent = message;
  copiedHint.hidden = false;
  clearTimeout(showCopied.timer);
  showCopied.timer = window.setTimeout(() => {
    copiedHint.hidden = true;
  }, 1800);
}

async function copyText(text, message = "已复制") {
  await navigator.clipboard.writeText(text);
  showCopied(message);
}

function renderKit(kit) {
  resultFields.summary.textContent = `${kit.modeLabel} · ${kit.intensityLabel}`;
  resultFields.headline.textContent = kit.headline;
  resultFields.excuse.textContent = kit.excuse;
  resultFields.reply.textContent = kit.reply;
  resultFields.caption.textContent = kit.caption;
  resultFields.reminder.textContent = kit.reminder;
  resultPanel.hidden = false;
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });

  document.querySelector("#copy-all").onclick = () =>
    copyText(
      [
        `周一状态：${kit.headline}`,
        `请假/缓冲版：${kit.excuse}`,
        `同事可直接发：${kit.reply}`,
        `朋友圈/群聊配文：${kit.caption}`,
      ].join("\n"),
      "整套周一续命包已复制",
    );

  document.querySelector("#share-result").onclick = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "周一续命包",
        text: kit.shareText,
        url: window.location.href,
      });
      return;
    }
    await copyText(`${kit.shareText} ${window.location.href}`, "分享文案已复制");
  };

  document
    .querySelectorAll("[data-copy-field]")
    .forEach((button) => {
      button.onclick = () => {
        const field = button.dataset.copyField;
        copyText(kit[field], "这条已复制");
      };
    });
}

document.querySelector("#generate-button").addEventListener("click", () => {
  const kit = createMondayKit({
    mode: state.mode,
    intensity: state.intensity,
    detail: detailInput.value,
  });
  renderKit(kit);
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    const placeholder = button.dataset.placeholder;
    detailInput.placeholder = placeholder;
    updateActiveButtons();
  });
});

intensityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.intensity = button.dataset.intensity;
    updateActiveButtons();
  });
});

detailInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector("#generate-button").click();
  }
});

document.querySelector("#shuffle-reason").addEventListener("click", () => {
  const items = [...topReasons];
  topReasons.push(items.shift());
  topReasons.splice(0, items.length, ...items);
  renderTopReasons();
});

renderTopReasons();
updateActiveButtons();

document.querySelector("#mode-count").textContent = String(
  Object.keys(MONDAY_MODES).length,
);
