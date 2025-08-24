// ============ Utils ============
function onlyDigits(str) { return (str || '').replace(/\D/g, ''); }
function maskCPF(d) {
  const v = (d || '').slice(0, 11);
  if (v.length <= 3) return v;
  if (v.length <= 6) return `${v.slice(0,3)}.${v.slice(3)}`;
  if (v.length <= 9) return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
  return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
}
function maskPhone(d) {
  const v = (d || '').slice(0, 11);
  if (v.length <= 2) return `(${v}`;
  if (v.length <= 6) return `(${v.slice(0,2)}) ${v.slice(2)}`;
  if (v.length <= 10) return `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
  return `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
}
function isEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test((v||'').trim()); }
function isCPFLike(v){ v=(v||''); return !v.includes('@') && /^[0-9.\-\s]*$/.test(v); }
function validateCPF(doc){
  const v = onlyDigits(doc);
  if (v.length !== 11 || /^(\d)\1{10}$/.test(v)) return false;
  let s = 0; for (let i=0;i<9;i++) s += parseInt(v[i])*(10-i);
  let r = (s*10)%11; if (r===10||r===11) r=0; if (r!==parseInt(v[9])) return false;
  s = 0; for (let i=0;i<10;i++) s += parseInt(v[i])*(11-i);
  r = (s*10)%11; if (r===10||r===11) r=0; return r===parseInt(v[10]);
}
function setValidity(el, ok, msg=''){ if(!el) return; el.setCustomValidity(ok?'':msg); }

// ============ LOGIN ============
(function initLogin(){
  const form = document.getElementById('loginForm');
  if (!form) return; // não está na página de login

  const idInput = document.getElementById('identificador');
  const idIcon  = document.getElementById('identificadorIcon');
  const pwd     = document.getElementById('senhaLogin');         // <- IDs do HTML final
  const eye     = document.getElementById('toggleSenhaLogin');
  const btn     = document.getElementById('btnEntrar');

  // ícone dinâmico + máscara/validação do identificador
  idIcon?.classList.add('fa-id-card');
  idInput.addEventListener('input', () => {
    const value = idInput.value;
    const seemsEmail = /[a-zA-Z@]/.test(value);
    if (!seemsEmail && isCPFLike(value)){
      const digits = onlyDigits(value);
      idInput.value = maskCPF(digits);
      idInput.setAttribute('inputmode','numeric');
      idIcon?.classList.remove('fa-at'); idIcon?.classList.add('fa-id-card');
      if (!digits) setValidity(idInput,false,'Informe seu CPF ou e-mail.');
      else if (digits.length!==11) setValidity(idInput,false,'CPF deve conter exatamente 11 dígitos.');
      else setValidity(idInput,true);
    } else {
      idInput.setAttribute('inputmode','email');
      idIcon?.classList.remove('fa-id-card'); idIcon?.classList.add('fa-at');
      if (!value.trim()) setValidity(idInput,false,'Informe seu e-mail ou CPF.');
      else if (!isEmail(value)) setValidity(idInput,false,'Informe um e-mail válido (ex.: nome@dominio.com).');
      else setValidity(idInput,true);
    }
  });
  idInput.addEventListener('blur', ()=>{ if(!idInput.checkValidity()) idInput.reportValidity(); });

  // mostrar/ocultar senha
  function togglePwd(){ pwd.type = (pwd.type==='password'?'text':'password'); eye.classList.toggle('fa-eye-slash'); }
  eye?.addEventListener('click', togglePwd);
  eye?.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); togglePwd(); } });

  // submit: valida e deixa enviar pro Flask
  form.addEventListener('submit', (e) => {
    const v = (idInput.value||'').trim();
    const cpfMode = !/[a-zA-Z@]/.test(v) && isCPFLike(v);
    if (cpfMode){
      const d = onlyDigits(v);
      if (d.length!==11){ idInput.setCustomValidity('CPF deve conter exatamente 11 dígitos.'); idInput.reportValidity(); e.preventDefault(); return; }
      setValidity(idInput,true);
    } else {
      if (!isEmail(v)){ idInput.setCustomValidity('Informe um e-mail válido (ex.: nome@dominio.com).'); idInput.reportValidity(); e.preventDefault(); return; }
      setValidity(idInput,true);
    }
    if (!pwd.value){ pwd.reportValidity(); e.preventDefault(); return; }
    btn?.classList.add('loading'); // spinner visual; o form segue normalmente
  });
})();

// ============ CADASTRO + RESET DE SENHA ============
(function initCadastroOuReset(){
  const cadastroForm = document.getElementById('cadastroForm');
  const resetForm    = document.getElementById('resetForm');
  const form = cadastroForm || resetForm;
  if (!form) return; // não está em nenhuma dessas páginas

  const isReset = form.id === 'resetForm';

  // Campos que existem nos dois
  const senha      = form.querySelector('#senhaCadastro');
  const confirmar  = form.querySelector('#confirmarSenha');
  const eyeSenha   = form.querySelector('#toggleSenhaCadastro');
  const eyeConf    = form.querySelector('#toggleConfirmarSenha');
  const btn        = form.querySelector('#btnCadastrar'); // mesmo id nas duas telas
  const pwReqs     = form.querySelector('#pwReqs');

  // nó de erro inline para "confirmar senha"
function getOrMakeErrorNode(input){
  if (!input) return null;
  let help = input.closest('.form-group')?.querySelector('.field-error');
  if (!help){
    help = document.createElement('small');
    help.className = 'field-help field-error';
    help.setAttribute('aria-live','polite');
    input.closest('.form-group')?.appendChild(help);
  }
  return help;
}
const confirmarHelp = getOrMakeErrorNode(confirmar);

function setConfirmMismatch(on){
  if (!confirmar) return;
  if (on){
    setValidity(confirmar, false, 'As senhas não coincidem.');
    confirmar.setAttribute('aria-invalid','true');
    confirmar.classList.add('invalid');
    if (confirmarHelp) { confirmarHelp.textContent = 'As senhas não coincidem.'; confirmarHelp.classList.add('show'); }
  } else {
    setValidity(confirmar, true, '');
    confirmar.removeAttribute('aria-invalid');
    confirmar.classList.remove('invalid');
    if (confirmarHelp) { confirmarHelp.textContent = ''; confirmarHelp.classList.remove('show'); }
  }
}

// requisitos + confirmação em tempo real
senha?.addEventListener('input', () => {
  const c = updatePwChecklist(senha.value);
  const allOk = c.len && c.lower && c.upper && c.digit;
  const mismatch = !!(confirmar?.value) && confirmar.value !== senha.value;
  setConfirmMismatch(mismatch);
  btn?.toggleAttribute('disabled', !allOk || mismatch);
});

confirmar?.addEventListener('input', () => {
  const mismatch = !!(senha?.value) && confirmar.value !== (senha?.value || '');
  setConfirmMismatch(mismatch);
  const c = updatePwChecklist(senha?.value || '');
  const allOk = c.len && c.lower && c.upper && c.digit;
  btn?.toggleAttribute('disabled', !allOk || mismatch);
});

// na saída do campo, mostra balão nativo também (opcional)
confirmar?.addEventListener('blur', () => {
  if (confirmar.value && senha?.value && confirmar.value !== senha.value){
    confirmar.reportValidity();
  }
});

  // Campos que só existem no cadastro (faça lookup seguro)
  const nome     = form.querySelector('#nome');
  const email    = form.querySelector('#email');
  const cpf      = form.querySelector('#cpf');
  const telefone = form.querySelector('#telefone');
  const termos   = form.querySelector('#termos');

  // --- helpers já existentes no seu arquivo ---
  // onlyDigits, maskCPF, maskPhone, validateCPF, setValidity...

  // Mapeamento visual dos requisitos de senha
  const reqMap = pwReqs ? {
    len:   pwReqs.querySelector('[data-check="len"]'),
    lower: pwReqs.querySelector('[data-check="lower"]'),
    upper: pwReqs.querySelector('[data-check="upper"]'),
    digit: pwReqs.querySelector('[data-check="digit"]'),
  } : null;

  function updatePwChecklist(v){
    if (!reqMap) return {len:true,lower:true,upper:true,digit:true};
    const checks = {
      len:   v.length >= 8,
      lower: /[a-z]/.test(v),
      upper: /[A-Z]/.test(v),
      digit: /\d/.test(v)
    };
    Object.entries(checks).forEach(([k, ok]) => reqMap[k]?.classList.toggle('ok', ok));
    return checks;
  }

  // Máscaras (só se os campos existirem)
  cpf?.addEventListener('input', () => {
    const d = onlyDigits(cpf.value);
    cpf.value = maskCPF(d);
    if (d && d.length !== 11) setValidity(cpf, false, 'CPF deve conter 11 dígitos.');
    else setValidity(cpf, true);
  });
  telefone?.addEventListener('input', () => { telefone.value = maskPhone(onlyDigits(telefone.value)); });

  // Mostrar/ocultar senha
  const toggleVis = (input, icon) => { if(!(input&&icon)) return; input.type = input.type==='password'?'text':'password'; icon.classList.toggle('fa-eye-slash'); };
  eyeSenha?.addEventListener('click', ()=>toggleVis(senha,eyeSenha));
  eyeConf ?.addEventListener('click', ()=>toggleVis(confirmar,eyeConf));
  eyeSenha?.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggleVis(senha,eyeSenha);} });
  eyeConf ?.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggleVis(confirmar,eyeConf);} });

  // Requisitos em tempo real + confirmação
  senha?.addEventListener('input', () => {
    const c = updatePwChecklist(senha.value);
    const allOk = c.len && c.lower && c.upper && c.digit;
    btn?.toggleAttribute('disabled', !allOk || (confirmar && confirmar.value !== senha.value));
    if (confirmar?.value && confirmar.value !== senha.value){
      setValidity(confirmar,false,'As senhas não coincidem.');
    } else {
      setValidity(confirmar,true);
    }
  });
  confirmar?.addEventListener('input', () => {
    if (confirmar.value && senha && confirmar.value !== senha.value){
      setValidity(confirmar,false,'As senhas não coincidem.');
    } else {
      setValidity(confirmar,true);
    }
    // reavalia botão
    const c = updatePwChecklist(senha?.value || '');
    const allOk = c.len && c.lower && c.upper && c.digit;
    btn?.toggleAttribute('disabled', !allOk || (confirmar && confirmar.value !== (senha?.value||'')));
  });
  updatePwChecklist(senha?.value || '');

  // Submit: validação específica por tela
  form.addEventListener('submit', (e) => {
    // spinner visual
    btn?.classList.add('loading');

    if (isReset){
      // Somente senha/confirmar
      const c = updatePwChecklist(senha?.value || '');
      if (!(c.len && c.lower && c.upper && c.digit)){ senha?.reportValidity(); e.preventDefault(); btn?.classList.remove('loading'); return; }
      if (senha?.value !== confirmar?.value){ setValidity(confirmar,false,'As senhas não coincidem.'); confirmar?.reportValidity(); e.preventDefault(); btn?.classList.remove('loading'); return; }
      setValidity(confirmar,true);
      return; // deixa enviar
    }

    // Cadastro completo
    if (!nome?.value.trim()){ nome?.reportValidity(); e.preventDefault(); btn?.classList.remove('loading'); return; }
    // e-mail
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.value.trim())){
      setValidity(email,false,'Informe um e-mail válido.');
      email.reportValidity(); e.preventDefault(); btn?.classList.remove('loading'); return;
    }
    setValidity(email,true);
    // CPF
    const d = onlyDigits(cpf?.value || '');
    if (d.length !== 11){ setValidity(cpf,false,'CPF deve conter 11 dígitos.'); cpf?.reportValidity(); e.preventDefault(); btn?.classList.remove('loading'); return; }
    if (!validateCPF(d)){ setValidity(cpf,false,'CPF inválido. Verifique os dígitos.'); cpf?.reportValidity(); e.preventDefault(); btn?.classList.remove('loading'); return; }
    setValidity(cpf,true);
    // senha
    const c = updatePwChecklist(senha?.value || '');
    if (!(c.len && c.lower && c.upper && c.digit)){ senha?.reportValidity(); e.preventDefault(); btn?.classList.remove('loading'); return; }
    if (senha?.value !== confirmar?.value){ setValidity(confirmar,false,'As senhas não coincidem.'); confirmar?.reportValidity(); e.preventDefault(); btn?.classList.remove('loading'); return; }
    setValidity(confirmar,true);
    // termos (se existir)
    if (termos && !termos.checked){ termos.setCustomValidity('Você precisa aceitar os termos.'); termos.reportValidity(); e.preventDefault(); btn?.classList.remove('loading'); return; }
    termos?.setCustomValidity('');
  });
})();

// ==== Flash: auto-close e clique para fechar ====
(function initFlashes(){
  const container = document.querySelector('.flash-container');
  if (!container) return;
  container.querySelectorAll('.alert').forEach(alert => {
    // fechar ao clicar no X
    alert.querySelector('.alert-close')?.addEventListener('click', ()=> alert.remove());
    // auto fechar em 5s
    setTimeout(()=> alert.remove(), 5000);
  });
})();

// ==== Botão loading no forgot ====
(function initForgot(){
  const form = document.querySelector('form[action="/forgot"], form#forgotForm') || 
               (document.querySelector('h1')?.textContent?.includes('Recuperar') ? document.querySelector('form') : null);
  if (!form) return;
  const btn = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', ()=> btn?.classList.add('loading'));
})();