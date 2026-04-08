import { createMondayKit } from "./logic.js";

const topReasons = [
  "今天只想回一句“收到”",
  "周会一开就觉得这周已经累了",
  "刚坐下就被追进度",
  "周末没休够，魂还在床上",
];

const state = {
  mode: "soul",
  intensity: "sharp",
};

const modeButtons = [...document.querySelectorAll("[data-mode]")];
const intensityButtons = [...document.querySelectorAll("[data-intensity]")];
const detailInput = document.querySelector("#detail-input");
const copiedHint = document.querySelector("#copied-hint");
const topReasonList = document.querySelector("#top-reasons");
const detailPanel = document.querySelector("#detail-panel");

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
    .map((reason) => `<span class="chip" aria-hidden="true">${reason}</span>`)
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
  resultFields.reminder.textContent = `今天的提醒：${kit.reminder}`;
  detailPanel.hidden = false;

  document.querySelector("#copy-all").onclick = () =>
    copyText(
      [
        kit.headline,
        `体面请假版：${kit.excuse}`,
        `同事可直接发：${kit.reply}`,
        `群聊版：${kit.caption}`,
      ].join("\n"),
      "整套已复制",
    );

  document.querySelector("#share-result").onclick = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "周一不想上班生成器",
        text: kit.shareText,
        url: window.location.href,
      });
      return;
    }

    await copyText(`${kit.shareText} ${window.location.href}`, "分享文案已复制");
  };
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
    detailInput.placeholder = button.dataset.placeholder;
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

renderTopReasons();
updateActiveButtons();
