/* ----------------------------------------------------
   app.js
   エラーで止まらない。ツール - メインロジック
   質問文生成エンジン, 状態管理, クリップボード制御
---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const heroSection = document.getElementById('heroSection');
  const appSection = document.getElementById('appSection');
  const startBtn = document.getElementById('startBtn');
  
  const errorInput = document.getElementById('errorInput');
  const errorCharCount = document.getElementById('errorCharCount');
  const situationInput = document.getElementById('situationInput');
  const contextToggleBtn = document.getElementById('contextToggleBtn');
  const contextAccordion = document.getElementById('contextAccordion');
  const prevChangeInput = document.getElementById('prevChangeInput');
  const envInput = document.getElementById('envInput');
  const expectInput = document.getElementById('expectInput');
  
  const generateBtn = document.getElementById('generateBtn');
  const resultCard = document.getElementById('resultCard');
  const outputText = document.getElementById('outputText');
  const copyBtn = document.getElementById('copyBtn');
  const resetBtn = document.getElementById('resetBtn');
  const retryBtn = document.getElementById('retryBtn');
  const toast = document.getElementById('toast');
  
  const modifyToggleBtn = document.getElementById('modifyToggleBtn');
  const modifyAccordion = document.getElementById('modifyAccordion');
  const modifyInput = document.getElementById('modifyInput');
  const applyModifyBtn = document.getElementById('applyModifyBtn');

  // State
  let currentStyle = 'standard';
  let currentCustomMod = '';
  let lastGeneratedPrompt = '';

  // 1. Hero -> App View
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      heroSection.classList.add('hidden');
      appSection.classList.remove('hidden');
      errorInput.focus();
      window.scrollTo({ top: appSection.offsetTop - 20, behavior: 'smooth' });
    });
  }

  // 2. Error Input Counter
  errorInput.addEventListener('input', () => {
    errorCharCount.textContent = `${errorInput.value.length} 文字`;
  });

  // 3. Preset Chips (Error, Situation, Modify)
  document.querySelectorAll('.chip[data-error]').forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-error');
      if (errorInput.value.trim() === '') {
        errorInput.value = val;
      } else if (!errorInput.value.includes(val)) {
        // QA-013: 重複追記を防止
        errorInput.value += `\n${val}`;
      }
      errorCharCount.textContent = `${errorInput.value.length} 文字`;
      errorInput.focus();
    });
  });

  const situationChips = document.querySelectorAll('.chip[data-situation]');
  situationChips.forEach(chip => {
    chip.addEventListener('click', () => {
      situationChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      situationInput.value = chip.getAttribute('data-situation');
      situationInput.focus();
    });
  });

  document.querySelectorAll('.chip[data-modify]').forEach(chip => {
    chip.addEventListener('click', () => {
      const modText = chip.getAttribute('data-modify');
      if (modifyInput) {
        modifyInput.value = modText;
        currentCustomMod = modText;
        generatePrompt();
        showToast('修正要望を反映しました');
      }
    });
  });

  // 4. Accordion Toggle (QA-009: aria-expanded 同期)
  if (contextToggleBtn && contextAccordion) {
    contextToggleBtn.addEventListener('click', () => {
      const isOpen = contextAccordion.classList.toggle('open');
      contextToggleBtn.setAttribute('aria-expanded', String(isOpen));
      const icon = contextToggleBtn.querySelector('.toggle-icon');
      if (icon) icon.textContent = isOpen ? '▲' : '▼';
    });
  }

  if (modifyToggleBtn && modifyAccordion) {
    modifyToggleBtn.addEventListener('click', () => {
      const isOpen = modifyAccordion.classList.toggle('open');
      modifyToggleBtn.setAttribute('aria-expanded', String(isOpen));
      const icon = modifyToggleBtn.querySelector('.toggle-icon');
      if (icon) icon.textContent = isOpen ? '▲' : '▼';
    });
  }

  // 5. Style Tabs (QA-009: aria-selected 同期)
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentStyle = btn.getAttribute('data-style') || 'standard';
      if (resultCard && !resultCard.classList.contains('hidden')) {
        generatePrompt();
      }
    });
  });

  // 6. Generate Prompt Logic
  function generatePrompt() {
    const errorText = errorInput.value.trim() || '（エラーメッセージ未入力）';
    const situation = situationInput.value.trim() || '操作実行時';
    const prevChange = prevChangeInput.value.trim();
    const env = envInput.value.trim();
    const expect = expectInput.value.trim();

    let styleHeader = '';
    let requests = [];

    switch (currentStyle) {
      case 'beginner':
        styleHeader = '【回答方針: 初心者向けに専門用語を使わず平易に解説してください】';
        requests = [
          '1. このエラーが「何が原因で起きているのか」を例え話などを交えて分かりやすく教えてください。',
          '2. 初心者が確認すべき場所（どのファイルのどのあたりを見るべきか）を教えてください。',
          '3. 具体的にどう直せばいいか、初心者でも迷わない修正手順を教えてください。',
          '4. 修正後に正しく動いているか確認する方法を教えてください。'
        ];
        break;
      case 'cause-first':
        styleHeader = '【回答方針: 原因の切り分けと特定を最優先で解説してください】';
        requests = [
          '1. 考えられる根本原因を可能性の高い順に箇条書きで挙げてください。',
          '2. 原因を1つに絞り込むための具体的な確認手順（ログの出し方・コードの確認箇所）を提示してください。',
          '3. 最も疑わしい原因に対する具体的な修正方法を提示してください。'
        ];
        break;
      case 'code-fix':
        styleHeader = '【回答方針: 具体的な修正コードと差分を最優先で提示してください】';
        requests = [
          '1. このエラーを解消するための完全な修正コード（または前後の差分）を提示してください。',
          '2. なぜその修正が必要なのか、理由を簡潔に1〜2行で説明してください。',
          '3. 修正によって別の不具合が発生しないか注意点があれば教えてください。'
        ];
        break;
      case 'standard':
      default:
        styleHeader = '【AI開発エラートラブルシューティング】';
        requests = [
          '1. エラーの意味と、考えられる主な原因を分かりやすく説明してください。',
          '2. 原因を特定・確認するためのチェックポイント（確認箇所）を教えてください。',
          '3. 具体的な修正方法（修正コードやコマンド）を教えてください。',
          '4. 修正後に意図通り動いているか確認する手順を教えてください。',
          '5. 修正時に注意すべき点や、二次的な問題の可能性があれば教えてください。'
        ];
        break;
    }

    let prompt = `${styleHeader}\nAI開発中に以下のエラーが発生しました。修正方法を教えてください。\n\n`;
    prompt += `■ 発生しているエラー\n\`\`\`\n${errorText}\n\`\`\`\n\n`;
    prompt += `■ エラーが発生した状況\n${situation}\n\n`;

    const supplements = [];
    if (prevChange) supplements.push(`- 直前に変更したこと: ${prevChange}`);
    if (env) supplements.push(`- 使用環境 / 言語: ${env}`);
    if (expect) supplements.push(`- 本来期待していた動作: ${expect}`);

    if (supplements.length > 0) {
      prompt += `■ 補足情報\n${supplements.join('\n')}\n\n`;
    }

    if (currentCustomMod) {
      prompt += `■ 追加の要望\n${currentCustomMod}\n\n`;
    }

    prompt += `■ AIへのお願い\n${requests.join('\n')}\n`;

    lastGeneratedPrompt = prompt;
    outputText.textContent = prompt;
    resultCard.classList.remove('hidden');
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // 7. Event Listeners
  generateBtn.addEventListener('click', () => {
    if (errorInput.value.trim() === '') {
      showToast('⚠️ エラー内容を入力またはチップを選択してください');
      errorInput.focus();
      return;
    }
    generatePrompt();
  });

  // Apply Custom Modification
  if (applyModifyBtn && modifyInput) {
    applyModifyBtn.addEventListener('click', () => {
      const customMod = modifyInput.value.trim();
      if (!customMod) {
        showToast('修正要望を入力してください');
        return;
      }
      currentCustomMod = customMod;
      generatePrompt();
      showToast('要望を反映して質問文を再生成しました');
    });
  }

  // Copy Prompt (QA-011: 戻り値検証 & エラーハンドリング)
  copyBtn.addEventListener('click', async () => {
    if (!lastGeneratedPrompt) return;
    try {
      await navigator.clipboard.writeText(lastGeneratedPrompt);
      showToast('📋 コピーしました。AIに送ってみましょう！');
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed, attempting fallback execCommand:', err);
      try {
        const textarea = document.createElement('textarea');
        textarea.value = lastGeneratedPrompt;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (success) {
          showToast('📋 コピーしました。AIに送ってみましょう！');
        } else {
          showToast('⚠️ コピーに失敗しました。手動でコピーしてください');
        }
      } catch (fallbackErr) {
        console.error('Fallback clipboard copy failed:', fallbackErr);
        showToast('⚠️ コピーに失敗しました。手動でコピーしてください');
      }
    }
  });

  // Reset / Clear (QA-012: スタイル選択・タブ状態の完全初期化)
  function resetAll() {
    errorInput.value = '';
    situationInput.value = '';
    prevChangeInput.value = '';
    envInput.value = '';
    expectInput.value = '';
    if (modifyInput) modifyInput.value = '';
    currentCustomMod = '';
    
    // スタイルとタブの初期化
    currentStyle = 'standard';
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const isStandard = btn.getAttribute('data-style') === 'standard';
      btn.classList.toggle('active', isStandard);
      btn.setAttribute('aria-selected', String(isStandard));
    });

    // アコーディオンの折りたたみ
    if (contextAccordion && contextAccordion.classList.contains('open')) {
      contextAccordion.classList.remove('open');
      if (contextToggleBtn) {
        contextToggleBtn.setAttribute('aria-expanded', 'false');
        const icon = contextToggleBtn.querySelector('.toggle-icon');
        if (icon) icon.textContent = '▼';
      }
    }
    if (modifyAccordion && modifyAccordion.classList.contains('open')) {
      modifyAccordion.classList.remove('open');
      if (modifyToggleBtn) {
        modifyToggleBtn.setAttribute('aria-expanded', 'false');
        const icon = modifyToggleBtn.querySelector('.toggle-icon');
        if (icon) icon.textContent = '▼';
      }
    }

    situationChips.forEach(c => c.classList.remove('active'));
    errorCharCount.textContent = '0 文字';
    resultCard.classList.add('hidden');
    outputText.textContent = '';
    lastGeneratedPrompt = '';
    window.scrollTo({ top: appSection.offsetTop - 20, behavior: 'smooth' });
    errorInput.focus();
  }

  resetBtn.addEventListener('click', resetAll);

  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      resetAll();
      showToast('新しいエラーを入力してください');
    });
  }

  // Toast helper
  let toastTimer = null;
  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
});

