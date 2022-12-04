async function init() {
  if (window.buttonsInterval) {
    clearInterval(window.buttonsInterval);
  }
  window.buttonsInterval = setInterval(() => {
    const actionsArea = selectElementByClassPrefix(
      "PromptTextarea__LastItemActions"
    );
    if (!actionsArea) {
      return;
    }
    const buttons = actionsArea.querySelectorAll("button");
    const hasTryAgainButton = Array.from(buttons).some((button) => {
      return !button.id?.includes("download");
    });
    if (hasTryAgainButton && buttons.length === 1) {
      const TryAgainButton = actionsArea.querySelector("button");
      addActionsButtons(actionsArea, TryAgainButton);
    } else if (!hasTryAgainButton) {
      removeButtons();
    }
  }, 200);
}

const Format = {
  PNG: "png",
  PDF: "pdf",
};

function removeButtons() {
  const downloadButton = document.getElementById("download-png-button");
  const downloadPdfButton = document.getElementById("download-pdf-button");
  if (downloadButton) {
    downloadButton.remove();
  }
  if (downloadPdfButton) {
    downloadPdfButton.remove();
  }
}

function addActionsButtons(actionsArea, TryAgainButton) {
  const downloadButton = TryAgainButton.cloneNode(true);
  downloadButton.id = "download-png-button";
  downloadButton.innerText = "Generate PNG";
  downloadButton.onclick = () => {
    downloadThread();
  };
  actionsArea.appendChild(downloadButton);
  const downloadPdfButton = TryAgainButton.cloneNode(true);
  downloadPdfButton.id = "download-pdf-button";
  downloadPdfButton.innerText = "Download PDF";
  downloadPdfButton.onclick = () => {
    downloadThread({ as: Format.PDF });
  };
  actionsArea.appendChild(downloadPdfButton);
}

function downloadThread({ as = Format.PNG } = {}) {
  const elements = new Elements();
  elements.fixLocation();
  const pixelRatio = window.devicePixelRatio;
  const minRatio = as === Format.PDF ? 2 : 2.5;
  window.devicePixelRatio = Math.max(pixelRatio, minRatio);
  html2canvas(elements.thread).then(async function (canvas) {
    elements.restoreLocation();
    window.devicePixelRatio = pixelRatio;
    const imgData = canvas.toDataURL("image/png");
    requestAnimationFrame(() => {
      if (as === Format.PDF) {
        return handlePdf(imgData, canvas, pixelRatio);
      } else {
        handleImg(imgData);
      }
    });
  });
}

function handleImg(imgData) {
  const binaryData = atob(imgData.split("base64,")[1]);
  const data = [];
  for (let i = 0; i < binaryData.length; i++) {
    data.push(binaryData.charCodeAt(i));
  }
  const blob = new Blob([new Uint8Array(data)], { type: "image/png" });
  const url = URL.createObjectURL(blob);

  window.open(url, "_blank");

  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "chat-gpt-image.png";
  //   a.click();
}

function handlePdf(imgData, canvas, pixelRatio) {
  const { jsPDF } = window.jspdf;
  const orientation = canvas.width > canvas.height ? "l" : "p";
  var pdf = new jsPDF(orientation, "pt", [
    canvas.width / pixelRatio,
    canvas.height / pixelRatio,
  ]);
  var pdfWidth = pdf.internal.pageSize.getWidth();
  var pdfHeight = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("chat-gpt.pdf");
}

// async function getWidthHeightFromBase64(base64Img) {
//   return new Promise((resolve, reject) => {
//     // Then, create a new Image from the blob
//     const img = new Image();
//     img.src = base64Img;

//     img.onload = () => {
//       const width = img.width;
//       const height = img.height;
//       resolve({ width, height });
//     };
//   });
// }

class Elements {
  constructor() {
    this.init();
  }
  init() {
    this.threadWrapper = selectElementByClassPrefix("Thread__Wrapper");
    this.spacer = selectElementByClassPrefix("ThreadLayout__BottomSpacer");
    this.thread = selectElementByClassPrefix("ThreadLayout__NodeWrapper");
    this.positionForm = selectElementByClassPrefix("Thread__PositionForm");
    this.styledThread = selectElementByClassPrefix("Thread__StyledThread");
    this.threadContent = selectElementByClassPrefix("Thread__Content");
    this.scroller = Array.from(
      document.querySelectorAll('[class*="react-scroll-to"]')
    ).filter((el) => el.classList.contains("h-full"))[0];
  }
  fixLocation() {
    this.threadWrapper.style.overflow = "auto";
    this.styledThread.style.overflow = "auto";
    this.threadContent.style.overflow = "auto";
    this.spacer.style.display = "none";
    this.thread.style.maxWidth = "960px";
    this.thread.style.marginInline = "auto";
    this.positionForm.style.display = "none";
    this.scroller.classList.remove("h-full");
    this.scroller.style.minHeight = "100vh";
  }
  restoreLocation() {
    this.threadWrapper.style.overflow = null;
    this.styledThread.style.overflow = null;
    this.threadContent.style.overflow = null;
    this.spacer.style.display = null;
    this.thread.style.maxWidth = null;
    this.thread.style.marginInline = null;
    this.positionForm.style.display = null;
    this.scroller.classList.add("h-full");
    this.scroller.style.minHeight = null;
  }
}

function selectElementByClassPrefix(classPrefix) {
  const element = document.querySelector(`[class^='${classPrefix}']`);
  return element;
}

// run init
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
