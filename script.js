/* ==========================================================================
   LEARN WITH ANUSTUP - INTERACTIVE JAVASCRIPT & ANIMATION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- State & Config ---
    let soundEnabled = true;
    let audioCtx = null;

    // --- 1. Web Audio Synthesizer (Click Sound Effects) ---
    function playClickSound(freq = 600, type = 'sine') {
        if (!soundEnabled) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq / 2, audioCtx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.08);
        } catch (e) {
            // Audio context not allowed or supported
        }
    }

    function playCelebrationSound() {
        if (!soundEnabled) return;
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.2);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(audioCtx.currentTime + idx * 0.08);
                osc.stop(audioCtx.currentTime + idx * 0.08 + 0.2);
            });
        } catch (e) {}
    }

    // Sound Toggle Button
    const soundToggle = document.getElementById('soundToggle');
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundToggle.classList.toggle('muted', !soundEnabled);
        soundToggle.innerHTML = soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
        showToast(soundEnabled ? '🔊 Sound effects enabled' : '🔇 Sound effects muted');
    });

    // --- 2. Global Ripple Click Effect ---
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.btn, .card, .filter-btn, .nav-link, .test-feature-btn, .store-btn');
        if (!target) return;

        playClickSound(700);

        const rect = target.getBoundingClientRect();
        const circle = document.createElement('span');
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('ripple-effect');

        const existingRipple = target.querySelector('.ripple-effect');
        if (existingRipple) existingRipple.remove();

        target.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
    });

    // --- 3. Dark / Light Theme Toggle ---
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('learn_with_anustup_theme');

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('learn_with_anustup_theme', isDark ? 'dark' : 'light');
        playClickSound(900);
        showToast(isDark ? '🌙 Switched to Dark Mode' : '☀️ Switched to Light Mode');
    });

    // --- 4. Sticky Header & Scrollspy ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        // Sticky bar background
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
            scrollTopBtn.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            scrollTopBtn.classList.remove('visible');
        }

        // Active link scrollspy
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 5. Mobile Navigation Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // --- 6. 3D Tilt Card Effect for Hero Visual ---
    const tiltCard = document.getElementById('heroTiltCard');
    if (tiltCard) {
        tiltCard.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        tiltCard.addEventListener('mouseleave', () => {
            tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    }

    // --- 7. Animated Live Counter Stats ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                statNumbers.forEach(stat => {
                    const target = parseFloat(stat.getAttribute('data-target'));
                    const isDecimal = target % 1 !== 0;
                    const duration = 2000;
                    const start = 0;
                    const startTime = performance.now();

                    function updateCount(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const currentVal = start + (target - start) * (1 - Math.pow(1 - progress, 2));

                        if (isDecimal) {
                            stat.innerText = currentVal.toFixed(1);
                        } else {
                            stat.innerText = Math.floor(currentVal).toLocaleString();
                        }

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            stat.innerText = isDecimal ? target.toFixed(1) : target.toLocaleString();
                        }
                    }
                    requestAnimationFrame(updateCount);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) statsObserver.observe(statsSection);

    // --- 8. Course Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            courseCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.style.animation = 'toastIn 0.4s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 9. Quick Search Modal ---
    const searchTrigger = document.getElementById('searchTrigger');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    const courseData = [
        { title: 'Fluent Public Speaking', category: 'Public Speaking', price: '₹3,999', img: 'assets/course_public_speaking.png' },
        { title: 'Outdoor Photography', category: 'Photography', price: '₹2,999', img: 'assets/course_photography.png' },
        { title: 'Typing Master Pro', category: 'Productivity', price: '₹1,999', img: 'assets/course_typing_master.png' },
        { title: 'Fullstack Web Development with Anustup', category: 'Coding', price: '₹4,999', img: 'assets/course_public_speaking.png' },
        { title: 'UI/UX Design Masterclass', category: 'Design', price: '₹3,499', img: 'assets/course_photography.png' }
    ];

    function openSearchModal() {
        searchModal.classList.add('active');
        setTimeout(() => searchInput.focus(), 100);
        renderSearchResults('');
    }

    function closeSearchModal() {
        searchModal.classList.remove('active');
    }

    searchTrigger.addEventListener('click', openSearchModal);
    searchClose.addEventListener('click', closeSearchModal);
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeSearchModal();
    });

    // Keyboard shortcut Ctrl+K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            openSearchModal();
        }
        if (e.key === 'Escape') {
            closeSearchModal();
            closeCourseModal();
            closeVideoModal();
        }
    });

    function renderSearchResults(query) {
        const filtered = courseData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) || 
            item.category.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
            searchResults.innerHTML = `<p style="padding: 16px; text-align: center; color: var(--text-muted);">No matching courses found for "${query}"</p>`;
            return;
        }

        searchResults.innerHTML = filtered.map(item => `
            <div class="search-item" onclick="openCourseDetails('${item.title}')">
                <i class="fa-solid fa-graduation-cap" style="color: #0072ff;"></i>
                <div style="flex-grow: 1;">
                    <strong style="display: block; font-size: 0.95rem;">${item.title}</strong>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${item.category}</span>
                </div>
                <span style="font-weight: 700; color: #0072ff;">${item.price}</span>
            </div>
        `).join('');
    }

    searchInput.addEventListener('input', (e) => {
        renderSearchResults(e.target.value);
    });

    // --- 10. Testimonials Slider ---
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dots = document.querySelectorAll('#sliderDots .dot');
    let currentIndex = 0;

    function showTestimonial(index) {
        testimonialCards.forEach((card, idx) => {
            card.classList.remove('active');
            dots[idx].classList.remove('active');
        });
        currentIndex = (index + testimonialCards.length) % testimonialCards.length;
        testimonialCards[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    prevBtn.addEventListener('click', () => showTestimonial(currentIndex - 1));
    nextBtn.addEventListener('click', () => showTestimonial(currentIndex + 1));
    dots.forEach((dot, idx) => dot.addEventListener('click', () => showTestimonial(idx)));

    // Auto-advance slider every 6s
    let sliderInterval = setInterval(() => showTestimonial(currentIndex + 1), 6000);
    const sliderContainer = document.querySelector('.testimonials-slider-wrapper');
    sliderContainer.addEventListener('mouseenter', () => clearInterval(sliderInterval));
    sliderContainer.addEventListener('mouseleave', () => {
        sliderInterval = setInterval(() => showTestimonial(currentIndex + 1), 6000);
    });

    // --- 11. Interactive App Feature Buttons ---
    document.getElementById('featureReminder')?.addEventListener('click', () => {
        showToast('⏰ Reminder Set! Anustup will notify you for your next study session.');
        playClickSound(800);
    });

    document.getElementById('featureLectures')?.addEventListener('click', () => {
        showToast('📥 Download Started! Lessons saved for offline access.');
        playClickSound(850);
    });

    document.getElementById('featurePro')?.addEventListener('click', () => {
        if (window.confetti) {
            window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
        }
        playCelebrationSound();
        showToast('🎉 Free Pro Pass Unlocked! Enjoy 1-on-1 mentor guidance from Anustup.');
    });

    document.getElementById('googlePlayBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showToast('📱 Redirecting to Google Play Store...');
    });

    document.getElementById('appStoreBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showToast('🍎 Redirecting to Apple App Store...');
    });

    // --- 12. Course Detail Modal & Enrollment Celebration ---
    const courseModal = document.getElementById('courseModal');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalPoints = document.getElementById('modalPoints');
    const modalPrice = document.getElementById('modalPrice');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const modalEnrollBtn = document.getElementById('modalEnrollBtn');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');

    const courseDetailsMap = {
        'Fluent Public Speaking': {
            category: 'Public Speaking',
            price: '₹3,999',
            points: [
                'Overcome stage fright & anxiety in 7 days',
                'Master vocal tone, modulation, and pitch with Anustup',
                'Learn body language secrets of top keynote speakers',
                'Official Certificate of Completion signed by Anustup'
            ]
        },
        'Outdoor Photography': {
            category: 'Photography',
            price: '₹2,999',
            points: [
                'Master DSLR manual focus, ISO, and shutter speed',
                'Understand golden hour & natural light composition',
                'Adobe Lightroom editing workflows by Anustup',
                'Downloadable RAW exercise files'
            ]
        },
        'Typing Master Pro': {
            category: 'Productivity',
            price: '₹1,999',
            points: [
                'Touch typing without looking at keyboard',
                'Achieve 90+ WPM with 98% accuracy',
                'Ergonomic finger placement & wrist posture',
                'Daily speed test challenges & leaderboard'
            ]
        }
    };

    window.openCourseDetails = function(title) {
        closeSearchModal();
        const data = courseDetailsMap[title] || {
            category: 'Featured Course',
            price: '₹3,999',
            points: ['HD Video Lessons by Anustup', 'Interactive Quizzes', 'Lifetime Access', 'Community Forum']
        };

        modalCategory.innerText = data.category;
        modalTitle.innerText = title;
        modalPrice.innerText = data.price;
        modalPoints.innerHTML = data.points.map(p => `<li><i class="fa-solid fa-check-circle"></i> ${p}</li>`).join('');

        courseModal.classList.add('active');
    };

    function closeCourseModal() {
        courseModal.classList.remove('active');
    }

    document.querySelectorAll('.learn-more-btn, .quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const courseKey = btn.getAttribute('data-course');
            let title = 'Fluent Public Speaking';
            if (courseKey === 'photography') title = 'Outdoor Photography';
            if (courseKey === 'typing') title = 'Typing Master Pro';
            openCourseDetails(title);
        });
    });

    document.getElementById('heroStartBtn').addEventListener('click', () => {
        openCourseDetails('Fluent Public Speaking');
    });

    document.getElementById('navEnrollBtn').addEventListener('click', () => {
        openCourseDetails('Fluent Public Speaking');
    });

    modalClose.addEventListener('click', closeCourseModal);
    modalCancelBtn.addEventListener('click', closeCourseModal);
    modalBackdrop.addEventListener('click', closeCourseModal);

    modalEnrollBtn.addEventListener('click', () => {
        closeCourseModal();
        playCelebrationSound();
        if (window.confetti) {
            window.confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
            });
        }
        showToast('🎓 Congratulations! You are enrolled in ' + modalTitle.innerText + ' with Anustup!');
    });

    // --- 13. Video Demo Modal ---
    const videoModal = document.getElementById('videoModal');
    const videoClose = document.getElementById('videoClose');
    const videoBackdrop = document.getElementById('videoBackdrop');
    const videoIframe = document.getElementById('videoIframe');
    const playDemoVideoBtn = document.getElementById('playDemoVideoBtn');

    function openVideoModal() {
        videoIframe.src = 'https://www.youtube.com/embed/Ud_hP2raTmk?autoplay=1';
        videoModal.classList.add('active');
    }

    function closeVideoModal() {
        videoIframe.src = 'about:blank';
        videoModal.classList.remove('active');
    }

    playDemoVideoBtn.addEventListener('click', openVideoModal);
    document.getElementById('videoPlaceholder')?.addEventListener('click', openVideoModal);
    videoClose.addEventListener('click', closeVideoModal);
    videoBackdrop.addEventListener('click', closeVideoModal);

    // --- 14. 5-Star Interactive Rating & Direct Feedback Email System ---
    const starRatingContainer = document.getElementById('starRating');
    const selectedRatingInput = document.getElementById('selectedRating');
    const feedbackForm = document.getElementById('feedbackForm');
    const emailModal = document.getElementById('emailModal');
    const emailRecipient = document.getElementById('emailRecipient');
    const emailClose = document.getElementById('emailClose');
    const emailBackdrop = document.getElementById('emailBackdrop');
    const emailModalDoneBtn = document.getElementById('emailModalDoneBtn');

    function closeEmailModal() {
        if (emailModal) emailModal.classList.remove('active');
    }

    if (emailClose) emailClose.addEventListener('click', closeEmailModal);
    if (emailBackdrop) emailBackdrop.addEventListener('click', closeEmailModal);
    if (emailModalDoneBtn) emailModalDoneBtn.addEventListener('click', closeEmailModal);

    // Interactive Star Hover & Selection Logic
    if (starRatingContainer) {
        const stars = starRatingContainer.querySelectorAll('.star');
        
        stars.forEach((star) => {
            star.addEventListener('click', () => {
                const val = parseInt(star.getAttribute('data-value'));
                if (selectedRatingInput) selectedRatingInput.value = val;
                
                stars.forEach((s) => {
                    const sVal = parseInt(s.getAttribute('data-value'));
                    if (sVal <= val) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });

            star.addEventListener('mouseenter', () => {
                const hoverVal = parseInt(star.getAttribute('data-value'));
                stars.forEach((s) => {
                    const sVal = parseInt(s.getAttribute('data-value'));
                    if (sVal <= hoverVal) {
                        s.style.color = '#ffb703';
                    } else {
                        s.style.color = '#475569';
                    }
                });
            });
        });

        starRatingContainer.addEventListener('mouseleave', () => {
            const currentVal = parseInt(selectedRatingInput ? selectedRatingInput.value : 5);
            stars.forEach((s) => {
                const sVal = parseInt(s.getAttribute('data-value'));
                s.style.color = '';
                if (sVal <= currentVal) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    }

    // Feedback Submission & Direct Email Dispatch to mailrivu.in@gmail.com
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('feedbackEmail');
            const commentInput = document.getElementById('feedbackComment');
            const email = emailInput ? emailInput.value.trim() : '';
            const comment = commentInput ? commentInput.value.trim() : '';
            const rating = selectedRatingInput ? selectedRatingInput.value : '5';

            if (email) {
                playCelebrationSound();
                if (window.confetti) {
                    window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.8 } });
                }
                if (emailRecipient) emailRecipient.innerText = email;
                
                const emailDirectLink = document.getElementById('emailDirectLink');
                if (emailDirectLink) {
                    emailDirectLink.href = `mailto:mailrivu.in@gmail.com?subject=Website%20Feedback%20(${rating}%20Stars)&body=Rating:%20${rating}/5%20Stars%0AUser%20Email:%20${encodeURIComponent(email)}%0AFeedback:%20${encodeURIComponent(comment)}`;
                }

                if (emailModal) emailModal.classList.add('active');

                showToast(`⭐ Dispatching ${rating}-Star Feedback to mailrivu.in@gmail.com...`);

                // Direct HTTPS Email Dispatch to mailrivu.in@gmail.com
                fetch('https://formsubmit.co/ajax/mailrivu.in@gmail.com', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        _subject: `⭐ Website Feedback (${rating}/5 Stars) from ${email}`,
                        rating: `${rating} / 5 Stars`,
                        user_email: email,
                        user_comment: comment,
                        _autoresponse: `Thank you for rating Learn with Anustup ${rating}/5 stars! Here is your free bonus lesson kit: https://youtu.be/Ud_hP2raTmk`
                    })
                })
                .then(res => res.json())
                .then(data => {
                    showToast(`⭐ ${rating}-Star Feedback sent directly to mailrivu.in@gmail.com!`);
                })
                .catch(err => {
                    console.log('Feedback dispatch status:', err);
                    // Local server fallback
                    fetch('http://localhost:8085', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email, rating: rating, comment: comment })
                    }).catch(e => console.log('Local fallback error:', e));
                });

                setTimeout(() => {
                    feedbackForm.reset();
                }, 1000);
            }
        });
    }

    // --- 15. Helper Toast Notification System ---
    function showToast(message) {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #00c6ff;"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastIn 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // --- 16. Service Worker Registration for Offline Capability ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
                .catch(err => console.log('[PWA] Service Worker registration failed:', err));
        });
    }

    // --- 17. Interactive Crafting Hammer & Liquid Filling Heart ---
    const craftWidgets = [
        { 
            heart: document.getElementById('interactiveHeart'), 
            fill: document.getElementById('heartLiquidFill'), 
            hammerBtn: document.getElementById('craftHammerBtn'), 
            hammerIcon: document.getElementById('hammerIcon') 
        },
        { 
            heart: document.getElementById('interactiveHeartTop'), 
            fill: document.getElementById('heartLiquidFillTop'), 
            hammerBtn: document.getElementById('craftHammerBtnTop'), 
            hammerIcon: document.getElementById('hammerIconTop') 
        }
    ];

    craftWidgets.forEach(w => {
        if (w.fill) {
            let strikes = 0;
            const maxStrikes = 5;

            const handleStrike = () => {
                strikes++;
                const fillPercentage = Math.max(0, 100 - (strikes / maxStrikes) * 100);
                w.fill.style.clipPath = `inset(${fillPercentage}% 0 0 0)`;

                if (w.hammerIcon) {
                    w.hammerIcon.classList.remove('striking');
                    void w.hammerIcon.offsetWidth; // Trigger reflow for animation restart
                    w.hammerIcon.classList.add('striking');
                }

                playCelebrationSound();

                if (strikes >= maxStrikes) {
                    if (w.heart) w.heart.classList.add('full-glow');
                    if (window.confetti) {
                        window.confetti({
                            particleCount: 130,
                            spread: 100,
                            origin: { y: 0.9 },
                            colors: ['#ff0044', '#ffb703', '#ffffff']
                        });
                    }
                    showToast("🔨 Crafted with Passion! Heart filled 100% with Glowing Red Liquid!");
                } else {
                    showToast(`🔨 Hammer Strike! Filling heart... (${strikes * 20}%)`);
                }
            };

            if (w.hammerBtn) w.hammerBtn.addEventListener('click', handleStrike);
            if (w.heart) w.heart.addEventListener('click', handleStrike);
        }
    });
});
