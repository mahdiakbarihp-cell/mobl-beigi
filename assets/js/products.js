var rawProducts = [
  { slug: 'raili-80', code: 'MB-01', category: 'raili', name: 'یک نفره مدل ریلی عرض 80', sizes: [['w80', 'عرض ۸۰', '۸۰']] },
  { slug: 'raili-90', code: 'MB-02', category: 'raili', name: 'یک نفره ریلی عرض 90', sizes: [['w90', 'عرض ۹۰', '۹۰']] },
  { slug: 'raili-120', code: 'MB-03', category: 'raili', name: 'یکو نیم نفره ریلی عرض 120', sizes: [['w120', 'عرض ۱۲۰', '۱۲۰']] },
  { slug: 'raili-140', code: 'MB-04', category: 'raili', name: 'دونفره ریلی عرض 140', sizes: [['w140', 'عرض ۱۴۰', '۱۴۰']] },
  { slug: 'raili-160', code: 'MB-05', category: 'raili', name: 'سه نفره ریلی عرض 160', sizes: [['w160', 'عرض ۱۶۰', '۱۶۰']] },
  { slug: 'raili-180', code: 'MB-06', category: 'raili', name: 'کاناپ چهار نفره مدل ریلی عرض 180', sizes: [['w180', 'عرض ۱۸۰', '۱۸۰']] },
  { slug: 'laloski-80', code: 'MB-07', category: 'zero-wall', name: 'یک نفره جدل لالوسکی صفر دیوار عرض 80', sizes: [['w80', 'عرض ۸۰', '۸۰']] },
  { slug: 'laloski-90', code: 'MB-08', category: 'zero-wall', name: 'یک نفره مدل لالوسکی صفر دیوار عرض 90', sizes: [['w90', 'عرض ۹۰', '۹۰']] },
  { slug: 'laloski-140', code: 'MB-09', category: 'zero-wall', name: 'کاناپ صفر دیوار مدل لالوسکی عرض 140', sizes: [['w140', 'عرض ۱۴۰', '۱۴۰']] },
  { slug: 'laloski-160', code: 'MB-10', category: 'zero-wall', name: 'کاناپ صفر دیوار مدل لالوسکی عرض 160', sizes: [['w160', 'عرض ۱۶۰', '۱۶۰']] },
  { slug: 'dougloo-160', code: 'MB-11', category: 'zero-wall', name: 'کاناپ صفر دیوار مدل دوقلو عرض 160', sizes: [['w160', 'عرض ۱۶۰', '۱۶۰']] },
  { slug: 'king-adari', code: 'MB-12', category: 'office', name: 'کاناپ اداری تخت خوابشو مدل کینگ عرض 105*190', sizes: [['w105x190', '۱۰۵ × ۱۹۰', '۱۰۵ در ۱۹۰']] },
  { slug: 'hidden-dark', code: 'MB-13', category: 'office', name: 'کاناپ اداری تختخوابشو مدل هیدن دارک عرض 105*190', sizes: [['w105x190', '۱۰۵ × ۱۹۰', '۱۰۵ در ۱۹۰']] },
  { slug: 'prince-l', code: 'MB-14', category: 'l-shape', name: 'مبل ال باکسدار تختخواب شو مدل پرنس عرض 240', sizes: [['w240', 'عرض ۲۴۰', '۲۴۰']] },
  { slug: 'baksi', code: 'MB-15', category: 'baksi', name: 'کاناپ تختخوابشو مدل با کسی عرض 130 و 140', sizes: [['w130', 'عرض ۱۳۰', '۱۳۰'], ['w140', 'عرض ۱۴۰', '۱۴۰']] }
];

var categories = [
  { id: 'raili', name: 'ریلی' },
  { id: 'zero-wall', name: 'صفر دیوار' },
  { id: 'office', name: 'کاناپ اداری' },
  { id: 'l-shape', name: 'مبل ال' },
  { id: 'baksi', name: 'با کسی' }
];

window.SITE_DATA = {
  imageBase: 'assets/images/products',
  videoBase: 'assets/videos',
  maxPhotos: 15,
  maxVideos: 5,
  whatsapp: '989354381609',
  siteFacts: {
    delivery: 'تحویل فوری ۱ ساعته درب منزل',
    shipping: 'ارسال به تمام نقاط کشور',
    warrantyFrame: '۱۰ سال ضمانت کتبی شرکتی با هولوگرام و مهر — کلاف بی قید و شرط',
    warrantyFoam: 'اسفنج ۳۵ کیلویی با ۲ سال ضمانت کتبی',
    frame: 'کلاف تمام فلزی بدون استفاده از چوب، دوستدار طبیعت',
    fabric: 'پارچه مرغوب و بروز با قابلیت شستشو و تکنولوژی نانو',
    factoryAddress: 'مشهد، شهرک صنعتی',
    storeAddress: 'قبل از ویرانی ۹، جنب تابلوی چاه خاصه، طبقه پایین (مبل بیگی)',
    instagram: 'https://www.instagram.com/moble.beigi',
    divar: 'https://divar.ir/v/AaVpk6jJ?ref=android',
    founder: 'امیر بیگی'
  },
  colors: [
    { id: 'cream', name: 'کرم', hex: '#E8DCC8' },
    { id: 'beige', name: 'بژ', hex: '#CBB79B' },
    { id: 'sand', name: 'شنی', hex: '#D8C4A5' },
    { id: 'taupe', name: 'طوسی گرم', hex: '#8A7C70' },
    { id: 'silver', name: 'نقرهای', hex: '#B9BDC0' },
    { id: 'graphite', name: 'زغالی', hex: '#4A4D4E' },
    { id: 'black', name: 'مشکی', hex: '#1C1D1C' },
    { id: 'coffee', name: 'نسکافهای', hex: '#8C6B4F' },
    { id: 'chocolate', name: 'شکلاتی', hex: '#5A3A28' },
    { id: 'olive', name: 'زیتونی', hex: '#6B6F52' },
    { id: 'emerald', name: 'سبز یشمی', hex: '#2F5D50' },
    { id: 'teal', name: 'فیروزهای', hex: '#3E7C7B' },
    { id: 'navy', name: 'آبی ملکی', hex: '#2C3E50' },
    { id: 'wine', name: 'شرابی', hex: '#6E2F3A' },
    { id: 'rust', name: 'زرشکی', hex: '#8E3B2F' }
  ],
  categories: categories,
  products: rawProducts.map(function (p) {
    var cat = categories.filter(function (c) { return c.id === p.category; })[0];
    var labels = p.sizes.map(function (s) { return s[1]; });
    var widths = p.sizes.map(function (s) { return s[2] + ' سانتی متر'; });
    return {
      slug: p.slug,
      code: p.code,
      category: p.category,
      name: p.name,
      tagline: cat.name + ' · ' + labels.join(' و '),
      description: 'مدل «' + p.name + '» از دستهٔ ' + cat.name + ' مبل تختخوابشو مبل بیگی است. عکسها و جزئیات فنی تکمیلی این مدل در گالری نمایش داده میشود.',
      sizes: p.sizes.map(function (s) { return { id: s[0], label: s[1], width: s[2] }; }),
      specs: [
        ['دسته', cat.name],
        ['ابعاد', widths.join(' و ')],
        ['نوع', 'مبل تختخوابشو'],
        ['کلاف', 'تمام فلز، بدون چوب'],
        ['ضمانت کلاف', '۱۰ سال کتبی با هولوگرام و مهر'],
        ['اسفنج', '۳۵ کیلویی با ۲ سال ضمانت کتبی'],
        ['پارچه', 'نانو و قابل شستشو'],
        ['تحویل', 'فوری ۱ ساعته درب منزل'],
        ['ارسال', 'به تمام نقاط کشور']
      ]
    };
  }),
  faq: [
    ['تحویل چقدر طول میکشد؟', 'در مشهد تحویل فوری ۱ ساعته درب منزل داریم و به تمام نقاط کشور ارسال میکنیم.'],
    ['ضمانت محصول چگونه است؟', 'کلاف تمام فلزی ۱۰ سال ضمانت کتبی شرکتی با هولوگرام و مهر دارد و اسفنج ۳۵ کیلویی هم ۲ سال ضمانت کتبی دارد.'],
    ['جنس کلاف و پارچه چیست؟', 'کلاف کاملاً فلزی است و از چوب استفاده نمیشود. پارچهها مرغوب، بروز، قابل شستشو و دارای تکنولوژی نانو برای دوام بیشترند.'],
    ['برای باغ یا فضای کوچک کدام مدل مناسب است؟', 'مدلهای تک نفره ۸۰ و ۹۰ برای فضاهای کوچک و مدلهای ریلی ۱۴۰ تا ۱۸۰ و مبل ال ۲۴۰ برای پذیرایی، باغ و TV room مناسباند.'],
    ['فروشگاهداران چگونه سفارش کلی بدهند؟', 'رزومه و مشخصات فروشگاه خود را ارسال کنید؛ پس از تأیید، کارخانه با شما تماس میگیرد.'],
    ['قیمت چگونه اعلام میشود؟', 'مدل، اندازه و رنگ مورد نظرتان را در واتساپ بفرستید تا قیمت دقیق پس از مشاوره اعلام شود.'],
    ['عکس و ویدیو مدلها چگونه نمایش داده میشود؟', 'گالری هر مدل تنها عکسها و ویدیوهایی را نشان میدهد که بارگذاری شدهاند؛ رسانهٔ بارگذارینشده مخفی میماند.']
  ]
};
