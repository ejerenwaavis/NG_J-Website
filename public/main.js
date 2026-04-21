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

        function esc(v) {
            return String(v || '').replace(/[&<>'"]/g, m => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[m]));
        }

        function observeNewFadeIns() {
            document.querySelectorAll('.fade-in').forEach(el => {
                if (!el.classList.contains('visible')) obs.observe(el);
            });
        }

        function renderStars(rating) {
            const safeRating = Math.max(1, Math.min(5, Number(rating) || 5));
            return '★'.repeat(safeRating);
        }

        async function loadServices() {
            const grid = document.getElementById('svcGrid');
            if (!grid) return;

            try {
                const res = await fetch('/api/services');
                if (!res.ok) throw new Error('Failed to load services');
                const allServices = await res.json();
                const services = allServices.filter(s => {
                    const cat = (s.category || '').toLowerCase();
                    return !s.enhanced && !['storage', 'project'].includes(cat);
                });

                if (!services.length) {
                    grid.innerHTML = '<p class="body-txt">Service details will be updated shortly.</p>';
                    return;
                }

                grid.innerHTML = services.map((s, idx) => {
                    const cardClass = `sc ${s.wide ? 'wide' : ''} fade-in d${Math.min(idx + 1, 4)}`.trim();
                    return `
                        <div class="${cardClass}">
                            <div class="sc-img" style="background-image:url('${esc(s.image)}')">
                                <span class="sc-chip">${esc(s.chip || 'Service')}</span>
                            </div>
                            <div class="sc-body">
                                <div class="sc-ttl">${esc(s.title)}</div>
                                <div class="sc-desc">${esc(s.description)}</div>
                                <a href="#contact" class="sc-link">Request Service
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    `;
                }).join('');

                observeNewFadeIns();
            } catch (err) {
                grid.innerHTML = '<p class="body-txt">Unable to load services right now.</p>';
            }
        }

        async function loadTeam() {
            const teamGrid = document.getElementById('teamGrid');
            if (!teamGrid) return;

            try {
                const res = await fetch('/api/team');
                if (!res.ok) throw new Error('Failed to load team');
                const members = await res.json();

                if (!members.length) {
                    teamGrid.innerHTML = '<p class="body-txt">Team details will be updated shortly.</p>';
                    return;
                }

                teamGrid.innerHTML = members.map((m, idx) => `
                    <div class="tc fade-in d${Math.min(idx, 4)}">
                        <div class="tc-av" style="background:${esc(m.gradient || 'linear-gradient(135deg,#1A2E4A,#233A5C)')}">${esc(m.initials)}</div>
                        <div class="tc-nm">${esc(m.name)}</div>
                        <div class="tc-role">${esc(m.role)}</div>
                        <div class="tc-bio">${esc(m.bio)}</div>
                    </div>
                `).join('');

                observeNewFadeIns();
            } catch (err) {
                teamGrid.innerHTML = '<p class="body-txt">Unable to load team right now.</p>';
            }
        }

        async function loadTestimonials() {
            const testimonialsTrack = document.getElementById('testiTrack');
            if (!testimonialsTrack) return;

            try {
                const res = await fetch('/api/testimonials');
                if (!res.ok) throw new Error('Failed to load testimonials');
                const testimonials = await res.json();

                if (!testimonials.length) {
                    testimonialsTrack.innerHTML = '<p class="body-txt">Client testimonials will be updated shortly.</p>';
                    return;
                }

                testimonialsTrack.innerHTML = testimonials.map((t, idx) => `
                    <div class="tcard fade-in d${Math.min(idx, 4)}">
                        <div class="tcard-quote">"</div>
                        <div class="stars">${renderStars(t.rating)}</div>
                        <div class="tcard-text">${esc(t.text)}</div>
                        <div class="tcard-author">
                            <div class="ta-av" style="background:${esc(t.color || 'linear-gradient(135deg,#E8520A,#FF6B2B)')}">${esc(t.initials)}</div>
                            <div>
                                <div class="ta-name">${esc(t.name)}</div>
                                <div class="ta-co">${esc(t.role || 'Client')}, ${esc(t.company || 'NG&J Client')}</div>
                            </div>
                        </div>
                    </div>
                `).join('');

                observeNewFadeIns();
            } catch (err) {
                testimonialsTrack.innerHTML = '<p class="body-txt">Unable to load testimonials right now.</p>';
            }
        }

        /* ── STAT COUNTERS ── */
        function getYearsInOperation(foundedYear = 2013) {
            const currentYear = new Date().getFullYear();
            return Math.max(0, currentYear - foundedYear);
        }

        function applyDynamicYearCounters() {
            const years = getYearsInOperation(2013);

            const heroYears = document.getElementById('k1');
            if (heroYears) {
                heroYears.dataset.target = String(years);
                heroYears.textContent = String(years);
            }

            const yearsExpCounter = document.getElementById('yearsExpCnt');
            if (yearsExpCounter) {
                yearsExpCounter.dataset.target = String(years);
            }
        }

        applyDynamicYearCounters();

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

        /* ── TESTIMONIAL SLIDER ── */
        const track = document.getElementById('testiTrack');
        let testiX = 0;
        const CARD_W = 404; // card width + gap

        function slideT(dir) {
            if (!track) return;
            const maxScroll = track.scrollWidth - track.offsetWidth;
            testiX = Math.max(0, Math.min(testiX + dir * CARD_W, maxScroll));
            track.scrollTo({ left: testiX, behavior: 'smooth' });
        }

        /* ── QUOTE CALCULATOR ── */
        const rates = {
            land: { perKg: 180, min: 15000, time: '1-3 days' },
            warehouse: { perKg: 40, min: 25000, time: 'Flexible' },
        };

        document.addEventListener('DOMContentLoaded', () => {
            loadServices();
            loadTeam();
            loadTestimonials();
        });

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

        /* ── HERO TYPEWRITER ── */
        (function heroTypewriter() {
            const words = ['LOAD.', 'DELIVERY.'];
            const el = document.getElementById('heroWord');
            if (!el) return;

            let wordIdx = 0;
            let charIdx = 0;
            let deleting = false;

            const TYPE_SPEED  = 110;  // ms per character typed
            const DEL_SPEED   = 60;   // ms per character deleted
            const PAUSE_END   = 1800; // pause after full word is typed
            const PAUSE_START = 300;  // pause before typing next word

            function tick() {
                const current = words[wordIdx];

                if (!deleting) {
                    // Typing forward
                    charIdx++;
                    el.textContent = current.slice(0, charIdx);

                    if (charIdx === current.length) {
                        // Word fully typed — pause then delete
                        deleting = true;
                        setTimeout(tick, PAUSE_END);
                        return;
                    }
                    setTimeout(tick, TYPE_SPEED);
                } else {
                    // Deleting backward
                    charIdx--;
                    el.textContent = current.slice(0, charIdx);

                    if (charIdx === 0) {
                        // Word fully deleted — move to next word and pause
                        deleting = false;
                        wordIdx = (wordIdx + 1) % words.length;
                        setTimeout(tick, PAUSE_START);
                        return;
                    }
                    setTimeout(tick, DEL_SPEED);
                }
            }

            // Start after the page loader clears (~1.8 s) + a small extra delay
            setTimeout(tick, 2200);
        })();
