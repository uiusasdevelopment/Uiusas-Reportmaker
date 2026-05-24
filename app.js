// UIUSAS Report Maker â€” app.js

let currentTheme = 'teal';
let methodStepCount = 0;
let resultCount = 0;

// â”€â”€ THEME â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const themeAccents = {
  teal:    { accent: '#0d9488', accent2: '#0891b2' },
  indigo:  { accent: '#4f46e5', accent2: '#7c3aed' },
  crimson: { accent: '#dc2626', accent2: '#b91c1c' },
  amber:   { accent: '#d97706', accent2: '#b45309' },
  emerald: { accent: '#059669', accent2: '#047857' },
  slate:   { accent: '#475569', accent2: '#334155' },
  caderno: { accent: '#2563eb', accent2: '#1d4ed8' },
  moderno: { accent: '#3b82f6', accent2: '#2563eb' },
  'belle-epoque': { accent: '#8b6b4a', accent2: '#5c432d' },
  cyberpunk: { accent: '#00f0ff', accent2: '#00b3cc' },
  minimalista: { accent: '#1a1a1a', accent2: '#000000' },
  'resident-evil': { accent: '#ffffff', accent2: '#cccccc' },
  'clair-obscur': { accent: '#b78f61', accent2: '#8b6842' },
  pokemon: { accent: '#00ffaa', accent2: '#00cc88' },
  'pokemon-sword': { accent: '#e03a5f', accent2: '#b02a48' },
  silksong: { accent: '#dbb258', accent2: '#a8863f' },
  hexatombe: { accent: '#ff2a2a', accent2: '#cc2222' },
  sinais:  { accent: '#00ffaa', accent2: '#00cc88' },
  nier:    { accent: '#4a4a4a', accent2: '#2a2a2a' },
  'vintage-med': { accent: '#c0392b', accent2: '#8b0000' },
  netter:  { accent: '#8b6b4a', accent2: '#2a221b' },
  hitech:  { accent: '#00f0ff', accent2: '#0088ff' },
  pipboy:  { accent: '#4aff4a', accent2: '#2ecc2e' },
  bloodborne: { accent: '#5e0000', accent2: '#8b0000' },
  tlou:    { accent: '#788a63', accent2: '#4a5d23' },
  genshin: { accent: '#8b7355', accent2: '#d4a351' },
  grimorio: { accent: '#8b0000', accent2: '#f4c430' },
  taverna: { accent: '#8b4513', accent2: '#b8860b' },
  vaporwave: { accent: '#00ffff', accent2: '#ff00ff' },
  steampunk: { accent: '#d2691e', accent2: '#cd853f' },
  pokedex:   { accent: '#ffcb05', accent2: '#3b4cca' }
};

function applyTheme(name) {
  currentTheme = name;
  document.documentElement.setAttribute('data-theme', name);
  document.querySelectorAll('.theme-swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.theme === name);
  });
  updatePreview();
}

document.getElementById('theme-picker').addEventListener('click', e => {
  const swatch = e.target.closest('.theme-swatch');
  if (swatch) applyTheme(swatch.dataset.theme);
});

// â”€â”€ METHODOLOGY STEPS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function addMethodStep(title = '', body = '') {
  methodStepCount++;
  const id = methodStepCount;
  const container = document.getElementById('method-steps-container');
  const div = document.createElement('div');
  div.className = 'method-step';
  div.dataset.stepId = id;
  div.innerHTML = `
    <div class="method-step-header">
      <input type="text" class="step-title" placeholder="Ex: 4.${id}. Preparo dos Materiais" value="${esc(title)}">
      <button class="btn-remove-step" onclick="removeStep(this,'method-steps-container')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <textarea class="step-body" rows="3" placeholder="Descreva os procedimentos desta etapa...">${esc(body)}</textarea>
  `;
  container.appendChild(div);
  div.querySelectorAll('input,textarea').forEach(el => el.addEventListener('input', updatePreview));
  updatePreview();
}

function addResult(title = '', body = '', base64Img = '') {
  resultCount++;
  const container = document.getElementById('results-container');
  const div = document.createElement('div');
  div.className = 'result-item';
  div.innerHTML = `
    <div class="result-item-header">
      <input type="text" class="result-title" placeholder="Ex: Ãgar Manitol Salgado" value="${esc(title)}">
      <button class="btn-remove-step" onclick="removeStep(this,'results-container')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <textarea class="result-body" rows="2" placeholder="Descreva o resultado ou avaliaÃ§Ã£o esperada...">${esc(body)}</textarea>
    <div class="result-image-uploader" style="margin-top: 8px;">
      <input type="file" accept="image/*" class="result-img-input" style="display:none">
      <input type="hidden" class="result-img-base64" value="${base64Img}">
      <button class="btn-ghost btn-upload-img" style="font-size: 0.8rem; padding: 4px 8px;">ðŸ“Ž Adicionar Imagem</button>
      <div class="img-preview-box" style="margin-top: 8px; position: relative; display: ${base64Img ? 'inline-block' : 'none'};">
        <img class="img-preview-el" src="${base64Img}" style="max-width: 100%; max-height: 150px; border-radius: 4px; border: 1px solid rgba(150,150,150,0.2);">
        <button class="btn-remove-img" style="position: absolute; top: -8px; right: -8px; background: #dc2626; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; padding: 0;">X</button>
      </div>
    </div>
  `;
  container.appendChild(div);

  const fileInput = div.querySelector('.result-img-input');
  const base64Input = div.querySelector('.result-img-base64');
  const btnUpload = div.querySelector('.btn-upload-img');
  const btnRemove = div.querySelector('.btn-remove-img');
  const imgPreviewBox = div.querySelector('.img-preview-box');
  const imgPreviewEl = div.querySelector('.img-preview-el');

  btnUpload.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const b64 = evt.target.result;
        base64Input.value = b64;
        imgPreviewEl.src = b64;
        imgPreviewBox.style.display = 'inline-block';
        updatePreview();
      };
      reader.readAsDataURL(file);
    }
  });

  btnRemove.addEventListener('click', () => {
    base64Input.value = '';
    imgPreviewEl.src = '';
    imgPreviewBox.style.display = 'none';
    fileInput.value = '';
    updatePreview();
  });

  div.querySelectorAll('input[type="text"],textarea').forEach(el => el.addEventListener('input', updatePreview));
  updatePreview();
}

function removeStep(btn, containerId) {
  btn.closest('.method-step, .result-item').remove();
  updatePreview();
}

document.getElementById('btn-add-step').addEventListener('click', () => addMethodStep());
document.getElementById('btn-add-result').addEventListener('click', () => addResult());

// â”€â”€ INPUT LISTENERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
document.querySelectorAll('input[type="text"], textarea').forEach(el => {
  el.addEventListener('input', updatePreview);
});
document.getElementById('f-show-brand').addEventListener('change', updatePreview);

// â”€â”€ COLLECT DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function collectData() {
  const steps = [];
  document.querySelectorAll('.method-step').forEach(s => {
    steps.push({
      title: s.querySelector('.step-title').value.trim(),
      body: s.querySelector('.step-body').value.trim(),
    });
  });

  const results = [];
  document.querySelectorAll('.result-item').forEach(r => {
    results.push({
      title: r.querySelector('.result-title').value.trim(),
      body: r.querySelector('.result-body').value.trim(),
      image: r.querySelector('.result-img-base64').value
    });
  });

  return {
    docType: v('f-doc-type'),
    title: v('f-title'),
    theme: v('f-theme'),
    date: v('f-date'),
    discipline: v('f-discipline'),
    student: v('f-student'),
    professor: v('f-professor'),
    institution: v('f-institution'),
    classGroup: v('f-class'),
    intro: v('f-intro'),
    introTitle: v('f-intro-title'),
    objectives: v('f-objectives'),
    objTitle: v('f-obj-title'),
    materials: v('f-materials'),
    matTitle: v('f-mat-title'),
    methodSteps: steps,
    methTitle: v('f-meth-title'),
    results,
    resTitle: v('f-res-title'),
    discussion: v('f-discussion'),
    discTitle: v('f-disc-title'),
    conclusion: v('f-conclusion'),
    concTitle: v('f-conc-title'),
    references: v('f-references'),
    refTitle: v('f-ref-title'),
    colorTheme: currentTheme,
    showBrand: document.getElementById('f-show-brand').checked,
  };
}

function v(id) { 
  const el = document.getElementById(id); 
  return el ? el.value.trim() : ''; 
}
function esc(s) { return s ? s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : ''; }

// â”€â”€ BUILD LIST HTML â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function buildList(text) {
  if (!text) return '';
  return text.split('\n').filter(l => l.trim()).map(l => `
    <li><span class="list-bullet"></span><span>${esc(l.trim())}</span></li>
  `).join('');
}

function buildRefs(text) {
  if (!text) return '';
  return text.split('\n').filter(l => l.trim()).map((l, i) => `
    <li><span class="ref-num">[${i+1}]</span><span>${esc(l.trim())}</span></li>
  `).join('');
}

// â”€â”€ UPDATE PREVIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let previewTimeout;
function updatePreview() {
  clearTimeout(previewTimeout);
  previewTimeout = setTimeout(() => {
    const data = collectData();
    renderPaginated(data);
    applyPreviewScale();
  }, 150);
}

// â”€â”€ RENDER PAGINATED â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderPaginated(d) {
  const { accent, accent2 } = themeAccents[d.colorTheme] || themeAccents.teal;
  const isNier = d.colorTheme === 'nier';
  const isSinais = d.colorTheme === 'sinais';
  const showBrand = d.showBrand !== false; 

  const studentLines = d.student ? d.student.split('\n').map(s=>s.trim()).filter(Boolean) : [];
  const studentVal = studentLines.map(esc).join('<br>');
  const studentLabel = studentLines.length > 1 ? 'Alunos' : 'Aluno(a)';

  const metaItems = [
    { label: 'Data da PrÃ¡tica', value: esc(d.date) },
    { label: 'Disciplina', value: esc(d.discipline) },
    { label: studentLabel, value: studentVal, isRaw: true },
    { label: 'Professor(a)', value: esc(d.professor) },
    { label: 'InstituiÃ§Ã£o', value: esc(d.institution) },
    { label: 'Turma / PerÃ­odo', value: esc(d.classGroup) },
  ].filter(m => m.value);

  const metaHtml = metaItems.map(m => `
    <div class="report-meta-item">
      <div class="report-meta-label">${esc(m.label)}</div>
      <div class="report-meta-value">${m.isRaw ? m.value : m.value}</div>
    </div>
  `).join('');

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });

  // Array of HTML blocks
  const blocks = [];

  blocks.push(`
  <div class="report-cover">
    <div class="report-badge">ðŸ“‹ ${esc(d.docType || 'RELATÃ“RIO DE AULA PRÃTICA')}</div>
    <h1 class="report-cover-title">${esc(d.title || 'RelatÃ³rio de LaboratÃ³rio')}</h1>
    ${d.theme ? `<p class="report-cover-theme">Tema: ${esc(d.theme)}</p>` : ''}
    ${metaHtml ? `<div class="report-meta-grid">${metaHtml}</div>` : ''}
  </div>`);

  const sectionTitle = (num, label) => `
    <h2 class="report-section-title" style="margin-top: 24px; margin-bottom: 16px;">
      <span class="section-number-badge">${num}</span>${esc(label)}
    </h2>
  `;

  if (d.intro) {
    blocks.push(sectionTitle('1', d.introTitle || 'IntroduÃ§Ã£o'));
    d.intro.split('\n\n').forEach(p => {
      if(p.trim()) blocks.push(`<p class="report-text" style="margin-bottom: 12px;">${esc(p)}</p>`);
    });
  }

  if (d.objectives) {
    blocks.push(sectionTitle('2', d.objTitle || 'Objetivos'));
    blocks.push(`<ul class="report-list" style="margin-bottom: 24px;">${buildList(d.objectives)}</ul>`);
  }

  if (d.materials) {
    blocks.push(sectionTitle('3', d.matTitle || 'Materiais e Equipamentos'));
    blocks.push(`<ul class="report-list" style="margin-bottom: 24px;">${buildList(d.materials)}</ul>`);
  }

  if (d.methodSteps && d.methodSteps.length > 0) {
    blocks.push(sectionTitle('4', d.methTitle || 'Metodologia'));
    d.methodSteps.forEach(s => {
      if(s.title || s.body) {
        blocks.push(`
        <div class="method-step-card" style="margin-bottom: 16px;">
          <div class="method-step-card-title">${esc(s.title)}</div>
          <div class="method-step-card-body">${esc(s.body)}</div>
        </div>`);
      }
    });
  }

  if (d.results && d.results.length > 0) {
    blocks.push(sectionTitle('5', d.resTitle || 'Resultados / AvaliaÃ§Ãµes'));
    d.results.forEach(r => {
      if(r.title || r.body || r.image) {
        blocks.push(`
        <div class="result-card" style="margin-bottom: 16px;">
          <div class="result-card-header">
            <div class="result-card-dot"></div>
            <div class="result-card-title">${esc(r.title)}</div>
          </div>
          ${r.body ? `<div class="result-card-body">${esc(r.body)}</div>` : ''}
          ${r.image ? `<div class="result-card-image" style="margin-top: 12px; text-align: center;"><img src="${r.image}" style="max-width: 100%; max-height: 350px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid rgba(150,150,150,0.1);"></div>` : ''}
        </div>`);
      }
    });
  }

  if (d.discussion) {
    blocks.push(sectionTitle('6', d.discTitle || 'DiscussÃ£o'));
    d.discussion.split('\n\n').forEach(p => {
      if(p.trim()) blocks.push(`<p class="report-text" style="margin-bottom: 12px;">${esc(p)}</p>`);
    });
  }

  if (d.conclusion) {
    blocks.push(sectionTitle('7', d.concTitle || 'ConclusÃ£o'));
    d.conclusion.split('\n\n').forEach(p => {
      if(p.trim()) blocks.push(`<p class="report-text" style="margin-bottom: 12px;">${esc(p)}</p>`);
    });
  }

  if (d.references) {
    blocks.push(sectionTitle('8', d.refTitle || 'ReferÃªncias BibliogrÃ¡ficas'));
    blocks.push(`<ul class="references-list" style="margin-bottom: 24px;">${buildRefs(d.references)}</ul>`);
  }

  // --- Theme Overrides ---
  let pageBg = '#ffffff';
  let pageText = '#1a1a2a';
  let extraCss = '';

  const theme = d.colorTheme;

  if (theme === 'nier') {
    pageBg = '#dad4bb'; pageText = '#444';
    extraCss = `
      body, .a4-page { background: #dad4bb !important; color: #444; font-family: 'Arial', sans-serif; border-radius: 0; }
      .report-cover { background: #d0c9ad; border-bottom: 2px solid #a39e86; }
      .report-cover::before { display: none; }
      .report-cover-title { color: #333; font-family: 'Arial', sans-serif; text-transform: uppercase; letter-spacing: 2px; }
      .report-cover-theme { color: #555; }
      .report-meta-item { background: transparent; border: 1px solid #a39e86; border-radius: 0; color: #444; }
      .report-meta-label { color: #666; }
      .report-meta-value { color: #333; }
      .report-section-title { color: #333; border-image: none !important; border-bottom: 2px solid #a39e86; }
      .section-number-badge { background: #444 !important; color: #dad4bb; border-radius: 0; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #444; }
      .method-step-card { border: 1px solid #a39e86; border-radius: 0; border-left-width: 4px; border-left-color: #444 !important; background: #e0dcca; }
      .method-step-card-title { background: #d0c9ad !important; color: #333; }
      .result-card { border: 1px solid #a39e86; border-radius: 0; background: #e0dcca; }
      .result-card-header { background: #a39e86 !important; }
      .result-card-title { color: #fff; }
      .report-footer { background: #d0c9ad; border-top: 2px solid #a39e86; }
      .report-badge { background: #444 !important; color: #dad4bb; border: none; border-radius: 0; }
      .list-bullet { background: #444 !important; border-radius: 0; }
      .ref-num { color: #444 !important; }
    `;
  } else if (theme === 'sinais') {
    pageBg = '#010503'; pageText = '#d4e8d9';
    extraCss = `
      body, .a4-page { background: #010503 !important; color: #d4e8d9; font-family: 'Inter', sans-serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: url('assets/bg-sinais.png') center/cover no-repeat; opacity: 0.15; pointer-events:none; z-index:0; }
      .report-cover { background: rgba(3, 17, 9, 0.95); border-bottom: 3px solid #00ffaa; position: relative; z-index: 1; padding: 40px; }
      .report-badge { border: 1px solid rgba(0, 255, 170, 0.4); color: #00ffaa; background: rgba(0, 255, 170, 0.1); border-radius: 4px; padding: 6px 12px; }
      .report-cover-title { color: #ffffff; text-shadow: 0 0 15px rgba(0, 255, 170, 0.4); font-family: 'Times New Roman', serif; text-transform: uppercase; letter-spacing: 3px; font-weight: 700; }
      .report-cover-theme { color: #00ffaa; font-family: 'Inter', sans-serif; letter-spacing: 4px; text-transform: uppercase; font-size: 0.8rem; }
      .report-meta-item { background: rgba(3, 17, 9, 0.8); border: 1px solid rgba(0, 255, 170, 0.2); border-radius: 6px; }
      .report-meta-label { color: #00ffaa; }
      .report-meta-value { color: #ffffff; }
      .report-section-title { color: #ffffff; font-family: 'Times New Roman', serif; border-image: none !important; border-bottom: 1px solid rgba(0, 255, 170, 0.3); position: relative; z-index: 1; }
      .section-number-badge { background: #00ffaa !important; color: #010503; box-shadow: 0 0 10px rgba(0,255,170,0.3); }
      .method-step-card, .result-card { background: rgba(5, 15, 10, 0.9); border: 1px solid rgba(0, 255, 170, 0.3); position: relative; z-index: 1; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
      .method-step-card-title { color: #00ffaa; background: rgba(0, 255, 170, 0.05) !important; font-family: 'Inter', sans-serif; }
      .result-card-header { background: rgba(0, 255, 170, 0.08) !important; border-bottom: 1px solid rgba(0, 255, 170, 0.2); }
      .result-card-title { color: #00ffaa; }
      .report-text, .report-list li, .references-list li { color: #bfe8ce; position: relative; z-index: 1; border-bottom-color: rgba(0, 255, 170, 0.1); }
      .report-footer { background: #010503; border-top: 1px solid rgba(0, 255, 170, 0.3); position: relative; z-index: 1; }
    `;
  } else if (theme === 'vintage-med') {
    pageBg = '#f5f0e6'; pageText = '#2c2520';
    extraCss = `
      body, .a4-page { background: #f5f0e6 !important; color: #2c2520; font-family: 'Georgia', serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: url('https://www.transparenttextures.com/patterns/old-wall.png'); opacity: 0.3; pointer-events:none; z-index:0; }
      .report-cover { background: rgba(235, 226, 212, 0.95); border-bottom: 3px solid #c0392b; position: relative; z-index: 1; padding: 40px; }
      .report-badge { border: 1px solid rgba(192, 57, 43, 0.4); color: #c0392b; background: rgba(192, 57, 43, 0.1); border-radius: 4px; font-family: 'Courier New', monospace; font-weight: bold; padding: 6px 12px; display: inline-block; margin-bottom: 15px; }
      .report-cover-title { color: #1a1613; font-weight: 800; text-transform: uppercase; font-family: 'Georgia', serif; padding-bottom: 10px; font-size: 2.2rem; }
      .report-cover-theme { color: #c0392b; font-family: 'Georgia', serif; font-style: italic; font-size: 0.9rem; }
      .report-meta-item { background: rgba(253, 251, 247, 0.8); border: 1px solid rgba(224, 213, 193, 0.5); border-radius: 6px; }
      .report-meta-label { color: #c0392b; font-family: 'Courier New', monospace; font-size: 0.85rem; font-weight: bold; }
      .report-meta-value { color: #2c2520; }
      .report-section-title { color: #c0392b; border-image: none !important; border-bottom: 1px solid rgba(224, 213, 193, 0.8); position: relative; z-index: 1; }
      .section-number-badge { background: #c0392b !important; color: #f5f0e6; box-shadow: 0 0 10px rgba(192,57,43,0.2); }
      .method-step-card, .result-card { background: rgba(253, 251, 247, 0.9); border: 1px solid rgba(224, 213, 193, 0.8); position: relative; z-index: 1; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
      .method-step-card-title { color: #c0392b; background: rgba(192, 57, 43, 0.03) !important; border-bottom: 1px solid rgba(224, 213, 193, 0.5); }
      .result-card-header { background: rgba(192, 57, 43, 0.03) !important; border-bottom: 1px solid rgba(224, 213, 193, 0.5); }
      .result-card-title { color: #c0392b; font-family: 'Georgia', serif; }
      .report-text, .report-list li, .references-list li { color: #4a3e35; position: relative; z-index: 1; border-bottom-color: rgba(224, 213, 193, 0.5); }
      .report-footer { background: #ebdcc4; border-top: 1px solid rgba(192, 57, 43, 0.3); position: relative; z-index: 1; }
    `;
  } else if (theme === 'netter') {
    pageBg = '#f9f6f0'; pageText = '#3e352d';
    extraCss = `
      body, .a4-page { background: #f9f6f0 !important; color: #3e352d; font-family: 'Times New Roman', serif; }
      .report-cover { background: rgba(253, 252, 249, 0.95); border-bottom: 3px solid #8b6b4a; position: relative; z-index: 1; padding: 40px; }
      .report-badge { border: 1px solid rgba(139, 107, 74, 0.4); color: #8b6b4a; background: rgba(139, 107, 74, 0.1); border-radius: 4px; font-family: 'Arial', sans-serif; font-size: 0.8rem; font-weight: bold; padding: 6px 12px; display: inline-block; margin-bottom: 15px; }
      .report-cover-title { color: #2a221b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 2.2rem; }
      .report-cover-theme { color: #8b6b4a; font-family: 'Arial', sans-serif; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; }
      .report-meta-item { background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(229, 219, 204, 0.5); border-radius: 6px; }
      .report-meta-label { color: #8b6b4a; font-family: 'Arial', sans-serif; font-size: 0.8rem; text-transform: uppercase; font-weight: bold; }
      .report-meta-value { color: #3e352d; }
      .report-section-title { color: #2a221b; border-image: none !important; border-bottom: 1px solid rgba(139, 107, 74, 0.3); position: relative; z-index: 1; }
      .section-number-badge { background: #8b6b4a !important; color: #fff; box-shadow: 0 0 10px rgba(139,107,74,0.2); }
      .method-step-card, .result-card { background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(229, 219, 204, 0.8); position: relative; z-index: 1; border-radius: 6px; box-shadow: 0 4px 15px rgba(139, 107, 74, 0.05); }
      .method-step-card-title { color: #2a221b; background: rgba(139, 107, 74, 0.05) !important; border-bottom: 1px solid rgba(229, 219, 204, 0.5); font-family: 'Arial', sans-serif; font-weight: bold; }
      .result-card-header { background: rgba(139, 107, 74, 0.05) !important; border-bottom: 1px solid rgba(229, 219, 204, 0.5); }
      .result-card-title { color: #2a221b; font-family: 'Arial', sans-serif; font-weight: bold; }
      .report-text, .report-list li, .references-list li { color: #4d433b; position: relative; z-index: 1; border-bottom-color: rgba(240, 232, 219, 0.5); }
      .report-footer { background: #f2eadd; border-top: 1px solid rgba(139, 107, 74, 0.3); position: relative; z-index: 1; }
    `;
  } else if (theme === 'hitech') {
    pageBg = '#0a1128'; pageText = '#b0c4de';
    extraCss = `
      body, .a4-page { background: #0a1128 !important; color: #b0c4de; font-family: 'Inter', sans-serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: linear-gradient(180deg, rgba(0, 240, 255, 0.03) 0%, transparent 100%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.05) 2px, rgba(0, 240, 255, 0.05) 4px); pointer-events:none; z-index:0; }
      .report-cover { background: rgba(5, 10, 25, 0.95); border-bottom: 2px solid #00f0ff; position: relative; z-index: 1; padding: 40px; }
      .report-badge { border: 1px solid rgba(0, 240, 255, 0.4); color: #00f0ff; background: rgba(0, 240, 255, 0.1); border-radius: 4px; text-transform: uppercase; letter-spacing: 2px; padding: 6px 12px; display: inline-block; margin-bottom: 15px; }
      .report-cover-title { color: #ffffff; font-weight: 800; text-transform: uppercase; font-size: 2.2rem; }
      .report-cover-theme { color: #00f0ff; font-family: 'Orbitron', sans-serif; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; }
      .report-meta-item { background: rgba(10, 17, 40, 0.8); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 4px; }
      .report-meta-label { color: #00f0ff; }
      .report-meta-value { color: #ffffff; }
      .report-section-title { color: #00f0ff; border-image: none !important; border-bottom: 1px solid rgba(0, 240, 255, 0.3); position: relative; z-index: 1; text-transform: uppercase; }
      .section-number-badge { background: #00f0ff !important; color: #0a1128; box-shadow: 0 0 8px rgba(0, 240, 255, 0.4); }
      .method-step-card, .result-card { background: rgba(10, 17, 40, 0.85); border: 1px solid rgba(0, 240, 255, 0.2); position: relative; z-index: 1; border-radius: 4px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); border-left: 3px solid #00f0ff; }
      .method-step-card-title { color: #00f0ff; background: rgba(0, 240, 255, 0.05) !important; border-bottom: 1px solid rgba(0, 240, 255, 0.1); }
      .result-card-header { background: rgba(0, 240, 255, 0.05) !important; border-bottom: 1px solid rgba(0, 240, 255, 0.1); }
      .result-card-title { color: #00f0ff; }
      .report-text, .report-list li, .references-list li { color: #b0c4de; position: relative; z-index: 1; border-bottom-color: rgba(0, 240, 255, 0.1); }
      .report-footer { background: #050a19; border-top: 1px solid rgba(0, 240, 255, 0.3); position: relative; z-index: 1; }
    `;
  } else if (theme === 'pipboy') {
    pageBg = '#051405'; pageText = '#a8ffa8';
    extraCss = `
      body, .a4-page { background: #051405 !important; color: #a8ffa8; font-family: 'Courier New', Courier, monospace; }
      .a4-page::before { content:''; position:absolute; inset:0; background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(74, 255, 74, 0.03) 3px, rgba(74, 255, 74, 0.03) 6px); pointer-events:none; z-index:0; }
      .report-cover { background: rgba(3, 13, 3, 0.95); border-bottom: 3px solid #4aff4a; position: relative; z-index: 1; padding: 40px; }
      .report-badge { border: 1px solid rgba(74, 255, 74, 0.4); color: #4aff4a; background: rgba(74, 255, 74, 0.1); border-radius: 2px; text-transform: uppercase; font-weight: bold; padding: 6px 12px; display: inline-block; margin-bottom: 15px; }
      .report-cover-title { color: #4aff4a; font-weight: 800; text-transform: uppercase; font-size: 2.2rem; }
      .report-cover-theme { color: #2ecc2e; text-transform: uppercase; font-size: 0.8rem; }
      .report-meta-item { background: rgba(3, 13, 3, 0.8); border: 1px solid rgba(74, 255, 74, 0.3); border-radius: 2px; }
      .report-meta-label { color: #2ecc2e; font-weight: bold; }
      .report-meta-value { color: #a8ffa8; }
      .report-section-title { color: #4aff4a; border-image: none !important; border-bottom: 1px dashed rgba(74, 255, 74, 0.5); position: relative; z-index: 1; text-transform: uppercase; }
      .section-number-badge { background: #4aff4a !important; color: #051405; border-radius: 2px; }
      .method-step-card, .result-card { background: rgba(3, 13, 3, 0.9); border: 1px solid rgba(74, 255, 74, 0.3); position: relative; z-index: 1; border-radius: 2px; box-shadow: 2px 2px 0px rgba(74, 255, 74, 0.2); }
      .method-step-card-title { color: #4aff4a; background: rgba(74, 255, 74, 0.05) !important; font-weight: bold; border-bottom: 1px solid rgba(74, 255, 74, 0.2); }
      .result-card-header { background: rgba(74, 255, 74, 0.05) !important; border-bottom: 1px solid rgba(74, 255, 74, 0.2); }
      .result-card-title { color: #4aff4a; font-weight: bold; }
      .report-text, .report-list li, .references-list li { color: #a8ffa8; position: relative; z-index: 1; border-bottom-color: rgba(74, 255, 74, 0.2); text-shadow: 0 0 1px rgba(74, 255, 74, 0.5); }
      .report-footer { background: #030d03; border-top: 1px solid rgba(74, 255, 74, 0.5); position: relative; z-index: 1; }
    `;
  } else if (theme === 'bloodborne') {
    pageBg = '#110d0d'; pageText = '#a39585';
    extraCss = `
      body, .a4-page { background: #110d0d !important; color: #a39585; font-family: 'Playfair Display', serif; }
      .report-cover { background: #0a0808; border-bottom: 3px double #8b0000; position: relative; z-index: 1; padding: 40px; }
      .report-badge { border: 1px solid rgba(139, 0, 0, 0.4); color: #8b0000; background: rgba(139, 0, 0, 0.1); border-radius: 2px; font-family: 'Georgia', serif; letter-spacing: 2px; padding: 6px 12px; display: inline-block; margin-bottom: 15px; }
      .report-cover-title { color: #d4c5b3; font-weight: 700; text-transform: uppercase; font-size: 2.2rem; }
      .report-cover-theme { color: #8b0000; font-family: 'Georgia', serif; font-style: italic; font-size: 0.9rem; }
      .report-meta-item { background: #1a1515; border: 1px solid #3a1a1a; border-radius: 2px; }
      .report-meta-label { color: #8b0000; font-style: italic; }
      .report-meta-value { color: #e6d5c3; }
      .report-section-title { color: #8b0000; border-image: none !important; border-bottom: 1px solid #3a1a1a; position: relative; z-index: 1; }
      .section-number-badge { background: #5e0000 !important; color: #e6d5c3; border-radius: 2px; }
      .method-step-card, .result-card { background: #1a1515; border: 1px solid #3a1a1a; position: relative; z-index: 1; border-radius: 2px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
      .method-step-card-title { color: #e6d5c3; background: #261b1b !important; border-bottom: 1px solid #3a1a1a; }
      .result-card-header { background: #261b1b !important; border-bottom: 1px solid #3a1a1a; }
      .result-card-title { color: #e6d5c3; }
      .report-text, .report-list li, .references-list li { color: #a39585; position: relative; z-index: 1; border-bottom-color: #2a1f1f; }
      .report-footer { background: #0a0808; border-top: 1px solid #5e0000; position: relative; z-index: 1; }
    `;
  } else if (theme === 'tlou') {
    pageBg = '#2a2d24'; pageText = '#d4e09b';
    extraCss = `
      body, .a4-page { background: #2a2d24 !important; color: #d4e09b; font-family: 'Inter', sans-serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: url('https://www.transparenttextures.com/patterns/dark-matter.png'); opacity: 0.15; pointer-events:none; z-index:0; }
      .report-cover { background: rgba(32, 36, 26, 0.95); border-bottom: 3px solid #788a63; position: relative; z-index: 1; padding: 40px; }
      .report-badge { border: 1px solid rgba(120, 138, 99, 0.4); color: #d4e09b; background: rgba(120, 138, 99, 0.1); border-radius: 4px; padding: 6px 12px; display: inline-block; margin-bottom: 15px; }
      .report-cover-title { color: #ffffff; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; font-size: 2.2rem; }
      .report-cover-theme { color: #788a63; text-transform: uppercase; font-size: 0.8rem; }
      .report-meta-item { background: rgba(50, 54, 43, 0.8); border: 1px solid rgba(74, 93, 35, 0.5); border-radius: 6px; }
      .report-meta-label { color: #788a63; }
      .report-meta-value { color: #ffffff; }
      .report-section-title { color: #d4e09b; border-image: none !important; border-bottom: 1px solid rgba(74, 93, 35, 0.5); position: relative; z-index: 1; }
      .section-number-badge { background: #788a63 !important; color: #1f2219; box-shadow: 0 0 10px rgba(120,138,99,0.2); }
      .method-step-card, .result-card { background: rgba(50, 54, 43, 0.9); border: 1px solid rgba(74, 93, 35, 0.5); position: relative; z-index: 1; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
      .method-step-card-title { color: #d4e09b; background: rgba(120, 138, 99, 0.05) !important; border-bottom: 1px solid rgba(74, 93, 35, 0.3); }
      .result-card-header { background: rgba(120, 138, 99, 0.08) !important; border-bottom: 1px solid rgba(74, 93, 35, 0.3); }
      .result-card-title { color: #d4e09b; }
      .report-text, .report-list li, .references-list li { color: #b5c285; position: relative; z-index: 1; border-bottom-color: rgba(120, 138, 99, 0.2); }
      .report-footer { background: #1f2219; border-top: 1px solid rgba(74, 93, 35, 0.5); position: relative; z-index: 1; }
    `;
  } else if (theme === 'genshin') {
    pageBg = '#faf5eb'; pageText = '#5c4b3a';
    extraCss = `
      body, .a4-page { background: #faf5eb !important; color: #5c4b3a; font-family: 'Georgia', serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: radial-gradient(circle at top right, rgba(212, 163, 81, 0.1) 0%, transparent 40%); pointer-events:none; z-index:0; }
      .report-cover { background: rgba(253, 252, 247, 0.95); border-bottom: 3px solid #d4a351; position: relative; z-index: 1; padding: 40px; }
      .report-badge { border: 1px solid rgba(212, 163, 81, 0.4); color: #8b7355; background: rgba(212, 163, 81, 0.1); border-radius: 20px; font-family: 'Inter', sans-serif; text-transform: uppercase; font-size: 0.75rem; padding: 6px 15px; display: inline-block; margin-bottom: 15px; }
      .report-cover-title { color: #3d3126; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; font-size: 2.2rem; }
      .report-cover-theme { color: #8b7355; font-family: 'Inter', sans-serif; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; }
      .report-meta-item { background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(238, 220, 186, 0.5); border-radius: 12px; }
      .report-meta-label { color: #d4a351; font-family: 'Inter', sans-serif; font-size: 0.8rem; text-transform: uppercase; }
      .report-meta-value { color: #3d3126; }
      .report-section-title { color: #8b7355; border-image: none !important; border-bottom: 1px solid rgba(238, 220, 186, 0.8); position: relative; z-index: 1; }
      .section-number-badge { background: #d4a351 !important; color: #fff; border-radius: 50%; box-shadow: 0 2px 5px rgba(212,163,81,0.2); }
      .method-step-card, .result-card { background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(238, 220, 186, 0.8); position: relative; z-index: 1; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
      .method-step-card-title { color: #8b7355; background: rgba(212, 163, 81, 0.05) !important; border-bottom: 1px solid rgba(238, 220, 186, 0.5); font-family: 'Inter', sans-serif; font-weight: 600; }
      .result-card-header { background: rgba(212, 163, 81, 0.08) !important; border-bottom: 1px solid rgba(238, 220, 186, 0.5); }
      .result-card-title { color: #8b7355; font-family: 'Inter', sans-serif; font-weight: 600; }
      .report-text, .report-list li, .references-list li { color: #6b5844; position: relative; z-index: 1; border-bottom-color: rgba(238, 220, 186, 0.4); }
      .report-footer { background: #fff; border-top: 1px solid rgba(238, 220, 186, 0.8); position: relative; z-index: 1; }
    `;
  } else if (theme === 'grimorio') {
    pageBg = '#3a2b22'; pageText = '#d9cbb8';
    extraCss = `
      body, .a4-page { background: #3a2b22 !important; color: #d9cbb8; font-family: 'Playfair Display', serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: url('https://www.transparenttextures.com/patterns/aged-paper.png'); opacity: 0.15; pointer-events:none; z-index:0; }
      .report-cover { background: rgba(43, 31, 24, 0.95); border-bottom: 3px solid #8b0000; position: relative; z-index: 1; padding: 40px; }
      .report-badge { border: 1px solid rgba(244, 196, 48, 0.4); color: #f4c430; background: rgba(244, 196, 48, 0.1); border-radius: 4px; font-family: 'Georgia', serif; padding: 6px 12px; display: inline-block; margin-bottom: 15px; }
      .report-cover-title { color: #f4c430; font-weight: 700; text-transform: uppercase; text-shadow: 2px 2px 5px rgba(0,0,0,0.8); font-size: 2.2rem; }
      .report-meta-item { background: #4a362a; border: 1px solid #6b4d3c; border-radius: 8px; }
      .report-meta-label { color: #f4c430; font-style: italic; }
      .report-meta-value { color: #fff; }
      .report-section-title { color: #f4c430; border-image: none !important; border-bottom: 1px solid #6b4d3c; position: relative; z-index: 1; }
      .section-number-badge { background: #8b0000 !important; color: #f4c430; border: 1px solid #f4c430; }
      .method-step-card, .result-card { background: #4a362a; border: 1px solid #6b4d3c; position: relative; z-index: 1; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); border-left: 4px solid #8b0000; }
      .method-step-card-title { color: #f4c430; background: rgba(244, 196, 48, 0.05) !important; border-bottom: 1px solid #6b4d3c; }
      .result-card-header { background: rgba(139, 0, 0, 0.2) !important; border-bottom: 1px solid #6b4d3c; }
      .result-card-title { color: #f4c430; }
      .report-text, .report-list li, .references-list li { color: #c4b5a2; position: relative; z-index: 1; border-bottom-color: #5c4333; }
      .report-footer { background: #2b1f18; border-top: 1px solid #8b0000; position: relative; z-index: 1; }
    `;
  } else if (theme === 'taverna') {
    pageBg = '#5c4033'; pageText = '#e8d5b7';
    extraCss = `
      body, .a4-page { background: #5c4033 !important; color: #e8d5b7; font-family: 'Georgia', serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: url('https://www.transparenttextures.com/patterns/wood-pattern.png'); opacity: 0.15; pointer-events:none; z-index:0; }
      .report-cover { background: rgba(60, 40, 25, 0.95); border-bottom: 3px solid #b8860b; position: relative; z-index: 1; padding: 40px; }
      .report-badge { border: 1px solid rgba(184, 134, 11, 0.4); color: #ffebcd; background: rgba(184, 134, 11, 0.1); border-radius: 4px; font-weight: bold; padding: 6px 12px; display: inline-block; margin-bottom: 15px; }
      .report-cover-title { color: #ffebcd; font-weight: 800; text-transform: uppercase; text-shadow: 1px 1px 3px rgba(0,0,0,0.5); font-size: 2.2rem; }
      .report-cover-theme { color: #b8860b; font-family: 'Georgia', serif; font-size: 0.8rem; text-transform: uppercase; }
      .report-meta-item { background: rgba(90, 60, 45, 0.8); border: 1px solid rgba(139, 69, 19, 0.5); border-radius: 6px; }
      .report-meta-label { color: #b8860b; font-family: 'Arial', sans-serif; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; }
      .report-meta-value { color: #fff; }
      .report-section-title { color: #ffebcd; border-image: none !important; border-bottom: 1px solid rgba(139, 69, 19, 0.5); position: relative; z-index: 1; }
      .section-number-badge { background: #8b4513 !important; color: #ffebcd; border: 1px solid #b8860b; box-shadow: 0 0 8px rgba(0,0,0,0.2); }
      .method-step-card, .result-card { background: rgba(90, 60, 45, 0.9); border: 1px solid rgba(139, 69, 19, 0.5); position: relative; z-index: 1; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border-left: 3px solid #b8860b; }
      .method-step-card-title { color: #ffebcd; background: rgba(139, 69, 19, 0.1) !important; border-bottom: 1px solid rgba(139, 69, 19, 0.3); }
      .result-card-header { background: rgba(184, 134, 11, 0.1) !important; border-bottom: 1px solid rgba(139, 69, 19, 0.3); }
      .result-card-title { color: #ffebcd; }
      .report-text, .report-list li, .references-list li { color: #d4c2a5; position: relative; z-index: 1; border-bottom-color: rgba(139, 69, 19, 0.3); }
      .report-footer { background: #3a2010; border-top: 1px solid rgba(184, 134, 11, 0.5); position: relative; z-index: 1; }
    `;
  } else if (theme === 'vaporwave') {
    pageBg = '#1a052b'; pageText = '#00ffff';
    extraCss = `
      body, .a4-page { background: #1a052b !important; color: #00ffff; font-family: 'Inter', sans-serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: linear-gradient(180deg, transparent 0%, rgba(255, 0, 255, 0.05) 100%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px); pointer-events:none; z-index:0; }
      .report-cover { background: rgba(20, 5, 40, 0.95); border-bottom: 3px solid #ff00ff; position: relative; z-index: 1; padding: 40px; }
      .report-badge { border: 1px solid rgba(0, 255, 255, 0.4); color: #00ffff; background: rgba(0, 255, 255, 0.1); border-radius: 4px; text-transform: uppercase; font-weight: 800; font-style: italic; padding: 6px 15px; display: inline-block; margin-bottom: 20px; }
      .report-cover-title { color: #ff00ff; font-weight: 800; text-transform: uppercase; text-shadow: 2px 2px 5px rgba(255, 0, 255, 0.3); font-style: italic; font-size: 2.2rem; }
      .report-cover-theme { color: #00ffff; font-style: italic; text-transform: uppercase; font-size: 0.8rem; }
      .report-meta-item { background: rgba(40, 10, 60, 0.8); border: 1px solid rgba(255, 0, 255, 0.3); border-radius: 6px; }
      .report-meta-label { color: #00ffff; font-style: italic; }
      .report-meta-value { color: #ffffff; }
      .report-section-title { color: #ff00ff; border-image: none !important; border-bottom: 1px solid rgba(0, 255, 255, 0.5); position: relative; z-index: 1; font-style: italic; }
      .section-number-badge { background: #ff00ff !important; color: #1a052b; border-radius: 4px; box-shadow: 0 0 10px rgba(255,0,255,0.3); }
      .method-step-card, .result-card { background: rgba(40, 10, 60, 0.85); border: 1px solid rgba(0, 255, 255, 0.3); position: relative; z-index: 1; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); border-left: 3px solid #ff00ff; }
      .method-step-card-title { color: #00ffff; background: rgba(0, 255, 255, 0.05) !important; font-style: italic; font-weight: bold; border-bottom: 1px solid rgba(0, 255, 255, 0.2); }
      .result-card-header { background: rgba(255, 0, 255, 0.05) !important; border-bottom: 1px solid rgba(0, 255, 255, 0.2); }
      .result-card-title { color: #ff00ff; font-style: italic; }
      .report-text, .report-list li, .references-list li { color: #b3ffff; position: relative; z-index: 1; border-bottom-color: rgba(255, 0, 255, 0.2); }
      .report-footer { background: #0a0215; border-top: 1px solid rgba(0, 255, 255, 0.5); position: relative; z-index: 1; }
    `;
  } else if (theme === 'steampunk') {
    pageBg = '#4a2c18'; pageText = '#f5deb3';
    extraCss = `
      body, .a4-page { background: #4a2c18 !important; color: #f5deb3; font-family: 'Playfair Display', serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: radial-gradient(circle, rgba(205, 133, 63, 0.1) 2px, transparent 2.5px); background-size: 20px 20px; pointer-events:none; z-index:0; }
      .report-cover { background: rgba(60, 35, 20, 0.95); border-bottom: 3px solid #d2691e; position: relative; z-index: 1; padding: 40px; }
      .report-badge { border: 1px solid rgba(205, 133, 63, 0.4); color: #ffdead; background: rgba(139, 90, 43, 0.2); border-radius: 4px; text-transform: uppercase; font-family: 'Courier New', monospace; padding: 6px 12px; display: inline-block; margin-bottom: 15px; }
      .report-cover-title { color: #cd853f; font-weight: 800; text-transform: uppercase; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); font-size: 2.2rem; }
      .report-cover-theme { color: #d2691e; font-family: 'Courier New', monospace; font-size: 0.8rem; text-transform: uppercase; }
      .report-meta-item { background: rgba(90, 50, 30, 0.8); border: 1px solid rgba(205, 133, 63, 0.4); border-radius: 6px; }
      .report-meta-label { color: #d2691e; font-family: 'Courier New', monospace; font-weight: bold; }
      .report-meta-value { color: #fff; }
      .report-section-title { color: #cd853f; border-image: none !important; border-bottom: 1px dashed rgba(205, 133, 63, 0.6); position: relative; z-index: 1; }
      .section-number-badge { background: #cd853f !important; color: #2b1d12; border: 1px solid #8b5a2b; border-radius: 4px; }
      .method-step-card, .result-card { background: rgba(90, 50, 30, 0.9); border: 1px solid rgba(205, 133, 63, 0.4); position: relative; z-index: 1; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); border-left: 3px solid #cd853f; }
      .method-step-card-title { color: #ffdead; background: rgba(205, 133, 63, 0.1) !important; border-bottom: 1px solid rgba(205, 133, 63, 0.3); }
      .result-card-header { background: rgba(210, 105, 30, 0.1) !important; border-bottom: 1px solid rgba(205, 133, 63, 0.3); }
      .result-card-title { color: #cd853f; }
      .report-text, .report-list li, .references-list li { color: #f5deb3; position: relative; z-index: 1; border-bottom-color: rgba(205, 133, 63, 0.3); }
      .report-footer { background: #8b5a2b; border-top: 1px solid rgba(205, 133, 63, 0.5); position: relative; z-index: 1; }
    `;
  } else if (theme === 'caderno') {
    pageBg = '#faf8f5'; pageText = '#1a1a2a';
    extraCss = `
      body, .a4-page { background: #faf8f5 !important; color: #1a1a2a; }
      .a4-page { background-image: repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px) !important; background-position: 0 40px; }
      .report-cover { background: #fff; border-bottom: 4px solid #2563eb; }
      .report-cover-title { font-family: 'Playfair Display', serif; color: #1e3a8a; }
      .method-step-card, .result-card { background: #fff; border: 1px solid #d1d5db; box-shadow: 2px 2px 0px rgba(37,99,235,0.1); }
      .report-footer { background: #fff; border-top: 2px dashed #d1d5db; }
      .report-text, .method-step-card-body, .result-card-body { line-height: 32px; font-family: 'Inter', sans-serif; }
    `;
  } else if (theme === 'cyberpunk') {
    pageBg = '#09090b'; pageText = '#e0e0e0';
    extraCss = `
      body, .a4-page { background: #09090b !important; color: #e0e0e0; font-family: 'Inter', sans-serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.05) 2px, rgba(0, 240, 255, 0.05) 4px); pointer-events:none; z-index:0; }
      .report-cover { background: #111; border-bottom: 2px solid #00f0ff; position: relative; z-index: 1; }
      .report-cover-title { color: #fff; text-transform: uppercase; font-weight: 800; letter-spacing: 2px; text-shadow: 2px 2px 0px #00f0ff, -2px -2px 0px #ff00f0; }
      .report-section-title { color: #09090b; background: #00f0ff; display: inline-flex; padding: 5px 15px; transform: skew(-10deg); border-image: none !important; border-bottom: none; margin-bottom: 20px; position: relative; z-index: 1; }
      .report-section-title > * { transform: skew(10deg); display: inline-block; }
      .section-number-badge { background: #09090b !important; color: #00f0ff; }
      .method-step-card, .result-card { background: rgba(9, 9, 11, 0.7); border: 1px solid #333; border-left: 2px solid #00f0ff; position: relative; z-index: 1; backdrop-filter: blur(10px); }
      .method-step-card-title, .result-card-header { background: rgba(0, 240, 255, 0.1) !important; color: #00f0ff; }
      .report-text, .report-list li, .references-list li { color: #ccc; position: relative; z-index: 1; }
      .report-footer { background: #000; border-top: 1px solid #333; position: relative; z-index: 1; }
    `;
  } else if (theme === 'silksong') {
    pageBg = '#120b12'; pageText = '#d4cbb8';
    extraCss = `
      body, .a4-page { background: #120b12 !important; color: #d4cbb8; font-family: 'Playfair Display', serif; }
      .report-cover { background: #1a101a; border-bottom: 1px solid #dbb258; position: relative; z-index: 1; }
      .report-cover-title { color: #dbb258; text-transform: uppercase; letter-spacing: 0.1em; text-shadow: 0 0 10px rgba(219, 178, 88, 0.3); }
      .report-meta-item { background: transparent; border: 1px solid rgba(219, 178, 88, 0.3); }
      .report-meta-label { color: #dbb258; }
      .report-meta-value { color: #fff; }
      .report-section-title { color: #dbb258; border-image: none !important; border-bottom: 1px solid rgba(219, 178, 88, 0.3); position: relative; z-index: 1; }
      .section-number-badge { background: #dbb258 !important; color: #120b12; }
      .method-step-card, .result-card { background: #1a101a; border: 1px solid rgba(219, 178, 88, 0.2); position: relative; z-index: 1; }
      .method-step-card-title { color: #dbb258; background: rgba(219, 178, 88, 0.05) !important; }
      .result-card-header { background: rgba(219, 178, 88, 0.1) !important; }
      .result-card-title { color: #dbb258; }
      .report-text, .report-list li, .references-list li { color: #b8b0a0; position: relative; z-index: 1; }
      .report-footer { background: #0a060a; border-top: 1px solid rgba(219, 178, 88, 0.2); position: relative; z-index: 1; }
    `;
  } else if (theme === 'hexatombe') {
    pageBg = '#0c0c0c'; pageText = '#d1d1d1';
    extraCss = `
      body, .a4-page { background: #0c0c0c !important; color: #d1d1d1; font-family: 'Inter', sans-serif; }
      .a4-page::after { content:''; position:absolute; top:0; right:0; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255, 42, 42, 0.1) 0%, transparent 70%); opacity: 0.5; pointer-events: none; z-index:0; }
      .report-cover { background: rgba(17, 17, 17, 0.95); border-bottom: 3px solid #ff2a2a; position: relative; z-index: 1; padding: 40px; }
      .report-badge { border: 1px solid rgba(255, 42, 42, 0.4); color: #ff2a2a; background: rgba(255, 42, 42, 0.1); border-radius: 4px; padding: 6px 12px; display: inline-block; margin-bottom: 15px; font-weight: bold; text-transform: uppercase; }
      .report-cover-title { color: #ffffff; font-weight: 800; letter-spacing: 2px; text-shadow: 2px 0px 5px rgba(255, 42, 42, 0.5); font-size: 2.2rem; text-transform: uppercase; }
      .report-cover-theme { color: #ff2a2a; font-family: 'Inter', sans-serif; font-size: 0.8rem; text-transform: uppercase; }
      .report-meta-item { background: rgba(20, 20, 20, 0.8); border: 1px solid rgba(255, 42, 42, 0.3); border-radius: 6px; }
      .report-meta-label { color: #ff2a2a; }
      .report-meta-value { color: #ffffff; }
      .report-section-title { color: #ffffff; border-image: none !important; border-bottom: 1px solid rgba(255, 42, 42, 0.5); position: relative; z-index: 1; text-transform: uppercase; }
      .section-number-badge { background: #ff2a2a !important; color: #0c0c0c; box-shadow: 0 0 10px rgba(255,42,42,0.3); border-radius: 4px; }
      .method-step-card, .result-card { background: rgba(17, 17, 17, 0.9); border: 1px solid rgba(255, 42, 42, 0.2); position: relative; z-index: 1; border-left: 3px solid #ff2a2a; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
      .method-step-card-title { color: #ff2a2a; background: rgba(255, 42, 42, 0.05) !important; border-bottom: 1px solid rgba(255, 42, 42, 0.2); }
      .result-card-header { background: rgba(255, 42, 42, 0.1) !important; border-bottom: 1px solid rgba(255, 42, 42, 0.2); }
      .result-card-title { color: #ff2a2a; }
      .report-text, .report-list li, .references-list li { color: #d1d1d1; position: relative; z-index: 1; border-bottom-color: rgba(255, 42, 42, 0.2); }
      .report-footer { background: #000; border-top: 1px solid rgba(255, 42, 42, 0.4); position: relative; z-index: 1; }
    `;
  } else if (theme === 'resident-evil') {
    pageBg = '#111111'; pageText = '#d4d4d4';
    extraCss = `
      body, .a4-page { background: #111111 !important; color: #d4d4d4; font-family: 'Arial Narrow', Arial, sans-serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px); pointer-events:none; z-index:0; }
      .report-cover { background: rgba(0, 0, 0, 0.95); border-bottom: 1px dashed rgba(255,255,255,0.3); position: relative; z-index: 1; padding: 40px; }
      .report-badge { border: 1px solid rgba(255, 255, 255, 0.3); color: #fff; background: rgba(255, 255, 255, 0.05); border-radius: 2px; padding: 6px 12px; display: inline-block; margin-bottom: 15px; font-family: 'Courier New', Courier, monospace; }
      .report-cover-title { color: #fff; font-family: 'Courier New', Courier, monospace; text-transform: uppercase; font-size: 2.2rem; }
      .report-cover-theme { color: #888; font-family: 'Courier New', Courier, monospace; font-size: 0.8rem; text-transform: uppercase; }
      .report-meta-item { background: transparent; border: 1px dashed rgba(255,255,255,0.3); border-radius: 4px; }
      .report-meta-label { color: #888; font-family: 'Courier New', Courier, monospace; }
      .report-meta-value { color: #fff; }
      .report-section-title { color: #fff; font-family: 'Courier New', Courier, monospace; border-image: none !important; border-bottom: 1px dashed rgba(255,255,255,0.3); position: relative; z-index: 1; }
      .section-number-badge { background: #333 !important; color: #fff; border-radius: 2px; }
      .method-step-card, .result-card { background: rgba(26, 26, 26, 0.9); border: 1px dashed rgba(255,255,255,0.2); position: relative; z-index: 1; border-radius: 4px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
      .method-step-card-title { color: #fff; background: rgba(255,255,255,0.05) !important; font-family: 'Courier New', Courier, monospace; border-bottom: 1px dashed rgba(255, 255, 255, 0.2); }
      .result-card-header { background: rgba(255,255,255,0.1) !important; border-bottom: 1px dashed rgba(255, 255, 255, 0.2); }
      .result-card-title { color: #fff; font-family: 'Courier New', Courier, monospace; }
      .report-text, .report-list li, .references-list li { color: #bbb; position: relative; z-index: 1; border-bottom-color: rgba(255, 255, 255, 0.1); }
      .report-footer { background: #000; border-top: 1px dashed rgba(255,255,255,0.3); position: relative; z-index: 1; }
    `;
  } else if (theme === 'pokemon' || theme === 'pokemon-sword') {
    const isSword = theme === 'pokemon-sword';
    const pokeAccent = isSword ? '#e03a5f' : '#00ffaa';
    const pokeBg = isSword ? '#05141c' : '#0a1118';
    pageBg = pokeBg; pageText = '#d0dbe5';
    extraCss = `
      body, .a4-page { background: ${pokeBg} !important; color: #d0dbe5; font-family: 'Inter', sans-serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: url('https://www.transparenttextures.com/patterns/cubes.png'); opacity: 0.1; pointer-events:none; z-index:0; }
      .report-cover { background: rgba(0, 0, 0, 0.85); border-bottom: 6px solid ${pokeAccent}; position: relative; z-index: 1; padding: 40px; border-radius: 0 0 30px 30px; box-shadow: 0 10px 20px rgba(0,0,0,0.5); }
      .report-cover::after { content:''; position:absolute; bottom:-6px; left:50%; width:100px; height:6px; background: #fff; transform: translateX(-50%); border-radius: 3px; }
      .report-badge { border: 2px solid ${pokeAccent}; color: #fff; background: ${pokeAccent}; border-radius: 20px; font-weight: 800; padding: 6px 15px; display: inline-block; margin-bottom: 15px; text-transform: uppercase; font-style: italic; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
      .report-cover-title { color: #ffffff; font-weight: 900; text-transform: uppercase; font-style: italic; font-size: 2.4rem; text-shadow: 2px 2px 0px ${pokeAccent}; }
      .report-cover-theme { color: ${pokeAccent}; font-weight: bold; font-size: 0.8rem; text-transform: uppercase; }
      .report-meta-item { background: rgba(255,255,255,0.03); border: 2px solid rgba(255,255,255,0.1); border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      .report-meta-label { color: ${pokeAccent}; font-weight: 800; text-transform: uppercase; font-size: 0.8rem; }
      .report-meta-value { color: #ffffff; font-weight: 500; }
      .report-section-title { color: #ffffff; border-image: none !important; border-bottom: 3px solid ${pokeAccent}; position: relative; z-index: 1; font-style: italic; font-weight: 900; text-transform: uppercase; }
      .section-number-badge { background: ${pokeAccent} !important; color: #000; border-radius: 50%; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; box-shadow: 0 2px 5px rgba(0,0,0,0.5); }
      .method-step-card, .result-card { background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); position: relative; z-index: 1; border-radius: 16px; overflow: hidden; border-left: 6px solid ${pokeAccent}; box-shadow: 0 6px 15px rgba(0,0,0,0.2); backdrop-filter: blur(5px); }
      .method-step-card-title { color: #ffffff; background: rgba(255,255,255,0.05) !important; font-weight: 800; text-transform: uppercase; font-size: 0.85rem; border-bottom: 2px solid rgba(255,255,255,0.05); }
      .result-card-header { background: rgba(255,255,255,0.08) !important; border-bottom: 2px solid rgba(255,255,255,0.05); }
      .result-card-title { color: #ffffff; font-weight: 900; text-transform: uppercase; }
      .report-text, .report-list li, .references-list li { color: #b5c4d3; position: relative; z-index: 1; border-bottom-color: rgba(255,255,255,0.05); font-weight: 500; }
      .report-footer { background: #000; border-top: 4px solid ${pokeAccent}; position: relative; z-index: 1; border-radius: 30px 30px 0 0; }
    `;
  } else if (theme === 'pokedex') {
    pageBg = '#e63946'; pageText = '#1d3557';
    extraCss = `
      body, .a4-page { background: #e63946 !important; color: #1d3557; font-family: 'Inter', sans-serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: radial-gradient(circle at 10% 10%, rgba(255,255,255,0.2) 0%, transparent 20%), linear-gradient(180deg, #e63946 0%, #c1121f 100%); pointer-events:none; z-index:0; }
      .report-cover { background: #f1faee; border-bottom: 8px solid #1d3557; position: relative; z-index: 1; padding: 40px; border-radius: 0 0 40px 40px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); text-align: center; }
      .report-cover::after { content:''; position:absolute; bottom:-18px; left:50%; width:30px; height:30px; background: #fff; transform: translateX(-50%); border-radius: 50%; border: 6px solid #1d3557; box-shadow: inset 0 0 0 3px #e63946; }
      .report-badge { border: 2px solid #1d3557; color: #f1faee; background: #457b9d; border-radius: 20px; font-weight: 800; padding: 6px 15px; display: inline-block; margin-bottom: 15px; text-transform: uppercase; box-shadow: 0 4px 0 #1d3557; }
      .report-cover-title { color: #1d3557; font-weight: 900; text-transform: uppercase; font-size: 2.6rem; text-shadow: 2px 2px 0px #a8dadc; }
      .report-cover-theme { color: #e63946; font-weight: bold; font-size: 1rem; text-transform: uppercase; margin-top: 10px; }
      .report-meta-item { background: #f1faee; border: 3px solid #1d3557; border-radius: 12px; box-shadow: 4px 4px 0 rgba(29,53,87,0.2); }
      .report-meta-label { color: #e63946; font-weight: 900; text-transform: uppercase; font-size: 0.8rem; }
      .report-meta-value { color: #1d3557; font-weight: bold; }
      .report-section-title { color: #f1faee; border-image: none !important; border-bottom: 4px solid #1d3557; position: relative; z-index: 1; font-weight: 900; text-transform: uppercase; text-shadow: 1px 1px 0 #1d3557; background: #457b9d; padding: 5px 15px; border-radius: 10px 10px 0 0; display: inline-block; margin-bottom: 20px; box-shadow: 4px 4px 0 rgba(0,0,0,0.2); }
      .section-number-badge { background: #f1faee !important; color: #e63946; border-radius: 50%; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; box-shadow: 0 2px 5px rgba(0,0,0,0.5); border: 2px solid #1d3557; }
      .method-step-card, .result-card { background: #f1faee; border: 3px solid #1d3557; position: relative; z-index: 1; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 0 #1d3557; margin-bottom: 25px; }
      .method-step-card-title { color: #f1faee; background: #e63946 !important; font-weight: 900; text-transform: uppercase; font-size: 0.9rem; border-bottom: 3px solid #1d3557; padding: 10px; }
      .result-card-header { background: #a8dadc !important; border-bottom: 3px solid #1d3557; }
      .result-card-title { color: #1d3557; font-weight: 900; text-transform: uppercase; }
      .report-text, .report-list li, .references-list li { color: #f1faee; position: relative; z-index: 1; border-bottom-color: rgba(255,255,255,0.2); font-weight: 600; text-shadow: 1px 1px 0 rgba(0,0,0,0.2); }
      .report-footer { background: #f1faee; border-top: 8px solid #1d3557; position: relative; z-index: 1; border-radius: 40px 40px 0 0; }
    `;
  } else if (theme === 'moderno') {
    pageBg = '#ffffff'; pageText = '#333';
    extraCss = `
      body, .a4-page { background: #ffffff !important; color: #333; font-family: 'Inter', sans-serif; }
      .report-cover { background: #f8fafc; border-bottom: none; position: relative; z-index: 1; }
      .report-cover-title { color: #1e293b; font-weight: 800; }
      .report-meta-item { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
      .report-meta-label { color: #3b82f6; }
      .report-meta-value { color: #1e293b; }
      .report-section-title { color: #1e293b; border-image: none !important; border-bottom: 3px solid #3b82f6; display: inline-block; padding-bottom: 5px; position: relative; z-index: 1; }
      .section-number-badge { background: #3b82f6 !important; color: #fff; border-radius: 4px; }
      .method-step-card, .result-card { background: #fff; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.05); position: relative; z-index: 1; border-radius: 12px; }
      .method-step-card-title { color: #1e293b; background: #f8fafc !important; border-bottom: 1px solid #e2e8f0; }
      .result-card-header { background: #f8fafc !important; border-bottom: 1px solid #e2e8f0; }
      .result-card-title { color: #1e293b; }
      .result-card-dot { background: #3b82f6; }
      .report-text, .report-list li, .references-list li { color: #475569; position: relative; z-index: 1; border-bottom-color: #f1f5f9; }
      .report-footer { background: #f8fafc; border-top: none; position: relative; z-index: 1; }
    `;
  } else if (theme === 'belle-epoque') {
    pageBg = '#fdfaf3'; pageText = '#3a2d24';
    extraCss = `
      body, .a4-page { background: #fdfaf3 !important; color: #3a2d24; font-family: 'Playfair Display', serif; }
      .report-cover { background: #f3efe6; border-bottom: 2px solid #8b6b4a; position: relative; z-index: 1; }
      .report-cover-title { color: #4a3625; font-weight: 700; text-align: center; }
      .report-cover-theme { text-align: center; color: #8b6b4a; }
      .report-meta-item { background: transparent; border: 1px solid #d4cbb8; border-radius: 0; text-align: center; }
      .report-meta-label { color: #8b6b4a; font-family: 'Playfair Display', serif; }
      .report-meta-value { color: #4a3625; }
      .report-section-title { color: #4a3625; border-image: none !important; border-bottom: 1px solid #8b6b4a; position: relative; z-index: 1; text-align: center; justify-content: center; }
      .section-number-badge { display: none; }
      .method-step-card, .result-card { background: #fdfaf3; border: 1px solid #d4cbb8; position: relative; z-index: 1; border-radius: 0; border-left: none; }
      .method-step-card-title { color: #4a3625; background: #f3efe6 !important; text-align: center; }
      .result-card-header { background: #f3efe6 !important; justify-content: center; }
      .result-card-title { color: #4a3625; }
      .result-card-dot { display: none; }
      .report-text, .report-list li, .references-list li { color: #5c432d; position: relative; z-index: 1; border-bottom-color: #eee9dd; }
      .report-footer { background: #f3efe6; border-top: 1px solid #d4cbb8; position: relative; z-index: 1; justify-content: center; }
      .footer-brand { text-align: center; width: 100%; }
      .footer-line { display: none; }
    `;
  } else if (theme === 'clair-obscur') {
    pageBg = '#0d0c12'; pageText = '#d4cbb8';
    extraCss = `
      body, .a4-page { background: #0d0c12 !important; color: #d4cbb8; font-family: 'Playfair Display', serif; }
      .report-cover { background: #050508; border-bottom: 1px solid #b78f61; position: relative; z-index: 1; }
      .report-cover-title { color: #e6d8c3; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
      .report-meta-item { background: rgba(183, 143, 97, 0.05); border: 1px solid rgba(183, 143, 97, 0.3); border-radius: 0; }
      .report-meta-label { color: #b78f61; }
      .report-meta-value { color: #e6d8c3; }
      .report-section-title { color: #e6d8c3; border-image: none !important; border-bottom: 1px solid rgba(183, 143, 97, 0.5); position: relative; z-index: 1; }
      .section-number-badge { background: #b78f61 !important; color: #0d0c12; border-radius: 0; }
      .method-step-card, .result-card { background: #13111a; border: 1px solid rgba(183, 143, 97, 0.2); position: relative; z-index: 1; border-radius: 0; border-left: 2px solid #b78f61; }
      .method-step-card-title { color: #e6d8c3; background: rgba(183, 143, 97, 0.1) !important; }
      .result-card-header { background: rgba(183, 143, 97, 0.15) !important; }
      .result-card-title { color: #e6d8c3; }
      .report-text, .report-list li, .references-list li { color: #a39b8a; position: relative; z-index: 1; border-bottom-color: #1a1824; }
      .report-footer { background: #050508; border-top: 1px solid rgba(183, 143, 97, 0.3); position: relative; z-index: 1; }
    `;
  } else if (theme === 'minimalista') {
    pageBg = '#fafafa'; pageText = '#1a1a1a';
    extraCss = `
      body, .a4-page { background: #fafafa !important; color: #1a1a1a; font-family: 'Inter', sans-serif; }
      .report-cover { background: #fff; border-bottom: 1px solid #eee; position: relative; z-index: 1; padding-bottom: 40px; }
      .report-cover::before { display: none; }
      .report-cover-title { color: #000; font-weight: 400; font-size: 2.2rem; }
      .report-meta-item { background: transparent; border: none; border-bottom: 1px solid #eee; border-radius: 0; padding-left: 0; }
      .report-meta-label { color: #888; }
      .report-meta-value { color: #000; }
      .report-section-title { color: #000; border-image: none !important; border-bottom: none; position: relative; z-index: 1; padding-bottom: 0; margin-bottom: 24px; font-weight: 500; }
      .section-number-badge { background: #000 !important; color: #fff; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; padding: 0; }
      .method-step-card, .result-card { background: #fff; border: 1px solid #eaeaea; position: relative; z-index: 1; border-radius: 4px; box-shadow: none; border-left: none; }
      .method-step-card-title { color: #000; background: transparent !important; border-bottom: 1px solid #eaeaea; }
      .result-card-header { background: transparent !important; border-bottom: 1px solid #eaeaea; }
      .result-card-title { color: #000; }
      .result-card-dot { display: none; }
      .report-text, .report-list li, .references-list li { color: #444; position: relative; z-index: 1; border-bottom-color: #f5f5f5; }
      .report-footer { background: #fff; border-top: 1px solid #eee; position: relative; z-index: 1; }
    `;
  }

  const baseCss = `
    .a4-page { --accent:${accent}; --accent2:${accent2}; }
    .report-cover { background: linear-gradient(160deg, ${accent} 0%, ${accent2} 100%); }
    .section-number-badge { background: linear-gradient(135deg, ${accent}, ${accent2}); color: #fff; font-size: 0.68rem; font-weight: 700; font-family: 'JetBrains Mono', monospace; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.05em; margin-right: 10px; }
    .report-section-title { border-bottom: 2px solid; border-image: linear-gradient(90deg, ${accent}, transparent) 1; padding-bottom: 10px; font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 700; color: #1a1a2a; display: flex; align-items: center; }
    .result-card-header { background: linear-gradient(90deg, ${accent}, ${accent2}); display: flex; align-items: center; gap: 10px; padding: 10px 16px; }
    .method-step-card { border: 1px solid #e5e7eb; border-left: 4px solid ${accent}; border-radius: 8px; overflow: hidden; }
    .method-step-card-title { background: linear-gradient(90deg, rgba(${hexToRgb(accent)},0.07), transparent); padding: 10px 16px; font-weight: 700; font-size: 0.85rem; color: #1a1a2a; }
    .list-bullet { background: ${accent}; width: 6px; height: 6px; border-radius: 50%; margin-top: 8px; flex-shrink: 0; }
    .ref-num { color: ${accent}; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 700; min-width: 24px; padding-top: 2px; }
    .footer-line { background: linear-gradient(90deg, ${accent}, ${accent2}); height: 3px; width: 60px; border-radius: 2px; }
    .footer-brand span { color: ${accent}; }
    .report-badge { background: rgba(255,255,255,0.15); display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(255,255,255,0.25); color: rgba(255,255,255,0.9); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-bottom: 20px; font-family: 'JetBrains Mono', monospace; }
    ${extraCss}
  `;

  // Update global styles for the preview
  let styleEl = document.getElementById('dynamic-theme');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'dynamic-theme';
    document.head.appendChild(styleEl);
  }
  styleEl.innerHTML = baseCss;

  // --- Pagination Logic ---
  const measureBox = document.getElementById('measure-box');
  measureBox.style.padding = '0'; // removemos o padding para que a .a4-page ocupe 100%
  
  // Criamos um container temporÃ¡rio para nÃ£o sujar o measureBox enquanto lemos os elementos
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = blocks.join('');
  const children = Array.from(tempDiv.children);

  measureBox.innerHTML = '';

  const createPage = () => {
    const p = document.createElement('div');
    p.className = 'a4-page';
    p.style.setProperty('--page-bg', pageBg);
    p.style.setProperty('--page-text', pageText);
    
    const content = document.createElement('div');
    content.className = 'page-content';
    p.appendChild(content);

    // Footer
    const footerHtml = showBrand ? `
      <div class="report-footer" style="background: transparent; padding: 16px 48px; display: flex; align-items: center; justify-content: space-between; position: absolute; bottom: 0; left: 0; right: 0; border-top: 1px solid rgba(150,150,150,0.2);">
        <div class="footer-brand" style="font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #9ca3af; letter-spacing: 0.1em;">Formatado por <span>UIUSAS</span> Report Maker Â· ${dateStr}</div>
        <div class="footer-line"></div>
      </div>` : `
      <div class="report-footer" style="background: transparent; padding: 16px 48px; display: flex; align-items: center; justify-content: flex-end; position: absolute; bottom: 0; left: 0; right: 0; border-top: 1px solid rgba(150,150,150,0.2);">
        <div class="footer-brand" style="font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #9ca3af; letter-spacing: 0.1em;">${dateStr}</div>
      </div>`;
    
    p.insertAdjacentHTML('beforeend', footerHtml);
    return p;
  };

  let currentPage = createPage();
  measureBox.appendChild(currentPage);
  let contentArea = currentPage.querySelector('.page-content');

  // Move elements one by one, checking for overflow
  for (let el of children) {
    contentArea.appendChild(el);
    
    let maxH = contentArea.clientHeight;
    if (maxH < 500) maxH = 1122; // Fallback se o navegador falhar no layout escondido
    
    // Se o conteÃºdo ultrapassar a altura mÃ¡xima
    if (contentArea.scrollHeight > maxH) {
      contentArea.removeChild(el); // Too big for this page
      
      // Verifica se o elemento anterior que ficou no final da pÃ¡gina Ã© um subtÃ­tulo "Ã³rfÃ£o"
      let orphanTitle = null;
      if (contentArea.lastElementChild && contentArea.lastElementChild.classList.contains('report-section-title')) {
        orphanTitle = contentArea.lastElementChild;
        contentArea.removeChild(orphanTitle);
      }

      currentPage = createPage();
      measureBox.appendChild(currentPage);
      contentArea = currentPage.querySelector('.page-content');
      
      // Se tinha um tÃ­tulo Ã³rfÃ£o, joga ele no topo da pÃ¡gina nova primeiro
      if (orphanTitle) {
        contentArea.appendChild(orphanTitle);
      }
      
      contentArea.appendChild(el); // Add to new page
    }
  }

  // Depois de montar tudo no measureBox (que Ã© sempre renderizado), passamos pro output final
  const output = document.getElementById('report-output');
  output.innerHTML = '';
  while (measureBox.firstChild) {
    output.appendChild(measureBox.firstChild);
  }
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}


// â”€â”€ EXPORT PDF â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
document.getElementById('btn-export').addEventListener('click', () => {
  const title = document.getElementById('f-title').value.trim() || 'RelatÃ³rio de LaboratÃ³rio';
  
  // Pegamos o HTML jÃ¡ paginado na tela!
  const reportHtml = document.getElementById('report-output').innerHTML;
  const styleHtml = document.getElementById('dynamic-theme') ? document.getElementById('dynamic-theme').innerHTML : '';

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:transparent;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.report-list{list-style:none;padding:0;margin:0;}
.report-list li{display:flex;align-items:flex-start;gap:10px;padding:8px 0;font-size:0.9rem;color:#374151;border-bottom:1px solid rgba(150,150,150,0.1);}
.report-list li:last-child{border-bottom:none;}
.references-list{list-style:none;padding:0;}
.references-list li{display:flex;gap:12px;padding:8px 0;border-bottom:1px solid rgba(150,150,150,0.1);font-size:0.84rem;color:#374151;line-height:1.6;}
.references-list li:last-child{border-bottom:none;}
.report-meta-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;position:relative;}
.report-meta-item{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:10px 14px;}
.report-meta-label{font-size:0.62rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.6);margin-bottom:3px;font-family:'JetBrains Mono',monospace;}
.report-meta-value{font-size:0.82rem;font-weight:500;color:#ffffff;}
.report-text{font-size:0.9rem;line-height:1.8;color:#374151;text-align:justify;white-space:pre-wrap;}
.report-cover::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;}

${styleHtml}

@page{size:A4;margin:0;}
@media print{
  html,body{width:210mm; background:transparent !important;}
  .a4-page { box-shadow: none !important; margin: 0 !important; page-break-after: always; break-after: page; width: 210mm; height: 297mm; overflow: hidden; position: relative; }
  .page-content { padding: 40px 48px; }
  .report-cover { margin: -40px -48px 36px -48px; padding: 52px 48px 40px; position: relative; }
}
</style>
</head>
<body>
${reportHtml}
<script>
window.onload = function() {
  setTimeout(function() { window.print(); }, 800);
};
<\/script>
</body>
</html>`);
  win.document.close();
  showToast('âœ… Janela de impressÃ£o aberta â€” escolha "Salvar como PDF"!', 'success');
});

// â”€â”€ SAVE JSON â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
document.getElementById('btn-save').addEventListener('click', () => {
  const data = collectData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `relatorio_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('ðŸ’¾ RelatÃ³rio salvo como JSON!', 'success');
});

// â”€â”€ LOAD JSON â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
document.getElementById('btn-load').addEventListener('click', () => {
  document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      loadData(data);
      showToast('ðŸ“‚ RelatÃ³rio carregado com sucesso!', 'success');
    } catch {
      showToast('âŒ Arquivo invÃ¡lido.', 'error');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

function loadData(d) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('f-title', d.title);
  set('f-theme', d.theme);
  set('f-date', d.date);
  set('f-discipline', d.discipline);
  set('f-student', d.student);
  set('f-professor', d.professor);
  set('f-institution', d.institution);
  set('f-class', d.classGroup);
  set('f-intro', d.intro);
  set('f-objectives', d.objectives);
  set('f-materials', d.materials);
  set('f-discussion', d.discussion);
  set('f-conclusion', d.conclusion);
  set('f-references', d.references);

  const showBrandEl = document.getElementById('f-show-brand');
  if (showBrandEl) showBrandEl.checked = d.showBrand !== false;

  document.getElementById('method-steps-container').innerHTML = '';
  methodStepCount = 0;
  (d.methodSteps || []).forEach(s => addMethodStep(s.title, s.body));

  document.getElementById('results-container').innerHTML = '';
  resultCount = 0;
  (d.results || []).forEach(r => addResult(r.title, r.body, r.image));

  if (d.colorTheme) applyTheme(d.colorTheme);
  else updatePreview();
}

// â”€â”€ PREVIEW TOGGLE (mobile) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
document.getElementById('btn-preview').addEventListener('click', () => {
  document.getElementById('editor-panel').style.display =
    document.getElementById('editor-panel').style.display === 'none' ? '' : 'none';
});

// â”€â”€ TOAST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `show ${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = ''; }, 3500);
}

// â”€â”€ INIT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
(function init() {
  updatePreview();
})();
