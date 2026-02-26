/* ============================================
   GymForge PRO — User Module
   Dashboard, Plan, Nutrition, Progress,
   Leaderboard, QR Check-In, Subscription
   ============================================ */

const UserModule = {
    progressChart: null,
    bmiChart: null,

    onNav(section) {
        if (!Auth.currentUser || Auth.currentUser.role !== 'member') return;
        switch (section) {
            case 'u-dashboard': this.renderDashboard(); break;
            case 'u-plan': this.renderPlan(); break;
            case 'u-nutrition': this.renderNutrition(); break;
            case 'u-progress': this.renderProgress(); break;
            case 'u-leaderboard': Gamification.renderLeaderboard('section-u-leaderboard'); break;
            case 'u-checkin': this.renderCheckIn(); break;
            case 'u-subscription': this.renderSubscription(); break;
        }
    },

    // ==================== DASHBOARD ====================
    renderDashboard() {
        const u = Auth.currentUser;
        const plan = Store.getA('workout_plans').find(p => p.userId === u.id);
        const todayIndex = todayDayIndex();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayPlan = plan?.plan?.find(d => d.day === dayNames[todayIndex]);
        const attendance = Store.getA('attendance').filter(a => a.userId === u.id);
        const todayChecked = attendance.some(a => a.date === todayStr());

        const s = document.getElementById('section-u-dashboard');
        s.innerHTML = `
            <div class="welcome-banner">
                <div>
                    <h2>Hey, ${u.name.split(' ')[0]}! 💪</h2>
                    <p>${todayPlan && !todayPlan.rest ? `Today's focus: <strong>${todayPlan.label}</strong>` : 'Rest day — recover and come back stronger!'}</p>
                </div>
                <div class="streak-box">
                    <span class="streak-fire">🔥</span>
                    <div>
                        <div class="streak-count">${u.streak || 0}</div>
                        <div class="streak-label">Day Streak</div>
                    </div>
                </div>
            </div>

            <div class="xp-bar-container" id="dashXPBar"></div>

            <div class="kpi-grid">
                <div class="kpi-card"><div class="kpi-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg></div><div class="kpi-data"><span class="kpi-value">${attendance.filter(a => { const d = new Date(a.date); const now = new Date(); return d >= new Date(now - 7 * 86400000); }).length}</span><span class="kpi-label">Workouts This Week</span></div></div>
                <div class="kpi-card"><div class="kpi-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><div class="kpi-data"><span class="kpi-value">${u.weight ? u.weight + ' kg' : '—'}</span><span class="kpi-label">Current Weight</span></div></div>
                <div class="kpi-card"><div class="kpi-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg></div><div class="kpi-data"><span class="kpi-value">${todayChecked ? '✓' : '—'}</span><span class="kpi-label">Checked In Today</span></div></div>
                <div class="kpi-card"><div class="kpi-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="kpi-data"><span class="kpi-value">${attendance.length}</span><span class="kpi-label">Total Visits</span></div></div>
            </div>

            ${todayPlan && !todayPlan.rest ? `
            <div class="today-preview">
                <h3>Today's Workout</h3>
                <div class="today-muscle">${todayPlan.label} — ${todayPlan.muscles.join(', ')}</div>
                <div class="exercise-list-items">
                    ${todayPlan.exercises.slice(0, 5).map(ex => `
                        <div class="exercise-item">
                            <div class="exercise-check ${ex.completed ? 'done' : ''}"></div>
                            <span class="exercise-name">${ex.name}</span>
                            <span class="exercise-detail">${ex.sets}×${ex.reps} · ${ex.rest}</span>
                        </div>
                    `).join('')}
                    ${todayPlan.exercises.length > 5 ? `<p style="font-size:0.8rem;color:var(--text-muted);padding:4px 0;">+${todayPlan.exercises.length - 5} more exercises</p>` : ''}
                </div>
                <button class="btn btn-primary btn-sm" style="margin-top:14px;" onclick="Router.navigate('u-plan')">View Full Plan →</button>
            </div>` : ''}

            <div class="card">
                <h3 class="card-title">Trainer Feedback</h3>
                <div id="userFeedbackList"></div>
            </div>
        `;
        Gamification.renderXPBar('dashXPBar', u.xp || 0);
        this.renderFeedbackList();
    },

    renderFeedbackList() {
        const u = Auth.currentUser;
        const feedbacks = Store.getA('feedbacks').filter(f => f.memberId === u.id).slice(0, 5);
        const el = document.getElementById('userFeedbackList');
        if (!el) return;
        if (!feedbacks.length) { el.innerHTML = '<p class="empty-state sm">No feedback yet</p>'; return; }
        el.innerHTML = feedbacks.map(f => `
            <div class="notif-item" style="margin-bottom:8px;">
                <div class="notif-title">From Coach</div>
                <div>${f.message}</div>
                <div class="notif-time">${timeAgo(f.createdAt)}</div>
            </div>
        `).join('');
    },

    // ==================== WEEKLY PLAN ====================
    renderPlan() {
        const u = Auth.currentUser;
        const planData = Store.getA('workout_plans').find(p => p.userId === u.id);
        const s = document.getElementById('section-u-plan');

        if (!planData) {
            s.innerHTML = `<div class="section-header"><h1>My Workout Plan</h1></div><p class="empty-state">No plan generated yet. Contact admin or re-register.</p>`;
            return;
        }

        const plan = planData.plan;
        const todayName = dayName(todayDayIndex());

        s.innerHTML = `
            <div class="section-header">
                <h1>My Workout Plan</h1>
                <p class="section-subtitle">AI-generated based on your goals and metrics${planData.adjustmentNote ? ` · <span style="color:var(--accent)">Adjusted: ${planData.adjustmentNote}</span>` : ''}</p>
            </div>
            <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;">
                <button class="btn btn-primary btn-sm" id="regeneratePlanBtn">🤖 Regenerate Plan</button>
                <button class="btn btn-ghost btn-sm" id="adjustPlanBtn">⚡ AI Weekly Adjust</button>
            </div>
            <div class="week-grid">
                ${plan.map(day => {
            if (day.rest) return `<div class="day-card rest-day"><div><div class="rest-icon">😴</div><div class="day-label">${day.day}</div><p style="color:var(--text-muted);font-size:0.84rem;">Rest Day</p></div></div>`;
            const isToday = day.day === todayName;
            return `<div class="day-card ${isToday ? 'today' : ''}">
                        <div class="day-card-header">
                            <div><div class="day-label">${day.day} ${isToday ? '<span style="color:var(--accent);font-size:0.76rem;">· TODAY</span>' : ''}</div><div class="day-muscle">${day.label}</div></div>
                        </div>
                        <div class="exercise-list-items">
                            ${day.exercises.map((ex, ei) => `
                                <div class="exercise-item">
                                    <div class="exercise-check ${ex.completed ? 'done' : ''}" data-day="${day.day}" data-ei="${ei}" onclick="UserModule.toggleExercise('${day.day}',${ei})"></div>
                                    <span class="exercise-name">${ex.name}</span>
                                    <span class="exercise-detail">${ex.sets}×${ex.reps} · ${ex.rest}</span>
                                </div>
                            `).join('')}
                        </div>
                        ${isToday ? `<button class="btn btn-primary btn-sm btn-full" style="margin-top:12px;" onclick="UserModule.completeWorkout('${day.day}')">✓ Complete Workout (+50 XP)</button>` : ''}
                    </div>`;
        }).join('')}
            </div>
        `;

        document.getElementById('regeneratePlanBtn').addEventListener('click', () => {
            const newPlan = AIEngine.generateWorkoutPlan(u);
            const plans = Store.getA('workout_plans');
            const idx = plans.findIndex(p => p.userId === u.id);
            if (idx > -1) { plans[idx].plan = newPlan; plans[idx].generatedAt = new Date().toISOString(); plans[idx].adjustmentNote = null; }
            Store.set('workout_plans', plans);
            showToast('New AI plan generated! 🤖');
            this.renderPlan();
        });

        document.getElementById('adjustPlanBtn').addEventListener('click', () => {
            const note = AIEngine.adjustPlan(u.id);
            if (note) { showToast(`Plan adjusted: ${note}`); this.renderPlan(); }
            else showToast('Not enough progress data to adjust yet', 'info');
        });
    },

    toggleExercise(dayName, exerciseIndex) {
        const u = Auth.currentUser;
        const plans = Store.getA('workout_plans');
        const planData = plans.find(p => p.userId === u.id);
        if (!planData) return;
        const day = planData.plan.find(d => d.day === dayName);
        if (!day || !day.exercises[exerciseIndex]) return;
        day.exercises[exerciseIndex].completed = !day.exercises[exerciseIndex].completed;
        Store.set('workout_plans', plans);
        this.renderPlan();
    },

    completeWorkout(dayName) {
        const u = Auth.currentUser;
        Gamification.addXP(u.id, 50, 'Workout completed');
        Notifs.push('Workout Complete! 💪', `Great job finishing your ${dayName} workout! +50 XP`);
        showToast('+50 XP! Workout complete! 💪');
        this.renderPlan();
    },

    // ==================== NUTRITION ====================
    renderNutrition() {
        const u = Auth.currentUser;
        const target = Store.getA('nutrition_targets').find(t => t.userId === u.id);
        const todayMeals = Store.getA('meals').filter(m => m.userId === u.id && m.date === todayStr());

        const totalCals = todayMeals.reduce((s, m) => s + (m.calories || 0), 0);
        const totalProtein = todayMeals.reduce((s, m) => s + (m.protein || 0), 0);
        const totalCarbs = todayMeals.reduce((s, m) => s + (m.carbs || 0), 0);
        const totalFats = todayMeals.reduce((s, m) => s + (m.fats || 0), 0);

        const calTarget = target?.target || 2200;
        const calPct = Math.min(Math.round((totalCals / calTarget) * 100), 150);
        const calClass = calPct > 100 ? 'over' : calPct > 85 ? 'warn' : 'ok';

        const s = document.getElementById('section-u-nutrition');
        s.innerHTML = `
            <div class="section-header"><h1>Nutrition</h1><p class="section-subtitle">AI-calculated targets based on your body and goals</p></div>

            <div class="card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <h3 class="card-title" style="margin:0;">Calorie Budget</h3>
                    <span style="font-size:0.85rem;font-weight:700;">${totalCals} / ${calTarget} kcal</span>
                </div>
                <div class="calorie-progress"><div class="calorie-fill ${calClass}" style="width:${Math.min(calPct, 100)}%"></div></div>
                <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:0.76rem;color:var(--text-muted);">
                    <span>TDEE: ${target?.tdee || '—'} kcal</span>
                    <span>BMR: ${target?.bmr || '—'} kcal</span>
                    <span>Goal: ${(target?.goal || '').replace('_', ' ')}</span>
                </div>
            </div>

            <div class="macro-ring-grid">
                <div class="macro-card">
                    <div class="macro-value" style="color:var(--orange-400);">${totalProtein.toFixed(0)}g</div>
                    <div class="macro-label">Protein</div>
                    <div class="macro-sub">Target: ${target?.protein || 0}g</div>
                    <div class="calorie-progress" style="margin-top:8px;height:6px;"><div class="calorie-fill ok" style="width:${Math.min(100, Math.round((totalProtein / (target?.protein || 1)) * 100))}%"></div></div>
                </div>
                <div class="macro-card">
                    <div class="macro-value" style="color:var(--blue);">${totalCarbs.toFixed(0)}g</div>
                    <div class="macro-label">Carbs</div>
                    <div class="macro-sub">Target: ${target?.carbs || 0}g</div>
                    <div class="calorie-progress" style="margin-top:8px;height:6px;"><div class="calorie-fill ok" style="width:${Math.min(100, Math.round((totalCarbs / (target?.carbs || 1)) * 100))}%;background:linear-gradient(90deg,var(--blue),#60a5fa);"></div></div>
                </div>
                <div class="macro-card">
                    <div class="macro-value" style="color:var(--yellow);">${totalFats.toFixed(0)}g</div>
                    <div class="macro-label">Fats</div>
                    <div class="macro-sub">Target: ${target?.fats || 0}g</div>
                    <div class="calorie-progress" style="margin-top:8px;height:6px;"><div class="calorie-fill ok" style="width:${Math.min(100, Math.round((totalFats / (target?.fats || 1)) * 100))}%;background:linear-gradient(90deg,var(--yellow),#fbbf24);"></div></div>
                </div>
                <div class="macro-card">
                    <div class="macro-value" style="color:var(--green);">${calTarget - totalCals > 0 ? calTarget - totalCals : 0}</div>
                    <div class="macro-label">Remaining</div>
                    <div class="macro-sub">Calories left</div>
                </div>
            </div>

            <div class="card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                    <h3 class="card-title" style="margin:0;">Today's Meals</h3>
                    <button class="btn btn-primary btn-sm" id="logMealBtn">+ Log Meal</button>
                </div>
                <div class="meal-list" id="mealList">
                    ${todayMeals.length === 0 ? '<p class="empty-state sm">No meals logged today</p>' : todayMeals.map(m => `
                        <div class="meal-item">
                            <span class="meal-name">${m.name}</span>
                            <span><span class="meal-cals">${m.calories} kcal</span> · P:${m.protein || 0}g · C:${m.carbs || 0}g · F:${m.fats || 0}g</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.getElementById('logMealBtn').addEventListener('click', () => {
            document.getElementById('mealForm').reset();
            openModal('mealModal');
        });

        // Meal form handler - detach old, attach new
        const mealForm = document.getElementById('mealForm');
        const newForm = mealForm.cloneNode(true);
        mealForm.parentNode.replaceChild(newForm, mealForm);
        newForm.querySelector('[data-close]')?.addEventListener('click', () => closeModal('mealModal'));
        newForm.addEventListener('submit', e => {
            e.preventDefault();
            const meals = Store.getA('meals');
            meals.push({
                userId: u.id,
                name: document.getElementById('mealName').value.trim(),
                calories: parseInt(document.getElementById('mealCals').value) || 0,
                protein: parseFloat(document.getElementById('mealProtein').value) || 0,
                carbs: parseFloat(document.getElementById('mealCarbs').value) || 0,
                fats: parseFloat(document.getElementById('mealFats').value) || 0,
                date: todayStr(),
                createdAt: new Date().toISOString()
            });
            Store.set('meals', meals);
            closeModal('mealModal');
            showToast('Meal logged! +10 XP');
            Gamification.addXP(u.id, 10, 'Meal logged');
            this.renderNutrition();
        });
    },

    // ==================== PROGRESS ====================
    renderProgress() {
        const u = Auth.currentUser;
        const entries = Store.getA('progress_entries').filter(e => e.userId === u.id).sort((a, b) => new Date(a.date) - new Date(b.date));
        const latest = entries.length > 0 ? entries[entries.length - 1] : null;
        const heightM = u.height ? u.height / 100 : 1.75;
        const bmi = latest ? (latest.weight / (heightM * heightM)).toFixed(1) : '—';

        const s = document.getElementById('section-u-progress');
        s.innerHTML = `
            <div class="section-header"><h1>Progress Tracking</h1><p class="section-subtitle">Track your body metrics over time</p></div>
            <div style="margin-bottom:20px;"><button class="btn btn-primary btn-sm" id="logProgressBtn">+ Log Progress</button></div>

            <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));">
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value">${latest ? latest.weight + ' kg' : '—'}</span><span class="kpi-label">Current Weight</span></div></div>
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value">${bmi}</span><span class="kpi-label">BMI</span></div></div>
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value">${latest?.bodyFat ? latest.bodyFat + '%' : '—'}</span><span class="kpi-label">Body Fat</span></div></div>
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value">${entries.length}</span><span class="kpi-label">Entries</span></div></div>
            </div>

            <div class="charts-grid">
                <div class="chart-card"><h3 class="chart-title">Weight Trend</h3><canvas id="userWeightChart"></canvas></div>
                <div class="chart-card"><h3 class="chart-title">BMI Trend</h3><canvas id="userBmiChart"></canvas></div>
            </div>
        `;

        document.getElementById('logProgressBtn').addEventListener('click', () => {
            document.getElementById('progressLogForm').reset();
            openModal('progressLogModal');
        });

        // Progress form
        const pForm = document.getElementById('progressLogForm');
        const newPForm = pForm.cloneNode(true);
        pForm.parentNode.replaceChild(newPForm, pForm);
        newPForm.querySelector('[data-close]')?.addEventListener('click', () => closeModal('progressLogModal'));
        newPForm.addEventListener('submit', e => {
            e.preventDefault();
            const entries = Store.getA('progress_entries');
            entries.push({ userId: u.id, date: todayStr(), weight: parseFloat(document.getElementById('pWeight').value), bodyFat: parseFloat(document.getElementById('pBodyFat').value) || null, note: document.getElementById('pNote').value, createdAt: new Date().toISOString() });
            Store.set('progress_entries', entries);
            closeModal('progressLogModal');
            showToast('Progress logged! +15 XP');
            Gamification.addXP(u.id, 15, 'Progress logged');
            this.renderProgress();
        });

        // Charts
        if (entries.length > 1) {
            const labels = entries.map(e => formatDate(e.date));
            const weights = entries.map(e => e.weight);
            const bmis = entries.map(e => parseFloat((e.weight / (heightM * heightM)).toFixed(1)));
            const chartOpts = { responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#64647a', font: { family: 'Outfit' }, maxTicksLimit: 8 }, grid: { color: '#1f1f26' } }, y: { ticks: { color: '#64647a', font: { family: 'Outfit' } }, grid: { color: '#1f1f26' } } } };

            if (this.progressChart) this.progressChart.destroy();
            this.progressChart = new Chart(document.getElementById('userWeightChart'), { type: 'line', data: { labels, datasets: [{ data: weights, borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#f97316', pointRadius: 4, borderWidth: 2 }] }, options: chartOpts });

            if (this.bmiChart) this.bmiChart.destroy();
            this.bmiChart = new Chart(document.getElementById('userBmiChart'), { type: 'line', data: { labels, datasets: [{ data: bmis, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#3b82f6', pointRadius: 4, borderWidth: 2 }] }, options: chartOpts });
        }
    },

    // ==================== QR CHECK-IN ====================
    renderCheckIn() {
        const u = Auth.currentUser;
        const todayChecked = Store.getA('attendance').some(a => a.userId === u.id && a.date === todayStr());

        const s = document.getElementById('section-u-checkin');
        s.innerHTML = `
            <div class="section-header"><h1>QR Check-In</h1><p class="section-subtitle">Show this code at the front desk or scan to check in</p></div>
            <div class="checkin-area">
                <div class="qr-frame"><div id="userQR"></div><div class="qr-label">${u.name} · ${u.id}</div></div>
                ${todayChecked ? '<div class="checkin-status success">✅ Already checked in today!</div>' : `<button class="btn btn-primary" id="selfCheckinBtn" style="min-width:200px;">Check In Now</button>`}
                <div id="checkinMsg"></div>
            </div>
        `;

        try {
            new QRCode(document.getElementById('userQR'), { text: u.id, width: 200, height: 200, colorDark: '#09090b', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H });
        } catch (e) {
            document.getElementById('userQR').innerHTML = `<div style="padding:30px;font-size:1.4rem;font-weight:800;color:#09090b;">${u.id}</div>`;
        }

        if (!todayChecked) {
            document.getElementById('selfCheckinBtn')?.addEventListener('click', () => this.doCheckIn());
        }
    },

    doCheckIn() {
        const u = Auth.currentUser;
        const attendance = Store.getA('attendance');
        attendance.unshift({ userId: u.id, userName: u.name, date: todayStr(), time: new Date().toISOString(), method: 'QR Scan' });
        Store.set('attendance', attendance);

        // Streak
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const hadYesterday = attendance.some(a => a.userId === u.id && a.date === yesterday);
        const newStreak = hadYesterday ? (u.streak || 0) + 1 : 1;
        Auth.updateUser(u.id, { streak: newStreak, lastCheckIn: todayStr() });

        Gamification.addXP(u.id, 20, 'Check-in');
        if (newStreak > 1 && newStreak % 7 === 0) {
            Gamification.addXP(u.id, 30, 'Streak bonus');
            Notifs.push('🔥 Streak Bonus!', `${newStreak} day streak! +30 bonus XP!`);
        }

        showToast(`Checked in! +20 XP · Streak: ${newStreak} 🔥`);
        Notifs.push('Check-In ✅', `Welcome! You're on a ${newStreak}-day streak!`);
        this.renderCheckIn();
    },

    // ==================== SUBSCRIPTION ====================
    renderSubscription() {
        const u = Auth.currentUser;
        const sub = u.subscription || { plan: 'basic', status: 'active' };
        const plans = Store.getA('sub_plans');
        const payments = Store.getA('payments').filter(p => p.userId === u.id).slice(0, 10);

        const s = document.getElementById('section-u-subscription');
        s.innerHTML = `
            <div class="section-header"><h1>Subscription</h1><p class="section-subtitle">Manage your membership plan</p></div>
            <div class="card" style="margin-bottom:24px;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
                    <div>
                        <h3 style="font-size:1.1rem;font-weight:700;text-transform:capitalize;">${sub.plan} Plan</h3>
                        <p style="font-size:0.85rem;color:var(--text-muted);">Status: <span class="badge badge-${sub.status === 'active' ? 'active' : sub.status === 'expiring' ? 'expiring' : 'expired'}">${sub.status}</span></p>
                        <p style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;">Expires: ${formatDate(sub.expiresAt)}</p>
                    </div>
                </div>
            </div>
            <h3 style="font-size:1rem;font-weight:700;margin-bottom:16px;">Available Plans</h3>
            <div class="pricing-grid">
                ${plans.map(p => `
                    <div class="pricing-card ${p.name.toLowerCase() === 'pro' ? 'popular' : ''}">
                        <div class="pricing-name">${p.name}</div>
                        <div class="pricing-price">$${p.price}<span>/mo</span></div>
                        <ul class="pricing-features">${(p.features || []).map(f => `<li>${f}</li>`).join('')}</ul>
                        <button class="btn ${sub.plan === p.name.toLowerCase() ? 'btn-ghost' : 'btn-primary'} btn-full" ${sub.plan === p.name.toLowerCase() ? 'disabled' : ''}>${sub.plan === p.name.toLowerCase() ? 'Current Plan' : 'Upgrade'}</button>
                    </div>
                `).join('')}
            </div>
            <h3 style="font-size:1rem;font-weight:700;margin:24px 0 16px;">Payment History</h3>
            <div class="card table-card">
                <div class="table-responsive">
                    <table class="data-table"><thead><tr><th>Date</th><th>Amount</th><th>Plan</th><th>Method</th></tr></thead>
                    <tbody>${payments.map(p => `<tr><td>${formatDate(p.date)}</td><td style="color:var(--green);font-weight:600;">$${p.amount}</td><td style="text-transform:capitalize;">${p.plan || '—'}</td><td style="text-transform:capitalize;">${p.method}</td></tr>`).join('')}</tbody></table>
                </div>
                ${payments.length === 0 ? '<p class="empty-state sm">No payment history</p>' : ''}
            </div>
        `;
    },
};
