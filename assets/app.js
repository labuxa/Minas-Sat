
window.MINAS_SAT = window.MINAS_SAT || {
  googleAdsId: 'AW-18248540961',
  conversionLabel: 'zyFWCO_MlMYcEKHGyv1D',
  whatsapp: '5531973022828'
};
function storageGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function storageSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}
function loadGoogleTag() {
  if (window.minasSatGoogleTagLoaded) return;
  var id = String((window.MINAS_SAT && window.MINAS_SAT.googleAdsId) || '').trim();
  if (!/^AW-[0-9]+$/.test(id)) return;
  window.minasSatGoogleTagLoaded = true;
  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(tag);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id);
}
(function initCookiePreference() {
  var choice = storageGet('minasSatCookieChoice');
  if (!choice && storageGet('minasSatCookiesOk')) {
    choice = 'all';
    storageSet('minasSatCookieChoice', choice);
  }
  if (choice === 'all') loadGoogleTag();
})();
function conversionEvent(name, shouldConvert) {
  var cfg = window.MINAS_SAT || {};
  var id = String(cfg.googleAdsId || '').trim();
  var label = String(cfg.conversionLabel || '').trim();
  if (window.gtag) {
    window.gtag('event', name || 'lead_click');
    if (shouldConvert !== false && /^AW-[0-9]+$/.test(id) && label && label !== 'SEU_LABEL_AQUI') {
      window.gtag('event', 'conversion', { send_to: id + '/' + label });
    }
  }
}
function whatsappUrl(message) {
  var number = (window.MINAS_SAT && window.MINAS_SAT.whatsapp) || '5531973022828';
  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
}
function setActiveNav(key) {
  if (!key) return;
  document.querySelectorAll('.nav a[data-nav]').forEach(function (a) {
    var active = a.getAttribute('data-nav') === key;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}
(function initActiveNav(){
  var page = (document.body && document.body.getAttribute('data-page')) || '';
  setActiveNav(page || 'home');
  if (page === 'home' && 'IntersectionObserver' in window) {
    var sectionKeys = ['servicos','produtos','atendimento','faq'];
    var sections = sectionKeys.map(function(id){return document.getElementById(id);}).filter(Boolean);
    var observer = new IntersectionObserver(function(entries){
      var visible = entries.filter(function(e){return e.isIntersecting;}).sort(function(a,b){return b.intersectionRatio-a.intersectionRatio;})[0];
      if (visible) setActiveNav(visible.target.id); else if (window.scrollY < 250) setActiveNav('home');
    }, {rootMargin:'-28% 0px -58% 0px', threshold:[0.08,0.18,0.32]});
    sections.forEach(function(s){ observer.observe(s); });
  }
})();
document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    conversionEvent(el.getAttribute('data-event') || 'whatsapp_click', el.getAttribute('data-conversion') !== 'false');
    window.open(whatsappUrl(el.getAttribute('data-whatsapp')), '_blank', 'noopener');
  });
});
document.querySelectorAll('[data-lead]').forEach(function (el) {
  el.addEventListener('click', function () {
    conversionEvent(el.getAttribute('data-lead') || 'lead_click', el.getAttribute('data-conversion') !== 'false');
  });
});
document.querySelectorAll('[data-event]').forEach(function (el) {
  if (el.hasAttribute('data-whatsapp') || el.hasAttribute('data-lead')) return;
  el.addEventListener('click', function () { conversionEvent(el.getAttribute('data-event'), false); });
});
var leadForm = document.getElementById('leadForm');
if (leadForm) {
  leadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var get = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var parts = [
      '*Solicitação de cotação - Minas Sat*',
      '',
      '*Dados do contato*',
      get('leadName') ? '• Nome: ' + get('leadName') : '',
      get('leadPhone') ? '• WhatsApp: ' + get('leadPhone') : '',
      get('leadCity') ? '• Cidade/UF: ' + get('leadCity') : '',
      '',
      '*Interesse*',
      get('leadType') ? '• Serviço: ' + get('leadType') : '',
      get('leadQty') ? '• Quantidade de veículos: ' + get('leadQty') : '',
      get('leadMsg') ? '• Observação: ' + get('leadMsg') : '',
      '',
      'Aguardo o retorno da equipe.'
    ].filter(function (line, index, arr) {
      if (line !== '') return true;
      return arr[index - 1] && arr[index + 1];
    });
    conversionEvent('lead_form_whatsapp', true);
    window.open(whatsappUrl(parts.join('\n')), '_blank', 'noopener');
    setTimeout(function () {
      window.location.href = 'obrigado.html';
    }, 650);
  });
}
var supportForm = document.getElementById('supportForm');
if (supportForm) {
  supportForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = (document.getElementById('supportName') || {}).value || '';
    var msg = 'Olá, sou cliente Minas Sat e preciso de ajuda para acessar minha plataforma.' + (name.trim() ? '\nNome: ' + name.trim() : '');
    conversionEvent('client_support_click', false);
    window.open(whatsappUrl(msg), '_blank', 'noopener');
  });
}
var year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
var cookies = document.getElementById('cookies');
var accept = document.getElementById('acceptCookies');
var essential = document.getElementById('essentialCookies');
if (cookies && accept && essential) {
  var choice = storageGet('minasSatCookieChoice');
  if (!choice) cookies.classList.add('show');
  accept.addEventListener('click', function () {
    storageSet('minasSatCookieChoice', 'all');
    storageSet('minasSatCookiesOk', '1');
    loadGoogleTag();
    cookies.classList.remove('show');
  });
  essential.addEventListener('click', function () {
    storageSet('minasSatCookieChoice', 'essential');
    cookies.classList.remove('show');
  });
}
