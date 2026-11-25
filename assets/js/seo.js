(function () {
  'use strict';

  var data = window.SITE_DATA;
  if (!data) return;

  var facts = data.siteFacts || {};
  var keywords = [
    'مبل', 'مبل تختخوابشو', 'مبل تخت خواب شو', 'تختخوابشو', 'تخت خواب شو',
    'مبل تختخوابشو مشهد', 'تولیدی مبل تختخوابشو مشهد', 'مبل بیگی', 'مبل بیگی مستر تختشو',
    'مبل تختخوابشو تک نفره', 'مبل تختخوابشو دونفره', 'کاناپ تختخوابشو', 'مبل ال تختخوابشو',
    'مبل تختخوابشو باغ', 'مبل تختخوابشو ویلا', 'تخت در پذیرایی', 'تختخوابشو TV room',
    'مبل تختخوابشو فضای کوچک', 'مبل تختخوابشو ارزان مشهد', 'مبل تختخوابشو با ضمانت',
    'مبل ریلی', 'مبل صفر دیوار', 'مبل دوقلو', 'کاناپ اداری تختخوابشو', 'مبل پرنس', 'مبل با کسی',
    'مبل تختخوابشو کلاف فلزی', 'پارچه نانو مبل', 'اسفنج ۳۵ کیلویی', 'تحویل فوری مبل مشهد',
    'ارسال مبل به تمام کشور', 'خرید مبل تختخوابشو آنلاین', 'قیمت مبل تختخوابشو مشهد'
  ];

  function addMeta(name, content, isProperty) {
    var m = document.createElement('meta');
    m.setAttribute(isProperty ? 'property' : 'name', name);
    m.setAttribute('content', content);
    document.head.appendChild(m);
  }

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function imageCandidates(product, index) {
    var size = product.sizes[0].id;
    var color = data.colors[0].id;
    var base = data.imageBase + '/' + product.slug + '/' + size + '/' + color + '/';
    return [
      base + product.slug + '-' + size + '-' + color + '-' + pad(index) + '.jpg',
      base + pad(index) + '.jpg'
    ];
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

  addMeta('keywords', keywords.join(','));
  addMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
  addMeta('googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
  addMeta('author', facts.founder || 'امیر بیگی');
  addMeta('theme-color', '#0E100F');
  addMeta('og:site_name', 'مبل بیگی مستر تختشو', true);
  addMeta('og:locale', 'fa_IR', true);

  document.documentElement.setAttribute('itemscope', '');
  document.documentElement.setAttribute('itemtype', 'https://schema.org/WebPage');

  var products = data.products.map(function (p) {
    return {
      '@type': 'Product',
      '@id': '#product-' + p.slug,
      name: p.name,
      description: p.description,
      category: p.tagline,
      sku: p.code,
      brand: { '@type': 'Brand', name: 'Mobel.beigi' },
      image: 'assets/images/product-open.jpg',
      material: 'فلز',
      audience: { '@type': 'Audience', audienceType: 'عموم مردم و خانوادهها' },
      additionalProperty: p.sizes.map(function (s) {
        return { '@type': 'PropertyValue', name: 'عرض', value: s.width };
      })
    };
  });

  var graph = [
    {
      '@type': 'Organization',
      '@id': '#organization',
      name: 'مبل بیگی مستر تختشو',
      alternateName: 'Mobel.beigi',
      founder: { '@type': 'Person', name: facts.founder || 'امیر بیگی' },
      telephone: '+989354381609',
      sameAs: [facts.instagram, facts.divar].filter(Boolean),
      knowsAbout: keywords
    },
    {
      '@type': 'LocalBusiness',
      '@id': '#business',
      name: 'مبل بیگی مستر تختشو',
      telephone: '+989354381609',
      image: 'assets/images/logo.jpg',
      address: [
        { '@type': 'PostalAddress', name: 'کارخانه', streetAddress: facts.factoryAddress, addressLocality: 'مشهد', addressRegion: 'خراسان رضوی', addressCountry: 'IR' },
        { '@type': 'PostalAddress', name: 'فروشگاه', streetAddress: facts.storeAddress, addressLocality: 'مشهد', addressRegion: 'خراسان رضوی', addressCountry: 'IR' }
      ],
      areaServed: { '@type': 'Country', name: 'ایران' },
      description: 'تولیدی تخصصی مبل تختخوابشو با کلاف تمام فلزی، ضمانت کتبی و ارسال سراسری.'
    },
    {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map(function (p, i) {
        return { '@type': 'ListItem', position: i + 1, item: { '@id': p['@id'] } };
      })
    },
    {
      '@type': 'FAQPage',
      mainEntity: data.faq.map(function (item) {
        return {
          '@type': 'Question',
          name: item[0],
          acceptedAnswer: { '@type': 'Answer', text: item[1] }
        };
      })
    }
  ].concat(products);

  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(script);

  data.products.forEach(function (p, i) {
    probeFirst(imageCandidates(p, 1)).then(function (url) {
      if (!url) return;
      products[i].image = url;
      script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    });
  });
})();
