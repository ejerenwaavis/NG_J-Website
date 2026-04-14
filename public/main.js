        /* ── LOADER ── */
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('loader').classList.add('done');
            }, 1800);
        });

        /* ── CUSTOM CURSOR ── */
        const cur = document.getElementById('cur');
        const curR = document.getElementById('curR');
        let mx = 0, my = 0, rx = 0, ry = 0;

        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cur.style.left = mx + 'px'; cur.style.top = my + 'px';
        });

        // Ring follows with lag
        (function lerpRing() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            curR.style.left = rx + 'px'; curR.style.top = ry + 'px';
            requestAnimationFrame(lerpRing);
        })();

        document.querySelectorAll('a, button, .stab, .ta-btn').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cur.style.width = '20px'; cur.style.height = '20px';
                curR.style.width = '56px'; curR.style.height = '56px';
            });
            el.addEventListener('mouseleave', () => {
                cur.style.width = '10px'; cur.style.height = '10px';
                curR.style.width = '36px'; curR.style.height = '36px';
            });
        });

        /* ── SCROLL EFFECTS ── */
        const sbar = document.getElementById('sbar');
        const nav = document.getElementById('nav');
        const btt = document.getElementById('btt');
        const floatCTA = document.getElementById('floatCTA');

        window.addEventListener('scroll', () => {
            const sc = window.scrollY;
            const total = document.documentElement.scrollHeight - window.innerHeight;
            sbar.style.transform = `scaleX(${sc / total})`;
            nav.classList.toggle('scrolled', sc > 40);
            btt.classList.toggle('show', sc > 500);
            floatCTA.classList.toggle('show', sc > 500);
        });

        /* ── INTERSECTION OBSERVER ── */
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

        /* ── STAT COUNTERS ── */
        function countUp(el, target, duration = 1600) {
            let start = 0;
            const step = timestamp => {
                if (!start) start = timestamp;
                const prog = Math.min((timestamp - start) / duration, 1);
                const val = Math.floor(prog * target);
                el.textContent = val;
                if (prog < 1) requestAnimationFrame(step);
                else el.textContent = target;
            };
            requestAnimationFrame(step);
        }

        const cntObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    document.querySelectorAll('.cnt').forEach(c => {
                        countUp(c, parseInt(c.dataset.target));
                    });
                    cntObs.disconnect();
                }
            });
        }, { threshold: 0.3 });
        const ss = document.getElementById('stats-strip');
        if (ss) cntObs.observe(ss);

        /* ── PROCESS LINE ANIMATION ── */
        const procObs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                document.getElementById('procFill').style.width = '100%';
                document.querySelectorAll('.ps').forEach((el, i) => {
                    setTimeout(() => el.classList.add('active'), i * 240);
                });
                procObs.disconnect();
            }
        }, { threshold: 0.2 });
        const proc = document.getElementById('process');
        if (proc) procObs.observe(proc);

        /* ── MOBILE NAV ── */
        const burger = document.getElementById('burger');
        const mmenu = document.getElementById('mmenu');
        let navOpen = false;

        function toggleNav() {
            navOpen = !navOpen;
            burger.classList.toggle('open', navOpen);
            mmenu.classList.toggle('open', navOpen);
        }
        function closeNav() {
            navOpen = false;
            burger.classList.remove('open');
            mmenu.classList.remove('open');
        }

        /* ── SERVICE FILTER ── */
        function filterSvc(cat, btn) {
            document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.sc').forEach(card => {
                const cardCat = card.dataset.cat || '';
                if (cat === 'all' || cardCat === cat) {
                    card.style.opacity = '1';
                    card.style.transform = '';
                    card.style.pointerEvents = '';
                } else {
                    card.style.opacity = '0.25';
                    card.style.transform = 'scale(0.97)';
                    card.style.pointerEvents = 'none';
                }
            });
        }

        /* ── TESTIMONIAL SLIDER ── */
        const track = document.getElementById('testiTrack');
        let testiX = 0;
        const CARD_W = 404; // card width + gap

        function slideT(dir) {
            const maxScroll = track.scrollWidth - track.offsetWidth;
            testiX = Math.max(0, Math.min(testiX + dir * CARD_W, maxScroll));
            track.scrollTo({ left: testiX, behavior: 'smooth' });
        }

        /* ── QUOTE CALCULATOR ── */
        const rates = {
            land: { perKg: 180, min: 15000, time: '1-3 days' },
            ocean: { perKg: 65, min: 80000, time: '7-21 days' },
            air: { perKg: 850, min: 50000, time: '1-5 days' },
            warehouse: { perKg: 40, min: 25000, time: 'Flexible' },
        };

        function calcQuote() {
            const svc = document.getElementById('cSvc').value;
            const weight = parseFloat(document.getElementById('cWeight').value) || 0;
            const out = document.getElementById('calcOut');
            const price = document.getElementById('calcPrice');
            const time = document.getElementById('calcTime');

            if (!svc || !weight) {
                alert('Please select a service type and enter cargo weight.');
                return;
            }
            const r = rates[svc];
            const base = Math.max(weight * r.perKg, r.min);
            const lo = Math.round(base * 0.85 / 1000) * 1000;
            const hi = Math.round(base * 1.2 / 1000) * 1000;
            price.textContent = `₦${lo.toLocaleString()} – ₦${hi.toLocaleString()}`;
            time.textContent = r.time;
            out.classList.add('show');
        }

        /* ── CONTACT FORM ── */
        function sendMsg(btn) {
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.65';
            setTimeout(() => {
                document.getElementById('cForm').style.display = 'none';
                const s = document.getElementById('cSuccess');
                s.style.display = 'block';
            }, 1600);
        }
