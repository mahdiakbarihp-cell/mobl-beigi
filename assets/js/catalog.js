(function () {
  'use strict';

  var data = window.SITE_DATA;
  if (!data) return;

  var digits = '۰۱۲۳۴۵۶۷۸۹';

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function fa(n) { return String(n).replace(/\d/g, function (d) { return digits[Number(d)]; }); }

  function imageUrl(slug, variant, color, index) {
    return data.imageBase + '/' + slug + '/' + variant + '/' + color + '/' + pad(index) + '.jpg';
  }

  function probe(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(url); };
      img.onerror = function () { resolve(null); };
      img.src = url;
    });
  }

  function photosFor(slug, variant, color) {
    var urls = [];
    for (var i = 1; i <= data.maxPhotos; i++) urls.push(imageUrl(slug, variant, color, i));
    return Promise.all(urls.map(probe)).then(function (list) {
      return list.filter(function (url) { return url; });
    });
  }

  function colorsFor(slug, variant) {
    return Promise.all(data.colors.map(function (color) {
      return probe(imageUrl(slug, variant, color.id, 1)).then(function (url) {
        return url ? color : null;
      });
    })).then(function (list) {
      return list.filter(function (color) { return color; });
    });
  }

  function node(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function wa(text) {
    return 'https://wa.me/' + data.whatsapp + '?text=' + encodeURIComponent(text);
  }

  function setMeta(title, description) {
    document.title = title;
    var d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute('content', description);
    var og = document.querySelector('meta[property="og:title"]');
    if (og) og.setAttribute('content', title);
  }

  function renderCollection() {
    var root = document.getElementById('collectionList');
    if (!root) return;

    data.products.forEach(function (product, index) {
      var row = node('article', 'editorial-row');
      row.setAttribute('data-slug', product.slug);

      var copy = node('div', 'row-copy');
      copy.appendChild(node('span', 'eyebrow', product.code + ' / مدل ' + fa(index + 1)));
      copy.appendChild(node('h2', 'row-title', product.name));
      copy.appendChild(node('p', 'row-tagline', product.tagline));
      copy.appendChild(node('p', 'row-variants', 'تک نفره · ۱۴۰ · ۱۶۰ · ۱۸۰ سانتی متر'));
      var link = node('a', 'text-link', 'مشاهدهٔ مدل');
      link.href = 'product.html?model=' + product.slug;
      copy.appendChild(link);

      var figure = node('figure', 'row-visual');
      row.appendChild(node('div', 'row-no', fa(index + 1)));
      row.appendChild(copy);
      row.appendChild(figure);
      root.appendChild(row);

      colorsFor(product.slug, 'single').then(function (colors) {
        if (!colors.length) {
          row.classList.add('no-image');
          figure.hidden = true;
          return;
        }
        var img = document.createElement('img');
        img.loading = 'lazy';
        img.alt = 'مبل تختخوابشو مدل ' + product.name;
        img.addEventListener('error', function () {
          row.classList.add('no-image');
          figure.hidden = true;
        });
        img.src = imageUrl(product.slug, 'single', colors[0].id, 1);
        figure.appendChild(img);
      });
    });
  }

  function renderDetail() {
    var root = document.getElementById('productRoot');
    if (!root) return;

    var params = new URLSearchParams(window.location.search);
    var slug = params.get('model');
    var product = data.products.filter(function (p) { return p.slug === slug; })[0] || data.products[0];
    var state = { variant: 'single', color: null };

    setMeta(product.name + ' | مبل تختخوابشو | مبل بیگی مستر تختشو', product.description);

    var crumb = node('nav', 'breadcrumb');
    var home = node('a', '', 'صفحه اصلی');
    home.href = 'index.html';
    var cat = node('a', '', 'محصولات');
    cat.href = 'products.html';
    crumb.appendChild(home);
    crumb.appendChild(node('span', '', '/'));
    crumb.appendChild(cat);
    crumb.appendChild(node('span', '', '/'));
    crumb.appendChild(node('span', '', product.name));

    var intro = node('div', 'detail-intro');
    intro.appendChild(node('span', 'eyebrow', product.code + ' — کالکشن مبل تختخوابشو'));
    intro.appendChild(node('h1', 'detail-title', product.name));
    intro.appendChild(node('p', 'detail-tagline', product.tagline));
    intro.appendChild(node('p', 'detail-desc', product.description));

    var grid = node('div', 'detail-grid');
    var gallery = node('div', 'gallery');
    gallery.id = 'gallery';
    var panel = node('div', 'detail-panel');
    grid.appendChild(gallery);
    grid.appendChild(panel);

    var variantsBox = node('div', 'option-block');
    variantsBox.appendChild(node('h3', 'option-title', 'انتخاب اندازه'));
    var variantList = node('div', 'variant-list');
    data.variants.forEach(function (v) {
      var b = node('button', 'variant-chip');
      b.type = 'button';
      b.setAttribute('data-variant', v.id);
      b.appendChild(node('span', 'chip-label', v.label));
      b.appendChild(node('span', 'chip-width', v.width + ' سانتی متر'));
      variantList.appendChild(b);
    });
    variantsBox.appendChild(variantList);

    var colorBox = node('div', 'option-block');
    colorBox.appendChild(node('h3', 'option-title', 'رنگ'));
    var colorList = node('div', 'color-list');
    colorBox.appendChild(colorList);
    colorBox.appendChild(node('p', 'all-colors', 'رنگهای قابل سفارش: ' + data.colors.map(function (c) { return c.name; }).join(' · ')));

    var ctaBox = node('div', 'cta-block');
    ctaBox.appendChild(node('span', 'price-note', 'قیمت پس از مشاوره و انتخاب پارچه اعلام میشود'));
    var cta = node('a', 'cta-button', 'استعلام قیمت در واتساپ');
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';
    cta.id = 'productCta';
    ctaBox.appendChild(cta);

    var specsBox = node('div', 'option-block');
    specsBox.appendChild(node('h3', 'option-title', 'مشخصات'));
    var table = node('dl', 'spec-table');
    product.specs.forEach(function (spec) {
      table.appendChild(node('dt', '', spec[0]));
      table.appendChild(node('dd', '', spec[1]));
    });
    specsBox.appendChild(table);

    var faqBox = node('div', 'option-block');
    faqBox.appendChild(node('h3', 'option-title', 'پرسشهای رایج'));
    data.faq.forEach(function (item) {
      var d = document.createElement('details');
      d.appendChild(node('summary', '', item[0]));
      d.appendChild(node('p', '', item[1]));
      faqBox.appendChild(d);
    });

    panel.appendChild(variantsBox);
    panel.appendChild(colorBox);
    panel.appendChild(ctaBox);
    panel.appendChild(specsBox);
    panel.appendChild(faqBox);

    var related = node('section', 'related');
    related.appendChild(node('h3', 'related-title', 'مدلهای دیگر'));
    var relatedList = node('div', 'related-list');
    data.products.filter(function (p) { return p.slug !== product.slug; }).forEach(function (p) {
      var a = node('a', 'related-item', p.name);
      a.href = 'product.html?model=' + p.slug;
      relatedList.appendChild(a);
    });
    related.appendChild(relatedList);

    root.appendChild(crumb);
    root.appendChild(intro);
    root.appendChild(grid);
    root.appendChild(related);

    function updateCta() {
      var variant = data.variants.filter(function (v) { return v.id === state.variant; })[0];
      var color = state.color || { name: 'انتخاب نشده' };
      cta.href = wa('سلام، میخوام قیمت مبل تختخوابشو مدل ' + product.name + ' (' + product.code + ') اندازه ' + variant.label + ' با رنگ ' + color.name + ' رو بدونم.');
    }

    function showPhotos(photos) {
      gallery.innerHTML = '';
      if (!photos.length) {
        gallery.hidden = true;
        return;
      }
      gallery.hidden = false;
      var main = document.createElement('img');
      main.className = 'gallery-main';
      main.alt = 'مبل تختخوابشو مدل ' + product.name;
      main.src = photos[0];
      gallery.appendChild(main);
      if (photos.length > 1) {
        var strip = node('div', 'gallery-strip');
        photos.forEach(function (url, i) {
          var thumb = document.createElement('img');
          thumb.src = url;
          thumb.alt = 'نمای ' + fa(i + 1) + ' از مدل ' + product.name;
          thumb.className = i === 0 ? 'active' : '';
          thumb.addEventListener('click', function () {
            main.src = url;
            strip.querySelectorAll('img').forEach(function (t) { t.classList.remove('active'); });
            thumb.classList.add('active');
          });
          strip.appendChild(thumb);
        });
        gallery.appendChild(strip);
      }
    }

    function selectColor(color) {
      state.color = color;
      colorList.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-color') === color.id);
      });
      updateCta();
      showPhotos([]);
      photosFor(product.slug, state.variant, color.id).then(showPhotos);
    }

    function loadVariant(variantId) {
      state.variant = variantId;
      variantList.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-variant') === variantId);
      });
      colorList.innerHTML = '';
      gallery.hidden = true;
      updateCta();
      colorsFor(product.slug, variantId).then(function (colors) {
        if (!colors.length) return;
        colors.forEach(function (color) {
          var b = node('button', 'color-dot');
          b.type = 'button';
          b.style.background = color.hex;
          b.title = color.name;
          b.setAttribute('data-color', color.id);
          b.setAttribute('aria-label', color.name);
          b.addEventListener('click', function () { selectColor(color); });
          colorList.appendChild(b);
        });
        selectColor(colors[0]);
      });
    }

    variantList.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { loadVariant(b.getAttribute('data-variant')); });
    });

    loadVariant('single');
  }

  renderCollection();
  renderDetail();
})();
