/* ============================================
   GymForge PRO — Health Sync
   Apple HealthKit / Google Fit Integration
   Steps, Calories, Heart Rate, Dashboard
   ============================================ */

const HealthSync = {
    stepsChart: null,
    caloriesChart: null,
    heartRateChart: null,
    syncInterval: null,

    // Simulated connection state
    isConnected() {
        if (!Auth.currentUser) return false;
        return Store.get(`health_connected_${Auth.currentUser.id}`) === 'true';
    },

    getProvider() {
        return Store.get(`health_provider_${Auth.currentUser?.id}`) || null;
    },

    connect(provider) {
        if (!Auth.currentUser) return;
        Store.set(`health_connected_${Auth.currentUser.id}`, 'true');
        Store.set(`health_provider_${Auth.currentUser.id}`, provider);
        // Generate initial data
        this.generateHealthData();
        this.startBackgroundSync();
        showToast(I18n.t('health.connectSuccess', [provider === 'apple' ? 'Apple Health' : 'Google Fit']), 'success');
        Notifs.push(I18n.t('health.connect'), I18n.t('health.syncSuccess', [provider === 'apple' ? 'Apple Health' : 'Google Fit']), 'success');
        this.renderHealthDashboard();
    },

    disconnect() {
        if (!Auth.currentUser) return;
        Store.set(`health_connected_${Auth.currentUser.id}`, 'false');
        Store.remove(`health_provider_${Auth.currentUser.id}`);
        this.stopBackgroundSync();
        showToast(I18n.t('health.disconnected'), 'info');
        this.renderHealthDashboard();
    },

    // Generate realistic health data for last 7 days
    generateHealthData() {
        if (!Auth.currentUser) return;
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 86400000);
            const isWorkoutDay = Math.random() > 0.35;
            data.push({
                date: date.toISOString().split('T')[0],
                steps: Math.round(3000 + Math.random() * 9000 + (isWorkoutDay ? 3000 : 0)),
                calories: Math.round(1800 + Math.random() * 800 + (isWorkoutDay ? 400 : 0)),
                heartRate: {
                    resting: Math.round(58 + Math.random() * 14),
                    avg: Math.round(72 + Math.random() * 18),
                    max: Math.round(120 + Math.random() * 55),
                },
                activeMinutes: Math.round(20 + Math.random() * 60 + (isWorkoutDay ? 30 : 0)),
                distance: Math.round((2 + Math.random() * 6) * 100) / 100,
            });
        }
        Store.set(`health_data_${Auth.currentUser.id}`, data);
    },

    getHealthData() {
        if (!Auth.currentUser) return [];
        return Store.getA(`health_data_${Auth.currentUser.id}`);
    },

    getTodayData() {
        const data = this.getHealthData();
        const today = new Date().toISOString().split('T')[0];
        return data.find(d => d.date === today) || data[data.length - 1] || null;
    },

    // Background sync simulation
    startBackgroundSync() {
        this.stopBackgroundSync();
        this.syncInterval = setInterval(() => {
            if (!this.isConnected()) return;
            const data = this.getHealthData();
            if (data.length === 0) return;
            // Update today's data slightly
            const today = data[data.length - 1];
            today.steps += Math.round(Math.random() * 200);
            today.calories += Math.round(Math.random() * 30);
            today.activeMinutes += Math.random() > 0.7 ? 1 : 0;
            Store.set(`health_data_${Auth.currentUser.id}`, data);
        }, 30000); // every 30 seconds
    },

    stopBackgroundSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    },

    // ==================== RENDER ====================
    renderHealthDashboard() {
        const s = document.getElementById('section-u-health');
        if (!s) return;

        if (!this.isConnected()) {
            s.innerHTML = `
                <div class="section-header"><h1>${I18n.t('health.title')}</h1><p class="section-subtitle">${I18n.t('health.subtitle')}</p></div>
                <div class="health-connect-container">
                    <div class="health-connect-card">
                        <div class="health-connect-icon">❤️</div>
                        <h2>${I18n.t('health.connect')}</h2>
                        <p>${I18n.t('health.connectDesc')}</p>
                        <div class="health-connect-btns">
                            <button class="health-provider-btn apple" onclick="HealthSync.connect('apple')">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                                Apple Health
                            </button>
                            <button class="health-provider-btn google" onclick="HealthSync.connect('google')">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                Google Fit
                            </button>
                        </div>
                        <p class="health-connect-note">${I18n.t('health.privateNote')}</p>
                    </div>
                </div>
            `;
            return;
        }

        const data = this.getHealthData();
        const today = this.getTodayData();
        const provider = this.getProvider();
        const weeklySteps = data.reduce((s, d) => s + d.steps, 0);
        const avgCalories = Math.round(data.reduce((s, d) => s + d.calories, 0) / data.length);
        const avgHR = Math.round(data.reduce((s, d) => s + d.heartRate.avg, 0) / data.length);
        const stepsGoal = 10000;
        const stepsPct = Math.min(100, Math.round((today?.steps || 0) / stepsGoal * 100));
        const calGoal = 2500;
        const calPct = Math.min(100, Math.round((today?.calories || 0) / calGoal * 100));

        s.innerHTML = `
            <div class="section-header">
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                    <div><h1>${I18n.t('health.title')}</h1><p class="section-subtitle">${I18n.t('health.syncedFrom', [provider === 'apple' ? 'Apple Health' : 'Google Fit'])}</p></div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <span class="health-connected-badge">● ${I18n.t('health.connectedBadge')}</span>
                        <button class="btn btn-ghost btn-sm" onclick="HealthSync.disconnect()">${I18n.t('health.disconnect')}</button>
                    </div>
                </div>
            </div>

            <!-- Today's Overview Cards -->
            <div class="health-cards-grid">
                <div class="health-card health-steps-card">
                    <div class="health-card-header">
                        <span class="health-card-title">${I18n.t('health.steps')}</span>
                        <span class="health-card-badge">${I18n.t('health.today')}</span>
                    </div>
                    <div class="health-card-body">
                        <div class="health-circular-progress" style="--progress:${stepsPct};--color:#22c55e">
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" stroke="var(--border)" stroke-width="6" fill="none"/>
                                <circle cx="50" cy="50" r="42" stroke="#22c55e" stroke-width="6" fill="none"
                                    stroke-dasharray="${Math.round(263.9 * stepsPct / 100)} 263.9"
                                    stroke-linecap="round" transform="rotate(-90 50 50)"/>
                            </svg>
                            <div class="health-cp-value">
                                <strong>${(today?.steps || 0).toLocaleString()}</strong>
                                <small>/ ${stepsGoal.toLocaleString()}</small>
                            </div>
                        </div>
                    </div>
                    <div class="health-card-footer">
                        <span>${I18n.t('health.weekly', [weeklySteps.toLocaleString()])}</span>
                        <span>${today?.distance || 0} ${I18n.t('trainer.km') || 'km'}</span>
                    </div>
                </div>

                <div class="health-card health-calories-card">
                    <div class="health-card-header">
                        <span class="health-card-title">${I18n.t('health.calories')}</span>
                        <span class="health-card-badge">${I18n.t('health.today')}</span>
                    </div>
                    <div class="health-card-body">
                        <div class="health-circular-progress" style="--progress:${calPct};--color:#f97316">
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" stroke="var(--border)" stroke-width="6" fill="none"/>
                                <circle cx="50" cy="50" r="42" stroke="#f97316" stroke-width="6" fill="none"
                                    stroke-dasharray="${Math.round(263.9 * calPct / 100)} 263.9"
                                    stroke-linecap="round" transform="rotate(-90 50 50)"/>
                            </svg>
                            <div class="health-cp-value">
                                <strong>${today?.calories || 0}</strong>
                                <small>kcal</small>
                            </div>
                        </div>
                    </div>
                    <div class="health-card-footer">
                        <span>${I18n.t('health.avgDay', [avgCalories])}</span>
                        <span>${I18n.t('health.activeMin', [today?.activeMinutes || 0])}</span>
                    </div>
                </div>

                <div class="health-card health-hr-card">
                    <div class="health-card-header">
                        <span class="health-card-title">${I18n.t('health.heartRate')}</span>
                        <span class="health-card-badge">${I18n.t('health.latest')}</span>
                    </div>
                    <div class="health-card-body health-hr-body">
                        <div class="health-hr-main">
                            <span class="health-hr-value">${today?.heartRate?.avg || '--'}</span>
                            <span class="health-hr-unit">BPM</span>
                        </div>
                        <div class="health-hr-stats">
                            <div class="health-hr-stat"><span class="health-hr-stat-label">${I18n.t('health.resting')}</span><span class="health-hr-stat-val">${today?.heartRate?.resting || '--'}</span></div>
                            <div class="health-hr-stat"><span class="health-hr-stat-label">${I18n.t('health.avg')}</span><span class="health-hr-stat-val">${today?.heartRate?.avg || '--'}</span></div>
                            <div class="health-hr-stat"><span class="health-hr-stat-label">${I18n.t('health.max')}</span><span class="health-hr-stat-val">${today?.heartRate?.max || '--'}</span></div>
                        </div>
                    </div>
                    <div class="health-card-footer">
                        <span>${I18n.t('health.avgBPM', [avgHR])}</span>
                        <span class="health-hr-zone">${avgHR < 70 ? `🟢 ${I18n.t('health.zoneExcel')}` : avgHR < 80 ? `🟡 ${I18n.t('health.zoneGood')}` : `🟠 ${I18n.t('health.zoneMod')}`}</span>
                    </div>
                </div>
            </div>

            <!-- 7-Day Charts -->
            <div class="health-charts-row">
                <div class="card"><h3>${I18n.t('health.stepsChart')}</h3><canvas id="healthStepsChart" height="180"></canvas></div>
                <div class="card"><h3>${I18n.t('health.calChart')}</h3><canvas id="healthCaloriesChart" height="180"></canvas></div>
            </div>
            <div class="health-charts-row" style="margin-top:16px;">
                <div class="card"><h3>${I18n.t('health.hrChart')}</h3><canvas id="healthHRChart" height="180"></canvas></div>
            </div>
        `;

        this.renderCharts(data);
    },

    renderCharts(data) {
        const chartOpts = (label, color) => ({
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1a1a22', titleColor: '#f4f4f5', bodyColor: '#a1a1aa', borderColor: '#2a2a33', borderWidth: 1, cornerRadius: 10, padding: 12 } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64647a', font: { size: 11 } } }, x: { grid: { display: false }, ticks: { color: '#64647a', font: { size: 11 } } } }
        });

        const daysKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const days = data.map(d => { const dt = new Date(d.date); return I18n.t('day.' + daysKeys[dt.getDay()]); });

        // Steps chart
        const stepsCtx = document.getElementById('healthStepsChart');
        if (stepsCtx) {
            if (this.stepsChart) this.stepsChart.destroy();
            this.stepsChart = new Chart(stepsCtx, {
                type: 'bar', data: { labels: days, datasets: [{ data: data.map(d => d.steps), backgroundColor: 'rgba(34,197,94,0.3)', borderColor: '#22c55e', borderWidth: 1.5, borderRadius: 6 }] }, options: chartOpts()
            });
        }

        // Calories chart
        const calCtx = document.getElementById('healthCaloriesChart');
        if (calCtx) {
            if (this.caloriesChart) this.caloriesChart.destroy();
            this.caloriesChart = new Chart(calCtx, {
                type: 'line', data: { labels: days, datasets: [{ data: data.map(d => d.calories), borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.08)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#f97316' }] }, options: chartOpts()
            });
        }

        // Heart Rate chart
        const hrCtx = document.getElementById('healthHRChart');
        if (hrCtx) {
            if (this.heartRateChart) this.heartRateChart.destroy();
            this.heartRateChart = new Chart(hrCtx, {
                type: 'line', data: {
                    labels: days, datasets: [
                        { label: I18n.t('health.resting'), data: data.map(d => d.heartRate.resting), borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.05)', fill: false, tension: 0.4, borderWidth: 2, pointRadius: 3 },
                        { label: I18n.t('health.avg'), data: data.map(d => d.heartRate.avg), borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.05)', fill: false, tension: 0.4, borderWidth: 2, pointRadius: 3 },
                        { label: I18n.t('health.max'), data: data.map(d => d.heartRate.max), borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.05)', fill: false, tension: 0.4, borderWidth: 2, pointRadius: 3 },
                    ]
                }, options: { ...chartOpts(), plugins: { ...chartOpts().plugins, legend: { display: true, labels: { color: '#a1a1aa', usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 11 } } } } }
            });
        }
    }
};
