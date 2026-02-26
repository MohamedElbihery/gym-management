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
            'auth.email': 'Email', 'landing.heroTitle': 'The Future of Fitness Management',
            'landing.heroSub': 'Empower your gym with AI-driven workouts, automated tracking, and premium member experiences.',
            'landing.getStarted': 'Get Started',
            'landing.login': 'Sign In',
            'landing.featuresTitle': 'Why Choose GymForge Pro?',
            'landing.aiWorkouts': 'AI-Powered Workouts',
            'landing.aiWorkoutsDesc': 'Personalized training plans that adapt to your progress in real-time.',
            'landing.tracking': 'Smart Tracking',
            'landing.trackingDesc': 'Monitor attendance, progress, and performance with ease.',
            'landing.community': 'Active Community',
            'landing.communityDesc': 'Engage members with challenges, leaderboards, and rewards.',
            'landing.secure': 'Enterprise Security',
            'landing.secureDesc': 'Role-based access, OTP verification, and secure data handling.',
            'landing.footer': '© 2026 GymForge Pro. All rights reserved.',
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
            'auth.demoPassTitle': 'Enter Access Password',
            'auth.demoPassLabel': 'Password',
            'auth.pendingApproval': 'Account pending admin approval',
            'auth.makeAdmin': 'Make Admin',
            'auth.approve': 'Approve',
            'auth.reject': 'Reject',
            'auth.requests': 'Pending Requests',
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

            // Nav
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
            'nav.members': 'Members',
            'nav.modifyPlans': 'Modify Plans',
            'nav.feedback': 'Feedback',
            'nav.revenue': 'Revenue',
            'nav.attendance': 'Attendance',
            'nav.risk': 'Risk Detection',
            'nav.plans': 'Plans & Pricing',
            'nav.churn': 'Churn Analysis',

            // Dashboard
            'dash.greeting': 'Welcome back',
            'dash.welcomeName': 'Welcome, <strong>{0}</strong>',
            'dash.heyName': 'Hey, {0}! 💪',
            'dash.todayFocus': "Today's focus: <strong>{0}</strong>",
            'dash.restDayMsg': 'Rest day — recover and come back stronger!',
            'dash.todayPlan': "Today's Plan",
            'dash.weeklyProgress': 'Weekly Progress',
            'dash.quickStats': 'Quick Stats',
            'dash.recentActivity': 'Recent Activity',
            'dash.streakLabel': 'Day Streak',
            'dash.workoutsWeek': 'Workouts This Week',
            'dash.currentWeight': 'Current Weight',
            'dash.checkedInToday': 'Checked In Today',
            'dash.totalVisits': 'Total Visits',
            'dash.todayWorkout': "Today's Workout",
            'dash.moreExercises': '+{0} more exercises',
            'dash.viewFullPlan': 'View Full Plan →',
            'dash.trainerFeedback': 'Trainer Feedback',
            'dash.fromCoach': 'From Coach',
            'dash.noFeedback': 'No feedback yet',

            // Plan
            'plan.title': 'My Workout Plan',
            'plan.aiGenerated': 'AI-generated based on your goals and metrics',
            'plan.adjusted': 'Adjusted: {0}',
            'plan.regenerate': '🤖 Regenerate Plan',
            'plan.adjustWeekly': '⚡ AI Weekly Adjust',
            'plan.restDay': 'Rest Day',
            'plan.todayLabel': '· TODAY',
            'plan.completeWorkout': '✓ Complete Workout (+50 XP)',
            'plan.noPlan': 'No plan generated yet. Contact admin or re-register.',

            // Nutrition
            'nutrition.title': 'Nutrition',
            'nutrition.subtitle': 'AI-calculated targets based on your body and goals',
            'nutrition.budget': 'Calorie Budget',
            'nutrition.remaining': 'Remaining',
            'nutrition.left': 'Calories left',
            'nutrition.todayMeals': "Today's Meals",
            'nutrition.noMeals': 'No meals logged today',
            'nutrition.logMeal': 'Log Meal',
            'nutrition.mealName': 'Meal / Food',
            'nutrition.mealPlaceholder': 'e.g. Grilled Chicken',
            'nutrition.calories': 'Calories',
            'nutrition.protein': 'Protein',
            'nutrition.carbs': 'Carbs',
            'nutrition.fats': 'Fats',
            'nutrition.saveMeal': 'Log Meal',

            // Progress
            'progress.title': 'Progress Tracking',
            'progress.subtitle': 'Track your body metrics over time',
            'progress.bmi': 'BMI',
            'progress.entries': 'Entries',
            'progress.weightTrend': 'Weight Trend',
            'progress.bmiTrend': 'BMI Trend',
            'progress.logTitle': 'Log Progress',
            'progress.bodyFat': 'Body Fat %',
            'progress.notes': 'Notes',
            'progress.notesPlaceholder': 'How are you feeling?',

            // Check-in
            'checkin.title': 'QR Check-In',
            'checkin.subtitle': 'Show this code at the front desk or scan to check in',
            'checkin.alreadyDone': '✅ Already checked in today!',
            'checkin.btn': 'Check In Now',

            // Subscription
            'sub.title': 'Subscription',
            'sub.subtitle': 'Manage your membership plan',
            'sub.status': 'Status',
            'sub.expires': 'Expires: {0}',
            'sub.availablePlans': 'Available Plans',
            'sub.paymentHistory': 'Payment History',
            'sub.noHistory': 'No payment history',
            'sub.currentPlan': 'Current Plan',
            'sub.upgrade': 'Upgrade',
            'sub.date': 'Date',
            'sub.amount': 'Amount',
            'sub.plan': 'Plan',
            'sub.method': 'Method',
            'sub.card': 'Card',
            'sub.cash': 'Cash',
            'sub.transfer': 'Transfer',

            // Trainer
            'trainer.dashTitle': 'Trainer Dashboard',
            'trainer.dashSubtitle': 'Monitor your members and their progress',
            'trainer.totalMembers': 'Total Members',
            'trainer.weeklyCheckins': 'Weekly Check-ins',
            'trainer.feedbacksSent': 'Feedbacks Sent',
            'trainer.recentCheckins': 'Recent Check-ins',
            'trainer.noCheckinsToday': 'No check-ins today',
            'trainer.atRisk': 'Members at Risk',
            'trainer.noRisk': 'No at-risk members',
            'trainer.sendMessage': 'Send Message',
            'trainer.riskNoCheckins': 'No check-ins in 14 days',
            'trainer.riskLostStreak': 'Lost streak',
            'trainer.riskExpiring': 'Subscription expiring',
            'trainer.membersTitle': 'Members',
            'trainer.membersSubtitle': 'View and monitor all member progress',
            'trainer.plansTitle': 'Modify Plans',
            'trainer.plansSubtitle': 'Override AI-generated plans for specific members',
            'trainer.feedbackTitle': 'Feedback',
            'trainer.feedbackSubtitle': 'Send messages and feedback to members',
            'trainer.sentFeedback': 'Sent Feedback',
            'trainer.noFeedbackSentYet': 'No feedback sent yet',
            'trainer.feedbackSentTo': 'Feedback sent to {0}',
            'trainer.planRegenFor': 'Plan regenerated for {0}',
            'trainer.workoutsWk': 'workouts/wk',
            'trainer.coachUpdatedPlan': 'Coach has regenerated your workout plan.',
            'trainer.km': 'km',

            // Admin
            'admin.dashTitle': 'Admin Dashboard',
            'admin.dashSubtitle': 'Platform analytics and key metrics',
            'admin.active': 'Active',
            'admin.expiringSoon': 'Expiring Soon',
            'admin.totalRevenue': 'Total Revenue',
            'admin.mrr': 'MRR',
            'admin.churnRate': 'Churn Rate',
            'admin.revenueLast6': 'Revenue (Last 6 Months)',
            'admin.attendanceLast7': 'Attendance (Last 7 Days)',
            'admin.planDist': 'Plan Distribution',
            'admin.subPredictions': 'Subscription Predictions',
            'admin.basedOnPatterns': 'Based on current patterns:',
            'admin.estRenewals': 'Est. Renewals',
            'admin.predictedRev': 'Predicted Revenue',
            'admin.retentionRate': 'Retention Rate',
            'admin.revAnalytics': 'Revenue Analytics',
            'admin.revSubtitle': 'Payment history and revenue tracking',
            'admin.member': 'Member',
            'admin.amount': 'Amount',
            'admin.plan': 'Plan',
            'admin.method': 'Method',
            'admin.noPayments': 'No payments',
            'admin.attAnalytics': 'Attendance Analytics',
            'admin.attSubtitle': 'Check-in logs and attendance patterns',
            'admin.today': 'Today',
            'admin.thisWeek': 'This Week',
            'admin.allTime': 'All Time',
            'admin.time': 'Time',
            'admin.allMembers': 'All Members',
            'admin.manageGym': 'Manage gym membership',
            'admin.name': 'Name',
            'admin.email': 'Email',
            'admin.status': 'Status',
            'admin.xp': 'XP',
            'admin.streak': 'Streak',
            'admin.joined': 'Joined',
            'admin.riskDetection': 'Risk Detection',
            'admin.riskSubtitle': 'Members flagged for low engagement or expiring subscriptions',
            'admin.highRisk': 'High Risk',
            'admin.mediumRisk': 'Medium Risk',
            'admin.lowRisk': 'Low Risk',
            'admin.allGood': 'All members are in good standing! 🎉',
            'admin.inactive14d': 'Inactive 14d+',
            'admin.lowActivity': 'Low activity',
            'admin.noStreak': 'No streak',
            'admin.subExpiring': 'Sub expiring',
            'admin.expired': 'Expired',
            'admin.plansPricing': 'Plans & Pricing',
            'admin.manageTiers': 'Manage subscription tiers',
            'admin.edit': 'Edit',
            'admin.delete': 'Delete',
            'admin.planUpdated': 'Plan updated',
            'admin.planCreated': 'Plan created',
            'admin.deleteConfirm': 'Delete this plan?',
            'admin.basic': 'Basic',
            'admin.pro': 'Pro',
            'admin.elite': 'Elite',

            // Challenges
            'challenges.title': 'Community Challenges',
            'challenges.subtitle': 'Compete, earn XP, unlock badges, and climb the leaderboard!',
            'challenges.days': 'Days',
            'challenges.hrs': 'Hrs',
            'challenges.min': 'Min',
            'challenges.participants': 'Participants',
            'challenges.xpReward': 'XP Reward',
            'challenges.badge': 'Badge',
            'challenges.yourProgress': 'Your Progress',
            'challenges.rank': 'Rank',
            'challenges.leave': 'Leave Challenge',
            'challenges.join': 'Join Challenge 🚀',
            'challenges.top5': 'Top 5',
            'challenges.you': '(You)',
            'challenges.badgesTitle': '🏅 Achievement Badges',
            'challenges.unlocked': '✓ Unlocked',
            'challenges.locked': '🔒 Locked',
            'challenges.manageTitle': 'Manage Challenges',
            'challenges.manageSubtitle': 'Create and monitor community challenges',
            'challenges.newChallenge': 'New Challenge',
            'challenges.active': 'Active',
            'challenges.ended': 'Ended',
            'challenges.left': 'left',
            'challenges.joinedSuccess': 'Challenge joined! 🎯',
            'challenges.alreadyJoined': 'Already joined this challenge!',
            'challenges.leftSuccess': 'Left the challenge',
            'challenges.deletedSuccess': 'Challenge deleted',
            'challenges.createdSuccess': 'Challenge created! 🎯',
            'challenges.badgeUnlockedTitle': '🏅 Badge Unlocked!',
            'challenges.badgeUnlockedMsg': 'You earned the "{0}" {1} badge!',
            'challenges.badge_B001_name': 'First Steps',
            'challenges.badge_B001_desc': 'Complete your first challenge',
            'challenges.badge_B002_name': 'Step Master',
            'challenges.badge_B002_desc': 'Walk 100,000 steps in a month',
            'challenges.badge_B003_name': 'Iron Warrior',
            'challenges.badge_B003_desc': 'Complete 20 workouts in a month',
            'challenges.badge_B004_name': 'Calorie King',
            'challenges.badge_B004_desc': 'Burn 50,000 calories in a month',
            'challenges.badge_B005_name': 'Streak Legend',
            'challenges.badge_B005_desc': '14-day check-in streak',
            'challenges.badge_B006_name': 'XP Hunter',
            'challenges.badge_B006_desc': 'Earn 2,000 XP in a month',
            'challenges.badge_B007_name': 'Team Player',
            'challenges.badge_B007_desc': 'Join 3 challenges',
            'challenges.badge_B008_name': 'Champion',
            'challenges.badge_B008_desc': 'Finish top 3 in any challenge',
            'challenges.manage': 'Manage Challenges',
            'challenges.new': '+ New Challenge',

            // Chat
            'chat.title': 'AI Fitness Assistant',
            'chat.status': 'Online — Personalized for you',
            'chat.clear': 'Clear Chat',
            'chat.welcomeTitle': "Hi {0}! I'm your AI Fitness Assistant",
            'chat.welcomeDesc': 'I know your profile — {0} level, focused on {1}. Ask me anything!',
            'chat.placeholder': 'Ask me anything about fitness...',
            'chat.historyCleared': 'Chat history cleared',
            'chat.welcome': "I'm your AI Fitness Assistant",
            'chat.online': 'Online — Personalized for you',

            // Churn
            'churn.title': 'Churn Analysis',
            'churn.subtitle': 'Predictive member retention insights powered by AI scoring',
            'churn.criticalRisk': 'Critical Risk',
            'churn.highRisk': 'High Risk',
            'churn.mediumRisk': 'Medium Risk',
            'churn.lowRisk': 'Low Risk',
            'churn.avgChurnRisk': 'Average Churn Risk',
            'churn.avgRisk': 'Avg Risk',
            'churn.riskTrend': 'Churn Risk Trend (8 Weeks)',
            'churn.atRiskMembers': 'At Risk Members',
            'churn.sendOffer': 'Send Offer',
            'churn.offerSentTitle': '🎁 Retention Offer Sent',
            'churn.offerSentMsg': 'Special 20% off renewal offer sent to {0}. Offer expires in 48 hours.',
            'churn.offerSentSuccess': 'Retention offer sent to {0}!',
            'churn.noVisits30d': 'No visits 30d',
            'churn.inactive14d': 'Inactive 14d+',
            'churn.veryLowActivity': 'Very low activity',
            'churn.belowAvgActivity': 'Below avg activity',
            'churn.dormant30d': 'Dormant 30d+',
            'churn.slowingDown': 'Slowing down',
            'churn.expiring3d': 'Expiring <3d',
            'churn.expiring7d': 'Expiring <7d',
            'churn.noSubscription': 'No subscription',
            'churn.avgChurnRiskLabel': 'Avg Churn Risk %',
            'churn.atRiskMembersLabel': 'At-Risk Members',
            'churn.trend': 'Churn Risk Trend (8 Weeks)',
            'churn.atRisk': 'At Risk Members',

            // Gamification
            'gamify.levelUp': 'Level Up!',
            'gamify.reachedTier': "You've reached {0} tier! Keep pushing!",
            'gamify.keepTraining': 'Keep training to unlock the next level!',
            'gamify.leaderboardTitle': 'Leaderboard',
            'gamify.leaderboardSubtitle': 'Top performers ranked by XP',
            'gamify.dayStreak': '{0} day streak',
            'tier.iron': 'Iron',
            'tier.bronze': 'Bronze',
            'tier.silver': 'Silver',
            'tier.gold': 'Gold',
            'tier.platinum': 'Platinum',
            'tier.diamond': 'Diamond',
            'gamification.levelUp': 'LEVEL UP!',
            'gamification.awesome': 'Awesome!',

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
            'health.connectedBadge': 'Connected',
            'health.connectSuccess': 'Connected to {0}!',
            'health.syncSuccess': 'Successfully synced with {0}',
            'health.disconnected': 'Health data disconnected',
            'health.syncedFrom': 'Synced from {0}',
            'health.stepsChart': 'Steps (7 Days)',
            'health.calChart': 'Calories Burned (7 Days)',
            'health.hrChart': 'Heart Rate Trend (7 Days)',
            'health.zoneExcel': 'Excellent',
            'health.zoneGood': 'Good',
            'health.zoneMod': 'Moderate',

            // Days
            'day.sun': 'Sun',
            'day.mon': 'Mon',
            'day.tue': 'Tue',
            'day.wed': 'Wed',
            'day.thu': 'Thu',
            'day.fri': 'Fri',
            'day.sat': 'Sat',

            // Levels & Goals
            'level.beginner': 'Beginner',
            'level.intermediate': 'Intermediate',
            'level.advanced': 'Advanced',
            'goal.lose_weight': 'Lose Weight',
            'goal.build_muscle': 'Build Muscle',
            'goal.endurance': 'Endurance',
            'goal.general': 'General Fitness',

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
            'general.justNow': 'Just now',
            'general.minsAgo': '{0}m ago',
            'general.hrsAgo': '{0}h ago',
            'general.daysAgo': '{0}d ago',
            'general.invalidCreds': 'Invalid credentials',
            'general.emailRegistered': 'Email already registered',
            'general.welcomeUser': 'Welcome back, {0}!',
            'general.accountCreated': 'Account created! Welcome, {0}!',
            'general.demoLogin': 'Logged in as demo {0}',
            'general.otpSent': 'Enter the 6-digit code sent to {0}',
            'general.otpResent': 'OTP resent!',
            'general.otpExpired': 'Expired',
            'general.otpEnterAll': 'Enter all 6 digits',
            'general.otpVerifyTitle': 'Verify Your Email',
            'general.otpVerifyCodeSent': 'Enter the 6-digit code sent to your email',
            'general.otpExpiresIn': 'Code expires in',
            'general.otpNotReceived': "Didn't receive code?",
            'general.otpResend': 'Resend',

            // Feedback
            'feedback.title': 'Send Feedback', 'landing.heroTitle': 'مستقبل إدارة الصالات الرياضية',
            'landing.heroSub': 'قم بتمكين جيمك بتمارين مدعومة بالذكاء الاصطناعي، تتبع تلقائي، وتجارب مميزة للأعضاء.',
            'landing.getStarted': 'ابدأ الآن',
            'landing.login': 'تسجيل الدخول',
            'landing.featuresTitle': 'لماذا تختار GymForge Pro؟',
            'landing.aiWorkouts': 'تمارين بالذكاء الاصطناعي',
            'landing.aiWorkoutsDesc': 'خطط تدريب مخصصة تتكيف مع تقدمك في الوقت الفعلي.',
            'landing.tracking': 'تتبع ذكي',
            'landing.trackingDesc': 'راقب الحضور والتقدم والأداء بسهولة تامة.',
            'landing.community': 'مجتمع نشط',
            'landing.communityDesc': 'أشرك الأعضاء بالتحديات ولوحات الصدارة والمكافآت.',
            'landing.secure': 'أمان عالي المستوى',
            'landing.secureDesc': 'صلاحيات مخصصة، تحقق OTP، ومعالجة آمنة للبيانات.',
            'landing.footer': '© 2026 GymForge Pro. جميع الحقوق محفوظة.',
            'feedback.to': 'To',
            'feedback.message': 'Message',
            'feedback.placeholder': 'Great progress this week!',
            'feedback.send': 'Send',
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
            'auth.demoPassTitle': 'أدخل كلمة مرور الدخول',
            'auth.demoPassLabel': 'كلمة المرور',
            'auth.pendingApproval': 'الحساب قيد انتظار موافقة المسؤول',
            'auth.makeAdmin': 'ترقية لمدير',
            'auth.approve': 'موافقة',
            'auth.reject': 'رفض',
            'auth.requests': 'طلبات الانتظار',
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

            // Nav
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
            'nav.members': 'الأعضاء',
            'nav.modifyPlans': 'تعديل الخطط',
            'nav.feedback': 'الملاحظات',
            'nav.revenue': 'الإيرادات',
            'nav.attendance': 'الحضور',
            'nav.risk': 'كشف المخاطر',
            'nav.plans': 'الخطط والأسعار',
            'nav.churn': 'تحليل الانسحاب',

            // Dashboard
            'dash.greeting': 'مرحباً بعودتك',
            'dash.welcomeName': 'مرحباً، <strong>{0}</strong>',
            'dash.heyName': 'مرحباً، {0}! 💪',
            'dash.todayFocus': "تركيز اليوم هو: <strong>{0}</strong>",
            'dash.restDayMsg': 'يوم راحة — تدرب جيداً وعد بقوة!',
            'dash.todayPlan': 'خطة اليوم',
            'dash.weeklyProgress': 'التقدم الأسبوعي',
            'dash.quickStats': 'إحصائيات سريعة',
            'dash.recentActivity': 'النشاط الأخير',
            'dash.streakLabel': 'أيام التواصل',
            'dash.workoutsWeek': 'تمارين هذا الأسبوع',
            'dash.currentWeight': 'الوزن الحالي',
            'dash.checkedInToday': 'تم الحضور اليوم',
            'dash.totalVisits': 'إجمالي الزيارات',
            'dash.todayWorkout': 'تمرين اليوم',
            'dash.moreExercises': '+{0} تمارين إضافية',
            'dash.viewFullPlan': 'عرض الخطة الكاملة ←',
            'dash.trainerFeedback': 'ملاحظات المدرب',
            'dash.fromCoach': 'من المدرب',
            'dash.noFeedback': 'لا توجد ملاحظات بعد',

            // Plan
            'plan.title': 'خطتي التدريبية',
            'plan.aiGenerated': 'تم إنتاجها بواسطة الذكاء الاصطناعي بناءً على أهدافك',
            'plan.adjusted': 'تم التعديل: {0}',
            'plan.regenerate': '🤖 إعادة إنشاء الخطة',
            'plan.adjustWeekly': '⚡ تعديل أسبوعي ذكي',
            'plan.restDay': 'يوم راحة',
            'plan.todayLabel': '· اليوم',
            'plan.completeWorkout': '✓ إكمال التمرين (+50 XP)',
            'plan.noPlan': 'لم يتم إنشاء خطة بعد. تواصل مع المدير أو أعد التسجيل.',

            // Nutrition
            'nutrition.title': 'التغذية',
            'nutrition.subtitle': 'أهداف محسوبة بالذكاء الاصطناعي بناءً على جسمك وأهدافك',
            'nutrition.budget': 'ميزانية السعرات',
            'nutrition.remaining': 'المتبقي',
            'nutrition.left': 'سعرة متبقية',
            'nutrition.todayMeals': 'وجبات اليوم',
            'nutrition.noMeals': 'لا توجد وجبات مسجلة اليوم',
            'nutrition.logMeal': 'تسجيل وجبة',
            'nutrition.mealName': 'الوجبة / الطعام',
            'nutrition.mealPlaceholder': 'مثلاً: دجاج مشوي',
            'nutrition.calories': 'السعرات',
            'nutrition.protein': 'بروتين',
            'nutrition.carbs': 'كربوهيدرات',
            'nutrition.fats': 'دهون',
            'nutrition.saveMeal': 'تسجيل الوجبة',

            // Progress
            'progress.title': 'تتبع التقدم',
            'progress.subtitle': 'تتبع قياسات جسمك بمرور الوقت',
            'progress.bmi': 'كتلة الجسم (BMI)',
            'progress.entries': 'السجلات',
            'progress.weightTrend': 'اتجاه الوزن',
            'progress.bmiTrend': 'اتجاه كتلة الجسم',
            'progress.logTitle': 'تسجيل التقدم',
            'progress.bodyFat': 'نسبة الدهون %',
            'progress.notes': 'ملاحظات',
            'progress.notesPlaceholder': 'كيف حالك اليوم؟',

            // Check-in
            'checkin.title': 'تسجيل دخول QR',
            'checkin.subtitle': 'اعرض هذا الكود عند الاستقبال أو امسح لتسجيل الحضور',
            'checkin.alreadyDone': '✅ تم تسجيل الحضور اليوم بالفعل!',
            'checkin.btn': 'سجل الحضور الآن',

            // Subscription
            'sub.title': 'الاشتراك',
            'sub.subtitle': 'إدارة خطة العضوية الخاصة بك',
            'sub.status': 'الحالة',
            'sub.expires': 'ينتهي في: {0}',
            'sub.availablePlans': 'الخطط المتاحة',
            'sub.paymentHistory': 'سجل المدفوعات',
            'sub.noHistory': 'لا يوجد سجل مدفوعات',
            'sub.currentPlan': 'الخطة الحالية',
            'sub.upgrade': 'ترقية',
            'sub.date': 'التاريخ',
            'sub.amount': 'المبلغ',
            'sub.plan': 'الخطة',
            'sub.method': 'الطريقة',
            'sub.card': 'بطاقة',
            'sub.cash': 'نقداً',
            'sub.transfer': 'تحويل',

            // Trainer
            'trainer.dashTitle': 'لوحة تحكم المدرب',
            'trainer.dashSubtitle': 'راقب أعضاءك وتقدمهم',
            'trainer.totalMembers': 'إجمالي الأعضاء',
            'trainer.weeklyCheckins': 'زيارات الأسبوع',
            'trainer.feedbacksSent': 'ملاحظات مرسلة',
            'trainer.recentCheckins': 'أحدث الزيارات',
            'trainer.noCheckinsToday': 'لا توجد زيارات اليوم',
            'trainer.atRisk': 'أعضاء في خطر',
            'trainer.noRisk': 'لا يوجد أعضاء في خطر',
            'trainer.sendMessage': 'إرسال رسالة',
            'trainer.riskNoCheckins': 'لم يحضر منذ 14 يوماً',
            'trainer.riskLostStreak': 'فقد الاستمرارية',
            'trainer.riskExpiring': 'الاشتراك ينتهي قريباً',
            'trainer.membersTitle': 'الأعضاء',
            'trainer.membersSubtitle': 'عرض ومراقبة تقدم جميع الأعضاء',
            'trainer.plansTitle': 'تعديل الخطط',
            'trainer.plansSubtitle': 'تعديل الخطط الناتجة عن الذكاء الاصطناعي',
            'trainer.feedbackTitle': 'الملاحظات',
            'trainer.feedbackSubtitle': 'إرسال الرسائل والملاحظات للأعضاء',
            'trainer.sentFeedback': 'الملاحظات المرسلة',
            'trainer.noFeedbackSentYet': 'لم يتم إرسال ملاحظات بعد',
            'trainer.feedbackSentTo': 'تم إرسال الملاحظات إلى {0}',
            'trainer.planRegenFor': 'تم إعادة إنشاء الخطة لـ {0}',
            'trainer.workoutsWk': 'تمارين/أسبوع',
            'trainer.coachUpdatedPlan': 'قام المدرب بإعادة إنشاء خطتك التدريبية.',
            'trainer.km': 'كم',

            // Admin
            'admin.dashTitle': 'لوحة تحكم المدير',
            'admin.dashSubtitle': 'تحليلات المنصة والمؤشرات الرئيسية',
            'admin.active': 'نشط',
            'admin.expiringSoon': 'ينتهي قريباً',
            'admin.totalRevenue': 'إجمالي الإيرادات',
            'admin.mrr': 'الدخل الشهري المتحقق',
            'admin.churnRate': 'معدل الانسحاب',
            'admin.revenueLast6': 'الإيرادات (آخر 6 أشهر)',
            'admin.attendanceLast7': 'الحضور (آخر 7 أيام)',
            'admin.planDist': 'توزيع الخطط',
            'admin.subPredictions': 'توقعات الاشتراكات',
            'admin.basedOnPatterns': 'بناءً على الأنماط الحالية:',
            'admin.estRenewals': 'توقعات التجديد',
            'admin.predictedRev': 'الإيرادات المتوقعة',
            'admin.retentionRate': 'معدل الاحتفاظ',
            'admin.revAnalytics': 'تحليلات الإيرادات',
            'admin.revSubtitle': 'سجل المدفوعات وتتبع الإيرادات',
            'admin.member': 'العضو',
            'admin.amount': 'المبلغ',
            'admin.plan': 'الخطة',
            'admin.method': 'الطريقة',
            'admin.noPayments': 'لا توجد مدفوعات',
            'admin.attAnalytics': 'تحليلات الحضور',
            'admin.attSubtitle': 'سجلات الحضور وأنماط التواجد',
            'admin.today': 'اليوم',
            'admin.thisWeek': 'هذا الأسبوع',
            'admin.allTime': 'كل الوقت',
            'admin.time': 'الوقت',
            'admin.allMembers': 'كل الأعضاء',
            'admin.manageGym': 'إدارة عضوية النادي',
            'admin.name': 'الاسم',
            'admin.email': 'البريد الإلكتروني',
            'admin.status': 'الحالة',
            'admin.xp': 'نقاط الخبرة',
            'admin.streak': 'الاستمرارية',
            'admin.joined': 'انضم في',
            'admin.riskDetection': 'كشف المخاطر',
            'admin.riskSubtitle': 'أعضاء تراجع نشاطهم أو تنتهي اشتراكاتهم',
            'admin.highRisk': 'خطر عالي',
            'admin.mediumRisk': 'خطر متوسط',
            'admin.lowRisk': 'خطر منخفض',
            'admin.allGood': 'جميع الأعضاء في حالة جيدة! 🎉',
            'admin.inactive14d': 'غير نشط +14 يوم',
            'admin.lowActivity': 'نشاط منخفض',
            'admin.noStreak': 'لا استمرارية',
            'admin.subExpiring': 'الاشتراك ينتهي قريباً',
            'admin.expired': 'منتهي',
            'admin.plansPricing': 'الخطط والأسعار',
            'admin.manageTiers': 'إدارة فئات الاشتراك',
            'admin.edit': 'تعديل',
            'admin.delete': 'حذف',
            'admin.planUpdated': 'تم تحديث الخطة',
            'admin.planCreated': 'تم إنشاء الخطة',
            'admin.deleteConfirm': 'هل تريد حذف هذه الخطة؟',
            'admin.basic': 'أساسي',
            'admin.pro': 'احترافي',
            'admin.elite': 'نخبة',

            // Challenges
            'challenges.title': 'تحديات المجتمع',
            'challenges.subtitle': 'تنافس، واكسب نقاط خبرة، وافتح الأوسمة، واصعد في لوحة المتصدرين!',
            'challenges.days': 'أيام',
            'challenges.hrs': 'ساعة',
            'challenges.min': 'دقيقة',
            'challenges.participants': 'المشاركين',
            'challenges.xpReward': 'جائزة XP',
            'challenges.badge': 'الوسام',
            'challenges.yourProgress': 'تقدمك',
            'challenges.rank': 'الترتيب',
            'challenges.leave': 'مغادرة التحدي',
            'challenges.join': 'انضم للتحدي 🚀',
            'challenges.top5': 'أفضل 5',
            'challenges.you': '(أنت)',
            'challenges.badgesTitle': '🏅 أوسمة الإنجاز',
            'challenges.unlocked': '✓ تم الفتح',
            'challenges.locked': '🔒 مقفل',
            'challenges.manageTitle': 'إدارة التحديات',
            'challenges.manageSubtitle': 'إنشاء ومراقبة تحديات المجتمع',
            'challenges.newChallenge': 'تحدي جديد',
            'challenges.active': 'نشط',
            'challenges.ended': 'منتهي',
            'challenges.left': 'متبقي',
            'challenges.joinedSuccess': 'تم الانضمام للتحدي! 🎯',
            'challenges.alreadyJoined': 'لقد انضممت بالفعل لهذا التحدي!',
            'challenges.leftSuccess': 'غادرت التحدي',
            'challenges.deletedSuccess': 'تم حذف التحدي',
            'challenges.createdSuccess': 'تم إنشاء التحدي! 🎯',
            'challenges.badgeUnlockedTitle': '🏅 تم فتح وسام!',
            'challenges.badgeUnlockedMsg': 'لقد حصلت على وسام "{0}" {1}!',
            'challenges.badge_B001_name': 'الخطوات الأولى',
            'challenges.badge_B001_desc': 'أكمل أول تحدي لك',
            'challenges.badge_B002_name': 'سيد الخطوات',
            'challenges.badge_B002_desc': 'امشي 100,000 خطوة في شهر',
            'challenges.badge_B003_name': 'محارب الحديد',
            'challenges.badge_B003_desc': 'أكمل 20 تمرين في شهر',
            'challenges.badge_B004_name': 'ملك السعرات',
            'challenges.badge_B004_desc': 'احرق 50,000 سعرة في شهر',
            'challenges.badge_B005_name': 'أسطورة الاستمرارية',
            'challenges.badge_B005_desc': 'استمرارية لمدة 14 يوم',
            'challenges.badge_B006_name': 'صائد XP',
            'challenges.badge_B006_desc': 'اكسب 2,000 XP في شهر',
            'challenges.badge_B007_name': 'لاعب فريق',
            'challenges.badge_B007_desc': 'انضم إلى 3 تحديات',
            'challenges.badge_B008_name': 'البطل',
            'challenges.badge_B008_desc': 'احتل المراكز الثلاثة الأولى',
            'challenges.manage': 'إدارة التحديات',
            'challenges.new': '+ تحدي جديد',

            // Chat
            'chat.title': 'مساعد اللياقة الذكي',
            'chat.status': 'متصل — مخصص لك',
            'chat.clear': 'مسح المحادثة',
            'chat.welcomeTitle': 'أهلاً {0}! أنا مساعدك الرياضي الذكي',
            'chat.welcomeDesc': 'أعرف بياناتك — مستوى {0}، هدفك {1}. اسألني أي شيء!',
            'chat.placeholder': 'اسألني أي شيء عن اللياقة...',
            'chat.historyCleared': 'تم مسح سجل المحادثة',
            'chat.welcome': 'أنا مساعدك الذكي للياقة',
            'chat.online': 'متصل — مخصص لك',

            // Churn
            'churn.title': 'تحليل الانسحاب',
            'churn.subtitle': 'رؤى تنبؤية لاحتفاظ الأعضاء مدعومة بتسجيل الذكاء الاصطناعي',
            'churn.criticalRisk': 'خطر حرج',
            'churn.highRisk': 'خطر عالي',
            'churn.mediumRisk': 'خطر متوسط',
            'churn.lowRisk': 'خطر منخفض',
            'churn.avgChurnRisk': 'متوسط خطر الانسحاب',
            'churn.avgRisk': 'متوسط الخطر',
            'churn.riskTrend': 'اتجاه خطر الانسحاب (8 أسابيع)',
            'churn.atRiskMembers': 'أعضاء في خطر',
            'churn.sendOffer': 'إرسال عرض',
            'churn.offerSentTitle': '🎁 تم إرسال عرض الاحتفاظ',
            'churn.offerSentMsg': 'تم إرسال عرض تجديد بخصم 20% لـ {0}. العرض ينتهي خلال 48 ساعة.',
            'churn.offerSentSuccess': 'تم إرسال عرض الاحتفاظ لـ {0}!',
            'churn.noVisits30d': 'لا زيارات 30 يوم',
            'churn.inactive14d': 'غير نشط +14 يوم',
            'churn.veryLowActivity': 'نشاط منخفض جداً',
            'churn.belowAvgActivity': 'نشاط تحت المتوسط',
            'churn.dormant30d': 'خامل +30 يوم',
            'churn.slowingDown': 'تباطؤ في النشاط',
            'churn.expiring3d': 'ينتهي خلال أقل من 3 أيام',
            'churn.expiring7d': 'ينتهي خلال أقل من 7 أيام',
            'churn.noSubscription': 'لا يوجد اشتراك',
            'churn.avgChurnRiskLabel': '% متوسط خطر الانسحاب',
            'churn.atRiskMembersLabel': 'أعضاء في خطر',
            'churn.trend': 'اتجاه خطر الانسحاب (8 أسابيع)',
            'churn.atRisk': 'الأعضاء المعرضون للخطر',

            // Gamification
            'gamify.levelUp': 'ارتقاء في المستوى!',
            'gamify.reachedTier': 'لقد وصلت إلى فئة {0}! استمر في التقدم!',
            'gamify.keepTraining': 'استمر في التمرين لفتح المستوى التالي!',
            'gamify.leaderboardTitle': 'لوحة المتصدرين',
            'gamify.leaderboardSubtitle': 'أفضل المتصدرين حسب نقاط الخبرة (XP)',
            'gamify.dayStreak': 'استمرارية {0} أيام',
            'tier.iron': 'حديدي',
            'tier.bronze': 'برونزي',
            'tier.silver': 'فضي',
            'tier.gold': 'ذهبي',
            'tier.platinum': 'بلاتيني',
            'tier.diamond': 'ألماسي',
            'gamification.levelUp': 'ترقية المستوى!',
            'gamification.awesome': 'رائع!',

            // Health
            'health.title': 'بيانات الصحة',
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
            'health.connectedBadge': 'متصل',
            'health.connectSuccess': 'تم الاتصال بـ {0}!',
            'health.syncSuccess': 'تمت المزامنة بنجاح مع {0}',
            'health.disconnected': 'تم قطع اتصال البيانات الصحية',
            'health.syncedFrom': 'تمت المزامنة من {0}',
            'health.stepsChart': 'الخطوات (7 أيام)',
            'health.calChart': 'السعرات المحروقة (7 أيام)',
            'health.hrChart': 'اتجاه نبضات القلب (7 أيام)',
            'health.zoneExcel': 'ممتاز',
            'health.zoneGood': 'جيد',
            'health.zoneMod': 'متوسط',

            // Days
            'day.sun': 'الأحد',
            'day.mon': 'الاثنين',
            'day.tue': 'الثلاثاء',
            'day.wed': 'الأربعاء',
            'day.thu': 'الخميس',
            'day.fri': 'الجمعة',
            'day.sat': 'السبت',

            // Levels & Goals
            'level.beginner': 'مبتدئ',
            'level.intermediate': 'متوسط',
            'level.advanced': 'متقدم',
            'goal.lose_weight': 'خسارة الوزن',
            'goal.build_muscle': 'بناء العضلات',
            'goal.endurance': 'التحمل',
            'goal.general': 'لياقة عامة',

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
            'general.justNow': 'الآن',
            'general.minsAgo': 'منذ {0} دقيقة',
            'general.hrsAgo': 'منذ {0} ساعة',
            'general.daysAgo': 'منذ {0} يوم',
            'general.invalidCreds': 'بيانات الاعتماد غير صالحة',
            'general.emailRegistered': 'البريد الإلكتروني مسجل بالفعل',
            'general.welcomeUser': 'مرحباً بعودتك، {0}!',
            'general.accountCreated': 'تم إنشاء الحساب! مرحباً، {0}!',
            'general.demoLogin': 'تم تسجيل الدخول كـ {0} تجريبي',
            'general.otpSent': 'أدخل الرمز المكون من 6 أرقام المرسل إلى {0}',
            'general.otpResent': 'تم إعادة إرسال الرمز!',
            'general.otpExpired': 'انتهت الصلاحية',
            'general.otpEnterAll': 'أدخل الـ 6 أرقام بالكامل',
            'general.otpVerifyTitle': 'تأكيد بريدك الإلكتروني',
            'general.otpVerifyCodeSent': 'أدخل الرمز المكون من 6 أرقام المرسل إلى بريدك',
            'general.otpExpiresIn': 'تنتهي صلاحية الرمز خلال',
            'general.otpNotReceived': 'لم تستلم الرمز؟',
            'general.otpResend': 'إعادة إرسال',

            // Feedback
            'feedback.title': 'إرسال ملاحظات',
            'feedback.to': 'إلى',
            'feedback.message': 'الرسالة',
            'feedback.placeholder': 'تقدم رائع هذا الأسبوع!',
            'feedback.send': 'إرسال',
        }
    },

    // Translate a key with optional placeholders
    t(key, params = []) {
        let text = this.translations[this.currentLang]?.[key] || this.translations['en']?.[key] || key;
        if (params.length > 0) {
            params.forEach((param, i) => {
                text = text.replace(`{${i}}`, param);
            });
        }
        return text;
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

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                if (el.placeholder && el.getAttribute('placeholder') !== '') {
                    el.placeholder = translated;
                }
                // Handle select options if they have data-i18n
                if (el.tagName === 'SELECT') {
                    Array.from(el.options).forEach(opt => {
                        const optKey = opt.getAttribute('data-i18n');
                        if (optKey) opt.textContent = this.t(optKey);
                    });
                }
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
