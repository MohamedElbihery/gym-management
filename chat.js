/* ============================================
   GymForge PRO — AI Fitness Assistant
   Chat Interface, Personalized Responses,
   Workout/Nutrition/Motivation AI
   Arabic + English Support
   ============================================ */

const AIAssistant = {
    typingDelay: 800,

    // Arabic detection regex
    isArabic(text) {
        return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
    },

    // Intent patterns for classification
    intents: {
        greeting: /^(hi|hello|hey|yo|sup|good\s*(morning|evening|afternoon)|مرحبا|اهلا|السلام|صباح|مساء)/i,
        workout: /(workout|exercise|training|lift|bench|squat|deadlift|push.?up|pull.?up|muscle|gym|reps|sets|split|routine|تمرين|تدريب|عضل|حديد|جيم|تمارين|ضغط|بطن|صدر|ظهر|رجل|ذراع)/i,
        nutrition: /(nutrition|diet|meal|food|eat|protein|carb|fat|calorie|macro|keto|bulk|cut|وجبة|تغذية|اكل|بروتين|سعرات|دايت|نظام غذائي|طعام|كربوهيدرات)/i,
        motivation: /(motivat|tired|lazy|can't|don't feel|skip|give up|hard|difficult|struggling|تعبان|صعب|كسلان|تحفيز|ملل|زهقت|مش قادر|صعبة)/i,
        progress: /(progress|result|gain|lost|weight|body\s*fat|improve|plateau|نتيجة|تقدم|وزن|نتائج|تحسن|قياسات)/i,
        injury: /(injury|pain|hurt|sore|ache|strain|sprain|إصابة|ألم|وجع|التهاب)/i,
        supplement: /(supplement|creatine|whey|bcaa|pre.?workout|vitamin|مكمل|كرياتين|واي|فيتامين)/i,
        recovery: /(recover|rest|sleep|stretch|cool\s*down|warm\s*up|foam\s*roll|راحة|نوم|استشفاء|تمدد|إحماء)/i,
        goal: /(goal|target|plan|want to|how to|achieve|reach|هدف|خطة|أريد|كيف|أبغى|عايز)/i,
    },

    getUserContext() {
        const u = Auth.currentUser;
        if (!u) return {};
        return {
            name: u.name?.split(' ')[0] || 'there',
            goal: u.goal || 'general',
            weight: u.weight || 70,
            height: u.height || 170,
            age: u.age || 25,
            gender: u.gender || 'male',
            level: u.level || u.experience || 'beginner',
            xp: u.xp || 0,
            streak: u.streak || 0,
            workoutDays: u.workoutDays || u.daysPerWeek || 3,
        };
    },

    generateResponse(message) {
        const ctx = this.getUserContext();
        const msg = message.toLowerCase().trim();
        const arabic = this.isArabic(message);
        let intent = 'general';
        for (const [key, pattern] of Object.entries(this.intents)) {
            if (pattern.test(msg)) { intent = key; break; }
        }
        const responses = arabic ? this.getArabicPool(intent, ctx) : this.getEnglishPool(intent, ctx);
        return responses[Math.floor(Math.random() * responses.length)];
    },

    // ==================== ARABIC RESPONSES ====================
    getArabicPool(intent, ctx) {
        const goalAr = { lose_weight: 'خسارة الوزن', build_muscle: 'بناء العضلات', endurance: 'تحسين اللياقة', general: 'اللياقة العامة' }[ctx.goal] || 'اللياقة';
        const levelAr = { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم' }[ctx.level] || 'مبتدئ';
        const bmr = ctx.gender === 'male'
            ? Math.round(88.362 + (13.397 * ctx.weight) + (4.799 * ctx.height) - (5.677 * ctx.age))
            : Math.round(447.593 + (9.247 * ctx.weight) + (3.098 * ctx.height) - (4.330 * ctx.age));
        const tdee = Math.round(bmr * 1.55);

        const pools = {
            greeting: [
                `أهلاً ${ctx.name}! 💪 جاهز تحقق أهدافك في ${goalAr} اليوم؟ كيف أقدر أساعدك؟`,
                `مرحباً ${ctx.name}! 🔥 سلسلتك ${ctx.streak} يوم رائعة! بماذا أقدر أساعدك؟`,
                `يا هلا ${ctx.name}! أنا مساعدك الرياضي الذكي. اسألني عن التمارين، التغذية، أو أي شيء يخص اللياقة! 🏋️`,
            ],
            workout: [
                `بناءً على مستواك (${levelAr}) وهدفك (${goalAr}):\n\n**برنامج ${ctx.workoutDays} أيام:**\n${ctx.goal === 'build_muscle' ? '• ركّز على زيادة الأوزان تدريجياً\n• ٣-٤ مجموعات × ٨-١٢ تكرار\n• راحة ٦٠-٩٠ ثانية بين المجموعات' : ctx.goal === 'lose_weight' ? '• ادمج تمارين المقاومة مع الكارديو\n• تمارين دائرية لحرق السعرات\n• ٣ مجموعات × ١٢-١٥ تكرار' : '• نوّع بين التمارين المركبة والعزل\n• غيّر نطاق التكرارات (٨-١٥)\n• أضف تمارين وظيفية'}\n\n💡 شيّك تبويب **خطتي** لبرنامجك الكامل!`,
                `تمرين سريع لمستواك اليوم:\n\n🔥 **تمرين الجسم الكامل:**\n١. سكوات بالبار — ${ctx.level === 'beginner' ? '٣×١٠' : '٤×٨'}\n٢. بنش برس — ${ctx.level === 'beginner' ? '٣×١٠' : '٤×٨'}\n٣. تجديف بالبار — ٣×١٠\n٤. ضغط كتف — ٣×١٠\n٥. رومانيان ديدلفت — ٣×١٢\n٦. بلانك — ٣×٤٥ ثانية\n\n💪 راحة ٦٠-٩٠ ثانية. ركّز على الفورم!`,
            ],
            nutrition: [
                `بناءً على بياناتك (${ctx.weight} كجم، ${ctx.height} سم، ${ctx.age} سنة):\n\n📊 **الأهداف اليومية:**\n• معدل الأيض: ~${bmr} سعرة\n• احتياجك اليومي: ~${tdee} سعرة\n• ${ctx.goal === 'lose_weight' ? `الهدف: ~${tdee - 500} سعرة (عجز)\n• بروتين: ${Math.round(ctx.weight * 2)} جرام` : ctx.goal === 'build_muscle' ? `الهدف: ~${tdee + 300} سعرة (فائض)\n• بروتين: ${Math.round(ctx.weight * 2.2)} جرام` : `الهدف: ~${tdee} سعرة (ثبات)\n• بروتين: ${Math.round(ctx.weight * 1.8)} جرام`}\n\n🍽 شيّك تبويب **التغذية** لتفاصيل أكثر!`,
                `خطة وجبات يومية لـ${goalAr}:\n\n🌅 **الفطور:** شوفان + موز + واي بروتين\n🥗 **الغداء:** صدر دجاج مشوي + أرز بني + خضار\n🍌 **سناك:** زبادي يوناني + لوز + توت\n🥩 **العشاء:** سلمون + بطاطا حلوة + بروكلي\n\n💧 لا تنسى تشرب ٢-٣ لتر ماء يومياً!`,
            ],
            motivation: [
                `أسمعك يا ${ctx.name}. كلنا نمر بأيام صعبة:\n\n🔥 **سلسلتك ${ctx.streak} يوم!** لا تضيّعها.\n💪 كل تكرار يحسب، حتى في الأيام الصعبة.\n🧠 الانضباط أقوى من الحماس.\n\n> "أسوأ تمرين هو اللي ما صار"\n\nحتى ٢٠ دقيقة أحسن من لا شيء. أنت تقدر! 💪`,
                `الإحساس بعدم الرغبة طبيعي:\n\n١️⃣ **حط أهداف صغيرة** — التزم بـ ١٥ دقيقة بس\n٢️⃣ **البس ملابس الجيم** — أصعب خطوة هي البداية\n٣️⃣ **تذكّر ليش بدأت** — أنت تشتغل على ${goalAr}\n٤️⃣ **عندك ${ctx.xp} XP!**\n\n> "ما يصير أسهل، أنت تصير أقوى"\n\nيلا! مجموعة وحدة بكل مرة. 🔥`,
            ],
            progress: [
                `لمتابعة تقدمك في ${goalAr}:\n\n📏 **فحص أسبوعي:**\n• الوزن (نفس الوقت كل أسبوع)\n• القياسات (خصر، صدر، ذراع)\n• صور التقدم\n• أرقام القوة\n\n📈 **إحصائياتك:** ${ctx.weight} كجم، ${ctx.xp} XP\n\nشيّك تبويب **التقدم** للرسوم البيانية! 📊`,
            ],
            injury: [
                `⚠️ **مهم:** أنا مساعد ذكي، مش دكتور:\n\n١️⃣ **توقف** عن التمرين فوراً\n٢️⃣ **بروتوكول RICE:** راحة، ثلج، ضغط، رفع\n٣️⃣ **راجع متخصص** إذا الألم استمر أكثر من ٤٨ ساعة\n\nصحتك أولاً يا ${ctx.name}! 🏥`,
            ],
            supplement: [
                `المكملات اللي أنصحك فيها لـ${goalAr}:\n\n✅ **أساسية:**\n• **واي بروتين** — بعد التمرين\n• **كرياتين مونوهيدرات** — ٥ جرام يومياً\n• **ملتي فيتامين** — يغطي النقص\n\n🟡 **اختياري:**\n• **أوميغا ٣** — صحة المفاصل\n• **فيتامين D3** — خاصة لو قليل الشمس\n\n⚠️ ما في مكمل يعوّض التغذية الصح!`,
            ],
            recovery: [
                `الاستشفاء هو وين تصير النتائج:\n\n😴 **النوم:** ٧-٩ ساعات\n🧘 **التمدد:** ١٠-١٥ دقيقة بعد التمرين\n💧 **الترطيب:** ٢-٣ لتر يومياً\n🍌 **بعد التمرين:** بروتين + كربوهيدرات خلال ٣٠ دقيقة\n\n📅 مع ${ctx.workoutDays} أيام تمرين، عندك ${7 - ctx.workoutDays} أيام راحة — استغلها! 💪`,
            ],
            goal: [
                `يلا نحط خطة لـ${goalAr}!\n\n🎯 **بياناتك:** ${ctx.weight} كجم | ${levelAr}\n📋 **خطة العمل:**\n${ctx.goal === 'lose_weight' ? '١. عجز سعرات ٥٠٠/يوم\n٢. بروتين عالي\n٣. تمارين مقاومة\n٤. كارديو ٢-٣ مرات' : ctx.goal === 'build_muscle' ? '١. فائض سعرات ٣٠٠/يوم\n٢. بروتين ٢.٢ جرام/كجم\n٣. زيادة تدريجية بالأوزان\n٤. تمارين مركبة' : '١. سعرات متوازنة\n٢. مزيج قوة وكارديو\n٣. زيادة تدريجية\n٤. روتين ثابت'}\n\n⏱ توقع نتائج خلال ٨-١٢ أسبوع! 🔥`,
            ],
            general: [
                `أقدر أساعدك بأشياء كثيرة يا ${ctx.name}! جرب تسأل عن:\n\n💪 **التمارين** — الفورم، البرامج\n🍎 **التغذية** — وجبات، ماكروز\n📈 **التقدم** — متابعة، تعديلات\n🔥 **التحفيز** — نصائح للاستمرار\n🧘 **الاستشفاء** — نوم، تمدد\n🏆 **الأهداف** — وضع وتحقيق أهداف\n\nاكتب سؤالك وبعطيك نصيحة مخصصة! 🔥`,
            ]
        };
        return pools[intent] || pools.general;
    },

    // ==================== ENGLISH RESPONSES ====================
    getEnglishPool(intent, ctx) {
        const goalText = { lose_weight: 'weight loss', build_muscle: 'muscle building', endurance: 'endurance training', general: 'general fitness' }[ctx.goal] || 'fitness';
        const bmr = ctx.gender === 'male'
            ? Math.round(88.362 + (13.397 * ctx.weight) + (4.799 * ctx.height) - (5.677 * ctx.age))
            : Math.round(447.593 + (9.247 * ctx.weight) + (3.098 * ctx.height) - (4.330 * ctx.age));
        const tdee = Math.round(bmr * 1.55);

        const pools = {
            greeting: [
                `Hey ${ctx.name}! 💪 Ready to crush your ${goalText} goals today? What can I help you with?`,
                `Welcome back, ${ctx.name}! 🔥 Your ${ctx.streak}-day streak is awesome! How can I assist you?`,
                `Hi ${ctx.name}! I'm your AI fitness assistant. Ask me about workouts, nutrition, or anything fitness-related!`,
            ],
            workout: [
                `Based on your ${ctx.level} level and ${goalText} goal:\n\n**${ctx.workoutDays}-Day Split:**\n${ctx.goal === 'build_muscle' ? '• Focus on progressive overload\n• 3-4 sets of 8-12 reps for hypertrophy\n• Rest 60-90 seconds between sets' : ctx.goal === 'lose_weight' ? '• Combine resistance training with cardio\n• Circuit-style training for calorie burn\n• 3 sets of 12-15 reps' : '• Mix compound and isolation exercises\n• Vary rep ranges (8-15)\n• Include functional movements'}\n\n💡 Check your **My Plan** tab for your full program!`,
                `Quick ${ctx.level}-level workout:\n\n🔥 **Full Body Blast:**\n1. Barbell Squats — ${ctx.level === 'beginner' ? '3×10' : '4×8'}\n2. Bench Press — ${ctx.level === 'beginner' ? '3×10' : '4×8'}\n3. Bent-Over Rows — 3×10\n4. Military Press — 3×10\n5. Romanian Deadlifts — 3×12\n6. Plank — 3×45sec\n\n💪 Rest 60-90s between sets. Form over weight!`,
            ],
            nutrition: [
                `Based on your profile (${ctx.weight}kg, ${ctx.height}cm, ${ctx.age}y):\n\n📊 **Daily Targets:**\n• BMR: ~${bmr} cal\n• TDEE: ~${tdee} cal\n• ${ctx.goal === 'lose_weight' ? `Target: ~${tdee - 500} cal (deficit)\n• Protein: ${Math.round(ctx.weight * 2)}g` : ctx.goal === 'build_muscle' ? `Target: ~${tdee + 300} cal (surplus)\n• Protein: ${Math.round(ctx.weight * 2.2)}g` : `Target: ~${tdee} cal (maintenance)\n• Protein: ${Math.round(ctx.weight * 1.8)}g`}\n\n🍽 Check your **Nutrition** tab for details!`,
                `Sample ${goalText} meal plan:\n\n🌅 **Breakfast:** Oatmeal + banana + whey protein\n🥗 **Lunch:** Grilled chicken + brown rice + veggies\n🍌 **Snack:** Greek yogurt + almonds + berries\n🥩 **Dinner:** Salmon + sweet potato + broccoli\n\n💧 Drink 2-3L water daily!`,
            ],
            motivation: [
                `I hear you, ${ctx.name}. Everyone has tough days:\n\n🔥 **You have a ${ctx.streak}-day streak!** Don't break it.\n💪 Every rep counts, even on bad days.\n🧠 Discipline > Motivation.\n\n> "The only bad workout is the one that didn't happen."\n\nEven 20 minutes beats nothing. You got this! 💪`,
                `Feeling unmotivated is totally normal:\n\n1️⃣ **Set micro-goals** — commit to 15 minutes\n2️⃣ **Put on gym clothes** — hardest part is starting\n3️⃣ **Remember your WHY** — ${goalText}\n4️⃣ **Track wins** — you have ${ctx.xp} XP!\n\n> "It doesn't get easier, you get stronger."\n\nOne set at a time. Let's go! 🔥`,
            ],
            progress: [
                `For ${goalText} tracking:\n\n📏 **Weekly checks:**\n• Weight (same time weekly)\n• Measurements (waist, chest, arms)\n• Progress photos\n• Strength numbers\n\n📈 **Your stats:** ${ctx.weight}kg, ${ctx.xp} XP\n\nCheck your **Progress** tab! 📊`,
            ],
            injury: [
                `⚠️ **Important:** I'm an AI, not a doctor:\n\n1️⃣ **Stop** the activity immediately\n2️⃣ **RICE:** Rest, Ice, Compression, Elevation\n3️⃣ **See a professional** if pain persists 48+ hours\n\nHealth first, ${ctx.name}! 🏥`,
            ],
            supplement: [
                `Supplements for ${goalText}:\n\n✅ **Essential:**\n• **Whey Protein** — post-workout\n• **Creatine** — 5g daily\n• **Multivitamin** — cover gaps\n\n🟡 **Optional:**\n• **Fish Oil** — joints\n• **Vitamin D3** — if low sun\n\n⚠️ No supplement replaces good nutrition!`,
            ],
            recovery: [
                `Recovery is where gains happen:\n\n😴 **Sleep:** 7-9 hours\n🧘 **Stretching:** 10-15 min post-workout\n💧 **Hydration:** 2-3L daily\n🍌 **Post-Workout:** Protein + carbs within 30 min\n\n📅 ${ctx.workoutDays} training + ${7 - ctx.workoutDays} recovery days! 💪`,
            ],
            goal: [
                `Let's plan your ${goalText} journey!\n\n🎯 **Profile:** ${ctx.weight}kg | ${ctx.level}\n📋 **Action Plan:**\n${ctx.goal === 'lose_weight' ? '1. 500cal deficit/day\n2. High protein (2g/kg)\n3. Resistance training\n4. Cardio 2-3x/week' : ctx.goal === 'build_muscle' ? '1. 300cal surplus/day\n2. Protein 2.2g/kg\n3. Progressive overload\n4. Compound movements' : '1. Maintenance calories\n2. Strength + cardio\n3. Progressive overload\n4. Consistent routine'}\n\n⏱ Visible results in 8-12 weeks! 🔥`,
            ],
            general: [
                `I can help with a lot, ${ctx.name}! Ask about:\n\n💪 **Workouts** — form, splits, routines\n🍎 **Nutrition** — meals, macros, supplements\n📈 **Progress** — tracking, plateaus\n🔥 **Motivation** — staying consistent\n🧘 **Recovery** — sleep, stretching\n🏆 **Goals** — setting and achieving\n\nType your question! 🔥`,
            ]
        };
        return pools[intent] || pools.general;
    },

    // Quick actions (language-aware)
    getQuickActions() {
        const arabic = typeof I18n !== 'undefined' && I18n.currentLang === 'ar';
        if (arabic) {
            return [
                { label: '💪 نصائح تمارين', msg: 'أعطني تمرين لليوم' },
                { label: '🍎 نصائح تغذية', msg: 'ايش المفروض آكل اليوم؟' },
                { label: '🔥 حفّزني', msg: 'أنا حاسس بكسل اليوم' },
                { label: '📈 تتبع التقدم', msg: 'كيف أتابع تقدمي؟' },
                { label: '💊 مكملات', msg: 'ايش المكملات اللي أحتاجها؟' },
                { label: '🧘 استشفاء', msg: 'كيف أستشفي بعد التمرين؟' },
            ];
        }
        return [
            { label: '💪 Workout tips', msg: 'Give me a workout for today' },
            { label: '🍎 Nutrition advice', msg: 'What should I eat today?' },
            { label: '🔥 Motivate me', msg: "I'm feeling lazy today" },
            { label: '📈 Track progress', msg: 'How do I track my progress?' },
            { label: '💊 Supplements', msg: 'What supplements should I take?' },
            { label: '🧘 Recovery', msg: 'How should I recover after workouts?' },
        ];
    },

    // Chat History
    getChatHistory() {
        if (!Auth.currentUser) return [];
        return Store.getA(`chat_${Auth.currentUser.id}`);
    },

    saveChatHistory(messages) {
        if (!Auth.currentUser) return;
        Store.set(`chat_${Auth.currentUser.id}`, messages);
    },

    addMessage(role, content) {
        const history = this.getChatHistory();
        const arabic = this.isArabic(content);
        history.push({ role, content, language: arabic ? 'ar' : 'en', timestamp: new Date().toISOString() });
        this.saveChatHistory(history);
        // Save to API if available
        if (typeof ApiClient !== 'undefined' && Auth.currentUser) {
            ApiClient.checkBackend().then(ok => {
                if (ok) ApiClient.saveChatMessage(Auth.currentUser.id, { role, content, language: arabic ? 'ar' : 'en' }).catch(() => { });
            });
        }
        return history;
    },

    // ==================== RENDER ====================
    renderChat() {
        const s = document.getElementById('section-u-assistant');
        if (!s) return;
        const history = this.getChatHistory();
        const ctx = this.getUserContext();
        const ar = typeof I18n !== 'undefined' && I18n.currentLang === 'ar';

        s.innerHTML = `
            <div class="chat-container">
                <div class="chat-header">
                    <div class="chat-header-left">
                        <div class="chat-ai-avatar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27a7 7 0 0 1-12.46 0H6a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/><circle cx="9" cy="15" r="1" fill="currentColor"/><circle cx="15" cy="15" r="1" fill="currentColor"/></svg>
                        </div>
                        <div class="chat-header-info">
                            <h3>${I18n.t('chat.title')}</h3>
                            <span class="chat-status">● ${I18n.t('chat.status')}</span>
                        </div>
                    </div>
                    <button class="btn btn-ghost btn-sm" onclick="AIAssistant.clearChat()">${I18n.t('chat.clear')}</button>
                </div>

                <div class="chat-messages" id="chatMessages">
                    ${history.length === 0 ? `
                        <div class="chat-welcome">
                            <div class="chat-welcome-icon">🤖</div>
                            <h3>${I18n.t('chat.welcomeTitle', [ctx.name])}</h3>
                            <p>${I18n.t('chat.welcomeDesc', [I18n.t('level.' + ctx.level) || ctx.level, I18n.t('goal.' + ctx.goal) || ctx.goal])}</p>
                            <div class="chat-quick-actions">
                                ${this.getQuickActions().map(a => `<button class="chat-quick-btn" onclick="AIAssistant.sendQuickAction('${a.msg.replace(/'/g, "\\'")}')">${a.label}</button>`).join('')}
                            </div>
                        </div>
                    ` : history.map(m => this.renderMessage(m)).join('')}
                </div>

                <div class="chat-input-area">
                    <div class="chat-quick-bar" id="chatQuickBar">
                        ${this.getQuickActions().slice(0, 4).map(a => `<button class="chat-quick-chip" onclick="AIAssistant.sendQuickAction('${a.msg.replace(/'/g, "\\'")}')">${a.label}</button>`).join('')}
                    </div>
                    <div class="chat-input-wrap">
                        <input type="text" id="chatInput" class="chat-input" placeholder="${I18n.t('chat.placeholder')}" autocomplete="off">
                        <button class="chat-send-btn" id="chatSendBtn" onclick="AIAssistant.handleSend()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        const input = document.getElementById('chatInput');
        if (input) {
            input.addEventListener('keydown', e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.handleSend(); }
            });
        }
        this.scrollToBottom();
    },

    renderMessage(msg) {
        const isUser = msg.role === 'user';
        const time = msg.timestamp ? formatTime(msg.timestamp) : '';
        const content = this.formatMarkdown(msg.content);
        const isAr = msg.language === 'ar' || this.isArabic(msg.content);
        return `
            <div class="chat-msg ${isUser ? 'chat-msg-user' : 'chat-msg-ai'}" ${isAr ? 'dir="rtl"' : ''}>
                ${!isUser ? '<div class="chat-msg-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27a7 7 0 0 1-12.46 0H6a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg></div>' : ''}
                <div class="chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}">
                    <div class="chat-bubble-content">${content}</div>
                    <span class="chat-time">${time}</span>
                </div>
            </div>
        `;
    },

    formatMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^> (.*)/gm, '<blockquote>$1</blockquote>')
            .replace(/^• (.*)/gm, '<div class="chat-list-item">• $1</div>')
            .replace(/^(\d+[.️⃣]) (.*)/gm, '<div class="chat-list-item">$1 $2</div>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    },

    handleSend() {
        const input = document.getElementById('chatInput');
        if (!input) return;
        const msg = input.value.trim();
        if (!msg) return;
        input.value = '';
        this.addMessage('user', msg);
        this.appendMessageToUI('user', msg);
        this.showTyping(true);
        setTimeout(() => {
            this.showTyping(false);
            const response = this.generateResponse(msg);
            this.addMessage('assistant', response);
            this.appendMessageToUI('assistant', response);
        }, this.typingDelay + Math.random() * 600);
    },

    sendQuickAction(msg) {
        const input = document.getElementById('chatInput');
        if (input) input.value = msg;
        this.handleSend();
    },

    appendMessageToUI(role, content) {
        const container = document.getElementById('chatMessages');
        if (!container) return;
        const welcome = container.querySelector('.chat-welcome');
        if (welcome) welcome.remove();
        container.insertAdjacentHTML('beforeend', this.renderMessage({ role, content, timestamp: new Date().toISOString() }));
        this.scrollToBottom();
    },

    showTyping(show) {
        const container = document.getElementById('chatMessages');
        if (!container) return;
        const existing = container.querySelector('.chat-typing');
        if (existing) existing.remove();
        if (show) {
            container.insertAdjacentHTML('beforeend', `
                <div class="chat-msg chat-msg-ai chat-typing">
                    <div class="chat-msg-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27a7 7 0 0 1-12.46 0H6a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg></div>
                    <div class="chat-bubble chat-bubble-ai"><div class="typing-indicator"><span></span><span></span><span></span></div></div>
                </div>
            `);
            this.scrollToBottom();
        }
    },

    scrollToBottom() {
        const container = document.getElementById('chatMessages');
        if (container) setTimeout(() => { container.scrollTop = container.scrollHeight; }, 50);
    },

    clearChat() {
        if (!Auth.currentUser) return;
        Store.set(`chat_${Auth.currentUser.id}`, []);
        if (typeof ApiClient !== 'undefined') {
            ApiClient.checkBackend().then(ok => { if (ok) ApiClient.clearChat(Auth.currentUser.id).catch(() => { }); });
        }
        this.renderChat();
        showToast(I18n.t('chat.historyCleared'), 'success');
    }
};
