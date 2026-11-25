(function () {
  'use strict';

  var config = window.SITE_CONFIG || { whatsapp: '989354381609', divarLinks: {} };

  function waUrl(text) {
    return 'https://wa.me/' + config.whatsapp + '?text=' + encodeURIComponent(text);
  }

  document.querySelectorAll('[data-instagram]').forEach(function (el) {
    if (config.instagram) {
      el.href = config.instagram;
      el.rel = 'noopener noreferrer';
    }
  });

  document.querySelectorAll('[data-divar]').forEach(function (el) {
    var key = el.getAttribute('data-divar');
    var links = config.divarLinks || {};
    var url = typeof links[key] === 'string' ? links[key].trim() : '';

    if (/^https?:\/\//.test(url)) {
      el.href = url;
      el.rel = 'noopener noreferrer nofollow';
      return;
    }

    var label = (el.textContent || 'مبل تختخوابشو').trim();
    el.href = waUrl('سلام، لینک آگهی دیوار هنوز تنظیم نشده. میخوام در مورد "' + label + '" مشاوره بگیرم.');
    el.textContent = 'استعلام در واتساپ';
  });

  var form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var name = String(data.get('name') || '').trim();
      var phone = String(data.get('phone') || '').trim();
      var subject = String(data.get('subject') || '').trim();
      var message = String(data.get('message') || '').trim();
      var text = [
        'سلام، از سایت مبل بیگی مستر تختشو پیام دادم:',
        'نام: ' + name,
        'شماره تماس: ' + phone,
        'موضوع: ' + subject,
        'توضیحات: ' + (message || '-')
      ].join('\n');
      window.open(waUrl(text), '_blank', 'noopener,noreferrer');
    });
  }
})();
