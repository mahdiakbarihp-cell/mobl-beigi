(function () {
  'use strict';

  var data = window.SITE_DATA;
  if (!data) return;

  var digits = '۰۱۲۳۴۵۶۷۸۹';

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function fa(n) { return String(n).replace(/\d/g, function (d) { return digits[Number(d)]; }); }

  function imageUrl(slug, sizeId, color, index, descriptive) {
    var base = data.imageBase + '/' + slug + '/' + sizeId + '/' + color + '/';
    var name = descriptive ? slug + '-' + sizeId + '-' + color + '-' + pad(index) : pad(index);
    return base + name + '.jpg';
  }

  function imageUrls(slug, sizeId, color, index) {
    return [imageUrl(slug, sizeId, color, index, true), imageUrl(slug, sizeId, color, index, false)];
  }

  function videoUrl(slug, index) {
    return data.videoBase + '/' + slug + '/' + pad(index) + '.mp4';
  }

  function probeVideo(url) {
    return new Promise(function (resolve) {
      var v = document.createElement('video');
      v.preload = 'metadata';
      v.muted = true;
      v.onloadedmetadata = function () { resolve(url); };
      v.onerror = function () { resolve(null); };
      v.src = url;
      v.load();
    });
  }

  function videosFor(slug) {
    var urls = [];
    for (var i = 1; i <= data.maxVideos; i++) urls.push(videoUrl(slug, i));
    return Promise.all(urls.map(probeVideo)).then(function (list) {
      return list.filter(function (url) { return url; });
    });
  }

  function probe(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(url); };
      img.onerror = function () { resolve(null); };
      img.src = url;
    });
  }

  function probeFirst(urls) {
    var i = 0;
    function next() {
      if (i >= urls.length) return Promise.resolve(null);
      var url = urls[i++];
      return probe(url).then(function (found) { return found || next(); });
    }
    return next();
  }

  function photosFor(slug, sizeId, color) {
    var jobs = [];
    for (var i = 1; i <= data.maxPhotos; i++) jobs.push(probeFirst(imageUrls(slug, sizeId, color, i)));
    return Promise.all(jobs).then(function (list) {
      return list.filter(function (url) { return url; });
    });
  }

  function colorsFor(slug, sizeId) {
    return Promise.all(data.colors.map(function (color) {
      return probeFirst(imageUrls(slug, sizeId, color.id, 1)).then(function (url) {
        if (!url) return null;
        return { id: color.id, name: color.name, hex: color.hex, url: url };
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

  function categoryName(product) {
    var cat = data.categories.filter(function (c) { return c.id === product.category; })[0];
    return cat ? cat.name : '';
  }

  function renderCollection() {
    var root = document.getElementById('collectionList');
    if (!root) return;

    var groups = node('div', 'collection-groups');

    data.categories.forEach(function (cat) {
      var items = data.products.filter(function (p) { return p.category === cat.id; });
      if (!items.length) return;

      var section = node('section', 'collection-group');
      section.id = 'cat-' + cat.id;
      var title = node('div', 'group-heading');
      title.appendChild(node('span', 'kicker', 'دسته'));
      title.appendChild(node('h2', 'group-title', cat.name));
      title.appendChild(node('span', 'group-count', fa(items.length) + ' مدل'));
      section.appendChild(title);

      items.forEach(function (product, index) {
        var row = node('article', 'editorial-row');
        row.setAttribute('data-slug', product.slug);

        var copy = node('div', 'row-copy');
        copy.appendChild(node('span', 'eyebrow', product.code + ' / ' + cat.name));
        copy.appendChild(node('h2', 'row-title', product.name));
        copy.appendChild(node('p', 'row-tagline', product.tagline));
        copy.appendChild(node('p', 'row-variants', product.sizes.map(function (s) { return s.label; }).join(' · ')));
        var link = node('a', 'text-link', 'مشاهدهٔ مدل');
        link.href = 'product.html?model=' + product.slug;
        copy.appendChild(link);

        var figure = node('figure', 'row-visual');
        row.appendChild(node('div', 'row-no', fa(index + 1)));
        row.appendChild(copy);
        row.appendChild(figure);
        section.appendChild(row);

        colorsFor(product.slug, product.sizes[0].id).then(function (colors) {
          if (!colors.length) {
            row.classList.add('no-image');
            figure.hidden = true;
            return;
          }
          var img = document.createElement('img');
          img.loading = 'lazy';
          img.alt = product.name + '، ' + cat.name + '، ' + product.sizes[0].label + '، رنگ ' + colors[0].name;
          img.title = img.alt;
          img.addEventListener('error', function () {
            row.classList.add('no-image');
            figure.hidden = true;
          });
          img.src = colors[0].url;
          figure.appendChild(img);
        });
      });

      groups.appendChild(section);
    });

    root.appendChild(groups);
  }

  function renderDetail() {
    var root = document.getElementById('productRoot');
    if (!root) return;

    var params = new URLSearchParams(window.location.search);
    var slug = params.get('model');
    var product = data.products.filter(function (p) { return p.slug === slug; })[0] || data.products[0];
    var state = { size: product.sizes[0].id, color: null };

    setMeta(product.name + ' | مبل تختخوابشو | مبل بیگی مستر تختشو', product.description);

    var crumb = node('nav', 'breadcrumb');
    var home = node('a', '', 'صفحه اصلی');
    home.href = 'index.html';
    var cat = node('a', '', categoryName(product));
    cat.href = 'products.html#cat-' + product.category;
    crumb.appendChild(home);
    crumb.appendChild(node('span', '', '/'));
    crumb.appendChild(cat);
    crumb.appendChild(node('span', '', '/'));
    crumb.appendChild(node('span', '', product.name));

    var intro = node('div', 'detail-intro');
    intro.appendChild(node('span', 'eyebrow', product.code + ' — ' + categoryName(product)));
    intro.appendChild(node('h1', 'detail-title', product.name));
    intro.appendChild(node('p', 'detail-tagline', product.tagline));
    intro.appendChild(node('p', 'detail-desc', product.description));

    var grid = node('div', 'detail-grid');
    var gallery = node('div', 'gallery');
    gallery.id = 'gallery';
    var panel = node('div', 'detail-panel');
    grid.appendChild(gallery);
    grid.appendChild(panel);

    var sizesBox = node('div', 'option-block');
    sizesBox.appendChild(node('h3', 'option-title', 'انتخاب عرض'));
    var sizeList = node('div', 'variant-list');
    product.sizes.forEach(function (s) {
      var b = node('button', 'variant-chip');
      b.type = 'button';
      b.setAttribute('data-variant', s.id);
      b.appendChild(node('span', 'chip-label', s.label));
      b.appendChild(node('span', 'chip-width', s.width));
      sizeList.appendChild(b);
    });
    sizesBox.appendChild(sizeList);

    var colorBox = node('div', 'option-block');
    colorBox.appendChild(node('h3', 'option-title', 'رنگ'));
    var colorList = node('div', 'color-list');
    colorBox.appendChild(colorList);
    colorBox.appendChild(node('p', 'all-colors', 'رنگهای قابل سفارش: ' + data.colors.map(function (c) { return c.name; }).join(' · ')));

    var ctaBox = node('div', 'cta-block');
    ctaBox.appendChild(node('span', 'price-note', 'قیمت روز و تخفیف ویژه روز را در واتس آپ، روبیکا و تلگرام بگیرید.'));
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

    panel.appendChild(sizesBox);
    panel.appendChild(colorBox);
    panel.appendChild(ctaBox);
    panel.appendChild(specsBox);
    panel.appendChild(faqBox);

    videosFor(product.slug).then(function (videos) {
      if (!videos.length) return;
      var box = node('div', 'option-block video-block');
      box.appendChild(node('h3', 'option-title', 'ویدیو معرفی'));
      var list = node('div', 'video-list');
      videos.forEach(function (url, i) {
        var v = document.createElement('video');
        v.controls = true;
        v.preload = 'none';
        v.playsInline = true;
        v.src = url;
        v.setAttribute('aria-label', 'ویدیو ' + fa(i + 1) + ' از مدل ' + product.name);
        list.appendChild(v);
      });
      box.appendChild(list);
      panel.insertBefore(box, ctaBox);
    });

    var related = node('section', 'related');
    related.appendChild(node('h3', 'related-title', 'مدلهای همین دسته'));
    var relatedList = node('div', 'related-list');
    data.products.filter(function (p) { return p.slug !== product.slug && p.category === product.category; }).forEach(function (p) {
      var a = node('a', 'related-item', p.name);
      a.href = 'product.html?model=' + p.slug;
      relatedList.appendChild(a);
    });
    if (!relatedList.children.length) {
      data.products.filter(function (p) { return p.slug !== product.slug; }).slice(0, 4).forEach(function (p) {
        var a = node('a', 'related-item', p.name);
        a.href = 'product.html?model=' + p.slug;
        relatedList.appendChild(a);
      });
    }
    related.appendChild(relatedList);

    root.appendChild(crumb);
    root.appendChild(intro);
    root.appendChild(grid);
    root.appendChild(related);

    function updateCta() {
      var size = product.sizes.filter(function (s) { return s.id === state.size; })[0];
      var color = state.color || { name: 'انتخاب نشده' };
      cta.href = wa('سلام، میخوام قیمت مبل تختخوابشو مدل ' + product.name + ' (' + product.code + ') اندازه ' + size.label + ' با رنگ ' + color.name + ' رو بدونم.');
    }

    function showPhotos(photos) {
      gallery.innerHTML = '';
      if (!photos.length) {
        gallery.hidden = true;
        return;
      }
      gallery.hidden = false;
      var sizeLabel = product.sizes.filter(function (s) { return s.id === state.size; })[0].label;
      var colorLabel = (state.color && state.color.name) || 'انتخاب نشده';
      var main = document.createElement('img');
      main.className = 'gallery-main';
      main.alt = product.name + '، ' + categoryName(product) + '، ' + sizeLabel + '، رنگ ' + colorLabel;
      main.title = main.alt;
      main.src = photos[0];
      gallery.appendChild(main);
      if (photos.length > 1) {
        var strip = node('div', 'gallery-strip');
        photos.forEach(function (url, i) {
          var thumb = document.createElement('img');
          thumb.src = url;
          thumb.alt = 'نمای ' + fa(i + 1) + ' از ' + product.name + '، ' + sizeLabel + '، رنگ ' + colorLabel;
          thumb.title = thumb.alt;
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
      photosFor(product.slug, state.size, color.id).then(showPhotos);
    }

    function loadSize(sizeId) {
      state.size = sizeId;
      sizeList.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-variant') === sizeId);
      });
      colorList.innerHTML = '';
      gallery.hidden = true;
      updateCta();
      colorsFor(product.slug, sizeId).then(function (colors) {
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

    sizeList.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { loadSize(b.getAttribute('data-variant')); });
    });

    loadSize(product.sizes[0].id);
  }

  renderCollection();
  renderDetail();
})();
