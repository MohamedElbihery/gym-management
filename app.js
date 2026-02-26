/* ============================================
   GymForge PRO — Core: Store, Auth, Router,
   Notifications, Demo Data, Utilities
   ============================================ */

// ==================== STORE ====================
const Store = {
    _p: 'gfp_',
    get(k) { try { return JSON.parse(localStorage.getItem(this._p + k)) || null; } catch { return null; } },
    getA(k) { return this.get(k) || []; },
    set(k, v) { localStorage.setItem(this._p + k, JSON.stringify(v)); },
    remove(k) { localStorage.removeItem(this._p + k); },
    genId(prefix = 'ID') { return prefix + '-' + Math.random().toString(36).substring(2, 8).toUpperCase(); }
};

// ==================== TOAST ====================
function showToast(msg, type = 'success') {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    // If msg starts with a translation key prefix, translate it
    const translated = (msg.includes('.') || msg.startsWith('general.')) ? I18n.t(msg) : msg;
    t.textContent = translated;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = `translateX(${I18n.currentLang === 'ar' ? '-40px' : '40px'})`; setTimeout(() => t.remove(), 300); }, 3000);
}

// ==================== UTILITIES ====================
function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(I18n.currentLang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString(I18n.currentLang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
}
function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return I18n.t('general.justNow');
    if (mins < 60) return I18n.t('general.minsAgo', [mins]);
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return I18n.t('general.hrsAgo', [hrs]);
    return I18n.t('general.daysAgo', [Math.floor(hrs / 24)]);
}
function todayStr() { return new Date().toISOString().split('T')[0]; }
function dayName(i) {
    const enDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const arDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return I18n.currentLang === 'ar' ? arDays[i] : enDays[i];
}
function todayDayIndex() { return new Date().getDay(); }

// ==================== MODAL HELPERS ====================
function openModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }
document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
});
document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) closeModal(o.id); });
});

// ==================== NOTIFICATIONS ====================
const Notifs = {
    init() {
        document.getElementById('notifBtn')?.addEventListener('click', () => this.toggle());
        document.getElementById('mobileNotifBtn')?.addEventListener('click', () => this.toggle());
        document.getElementById('clearNotifsBtn')?.addEventListener('click', () => this.clear());
        document.addEventListener('click', e => {
            const panel = document.getElementById('notifPanel');
            if (panel.classList.contains('open') && !panel.contains(e.target) &&
                !e.target.closest('#notifBtn') && !e.target.closest('#mobileNotifBtn')) {
                panel.classList.remove('open');
            }
        });
    },
    toggle() { document.getElementById('notifPanel').classList.toggle('open'); this.markRead(); },
    push(title, body, type = 'info') {
        const notifs = Store.getA('notifications');
        notifs.unshift({ id: Store.genId('N'), title, body, type, time: new Date().toISOString(), read: false });
        if (notifs.length > 50) notifs.length = 50;
        Store.set('notifications', notifs);
        this.renderBadge();
        this.renderList();
    },
    markRead() {
        const notifs = Store.getA('notifications');
        notifs.forEach(n => n.read = true);
        Store.set('notifications', notifs);
        this.renderBadge();
    },
    clear() {
        Store.set('notifications', []);
        this.renderBadge();
        this.renderList();
    },
    renderBadge() {
        const count = Store.getA('notifications').filter(n => !n.read).length;
        ['notifBadge', 'mobileNotifBadge'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.style.display = count > 0 ? 'flex' : 'none'; el.textContent = count; }
        });
    },
    renderList() {
        const list = document.getElementById('notifList');
        const notifs = Store.getA('notifications');
        if (!notifs.length) { list.innerHTML = '<p class="empty-state sm">No notifications</p>'; return; }
        list.innerHTML = notifs.slice(0, 20).map(n => `
            <div class="notif-item ${n.read ? '' : 'unread'}">
                <div class="notif-title">${n.title}</div>
                <div>${n.body}</div>
                <div class="notif-time">${timeAgo(n.time)}</div>
            </div>`).join('');
    }
};

// ==================== AUTH ====================
const Auth = {
    currentUser: null,
    init() {
        this.currentUser = Store.get('session');
        document.getElementById('loginForm').addEventListener('submit', e => this.login(e));
        document.getElementById('registerForm').addEventListener('submit', e => this.register(e));
        document.getElementById('showRegister').addEventListener('click', e => { e.preventDefault(); document.getElementById('loginCard').style.display = 'none'; document.getElementById('registerCard').style.display = 'block'; });
        document.getElementById('showLogin').addEventListener('click', e => { e.preventDefault(); document.getElementById('registerCard').style.display = 'none'; document.getElementById('loginCard').style.display = 'block'; });
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('regRole').addEventListener('change', e => {
            document.getElementById('memberFields').style.display = e.target.value === 'member' ? 'block' : 'none';
        });

        if (this.currentUser) {
            this.enterApp();
        } else {
            // Default to landing page
            document.getElementById('landingPage').style.display = 'block';
            document.getElementById('authScreen').style.display = 'none';
            document.getElementById('appShell').style.display = 'none';
        }
    },
    login(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const pass = document.getElementById('loginPass').value;
        const users = Store.getA('users');
        const user = users.find(u => u.email === email && u.password === pass);
        if (!user) { showToast('general.invalidCreds', 'error'); return; }
        this.currentUser = user;
        Store.set('session', user);
        this.enterApp();
        showToast(I18n.t('general.welcomeUser', [user.name]));
    },
    register(e) {
        e.preventDefault();
        const role = document.getElementById('regRole').value;
        const userData = {
            name: document.getElementById('regName').value.trim(),
            email: document.getElementById('regEmail').value.trim().toLowerCase(),
            password: document.getElementById('regPass').value,
            role: role
        };

        if (role === 'member') {
            userData.age = parseInt(document.getElementById('regAge').value) || 25;
            userData.gender = document.getElementById('regGender').value;
            userData.height = parseFloat(document.getElementById('regHeight').value) || 175;
            userData.weight = parseFloat(document.getElementById('regWeight').value) || 75;
            userData.goal = document.getElementById('regGoal').value;
            userData.level = document.getElementById('regLevel').value;
            userData.workout_days = parseInt(document.getElementById('regDays').value) || 4;
        }

        // Use backend if available
        ApiClient.checkBackend().then(available => {
            if (available) {
                ApiClient.register(userData)
                    .then(res => {
                        this.showOTP(userData.email);
                        showToast(res.message);
                    })
                    .catch(err => {
                        showToast(err.error || 'Registration failed', 'error');
                    });
            } else {
                // Fallback to local storage
                const users = Store.getA('users');
                if (users.find(u => u.email === userData.email)) {
                    showToast('Email already registered', 'error');
                    return;
                }
                const user = {
                    id: Store.genId('USR'),
                    ...userData,
                    createdAt: new Date().toISOString(),
                    xp: 0, level: 1, streak: 0, lastCheckIn: null,
                };
                if (role === 'member') {
                    user.subscription = { plan: 'basic', status: 'active', startDate: todayStr(), expiresAt: (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d.toISOString().split('T')[0]; })() };
                    // Generate AI plan
                    if (typeof AIEngine !== 'undefined') {
                        const plan = AIEngine.generateWorkoutPlan(user);
                        const plans = Store.getA('workout_plans');
                        plans.push({ userId: user.id, plan, generatedAt: new Date().toISOString() });
                        Store.set('workout_plans', plans);
                        const nutrition = AIEngine.calculateNutrition(user);
                        const nutritionData = Store.getA('nutrition_targets');
                        nutritionData.push({ userId: user.id, ...nutrition });
                        Store.set('nutrition_targets', nutritionData);
                    }
                    Notifs.push('Welcome to GymForge Pro! 🎉', 'Your AI workout plan has been generated.');
                    if (typeof Gamification !== 'undefined') Gamification.addXP(user.id, 100, 'Welcome bonus');
                }
                users.push(user);
                Store.set('users', users);
                this.currentUser = user;
                Store.set('session', user);
                this.enterApp();
                showToast(I18n.t('general.accountCreated', [user.name]));
            }
        });
    },
    logout() {
        Store.remove('session');
        this.currentUser = null;
        document.getElementById('appShell').style.display = 'none';
        document.getElementById('landingPage').style.display = 'block';
        document.getElementById('authScreen').style.display = 'none';
    },
    enterApp() {
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('landingPage').style.display = 'none'; // Ensure landing page is hidden
        document.getElementById('appShell').style.display = 'flex';
        const u = this.currentUser;
        document.getElementById('sidebarAvatar').textContent = u.name.charAt(0).toUpperCase();
        document.getElementById('sidebarName').textContent = u.name;
        document.getElementById('sidebarRole').textContent = I18n.t('auth.' + u.role);
        document.getElementById('topBarGreeting').innerHTML = I18n.t('dash.welcomeName', [u.name]);
        // Show role nav
        document.querySelectorAll('.role-nav').forEach(n => n.style.display = 'none');
        const navId = u.role === 'member' ? 'memberNav' : u.role === 'trainer' ? 'trainerNav' : 'adminNav';
        document.getElementById(navId).style.display = 'flex';
        // Navigate to first section
        const firstSection = u.role === 'member' ? 'u-dashboard' : u.role === 'trainer' ? 't-dashboard' : 'a-dashboard';
        Router.navigate(firstSection);
        Notifs.renderBadge();
        Notifs.renderList();
    },
    updateUser(userId, data) {
        const users = Store.getA('users');
        const idx = users.findIndex(u => u.id === userId);
        if (idx > -1) { Object.assign(users[idx], data); Store.set('users', users); }
        if (this.currentUser && this.currentUser.id === userId) {
            Object.assign(this.currentUser, data);
            Store.set('session', this.currentUser);
        }
    },
    getUser(userId) { return Store.getA('users').find(u => u.id === userId); },
    getMembers() { return Store.getA('users').filter(u => u.role === 'member'); }
};

// ==================== ROUTER ====================
const Router = {
    init() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                this.navigate(item.dataset.section);
                document.getElementById('sidebar').classList.remove('open');
                document.getElementById('sidebarOverlay').classList.remove('show');
                document.getElementById('hamburger').classList.remove('active');
            });
        });
        document.getElementById('hamburger').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
            document.getElementById('sidebarOverlay').classList.toggle('show');
            document.getElementById('hamburger').classList.toggle('active');
        });
        document.getElementById('sidebarOverlay').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebarOverlay').classList.remove('show');
            document.getElementById('hamburger').classList.remove('active');
        });
    },
    navigate(sectionId) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        const activeNav = document.querySelector('.role-nav[style*="flex"]');
        if (activeNav) activeNav.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const target = document.getElementById(`section-${sectionId}`);
        if (target) target.classList.add('active');
        const navItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (navItem) navItem.classList.add('active');
        // Trigger section render
        this.onNavigate(sectionId);
    },
    showAuth(type = 'login') {
        document.getElementById('landingPage').style.display = 'none';
        document.getElementById('appShell').style.display = 'none';
        document.getElementById('authScreen').style.display = 'flex';

        if (type === 'login') {
            document.getElementById('loginCard').style.display = 'block';
            document.getElementById('registerCard').style.display = 'none';
        } else {
            document.getElementById('loginCard').style.display = 'none';
            document.getElementById('registerCard').style.display = 'block';
        }
    },
    onNavigate(section) {
        if (typeof UserModule !== 'undefined') UserModule.onNav(section);
        if (typeof TrainerModule !== 'undefined') TrainerModule.onNav(section);
        if (typeof AdminModule !== 'undefined') AdminModule.onNav(section);
        // New feature modules
        if (section === 'u-assistant' && typeof AIAssistant !== 'undefined') AIAssistant.renderChat();
        if (section === 'u-health' && typeof HealthSync !== 'undefined') HealthSync.renderHealthDashboard();
        if (section === 'u-challenges' && typeof ChallengeSystem !== 'undefined') ChallengeSystem.renderChallenges();
        if (section === 'u-history' && typeof UserHistory !== 'undefined') UserHistory.render();
        if (section === 'a-churn' && typeof ChurnEngine !== 'undefined') ChurnEngine.renderChurnDashboard();
        if (section === 'a-challenges' && typeof ChallengeSystem !== 'undefined') ChallengeSystem.renderAdminChallenges();
        // Update i18n nav labels
        if (typeof I18n !== 'undefined') I18n.updateNavLabels();
    }
};

// ==================== DEMO DATA SEEDER ====================
const DemoData = {
    _seeded: false,
    seed() {
        if (Store.get('demo_seeded')) return;
        const now = new Date();
        const members = [
            { id: 'USR-DEMO01', name: 'Alex Turner', email: 'alex@demo.com', password: 'demo', role: 'member', age: 28, gender: 'male', height: 180, weight: 82, goal: 'build_muscle', experience: 'intermediate', daysPerWeek: 5, xp: 2450, level: 4, streak: 12, lastCheckIn: todayStr(), createdAt: new Date(now - 86400000 * 60).toISOString(), subscription: { plan: 'pro', status: 'active', startDate: new Date(now - 86400000 * 30).toISOString().split('T')[0], expiresAt: new Date(now.getTime() + 86400000 * 30).toISOString().split('T')[0] } },
            { id: 'USR-DEMO02', name: 'Sarah Chen', email: 'sarah@demo.com', password: 'demo', role: 'member', age: 24, gender: 'female', height: 165, weight: 58, goal: 'lose_weight', experience: 'beginner', daysPerWeek: 4, xp: 1820, level: 3, streak: 7, lastCheckIn: todayStr(), createdAt: new Date(now - 86400000 * 45).toISOString(), subscription: { plan: 'pro', status: 'active', startDate: new Date(now - 86400000 * 20).toISOString().split('T')[0], expiresAt: new Date(now.getTime() + 86400000 * 40).toISOString().split('T')[0] } },
            { id: 'USR-DEMO03', name: 'Marcus Johnson', email: 'marcus@demo.com', password: 'demo', role: 'member', age: 32, gender: 'male', height: 175, weight: 95, goal: 'lose_weight', experience: 'beginner', daysPerWeek: 3, xp: 890, level: 2, streak: 3, lastCheckIn: new Date(now - 86400000 * 3).toISOString().split('T')[0], createdAt: new Date(now - 86400000 * 90).toISOString(), subscription: { plan: 'basic', status: 'active', startDate: new Date(now - 86400000 * 25).toISOString().split('T')[0], expiresAt: new Date(now.getTime() + 86400000 * 5).toISOString().split('T')[0] } },
            { id: 'USR-DEMO04', name: 'Emma Williams', email: 'emma@demo.com', password: 'demo', role: 'member', age: 26, gender: 'female', height: 170, weight: 65, goal: 'endurance', experience: 'advanced', daysPerWeek: 6, xp: 5200, level: 6, streak: 30, lastCheckIn: todayStr(), createdAt: new Date(now - 86400000 * 120).toISOString(), subscription: { plan: 'elite', status: 'active', startDate: new Date(now - 86400000 * 15).toISOString().split('T')[0], expiresAt: new Date(now.getTime() + 86400000 * 345).toISOString().split('T')[0] } },
            { id: 'USR-DEMO05', name: 'Jake Martinez', email: 'jake@demo.com', password: 'demo', role: 'member', age: 22, gender: 'male', height: 185, weight: 78, goal: 'build_muscle', experience: 'intermediate', daysPerWeek: 5, xp: 3100, level: 5, streak: 0, lastCheckIn: new Date(now - 86400000 * 14).toISOString().split('T')[0], createdAt: new Date(now - 86400000 * 80).toISOString(), subscription: { plan: 'pro', status: 'expiring', startDate: new Date(now - 86400000 * 27).toISOString().split('T')[0], expiresAt: new Date(now.getTime() + 86400000 * 3).toISOString().split('T')[0] } },
            { id: 'USR-DEMO06', name: 'Olivia Brown', email: 'olivia@demo.com', password: 'demo', role: 'member', age: 29, gender: 'female', height: 162, weight: 70, goal: 'general', experience: 'beginner', daysPerWeek: 3, xp: 420, level: 1, streak: 1, lastCheckIn: new Date(now - 86400000 * 8).toISOString().split('T')[0], createdAt: new Date(now - 86400000 * 15).toISOString(), subscription: { plan: 'basic', status: 'active', startDate: new Date(now - 86400000 * 10).toISOString().split('T')[0], expiresAt: new Date(now.getTime() + 86400000 * 20).toISOString().split('T')[0] } },
        ];
        const trainer = { id: 'USR-TRAIN1', name: 'Coach Ryan', email: 'trainer@demo.com', password: 'demo', role: 'trainer', createdAt: new Date(now - 86400000 * 200).toISOString(), xp: 0, level: 1, streak: 0 };
        const admin = { id: 'USR-ADMIN1', name: 'Admin', email: 'admin@demo.com', password: 'demo', role: 'admin', createdAt: new Date(now - 86400000 * 365).toISOString(), xp: 0, level: 1, streak: 0 };

        Store.set('users', [...members, trainer, admin]);

        // Generate plans for each member
        if (typeof AIEngine !== 'undefined') {
            const plans = members.map(m => ({ userId: m.id, plan: AIEngine.generateWorkoutPlan(m), generatedAt: new Date(now - 86400000 * 7).toISOString() }));
            Store.set('workout_plans', plans);
            const nutritionTargets = members.map(m => ({ userId: m.id, ...AIEngine.calculateNutrition(m) }));
            Store.set('nutrition_targets', nutritionTargets);
        }

        // Demo attendance (last 30 days)
        const attendance = [];
        members.forEach(m => {
            const days = Math.floor(Math.random() * 15) + 5;
            for (let i = 0; i < days; i++) {
                const d = new Date(now - 86400000 * Math.floor(Math.random() * 30));
                attendance.push({ userId: m.id, userName: m.name, date: d.toISOString().split('T')[0], time: d.toISOString(), method: 'QR Scan' });
            }
        });
        Store.set('attendance', attendance);

        // Demo payments
        const payments = [];
        const planPrices = { basic: 29, pro: 49, elite: 79 };
        members.forEach(m => {
            const price = planPrices[m.subscription.plan] || 29;
            for (let i = 0; i < 3; i++) {
                payments.push({ userId: m.id, userName: m.name, amount: price, date: new Date(now - 86400000 * 30 * i).toISOString().split('T')[0], method: ['card', 'cash', 'transfer'][Math.floor(Math.random() * 3)], plan: m.subscription.plan, createdAt: new Date(now - 86400000 * 30 * i).toISOString() });
            }
        });
        Store.set('payments', payments);

        // Demo progress entries
        members.forEach(m => {
            const entries = [];
            for (let i = 8; i >= 0; i--) {
                const w = m.weight + (m.goal === 'lose_weight' ? i * 0.4 : -i * 0.2) + (Math.random() - 0.5);
                entries.push({ userId: m.id, date: new Date(now - 86400000 * i * 4).toISOString().split('T')[0], weight: parseFloat(w.toFixed(1)), bodyFat: parseFloat((18 + Math.random() * 8).toFixed(1)), createdAt: new Date(now - 86400000 * i * 4).toISOString() });
            }
            const existing = Store.getA('progress_entries');
            Store.set('progress_entries', [...existing, ...entries]);
        });

        // Demo meals
        const mealNames = ['Grilled Chicken Breast', 'Oatmeal with Berries', 'Protein Shake', 'Brown Rice & Salmon', 'Greek Yogurt', 'Eggs & Avocado Toast', 'Turkey Sandwich', 'Quinoa Bowl', 'Banana Smoothie', 'Steak & Vegetables'];
        members.forEach(m => {
            const meals = [];
            for (let i = 0; i < 4; i++) {
                meals.push({ userId: m.id, name: mealNames[Math.floor(Math.random() * mealNames.length)], calories: Math.floor(300 + Math.random() * 400), protein: parseFloat((15 + Math.random() * 30).toFixed(1)), carbs: parseFloat((20 + Math.random() * 50).toFixed(1)), fats: parseFloat((5 + Math.random() * 20).toFixed(1)), date: todayStr(), createdAt: new Date().toISOString() });
            }
            const existing = Store.getA('meals');
            Store.set('meals', [...existing, ...meals]);
        });

        // Subscription plans for admin
        Store.set('sub_plans', [
            { id: 'PLAN-BASIC', name: 'Basic', price: 29, duration: 'monthly', features: ['Access to gym equipment', 'Locker room access', 'Basic workout tracking'] },
            { id: 'PLAN-PRO', name: 'Pro', price: 49, duration: 'monthly', features: ['Everything in Basic', 'AI Workout Plans', 'Nutrition Tracking', 'Progress Analytics'] },
            { id: 'PLAN-ELITE', name: 'Elite', price: 79, duration: 'monthly', features: ['Everything in Pro', 'Personal Trainer Access', 'Priority Support', 'Custom Meal Plans', 'Advanced Analytics'] },
        ]);

        Store.set('demo_seeded', true);
    }
};

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    Router.init();
    Notifs.init();
    Auth.init();

    // OTP digit auto-advance
    document.querySelectorAll('.otp-digit').forEach((input, idx, inputs) => {
        input.addEventListener('input', e => {
            const val = e.target.value;
            if (val.length === 1 && idx < inputs.length - 1) {
                inputs[idx + 1].focus();
            }
        });
        input.addEventListener('keydown', e => {
            if (e.key === 'Backspace' && !e.target.value && idx > 0) {
                inputs[idx - 1].focus();
            }
        });
        // Allow paste of full OTP
        input.addEventListener('paste', e => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text').trim();
            if (/^\d{6}$/.test(text)) {
                inputs.forEach((inp, i) => { inp.value = text[i]; });
                inputs[5].focus();
            }
        });
    });

    // OTP form submit  
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', async e => {
            e.preventDefault();
            const digits = Array.from(document.querySelectorAll('.otp-digit')).map(i => i.value).join('');
            if (digits.length !== 6) { showToast('general.otpEnterAll', 'error'); return; }

            const pendingEmail = Store.get('pending_otp_email');
            if (!pendingEmail) { showToast('Session expired', 'error'); return; }

            try {
                const data = await ApiClient.verifyOTP(pendingEmail, digits);
                Store.remove('pending_otp_email');
                Auth.currentUser = data.user;
                Store.set('session', data.user);
                Auth.enterApp();
                showToast('Email verified! Welcome!');
            } catch (err) {
                showToast(err.error || 'Invalid OTP', 'error');
            }
        });
    }

    // Resend OTP
    const resendBtn = document.getElementById('resendOTP');
    if (resendBtn) {
        resendBtn.addEventListener('click', async e => {
            e.preventDefault();
            const pendingEmail = Store.get('pending_otp_email');
            if (!pendingEmail) return;
            try {
                await ApiClient.resendOTP(pendingEmail);
                showToast('general.otpResent');
                Auth.startOTPCountdown();
            } catch (err) {
                showToast(err.error || 'Failed to resend', 'error');
            }
        });
    }
});

// OTP countdown timer
Auth.startOTPCountdown = function () {
    let seconds = 300; // 5 minutes
    const el = document.getElementById('otpCountdown');
    if (!el) return;
    if (this._otpTimer) clearInterval(this._otpTimer);
    this._otpTimer = setInterval(() => {
        seconds--;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
        if (seconds <= 0) {
            clearInterval(this._otpTimer);
            el.textContent = I18n.t('general.otpExpired');
        }
    }, 1000);
};

// Show OTP card
Auth.showOTP = function (email) {
    document.getElementById('loginCard').style.display = 'none';
    document.getElementById('registerCard').style.display = 'none';
    document.getElementById('otpCard').style.display = 'block';
    document.getElementById('otpEmailDisplay').textContent = I18n.t('general.otpSent', [email]);
    document.querySelectorAll('.otp-digit').forEach(i => i.value = '');
    document.querySelector('.otp-digit')?.focus();
    Store.set('pending_otp_email', email);
    this.startOTPCountdown();
};
