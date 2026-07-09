
window.MINAS_SAT = window.MINAS_SAT || {
  googleAdsId: 'AW-SEU_ID_AQUI',
  conversionLabel: 'SEU_LABEL_AQUI',
  whatsapp: '5531973022828'
};
(function () {
  var id = String(window.MINAS_SAT.googleAdsId || '').trim();
  if (!/^AW-[0-9]+$/.test(id)) return;
  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(tag);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id);
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
    var sectionKeys = ['servicos','produtos','atendimento','faq','contato'];
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
      'Olá, Minas Sat. Quero uma cotação.',
      'Nome: ' + get('leadName'),
      get('leadPhone') ? 'Telefone: ' + get('leadPhone') : '',
      get('leadCity') ? 'Cidade/UF: ' + get('leadCity') : '',
      get('leadType') ? 'Interesse: ' + get('leadType') : '',
      get('leadQty') ? 'Quantidade de veículos: ' + get('leadQty') : '',
      get('leadMsg') ? 'Mensagem: ' + get('leadMsg') : ''
    ].filter(Boolean);
    conversionEvent('lead_form_whatsapp', true);
    window.open(whatsappUrl(parts.join('\n')), '_blank', 'noopener');
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
if (cookies && accept) {
  if (!localStorage.getItem('minasSatCookiesOk')) cookies.classList.add('show');
  accept.addEventListener('click', function () {
    localStorage.setItem('minasSatCookiesOk', '1');
    cookies.classList.remove('show');
  });
}
