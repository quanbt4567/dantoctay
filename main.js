/* =============================================
   MAIN.JS – Toàn bộ JavaScript cho trang Dân Tộc Tày
   ============================================= */
(function () {
  'use strict';

  /* ===== 1. SCROLL PROGRESS BAR ===== */
  var prog = document.createElement('div');
  prog.id = 'scroll-progress';
  document.body.prepend(prog);

  /* ===== 2. LOADER ===== */
  window.addEventListener('load', function () {
    setTimeout(function () {
      var loader = document.getElementById('loader');
      if (loader) loader.classList.add('hide');
      triggerStatBars();
    }, 2300);
  });

  /* ===== 3. CUSTOM CURSOR ===== */
  var cur = document.getElementById('cur');
  var curT = document.getElementById('curT');
  var mx = 0, my = 0, tx = 0, ty = 0;

  if (cur && curT) {
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top = my + 'px';
    });
    (function animTrail() {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      curT.style.left = tx + 'px';
      curT.style.top = ty + 'px';
      requestAnimationFrame(animTrail);
    })();
    document.querySelectorAll('a,button,.card,.fc,.rc,.polaroid,.gs-item,.mosaic-item,.celeb-card,.celeb-featured').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cur.style.transform = 'translate(-50%,-50%) scale(2.5)';
        curT.style.transform = 'translate(-50%,-50%) scale(1.5)';
        curT.style.borderColor = 'rgba(212,168,67,.8)';
      });
      el.addEventListener('mouseleave', function () {
        cur.style.transform = 'translate(-50%,-50%) scale(1)';
        curT.style.transform = 'translate(-50%,-50%) scale(1)';
        curT.style.borderColor = 'rgba(212,168,67,.5)';
      });
    });
  }

  /* ===== 4. PARTICLE CANVAS ===== */
  var canvas = document.getElementById('pc');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var W, H, parts = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    function Particle() { this.reset(); }
    Particle.prototype.reset = function () {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.r = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4 - 0.15;
      this.alpha = Math.random() * 0.6 + 0.1;
      this.color = Math.random() > 0.5 ? '212,168,67' : '26,122,94';
      this.life = Math.random() * 200 + 100; this.age = 0;
    };
    Particle.prototype.update = function () {
      this.x += this.vx; this.y += this.vy; this.age++;
      if (this.age > this.life || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    };
    Particle.prototype.draw = function () {
      var a = this.age < 30 ? this.age / 30 : this.age > this.life - 30 ? (this.life - this.age) / 30 : 1;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.color + ',' + (this.alpha * a) + ')'; ctx.fill();
    };
    for (var i = 0; i < 120; i++) parts.push(new Particle());
    (function drawP() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        for (var j = i + 1; j < parts.length; j++) {
          var dx = parts[i].x - parts[j].x, dy = parts[i].y - parts[j].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(parts[i].x, parts[i].y); ctx.lineTo(parts[j].x, parts[j].y);
            ctx.strokeStyle = 'rgba(212,168,67,' + (0.06 * (1 - d / 100)) + ')';
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
        parts[i].update(); parts[i].draw();
      }
      requestAnimationFrame(drawP);
    })();
  }

  /* ===== 5. NAV ===== */
  var nav = document.getElementById('nav');
  var btt = document.getElementById('btt');
  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('sc', window.scrollY > 80);
    if (btt) {
      btt.style.opacity = window.scrollY > 500 ? '1' : '0';
      btt.style.pointerEvents = window.scrollY > 500 ? 'auto' : 'none';
    }
    // scroll progress
    var scrollTop = window.scrollY;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    if (prog) prog.style.width = ((scrollTop / docH) * 100) + '%';
  });

  window.toggleNav = function () {
    var nl = document.getElementById('nl');
    var bg = document.getElementById('burger');
    if (nl) nl.classList.toggle('open');
    if (bg) {
      bg.classList.toggle('open');
      bg.setAttribute('aria-expanded', bg.classList.contains('open'));
    }
  };
  document.addEventListener('click', function (e) {
    var nl = document.getElementById('nl');
    var bg = document.getElementById('burger');
    if (nl && bg && !nl.contains(e.target) && !bg.contains(e.target)) {
      nl.classList.remove('open');
      bg.classList.remove('open');
    }
  });
  // Close mobile nav on link click
  document.querySelectorAll('.nl a').forEach(function (link) {
    link.addEventListener('click', function () {
      var nl = document.getElementById('nl');
      var bg = document.getElementById('burger');
      if (nl) nl.classList.remove('open');
      if (bg) bg.classList.remove('open');
    });
  });

  /* ===== 6. SCROLL REVEAL ===== */
  var ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('up'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.rv,.rvl,.rvr').forEach(function (el) { ro.observe(el); });

  /* ===== 6b. ACTIVE NAV LINK ===== */
  var navLinks = document.querySelectorAll('.nl a');
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href');
    if (id && id.startsWith('#')) {
      var sec = document.querySelector(id);
      if (sec) sections.push({ el: sec, link: link });
    }
  });
  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    var active = null;
    sections.forEach(function (s) {
      if (s.el.offsetTop <= scrollPos) active = s;
    });
    navLinks.forEach(function (l) { l.classList.remove('active'); });
    if (active) active.link.classList.add('active');
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ===== 7. STAT BARS ===== */
  var barsTriggered = false;
  function triggerStatBars() {
    if (barsTriggered) return;
    barsTriggered = true;
    document.querySelectorAll('.sbf').forEach(function (bar) {
      var w = bar.getAttribute('data-w');
      setTimeout(function () { bar.style.width = w + '%'; }, 200);
    });
  }
  var sbObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) triggerStatBars(); });
  }, { threshold: 0.3 });
  ['sb1', 'sb2'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) sbObs.observe(el);
  });

  /* ===== 8. TABS ===== */
  window.showTab = function (id, btn) {
    document.querySelectorAll('.tpane').forEach(function (p) { p.classList.remove('on'); });
    document.querySelectorAll('.tbtn').forEach(function (b) { b.classList.remove('on'); });
    var el = document.getElementById(id);
    if (el) el.classList.add('on');
    if (btn) btn.classList.add('on');
  };

  /* ===== 9. ANIMATED COUNTERS ===== */
  function animCounter(el, target, duration) {
    var start = 0, step = target / (duration / 16);
    var timer = setInterval(function () {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start).toLocaleString('vi-VN');
    }, 16);
  }
  var cntObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = '1';
        animCounter(e.target, parseInt(e.target.dataset.target || '0'), 2000);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(function (el) { cntObs.observe(el); });

  /* ===== 10. TYPING TEXT ===== */
  var typingEl = document.getElementById('typing-hero');
  if (typingEl) {
    var texts = ['Văn hóa ngàn năm', 'Tiếng đàn tính huyền bí', 'Xôi ngũ sắc thơm lừng', 'Nhà sàn trên đỉnh núi', 'Hát Then – Di sản UNESCO'];
    var ti = 0, ci = 0, deleting = false;
    function tick() {
      var current = texts[ti];
      if (!deleting) {
        typingEl.textContent = current.slice(0, ci + 1); ci++;
        if (ci === current.length) { deleting = true; setTimeout(tick, 2000); return; }
      } else {
        typingEl.textContent = current.slice(0, ci - 1); ci--;
        if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; }
      }
      setTimeout(tick, deleting ? 30 : 60);
    }
    tick();
  }

  /* ===== 11. RIPPLE BUTTONS ===== */
  document.querySelectorAll('.btn-p,.btn-s,.qretry').forEach(function (btn) {
    btn.classList.add('ripple-btn');
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 2;
      var rip = document.createElement('span');
      rip.className = 'ripple-wave';
      rip.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - rect.left - size / 2) + 'px;top:' + (e.clientY - rect.top - size / 2) + 'px;border-radius:50%;background:rgba(255,255,255,.35);transform:scale(0);animation:rippleA .6s linear;pointer-events:none;';
      btn.appendChild(rip);
      setTimeout(function () { rip.remove(); }, 700);
    });
  });

  /* ===== 12. MAGNETIC BUTTONS ===== */
  document.querySelectorAll('.btn-p,.btn-s').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      var y = (e.clientY - rect.top - rect.height / 2) * 0.25;
      btn.style.transform = 'translate(' + x + 'px,' + y + 'px) translateY(-3px)';
    });
    btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
  });

  /* ===== 13. PARALLAX IMAGES ===== */
  var parImgs = document.querySelectorAll('.parallax-img img');
  function updateParallax() {
    parImgs.forEach(function (img) {
      var rect = img.closest('.parallax-img').getBoundingClientRect();
      var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.2;
      img.style.transform = 'translateY(' + offset + 'px)';
    });
  }
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  /* ===== 14. LIGHTBOX ===== */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var lbCap = document.getElementById('lightbox-caption');
  var lbItems = [], lbIdx = 0;

  function openLightbox(items, idx) {
    if (!lb) return;
    lbItems = items; lbIdx = idx;
    setLbImg();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function setLbImg() {
    if (lbImg && lbItems[lbIdx]) {
      lbImg.src = lbItems[lbIdx].src;
      if (lbCap) lbCap.textContent = lbItems[lbIdx].cap || '';
    }
  }

  // Collect all clickable image items
  function initLightboxItems() {
    var allItems = document.querySelectorAll('.mosaic-item img, .gs-item img, .polaroid img');
    allItems.forEach(function (imgEl, i) {
      imgEl.closest('.mosaic-item,.gs-item,.polaroid').addEventListener('click', function () {
        var items = [];
        allItems.forEach(function (it) {
          var wrap = it.closest('.mosaic-item,.gs-item,.polaroid');
          var cap = wrap ? (wrap.querySelector('.mosaic-overlay,.gs-label,.polaroid-label') || {}).textContent : '';
          items.push({ src: it.src, cap: (cap || '').trim() });
        });
        openLightbox(items, i);
      });
    });
  }
  initLightboxItems();

  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb) { lb.classList.remove('open'); document.body.style.overflow = ''; }
    });
    var lbClose = document.getElementById('lightbox-close');
    var lbPrev = document.getElementById('lightbox-prev');
    var lbNext = document.getElementById('lightbox-next');
    if (lbClose) lbClose.addEventListener('click', function () { lb.classList.remove('open'); document.body.style.overflow = ''; });
    if (lbPrev) lbPrev.addEventListener('click', function () { lbIdx = (lbIdx - 1 + lbItems.length) % lbItems.length; setLbImg(); });
    if (lbNext) lbNext.addEventListener('click', function () { lbIdx = (lbIdx + 1) % lbItems.length; setLbImg(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') { lb.classList.remove('open'); document.body.style.overflow = ''; }
      if (e.key === 'ArrowLeft' && lbPrev) lbPrev.click();
      if (e.key === 'ArrowRight' && lbNext) lbNext.click();
    });
  }

  /* ===== 15. GOLD DUST PARTICLES ===== */
  document.querySelectorAll('.ds,.qs,.counter-section').forEach(function (sec) {
    sec.style.position = 'relative';
    for (var i = 0; i < 6; i++) {
      var dust = document.createElement('div');
      dust.style.cssText = 'position:absolute;pointer-events:none;border-radius:50%;' +
        'width:' + (2 + Math.random() * 3) + 'px;height:' + (2 + Math.random() * 3) + 'px;' +
        'background:rgba(212,168,67,' + (0.15 + Math.random() * 0.3) + ');' +
        'left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;' +
        'animation:floatUp ' + (4 + Math.random() * 6) + 's ' + (-Math.random() * 6) + 's ease-in-out infinite;z-index:0;';
      sec.appendChild(dust);
    }
  });

  /* ===== 16. STAGGER REVEAL FOR GALLERY ===== */
  var staggerObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var children = e.target.querySelectorAll('.polaroid,.gs-item');
        children.forEach(function (child, i) {
          setTimeout(function () {
            child.style.opacity = '1';
            child.style.transform = child.classList.contains('polaroid')
              ? 'rotate(var(--rot,-2deg)) scale(1)' : 'translateY(0)';
          }, i * 100);
        });
        staggerObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.polaroid-grid,.gallery-strip').forEach(function (grid) {
    grid.querySelectorAll('.polaroid,.gs-item').forEach(function (child) {
      child.style.opacity = '0';
      child.style.transition = 'opacity .5s ease, transform .5s ease';
    });
    staggerObs.observe(grid);
  });

  /* ===== 17. QUIZ GAME ===== */
  var quizData = [
    { q: 'Dân tộc Tày là dân tộc thiểu số đông dân thứ mấy ở Việt Nam?', opts: ['Thứ nhất', 'Thứ hai', 'Thứ ba', 'Thứ tư'], ans: 0, fb: '✅ Đúng! Với 1.845.492 người (2019), dân tộc Tày là dân tộc thiểu số đông dân nhất, chỉ đứng sau người Kinh.' },
    { q: 'Tiếng Tày thuộc ngữ hệ (nhóm ngôn ngữ) nào?', opts: ['Austro-Asiatic', 'Sino-Tibetan', 'Tai–Kadai (Thái–Ka Đai)', 'Austronesian'], ans: 2, fb: '✅ Chính xác! Tiếng Tày thuộc ngữ hệ Tai–Kadai, có quan hệ gần với tiếng Nùng, tiếng Thái và tiếng Choang ở Trung Quốc.' },
    { q: 'Hát Then được UNESCO ghi danh Di sản phi vật thể nhân loại năm nào?', opts: ['2015', '2017', '2019', '2021'], ans: 2, fb: '✅ Đúng rồi! Năm 2019, Thực hành Then của người Tày, Nùng, Thái ở Việt Nam chính thức được UNESCO ghi danh.' },
    { q: 'Nhạc cụ đặc trưng dùng để đệm hát Then là gì?', opts: ['Đàn bầu', 'Đàn tính', 'Đàn tranh', 'Khèn'], ans: 1, fb: '✅ Đúng! Đàn tính làm từ bầu khô và gỗ sa mộc/dâu — là linh hồn của nghệ thuật dân ca dân vũ Tày.' },
    { q: 'Loại nhà ở truyền thống chủ yếu của người Tày là gì?', opts: ['Nhà đất mái tranh', 'Nhà sàn gỗ', 'Nhà dài', 'Nhà trình tường'], ans: 1, fb: '✅ Chính xác! Người Tày chủ yếu ở nhà sàn gỗ 3 gian, 2 trái, 8 cột gỗ nghiến, mái ngói âm dương.' },
    { q: 'Món ăn đặc sản nổi tiếng nhất của vùng người Tày là gì?', opts: ['Phở bò', 'Vịt quay lá mắc mật', 'Bún bò Huế', 'Bánh xèo'], ans: 1, fb: '✅ Tuyệt vời! Vịt quay lá mắc mật là đặc sản nổi tiếng nhất — hương thơm nồng nàn, vị chua ngọt đặc trưng.' },
    { q: 'Tỉnh nào có số dân tộc Tày đông nhất tại Việt Nam?', opts: ['Cao Bằng', 'Hà Giang', 'Lạng Sơn', 'Tuyên Quang'], ans: 2, fb: '✅ Đúng! Lạng Sơn có 282.014 người Tày, chiếm 15,3% tổng số người Tày cả nước.' },
    { q: 'Làn điệu dân ca nào của người Tày chỉ được hát trong đám cưới?', opts: ['Hát Then', 'Lượn cọi', 'Hát Quan lang', 'Hát ru'], ans: 2, fb: '✅ Chính xác! Hát Quan lang là hình thức hát đối đáp chỉ sử dụng trong đám cưới giữa đại diện hai họ.' }
  ];

  var qIdx = 0, qScore = 0, qAnswered = false;

  function startQuiz() {
    qIdx = 0; qScore = 0; qAnswered = false;
    var qbox = document.getElementById('qbox');
    var qend = document.getElementById('qend');
    if (qbox) qbox.style.display = 'block';
    if (qend) qend.style.display = 'none';
    renderQ();
  }

  function renderQ() {
    var d = quizData[qIdx];
    var pf = document.getElementById('qpf');
    var cnt = document.getElementById('qcnt');
    var sc = document.getElementById('qscore');
    var qq = document.getElementById('qq');
    var qopts = document.getElementById('qopts');
    var qfb = document.getElementById('qfb');
    var qnbtn = document.getElementById('qnbtn');
    if (pf) pf.style.width = ((qIdx / quizData.length) * 100) + '%';
    if (cnt) cnt.textContent = 'Câu ' + (qIdx + 1) + ' / ' + quizData.length;
    if (sc) sc.textContent = '🏆 ' + qScore + ' điểm';
    if (qq) qq.textContent = d.q;
    var letters = ['A', 'B', 'C', 'D'];
    if (qopts) {
      qopts.innerHTML = '';
      d.opts.forEach(function (opt, i) {
        var btn = document.createElement('button');
        btn.className = 'qopt';
        btn.innerHTML = '<span class="qol">' + letters[i] + '</span>' + opt;
        btn.addEventListener('click', function () { answerQ(i); });
        qopts.appendChild(btn);
      });
    }
    if (qfb) { qfb.style.display = 'none'; qfb.className = 'qfb'; qfb.textContent = ''; }
    if (qnbtn) qnbtn.style.display = 'none';
    qAnswered = false;
  }

  function answerQ(idx) {
    if (qAnswered) return;
    qAnswered = true;
    var d = quizData[qIdx];
    var opts = document.querySelectorAll('.qopt');
    var qfb = document.getElementById('qfb');
    var qnbtn = document.getElementById('qnbtn');
    var sc = document.getElementById('qscore');
    opts.forEach(function (o) { o.disabled = true; });
    if (idx === d.ans) {
      qScore++;
      opts[idx].classList.add('correct');
      if (qfb) { qfb.className = 'qfb ok'; qfb.textContent = d.fb; qfb.style.display = 'block'; }
    } else {
      opts[idx].classList.add('wrong');
      if (opts[d.ans]) opts[d.ans].classList.add('correct');
      if (qfb) { qfb.className = 'qfb no'; qfb.textContent = '❌ Chưa đúng! ' + d.fb.replace('✅', '💡'); qfb.style.display = 'block'; }
    }
    if (qnbtn) qnbtn.style.display = 'inline-flex';
    if (sc) sc.textContent = '🏆 ' + qScore + ' điểm';
  }

  window.nextQ = function () {
    qIdx++;
    if (qIdx >= quizData.length) showResult();
    else renderQ();
  };

  function showResult() {
    var pf = document.getElementById('qpf');
    var qbox = document.getElementById('qbox');
    var qend = document.getElementById('qend');
    if (pf) pf.style.width = '100%';
    if (qbox) qbox.style.display = 'none';
    if (qend) qend.style.display = 'block';
    var pct = Math.round((qScore / quizData.length) * 100);
    var msgs = [
      { min: 8, msg: '🎉 Xuất sắc! Bạn là chuyên gia về dân tộc Tày!', sub: 'Bạn đã trả lời đúng tất cả câu hỏi. Kiến thức văn hóa của bạn thật ấn tượng!' },
      { min: 6, msg: '🌟 Rất giỏi! Bạn hiểu khá sâu về văn hóa Tày!', sub: 'Bạn đạt ' + pct + '%. Hãy đọc thêm để trở thành chuyên gia nhé!' },
      { min: 4, msg: '📚 Khá tốt! Hãy tiếp tục khám phá!', sub: 'Bạn đạt ' + pct + '%. Còn nhiều điều thú vị đang chờ bạn!' },
      { min: 0, msg: '🔍 Hãy đọc kỹ hơn và thử lại nhé!', sub: 'Bạn đạt ' + pct + '%. Trang web có rất nhiều thông tin hay đang chờ!' }
    ];
    var result = msgs.find(function (m) { return qScore >= m.min; }) || msgs[msgs.length - 1];
    var qfinal = document.getElementById('qfinal');
    var qmsg = document.getElementById('qmsg');
    var qsub = document.getElementById('qsub');
    if (qfinal) qfinal.textContent = qScore + ' / ' + quizData.length;
    if (qmsg) qmsg.textContent = result.msg;
    if (qsub) qsub.textContent = result.sub;
    if (qScore === quizData.length) launchConfetti();
  }

  window.startQuiz = startQuiz;

  function launchConfetti() {
    var colors = ['#d4a843', '#f5d07a', '#1a7a5e', '#5dd4a8', '#c0392b', '#fff'];
    for (var i = 0; i < 80; i++) {
      (function (i) {
        setTimeout(function () {
          var el = document.createElement('div');
          el.className = 'conf';
          el.style.cssText = 'left:' + (Math.random() * 100) + 'vw;top:-10px;' +
            'background:' + colors[Math.floor(Math.random() * colors.length)] + ';' +
            'transform:rotate(' + (Math.random() * 360) + 'deg);' +
            'animation-duration:' + (2 + Math.random() * 2) + 's;' +
            'animation-delay:' + (Math.random() * 0.5) + 's;' +
            'width:' + (6 + Math.random() * 8) + 'px;height:' + (6 + Math.random() * 8) + 'px;';
          document.body.appendChild(el);
          setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 4000);
        }, i * 30);
      })(i);
    }
  }

  // Init quiz on load
  startQuiz();

  /* ===== 18. LAZY LOADING IMAGES ===== */
  document.querySelectorAll('img:not([loading])').forEach(function (img) {
    img.setAttribute('loading', 'lazy');
  });

  /* ===== 19. CARD GLOW FOLLOW ===== */
  document.querySelectorAll('.card,.fc,.rc,.celeb-card,.celeb-featured').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  });

  /* ===== 20. DETAIL MODAL ===== */
  var detailData = {
    /* === 1. DÂN SỐ & PHÂN BỐ === */
    cutru: {
      title: 'Đặc điểm cư trú của người Tày',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Nh%C3%A0_ng%C6%B0%E1%BB%9Di_T%C3%A0y_%28%C4%90%E1%BB%8Bnh_H%C3%B3a_-_Th%C3%A1i_Nguy%C3%AAn%29.jpg/600px-Nh%C3%A0_ng%C6%B0%E1%BB%9Di_T%C3%A0y_%28%C4%90%E1%BB%8Bnh_H%C3%B3a_-_Th%C3%A1i_Nguy%C3%AAn%29.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Pac_Ngoi_homestay.JPG/600px-Pac_Ngoi_homestay.JPG',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pac_Ngoi_rice_field.JPG/600px-Pac_Ngoi_rice_field.JPG'
      ],
      text: '<p>Người Tày định cư chủ yếu ở vùng miền núi thấp, dọc theo các thung lũng màu mỡ và ven bờ suối, sông. Bản làng thường được xây dựng tựa lưng vào chân núi, mặt hướng ra cánh đồng — thuận lợi cho canh tác lúa nước.</p><p><strong>Đặc điểm nổi bật:</strong></p><ul><li>Thung lũng hẹp ven sông suối là nơi lý tưởng</li><li>Bản làng 15–20 nóc nhà sàn, tên theo địa danh tự nhiên</li><li>Hệ thống thủy lợi: mương, máng, phai, cọn nước — trí tuệ kỹ thuật lâu đời</li><li>Chợ phiên biên giới sầm uất — trung tâm giao thương và giao lưu văn hóa</li><li>Hiện diện tại <strong>63/63 tỉnh thành</strong>, tập trung đông nhất ở Lạng Sơn, Cao Bằng, Tuyên Quang, Hà Giang, Bắc Kạn</li></ul>',
      sources: [
        { label: 'Wikipedia – Người Tày', url: 'https://vi.wikipedia.org/wiki/Ng%C6%B0%E1%BB%9Di_T%C3%A0y' },
        { label: 'Ủy ban Dân tộc', url: 'http://www.cema.gov.vn/gioi-thieu/cong-dong-54-dan-toc/nguoi-tay.htm' }
      ]
    },
    dicu: {
      title: 'Mô hình di cư của người Tày',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pac_Ngoi_rice_field.JPG/600px-Pac_Ngoi_rice_field.JPG',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tay_Women.jpg/600px-Tay_Women.jpg'
      ],
      text: '<p>Lịch sử di cư của người Tày trải dài hàng ngàn năm, từ vùng Quảng Tây (Trung Quốc) đến miền Đông Bắc Việt Nam.</p><p><strong>Các giai đoạn chính:</strong></p><ul><li><strong>Thiên niên kỷ 1 TCN:</strong> Tổ tiên thuộc nhóm Austro-Tai di cư từ miền Nam Trung Quốc</li><li><strong>TK XI–XII:</strong> Định cư và hình thành cộng đồng lớn tại vùng Đông Bắc</li><li><strong>TK XVI (Nhà Mạc):</strong> Lan tỏa từ Cao Bằng khắp vùng Đông Bắc</li><li><strong>Sau 1954:</strong> Di cư đến Tây Nguyên, Đông Nam Bộ theo chính sách kinh tế mới</li><li><strong>Hiện đại:</strong> Di cư đô thị — về Hà Nội, Thái Nguyên để học tập, làm việc</li></ul><p>Dù di cư, người Tày luôn duy trì mối liên hệ văn hóa với quê hương.</p>',
      sources: [
        { label: 'DNU Library', url: 'https://dnulib.edu.vn/dan-toc-tay-o-dau/' },
        { label: 'Báo Nhân Dân', url: 'https://nhandan.vn/dan-toc-tay-post723931.html' }
      ]
    },
    kinhte: {
      title: 'Kinh tế – Xã hội dân tộc Tày',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pac_Ngoi_rice_field.JPG/600px-Pac_Ngoi_rice_field.JPG',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Pac_Ngoi_homestay.JPG/600px-Pac_Ngoi_homestay.JPG'
      ],
      text: '<p>Người Tày có trình độ phát triển kinh tế-xã hội tương đối cao trong các dân tộc thiểu số Việt Nam.</p><p><strong>Các chỉ số nổi bật (2019):</strong></p><ul><li>Tỷ lệ biết chữ: <strong>94,9%</strong> — cao nhất trong các DTTS</li><li>Trẻ đi học tiểu học: <strong>100,4%</strong></li><li>Trẻ đi học THCS: <strong>97,5%</strong></li><li>Thu nhập bình quân hộ: cao hơn mức trung bình các DTTS</li></ul><p><strong>Ngành kinh tế chủ lực:</strong></p><ul><li>Nông nghiệp lúa nước thâm canh</li><li>Kinh tế vườn rừng: hồi, quế, cây ăn quả</li><li>Du lịch homestay phát triển mạnh (Ba Bể, Hà Giang, Lạng Sơn)</li><li>Chợ phiên biên giới — giao thương truyền thống</li></ul>',
      sources: [
        { label: 'Báo Nhân Dân', url: 'https://nhandan.vn/dan-toc-tay-post723931.html' },
        { label: 'Sở DT Hà Nội', url: 'https://sodantoctongiao.hanoi.gov.vn/articles/3380' },
        { label: 'Tổng cục Thống kê', url: 'https://www.gso.gov.vn/' }
      ]
    },

    /* === 2. LỊCH SỬ === */
    'vung-tai': {
      title: 'Vùng liên tục ngôn ngữ Tai',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tay_Women.jpg/600px-Tay_Women.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Then_Singing.JPG/600px-Then_Singing.JPG'
      ],
      text: '<p>Người Tày thuộc nhóm ngôn ngữ Tai–Kadai — một trong những ngữ hệ lớn nhất Đông Nam Á, trải dài từ miền Nam Trung Quốc xuống Thái Lan, Lào, Myanmar và Việt Nam.</p><p><strong>Các dân tộc anh em cùng hệ:</strong></p><ul><li><strong>Người Nùng (Việt Nam):</strong> Gần gũi nhất về ngôn ngữ và văn hóa</li><li><strong>Người Choang/Zhuang (Trung Quốc):</strong> ~18 triệu người — dân tộc thiểu số đông nhất TQ</li><li><strong>Người Thái (Thái Lan, Lào):</strong> Cùng tổ tiên Tai nguyên thủy</li></ul><p>Mối liên hệ này tạo nên một vùng liên tục văn hóa Tai phong phú, thể hiện qua ngôn ngữ, tín ngưỡng, kiến trúc nhà sàn và nghệ thuật dân ca.</p>',
      sources: [
        { label: 'Wikipedia – Người Tày', url: 'https://vi.wikipedia.org/wiki/Ng%C6%B0%E1%BB%9Di_T%C3%A0y' },
        { label: 'Wikipedia – Tai peoples', url: 'https://en.wikipedia.org/wiki/Tai_peoples' }
      ]
    },
    tuongtac: {
      title: 'Tương tác lịch sử',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Dong_Son_Bronze_Drum_19.jpg/600px-Dong_Son_Bronze_Drum_19.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tay_Women.jpg/600px-Tay_Women.jpg'
      ],
      text: '<p>Lịch sử người Tày đan xen sâu sắc với lịch sử Việt Nam qua nhiều thế kỷ, từ thời phong kiến, thuộc địa đến hiện đại.</p><p><strong>Các giai đoạn tương tác quan trọng:</strong></p><ul><li><strong>Thời phong kiến:</strong> Chế độ phiên thần tự trị — người Tày cung cấp binh lính và nông sản cho triều đình</li><li><strong>Thời thuộc địa Pháp:</strong> Vùng Đông Bắc là cứ địa kháng chiến, người Tày tham gia mạnh mẽ</li><li><strong>Kháng chiến chống Pháp:</strong> Chiến khu Việt Bắc là trung tâm cách mạng — ATK (An Toàn Khu) tại vùng Tày</li><li><strong>Kháng chiến chống Mỹ:</strong> Đóng góp nhân lực và vật lực</li><li><strong>Sau 1975:</strong> Chính sách dân tộc thiểu số bảo tồn và phát triển</li></ul>',
      sources: [
        { label: 'Văn hoá tâm linh', url: 'https://vanhoatamlinh.com/dan-toc-tay/' },
        { label: 'Wikipedia', url: 'https://vi.wikipedia.org/wiki/Ng%C6%B0%E1%BB%9Di_T%C3%A0y' }
      ]
    },
    thichnghi: {
      title: 'Thích nghi & Hiện đại hóa',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Pac_Ngoi_homestay.JPG/600px-Pac_Ngoi_homestay.JPG',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pac_Ngoi_rice_field.JPG/600px-Pac_Ngoi_rice_field.JPG'
      ],
      text: '<p>Người Tày nổi bật với khả năng cân bằng giữa hiện đại hóa và bảo tồn truyền thống — một bài học quý giá cho các cộng đồng dân tộc thiểu số.</p><p><strong>Những điểm sáng thích nghi:</strong></p><ul><li><strong>Du lịch homestay:</strong> Mô hình Pắc Ngòi (Ba Bể, Bắc Kạn) trở thành điểm sáng du lịch cộng đồng quốc tế. Du khách trải nghiệm nhà sàn, ẩm thực và nghệ thuật Tày</li><li><strong>Nông nghiệp hiện đại:</strong> Áp dụng kỹ thuật mới nhưng vẫn giữ ruộng bậc thang truyền thống</li><li><strong>Bảo tồn Then:</strong> UNESCO ghi danh 2019 → tạo động lực mạnh cho bảo tồn Hát Then</li><li><strong>Giáo dục:</strong> Tỷ lệ biết chữ 94,9% — cao nhất trong các DTTS</li></ul>',
      sources: [
        { label: 'Báo Nhân Dân', url: 'https://nhandan.vn/dan-toc-tay-post723931.html' },
        { label: 'DNU Library', url: 'https://dnulib.edu.vn/dan-toc-tay-o-dau/' }
      ]
    },

    /* === 3. NGÔN NGỮ === */
    hatthen: {
      title: 'Hát Then – Di sản Văn hóa Phi vật thể UNESCO',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Then_Singing.JPG/600px-Then_Singing.JPG',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Ba-Be-Lake-_Then-singing.jpg/600px-Ba-Be-Lake-_Then-singing.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Dan_Tinh_lute_from_Vietnam.jpg/600px-Dan_Tinh_lute_from_Vietnam.jpg'
      ],
      text: '<p>Hát Then là linh hồn văn hóa dân tộc Tày, được UNESCO ghi danh là Di sản Văn hóa Phi vật thể Đại diện của Nhân loại vào ngày <strong>12/12/2019</strong>.</p><p><strong>Đặc điểm nổi bật:</strong></p><ul><li>Kết hợp <strong>hát, múa và đàn tính</strong> — tạo nên tổng thể nghệ thuật hoàn chỉnh</li><li>Nghi lễ tâm linh: cầu an, giải hạn, chữa bệnh, cầu mùa, gọi hồn</li><li>Kể chuyện thần thoại: hành trình của linh hồn qua 3 cõi (trời, đất, nước)</li><li>Then Tậc (nam) và Mè Then (nữ) đóng vai người trung gian thần–người</li></ul><p><strong>Tại sao quan trọng?</strong> Hát Then không chỉ là nghệ thuật — đó là cầu nối giữa con người với thế giới thần linh, là bản sắc sâu nhất của dân tộc Tày, Nùng, Thái.</p>',
      sources: [
        { label: 'UNESCO ICH', url: 'https://ich.unesco.org/en/RL/practices-related-to-the-then-of-tay-nung-and-thai-people-01570' },
        { label: 'Báo Nhân Dân', url: 'https://nhandan.vn/dan-toc-tay-post723931.html' },
        { label: 'Văn hoá tín ngưỡng', url: 'https://vanhoatinnguong.vn/bai-viet/tin-nguong-then-cua-nguoi-dan-toc-tay-nung-8297.html' }
      ]
    },
    truyenmieng: {
      title: 'Kho tàng truyền miệng phong phú',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Ba-Be-Lake-_Then-singing.jpg/600px-Ba-Be-Lake-_Then-singing.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tay_Women.jpg/600px-Tay_Women.jpg'
      ],
      text: '<p>Văn học truyền miệng của người Tày là một kho tàng đồ sộ, phong phú nhất trong các dân tộc thiểu số Việt Nam.</p><p><strong>Các thể loại chính:</strong></p><ul><li><strong>Truyện cổ tích & thần thoại:</strong> Giải thích nguồn gốc vũ trụ, con người, phong tục</li><li><strong>Sử thi:</strong> Kể về các anh hùng và sự kiện lịch sử cộng đồng</li><li><strong>Tục ngữ & câu đố:</strong> Triết lý sống, kinh nghiệm nông nghiệp, ứng xử xã hội</li><li><strong>Lượn cọi:</strong> Hát giao duyên nam-nữ trong lễ hội đầu xuân, đám cưới, mừng nhà mới</li><li><strong>Hát Quan lang:</strong> Hát đối đáp giữa hai họ trong đám cưới — chỉ dành riêng cho nghi lễ cưới xin</li><li><strong>Hát ru:</strong> Ru con ngủ, truyền tải tình yêu thương và giáo dục đầu đời</li><li><strong>Hát tang lễ:</strong> Tiễn đưa linh hồn qua các cửa ải về mường Trời</li></ul>',
      sources: [
        { label: 'Báo Thái Nguyên', url: 'https://bbk.baothainguyen.vn/luon-coi-di-san-van-hoa-phi-vat-the-dac-sac-cua-dong-bao-tay-post22370.html' },
        { label: 'Báo Nhân Dân', url: 'https://nhandan.vn/dan-toc-tay-post723931.html' }
      ]
    },
    dantinh: {
      title: 'Đàn Tính – Nhạc cụ linh hồn dân tộc Tày',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Dan_Tinh_lute_from_Vietnam.jpg/600px-Dan_Tinh_lute_from_Vietnam.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Then_Singing.JPG/600px-Then_Singing.JPG'
      ],
      text: '<p>Đàn Tính (Tính tẩu) là nhạc cụ đặc trưng nhất của người Tày — linh hồn của Hát Then và mọi sinh hoạt văn hóa tâm linh.</p><p><strong>Cấu tạo:</strong></p><ul><li><strong>Bầu đàn:</strong> Làm từ quả bầu khô, tạo âm vang đặc trưng</li><li><strong>Cần đàn:</strong> Gỗ sa mộc hoặc gỗ dâu, dài khoảng 1m</li><li><strong>Dây đàn:</strong> 2–3 dây tơ tằm (nay thay bằng dây nilon)</li><li><strong>Phím:</strong> 10–12 phím, tạo nên thang âm ngũ cung</li></ul><p><strong>Vai trò:</strong></p><ul><li>Đệm Hát Then trong mọi nghi lễ tâm linh</li><li>Đệm lượn cọi, hát giao duyên</li><li>Biểu diễn độc lập tại lễ hội</li><li>Truyền tải thần thoại, tín ngưỡng và lịch sử qua âm nhạc</li></ul>',
      sources: [
        { label: 'Wikipedia – Đàn tính', url: 'https://vi.wikipedia.org/wiki/%C4%90%C3%A0n_t%C3%ADnh' },
        { label: 'Ban Dân tộc TW', url: 'https://bdttg.gov.vn/gioi-thieu/cong-dong-54-dan-toc/nguoi-tay.htm' }
      ]
    },

    /* === 4. VĂN HÓA – Cuộc sống === */
    giadinh: {
      title: 'Cấu trúc gia đình người Tày',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Nh%C3%A0_ng%C6%B0%E1%BB%9Di_T%C3%A0y_%28%C4%90%E1%BB%8Bnh_H%C3%B3a_-_Th%C3%A1i_Nguy%C3%AAn%29.jpg/600px-Nh%C3%A0_ng%C6%B0%E1%BB%9Di_T%C3%A0y_%28%C4%90%E1%BB%8Bnh_H%C3%B3a_-_Th%C3%A1i_Nguy%C3%AAn%29.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tay_Women.jpg/600px-Tay_Women.jpg'
      ],
      text: '<p>Gia đình người Tày theo chế độ phụ hệ, đa thế hệ cùng chung sống trong một mái nhà sàn.</p><p><strong>Đặc điểm:</strong></p><ul><li>Gia đình 3–4 thế hệ sống chung: ông bà, cha mẹ, con cái</li><li>Nam giới quyết định việc lớn; nữ giới quản lý kinh tế hộ</li><li>Phụ nữ Tày nổi tiếng dệt thổ cẩm và nhuộm vải chàm</li><li>Con trai cả thường ở lại nhà bố mẹ, thờ phụng tổ tiên</li><li>Bàn thờ tổ tiên đặt ở gian giữa — nơi trang trọng nhất nhà sàn</li></ul><p>Gia đình là nền tảng xã hội, nơi truyền dạy ngôn ngữ, phong tục, và nghề truyền thống.</p>',
      sources: [
        { label: 'Ủy ban Dân tộc', url: 'http://www.cema.gov.vn/gioi-thieu/cong-dong-54-dan-toc/nguoi-tay.htm' },
        { label: 'Sở DT Hà Nội', url: 'https://sodantoctongiao.hanoi.gov.vn/articles/3380' }
      ]
    },
    honnhan: {
      title: 'Nghi thức hôn nhân truyền thống',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tay_Women.jpg/600px-Tay_Women.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Ba-Be-Lake-_Then-singing.jpg/600px-Ba-Be-Lake-_Then-singing.jpg'
      ],
      text: '<p>Hôn nhân người Tày tuân theo nhiều nghi lễ truyền thống phong phú, thể hiện sự trọng thị và văn minh.</p><p><strong>Các bước chính:</strong></p><ul><li><strong>So tuổi (Xem lá số):</strong> Nhà trai xin lá số xem có hợp tuổi không — bước quyết định ban đầu</li><li><strong>Dạm ngõ:</strong> Nhà trai mang lễ vật đến nhà gái đặt vấn đề</li><li><strong>Ăn hỏi:</strong> Lễ lớn: bánh chưng, thịt lợn, rượu, tiền mặt</li><li><strong>Lễ cưới & Hát Quan lang:</strong> Đại diện hai họ hát đối đáp (Quan lang) để đón dâu — đây là nghi thức độc đáo nhất</li><li><strong>Đón dâu:</strong> Dâu phải bước qua than lửa trước khi vào nhà chồng — xua đuổi tà khí</li><li><strong>Ba ngày về nhà:</strong> Ba ngày sau cưới, cô dâu về thăm bố mẹ đẻ</li></ul>',
      sources: [
        { label: 'Báo Nhân Dân', url: 'https://nhandan.vn/dan-toc-tay-post723931.html' },
        { label: 'Văn hoá tâm linh', url: 'https://vanhoatamlinh.com/dan-toc-tay/' }
      ]
    },

    /* === 4. VĂN HÓA – Lễ hội === */
    longtong: {
      title: 'Lễ hội Lồng Tổng – Lễ xuống đồng',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pac_Ngoi_rice_field.JPG/600px-Pac_Ngoi_rice_field.JPG',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Ba-Be-Lake-_Then-singing.jpg/600px-Ba-Be-Lake-_Then-singing.jpg'
      ],
      text: '<p>Lồng Tổng (nghĩa là "xuống đồng") là lễ hội lớn nhất và quan trọng nhất của dân tộc Tày, tổ chức vào đầu xuân sau Tết Nguyên Đán.</p><p><strong>Ý nghĩa:</strong> Khởi đầu vụ mùa mới, cầu nguyện mưa thuận gió hòa, mùa màng bội thu.</p><p><strong>Các hoạt động:</strong></p><ul><li><strong>Cày luống đầu tiên:</strong> Người cao tuổi đức độ nhất được chọn cày — tượng trưng cho khởi đầu tốt lành</li><li><strong>Tung còn:</strong> Ném quả còn qua vòng tròn — cầu may mắn, mùa màng</li><li><strong>Chọi gà, đấu vật:</strong> Các trò chơi dân gian truyền thống</li><li><strong>Hát lượn giao duyên:</strong> Nam nữ hát đối đáp trong không khí lễ hội</li><li><strong>Đàn tính & Hát Then:</strong> Biểu diễn nghệ thuật tâm linh</li></ul><p>Lồng Tổng là dịp gắn kết cộng đồng, bảo tồn văn hóa và đánh dấu vòng quay nông nghiệp.</p>',
      sources: [
        { label: 'Wikipedia – Lồng Tổng', url: 'https://vi.wikipedia.org/wiki/L%E1%BB%93ng_t%E1%BB%95ng' },
        { label: 'Báo Nhân Dân', url: 'https://nhandan.vn/dan-toc-tay-post723931.html' }
      ]
    },
    nanghai: {
      title: 'Lễ hội Nàng Hai – Tín ngưỡng thờ Nàng Trăng',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Then_Singing.JPG/600px-Then_Singing.JPG',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tay_Women.jpg/600px-Tay_Women.jpg'
      ],
      text: '<p>Lễ hội Nàng Hai là lễ cầu mùa đặc sắc của người Tày tại Quảng Uyên, Phục Hòa, Hạ Lang (Cao Bằng).</p><p><strong>Đặc điểm:</strong></p><ul><li>Gắn liền với tín ngưỡng <strong>thờ Nàng Trăng</strong> — vị thần bảo hộ mùa màng</li><li>Diễn ra vào tháng Giêng, kéo dài từ 1–3 đêm</li><li>Nghi lễ tâm linh sâu sắc: gọi Nàng Hai từ trời xuống đồng</li><li>Các cô gái trẻ đóng vai Nàng Hai, nhập vai vào thần linh</li><li>Hát xướng, múa thiêng — cầu cho mưa thuận gió hòa</li></ul><p>Đây là một trong những lễ hội còn giữ được nhiều yếu tố nguyên thủy nhất của tín ngưỡng nông nghiệp Tày.</p>',
      sources: [
        { label: 'Văn hoá tín ngưỡng', url: 'https://vanhoatinnguong.vn/bai-viet/tin-nguong-then-cua-nguoi-dan-toc-tay-nung-8297.html' },
        { label: 'Wikipedia', url: 'https://vi.wikipedia.org/wiki/Ng%C6%B0%E1%BB%9Di_T%C3%A0y' }
      ]
    },
    capsac: {
      title: 'Lễ Then & Lễ Cấp Sắc',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Then_Singing.JPG/600px-Then_Singing.JPG',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Dan_Tinh_lute_from_Vietnam.jpg/600px-Dan_Tinh_lute_from_Vietnam.jpg'
      ],
      text: '<p>Hai nghi lễ thiêng liêng nhất trong đời sống tâm linh người Tày.</p><p><strong>Lễ Then:</strong></p><ul><li>Nghi lễ kết hợp hát, múa và đàn tính — tổng hợp nghệ thuật tâm linh hoàn chỉnh</li><li>Mục đích: cầu an, giải hạn, chữa bệnh, cầu mùa</li><li>Then Tậc (Then nam) và Mè Then (Then nữ) thực hiện</li><li>Hành trình linh hồn qua 3 cõi: mường Đất → mường Nước → mường Trời</li><li>UNESCO ghi danh Di sản nhân loại năm 2019</li></ul><p><strong>Lễ Cấp Sắc:</strong></p><ul><li>Nghi lễ phong sắc cho người hành nghề mo, then, tào đã trưởng thành</li><li>Giống như "lễ tốt nghiệp" của thầy cúng — chứng nhận đủ trình độ hành nghề</li><li>Kéo dài từ 1–3 ngày, tốn kém và trang trọng</li><li>Có sự chứng kiến của cả cộng đồng</li></ul>',
      sources: [
        { label: 'UNESCO ICH', url: 'https://ich.unesco.org/en/RL/practices-related-to-the-then-of-tay-nung-and-thai-people-01570' },
        { label: 'Văn hoá tín ngưỡng', url: 'https://vanhoatinnguong.vn/bai-viet/tin-nguong-then-cua-nguoi-dan-toc-tay-nung-8297.html' }
      ]
    },

    /* === 4. ẨM THỰC === */
    xoi: {
      title: 'Xôi ngũ sắc – Biểu tượng ngũ hành',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/X%C3%B4i_ng%C5%A9_s%E1%BA%AFc.JPG/600px-X%C3%B4i_ng%C5%A9_s%E1%BA%AFc.JPG'
      ],
      text: '<p>Xôi ngũ sắc là món ăn mang đậm triết lý ngũ hành của người Tày — không thể thiếu trong dịp Tết, lễ hội, đám cưới và cúng tổ tiên.</p><p><strong>Năm màu tượng trưng:</strong></p><ul><li><strong>Đỏ:</strong> Nhuộm từ gấc hoặc lá cẩm đỏ → Hỏa</li><li><strong>Vàng:</strong> Nhuộm từ nghệ → Thổ</li><li><strong>Xanh/Tím:</strong> Nhuộm từ hoa đậu biếc hoặc lá cẩm tím → Mộc</li><li><strong>Trắng:</strong> Gạo nếp nguyên → Kim</li><li><strong>Đen:</strong> Nhuộm từ tro bếp hoặc lá cẩm đen → Thủy</li></ul><p>Gạo nếp phải là nếp cái hoa vàng — hạt tròn, dẻo, thơm đặc trưng. Xôi được đồ bằng chõ gỗ truyền thống.</p>',
      sources: [
        { label: 'Văn hoá Nghệ thuật', url: 'https://vanhoanghethuat.vn/am-thuc-nguoi-tay-di-san-van-hoa-song-dong-2025-77760049.html' }
      ]
    },
    vitquay: {
      title: 'Vịt quay mắc mật – Đặc sản nổi tiếng nhất',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Roasted_Peking_Duck_with_Vegetables_Meal.jpg/600px-Roasted_Peking_Duck_with_Vegetables_Meal.jpg'
      ],
      text: '<p>Vịt quay mắc mật là đặc sản được mệnh danh là "hương vị núi rừng" — biểu tượng ẩm thực nổi tiếng nhất vùng Đông Bắc.</p><p><strong>Cách chế biến:</strong></p><ul><li><strong>Nguyên liệu:</strong> Vịt bầu cỏ (vịt nuôi thả tự nhiên, thịt chắc, ít mỡ)</li><li><strong>Ướp:</strong> Lá mắc mật tươi nhồi vào bụng — tạo hương thơm nồng nàn đặc trưng</li><li><strong>Quay:</strong> Quay trên than hoa, phết mật ong ngoài da — da giòn rụm, vàng ươm</li><li><strong>Đặc trưng:</strong> Vị chua nhẹ từ mắc mật + ngọt từ mật ong + thơm từ lá rừng</li></ul><p>Lá mắc mật chỉ mọc ở vùng núi đá vôi Đông Bắc — không nơi nào khác có thể tạo ra hương vị này.</p>',
      sources: [
        { label: 'Văn hoá Nghệ thuật', url: 'https://vanhoanghethuat.vn/am-thuc-nguoi-tay-di-san-van-hoa-song-dong-2025-77760049.html' },
        { label: 'Studocu', url: 'https://www.studocu.vn/vn/document/truong-dai-hoc-giao-thong-van-tai/kinh-te-chinh-tri-maclenin/am-thuc-cua-nguoi-tay-vnjvwvnwn/74326964' }
      ]
    },
    khaunhuc: {
      title: 'Khâu nhục – Món ăn truyền thống trong lễ trọng',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/BraisedPorkBelly.JPG/600px-BraisedPorkBelly.JPG'
      ],
      text: '<p>Khâu nhục (từ tiếng Tày "khấu nhục" — thịt mỡ) là món ăn không thể thiếu trong đám cưới và lễ trọng đại của người Tày.</p><p><strong>Cách làm:</strong></p><ul><li>Chọn thịt ba chỉ ngon, luộc sơ, rồi chiên vàng</li><li>Ướp với ngũ vị hương, tương bần, mật ong</li><li>Xếp vào bát cùng gia vị, hấp cách thủy 5–8 tiếng</li><li>Thịt mềm tan, béo ngậy, thấm đẫm gia vị</li></ul><p>Khâu nhục thể hiện sự cầu kỳ và trang trọng trong ẩm thực Tày — chỉ xuất hiện trong dịp lễ hội, đám cưới, tiếp khách quý.</p>',
      sources: [
        { label: 'Văn hoá Nghệ thuật', url: 'https://vanhoanghethuat.vn/am-thuc-nguoi-tay-di-san-van-hoa-song-dong-2025-77760049.html' }
      ]
    },
    banhchung: {
      title: 'Bánh chưng đen – Biểu tượng Tết của người Tày',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Banh_Chung_in_Vietnam.jpg/600px-Banh_Chung_in_Vietnam.jpg'
      ],
      text: '<p>Bánh chưng đen là phiên bản độc đáo của bánh chưng Việt Nam — biểu tượng Tết thiêng liêng nhất của người Tày.</p><p><strong>Đặc biệt ở đâu?</strong></p><ul><li><strong>Màu đen bí ẩn:</strong> Gạo nếp trộn tro bếp (từ cây núc nác hoặc rơm nếp) — tạo màu đen tuyền</li><li><strong>Nhân:</strong> Đỗ xanh + thịt lợn ba chỉ ướp gia vị truyền thống</li><li><strong>Gói:</strong> Lá dong hoặc lá chuối, buộc dây giang</li><li><strong>Ý nghĩa:</strong> Tro bếp tượng trưng cho bếp lửa gia đình — nơi ấm áp, sum vầy</li></ul><p>Bánh chưng đen luôn có trên bàn thờ tổ tiên vào dịp Tết — biểu tượng lòng biết ơn cội nguồn.</p>',
      sources: [
        { label: 'Văn hoá Nghệ thuật', url: 'https://vanhoanghethuat.vn/am-thuc-nguoi-tay-di-san-van-hoa-song-dong-2025-77760049.html' }
      ]
    },
    canuong: {
      title: 'Cá suối nướng – Hương vị vùng cao',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/C%C3%A1_l%C3%B3c_n%C6%B0%E1%BB%9Bng_trui.JPG/600px-C%C3%A1_l%C3%B3c_n%C6%B0%E1%BB%9Bng_trui.JPG'
      ],
      text: '<p>Cá suối nướng than hoa là món ăn thường nhật mang hương vị tinh túy của núi rừng Đông Bắc.</p><p><strong>Cách chế biến:</strong></p><ul><li>Cá suối tươi bắt từ khe suối vùng cao — thịt trắng, ngọt tự nhiên</li><li>Ướp hạt <strong>mắc khén</strong> (tiêu rừng) và lá rừng thơm</li><li>Kẹp que tre nướng than hoa — giữ nguyên vị ngọt tự nhiên</li><li>Ăn kèm xôi nếp, rau rừng và tương ớt</li></ul><p>Hạt mắc khén là gia vị đặc biệt nhất — có vị tê the, cay nhẹ, thơm nồng, chỉ mọc ở vùng núi cao trên 800m.</p>',
      sources: [
        { label: 'Văn hoá Nghệ thuật', url: 'https://vanhoanghethuat.vn/am-thuc-nguoi-tay-di-san-van-hoa-song-dong-2025-77760049.html' }
      ]
    },
    canhmang: {
      title: 'Canh măng rừng – Hương vị hàng ngày',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/TribalFood_BambooSoup.JPG/600px-TribalFood_BambooSoup.JPG'
      ],
      text: '<p>Măng rừng là nguyên liệu không thể thiếu trong bữa cơm hàng ngày của người Tày — gắn bó với núi rừng Đông Bắc.</p><p><strong>Các loại măng:</strong></p><ul><li><strong>Măng chua:</strong> Măng tre muối chua — nấu canh, xào thịt</li><li><strong>Măng đắng:</strong> Măng vầu non — luộc, chấm mắm tôm</li><li><strong>Măng khô:</strong> Phơi khô bảo quản qua mùa đông — nấu canh xương</li><li><strong>Măng tươi:</strong> Xào thịt bò, thịt trâu — giòn ngọt tự nhiên</li></ul><p>Người Tày có câu: "Bữa cơm không có măng như ngày không có nắng" — thể hiện vai trò quan trọng của măng trong đời sống.</p>',
      sources: [
        { label: 'Văn hoá Nghệ thuật', url: 'https://vanhoanghethuat.vn/am-thuc-nguoi-tay-di-san-van-hoa-song-dong-2025-77760049.html' }
      ]
    },
    thitmuoi: {
      title: 'Thịt lợn muối chua – Bảo quản truyền thống',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/RedCookedPorkBelly.jpg/600px-RedCookedPorkBelly.jpg'
      ],
      text: '<p>Thịt lợn muối chua là phương pháp bảo quản thực phẩm đặc trưng của người Tày qua mùa đông dài và lạnh.</p><p><strong>Cách làm:</strong></p><ul><li>Thịt lợn rọi hoặc nạc vai, thái miếng vừa ăn</li><li>Ướp muối, thính gạo rang vàng, gia vị rừng</li><li>Xếp vào ống tre hoặc vại sành, nén chặt</li><li>Lên men tự nhiên 7–15 ngày → vị chua đặc biệt</li></ul><p><strong>Ý nghĩa:</strong> Phản ánh trí tuệ bảo quản thực phẩm lâu đời, giúp người Tày vượt qua mùa đông khắc nghiệt khi thực phẩm khan hiếm.</p>',
      sources: [
        { label: 'Văn hoá Nghệ thuật', url: 'https://vanhoanghethuat.vn/am-thuc-nguoi-tay-di-san-van-hoa-song-dong-2025-77760049.html' }
      ]
    },
    pengkho: {
      title: 'Pẻng khô & Bún khô',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pac_Ngoi_rice_field.JPG/600px-Pac_Ngoi_rice_field.JPG'
      ],
      text: '<p>Pẻng khô và bún khô là hai sản phẩm chế biến từ gạo đặc sản — món quà quê của người Tày.</p><p><strong>Pẻng khô:</strong></p><ul><li>Làm từ gạo nếp, hấp chín, dập mỏng, phơi khô</li><li>Ăn giòn rụm khi nướng trên than hoa hoặc chiên giòn</li><li>Thường làm vào dịp Tết, lễ hội — đăi khách quý</li></ul><p><strong>Bún khô:</strong></p><ul><li>Gạo tẻ xay bột, tráng mỏng, thái sợi, phơi tự nhiên nhiều ngày</li><li>Dẻo dai, thơm gạo — khác biệt hoàn toàn với bún tươi</li><li>Bảo quản lâu, tiện dụng — mang theo khi đi rừng, đi nương</li></ul>',
      sources: [
        { label: 'Văn hoá Nghệ thuật', url: 'https://vanhoanghethuat.vn/am-thuc-nguoi-tay-di-san-van-hoa-song-dong-2025-77760049.html' }
      ]
    },

    /* === 5. XÃ HỘI === */
    sinhke: {
      title: 'Kinh tế & Sinh kế truyền thống',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pac_Ngoi_rice_field.JPG/600px-Pac_Ngoi_rice_field.JPG',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Pac_Ngoi_homestay.JPG/600px-Pac_Ngoi_homestay.JPG'
      ],
      text: '<p>Kinh tế người Tày nổi bật với hệ thống nông nghiệp lúa nước tiên tiến — là dân tộc thiểu số có kỹ thuật thâm canh lúa phát triển nhất.</p><p><strong>Các ngành kinh tế chính:</strong></p><ul><li><strong>Lúa nước:</strong> Ruộng bậc thang, thâm canh tăng vụ — kỹ thuật hàng ngàn năm</li><li><strong>Vườn rừng:</strong> Cọ, hồi, quế, chè, cây ăn quả — mang lại thu nhập bền vững</li><li><strong>Thủy lợi:</strong> Mương, máng, đắp phai, <strong>cọn nước</strong> — biểu tượng trí tuệ kỹ thuật</li><li><strong>Thủ công:</strong> Dệt thổ cẩm, đan lát tre nứa, nghề mộc, nhuộm chàm</li><li><strong>Chợ phiên biên giới:</strong> Giao thương sầm uất — nơi giao lưu văn hóa đa dân tộc</li><li><strong>Homestay:</strong> Mô hình du lịch cộng đồng phát triển mạnh gần đây</li></ul>',
      sources: [
        { label: 'Báo Nhân Dân', url: 'https://nhandan.vn/dan-toc-tay-post723931.html' },
        { label: 'Ủy ban Dân tộc', url: 'http://www.cema.gov.vn/gioi-thieu/cong-dong-54-dan-toc/nguoi-tay.htm' }
      ]
    },
    tochuc: {
      title: 'Tổ chức xã hội truyền thống',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Nh%C3%A0_ng%C6%B0%E1%BB%9Di_T%C3%A0y_%28%C4%90%E1%BB%8Bnh_H%C3%B3a_-_Th%C3%A1i_Nguy%C3%AAn%29.jpg/600px-Nh%C3%A0_ng%C6%B0%E1%BB%9Di_T%C3%A0y_%28%C4%90%E1%BB%8Bnh_H%C3%B3a_-_Th%C3%A1i_Nguy%C3%AAn%29.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tay_Women.jpg/600px-Tay_Women.jpg'
      ],
      text: '<p>Tổ chức xã hội người Tày có nền tảng từ chế độ <strong>Quằng</strong> — hệ thống phong kiến sơ kỳ đặc trưng.</p><p><strong>Chế độ Quằng:</strong></p><ul><li>Quằng = quý tộc thế tập, nắm quyền sở hữu đất đai, rừng, sông suối</li><li>Phong kiến sơ kỳ: Quằng → thổ ty → nông dân</li><li>Mỗi quằng cai quản một vùng đất nhất định</li></ul><p><strong>Bản làng:</strong></p><ul><li>Đơn vị cư trú: bản (15–20 nóc nhà, gia đình cùng dòng họ)</li><li>Tên bản theo địa danh tự nhiên (núi, suối, thung lũng)</li><li>Già làng/trưởng bản giải quyết tranh chấp, tổ chức lễ hội</li><li>Ngày nay: theo hệ thống luật pháp Nhà nước Việt Nam</li></ul>',
      sources: [
        { label: 'Ủy ban Dân tộc', url: 'http://www.cema.gov.vn/gioi-thieu/cong-dong-54-dan-toc/nguoi-tay.htm' },
        { label: 'Wikipedia', url: 'https://vi.wikipedia.org/wiki/Ng%C6%B0%E1%BB%9Di_T%C3%A0y' }
      ]
    },
    thachthuc: {
      title: 'Thách thức đương đại',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tay_Women.jpg/600px-Tay_Women.jpg'
      ],
      text: '<p>Bên cạnh nhiều thành tựu, dân tộc Tày đang đối mặt với những thách thức nghiêm trọng trong thời đại toàn cầu hóa.</p><p><strong>Các thách thức chính:</strong></p><ul><li><strong>Giáo dục:</strong> Học sinh vùng sâu, vùng xa phải đi đường xa, điều kiện cơ sở vật chất hạn chế</li><li><strong>Bất bình đẳng giới:</strong> Tư tưởng "trọng nam khinh nữ" vẫn tồn tại ở một số vùng</li><li><strong>Hạ tầng:</strong> Một số hộ chưa được dùng điện lưới, nước sạch đầy đủ</li><li><strong>Sinh kế:</strong> Phá rừng ảnh hưởng nguồn thu nhập rừng truyền thống</li><li><strong>Đồng hóa văn hóa:</strong> Đô thị hóa kéo người trẻ rời quê, mất dần bản sắc</li><li><strong>Ngôn ngữ mai một:</strong> Tỷ lệ biết chữ Tày chỉ ~5%, giới trẻ thiên về tiếng Việt</li></ul>',
      sources: [
        { label: 'Open Development', url: 'https://vietnam.opendevelopmentmekong.net/vi/topics/ethnic-minorities-and-indigenous-people/' },
        { label: 'Báo Quốc tế', url: 'https://en.baoquocte.vn/preserving-the-language-of-the-tay-and-nung-ethnic-groups-of-lang-son-248129.html' }
      ]
    },

    /* === 6. TÍN NGƯỠNG === */
    thocung: {
      title: 'Thờ cúng tổ tiên – Trụ cột tâm linh',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Outlook_of_stilt_house_in_Khe_Ran_village%2C_Con_Cuong%2C_Nghe_An%2C_Vietnam%E2%91%A0.jpg/600px-Outlook_of_stilt_house_in_Khe_Ran_village%2C_Con_Cuong%2C_Nghe_An%2C_Vietnam%E2%91%A0.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Nh%C3%A0_ng%C6%B0%E1%BB%9Di_T%C3%A0y_%28%C4%90%E1%BB%8Bnh_H%C3%B3a_-_Th%C3%A1i_Nguy%C3%AAn%29.jpg/600px-Nh%C3%A0_ng%C6%B0%E1%BB%9Di_T%C3%A0y_%28%C4%90%E1%BB%8Bnh_H%C3%B3a_-_Th%C3%A1i_Nguy%C3%AAn%29.jpg'
      ],
      text: '<p>Thờ cúng tổ tiên là một trong hai trụ cột tâm linh quan trọng nhất (cùng tín ngưỡng Then) của người Tày.</p><p><strong>Đặc điểm:</strong></p><ul><li><strong>Vị trí bàn thờ:</strong> Gian giữa nhà sàn — nơi trang trọng và thiêng liêng nhất</li><li><strong>Nghi thức:</strong> Cúng thiêng liêng trong mọi lễ vòng đời: đầy tháng, cưới hỏi, mừng thọ, tang ma</li><li><strong>Thời điểm:</strong> Ngày Tết, rằm, mùng một, giỗ chạp, ngày lễ lớn</li><li><strong>Lễ vật:</strong> Xôi ngũ sắc, gà luộc, rượu, bánh chưng đen, hoa quả</li><li><strong>Ý nghĩa:</strong> Duy trì kết nối con cháu với tổ tiên, cầu phúc lộc, bình an</li></ul>',
      sources: [
        { label: 'Văn hoá tín ngưỡng', url: 'https://vanhoatinnguong.vn/bai-viet/tin-nguong-then-cua-nguoi-dan-toc-tay-nung-8297.html' },
        { label: 'Sở DT Hà Nội', url: 'https://sodantoctongiao.hanoi.gov.vn/articles/3380' }
      ]
    },
    tinnguongthen: {
      title: 'Tín ngưỡng Then – Cầu nối người và thần linh',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Dan_Tinh_lute_from_Vietnam.jpg/600px-Dan_Tinh_lute_from_Vietnam.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Then_Singing.JPG/600px-Then_Singing.JPG'
      ],
      text: '<p>Tín ngưỡng Then là hệ thống tâm linh cốt lõi của dân tộc Tày, Nùng, Thái — được UNESCO ghi danh năm 2019.</p><p><strong>Cấu trúc:</strong></p><ul><li><strong>Then Tậc (nam):</strong> Thầy Then nam, thường hành nghề giải hạn, cúng bản</li><li><strong>Mè Then (nữ):</strong> Bà Then nữ, thường cúng chữa bệnh, cầu an, cúng mụ</li><li>Cả hai là cầu nối giữa con người với thế giới thần linh</li></ul><p><strong>Các loại lễ Then:</strong></p><ul><li>Then cầu an, giải hạn</li><li>Then chữa bệnh (gọi hồn, giải trùng)</li><li>Then cầu mùa (gắn với nông nghiệp)</li><li>Then tang lễ (tiễn hồn về mường Trời)</li></ul>',
      sources: [
        { label: 'UNESCO ICH', url: 'https://ich.unesco.org/en/RL/practices-related-to-the-then-of-tay-nung-and-thai-people-01570' },
        { label: 'Văn hoá tín ngưỡng', url: 'https://vanhoatinnguong.vn/bai-viet/tin-nguong-then-cua-nguoi-dan-toc-tay-nung-8297.html' }
      ]
    },
    vanvat: {
      title: 'Vạn vật hữu linh – Thế giới quan tâm linh',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Ba-Be-Lake-_Then-singing.jpg/600px-Ba-Be-Lake-_Then-singing.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pac_Ngoi_rice_field.JPG/600px-Pac_Ngoi_rice_field.JPG'
      ],
      text: '<p>Người Tày tin rằng mọi vật đều có linh hồn — từ cây cỏ, sông suối, đến đá núi, bếp lửa.</p><p><strong>Thế giới quan 3 tầng:</strong></p><ul><li><strong>Mường Trời:</strong> Nơi các thần linh, tổ tiên cư ngụ — thế giới của ánh sáng</li><li><strong>Mường Đất:</strong> Nơi con người sinh sống — thế giới hiện tại</li><li><strong>Mường Nước:</strong> Thế giới dưới nước — nơi Long Vương và thủy thần cai quản</li></ul><p><strong>Các vị thần được thờ:</strong></p><ul><li>Thổ thần (thần đất) — bảo hộ bản làng</li><li>Ma bếp — bảo vệ gia đình, giữ ấm</li><li>Ma chuồng — bảo vệ gia súc</li><li>Thần suối — bảo hộ nguồn nước</li><li>Mỗi bản có miếu thờ thổ công riêng</li></ul>',
      sources: [
        { label: 'Văn hoá tín ngưỡng', url: 'https://vanhoatinnguong.vn/bai-viet/tin-nguong-then-cua-nguoi-dan-toc-tay-nung-8297.html' },
        { label: 'Wikipedia', url: 'https://vi.wikipedia.org/wiki/Ng%C6%B0%E1%BB%9Di_T%C3%A0y' }
      ]
    },
    phatgiao: {
      title: 'Phật giáo & Đạo giáo trong đời sống Tày',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Dong_Son_Bronze_Drum_19.jpg/600px-Dong_Son_Bronze_Drum_19.jpg'
      ],
      text: '<p>Phật giáo và Đạo giáo đã hòa nhập vào tín ngưỡng dân gian Tày qua hàng thế kỷ giao lưu văn hóa.</p><p><strong>Đạo giáo (vai trò lớn):</strong></p><ul><li><strong>Thầy Tào:</strong> Người hành lễ Đạo giáo — chủ trì tang ma, giải hạn lớn</li><li>Sử dụng sách cúng chữ Hán Nôm, bùa chú, phép thuật</li><li>Tang lễ người Tày do Thầy Tào điều hành — dẫn hồn về tổ tiên qua các cửa ải</li></ul><p><strong>Phật giáo (hòa nhập):</strong></p><ul><li>Phật Bà Quan Âm được thờ phối hợp cùng thần linh bản địa</li><li>Ảnh hưởng qua chùa chiền vùng đồng bằng đối lưu</li><li>Yếu tố Phật giáo xuất hiện trong một số bài cúng Then</li></ul>',
      sources: [
        { label: 'Văn hoá tín ngưỡng', url: 'https://vanhoatinnguong.vn/bai-viet/tin-nguong-then-cua-nguoi-dan-toc-tay-nung-8297.html' }
      ]
    },
    nghilenongng: {
      title: 'Nghi lễ nông nghiệp – Con người & Thiên nhiên',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pac_Ngoi_rice_field.JPG/600px-Pac_Ngoi_rice_field.JPG',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Ba-Be-Lake-_Then-singing.jpg/600px-Ba-Be-Lake-_Then-singing.jpg'
      ],
      text: '<p>Nghi lễ nông nghiệp gắn chặt với chu kỳ canh tác — thể hiện triết lý "con người – thiên nhiên – thần linh là một".</p><p><strong>Các nghi lễ chính:</strong></p><ul><li><strong>Lễ Lồng Tổng (xuống đồng):</strong> Lớn nhất — khởi đầu vụ mùa, cầu mưa thuận gió hòa</li><li><strong>Lễ Nàng Hai:</strong> Cầu mùa — mời Nàng Trăng xuống đồng phù hộ</li><li><strong>Lễ cơm mới:</strong> Tạ ơn thần linh sau mùa gặt — dâng cơm mới lên bàn thờ</li><li><strong>Lễ cầu mưa:</strong> Khi hạn hán — thầy Then làm lễ cầu Long Vương cho mưa</li><li><strong>Lễ tạ đồng:</strong> Kết thúc vụ mùa — cảm ơn đất đai, thần linh đã ban phước</li></ul><p>Mỗi nghi lễ đều có hát Then, đàn tính, múa thiêng — tạo nên tổng thể văn hóa tâm linh thống nhất.</p>',
      sources: [
        { label: 'Báo Nhân Dân', url: 'https://nhandan.vn/dan-toc-tay-post723931.html' },
        { label: 'Wikipedia – Lồng Tổng', url: 'https://vi.wikipedia.org/wiki/L%E1%BB%93ng_t%E1%BB%95ng' }
      ]
    },
    kiengky: {
      title: 'Kiêng kỵ & Không gian linh thiêng',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Ba-Be-Lake-_Then-singing.jpg/600px-Ba-Be-Lake-_Then-singing.jpg'
      ],
      text: '<p>Hệ thống kiêng kỵ của người Tày phản ánh mối quan hệ tôn kính với thế giới tự nhiên và thần linh.</p><p><strong>Không gian linh thiêng:</strong></p><ul><li>Gốc cây cổ thụ — nơi thần linh trú ngụ, không được chặt hạ</li><li>Khe suối, nguồn nước — thần suối bảo hộ, không làm ô nhiễm</li><li>Hang động — cửa ngõ mường Nước, nơi thiêng liêng</li><li>Rừng thiêng (rừng cấm) — nơi thổ thần cư ngụ, tuyệt đối không xâm phạm</li></ul><p><strong>Kiêng kỵ trong đời sống:</strong></p><ul><li>Không huýt sáo ban đêm (gọi ma)</li><li>Không ngồi bậc cửa (chắn đường thần linh)</li><li>Sản phụ kiêng 30 ngày, không ra ngoài ban đêm</li><li>Không chỉ tay vào cầu vồng, mặt trăng</li><li>Ngày gieo trồng: xem ngày tốt bởi thầy Then</li></ul>',
      sources: [
        { label: 'Văn hoá tín ngưỡng', url: 'https://vanhoatinnguong.vn/bai-viet/tin-nguong-then-cua-nguoi-dan-toc-tay-nung-8297.html' },
        { label: 'Văn hoá tâm linh', url: 'https://vanhoatamlinh.com/dan-toc-tay/' }
      ]
    },

    /* === 7. TRANG PHỤC === */
    congcu: {
      title: 'Dụng cụ lao động sản xuất',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Pac_Ngoi_homestay.JPG/600px-Pac_Ngoi_homestay.JPG',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pac_Ngoi_rice_field.JPG/600px-Pac_Ngoi_rice_field.JPG'
      ],
      text: '<p>Hệ thống công cụ lao động phản ánh trí tuệ thực tiễn và mối quan hệ sâu sắc với thiên nhiên của người Tày.</p><p><strong>Công cụ dệt:</strong> Bộ quay tơ, thoi dệt, dao chẻ, chuốt nan — phục vụ nghề dệt thổ cẩm truyền thống.</p><p><strong>Đồ vận chuyển:</strong> Gùi, dậu gánh, sọt, rá, rổ, nong, nia — đan lát từ tre nứa song mây.</p><p><strong>Nông cụ:</strong> Cày, bừa bằng gỗ + sắt; che mồm trâu bò (phòng trâu ăn lúa).</p><p><strong>Săn bắt:</strong> Nỏ (coóng pân) — vũ khí đặc trưng; súng kíp; các loại bẫy: kẹp, pằm, lẹo. Nơm úp, giỏ cá — đánh bắt thủy sản.</p><p><strong>Cọn nước:</strong> Biểu tượng trí tuệ kỹ thuật Tày — bánh xe gỗ khổng lồ tự quay bằng sức nước, dẫn nước từ suối lên ruộng bậc thang.</p>',
      sources: [
        { label: 'Tuyên Quang', url: 'https://tuyenquang.dcs.vn/DetailView/145545/40/Nghe-thu-cong-truyen-thong-cua-nguoi-Tay-o-Tuyen-Quang.html' },
        { label: 'Báo Nhân Dân', url: 'https://nhandan.vn/dan-toc-tay-post723931.html' }
      ]
    },
    dole: {
      title: 'Đồ lễ & Tâm linh',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Dan_Tinh_lute_from_Vietnam.jpg/600px-Dan_Tinh_lute_from_Vietnam.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Then_Singing.JPG/600px-Then_Singing.JPG'
      ],
      text: '<p>Đồ lễ và tâm linh là những hiện vật thiêng liêng, gắn liền với nghi lễ Then và đời sống tín ngưỡng.</p><p><strong>Nhạc cụ tâm linh:</strong></p><ul><li><strong>Đàn tính:</strong> Bầu khô + gỗ sa mộc — linh hồn Hát Then</li><li><strong>Chùm xóc nhạc:</strong> Lắc theo nhịp múa Then</li><li><strong>Chuông nhỏ:</strong> Gọi thần linh trong lễ cúng</li></ul><p><strong>Đạo cụ nghi lễ:</strong></p><ul><li>Quạt (cờ), thẻ âm dương — công cụ xem bói</li><li>Kiếm, ấn, còi — quyền lực của thầy Then/Tào</li><li>Sách cúng chữ Hán Nôm Tày — truyền đời qua nhiều thế hệ</li></ul><p><strong>Trò chơi dân gian:</strong></p><ul><li><strong>Con quay (gụ) gỗ:</strong> Trò chơi đặc sắc trong lễ hội mùa xuân</li><li><strong>Quả còn:</strong> Ghép vải màu, đựng hạt giống — biểu tượng cầu mùa</li></ul>',
      sources: [
        { label: 'Văn hoá tín ngưỡng', url: 'https://vanhoatinnguong.vn/bai-viet/tin-nguong-then-cua-nguoi-dan-toc-tay-nung-8297.html' },
        { label: 'Tuyên Quang', url: 'https://tuyenquang.dcs.vn/DetailView/145545/40/Nghe-thu-cong-truyen-thong-cua-nguoi-Tay-o-Tuyen-Quang.html' }
      ]
    },

    /* === 8. BẢO TỒN === */
    lienhe: {
      title: 'Mối liên hệ khu vực Tai–Kadai',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tay_Women.jpg/600px-Tay_Women.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Then_Singing.JPG/600px-Then_Singing.JPG'
      ],
      text: '<p>Người Tày là một mắt xích quan trọng trong mạng lưới dân tộc Tai–Kadai rộng lớn của Đông Nam Á.</p><p><strong>Dân tộc anh em:</strong></p><ul><li><strong>Người Nùng (VN):</strong> Gần nhất — cùng ngôn ngữ, văn hóa, có thể giao tiếp</li><li><strong>Người Choang/Zhuang (TQ):</strong> ~18 triệu người — DTTS đông nhất Trung Quốc, tổ tiên chung</li><li><strong>Người Thái (Thái Lan):</strong> Cùng gốc Tai, chia nhánh từ hàng ngàn năm</li><li><strong>Người Lào, Shan (Myanmar):</strong> Cùng ngữ hệ Tai–Kadai</li></ul><p>Mối liên hệ thể hiện qua: ngôn ngữ, nhà sàn, lúa nước, dân ca, thần thoại sáng tạo, tín ngưỡng đa thần — tạo vùng liên tục văn hóa Tai xuyên biên giới.</p>',
      sources: [
        { label: 'Wikipedia – Tai peoples', url: 'https://en.wikipedia.org/wiki/Tai_peoples' },
        { label: 'Wikipedia – Người Tày', url: 'https://vi.wikipedia.org/wiki/Ng%C6%B0%E1%BB%9Di_T%C3%A0y' }
      ]
    },
    chinhsach: {
      title: 'Chính sách nhà nước đối với dân tộc Tày',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Pac_Ngoi_homestay.JPG/600px-Pac_Ngoi_homestay.JPG'
      ],
      text: '<p>Nhà nước Việt Nam triển khai nhiều chính sách hỗ trợ phát triển kinh tế-xã hội và bảo tồn văn hóa cho đồng bào dân tộc Tày.</p><p><strong>Cơ quan phụ trách:</strong></p><ul><li><strong>Ủy ban Dân tộc (UBDT):</strong> Cơ quan ngang bộ, quản lý tổng thể chính sách DTTS</li><li>Ban Dân tộc các tỉnh: triển khai chính sách cấp địa phương</li></ul><p><strong>Chính sách chính:</strong></p><ul><li>Chương trình MTQG phát triển KT-XH vùng đồng bào DTTS và miền núi (2021–2030)</li><li>Ưu đãi giáo dục: cử tuyển đại học, trường nội trú DTTS</li><li>Bảo hiểm y tế miễn phí cho DTTS vùng khó khăn</li><li>Hỗ trợ du lịch sinh thái và văn hóa cộng đồng</li><li>Đầu tư hạ tầng: đường, điện, nước, trường học, trạm y tế</li></ul>',
      sources: [
        { label: 'Ủy ban Dân tộc', url: 'http://www.cema.gov.vn/' },
        { label: 'Ban Dân tộc TW', url: 'https://bdttg.gov.vn/' }
      ]
    },
    xutich: {
      title: 'Xu hướng tích cực',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Pac_Ngoi_homestay.JPG/600px-Pac_Ngoi_homestay.JPG',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Ba-Be-Lake-_Then-singing.jpg/600px-Ba-Be-Lake-_Then-singing.jpg'
      ],
      text: '<p>Dù đối mặt nhiều thách thức, cộng đồng người Tày đang có những bước tiến tích cực đáng khích lệ.</p><p><strong>Điểm sáng:</strong></p><ul><li><strong>Đời sống cải thiện:</strong> Chương trình MTQG giúp giảm nghèo hiệu quả, hạ tầng tốt hơn</li><li><strong>Homestay phát triển:</strong> Mô hình Pắc Ngòi (Ba Bể), Bản Lác, các điểm homestay Hà Giang thu hút du khách quốc tế</li><li><strong>UNESCO ghi danh Then (2019):</strong> Tạo động lực mạnh cho công tác bảo tồn di sản</li><li><strong>Thế hệ trẻ quan tâm:</strong> Ngày càng nhiều bạn trẻ tự hào và tìm hiểu văn hóa dân tộc qua mạng xã hội</li><li><strong>Dân ca vào trường học:</strong> Nhiều tỉnh đưa hát Then, lượn cọi vào chương trình ngoại khóa</li><li><strong>Nghệ nhân được vinh danh:</strong> Nhà nước phong tặng Nghệ nhân Nhân dân, Nghệ nhân Ưu tú cho các bậc thầy Then</li></ul>',
      sources: [
        { label: 'Báo Nhân Dân', url: 'https://nhandan.vn/dan-toc-tay-post723931.html' },
        { label: 'UNESCO ICH', url: 'https://ich.unesco.org/en/RL/practices-related-to-the-then-of-tay-nung-and-thai-people-01570' }
      ]
    },

    /* === 9. NHÂN VẬT NỔI TIẾNG === */
    domixi: {
      title: 'Độ Mixi (Phùng Thanh Độ) – Streamer #1 Việt Nam',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/%C4%90%E1%BB%99_Mixi_2023.jpg/500px-%C4%90%E1%BB%99_Mixi_2023.jpg'
      ],
      text: '<p><strong>Phùng Thanh Độ</strong> (sinh ngày 2 tháng 2 năm 1989), được biết đến với biệt danh <strong style="color:var(--gold2)">Độ Mixi</strong> hay "Tộc trưởng", là streamer và YouTuber nổi tiếng nhất Việt Nam.</p>' +
        '<p><strong>Tiểu sử & Xuất thân:</strong></p>' +
        '<ul><li>Sinh năm 1989 tại <strong>Cao Bằng</strong> — một trong những tỉnh có người Tày đông nhất cả nước</li>' +
        '<li>Là người dân tộc Tày chính gốc, lớn lên giữa núi rừng Đông Bắc</li>' +
        '<li>Tốt nghiệp đại học tại Hà Nội, từng làm nhiều công việc trước khi trở thành streamer</li>' +
        '<li>Bắt đầu sự nghiệp streaming vào khoảng 2017–2018 trên nền tảng Facebook Gaming</li></ul>' +
        '<p><strong>Sự nghiệp & Thành tựu:</strong></p>' +
        '<ul><li>Kênh YouTube <strong>MixiGaming</strong> đạt hơn <strong>7 triệu subscriber</strong></li>' +
        '<li>Là streamer có lượng theo dõi và tương tác lớn nhất Việt Nam</li>' +
        '<li>Nổi tiếng qua game PUBG, sau mở rộng sang Minecraft, GTA V, và nhiều game khác</li>' +
        '<li>Phong cách hài hước, chân thật, gần gũi — tạo nên cộng đồng fan "Tộc" cực kỳ trung thành</li>' +
        '<li>Tổ chức nhiều sự kiện từ thiện, quyên góp cho đồng bào vùng cao, miền Trung</li>' +
        '<li>Được mời tham gia nhiều chương trình truyền hình, sự kiện gaming quốc tế</li></ul>' +
        '<p><strong>Niềm tự hào dân tộc Tày:</strong></p>' +
        '<p>Độ Mixi luôn công khai và tự hào về nguồn gốc dân tộc Tày từ Cao Bằng. Anh thường xuyên chia sẻ về quê hương, phong cảnh núi rừng, ẩm thực Tày và những kỷ niệm tuổi thơ trên vùng cao. Sự thành công vang dội của "Tộc trưởng" đã truyền cảm hứng cho rất nhiều bạn trẻ dân tộc thiểu số tin rằng họ có thể tỏa sáng trong bất kỳ lĩnh vực nào — kể cả những lĩnh vực hoàn toàn mới như esports và sáng tạo nội dung số.</p>' +
        '<p>Biệt danh "Tộc trưởng" không chỉ là tên gọi trong gaming — nó còn mang ý nghĩa sâu sắc về vai trò kết nối cộng đồng, giống như vai trò trưởng bản trong văn hóa Tày truyền thống.</p>',
      sources: [
        { label: 'Wikipedia – Độ Mixi', url: 'https://vi.wikipedia.org/wiki/%C4%90%E1%BB%99_Mixi' },
        { label: 'YouTube – MixiGaming', url: 'https://www.youtube.com/@MixiGaming' },
        { label: 'Facebook – Độ Mixi', url: 'https://www.facebook.com/domixiofficial' }
      ]
    },
    nongducmanh: {
      title: 'Nông Đức Mạnh – Tổng Bí thư Đảng CSVN',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Nong_Duc_Manh_2010.jpg/400px-Nong_Duc_Manh_2010.jpg'
      ],
      text: '<p><strong>Nông Đức Mạnh</strong> (sinh ngày 11 tháng 9 năm 1940) là nhà lãnh đạo cấp cao nhất Việt Nam có gốc dân tộc Tày.</p>' +
        '<p><strong>Tiểu sử:</strong></p>' +
        '<ul><li>Sinh tại xã Cường Lợi, huyện Na Rì, tỉnh <strong>Bắc Kạn</strong> — trung tâm vùng Tày</li>' +
        '<li>Xuất thân từ gia đình nông dân dân tộc Tày</li>' +
        '<li>Tốt nghiệp kỹ sư Lâm nghiệp tại Liên Xô (1963)</li>' +
        '<li>Bắt đầu sự nghiệp trong ngành lâm nghiệp tại Bắc Kạn</li></ul>' +
        '<p><strong>Sự nghiệp chính trị:</strong></p>' +
        '<ul><li>Bí thư Tỉnh ủy Bắc Thái (1989–1991)</li>' +
        '<li><strong>Chủ tịch Quốc hội</strong> nước CHXHCN Việt Nam (1992–2001)</li>' +
        '<li><strong>Tổng Bí thư Đảng Cộng sản Việt Nam</strong> (2001–2011) — 2 nhiệm kỳ</li>' +
        '<li>Là người dân tộc thiểu số duy nhất từng giữ chức vụ cao nhất trong Đảng</li></ul>' +
        '<p><strong>Di sản:</strong></p>' +
        '<p>Dưới thời Nông Đức Mạnh, Việt Nam đạt nhiều thành tựu phát triển kinh tế, hội nhập quốc tế (gia nhập WTO năm 2007). Ông là minh chứng sống cho chính sách đoàn kết dân tộc của Việt Nam — một người con dân tộc Tày vươn lên vị trí lãnh đạo cao nhất đất nước.</p>',
      sources: [
        { label: 'Wikipedia – Nông Đức Mạnh', url: 'https://vi.wikipedia.org/wiki/N%C3%B4ng_%C4%90%E1%BB%A9c_M%E1%BA%A1nh' },
        { label: 'Chính phủ VN', url: 'https://www.chinhphu.vn/' }
      ]
    },
    hoangvanthu: {
      title: 'Hoàng Văn Thụ – Nhà cách mạng kiên trung',
      images: [
        'https://upload.wikimedia.org/wikipedia/vi/thumb/a/a3/Hoang_Van_Thu.jpg/400px-Hoang_Van_Thu.jpg'
      ],
      text: '<p><strong>Hoàng Văn Thụ</strong> (1909–1944) là một trong những nhà cách mạng tiêu biểu nhất của dân tộc Tày và của cả dân tộc Việt Nam.</p>' +
        '<p><strong>Tiểu sử:</strong></p>' +
        '<ul><li>Tên thật: Hoàng Văn Thụ</li>' +
        '<li>Sinh năm 1909 tại Nhân Lý, Văn Lãng (nay thuộc Văn Quan), tỉnh <strong>Lạng Sơn</strong></li>' +
        '<li>Gia đình nông dân dân tộc Tày, có truyền thống yêu nước</li>' +
        '<li>Giác ngộ cách mạng từ sớm, hoạt động từ năm 16 tuổi</li></ul>' +
        '<p><strong>Sự nghiệp cách mạng:</strong></p>' +
        '<ul><li>Tham gia phong trào cách mạng từ năm 1926</li>' +
        '<li>Được kết nạp Đảng Cộng sản Đông Dương năm 1930</li>' +
        '<li>Hoạt động bí mật tại Lạng Sơn, Cao Bằng, Trung Quốc</li>' +
        '<li>Được bầu làm <strong>Bí thư Xứ ủy Bắc Kỳ</strong> — chức vụ lãnh đạo cao nhất miền Bắc</li>' +
        '<li>Ủy viên Ban Thường vụ Trung ương Đảng</li></ul>' +
        '<p><strong>Hy sinh anh dũng:</strong></p>' +
        '<p>Ngày 25/12/1943, Hoàng Văn Thụ bị thực dân Pháp bắt tại Hà Nội. Dù bị tra tấn dã man, ông không khai báo bất cứ điều gì. Ngày <strong>24/5/1944</strong>, ông bị xử bắn tại trường bắn Tương Mai, Hà Nội. Trước pháp trường, ông hát vang bài Quốc tế ca và hiên ngang đối mặt cái chết. Tên ông được đặt cho nhiều đường phố, trường học trên cả nước.</p>',
      sources: [
        { label: 'Wikipedia – Hoàng Văn Thụ', url: 'https://vi.wikipedia.org/wiki/Ho%C3%A0ng_V%C4%83n_Th%E1%BB%A5' },
        { label: 'Báo Nhân Dân', url: 'https://nhandan.vn/' }
      ]
    },
    chuvantan: {
      title: 'Chu Văn Tấn – Thượng tướng dân tộc Tày',
      images: [
        'https://upload.wikimedia.org/wikipedia/vi/thumb/6/6a/Chu_Van_Tan.jpg/400px-Chu_Van_Tan.jpg'
      ],
      text: '<p><strong>Chu Văn Tấn</strong> (1909–1984) là vị tướng người Tày nổi tiếng, một trong những người chỉ huy đầu tiên của lực lượng vũ trang cách mạng Việt Nam.</p>' +
        '<p><strong>Tiểu sử:</strong></p>' +
        '<ul><li>Sinh năm 1909 tại Phú Thượng, Võ Nhai (nay thuộc Phú Lương), tỉnh <strong>Thái Nguyên</strong></li>' +
        '<li>Gia đình nông dân dân tộc Tày</li>' +
        '<li>Tham gia cách mạng từ rất sớm, hoạt động tại vùng Việt Bắc</li></ul>' +
        '<p><strong>Sự nghiệp quân sự:</strong></p>' +
        '<ul><li>Chỉ huy <strong>Cứu quốc quân</strong> — lực lượng vũ trang tiền thân của Quân đội Nhân dân Việt Nam</li>' +
        '<li>Tham gia lãnh đạo khởi nghĩa Bắc Sơn (1940) — một trong những cuộc khởi nghĩa đầu tiên chống thực dân</li>' +
        '<li>Bộ trưởng Bộ Quốc phòng trong Chính phủ Lâm thời (1945)</li>' +
        '<li>Được phong <strong>Thượng tướng</strong> Quân đội Nhân dân Việt Nam</li>' +
        '<li>Phó Chủ tịch Quốc hội nước Việt Nam DCCH</li></ul>' +
        '<p><strong>Di sản:</strong></p>' +
        '<p>Chu Văn Tấn là biểu tượng của sự đóng góp to lớn của dân tộc Tày trong sự nghiệp giải phóng dân tộc. Ông chứng minh rằng từ vùng núi Việt Bắc, con em đồng bào dân tộc thiểu số hoàn toàn có thể trở thành những vị tướng tài ba của đất nước.</p>',
      sources: [
        { label: 'Wikipedia – Chu Văn Tấn', url: 'https://vi.wikipedia.org/wiki/Chu_V%C4%83n_T%E1%BA%A5n' },
        { label: 'Bách khoa Quân sự VN', url: 'https://vi.wikipedia.org/wiki/Chu_V%C4%83n_T%E1%BA%A5n' }
      ]
    },
    bevandan: {
      title: 'Bế Văn Đàn – Anh hùng lực lượng vũ trang',
      images: [
        'https://upload.wikimedia.org/wikipedia/vi/thumb/a/ad/Be_Van_Dan.jpg/400px-Be_Van_Dan.jpg'
      ],
      text: '<p><strong>Bế Văn Đàn</strong> (1931–1953) là Anh hùng Lực lượng Vũ trang Nhân dân Việt Nam, biểu tượng bất tử của chủ nghĩa anh hùng cách mạng.</p>' +
        '<p><strong>Tiểu sử:</strong></p>' +
        '<ul><li>Sinh năm 1931 tại xã Quang Trung (nay thuộc xã Triệu Ẩu), huyện Phục Hòa, tỉnh <strong>Cao Bằng</strong></li>' +
        '<li>Gia đình nông dân dân tộc Tày nghèo</li>' +
        '<li>Mồ côi cha từ nhỏ, sống với mẹ trong hoàn cảnh khó khăn</li>' +
        '<li>Nhập ngũ năm 1948, khi mới 17 tuổi</li></ul>' +
        '<p><strong>Chiến công bất tử:</strong></p>' +
        '<p>Ngày <strong>12/12/1953</strong>, trong trận đánh tại <strong>Mường Pồn</strong> (Điện Biên), khi đơn vị cần bắn yểm trợ mà không có giá súng, Bế Văn Đàn đã <strong>lấy vai mình làm giá đỡ</strong> cho đồng đội kê súng trung liên bắn. Dù bị thương nặng và trúng nhiều phát đạn, anh vẫn kiên cường ôm chặt súng cho đến khi hy sinh.</p>' +
        '<p><strong>Vinh danh:</strong></p>' +
        '<ul><li>Truy tặng danh hiệu <strong>Anh hùng Lực lượng Vũ trang Nhân dân</strong> (1955)</li>' +
        '<li>Tên anh được đặt cho nhiều đường phố, trường học trên cả nước</li>' +
        '<li>Là một trong ba anh hùng tiêu biểu nhất thời kỳ kháng chiến chống Pháp (cùng Phan Đình Giót, Tô Vĩnh Diện)</li>' +
        '<li>Câu chuyện anh hùng "lấy thân mình làm giá súng" được đưa vào sách giáo khoa</li></ul>',
      sources: [
        { label: 'Wikipedia – Bế Văn Đàn', url: 'https://vi.wikipedia.org/wiki/B%E1%BA%BF_V%C4%83n_%C4%90%C3%A0n' },
        { label: 'Báo QĐND', url: 'https://www.qdnd.vn/' }
      ]
    },
    hoangdinhgiong: {
      title: 'Hoàng Đình Giong – Thiếu tướng, Anh hùng LLVT',
      images: [
        'https://upload.wikimedia.org/wikipedia/vi/0/04/Hoang_Dinh_Giong.jpg'
      ],
      text: '<p><strong>Hoàng Đình Giong</strong> (1904–1947) là Thiếu tướng Quân đội Nhân dân Việt Nam, Anh hùng Lực lượng Vũ trang Nhân dân, một trong những nhà cách mạng tiên phong tại Cao Bằng.</p>' +
        '<p><strong>Tiểu sử:</strong></p>' +
        '<ul><li>Tên thật: Hoàng Đình Giong, bí danh: Văn, Hồng Kỳ, Lê Minh</li>' +
        '<li>Sinh ngày 1/6/1904 tại xã Hạ Hoàng, huyện Hòa An, tỉnh <strong>Cao Bằng</strong></li>' +
        '<li>Gia đình nhà nho dân tộc Tày có truyền thống yêu nước</li></ul>' +
        '<p><strong>Sự nghiệp cách mạng:</strong></p>' +
        '<ul><li>Sang Quảng Châu (TQ) gặp Nguyễn Ái Quốc, gia nhập Hội Việt Nam Cách mạng Thanh niên (1926)</li>' +
        '<li>Một trong những <strong>người sáng lập Chi bộ Đảng đầu tiên</strong> tại Cao Bằng (1930)</li>' +
        '<li>Hoạt động bí mật ở nhiều nước Đông Nam Á</li>' +
        '<li>Chỉ huy lực lượng vũ trang kháng chiến tại chiến trường <strong>biên giới Đông Bắc</strong></li>' +
        '<li>Được phong Thiếu tướng (1948, truy phong)</li></ul>' +
        '<p><strong>Hy sinh:</strong></p>' +
        '<p>Hoàng Đình Giong hy sinh ngày 28/3/1947 trong khi chỉ huy chiến đấu bảo vệ biên giới. Ông được truy tặng danh hiệu <strong>Anh hùng LLVT Nhân dân</strong> năm 2010. Cuộc đời ông là tấm gương sáng về lòng yêu nước và sự kiên trung cách mạng của dân tộc Tày.</p>',
      sources: [
        { label: 'Wikipedia – Hoàng Đình Giong', url: 'https://vi.wikipedia.org/wiki/Ho%C3%A0ng_%C4%90%C3%ACnh_Giong' },
        { label: 'Cao Bằng Gov', url: 'https://www.caobang.gov.vn/' }
      ]
    },
    nongquocchan: {
      title: 'Nông Quốc Chấn – Nhà thơ dân tộc Tày, Giải thưởng HCM',
      images: [
        'https://upload.wikimedia.org/wikipedia/vi/thumb/9/9f/Nong_Quoc_Chan.jpg/400px-Nong_Quoc_Chan.jpg'
      ],
      text: '<p><strong>Nông Quốc Chấn</strong> (1923–2002) là nhà thơ tiêu biểu nhất và có ảnh hưởng lớn nhất của văn học dân tộc Tày.</p>' +
        '<p><strong>Tiểu sử:</strong></p>' +
        '<ul><li>Tên thật: Nông Văn Quỳnh, bút danh: Nông Quốc Chấn</li>' +
        '<li>Sinh năm 1923 tại xã Bằng Đức (nay thuộc Cốc Đán), huyện Ngân Sơn, tỉnh <strong>Bắc Kạn</strong></li>' +
        '<li>Gia đình nông dân dân tộc Tày</li>' +
        '<li>Tham gia cách mạng từ sớm, hoạt động văn nghệ phục vụ kháng chiến</li></ul>' +
        '<p><strong>Sự nghiệp văn học:</strong></p>' +
        '<ul><li>Là nhà thơ <strong>đầu tiên viết thơ bằng tiếng Tày</strong> và được công nhận rộng rãi</li>' +
        '<li>Tác phẩm nổi tiếng nhất: bài thơ <strong>"Dọn về làng"</strong> (1950) — viết về niềm vui giải phóng quê hương</li>' +
        '<li>Các tác phẩm khác: "Tiếng ca người Việt Bắc", "Suối và biển", "Bộ đội ông Cụ"</li>' +
        '<li>Thơ ông kết hợp hài hòa giữa chất dân ca Tày và thơ ca Việt Nam hiện đại</li></ul>' +
        '<p><strong>Giải thưởng & Chức vụ:</strong></p>' +
        '<ul><li><strong>Giải thưởng Hồ Chí Minh</strong> về Văn học Nghệ thuật (đợt I, 1996)</li>' +
        '<li>Thứ trưởng Bộ Văn hóa – Thông tin</li>' +
        '<li>Ủy viên Ủy ban Trung ương Mặt trận Tổ quốc Việt Nam</li>' +
        '<li>Tổng Biên tập Tạp chí Văn hóa các dân tộc</li></ul>' +
        '<p>Nông Quốc Chấn là người đã đưa tiếng thơ dân tộc Tày lên bản đồ văn học Việt Nam, chứng minh rằng ngôn ngữ và văn hóa Tày có sức sáng tạo vô cùng phong phú.</p>',
      sources: [
        { label: 'Wikipedia – Nông Quốc Chấn', url: 'https://vi.wikipedia.org/wiki/N%C3%B4ng_Qu%E1%BB%91c_Ch%E1%BA%A5n' },
        { label: 'Hội Nhà Văn VN', url: 'https://vanvn.vn/' }
      ]
    },
    duongthuan: {
      title: 'Dương Thuấn – Nhà thơ, nhà văn Tày đương đại',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tay_Women.jpg/400px-Tay_Women.jpg'
      ],
      text: '<p><strong>Dương Thuấn</strong> (sinh năm 1961) là nhà thơ, nhà văn đương đại tiêu biểu nhất của dân tộc Tày, người đưa văn hóa Tày vào dòng chảy văn học Việt Nam hiện đại.</p>' +
        '<p><strong>Tiểu sử:</strong></p>' +
        '<ul><li>Sinh năm 1961 tại xã Bằng Vân (nay là Lương Bằng), huyện Bạch Thông (nay thuộc Chợ Đồn), tỉnh <strong>Bắc Kạn</strong></li>' +
        '<li>Lớn lên trong gia đình nông dân dân tộc Tày</li>' +
        '<li>Tốt nghiệp Đại học Tổng hợp Hà Nội (nay là ĐHQG Hà Nội)</li>' +
        '<li>Hội viên Hội Nhà văn Việt Nam</li></ul>' +
        '<p><strong>Sự nghiệp văn học:</strong></p>' +
        '<ul><li>Tác giả gần <strong>20 tập thơ</strong> bằng cả tiếng Tày và tiếng Việt</li>' +
        '<li>Là nhà thơ Tày đương đại sung sức và đa dạng nhất</li>' +
        '<li>Tác phẩm tiêu biểu: "Thơ Dương Thuấn", "Đàn then", "Hoa lê trắng"</li>' +
        '<li>Viết nhiều về thiên nhiên, con người, phong tục tập quán vùng Tày</li>' +
        '<li>Nghiên cứu, sưu tầm và phổ biến văn học dân gian Tày</li></ul>' +
        '<p><strong>Đóng góp:</strong></p>' +
        '<p>Dương Thuấn là cầu nối quan trọng giữa văn hóa Tày truyền thống và văn học Việt Nam đương đại. Thơ ông mang hơi thở núi rừng, tiếng đàn tính, và tâm hồn người Tày — giúp bạn đọc cả nước cảm nhận vẻ đẹp phong phú của văn hóa Đông Bắc.</p>',
      sources: [
        { label: 'Hội Nhà Văn VN', url: 'https://vanvn.vn/' },
        { label: 'Wikipedia – Dương Thuấn', url: 'https://vi.wikipedia.org/wiki/D%C6%B0%C6%A1ng_Thu%E1%BA%A5n' }
      ]
    },
    vihong: {
      title: 'Vi Hồng – Nhà văn tiêu biểu viết bằng tiếng Tày',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Ba-Be-Lake-_Then-singing.jpg/400px-Ba-Be-Lake-_Then-singing.jpg'
      ],
      text: '<p><strong>Vi Hồng</strong> (1936–1997) là nhà văn dân tộc Tày tiêu biểu, người có công lớn trong việc phát triển văn học viết bằng tiếng Tày và tiếng Việt.</p>' +
        '<p><strong>Tiểu sử:</strong></p>' +
        '<ul><li>Tên thật: Vi Văn Hồng</li>' +
        '<li>Sinh năm 1936 tại xã Bản Thi, huyện Chợ Đồn, tỉnh <strong>Bắc Kạn</strong></li>' +
        '<li>Gia đình nông dân dân tộc Tày</li>' +
        '<li>Tốt nghiệp Đại học Sư phạm, trở thành giảng viên Trường Đại học Sư phạm Việt Bắc (nay là ĐH Sư phạm Thái Nguyên)</li></ul>' +
        '<p><strong>Sự nghiệp văn học:</strong></p>' +
        '<ul><li>Là <strong>nhà văn Tày đầu tiên</strong> viết tiểu thuyết bằng cả tiếng Tày và tiếng Việt</li>' +
        '<li>Tác phẩm tiêu biểu: <strong>"Đất bằng"</strong>, <strong>"Vào hang"</strong>, "Gã ngợm", "Tháng năm biết nói", "Người trong ống"</li>' +
        '<li>Chủ đề chính: cuộc sống, tình yêu và số phận con người Tày trước biến đổi xã hội</li>' +
        '<li>Văn phong đậm chất dân gian Tày, hài hước, sâu sắc</li></ul>' +
        '<p><strong>Đóng góp cho giáo dục:</strong></p>' +
        '<ul><li>Giảng dạy văn học tại ĐH Sư phạm Việt Bắc suốt nhiều thập kỷ</li>' +
        '<li>Đào tạo nhiều thế hệ giáo viên, nhà văn dân tộc thiểu số</li>' +
        '<li>Nghiên cứu, sưu tầm văn học dân gian Tày một cách có hệ thống</li></ul>' +
        '<p>Vi Hồng là tấm gương sáng về sự kết hợp giữa sáng tác văn học và giáo dục — đưa ngôn ngữ và văn hóa Tày vào giảng đường đại học.</p>',
      sources: [
        { label: 'Wikipedia – Vi Hồng', url: 'https://vi.wikipedia.org/wiki/Vi_H%E1%BB%93ng' },
        { label: 'ĐH Sư phạm Thái Nguyên', url: 'https://www.tnue.edu.vn/' }
      ]
    }
  };

  /* --- Detail Modal Logic --- */
  var dm = document.getElementById('detail-modal');
  var dmGallery = document.getElementById('dm-gallery');
  var dmTitle = document.getElementById('dm-title');
  var dmText = document.getElementById('dm-text');
  var dmSources = document.getElementById('dm-sources');

  function openDetail(id) {
    var data = detailData[id];
    if (!data || !dm) return;
    // Title
    dmTitle.textContent = data.title;
    // Gallery
    dmGallery.innerHTML = '';
    if (data.images && data.images.length) {
      data.images.forEach(function (src) {
        var img = document.createElement('img');
        img.src = src;
        img.alt = data.title;
        img.loading = 'lazy';
        img.onerror = function () { this.style.display = 'none'; };
        img.addEventListener('click', function () {
          // Open in lightbox if available
          if (typeof openLightbox === 'function') {
            var items = data.images.map(function (s) { return { src: s, cap: data.title }; });
            openLightbox(items, data.images.indexOf(src));
          }
        });
        dmGallery.appendChild(img);
      });
    }
    // Text
    dmText.innerHTML = data.text;
    // Sources
    dmSources.innerHTML = '';
    if (data.sources && data.sources.length) {
      data.sources.forEach(function (s) {
        var a = document.createElement('a');
        a.href = s.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = s.label;
        dmSources.appendChild(a);
      });
    }
    // Show
    dm.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Focus close button
    var closeBtn = dm.querySelector('.dm-close');
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 100);
  }

  function closeDetail() {
    if (dm) {
      dm.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Close handlers
  if (dm) {
    dm.addEventListener('click', function (e) {
      if (e.target === dm) closeDetail();
    });
    var dmCloseBtn = dm.querySelector('.dm-close');
    if (dmCloseBtn) dmCloseBtn.addEventListener('click', closeDetail);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dm.classList.contains('open')) closeDetail();
    });
  }

  // Attach click handlers to all cards with data-detail-id
  document.querySelectorAll('[data-detail-id]').forEach(function (card) {
    // Add hint icon
    var hint = document.createElement('span');
    hint.className = 'dm-hint';
    hint.textContent = '＋';
    hint.setAttribute('aria-hidden', 'true');
    card.appendChild(hint);

    card.addEventListener('click', function (e) {
      // Don't trigger if clicking a link inside the card
      if (e.target.closest('a')) return;
      var id = card.getAttribute('data-detail-id');
      openDetail(id);
    });
  });

  /* ===== TEAM SECTION – MEGA EFFECTS ===== */
  (function initTeamEffects() {
    var teamSection = document.getElementById('team');
    if (!teamSection) return;

    var teamCards = teamSection.querySelectorAll('.team-card');
    var teamMembers = teamSection.querySelectorAll('.team-member');
    var teamTitle = teamSection.querySelector('.team-title');
    var teamBadge = teamSection.querySelector('.team-badge');
    var teamCanvas = document.getElementById('teamCanvas');

    /* --- 1. TEAM CANVAS: Constellation particles + shooting stars --- */
    if (teamCanvas) {
      var tCtx = teamCanvas.getContext('2d');
      var tW, tH, tParticles = [], tStars = [], tMouse = { x: -999, y: -999 };

      function tResize() {
        var rect = teamSection.getBoundingClientRect();
        tW = teamCanvas.width = rect.width;
        tH = teamCanvas.height = rect.height;
      }
      tResize();
      window.addEventListener('resize', tResize);

      // Particles
      function TParticle() { this.init(); }
      TParticle.prototype.init = function () {
        this.x = Math.random() * tW;
        this.y = Math.random() * tH;
        this.r = Math.random() * 2.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.color = ['212,168,67', '245,208,122', '26,122,94', '93,212,168', '255,241,198'][Math.floor(Math.random() * 5)];
      };
      TParticle.prototype.update = function (t) {
        // Mouse repel
        var dx = this.x - tMouse.x, dy = this.y - tMouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          var force = (150 - dist) / 150 * 0.8;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }
        this.vx *= 0.98; this.vy *= 0.98;
        this.x += this.vx; this.y += this.vy;
        this.alpha = (Math.sin(t * this.pulseSpeed + this.pulsePhase) + 1) / 2 * 0.5 + 0.15;
        if (this.x < -10) this.x = tW + 10;
        if (this.x > tW + 10) this.x = -10;
        if (this.y < -10) this.y = tH + 10;
        if (this.y > tH + 10) this.y = -10;
      };
      TParticle.prototype.draw = function () {
        tCtx.beginPath();
        tCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        tCtx.fillStyle = 'rgba(' + this.color + ',' + this.alpha + ')';
        tCtx.fill();
        // Glow
        tCtx.beginPath();
        tCtx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
        tCtx.fillStyle = 'rgba(' + this.color + ',' + (this.alpha * 0.15) + ')';
        tCtx.fill();
      };

      for (var i = 0; i < 180; i++) tParticles.push(new TParticle());

      // Shooting stars
      function ShootingStar() { this.reset(); }
      ShootingStar.prototype.reset = function () {
        this.x = Math.random() * tW;
        this.y = Math.random() * tH * 0.4;
        this.len = Math.random() * 80 + 40;
        this.speed = Math.random() * 8 + 4;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
        this.alpha = 0;
        this.phase = 0; // 0=wait 1=active 2=fade
        this.wait = Math.random() * 400 + 100;
        this.life = 0;
      };
      ShootingStar.prototype.update = function () {
        if (this.phase === 0) {
          this.wait--;
          if (this.wait <= 0) { this.phase = 1; this.alpha = 1; }
        } else if (this.phase === 1) {
          this.x += Math.cos(this.angle) * this.speed;
          this.y += Math.sin(this.angle) * this.speed;
          this.life++;
          this.alpha = Math.max(0, 1 - this.life / 40);
          if (this.alpha <= 0 || this.x > tW + 100 || this.y > tH + 100) this.reset();
        }
      };
      ShootingStar.prototype.draw = function () {
        if (this.alpha <= 0) return;
        var ex = this.x - Math.cos(this.angle) * this.len;
        var ey = this.y - Math.sin(this.angle) * this.len;
        var grad = tCtx.createLinearGradient(this.x, this.y, ex, ey);
        grad.addColorStop(0, 'rgba(245,208,122,' + this.alpha + ')');
        grad.addColorStop(1, 'rgba(245,208,122,0)');
        tCtx.beginPath();
        tCtx.moveTo(this.x, this.y);
        tCtx.lineTo(ex, ey);
        tCtx.strokeStyle = grad;
        tCtx.lineWidth = 2;
        tCtx.stroke();
        // Head glow
        tCtx.beginPath();
        tCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        tCtx.fillStyle = 'rgba(255,241,198,' + this.alpha + ')';
        tCtx.fill();
      };

      for (var s = 0; s < 5; s++) {
        var star = new ShootingStar();
        star.wait = Math.random() * 300 + s * 80;
        tStars.push(star);
      }

      // Mouse tracking on team section
      teamSection.addEventListener('mousemove', function (e) {
        var rect = teamSection.getBoundingClientRect();
        tMouse.x = e.clientX - rect.left;
        tMouse.y = e.clientY - rect.top;
      });
      teamSection.addEventListener('mouseleave', function () {
        tMouse.x = -999; tMouse.y = -999;
      });

      var tFrame = 0;
      (function drawTeam() {
        tCtx.clearRect(0, 0, tW, tH);
        tFrame++;

        // Draw constellation lines
        for (var i = 0; i < tParticles.length; i++) {
          for (var j = i + 1; j < tParticles.length; j++) {
            var dx = tParticles[i].x - tParticles[j].x;
            var dy = tParticles[i].y - tParticles[j].y;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < 120) {
              tCtx.beginPath();
              tCtx.moveTo(tParticles[i].x, tParticles[i].y);
              tCtx.lineTo(tParticles[j].x, tParticles[j].y);
              var lineAlpha = 0.08 * (1 - d / 120);
              tCtx.strokeStyle = 'rgba(212,168,67,' + lineAlpha + ')';
              tCtx.lineWidth = 0.5;
              tCtx.stroke();
            }
          }
          tParticles[i].update(tFrame);
          tParticles[i].draw();
        }

        // Draw mouse connection lines
        if (tMouse.x > 0) {
          for (var k = 0; k < tParticles.length; k++) {
            var mdx = tParticles[k].x - tMouse.x;
            var mdy = tParticles[k].y - tMouse.y;
            var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < 200) {
              tCtx.beginPath();
              tCtx.moveTo(tMouse.x, tMouse.y);
              tCtx.lineTo(tParticles[k].x, tParticles[k].y);
              tCtx.strokeStyle = 'rgba(245,208,122,' + (0.15 * (1 - mDist / 200)) + ')';
              tCtx.lineWidth = 0.8;
              tCtx.stroke();
            }
          }
          // Mouse glow
          var mouseGrad = tCtx.createRadialGradient(tMouse.x, tMouse.y, 0, tMouse.x, tMouse.y, 100);
          mouseGrad.addColorStop(0, 'rgba(212,168,67,0.06)');
          mouseGrad.addColorStop(1, 'rgba(212,168,67,0)');
          tCtx.fillStyle = mouseGrad;
          tCtx.fillRect(tMouse.x - 100, tMouse.y - 100, 200, 200);
        }

        // Shooting stars
        for (var ss = 0; ss < tStars.length; ss++) {
          tStars[ss].update();
          tStars[ss].draw();
        }

        requestAnimationFrame(drawTeam);
      })();
    }

    /* --- 2. TILT 3D on team cards --- */
    teamCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(600px) rotateY(' + (x * 15) + 'deg) rotateX(' + (-y * 15) + 'deg) scale(1.05)';
        // Move glow with cursor
        var glow = card.querySelector('.team-glow');
        if (glow) {
          glow.style.left = (e.clientX - rect.left - 65) + 'px';
          glow.style.top = (e.clientY - rect.top - 65) + 'px';
        }
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });

    /* --- 3. SPARKLE burst on card click --- */
    teamCards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        var rect = card.getBoundingClientRect();
        var cx = e.clientX - rect.left;
        var cy = e.clientY - rect.top;
        for (var sp = 0; sp < 24; sp++) {
          var sparkle = document.createElement('span');
          sparkle.className = 'team-sparkle';
          var angle = (sp / 24) * Math.PI * 2;
          var distance = 40 + Math.random() * 60;
          var tx = Math.cos(angle) * distance;
          var ty = Math.sin(angle) * distance;
          sparkle.style.left = cx + 'px';
          sparkle.style.top = cy + 'px';
          sparkle.style.setProperty('--tx', tx + 'px');
          sparkle.style.setProperty('--ty', ty + 'px');
          sparkle.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
          sparkle.style.animationDuration = (0.5 + Math.random() * 0.4) + 's';
          sparkle.style.background = ['#d4a843', '#f5d07a', '#5dd4a8', '#fff1c6', '#26a97e'][Math.floor(Math.random() * 5)];
          card.appendChild(sparkle);
          sparkle.addEventListener('animationend', function () { sparkle.remove(); });
        }
      });
    });

    /* --- 4. MAGNETIC hover + ripple on image --- */
    teamCards.forEach(function (card) {
      var imgWrap = card.querySelector('.team-img-wrap');
      if (!imgWrap) return;
      imgWrap.addEventListener('mouseenter', function () {
        imgWrap.style.transition = 'transform 0.2s ease';
      });
      imgWrap.addEventListener('mousemove', function (e) {
        var rect = imgWrap.getBoundingClientRect();
        var x = (e.clientX - rect.left - rect.width / 2) * 0.2;
        var y = (e.clientY - rect.top - rect.height / 2) * 0.2;
        imgWrap.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(1.08)';
      });
      imgWrap.addEventListener('mouseleave', function () {
        imgWrap.style.transform = '';
        imgWrap.style.transition = 'transform 0.5s cubic-bezier(.4,0,.2,1)';
      });

      // Ripple on click
      imgWrap.addEventListener('click', function (e) {
        var ripple = document.createElement('span');
        ripple.className = 'team-ripple';
        var rect = imgWrap.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        imgWrap.appendChild(ripple);
        ripple.addEventListener('animationend', function () { ripple.remove(); });
      });
    });

    /* --- 5. TYPING animation on title --- */
    if (teamTitle) {
      var line1 = teamTitle.querySelector('.team-title-line1');
      var line2 = teamTitle.querySelector('.team-title-line2');
      var line3 = teamTitle.querySelector('.team-title-line3');
      var texts = [
        { el: line1, text: line1 ? line1.textContent : '' },
        { el: line2, text: line2 ? line2.textContent : '' },
        { el: line3, text: line3 ? line3.textContent : '' }
      ];
      var typed = false;

      function typeTeamTitle() {
        if (typed) return;
        typed = true;
        texts.forEach(function (item) { if (item.el) item.el.textContent = ''; });
        var lineIdx = 0;
        function typeLine() {
          if (lineIdx >= texts.length) return;
          var item = texts[lineIdx];
          var charIdx = 0;
          if (!item.el) { lineIdx++; typeLine(); return; }
          item.el.classList.add('team-typing');
          var interval = setInterval(function () {
            item.el.textContent = item.text.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx >= item.text.length) {
              clearInterval(interval);
              item.el.classList.remove('team-typing');
              lineIdx++;
              setTimeout(typeLine, 200);
            }
          }, 50);
        }
        typeLine();
      }

      // Trigger when section is visible
      var titleObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(typeTeamTitle, 500);
            titleObs.disconnect();
          }
        });
      }, { threshold: 0.3 });
      titleObs.observe(teamSection);
    }

    /* --- 6. SCROLL-driven parallax for orbs --- */
    var orbs = teamSection.querySelectorAll('.team-bg-orb');
    window.addEventListener('scroll', function () {
      var rect = teamSection.getBoundingClientRect();
      var progress = -rect.top / (rect.height || 1);
      orbs.forEach(function (orb, idx) {
        var speed = (idx + 1) * 30;
        orb.style.transform = 'translateY(' + (progress * speed) + 'px)';
      });
    });

    /* --- 7. GLOW trail following mouse on section --- */
    var glowTrail = document.createElement('div');
    glowTrail.className = 'team-mouse-glow';
    teamSection.appendChild(glowTrail);
    teamSection.addEventListener('mousemove', function (e) {
      var rect = teamSection.getBoundingClientRect();
      glowTrail.style.left = (e.clientX - rect.left) + 'px';
      glowTrail.style.top = (e.clientY - rect.top) + 'px';
      glowTrail.style.opacity = '1';
    });
    teamSection.addEventListener('mouseleave', function () {
      glowTrail.style.opacity = '0';
    });

    /* --- 8. CONFETTI explosion on badge click --- */
    if (teamBadge) {
      teamBadge.style.cursor = 'pointer';
      teamBadge.addEventListener('click', function (e) {
        var rect = teamBadge.getBoundingClientRect();
        var sx = rect.left + rect.width / 2;
        var sy = rect.top + rect.height / 2;
        for (var c = 0; c < 50; c++) {
          var conf = document.createElement('span');
          conf.className = 'team-confetti';
          conf.style.left = sx + 'px';
          conf.style.top = sy + 'px';
          conf.style.background = ['#d4a843', '#f5d07a', '#5dd4a8', '#1a7a5e', '#fff1c6', '#c0392b', '#26a97e'][Math.floor(Math.random() * 7)];
          conf.style.setProperty('--cx', ((Math.random() - 0.5) * 400) + 'px');
          conf.style.setProperty('--cy', (-(Math.random() * 300 + 100)) + 'px');
          conf.style.setProperty('--cr', (Math.random() * 1080 - 540) + 'deg');
          conf.style.animationDuration = (0.8 + Math.random() * 0.8) + 's';
          conf.style.width = (4 + Math.random() * 6) + 'px';
          conf.style.height = (4 + Math.random() * 6) + 'px';
          document.body.appendChild(conf);
          conf.addEventListener('animationend', function () { conf.remove(); });
        }
        // Scale bounce
        teamBadge.style.transform = 'scale(1.2)';
        setTimeout(function () { teamBadge.style.transform = ''; }, 300);
      });
    }

    /* --- 9. REVEAL members on scroll with stagger --- */
    var memberObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('team-visible');
          memberObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    teamMembers.forEach(function (m) { memberObs.observe(m); });

    /* --- 10. RANDOM floating emojis --- */
    var emojis = ['✨', '⭐', '🌟', '💫', '🔥', '🎓', '📚', '🏆'];
    setInterval(function () {
      var rect = teamSection.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return; // only when visible
      var emoji = document.createElement('span');
      emoji.className = 'team-float-emoji';
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.left = (Math.random() * 100) + '%';
      emoji.style.fontSize = (12 + Math.random() * 16) + 'px';
      emoji.style.animationDuration = (3 + Math.random() * 3) + 's';
      teamSection.appendChild(emoji);
      emoji.addEventListener('animationend', function () { emoji.remove(); });
    }, 800);

    /* --- 11. NAME GLOW on hover cycle --- */
    teamCards.forEach(function (card) {
      var name = card.querySelector('.team-name');
      if (!name) return;
      card.addEventListener('mouseenter', function () {
        name.classList.add('team-name-glow');
      });
      card.addEventListener('mouseleave', function () {
        name.classList.remove('team-name-glow');
      });
    });

    /* --- 12. IMAGE ring pulse on hover --- */
    teamCards.forEach(function (card) {
      var wrap = card.querySelector('.team-img-wrap');
      if (!wrap) return;
      card.addEventListener('mouseenter', function () {
        var ring = document.createElement('span');
        ring.className = 'team-ring-pulse';
        wrap.appendChild(ring);
        ring.addEventListener('animationend', function () { ring.remove(); });
      });
    });

  })();

})();