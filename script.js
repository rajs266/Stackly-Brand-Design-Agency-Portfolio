

document.addEventListener('DOMContentLoaded', () => {

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links-wrap a, .mobile-drawer-links a').forEach(link => {
        const linkPage = link.getAttribute('href') ? link.getAttribute('href').split('#')[0].split('?')[0] : '';
        const isCurrentPage = linkPage === currentPage || (currentPage === 'index.html' && linkPage === '');
        link.classList.toggle('active', isCurrentPage);
        if (isCurrentPage) link.setAttribute('aria-current', 'page');
    });

    (function initPreloader() {
        const preloader = document.getElementById('stacklyPreloader');
        if (!preloader) return;
        if (window.location.search.includes('nopreloader')) {
            preloader.remove();
            return;
        }

        const fillElem = document.getElementById('preloaderFill');
        const counterElem = document.getElementById('preloaderCounter');
        let percent = 0;
        const totalDuration = 1100;
        const startTime = performance.now();

        function updateLoader(currentTime) {
            const elapsed = currentTime - startTime;
            percent = Math.min(100, Math.floor((elapsed / totalDuration) * 100));

            if (counterElem) counterElem.textContent = `${percent}%`;
            if (fillElem) fillElem.style.width = `${percent}%`;

            if (percent < 100) {
                requestAnimationFrame(updateLoader);
            } else {
                setTimeout(() => {
                    preloader.classList.add('is-loaded');
                    setTimeout(() => {
                        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
                    }, 500);
                }, 150);
            }
        }
        requestAnimationFrame(updateLoader);
    })();

    (function initCyberOpticCursor() {

        function isMobileScreen() {
            return window.innerWidth <= 768;
        }

        let cursorDot = document.querySelector('.custom-cursor-dot');
        if (!cursorDot) {
            cursorDot = document.createElement('div');
            cursorDot.className = 'custom-cursor-dot';
            document.body.appendChild(cursorDot);
        }

        let cursorGyro = document.querySelector('.custom-cursor-gyro');
        if (!cursorGyro) {
            cursorGyro = document.createElement('div');
            cursorGyro.className = 'custom-cursor-gyro';

            const ringInner = document.createElement('div');
            ringInner.className = 'cursor-ring-inner';
            cursorGyro.appendChild(ringInner);

            const ringDashed = document.createElement('div');
            ringDashed.className = 'cursor-ring-dashed';
            cursorGyro.appendChild(ringDashed);

            document.body.appendChild(cursorGyro);
        }

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let currentX = mouseX;
        let currentY = mouseY;
        let prevMouseX = mouseX;
        let prevMouseY = mouseY;
        let velocityX = 0;
        let velocityY = 0;
        let speed = 0;
        let angle = 0;
        let lastSparkleTime = 0;
        let isCursorActive = false;

        window.addEventListener('mousemove', (e) => {
            if (isMobileScreen()) {
                cursorDot.style.display = 'none';
                cursorGyro.style.display = 'none';
                return;
            }

            if (!isCursorActive) {
                isCursorActive = true;
                cursorDot.style.opacity = '1';
                cursorGyro.style.opacity = '1';
            }

            cursorDot.style.display = 'block';
            cursorGyro.style.display = 'flex';

            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

            const now = performance.now();
            if (speed > 3 && (now - lastSparkleTime > 40)) {
                lastSparkleTime = now;
                const spark = document.createElement('div');
                spark.className = 'cursor-stardust';
                const jitterX = (Math.random() - 0.5) * 14;
                const jitterY = (Math.random() - 0.5) * 14;
                spark.style.left = `${mouseX + jitterX}px`;
                spark.style.top = `${mouseY + jitterY}px`;
                document.body.appendChild(spark);
                setTimeout(() => {
                    if (spark.parentNode) spark.parentNode.removeChild(spark);
                }, 650);
            }
        }, { passive: true });

        function updateCursor() {
            if (isMobileScreen()) {
                cursorDot.style.display = 'none';
                cursorGyro.style.display = 'none';
                requestAnimationFrame(updateCursor);
                return;
            }

            velocityX = mouseX - prevMouseX;
            velocityY = mouseY - prevMouseY;
            speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

            if (speed > 0.4) {
                angle = Math.atan2(velocityY, velocityX) * (180 / Math.PI);
            }

            prevMouseX = mouseX;
            prevMouseY = mouseY;

            currentX += (mouseX - currentX) * 0.18;
            currentY += (mouseY - currentY) * 0.18;

            if (!cursorGyro.classList.contains('is-hovering')) {
                cursorGyro.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) rotate(${angle * 0.25}deg)`;
            } else {
                cursorGyro.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(1)`;
            }

            requestAnimationFrame(updateCursor);
        }
        requestAnimationFrame(updateCursor);

        window.addEventListener('click', (e) => {
            if (isMobileScreen()) return;
            const burst = document.createElement('div');
            burst.className = 'cursor-burst';
            burst.style.left = `${e.clientX}px`;
            burst.style.top = `${e.clientY}px`;
            document.body.appendChild(burst);
            setTimeout(() => {
                if (burst.parentNode) burst.parentNode.removeChild(burst);
            }, 550);
        });

        window.addEventListener('touchstart', () => {
            cursorDot.style.display = 'none';
            cursorGyro.style.display = 'none';
        }, { passive: true });

        window.addEventListener('resize', () => {
            if (isMobileScreen()) {
                cursorDot.style.display = 'none';
                cursorGyro.style.display = 'none';
            } else if (isCursorActive) {
                cursorDot.style.display = 'block';
                cursorGyro.style.display = 'flex';
            }
        });

        const interactiveSelector = [
            'a', 'button', 'input', 'select', 'textarea', 'label',
            '[role="button"]',
            '.dash-sidebar-toggle', '.dash-bell-btn', '.dash-nav-home-btn',
            '.dash-menu-link', '.dash-stat-card', '.dash-visual-card',
            '.dash-qa-review-card', '.dash-sec-card', '.dash-tab-btn',
            '.dash-action-btn', '.dash-filter-btn', '.dash-specimen-pill',
            '.dash-status-badge', '.dash-profile-chip', '.dash-notif-item',
            '.dash-milestone-item', '.dash-stage-card', '.dash-member-chip',
            'table tbody tr', '.hero-play-btn', '.calc-chip', '.role-card',
            '.rev-dot', '.password-toggle-btn', '.mobile-menu-toggle',
            '.video-modal-close', '.verdict-filter-pill', '.before-after-wrapper'
        ].join(', ');

        document.addEventListener('mouseover', (e) => {
            if (isMobileScreen()) return;
            const el = e.target.closest(interactiveSelector);
            if (el) {
                cursorGyro.classList.add('is-hovering');
                cursorDot.classList.add('is-hovering');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (isMobileScreen()) return;
            const el = e.target.closest(interactiveSelector);
            if (el) {
                cursorGyro.classList.remove('is-hovering');
                cursorDot.classList.remove('is-hovering');
            }
        });
    })();

    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        });
    }

    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const mobileClose = document.getElementById('mobileDrawerClose');

    if (mobileToggle && mobileDrawer) {
        const openDrawer = () => {
            mobileDrawer.classList.add('is-open');
            document.body.classList.add('menu-open');
            document.documentElement.classList.add('menu-open');
        };

        const closeDrawer = () => {
            mobileDrawer.classList.remove('is-open');
            document.body.classList.remove('menu-open');
            document.documentElement.classList.remove('menu-open');
        };

        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileDrawer.classList.contains('is-open')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });

        if (mobileClose) {
            mobileClose.addEventListener('click', (e) => {
                e.stopPropagation();
                closeDrawer();
            });
        }

        mobileDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeDrawer);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
                closeDrawer();
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (document.body.classList.contains('menu-open')) {
                if (!mobileDrawer.contains(e.target)) {
                    e.preventDefault();
                }
            }
        }, { passive: false });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && mobileDrawer.classList.contains('is-open')) {
                closeDrawer();
            }
        }, { passive: true });
    }

    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('modalVideoPlayer');
    const openVideoBtns = document.querySelectorAll('.hero-play-btn, .open-video-modal');
    const closeVideoBtn = document.getElementById('videoModalClose');

    if (videoModal && videoPlayer) {
        openVideoBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                videoModal.classList.add('is-active');
                videoPlayer.currentTime = 0;
                videoPlayer.play().catch(() => {});
            });
        });

        const closeVideo = () => {
            videoModal.classList.remove('is-active');
            videoPlayer.pause();
        };

        if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideo);

        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideo();
        });
    }

    const animObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
    });

    const animTargets = document.querySelectorAll('.anim-slide-up, .anim-slide-down, .anim-slide-left, .anim-slide-right, .anim-zoom-in, .anim-flip');
    animTargets.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88) {
            el.classList.add('is-visible');
        } else {
            animObserver.observe(el);
        }
    });

    const stickySection = document.querySelector('.sticky-split-container');
    const scrollCards = document.querySelectorAll('.scroll-stack-card');
    if (stickySection && scrollCards.length > 0) {
        window.addEventListener('scroll', () => {
            const winMid = window.innerHeight * 0.55;
            scrollCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top <= winMid && rect.bottom >= winMid) {
                    scrollCards.forEach(c => c.classList.remove('is-active'));
                    card.classList.add('is-active');
                }
            });
        });
    }

    const expandItems = document.querySelectorAll('.expand-card-item');
    if (expandItems.length > 0) {
        expandItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                expandItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
            item.addEventListener('click', (e) => {
                if (e.target.closest('a')) return;
                expandItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    const calcCard = document.querySelector('.brand-calculator-card');
    if (calcCard) {
        const deliverableChips = document.querySelectorAll('.calc-chip[data-service]');
        const stageChips = document.querySelectorAll('.calc-chip[data-stage]');
        const timelineSlider = document.getElementById('calcTimelineSlider');
        const priceDisplay = document.getElementById('calcPriceDisplay');
        const timelineDisplay = document.getElementById('calcTimelineDisplay');

        const serviceCosts = {
            'identity': 18000,
            'digital': 24000,
            'packaging': 14000,
            'motion': 16000
        };

        const stageMultipliers = {
            'startup': 0.85,
            'growth': 1.0,
            'enterprise': 1.45
        };

        function recalculate() {
            let baseTotal = 0;
            let activeServicesCount = 0;
            deliverableChips.forEach(chip => {
                if (chip.classList.contains('active')) {
                    const key = chip.getAttribute('data-service');
                    baseTotal += serviceCosts[key] || 15000;
                    activeServicesCount++;
                }
            });

            if (activeServicesCount === 0) baseTotal = 18000;

            let stageMultiplier = 1.0;
            const activeStage = document.querySelector('.calc-chip[data-stage].active');
            if (activeStage) {
                const stageKey = activeStage.getAttribute('data-stage');
                stageMultiplier = stageMultipliers[stageKey] || 1.0;
            }

            const weeks = timelineSlider ? parseInt(timelineSlider.value, 10) : 8;

            const rushMultiplier = weeks <= 5 ? 1.2 : weeks >= 10 ? 0.95 : 1.0;

            const finalEstimate = Math.round((baseTotal * stageMultiplier * rushMultiplier) / 500) * 500;

            if (priceDisplay) {
                priceDisplay.textContent = `$${finalEstimate.toLocaleString()}`;
            }
            if (timelineDisplay) {
                timelineDisplay.innerHTML = `<i class="fas fa-calendar-alt"></i> Estimated Sprint: ${weeks} Weeks`;
            }
        }

        deliverableChips.forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('active');
                recalculate();
            });
        });

        stageChips.forEach(chip => {
            chip.addEventListener('click', () => {
                stageChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                recalculate();
            });
        });

        if (timelineSlider) {
            timelineSlider.addEventListener('input', recalculate);
        }

        recalculate();
    }

    const revTrack = document.getElementById('reviewsTrack');
    const revDots = document.querySelectorAll('.rev-dot');
    let currentRevSlide = 0;
    let revInterval;

    function setRevSlide(index) {
        if (!revTrack) return;
        currentRevSlide = index;
        revTrack.style.transform = `translateX(-${index * 33.333}%)`;
        revDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        resetRevInterval();
    }

    function resetRevInterval() {
        clearInterval(revInterval);
        revInterval = setInterval(() => {
            if (!revTrack) return;
            const nextIndex = (currentRevSlide + 1) % 3;
            setRevSlide(nextIndex);
        }, 6000);
    }

    if (revTrack) {
        revDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => setRevSlide(idx));
        });
        resetRevInterval();
    }

    const setupPasswordToggle = (toggleBtnId, inputId) => {
        const toggleBtn = document.getElementById(toggleBtnId);
        const input = document.getElementById(inputId);
        if (toggleBtn && input) {
            toggleBtn.addEventListener('click', () => {
                const isPass = input.getAttribute('type') === 'password';
                input.setAttribute('type', isPass ? 'text' : 'password');
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.className = isPass ? 'fas fa-eye-slash' : 'fas fa-eye';
                }
            });
        }
    };
    setupPasswordToggle('togglePassword', 'signinPassword');
    setupPasswordToggle('togglePassword', 'signupPassword');
    setupPasswordToggle('toggleConfirmPassword', 'signupConfirmPassword');

    const roleCards = document.querySelectorAll('.role-card');
    const selectedRoleInput = document.getElementById('selectedRole');
    if (roleCards.length > 0) {
        roleCards.forEach(card => {
            card.addEventListener('click', () => {
                roleCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                const role = card.getAttribute('data-role') || 'client';
                if (selectedRoleInput) selectedRoleInput.value = role;
            });
        });
    }

    const setFormError = (boxId, errorId, message) => {
        const box = document.getElementById(boxId);
        const err = document.getElementById(errorId);
        if (box && err) {
            box.classList.add('has-error');
            err.textContent = message;
        }
    };

    const clearFormError = (boxId, errorId) => {
        const box = document.getElementById(boxId);
        const err = document.getElementById(errorId);
        if (box && err) {
            box.classList.remove('has-error');
            err.textContent = '';
        }
    };

    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        const nameInput = document.getElementById('signinName');
        const emailInput = document.getElementById('signinEmail');
        const passInput = document.getElementById('signinPassword');

        if (nameInput) {
            nameInput.addEventListener('input', () => {
                const val = nameInput.value.trim();
                if (!val) {
                    setFormError('nameBox', 'nameError', 'Full name is required.');
                } else if (!/^[A-Za-z\s]+$/.test(val)) {
                    setFormError('nameBox', 'nameError', 'Name must contain letters only (no numbers/symbols).');
                } else if (val.length < 2) {
                    setFormError('nameBox', 'nameError', 'Name must be at least 2 characters.');
                } else {
                    clearFormError('nameBox', 'nameError');
                }
            });
        }

        if (emailInput) {
            emailInput.addEventListener('input', () => {
                const val = emailInput.value.trim();
                if (!val) {
                    setFormError('emailBox', 'emailError', 'Email address is required.');
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
                    setFormError('emailBox', 'emailError', 'Please enter a valid email address.');
                } else {
                    clearFormError('emailBox', 'emailError');
                }
            });
        }

        if (passInput) {
            passInput.addEventListener('input', () => {
                if (passInput.value.length < 6) {
                    setFormError('passwordBox', 'passwordError', 'Password must be at least 6 characters.');
                } else {
                    clearFormError('passwordBox', 'passwordError');
                }
            });
        }

        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const nameVal = nameInput ? nameInput.value.trim() : '';
            const emailVal = emailInput ? emailInput.value.trim() : '';
            const passVal = passInput ? passInput.value : '';
            const roleVal = selectedRoleInput ? selectedRoleInput.value : 'client';

            if (!nameVal || !/^[A-Za-z\s]+$/.test(nameVal) || nameVal.length < 2) {
                setFormError('nameBox', 'nameError', 'Please enter a valid name (letters only).');
                if (isValid && nameInput) nameInput.focus();
                isValid = false;
            }

            if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailVal)) {
                setFormError('emailBox', 'emailError', 'Please enter a valid business email.');
                if (isValid && emailInput) emailInput.focus();
                isValid = false;
            }

            if (!passVal || passVal.length < 6) {
                setFormError('passwordBox', 'passwordError', 'Password must be at least 6 characters.');
                if (isValid && passInput) passInput.focus();
                isValid = false;
            }

            if (!isValid) return;

            localStorage.setItem('stackly_user_name', nameVal);
            localStorage.setItem('stackly_user_email', emailVal);
            localStorage.setItem('stackly_user_role', roleVal);

            const signinModal = document.getElementById('signinSuccessModal');
            const targetUrl = roleVal === 'admin' ? 'admin-dashboard.html' : 'customer-dashboard.html';

            if (signinModal) {
                signinModal.classList.add('is-active');
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 1300);
            } else {
                window.location.href = targetUrl;
            }
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const nameInput = document.getElementById('signupName');
        const emailInput = document.getElementById('signupEmail');
        const phoneInput = document.getElementById('signupPhone');
        const passInput = document.getElementById('signupPassword');
        const confirmInput = document.getElementById('signupConfirmPassword');
        const termsCheck = document.getElementById('termsCheck');
        const successModal = document.getElementById('signupSuccessModal');

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const nameVal = nameInput ? nameInput.value.trim() : '';
            const emailVal = emailInput ? emailInput.value.trim() : '';
            const phoneVal = phoneInput ? phoneInput.value.trim() : '';
            const passVal = passInput ? passInput.value : '';
            const confirmVal = confirmInput ? confirmInput.value : '';
            const roleVal = selectedRoleInput ? selectedRoleInput.value : 'client';

            if (!nameVal || !/^[A-Za-z\s]+$/.test(nameVal) || nameVal.length < 2) {
                setFormError('nameBox', 'nameError', 'Please enter a valid name (letters only).');
                if (isValid && nameInput) nameInput.focus();
                isValid = false;
            } else {
                clearFormError('nameBox', 'nameError');
            }

            if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailVal)) {
                setFormError('emailBox', 'emailError', 'Please enter a valid business email.');
                if (isValid && emailInput) emailInput.focus();
                isValid = false;
            } else {
                clearFormError('emailBox', 'emailError');
            }

            if (phoneVal && !/^[\+]?[0-9\s\-()]{7,20}$/.test(phoneVal)) {
                setFormError('phoneBox', 'phoneError', 'Please enter a valid phone number.');
                if (isValid && phoneInput) phoneInput.focus();
                isValid = false;
            } else {
                clearFormError('phoneBox', 'phoneError');
            }

            if (!passVal || passVal.length < 6) {
                setFormError('passwordBox', 'passwordError', 'Password must be at least 6 characters.');
                if (isValid && passInput) passInput.focus();
                isValid = false;
            } else {
                clearFormError('passwordBox', 'passwordError');
            }

            if (!confirmVal || confirmVal !== passVal) {
                setFormError('confirmPasswordBox', 'confirmPasswordError', 'Passwords do not match.');
                if (isValid && confirmInput) confirmInput.focus();
                isValid = false;
            } else {
                clearFormError('confirmPasswordBox', 'confirmPasswordError');
            }

            if (termsCheck && !termsCheck.checked) {
                setFormError('termsBox', 'termsError', 'You must agree to the Terms of Service to register.');
                isValid = false;
            } else {
                clearFormError('termsBox', 'termsError');
            }

            if (!isValid) return;

            localStorage.setItem('stackly_user_name', nameVal);
            localStorage.setItem('stackly_user_email', emailVal);
            localStorage.setItem('stackly_user_role', roleVal);

            if (successModal) {
                successModal.classList.add('is-active');
                setTimeout(() => {
                    window.location.href = 'signin.html';
                }, 1500);
            } else {
                window.location.href = 'signin.html';
            }
        });
    }

    window.addEventListener('pageshow', () => {
        document.querySelectorAll('.success-modal-backdrop').forEach(modal => {
            modal.classList.remove('is-active');
        });
    });
    window.addEventListener('popstate', () => {
        document.querySelectorAll('.success-modal-backdrop').forEach(modal => {
            modal.classList.remove('is-active');
        });
    });

    const contactForm = document.getElementById('mainContactForm');
    const contactSuccessModal = document.getElementById('contactSuccessModal');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const name = document.getElementById('contactName');
            const email = document.getElementById('contactEmail');
            const phone = document.getElementById('contactPhone');
            const message = document.getElementById('contactMessage');

            const nameVal = name ? name.value.trim() : '';
            const emailVal = email ? email.value.trim() : '';
            const phoneVal = phone ? phone.value.trim() : '';
            const messageVal = message ? message.value.trim() : '';

            if (!nameVal || !/^[A-Za-z\s]+$/.test(nameVal)) {
                setFormError('nameBox', 'nameError', 'Name must contain letters only.');
                isValid = false;
            } else {
                clearFormError('nameBox', 'nameError');
            }

            if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailVal)) {
                setFormError('emailBox', 'emailError', 'Please enter a valid email.');
                isValid = false;
            } else {
                clearFormError('emailBox', 'emailError');
            }

            if (phoneVal && !/^[\+]?[0-9\s\-()]{7,20}$/.test(phoneVal)) {
                setFormError('phoneBox', 'phoneError', 'Please enter a valid phone number.');
                isValid = false;
            } else {
                clearFormError('phoneBox', 'phoneError');
            }

            if (!messageVal || messageVal.length < 10) {
                setFormError('messageBox', 'messageError', 'Message must be at least 10 characters.');
                isValid = false;
            } else {
                clearFormError('messageBox', 'messageError');
            }

            if (!isValid) return;

            window.location.href = '404.html';
        });
    }

    (function initCustomSelects() {
        const selectWrappers = document.querySelectorAll('.cstm-select');
        if (!selectWrappers.length) return;

        function closeAllSelects(except) {
            selectWrappers.forEach(wrapper => {
                if (wrapper === except) return;
                wrapper.setAttribute('aria-expanded', 'false');
                const trigger = wrapper.querySelector('.cstm-select-trigger');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
                const parentBox = wrapper.closest('.form-input-box');
                if (parentBox) {
                    parentBox.style.zIndex = '';
                    parentBox.style.position = '';
                }
            });
        }

        selectWrappers.forEach(wrapper => {
            const trigger = wrapper.querySelector('.cstm-select-trigger');
            const list = wrapper.querySelector('.cstm-select-list');
            const valSpan = wrapper.querySelector('.cstm-select-val');
            const parentBox = wrapper.closest('.form-input-box');

            const hiddenInput = wrapper.querySelector('input[type="hidden"]') ||
                (wrapper.previousElementSibling && wrapper.previousElementSibling.type === 'hidden' ? wrapper.previousElementSibling : null);

            if (!trigger || !list) return;

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = wrapper.getAttribute('aria-expanded') === 'true';
                closeAllSelects(wrapper);
                const nextState = !isOpen;
                wrapper.setAttribute('aria-expanded', nextState ? 'true' : 'false');
                trigger.setAttribute('aria-expanded', nextState ? 'true' : 'false');
                if (parentBox) {
                    parentBox.style.zIndex = nextState ? '60' : '';
                    parentBox.style.position = nextState ? 'relative' : '';
                }
            });

            const opts = list.querySelectorAll('.cstm-opt');
            opts.forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const val = opt.getAttribute('data-value');
                    const labelSpan = opt.querySelector('span');
                    const label = labelSpan ? labelSpan.textContent.trim() : opt.textContent.trim();

                    if (valSpan) {
                        valSpan.textContent = label;
                        valSpan.classList.remove('cstm-placeholder');
                    }

                    if (hiddenInput) {
                        hiddenInput.value = val;
                        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    opts.forEach(o => {
                        o.classList.remove('active');
                        o.setAttribute('aria-selected', 'false');
                    });
                    opt.classList.add('active');
                    opt.setAttribute('aria-selected', 'true');

                    wrapper.setAttribute('aria-expanded', 'false');
                    trigger.setAttribute('aria-expanded', 'false');
                    if (parentBox) {
                        parentBox.style.zIndex = '';
                        parentBox.style.position = '';
                    }
                    trigger.focus();
                });
            });

            trigger.addEventListener('keydown', (e) => {
                const isOpen = wrapper.getAttribute('aria-expanded') === 'true';
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (!isOpen) {
                        closeAllSelects(wrapper);
                        wrapper.setAttribute('aria-expanded', 'true');
                        trigger.setAttribute('aria-expanded', 'true');
                        if (parentBox) {
                            parentBox.style.zIndex = '60';
                            parentBox.style.position = 'relative';
                        }
                    }
                    const activeOpt = list.querySelector('.cstm-opt.active') || opts[0];
                    let nextOpt = null;
                    if (e.key === 'ArrowDown') {
                        nextOpt = activeOpt ? (activeOpt.nextElementSibling || opts[0]) : opts[0];
                    } else {
                        nextOpt = activeOpt ? (activeOpt.previousElementSibling || opts[opts.length - 1]) : opts[opts.length - 1];
                    }
                    if (nextOpt) {
                        nextOpt.click();
                        wrapper.setAttribute('aria-expanded', 'true');
                        trigger.setAttribute('aria-expanded', 'true');
                        if (parentBox) {
                            parentBox.style.zIndex = '60';
                            parentBox.style.position = 'relative';
                        }
                    }
                } else if (e.key === 'Enter' || e.key === ' ') {
                    if (isOpen) {
                        e.preventDefault();
                        wrapper.setAttribute('aria-expanded', 'false');
                        trigger.setAttribute('aria-expanded', 'false');
                        if (parentBox) {
                            parentBox.style.zIndex = '';
                            parentBox.style.position = '';
                        }
                    }
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cstm-select')) {
                closeAllSelects(null);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllSelects(null);
            }
        });
    })();

    const storedName = localStorage.getItem('stackly_user_name');
    const storedEmail = localStorage.getItem('stackly_user_email');

    if (storedName) {
        document.querySelectorAll('.user-display-name').forEach(el => el.textContent = storedName);
        document.querySelectorAll('.user-display-avatar').forEach(el => el.textContent = storedName.charAt(0).toUpperCase());
    }
    if (storedEmail) {
        document.querySelectorAll('.user-display-email').forEach(el => el.textContent = storedEmail);
    }

    const dashSidebarToggle = document.getElementById('dashSidebarToggle');
    const dashSidebar = document.querySelector('.dash-sidebar');
    const dashBackdrop = document.getElementById('dashSidebarBackdrop');
    let dashScrollY = 0;

    function openDashSidebar() {
        if (dashSidebar) dashSidebar.classList.add('is-open');
        if (dashBackdrop) dashBackdrop.classList.add('is-active');
        if (dashSidebarToggle) dashSidebarToggle.classList.add('is-active');

        dashScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        document.body.style.top = `-${dashScrollY}px`;
        document.body.classList.add('dash-scroll-locked');
    }

    function closeDashSidebar() {
        if (dashSidebar) dashSidebar.classList.remove('is-open');
        if (dashBackdrop) dashBackdrop.classList.remove('is-active');
        if (dashSidebarToggle) dashSidebarToggle.classList.remove('is-active');

        if (document.body.classList.contains('dash-scroll-locked')) {
            document.body.classList.remove('dash-scroll-locked');
            document.body.style.top = '';
            window.scrollTo(0, dashScrollY);
        }
    }

    if (dashSidebarToggle) {
        dashSidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (dashSidebar && dashSidebar.classList.contains('is-open')) {
                closeDashSidebar();
            } else {
                openDashSidebar();
            }
        });
    }

    if (dashBackdrop) {
        dashBackdrop.addEventListener('click', closeDashSidebar);
        dashBackdrop.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            closeDashSidebar();
        }
    });

    const dashTabLinks = document.querySelectorAll('.dash-menu-link[data-tab]');
    const dashPanes = document.querySelectorAll('.dash-tab-pane');

    if (dashTabLinks.length > 0 && dashPanes.length > 0) {
        dashTabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = link.getAttribute('data-tab');

                dashTabLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                dashPanes.forEach(pane => {
                    pane.classList.toggle('active', pane.id === `tab-${targetTab}`);
                });

                closeDashSidebar();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    const pipelineFilterBtns = document.querySelectorAll('.dash-pipeline-filter-btn');
    const pipelineCards = document.querySelectorAll('.dash-rfp-card');
    if (pipelineFilterBtns.length > 0 && pipelineCards.length > 0) {
        pipelineFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterVal = btn.getAttribute('data-pipeline-filter') || 'all';
                pipelineFilterBtns.forEach(b => {
                    b.classList.remove('btn-accent');
                    b.classList.add('btn-outline');
                });
                btn.classList.add('btn-accent');
                btn.classList.remove('btn-outline');

                pipelineCards.forEach(card => {
                    const categories = (card.getAttribute('data-pipeline-cat') || '').split(' ');
                    if (filterVal === 'all' || categories.includes(filterVal)) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInPane 0.25s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    const teamFilterBtns = document.querySelectorAll('.dash-team-filter-btn');
    const teamCards = document.querySelectorAll('.dash-team-card');
    if (teamFilterBtns.length > 0 && teamCards.length > 0) {
        teamFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterVal = btn.getAttribute('data-team-filter') || 'all';
                teamFilterBtns.forEach(b => {
                    b.classList.remove('btn-accent');
                    b.classList.add('btn-outline');
                });
                btn.classList.add('btn-accent');
                btn.classList.remove('btn-outline');

                teamCards.forEach(card => {
                    const roles = (card.getAttribute('data-team-role') || '').split(' ');
                    if (filterVal === 'all' || roles.includes(filterVal)) {
                        card.style.display = 'flex';
                        card.style.animation = 'fadeInPane 0.25s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    const dashBellBtn = document.getElementById('dashBellBtn');
    const dashNotifDropdown = document.getElementById('dashNotifDropdown');
    if (dashBellBtn && dashNotifDropdown) {
        dashBellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dashNotifDropdown.classList.toggle('is-open');
        });

        document.addEventListener('click', (e) => {
            if (!dashNotifDropdown.contains(e.target) && e.target !== dashBellBtn) {
                dashNotifDropdown.classList.remove('is-open');
            }
        });
    }

    const logoutTriggers = document.querySelectorAll('.dash-logout-btn');
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

    if (logoutModal && logoutTriggers.length > 0) {
        logoutTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                logoutModal.classList.add('is-active');
            });
        });

        if (cancelLogoutBtn) {
            cancelLogoutBtn.addEventListener('click', () => {
                logoutModal.classList.remove('is-active');
            });
        }

        if (confirmLogoutBtn) {
            confirmLogoutBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) logoutModal.classList.remove('is-active');
        });
    }

    const filterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');
    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter') || 'all';

                projectCards.forEach(card => {
                    const cat = card.getAttribute('data-category');
                    if (filter === 'all' || cat === filter) {
                        card.style.display = 'flex';
                        card.classList.add('is-visible');
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    const clockElements = document.querySelectorAll('.studio-clock-time[data-tz]');
    if (clockElements.length > 0) {
        function updateStudioClocks() {
            const now = new Date();
            clockElements.forEach(el => {
                const tz = el.getAttribute('data-tz');
                try {
                    el.textContent = now.toLocaleTimeString('en-US', {
                        timeZone: tz,
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                } catch (e) {
                    el.textContent = now.toTimeString().split(' ')[0];
                }
            });
        }
        updateStudioClocks();
        setInterval(updateStudioClocks, 1000);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const tiltTargets = document.querySelectorAll('.project-card, .dock-card-accent, .scroll-stack-card, .dash-stat-card, .trophy-card, .tilt-card-3d');
    tiltTargets.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (((y - centerY) / centerY) * -4).toFixed(2);
            const rotateY = (((x - centerX) / centerX) * 5).toFixed(2);

            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const sliderWrap = document.querySelector('.before-after-wrapper');
    if (!sliderWrap) return;

    const afterWrap = sliderWrap.querySelector('.after-img-wrap');
    const divider = sliderWrap.querySelector('.before-after-divider');
    const handle = sliderWrap.querySelector('.before-after-handle');
    const afterImg = afterWrap ? afterWrap.querySelector('img') : null;
    let isDragging = false;

    function syncImgWidth() {
        if (sliderWrap && afterImg) {
            afterImg.style.width = `${sliderWrap.offsetWidth}px`;
        }
    }
    syncImgWidth();
    window.addEventListener('resize', syncImgWidth);

    function updateSlider(clientX) {
        const rect = sliderWrap.getBoundingClientRect();
        let offsetX = clientX - rect.left;
        if (offsetX < 0) offsetX = 0;
        if (offsetX > rect.width) offsetX = rect.width;

        const percentage = (offsetX / rect.width) * 100;
        if (afterWrap) afterWrap.style.width = `${percentage}%`;
        if (divider) divider.style.left = `${percentage}%`;
    }

    const startDragging = (clientX) => {
        isDragging = true;
        updateSlider(clientX);
    };

    const stopDragging = () => {
        isDragging = false;
    };

    sliderWrap.addEventListener('mousedown', (e) => {
        startDragging(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
    });

    window.addEventListener('mouseup', stopDragging);

    sliderWrap.addEventListener('touchstart', (e) => {
        if (e.touches[0]) startDragging(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging || !e.touches[0]) return;
        updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', stopDragging);
    window.addEventListener('touchcancel', stopDragging);
});

document.addEventListener('DOMContentLoaded', () => {
    const flipCards = document.querySelectorAll('.flip-card, .flip-card-3d');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const counterElements = document.querySelectorAll('.counter-number[data-target]');
    if (counterElements.length === 0) return;

    const countObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.getAttribute('data-target'));
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 1800;
                const startTime = performance.now();

                function step(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const currentVal = Math.floor(target * ease);

                    el.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
                    }
                }
                requestAnimationFrame(step);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.2 });

    counterElements.forEach(el => countObserver.observe(el));
});

document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.agency-carousel');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-slides-wrapper');
        const slides = carousel.querySelectorAll('.carousel-slide-item');
        const prevBtn = carousel.parentElement ?
            carousel.parentElement.querySelector('.carousel-arrow-btn.prev, .carousel-prev-btn, .carousel-nav-arrows .prev') || carousel.querySelector('.carousel-arrow-btn.prev, .carousel-prev-btn') : null;
        const nextBtn = carousel.parentElement ?
            carousel.parentElement.querySelector('.carousel-arrow-btn.next, .carousel-next-btn, .carousel-nav-arrows .next') || carousel.querySelector('.carousel-arrow-btn.next, .carousel-next-btn') : null;
        const dotsContainer = carousel.parentElement ?
            carousel.parentElement.querySelector('.carousel-dots-row') || carousel.querySelector('.carousel-dots-row') : null;

        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        let autoPlayTimer = null;

        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, idx) => {
                const dot = document.createElement('div');
                dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => goToSlide(idx));
                dotsContainer.appendChild(dot);
            });
        }

        function updateDots() {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }

        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
                resetAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
                resetAutoPlay();
            });
        }

        function startAutoPlay() {
            if (carousel.dataset.autoplay === 'false') return;
            autoPlayTimer = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 5500);
        }

        function resetAutoPlay() {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
            startAutoPlay();
        }

        carousel.addEventListener('mouseenter', () => {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
        });

        carousel.addEventListener('mouseleave', resetAutoPlay);

        startAutoPlay();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.agency-accordion');
    accordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.accordion-item');
        items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            if (!header || !content) return;

            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                items.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        const otherContent = other.querySelector('.accordion-content');
                        if (otherContent) otherContent.style.maxHeight = null;
                    }
                });

                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 30 + 'px';
                } else {
                    item.classList.remove('active');
                    content.style.maxHeight = null;
                }
            });
        });

        const firstItem = items[0];
        if (firstItem && accordion.dataset.openFirst !== 'false') {
            firstItem.classList.add('active');
            const firstContent = firstItem.querySelector('.accordion-content');
            if (firstContent) {
                setTimeout(() => {
                    firstContent.style.maxHeight = firstContent.scrollHeight + 30 + 'px';
                }, 200);
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.projects-grid .project-card, .projects-grid article');

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = '';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.specimen-tab-trigger');
    const imgElem = document.getElementById('specimenImg');
    const badgeElem = document.getElementById('specimenBadge');
    const catElem = document.getElementById('specimenCat');
    const titleElem = document.getElementById('specimenTitle');
    const descElem = document.getElementById('specimenDesc');
    const k1TitleElem = document.getElementById('specK1Title');
    const k1ValElem = document.getElementById('specK1Val');
    const k2TitleElem = document.getElementById('specK2Title');
    const k2ValElem = document.getElementById('specK2Val');
    const k3TitleElem = document.getElementById('specK3Title');
    const k3ValElem = document.getElementById('specK3Val');

    if (!tabs.length || !imgElem) return;

    const specimenData = [
        {
            img: 'assets/images/studio_materials.webp',
            badge: '<i class="fas fa-microscope"></i> LAB AUDITED • SPEC 01',
            cat: 'TACTILE SUBSTRATE',
            title: 'FSC 900gsm Uncoated Cotton Board',
            desc: 'Triple-ply organic cotton stock mill-certified for deep blind debossing and edge gilding.',
            k1Title: 'Grammage',
            k1Val: '900 GSM Heavy',
            k2Title: 'Deboss Depth',
            k2Val: '0.85mm Calibrated',
            k3Title: 'Sustainability',
            k3Val: '100% Recycled FSC'
        },
        {
            img: 'assets/images/mockup_stationery.webp',
            badge: '<i class="fas fa-certificate"></i> FINISHING RIG • SPEC 02',
            cat: 'PRECISION TOOLING',
            title: '24K Micro-Etched Metallic Hot Foil',
            desc: 'Micro-tolerance copper die stamping reflecting ambient light without flaking or degradation.',
            k1Title: 'Foil Purity',
            k1Val: '24K Gold Alloy',
            k2Title: 'Die Precision',
            k2Val: '±0.05mm Micro Cut',
            k3Title: 'Adhesion',
            k3Val: 'Zero-Flake Thermal'
        },
        {
            img: 'assets/images/hero_creative_workspace.webp',
            badge: '<i class="fas fa-font"></i> FOUNDRY AXES • SPEC 03',
            cat: 'PROPRIETARY TYPEFACE',
            title: 'Custom Variable Optical Font Family',
            desc: 'Algorithmic letterforms engineered with responsive weight axes for bespoke brand ownership.',
            k1Title: 'Weight Axis',
            k1Val: '100–900 Variable',
            k2Title: 'Glyph Count',
            k2Val: '940+ Latin Glyphs',
            k3Title: 'Format',
            k3Val: 'Variable WOFF2'
        },
        {
            img: 'assets/images/service_packaging.webp',
            badge: '<i class="fas fa-cubes"></i> UNBOXING RIG • SPEC 04',
            cat: 'STRUCTURAL CRAFT',
            title: 'Custom Rigid Box & Magnetic Closure',
            desc: 'Precision CAD dielines with concealed neodymium magnets for a luxury tactile unboxing experience.',
            k1Title: 'CAD Tolerance',
            k1Val: '±0.1mm Accuracy',
            k2Title: 'Locking Rig',
            k2Val: 'Neodymium Magnetic',
            k3Title: 'Box Core',
            k3Val: '2.5mm Rigid Core'
        }
    ];

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const idx = parseInt(tab.getAttribute('data-specimen') || '0', 10);
            const data = specimenData[idx];
            if (!data) return;

            const panel = document.getElementById('specimenPanel');
            if (panel) panel.style.opacity = '0.6';
            setTimeout(() => {
                imgElem.src = data.img;
                badgeElem.innerHTML = data.badge;
                catElem.textContent = data.cat;
                titleElem.textContent = data.title;
                descElem.textContent = data.desc;
                if (k1TitleElem) k1TitleElem.textContent = data.k1Title;
                if (k1ValElem) k1ValElem.textContent = data.k1Val;
                if (k2TitleElem) k2TitleElem.textContent = data.k2Title;
                if (k2ValElem) k2ValElem.textContent = data.k2Val;
                if (k3TitleElem) k3TitleElem.textContent = data.k3Title;
                if (k3ValElem) k3ValElem.textContent = data.k3Val;
                if (panel) panel.style.opacity = '1';
            }, 120);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('verdictsMultiTrack');
    const prevBtn = document.getElementById('prevVerdictsBtn');
    const nextBtn = document.getElementById('nextVerdictsBtn');
    const indicators = document.querySelectorAll('.verdict-indicator-btn');
    const decks = document.querySelectorAll('.verdicts-deck-page');

    if (!track || decks.length === 0) return;

    let currentDeck = 0;
    const totalDecks = decks.length;
    let autoSlideTimer = null;

    function goToDeck(idx) {
        currentDeck = (idx + totalDecks) % totalDecks;
        track.style.transform = `translateX(-${currentDeck * 100}%)`;
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === currentDeck);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToDeck(currentDeck - 1);
            resetAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToDeck(currentDeck + 1);
            resetAutoSlide();
        });
    }

    indicators.forEach(ind => {
        ind.addEventListener('click', () => {
            const targetIdx = parseInt(ind.getAttribute('data-deck') || '0', 10);
            goToDeck(targetIdx);
            resetAutoSlide();
        });
    });

    function startAutoSlide() {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
        autoSlideTimer = setInterval(() => {
            goToDeck(currentDeck + 1);
        }, 6500);
    }

    function resetAutoSlide() {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    const container = document.querySelector('.verdicts-multislide-container');
    if (container) {
        container.addEventListener('mouseenter', () => {
            if (autoSlideTimer) clearInterval(autoSlideTimer);
        });
        container.addEventListener('mouseleave', resetAutoSlide);

        let touchStartX = 0;
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) {
                    goToDeck(currentDeck + 1);
                } else {
                    goToDeck(currentDeck - 1);
                }
                resetAutoSlide();
            }
        }, { passive: true });
    }

    startAutoSlide();
});

document.addEventListener('DOMContentLoaded', () => {
    const atelierSection = document.getElementById('atelierCreativeShowcase');
    if (atelierSection) {
        const portraitCards = atelierSection.querySelectorAll('.staggered-portrait-card');
        portraitCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
});

function initExecutiveVerdictsFilter() {
    const verdictFilterBtns = document.querySelectorAll('.verdict-filter-pill');
    const verdictCards = document.querySelectorAll('.executive-verdict-card');

    if (!verdictFilterBtns.length || !verdictCards.length) return;

    verdictFilterBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            verdictFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-verdict-filter') || 'all';

            verdictCards.forEach(card => {
                const cat = card.getAttribute('data-verdict-cat');
                if (filter === 'all' || cat === filter) {
                    card.classList.remove('is-hidden');
                    card.classList.add('is-visible');
                    card.style.display = 'flex';
                } else {
                    card.classList.add('is-hidden');
                    card.classList.remove('is-visible');
                    card.style.display = 'none';
                }
            });
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExecutiveVerdictsFilter);
} else {
    initExecutiveVerdictsFilter();
}

function initStudioMapTabs() {
    const mapTabs = document.querySelectorAll('.map-tab-btn');
    const iframe = document.getElementById('studioMapIframe');
    const title = document.getElementById('mapLocationTitle');
    const desc = document.getElementById('mapLocationDesc');
    const address = document.getElementById('mapLocationAddress');
    const hours = document.getElementById('mapLocationHours');
    const transit = document.getElementById('mapLocationTransit');
    const contact = document.getElementById('mapLocationContact');
    const extLink = document.getElementById('mapExternalLink');
    const badgeText = document.getElementById('mapFloatingBadgeText');

    if (!mapTabs.length || !iframe) return;

    const locationsData = {
        salem: {
            title: 'Salem Flagship Atelier',
            desc: 'Our primary craft laboratory where brand identities, variable fonts, and luxury packaging dielines are forged.',
            address: 'MMR Complex, Chinna Thirupathi, near Chinna Muniyappan Kovil, Salem, Tamil Nadu 636008, India',
            hours: 'Monday – Saturday: 09:30 AM – 07:00 PM IST<br><span style="color: var(--text-muted); font-size: 0.8rem;">Sunday: Strictly by Executive Appointment</span>',
            transit: '11.6690° N, 78.1704° E • 15 mins from Salem Junction (SA) Railway Station',
            contact: '<a href="tel:+919876543210">+91 98765 43210</a> • <a href="mailto:salem@stackly.design">salem@stackly.design</a>',
            extLink: 'https://maps.google.com/?q=Chinna+Thirupathi,+Salem,+Tamil+Nadu+636008',
            mapUrl: 'https://maps.google.com/maps?q=Chinna+Thirupathi,+Salem,+Tamil+Nadu+636008&t=&z=15&ie=UTF8&iwloc=&output=embed',
            badge: 'Salem Atelier • Active Hub'
        },
        bangalore: {
            title: 'Bangalore Innovation Hub',
            desc: 'Digital flagship sprint lab, design token engineering, and client review boardroom in the heart of Indiranagar.',
            address: 'Indiranagar Design Collective, 100 Feet Road, Bengaluru, Karnataka 560038, India',
            hours: 'Monday – Friday: 10:00 AM – 07:00 PM IST<br><span style="color: var(--text-muted); font-size: 0.8rem;">Weekend: Closed</span>',
            transit: '12.9784° N, 77.6408° E • 5 mins from Indiranagar Metro Station',
            contact: '<a href="tel:+919876543211">+91 98765 43211</a> • <a href="mailto:bangalore@stackly.design">bangalore@stackly.design</a>',
            extLink: 'https://maps.google.com/?q=100+Feet+Road,+Indiranagar,+Bengaluru,+Karnataka+560038',
            mapUrl: 'https://maps.google.com/maps?q=100+Feet+Road,+Indiranagar,+Bengaluru,+Karnataka+560038&t=&z=15&ie=UTF8&iwloc=&output=embed',
            badge: 'Bangalore Hub • Digital Lab'
        },
        london: {
            title: 'London Client Annex',
            desc: 'Dedicated client liaison office and European design partnership hub in the historic design enclave of Clerkenwell.',
            address: 'Clerkenwell Design District, St John Street, London EC1M 4AY, United Kingdom',
            hours: 'Monday – Friday: 09:00 AM – 06:00 PM GMT<br><span style="color: var(--text-muted); font-size: 0.8rem;">Weekend: Closed</span>',
            transit: '51.5225° N, 0.1030° W • 4 mins walk from Farringdon Elizabeth Line Station',
            contact: '<a href="tel:+442079460912">+44 20 7946 0912</a> • <a href="mailto:london@stackly.design">london@stackly.design</a>',
            extLink: 'https://maps.google.com/?q=St+John+Street,+Clerkenwell,+London+EC1M+4AY',
            mapUrl: 'https://maps.google.com/maps?q=St+John+Street,+Clerkenwell,+London+EC1M+4AY&t=&z=15&ie=UTF8&iwloc=&output=embed',
            badge: 'London Annex • European Hub'
        }
    };

    mapTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const locKey = this.getAttribute('data-map-loc');
            const data = locationsData[locKey];
            if (!data) return;

            mapTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            if (title) title.textContent = data.title;
            if (desc) desc.textContent = data.desc;
            if (address) address.textContent = data.address;
            if (hours) hours.innerHTML = data.hours;
            if (transit) transit.textContent = data.transit;
            if (contact) contact.innerHTML = data.contact;
            if (extLink) extLink.setAttribute('href', data.extLink);
            if (badgeText) badgeText.textContent = data.badge;

            iframe.style.opacity = '0.3';
            iframe.setAttribute('src', data.mapUrl);
            iframe.onload = () => {
                iframe.style.transition = 'opacity 0.4s ease';
                iframe.style.opacity = '1';
            };
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStudioMapTabs);
} else {
    initStudioMapTabs();
}
