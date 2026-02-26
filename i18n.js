/* ============================================
   GymForge PRO — i18n (Internationalization)
   Arabic + English, RTL Support,
   Dynamic Language Switching
   ============================================ */

const I18n = {
    currentLang: 'en',

    translations: {
        en: {
            // Auth
            'auth.welcome': 'Welcome Back',
            'auth.signin': 'Sign in to your account',
            'auth.email': 'Email',
            'auth.password': 'Password',
            'auth.signInBtn': 'Sign In',
            'auth.noAccount': "Don't have an account?",
            'auth.createOne': 'Create one',
            'auth.createAccount': 'Create Account',
            'auth.joinFuture': 'Join the future of fitness',
            'auth.fullName': 'Full Name',
            'auth.role': 'I am a',
            'auth.member': 'Member',
            'auth.trainer': 'Trainer',
            'auth.admin': 'Admin',
            'auth.age': 'Age',
            'auth.gender': 'Gender',
            'auth.male': 'Male',
            'auth.female': 'Female',
            'auth.height': 'Height (cm)',
            'auth.weight': 'Weight (kg)',
            'auth.goal': 'Fitness Goal',
            'auth.goalLose': 'Lose Weight',
            'auth.goalBuild': 'Build Muscle',
            'auth.goalEndurance': 'Build Endurance',
            'auth.goalGeneral': 'General Fitness',
            'auth.level': 'Experience',
            'auth.beginner': 'Beginner',
            'auth.intermediate': 'Intermediate',
            'auth.advanced': 'Advanced',
            'auth.workoutDays': 'Workout Days/Week',
            'auth.haveAccount': 'Already have an account?',
            'auth.signIn': 'Sign in',
            'auth.quickDemo': 'Quick Demo Access',

            // Nav - Member
            'nav.dashboard': 'Dashboard',
            'nav.myPlan': 'My Plan',
            'nav.nutrition': 'Nutrition',
            'nav.progress': 'Progress',
            'nav.leaderboard': 'Leaderboard',
            'nav.checkin': 'QR Check-In',
            'nav.subscription': 'Subscription',
            'nav.assistant': 'AI Assistant',
            'nav.health': 'Health Data',
            'nav.challenges': 'Challenges',

            // Nav - Trainer
            'nav.members': 'Members',
            'nav.modifyPlans': 'Modify Plans',
            'nav.feedback': 'Feedback',

            // Nav - Admin
            'nav.revenue': 'Revenue',
            'nav.attendance': 'Attendance',
            'nav.risk': 'Risk Detection',
            'nav.plans': 'Plans & Pricing',
            'nav.churn': 'Churn Analysis',

            // Dashboard
            'dash.greeting': 'Welcome back',
            'dash.todayPlan': "Today's Plan",
            'dash.weeklyProgress': 'Weekly Progress',
            'dash.quickStats': 'Quick Stats',
            'dash.recentActivity': 'Recent Activity',

            // Churn
            'churn.title': 'Churn Analysis',
            'churn.subtitle': 'Predictive member retention insights powered by AI scoring',
            'churn.critical': 'Critical Risk',
            'churn.high': 'High Risk',
            'churn.medium': 'Medium Risk',
            'churn.low': 'Low Risk',
            'churn.avgRisk': 'Average Churn Risk',
            'churn.trend': 'Churn Risk Trend (8 Weeks)',
            'churn.atRisk': 'At Risk Members',
            'churn.sendOffer': 'Send Offer',

            // Chat
            'chat.title': 'AI Fitness Assistant',
            'chat.online': 'Online — Personalized for you',
            'chat.placeholder': 'Ask me anything about fitness...',
            'chat.clear': 'Clear Chat',
            'chat.welcome': "I'm your AI Fitness Assistant",

            // Health
            'health.title': 'Health Data',
            'health.subtitle': 'Sync your health & fitness data',
            'health.connect': 'Connect Your Health App',
            'health.connectDesc': 'Sync steps, calories, heart rate and more from your favorite health platform.',
            'health.privacy': 'Your data stays private and is stored locally on your device.',
            'health.steps': 'Steps',
            'health.calories': 'Calories',
            'health.heartRate': 'Heart Rate',
            'health.today': 'Today',
            'health.latest': 'Latest',
            'health.weekly': 'Weekly',
            'health.resting': 'Resting',
            'health.avg': 'Avg',
            'health.max': 'Max',
            'health.disconnect': 'Disconnect',
            'health.connected': 'Connected',

            // Challenges
            'challenges.title': 'Community Challenges',
            'challenges.subtitle': 'Compete, earn XP, unlock badges, and climb the leaderboard!',
            'challenges.join': 'Join Challenge',
            'challenges.leave': 'Leave Challenge',
            'challenges.participants': 'Participants',
            'challenges.xpReward': 'XP Reward',
            'challenges.badge': 'Badge',
            'challenges.yourProgress': 'Your Progress',
            'challenges.top5': 'Top 5',
            'challenges.badges': 'Achievement Badges',
            'challenges.unlocked': 'Unlocked',
            'challenges.locked': 'Locked',
            'challenges.ended': 'Challenge Ended',
            'challenges.days': 'Days',
            'challenges.hrs': 'Hrs',
            'challenges.min': 'Min',
            'challenges.manage': 'Manage Challenges',
            'challenges.new': '+ New Challenge',
            'challenges.active': 'Active',

            // General
            'general.signOut': 'Sign Out',
            'general.cancel': 'Cancel',
            'general.save': 'Save',
            'general.delete': 'Delete',
            'general.settings': 'Settings',
            'general.language': 'Language',
            'general.notifications': 'Notifications',
            'general.clearAll': 'Clear All',
            'general.noNotifications': 'No notifications',
        },

        ar: {
            // Auth
            'auth.welcome': 'مرحباً بعودتك',
            'auth.signin': 'سجّل الدخول إلى حسابك',
            'auth.email': 'البريد الإلكتروني',
            'auth.password': 'كلمة المرور',
            'auth.signInBtn': 'تسجيل الدخول',
            'auth.noAccount': 'ليس لديك حساب؟',
            'auth.createOne': 'إنشاء حساب',
            'auth.createAccount': 'إنشاء حساب',
            'auth.joinFuture': 'انضم إلى مستقبل اللياقة',
            'auth.fullName': 'الاسم الكامل',
            'auth.role': 'أنا',
            'auth.member': 'عضو',
            'auth.trainer': 'مدرب',
            'auth.admin': 'مدير',
            'auth.age': 'العمر',
            'auth.gender': 'الجنس',
            'auth.male': 'ذكر',
            'auth.female': 'أنثى',
            'auth.height': 'الطول (سم)',
            'auth.weight': 'الوزن (كجم)',
            'auth.goal': 'هدف اللياقة',
            'auth.goalLose': 'خسارة الوزن',
            'auth.goalBuild': 'بناء العضلات',
            'auth.goalEndurance': 'بناء التحمل',
            'auth.goalGeneral': 'لياقة عامة',
            'auth.level': 'مستوى الخبرة',
            'auth.beginner': 'مبتدئ',
            'auth.intermediate': 'متوسط',
            'auth.advanced': 'متقدم',
            'auth.workoutDays': 'أيام التمرين/أسبوع',
            'auth.haveAccount': 'لديك حساب بالفعل؟',
            'auth.signIn': 'تسجيل الدخول',
            'auth.quickDemo': 'وصول تجريبي سريع',

            // Nav - Member
            'nav.dashboard': 'لوحة التحكم',
            'nav.myPlan': 'خطتي',
            'nav.nutrition': 'التغذية',
            'nav.progress': 'التقدم',
            'nav.leaderboard': 'لوحة المتصدرين',
            'nav.checkin': 'تسجيل دخول QR',
            'nav.subscription': 'الاشتراك',
            'nav.assistant': 'المساعد الذكي',
            'nav.health': 'البيانات الصحية',
            'nav.challenges': 'التحديات',

            // Nav - Trainer
            'nav.members': 'الأعضاء',
            'nav.modifyPlans': 'تعديل الخطط',
            'nav.feedback': 'الملاحظات',

            // Nav - Admin
            'nav.revenue': 'الإيرادات',
            'nav.attendance': 'الحضور',
            'nav.risk': 'كشف المخاطر',
            'nav.plans': 'الخطط والأسعار',
            'nav.churn': 'تحليل الانسحاب',

            // Dashboard
            'dash.greeting': 'مرحباً بعودتك',
            'dash.todayPlan': 'خطة اليوم',
            'dash.weeklyProgress': 'التقدم الأسبوعي',
            'dash.quickStats': 'إحصائيات سريعة',
            'dash.recentActivity': 'النشاط الأخير',

            // Churn
            'churn.title': 'تحليل الانسحاب',
            'churn.subtitle': 'رؤى تنبؤية لاحتفاظ الأعضاء مدعومة بتسجيل الذكاء الاصطناعي',
            'churn.critical': 'خطر حرج',
            'churn.high': 'خطر عالي',
            'churn.medium': 'خطر متوسط',
            'churn.low': 'خطر منخفض',
            'churn.avgRisk': 'متوسط خطر الانسحاب',
            'churn.trend': 'اتجاه خطر الانسحاب (8 أسابيع)',
            'churn.atRisk': 'الأعضاء المعرضون للخطر',
            'churn.sendOffer': 'إرسال عرض',

            // Chat
            'chat.title': 'المساعد الذكي للياقة',
            'chat.online': 'متصل — مخصص لك',
            'chat.placeholder': 'اسألني أي شيء عن اللياقة...',
            'chat.clear': 'مسح المحادثة',
            'chat.welcome': 'أنا مساعدك الذكي للياقة',

            // Health
            'health.title': 'البيانات الصحية',
            'health.subtitle': 'مزامنة بياناتك الصحية واللياقة',
            'health.connect': 'ربط تطبيق الصحة',
            'health.connectDesc': 'مزامنة الخطوات والسعرات ومعدل ضربات القلب والمزيد.',
            'health.privacy': 'بياناتك خاصة ومخزنة محلياً على جهازك.',
            'health.steps': 'الخطوات',
            'health.calories': 'السعرات الحرارية',
            'health.heartRate': 'معدل ضربات القلب',
            'health.today': 'اليوم',
            'health.latest': 'الأحدث',
            'health.weekly': 'أسبوعي',
            'health.resting': 'أثناء الراحة',
            'health.avg': 'المتوسط',
            'health.max': 'الأقصى',
            'health.disconnect': 'قطع الاتصال',
            'health.connected': 'متصل',

            // Challenges
            'challenges.title': 'تحديات المجتمع',
            'challenges.subtitle': 'تنافس واكسب نقاط خبرة وافتح شارات وتسلق المتصدرين!',
            'challenges.join': 'انضم للتحدي',
            'challenges.leave': 'مغادرة التحدي',
            'challenges.participants': 'المشاركون',
            'challenges.xpReward': 'مكافأة XP',
            'challenges.badge': 'شارة',
            'challenges.yourProgress': 'تقدمك',
            'challenges.top5': 'الأفضل 5',
            'challenges.badges': 'شارات الإنجاز',
            'challenges.unlocked': 'مفتوح',
            'challenges.locked': 'مغلق',
            'challenges.ended': 'انتهى التحدي',
            'challenges.days': 'أيام',
            'challenges.hrs': 'ساعات',
            'challenges.min': 'دقائق',
            'challenges.manage': 'إدارة التحديات',
            'challenges.new': '+ تحدي جديد',
            'challenges.active': 'نشط',

            // General
            'general.signOut': 'تسجيل الخروج',
            'general.cancel': 'إلغاء',
            'general.save': 'حفظ',
            'general.delete': 'حذف',
            'general.settings': 'الإعدادات',
            'general.language': 'اللغة',
            'general.notifications': 'الإشعارات',
            'general.clearAll': 'مسح الكل',
            'general.noNotifications': 'لا توجد إشعارات',
        }
    },

    // Translate a key
    t(key) {
        return this.translations[this.currentLang]?.[key] || this.translations['en']?.[key] || key;
    },

    // Initialize
    init() {
        // Load saved preference
        if (Auth.currentUser) {
            const saved = Store.get(`lang_${Auth.currentUser.id}`);
            if (saved) this.currentLang = saved;
        } else {
            const saved = Store.get('lang_global');
            if (saved) this.currentLang = saved;
        }

        // Auto-detect from browser
        if (!Store.get('lang_global') && !Store.get(`lang_${Auth.currentUser?.id}`)) {
            const browserLang = navigator.language?.substring(0, 2);
            if (browserLang === 'ar') this.currentLang = 'ar';
        }

        this.applyLanguage();
        this.renderToggle();
    },

    // Set language
    setLang(lang) {
        this.currentLang = lang;

        // Save preference
        if (Auth.currentUser) {
            Store.set(`lang_${Auth.currentUser.id}`, lang);
        }
        Store.set('lang_global', lang);

        this.applyLanguage();
        this.renderToggle();

        // Re-render current section
        this.reRenderCurrentView();

        showToast(lang === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English', 'success');
    },

    // Toggle between languages
    toggle() {
        this.setLang(this.currentLang === 'en' ? 'ar' : 'en');
    },

    // Apply language to DOM
    applyLanguage() {
        const html = document.documentElement;
        html.setAttribute('lang', this.currentLang);
        html.setAttribute('dir', this.currentLang === 'ar' ? 'rtl' : 'ltr');
        document.body.classList.toggle('rtl', this.currentLang === 'ar');

        // Update static text via data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translated = this.t(key);
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translated;
            } else {
                el.textContent = translated;
            }
        });

        // Update nav items
        this.updateNavLabels();
    },

    updateNavLabels() {
        const navMap = {
            'u-dashboard': 'nav.dashboard', 'u-plan': 'nav.myPlan', 'u-nutrition': 'nav.nutrition',
            'u-progress': 'nav.progress', 'u-leaderboard': 'nav.leaderboard', 'u-checkin': 'nav.checkin',
            'u-subscription': 'nav.subscription', 'u-assistant': 'nav.assistant', 'u-health': 'nav.health',
            'u-challenges': 'nav.challenges',
            't-dashboard': 'nav.dashboard', 't-members': 'nav.members', 't-plans': 'nav.modifyPlans',
            't-feedback': 'nav.feedback',
            'a-dashboard': 'nav.dashboard', 'a-revenue': 'nav.revenue', 'a-attendance': 'nav.attendance',
            'a-members': 'nav.members', 'a-risk': 'nav.risk', 'a-plans': 'nav.plans',
            'a-churn': 'nav.churn', 'a-challenges': 'nav.challenges',
        };

        document.querySelectorAll('.nav-item[data-section]').forEach(item => {
            const section = item.getAttribute('data-section');
            const key = navMap[section];
            if (key) {
                const span = item.querySelector('span');
                if (span) span.textContent = this.t(key);
            }
        });
    },

    // Render the language toggle button
    renderToggle() {
        let toggle = document.getElementById('langToggle');
        if (!toggle) {
            // Insert before logout button in sidebar
            const footer = document.querySelector('.sidebar-footer');
            if (!footer) return;
            toggle = document.createElement('button');
            toggle.id = 'langToggle';
            toggle.className = 'lang-toggle-btn';
            toggle.title = 'Toggle Language';
            toggle.onclick = () => I18n.toggle();
            footer.insertBefore(toggle, footer.querySelector('.btn-logout'));
        }
        toggle.innerHTML = `<span class="lang-flag">${this.currentLang === 'en' ? '🇬🇧' : '🇸🇦'}</span><span class="lang-code">${this.currentLang.toUpperCase()}</span>`;
    },

    // Re-render current view
    reRenderCurrentView() {
        const activeSection = document.querySelector('.section.active');
        if (!activeSection) return;
        const sectionId = activeSection.id.replace('section-', '');

        // Trigger navigation re-render
        if (typeof Router !== 'undefined') {
            Router.onNavigate(sectionId);
        }
    }
};

// Init i18n after DOM and Auth
document.addEventListener('DOMContentLoaded', () => {
    // Delayed init after auth loads
    setTimeout(() => I18n.init(), 100);
});
