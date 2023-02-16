const Format = {
  PNG: "png",
  PDF: "pdf",
};

const TRY_AGAIN_BUTTON_HTML = `<button class="btn flex justify-center gap-2 btn-neutral" id="download-png-button">Try Again</button>`;
const ACTIONS_AREA_SELECTOR = "form>div>div";
const OPEN_SCREEN_SELECTOR = "h1.text-4xl";
const CONVERSATION_SELECTOR = "form button>div";
const FINISHED_CONVERSATION_SELECTOR = "form button>svg";
const SHARE_BUTTONS_SELECTOR = "button[share-ext]";
const DOWNLOAD_PNG_BUTTON_SELECTOR = "#download-png-button";
const DOWNLOAD_PDF_BUTTON_SELECTOR = "#download-pdf-button";
const DOWNLOAD_HTML_BUTTON_SELECTOR = "#download-html-button";

const DEFAULT_FORMAT = Format.PNG;
const MIN_PDF_PIXEL_RATIO = 2;
const MIN_PNG_PIXEL_RATIO = 2.5;

let buttonsInterval;

async function init() {
  clearIntervalIfExists();
  setIntervalForButtons();
}

function clearIntervalIfExists() {
  if (window.buttonsInterval) {
    clearInterval(window.buttonsInterval);
  }
}

function setIntervalForButtons() {
  window.buttonsInterval = setInterval(() => {
    const actionsArea = getActionsArea();
    if (!actionsArea) return;
    if (shouldAddButtons(actionsArea)) {
      addActionsButtons(actionsArea);
    } else if (shouldRemoveButtons()) {
      removeButtons();
    }
  }, 200);
}

function getActionsArea() {
  return document.querySelector(ACTIONS_AREA_SELECTOR);
}

function addActionsButtons(actionsArea) {
  const TryAgainButton = getTryAgainButton(actionsArea);
  addDownloadPngButton(actionsArea, TryAgainButton);
  addDownloadPdfButton(actionsArea, TryAgainButton);
  addShareLinkButton(actionsArea, TryAgainButton);
}

function getTryAgainButton(actionsArea) {
  let TryAgainButton = actionsArea.querySelector("button");
  if (!TryAgainButton) {
    const parentNode = document.createElement("div");
    parentNode.innerHTML = TRY_AGAIN_BUTTON_HTML;
    TryAgainButton = parentNode.querySelector("button");
  }
  return TryAgainButton;
}

function addDownloadPngButton(actionsArea, TryAgainButton) {
  const downloadButton = TryAgainButton.cloneNode(true);
  downloadButton.id = DOWNLOAD_PNG_BUTTON_SELECTOR;
  downloadButton.setAttribute("share-ext", "true");
  downloadButton.innerText = "Generate PNG";
  downloadButton.onclick = downloadThread;
  actionsArea.appendChild(downloadButton);
}

function addDownloadPdfButton(actionsArea, TryAgainButton) {
  const downloadPdfButton = TryAgainButton.cloneNode(true);
  downloadPdfButton.id = DOWNLOAD_PDF_BUTTON_SELECTOR;
  downloadPdfButton.setAttribute("share-ext", "true");
  downloadPdfButton.innerText = "Download PDF";
  downloadPdfButton.onclick = () => downloadThread({ as: Format.PDF });
  actionsArea.appendChild(downloadPdfButton);
}

function addShareLinkButton(actionsArea, TryAgainButton) {
  const exportHtml = TryAgainButton.cloneNode(true);
  exportHtml.id = DOWNLOAD_HTML_BUTTON_SELECTOR;
  exportHtml.setAttribute("share-ext", "true");
  exportHtml.innerText = "Share Link";
  exportHtml.onclick = sendRequest;
  actionsArea.appendChild(exportHtml);
}

function shouldRemoveButtons() {
  const isOpenScreen = document.querySelector(OPEN_SCREEN_SELECTOR);
  if (isOpenScreen) {
    return true;
  }
  const inConversation = document.querySelector(CONVERSATION_SELECTOR);
  if (inConversation) {
    return true;
  }
  return false;
}

function shouldAddButtons(actionsArea) {
  if (shouldRemoveButtons()) {
    return false;
  }

  const buttons = actionsArea.querySelectorAll("button");
  const hasTryAgainButton = Array.from(buttons).some((button) => {
    return !button.id?.includes("download");
  });
  if (hasTryAgainButton && buttons.length === 1) {
    return true;
  }

  const isOpenScreen = document.querySelector(OPEN_SCREEN_SELECTOR);
  if (isOpenScreen) {
    return false;
  }

  const finishedConversation = document.querySelector(FINISHED_CONVERSATION_SELECTOR);
  const hasShareButtons = actionsArea.querySelectorAll(SHARE_BUTTONS_SELECTOR);
  if (finishedConversation && !hasShareButtons.length) {
    return true;
  }

  return false;
}

function removeButtons() {
  const downloadButton = document.querySelector(DOWNLOAD_PNG_BUTTON_SELECTOR);
  if (downloadButton) {
    downloadButton.remove();
  }

  const downloadPdfButton = document.querySelector(DOWNLOAD_PDF_BUTTON_SELECTOR);
  if (downloadPdfButton) {
    downloadPdfButton.remove();
  }

  const downloadHtmlButton = document.querySelector(DOWNLOAD_HTML_BUTTON_SELECTOR);
  if (downloadHtmlButton) {
    downloadHtmlButton.remove();
  }
}

function downloadThread({ as = DEFAULT_FORMAT } = {}) {
  if (as === Format.PDF) {
    downloadThreadPdf();
  } else {
    downloadThreadPng();
  }
}

function downloadThreadPng() {
  const elements = new Elements();
  elements.fixLocation();

  const pixelRatio = window.devicePixelRatio;
  window.devicePixelRatio = Math.max(pixelRatio, MIN_PNG_PIXEL_RATIO);

  html2canvas(elements.thread, {
    letterRendering: true,
  }).then(async function (canvas) {
    elements.restoreLocation();
    window.devicePixelRatio = pixelRatio;
    const imgData = canvas.toDataURL("image/png");
    requestAnimationFrame(() => {
      handlePng(imgData);
    });
  });
}

function handlePng(imgData) {
  const binaryData = atob(imgData.split("base64,")[1]);
  const data = [];
  for (let i = 0; i < binaryData.length; i++) {
    data.push(binaryData.charCodeAt(i));
  }
  const blob = new Blob([new Uint8Array(data)], { type: "image/png" });
  const url = URL.createObjectURL(blob);

  window.open(url, "_blank");
}

function downloadThreadPdf() {
  const elements = new Elements();
  elements.fixLocation();

  const pixelRatio = window.devicePixelRatio;
  window.devicePixelRatio = Math.max(pixelRatio, MIN_PDF_PIXEL_RATIO);

  html2canvas(elements.thread, {
    letterRendering: true,
  }).then(async function (canvas) {
    elements.restoreLocation();
    window.devicePixelRatio = pixelRatio;
    const imgData = canvas.toDataURL("image/png");
    requestAnimationFrame(() => {
      handlePdf(imgData, canvas, pixelRatio);
    });
  });
}

function handlePdf(imgData, canvas, pixelRatio) {
  const { jsPDF } = window.jspdf;
  const orientation = canvas.width > canvas.height ? "l" : "p";
  var pdf = new jsPDF(orientation, "pt", [canvas.width / pixelRatio, canvas.height / pixelRatio]);
  var pdfWidth = pdf.internal.pageSize.getWidth();
  var pdfHeight = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("chat-gpt.pdf");
}

class Elements {
  constructor() {
    this.init();
  }
  init() {
    this.spacer = document.querySelector(".w-full.h-32.md\\:h-48.flex-shrink-0");
    this.thread = document.querySelector("main>div.flex-1>div>div");
    this.feedback = this.thread.querySelectorAll("div>div.text-base>div:nth-of-type(2)>div:nth-of-type(2)");
    this.positionForm = document.querySelector("form").parentNode;
    this.hiddens = Array.from(document.querySelectorAll(".overflow-hidden"));
    this.images = Array.from(document.querySelectorAll("img[srcset]"));
  }
  fixLocation() {
    this.hiddens.forEach((el) => {
      el.classList.remove("overflow-hidden");
    });
    this.spacer.style.display = "none";
    this.thread.style.maxWidth = "960px";
    this.thread.style.marginInline = "auto";
    this.positionForm.style.display = "none";
    this.feedback.forEach((item) => {
      item.style.display = "none";
    });
    this.images.forEach((img) => {
      const srcset = img.getAttribute("srcset");
      img.setAttribute("srcset_old", srcset);
      img.setAttribute("srcset", "");
    });
    //Fix to the text shifting down when generating the canvas
    document.body.style.lineHeight = "0.5";
  }
  restoreLocation() {
    this.hiddens.forEach((el) => {
      el.classList.add("overflow-hidden");
    });
    this.spacer.style.display = null;
    this.thread.style.maxWidth = null;
    this.thread.style.marginInline = null;
    this.positionForm.style.display = null;
    this.feedback.forEach((item) => {
      item.style.display = null;
    });

    this.images.forEach((img) => {
      const srcset = img.getAttribute("srcset_old");
      img.setAttribute("srcset", srcset);
      img.setAttribute("srcset_old", "");
    });
    document.body.style.lineHeight = null;
  }
}

function selectElementByClassPrefix(classPrefix) {
  const element = document.querySelector(`[class^='${classPrefix}']`);
  return element;
}

async function sendRequest() {
  const data = getData();
  const uploadUrlResponse = await fetch("https://chatgpt-static.s3.amazonaws.com/url.txt");
  const uploadUrl = await uploadUrlResponse.text();
  fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      window.open(data.url, "_blank");
    });
}

function getData() {
  const globalCss = getCssFromSheet(document.querySelector("link[rel=stylesheet]").sheet);
  const localCss = getCssFromSheet(document.querySelector(`style[data-emotion]`).sheet) || "body{}";
  const data = {
    main: document.querySelector("main").outerHTML,
    globalCss,
    localCss,
  };
  return data;
}

function getCssFromSheet(sheet) {
  return Array.from(sheet.cssRules)
    .map((rule) => rule.cssText)
    .join("");
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
