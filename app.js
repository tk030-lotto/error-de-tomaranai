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

  // 3. Preset Chips (Error & Situation)
  document.querySelectorAll('.chip[data-error]').forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-error');
      if (errorInput.value.trim() === '') {
        errorInput.value = val;
      } else {
        errorInput.value += `\n${val}`;
      }
      errorCharCount.textContent = `${errorInput.value.length} 文字`;
      errorInput.focus();
    });
  });

  document.querySelectorAll('.chip[data-situation]').forEach(chip => {
    chip.addEventListener('click', () => {
      situationInput.value = chip.getAttribute('data-situation');
      situationInput.focus();
    });
  });

  // 4. Accordion Toggle
  if (contextToggleBtn && contextAccordion) {
    contextToggleBtn.addEventListener('click', () => {
      const isOpen = contextAccordion.classList.toggle('open');
      const icon = contextToggleBtn.querySelector('.toggle-icon');
      if (icon) icon.textContent = isOpen ? '▲' : '▼';
    });
  }

  if (modifyToggleBtn && modifyAccordion) {
    modifyToggleBtn.addEventListener('click', () => {
      const isOpen = modifyAccordion.classList.toggle('open');
      const icon = modifyToggleBtn.querySelector('.toggle-icon');
      if (icon) icon.textContent = isOpen ? '▲' : '▼';
    });
  }

  // 5. Style Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStyle = btn.getAttribute('data-style') || 'standard';
      if (resultCard && !resultCard.classList.contains('hidden')) {
        generatePrompt();
      }
    });
  });

  // 6. Generate Prompt Logic
  function generatePrompt(customInstruction = '') {
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

    if (customInstruction) {
      prompt += `■ 追加の要望\n${customInstruction}\n\n`;
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
      generatePrompt(customMod);
      showToast('要望を反映して質問文を再生成しました');
    });
  }

  // Copy Prompt
  copyBtn.addEventListener('click', async () => {
    if (!lastGeneratedPrompt) return;
    try {
      await navigator.clipboard.writeText(lastGeneratedPrompt);
      showToast('📋 コピーしました。AIに送ってみましょう！');
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = lastGeneratedPrompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('📋 コピーしました。AIに送ってみましょう！');
    }
  });

  // Reset / Clear
  function resetAll() {
    errorInput.value = '';
    situationInput.value = '';
    prevChangeInput.value = '';
    envInput.value = '';
    expectInput.value = '';
    if (modifyInput) modifyInput.value = '';
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
