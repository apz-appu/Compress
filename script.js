// const slider = document.getElementById("quality");

// slider.oninput = () => {
//   document.getElementById("value").innerHTML =
//     slider.value + '<span class="pct">%</span>';
// };

// // Drag and drop support
// const uploadZone = document.getElementById("uploadZone");
// const fileInput = document.getElementById("imageInput");

// uploadZone.addEventListener("dragover", (e) => {
//   e.preventDefault();
//   uploadZone.classList.add("drag-over");
// });

// uploadZone.addEventListener("dragleave", () => {
//   uploadZone.classList.remove("drag-over");
// });

// uploadZone.addEventListener("drop", (e) => {
//   e.preventDefault();
//   uploadZone.classList.remove("drag-over");
//   const files = e.dataTransfer.files;
//   if (files.length && files[0].type.startsWith("image/")) {
//     fileInput.files = files;
//     showFileName(files[0].name);
//   }
// });

// fileInput.addEventListener("change", () => {
//   if (fileInput.files[0]) {
//     showFileName(fileInput.files[0].name);
//   }
// });

// function showFileName(name) {
//   const el = document.getElementById("fileName");
//   el.textContent = "Selected: " + name;
//   el.style.display = "block";
// }

// async function compressImage() {
//   const file = document.getElementById("imageInput").files[0];

//   if (!file) {
//     alert("Please select an image first.");
//     return;
//   }

//   const quality = slider.value / 100;
//   const img = new Image();
//   img.src = URL.createObjectURL(file);

//   img.onload = () => {
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     canvas.width = img.width;
//     canvas.height = img.height;
//     ctx.drawImage(img, 0, 0);

//     canvas.toBlob(
//       (blob) => {
//         const url = URL.createObjectURL(blob);

//         const dlBtn = document.getElementById("download");
//         dlBtn.href = url;
//         dlBtn.download = "compressed.jpg";  // BUG FIX: was missing the dot before innerText

//         const origKB = (file.size / 1024).toFixed(1);
//         const compKB = (blob.size / 1024).toFixed(1);
//         const saving = (((file.size - blob.size) / file.size) * 100).toFixed(0);

//         document.getElementById("originalSize").textContent = origKB + " KB";
//         document.getElementById("compressedSize").textContent = compKB + " KB";  // BUG FIX: was missing the dot before innerText

//         const badge = document.getElementById("savingBadge");
//         if (saving > 0) {
//           badge.textContent = `↓ ${saving}% smaller`;
//           badge.style.display = "inline-block";
//         } else {
//           badge.style.display = "none";
//         }

//         document.getElementById("resultCard").classList.add("visible");
//       },
//       "image/jpeg",
//       quality
//     );
//   };
// }


/* =============================================
   FilePress — Image · Video · PDF Compressor
   ============================================= */

// ── Tab switching ──────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector(`.nav-item[data-tab="${tab}"]`).classList.add('active');
}

// ── Generic helpers ────────────────────────────
function fmtSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function saving(orig, comp) {
  return (((orig - comp) / orig) * 100).toFixed(0);
}

function showResult(cardId, origBytes, compBytes, dlId, url, filename, badgeId) {
  const card = document.getElementById(cardId);
  card.classList.add('visible');
  document.getElementById(dlId.orig).textContent = fmtSize(origBytes);
  document.getElementById(dlId.comp).textContent = fmtSize(compBytes);
  const pct = saving(origBytes, compBytes);
  const badge = document.getElementById(badgeId);
  if (pct > 0) { badge.textContent = `↓ ${pct}% smaller`; badge.style.display = 'inline-block'; }
  else badge.style.display = 'none';
  const a = document.getElementById(url.id);
  a.href = url.href;
  a.download = filename;
}

function setupUploadZone(zoneId, inputId, pillId) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag-over');
    if (e.dataTransfer.files.length) {
      input.files = e.dataTransfer.files;
      input.dispatchEvent(new Event('change'));
    }
  });
  input.addEventListener('change', () => {
    if (input.files[0]) {
      const pill = document.getElementById(pillId);
      pill.textContent = input.files[0].name;
      pill.style.display = 'inline-block';
    }
  });
}

function setupBtnGroup(groupId) {
  document.getElementById(groupId).querySelectorAll('.fmt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(groupId).querySelectorAll('.fmt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function setupSlider(sliderId, valId, suffix) {
  const s = document.getElementById(sliderId);
  const v = document.getElementById(valId);
  s.oninput = () => { v.innerHTML = s.value + `<em>${suffix}</em>`; };
}

// ── Init ───────────────────────────────────────
setupUploadZone('imgUploadZone', 'imageInput', 'imgFileName');
setupUploadZone('vidUploadZone', 'videoInput', 'vidFileName');
setupUploadZone('pdfUploadZone', 'pdfInput', 'pdfFileName');
setupBtnGroup('imgFormatGroup');
setupBtnGroup('vidResGroup');
setupBtnGroup('pdfModeGroup');
setupSlider('imgQuality', 'imgQualityVal', '%');
setupSlider('vidCrf', 'vidCrfVal', ' CRF');
setupSlider('pdfQuality', 'pdfQualityVal', '%');

// Preview when image picked
document.getElementById('imageInput').addEventListener('change', function () {
  if (!this.files[0]) return;
  const url = URL.createObjectURL(this.files[0]);
  document.getElementById('imgOriginal').src = url;
  document.getElementById('imgPreviewWrap').style.display = 'grid';
  document.getElementById('imgCompressed').src = '';
  document.getElementById('imgResult').classList.remove('visible');
});


/* =============================================
   IMAGE COMPRESSION
   ============================================= */
function compressImage() {
  const file = document.getElementById('imageInput').files[0];
  if (!file) { alert('Please select an image.'); return; }

  const quality = parseInt(document.getElementById('imgQuality').value) / 100;
  const fmt = document.querySelector('#imgFormatGroup .fmt-btn.active').dataset.fmt;
  const targetW = parseInt(document.getElementById('imgWidth').value) || 0;
  const targetH = parseInt(document.getElementById('imgHeight').value) || 0;

  const btn = document.getElementById('imgCompressBtn');
  btn.textContent = 'Compressing…'; btn.disabled = true;

  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    let w = img.width, h = img.height;

    // Resize if requested
    if (targetW && targetH) { w = targetW; h = targetH; }
    else if (targetW) { h = Math.round(img.height * targetW / img.width); w = targetW; }
    else if (targetH) { w = Math.round(img.width * targetH / img.height); h = targetH; }

    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);

    // PNG is lossless — quality doesn't apply, but we still resize
    const q = fmt === 'image/png' ? undefined : quality;

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      document.getElementById('imgCompressed').src = url;

      const ext = fmt === 'image/jpeg' ? 'jpg' : fmt === 'image/webp' ? 'webp' : 'png';
      showResult('imgResult', file.size, blob.size,
        { orig: 'imgOrigSize', comp: 'imgCompSize' },
        { id: 'imgDownload', href: url }, `compressed.${ext}`, 'imgSaveBadge');

      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v10M5 8l4 4 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 14h14" stroke="white" stroke-width="2" stroke-linecap="round"/></svg> Compress Image`;
      btn.disabled = false;
    }, fmt, q);
  };
}


/* =============================================
   VIDEO COMPRESSION  (MediaRecorder + Canvas)
   Works in all modern browsers, no HTTPS needed,
   no SharedArrayBuffer, no external WASM.
   ============================================= */

async function compressVideo() {
  const file = document.getElementById('videoInput').files[0];
  if (!file) { alert('Please select a video.'); return; }

  // CRF 18–51 → map to bitrate range 8000kbps–300kbps
  const crfVal   = parseInt(document.getElementById('vidCrf').value);
  const crfNorm  = (crfVal - 18) / (51 - 18);           // 0 = best, 1 = smallest
  const videoBps = Math.round((8000 - crfNorm * 7700) * 1000); // 8Mbps → 300kbps

  // Resolution preset → target width (height auto)
  const resBtn   = document.querySelector('#vidResGroup .fmt-btn.active').dataset.res;
  const targetW  = resBtn === 'original' ? null : parseInt(resBtn.split(':')[0]);
  const targetH  = resBtn === 'original' ? null : parseInt(resBtn.split(':')[1]);

  const btn      = document.getElementById('vidCompressBtn');
  const progress = document.getElementById('vidProgress');
  const fillEl   = document.getElementById('vidProgressFill');
  const textEl   = document.getElementById('vidProgressText');

  btn.textContent = 'Preparing…'; btn.disabled = true;
  progress.style.display = 'block';
  fillEl.style.width = '0%';
  textEl.textContent  = 'Reading video…';
  document.getElementById('vidResult').classList.remove('visible');

  try {
    // ── 1. Load the file into a <video> element ──
    const srcUrl = URL.createObjectURL(file);
    const video  = document.createElement('video');
    video.src    = srcUrl;
    video.muted  = true;
    video.playsInline = true;
    video.preload = 'auto';

    await new Promise((res, rej) => {
      video.onloadedmetadata = res;
      video.onerror = rej;
    });

    const origW = video.videoWidth;
    const origH = video.videoHeight;
    const duration = video.duration;

    // ── 2. Compute output canvas size ──
    let outW = origW, outH = origH;
    if (targetW && targetH) {
      outW = targetW; outH = targetH;
    } else if (targetW) {
      outH = Math.round(origH * targetW / origW);
      outW = targetW;
    }
    // Ensure even dimensions (required by some codecs)
    outW = outW % 2 === 0 ? outW : outW - 1;
    outH = outH % 2 === 0 ? outH : outH - 1;

    // ── 3. Set up canvas ──
    const canvas = document.createElement('canvas');
    canvas.width = outW; canvas.height = outH;
    const ctx = canvas.getContext('2d');

    // ── 4. Pick best supported video codec ──
    const codecOptions = [
      { mime: 'video/webm;codecs=vp9', ext: 'webm' },
      { mime: 'video/webm;codecs=vp8', ext: 'webm' },
      { mime: 'video/webm',            ext: 'webm' },
    ];
    let chosenMime = 'video/webm', chosenExt = 'webm';
    for (const opt of codecOptions) {
      if (MediaRecorder.isTypeSupported(opt.mime)) {
        chosenMime = opt.mime; chosenExt = opt.ext; break;
      }
    }

    // ── 5. Start MediaRecorder ──
    const stream   = canvas.captureStream(30); // 30 fps capture
    const recorder = new MediaRecorder(stream, {
      mimeType: chosenMime,
      videoBitsPerSecond: videoBps
    });

    const chunks = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

    recorder.start(100); // collect data every 100ms
    btn.textContent = 'Compressing…';
    textEl.textContent = 'Compressing…';

    // ── 6. Play video and draw each frame ──
    video.currentTime = 0;
    await new Promise(resolve => { video.onseeked = resolve; });

    await new Promise((resolve, reject) => {
      let lastTime = -1;

      function drawFrame() {
        if (video.ended || video.currentTime >= duration) {
          resolve(); return;
        }

        if (video.currentTime !== lastTime) {
          ctx.drawImage(video, 0, 0, outW, outH);
          lastTime = video.currentTime;

          const pct = Math.min(99, Math.round((video.currentTime / duration) * 100));
          fillEl.style.width = pct + '%';
          textEl.textContent = `Compressing… ${pct}%`;
        }

        requestAnimationFrame(drawFrame);
      }

      video.onerror = reject;
      video.play().then(() => requestAnimationFrame(drawFrame)).catch(reject);
    });

    // ── 7. Stop recording and collect blob ──
    await new Promise(resolve => { recorder.onstop = resolve; recorder.stop(); });
    stream.getTracks().forEach(t => t.stop());

    fillEl.style.width = '100%';
    textEl.textContent = 'Finalising…';

    const blob    = new Blob(chunks, { type: chosenMime });
    const outUrl  = URL.createObjectURL(blob);
    const outName = `compressed.${chosenExt}`;

    showResult('vidResult', file.size, blob.size,
      { orig: 'vidOrigSize', comp: 'vidCompSize' },
      { id: 'vidDownload', href: outUrl }, outName, 'vidSaveBadge');

    progress.style.display = 'none';
    URL.revokeObjectURL(srcUrl);

    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v10M5 8l4 4 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 14h14" stroke="white" stroke-width="2" stroke-linecap="round"/></svg> Compress Video`;
    btn.disabled = false;

  } catch (err) {
    console.error(err);
    document.getElementById('vidProgress').style.display = 'none';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v10M5 8l4 4 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 14h14" stroke="white" stroke-width="2" stroke-linecap="round"/></svg> Compress Video`;
    btn.disabled = false;
    alert('Compression failed: ' + (err.message || err));
  }
}


/* =============================================
   PDF COMPRESSION  (PDF.js render → pdf-lib rebuild)
   Each page is rendered to canvas via PDF.js, then
   re-embedded as a compressed JPEG into a fresh PDF
   via pdf-lib — giving real, significant size savings.
   ============================================= */

// Lazily load PDF.js worker script
function loadPdfJs() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js'));
    document.head.appendChild(script);
  });
}

async function compressPDF() {
  const file = document.getElementById('pdfInput').files[0];
  if (!file) { alert('Please select a PDF.'); return; }
  if (typeof PDFLib === 'undefined') { alert('pdf-lib failed to load. Check your connection.'); return; }

  const quality = parseInt(document.getElementById('pdfQuality').value) / 100;
  const mode    = document.querySelector('#pdfModeGroup .fmt-btn.active').dataset.mode;

  const btn      = document.getElementById('pdfCompressBtn');
  btn.textContent = 'Processing…'; btn.disabled = true;

  const progress = document.getElementById('pdfProgress');
  const fillEl   = document.getElementById('pdfProgressFill');
  const textEl   = document.getElementById('pdfProgressText');
  progress.style.display = 'block';
  fillEl.style.width = '0%';
  textEl.textContent = 'Loading PDF…';
  document.getElementById('pdfResult').classList.remove('visible');

  try {
    // ── 1. Load PDF.js ──
    textEl.textContent = 'Loading PDF.js…';
    const pdfjs = await loadPdfJs();

    // ── 2. Parse source PDF with PDF.js ──
    const arrayBuffer = await file.arrayBuffer();
    const srcPdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const numPages = srcPdf.numPages;

    // ── 3. Determine render scale & JPEG quality by mode ──
    // scale controls rendered resolution (DPI); lower = smaller file
    let scale, jpegQuality;
    if (mode === 'lossless') {
      scale = 1.5; jpegQuality = 0.92;   // high quality, mild size reduction
    } else if (mode === 'aggressive') {
      scale = 0.9; jpegQuality = Math.min(quality, 0.38);
    } else {
      // balanced
      scale = 1.2; jpegQuality = quality;
    }

    // ── 4. Create a new pdf-lib document ──
    const { PDFDocument } = PDFLib;
    const outDoc = await PDFDocument.create();

    const canvas  = document.createElement('canvas');
    const ctx     = canvas.getContext('2d');

    for (let i = 1; i <= numPages; i++) {
      const pct = Math.round(((i - 1) / numPages) * 90);
      fillEl.style.width = pct + '%';
      textEl.textContent = `Rendering page ${i} of ${numPages}…`;

      // Render via PDF.js
      const page     = await srcPdf.getPage(i);
      const viewport = page.getViewport({ scale });
      canvas.width   = viewport.width;
      canvas.height  = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      // Convert canvas → JPEG blob → Uint8Array
      const jpegDataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
      const base64      = jpegDataUrl.split(',')[1];
      const jpegBytes   = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

      // Embed JPEG into pdf-lib page matching original aspect ratio
      const jpgImage  = await outDoc.embedJpg(jpegBytes);
      const origPage  = await srcPdf.getPage(i);
      const origVp    = origPage.getViewport({ scale: 1 });
      const outPage   = outDoc.addPage([origVp.width, origVp.height]);
      outPage.drawImage(jpgImage, {
        x: 0, y: 0,
        width:  origVp.width,
        height: origVp.height,
      });
    }

    fillEl.style.width = '95%';
    textEl.textContent = 'Saving compressed PDF…';

    // ── 5. Serialise with object-stream compression ──
    const finalBytes = await outDoc.save({ useObjectStreams: true, addDefaultPage: false });

    fillEl.style.width = '100%';

    const blob = new Blob([finalBytes], { type: 'application/pdf' });
    const url  = URL.createObjectURL(blob);

    showResult('pdfResult', file.size, blob.size,
      { orig: 'pdfOrigSize', comp: 'pdfCompSize' },
      { id: 'pdfDownload', href: url }, 'compressed.pdf', 'pdfSaveBadge');

    progress.style.display = 'none';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v10M5 8l4 4 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 14h14" stroke="white" stroke-width="2" stroke-linecap="round"/></svg> Compress PDF`;
    btn.disabled = false;

  } catch (e) {
    console.error(e);
    progress.style.display = 'none';
    btn.textContent = 'Compress PDF'; btn.disabled = false;
    alert('PDF compression failed: ' + e.message);
  }
}