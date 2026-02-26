/* ============================================
   GymForge PRO — Predictive Churn Analysis
   Scoring Engine, Risk Dashboard, Trend Chart,
   Retention Actions
   ============================================ */

const ChurnEngine = {
    churnChart: null,

    // Weighted scoring: attendance (0-30), inactivity (0-30), subscription (0-40) → total 0-100%
    calculateChurnScore(member) {
        const attendance = Store.getA('attendance');
        const now = Date.now();
        let attendanceScore = 0;
        let inactivityScore = 0;
        let subscriptionScore = 0;
        const tags = [];

        // --- Attendance Frequency (0-30 pts) ---
        const last14 = attendance.filter(a => a.userId === member.id && new Date(a.date) >= new Date(now - 14 * 86400000)).length;
        const last30 = attendance.filter(a => a.userId === member.id && new Date(a.date) >= new Date(now - 30 * 86400000)).length;

        if (last14 === 0 && last30 === 0) {
            attendanceScore = 30;
            tags.push({ text: I18n.t('churn.noVisits30d'), color: 'var(--red-bg)', textColor: 'var(--red)' });
        } else if (last14 === 0) {
            attendanceScore = 24;
            tags.push({ text: I18n.t('churn.inactive14d'), color: 'var(--red-bg)', textColor: 'var(--red)' });
        } else if (last14 < 2) {
            attendanceScore = 18;
            tags.push({ text: I18n.t('churn.veryLowActivity'), color: 'var(--yellow-bg)', textColor: 'var(--yellow)' });
        } else if (last14 < 4) {
            attendanceScore = 10;
            tags.push({ text: I18n.t('churn.belowAvgActivity'), color: 'var(--yellow-bg)', textColor: 'var(--yellow)' });
        }

        // --- App Inactivity (0-30 pts) ---
        const lastWorkout = member.lastWorkout ? new Date(member.lastWorkout).getTime() : 0;
        const lastLogin = member.lastLogin ? new Date(member.lastLogin).getTime() : member.createdAt ? new Date(member.createdAt).getTime() : now - 60 * 86400000;
        const daysSinceActivity = Math.floor((now - Math.max(lastWorkout, lastLogin)) / 86400000);

        if (daysSinceActivity > 30) {
            inactivityScore = 30;
            tags.push({ text: I18n.t('churn.dormant30d'), color: 'var(--red-bg)', textColor: 'var(--red)' });
        } else if (daysSinceActivity > 14) {
            inactivityScore = 22;
            tags.push({ text: I18n.t('churn.inactive14d'), color: 'var(--red-bg)', textColor: 'var(--red)' });
        } else if (daysSinceActivity > 7) {
            inactivityScore = 12;
            tags.push({ text: I18n.t('churn.slowingDown'), color: 'var(--yellow-bg)', textColor: 'var(--yellow)' });
        }

        // --- Subscription Expiry (0-40 pts) ---
        if (member.subscription?.expiresAt) {
            const expiryDate = new Date(member.subscription.expiresAt);
            const daysUntilExpiry = Math.floor((expiryDate.getTime() - now) / 86400000);

            if (daysUntilExpiry < 0) {
                subscriptionScore = 40;
                tags.push({ text: I18n.t('churn.expired'), color: 'var(--red-bg)', textColor: 'var(--red)' });
            } else if (daysUntilExpiry <= 3) {
                subscriptionScore = 32;
                tags.push({ text: I18n.t('churn.expiring3d'), color: 'var(--red-bg)', textColor: 'var(--red)' });
            } else if (daysUntilExpiry <= 7) {
                subscriptionScore = 22;
                tags.push({ text: I18n.t('churn.expiring7d'), color: 'var(--yellow-bg)', textColor: 'var(--yellow)' });
            } else if (daysUntilExpiry <= 14) {
                subscriptionScore = 10;
                tags.push({ text: I18n.t('churn.expiringSoon'), color: 'var(--yellow-bg)', textColor: 'var(--yellow)' });
            }
        } else {
            subscriptionScore = 15;
            tags.push({ text: I18n.t('churn.noSubscription'), color: 'var(--yellow-bg)', textColor: 'var(--yellow)' });
        }

        // Streak bonus reducer
        if (member.streak > 7) {
            attendanceScore = Math.max(0, attendanceScore - 5);
        }

        const total = Math.min(100, attendanceScore + inactivityScore + subscriptionScore);
        const riskLevel = total >= 60 ? 'critical' : total >= 40 ? 'high' : total >= 20 ? 'medium' : 'low';

        return { score: total, riskLevel, tags, attendanceScore, inactivityScore, subscriptionScore };
    },

    getRiskColor(score) {
        if (score >= 60) return 'var(--red)';
        if (score >= 40) return 'var(--orange-500)';
        if (score >= 20) return 'var(--yellow)';
        return 'var(--green)';
    },

    getRiskBg(score) {
        if (score >= 60) return 'var(--red-bg)';
        if (score >= 40) return 'rgba(249,115,22,0.1)';
        if (score >= 20) return 'var(--yellow-bg)';
        return 'var(--green-bg)';
    },

    getRiskLabel(score) {
        if (score >= 60) return I18n.t('churn.criticalRisk').split(' ')[0];
        if (score >= 40) return I18n.t('churn.highRisk').split(' ')[0];
        if (score >= 20) return I18n.t('churn.mediumRisk').split(' ')[0];
        return I18n.t('churn.lowRisk').split(' ')[0];
    },

    // Generate simulated weekly churn trend data
    getChurnTrend() {
        const members = Auth.getMembers();
        const weeks = [];
        for (let w = 7; w >= 0; w--) {
            const weekDate = new Date(Date.now() - w * 7 * 86400000);
            const label = `W${8 - w}`;
            // Simulate trend: small variation around current average
            let totalRisk = 0;
            members.forEach(m => {
                const churn = this.calculateChurnScore(m);
                // Add some pseudo-random weekly variation
                const variance = Math.sin(w * 1.7 + m.name.length) * 8;
                totalRisk += Math.max(0, Math.min(100, churn.score + variance));
            });
            const avgRisk = members.length > 0 ? Math.round(totalRisk / members.length) : 0;
            weeks.push({ label, avgRisk, date: weekDate });
        }
        return weeks;
    },

    sendRetentionOffer(memberId, memberName) {
        Notifs.push(
            I18n.t('churn.offerSentTitle'),
            I18n.t('churn.offerSentMsg', [memberName]),
            'success'
        );
        // Store the offer
        const offers = Store.getA('retention_offers');
        offers.push({
            id: Store.genId('OFFER'),
            memberId,
            memberName,
            sentAt: new Date().toISOString(),
            discount: 20,
            status: 'sent'
        });
        Store.set('retention_offers', offers);
        showToast(I18n.t('churn.offerSentSuccess', [memberName]), 'success');
    },

    // ==================== RENDER ====================
    renderChurnDashboard() {
        const members = Auth.getMembers();
        const risks = members.map(m => ({
            ...m,
            churn: this.calculateChurnScore(m)
        })).sort((a, b) => b.churn.score - a.churn.score);

        const critical = risks.filter(r => r.churn.score >= 60).length;
        const high = risks.filter(r => r.churn.score >= 40 && r.churn.score < 60).length;
        const medium = risks.filter(r => r.churn.score >= 20 && r.churn.score < 40).length;
        const low = risks.filter(r => r.churn.score < 20).length;
        const avgChurn = members.length > 0 ? Math.round(risks.reduce((s, r) => s + r.churn.score, 0) / members.length) : 0;

        const colors = ['#ef4444', '#f97316', '#eab308', '#a855f7', '#3b82f6', '#06b6d4', '#22c55e', '#ec4899'];
        const atRisk = risks.filter(r => r.churn.score >= 20);

        const s = document.getElementById('section-a-churn');
        s.innerHTML = `
            <div class="section-header">
                <h1>${I18n.t('churn.title')}</h1>
                <p class="section-subtitle">${I18n.t('churn.subtitle')}</p>
            </div>

            <!-- KPI Row -->
            <div class="kpi-grid churn-kpi" style="margin-bottom:24px;">
                <div class="kpi-card">
                    <div class="kpi-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                    <div class="kpi-data"><span class="kpi-value">${critical}</span><span class="kpi-label">${I18n.t('churn.criticalRisk')}</span></div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
                    <div class="kpi-data"><span class="kpi-value">${high}</span><span class="kpi-label">${I18n.t('churn.highRisk')}</span></div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon yellow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg></div>
                    <div class="kpi-data"><span class="kpi-value">${medium}</span><span class="kpi-label">${I18n.t('churn.mediumRisk')}</span></div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                    <div class="kpi-data"><span class="kpi-value">${low}</span><span class="kpi-label">${I18n.t('churn.lowRisk')}</span></div>
                </div>
            </div>

            <!-- Avg Churn Gauge + Trend Chart Row -->
            <div class="churn-charts-row">
                <div class="card churn-gauge-card">
                    <h3>${I18n.t('churn.avgChurnRisk')}</h3>
                    <div class="churn-gauge-wrap">
                        <div class="churn-gauge">
                            <svg viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="52" stroke="var(--border)" stroke-width="8" fill="none"/>
                                <circle cx="60" cy="60" r="52" stroke="${this.getRiskColor(avgChurn)}" stroke-width="8" fill="none"
                                    stroke-dasharray="${Math.round(326.7 * avgChurn / 100)} 326.7"
                                    stroke-linecap="round" transform="rotate(-90 60 60)"
                                    style="transition: stroke-dasharray 0.8s ease;"/>
                            </svg>
                            <div class="churn-gauge-value">
                                <span class="churn-pct" style="color:${this.getRiskColor(avgChurn)}">${avgChurn}%</span>
                                <span class="churn-pct-label">${I18n.t('churn.avgRisk')}</span>
                            </div>
                        </div>
                    </div>
                    <div class="churn-breakdown">
                        <div class="churn-br-item"><span class="churn-dot" style="background:var(--red)"></span>${I18n.t('churn.criticalRisk').split(' ')[0]}: ${critical}</div>
                        <div class="churn-br-item"><span class="churn-dot" style="background:var(--orange-500)"></span>${I18n.t('churn.highRisk').split(' ')[0]}: ${high}</div>
                        <div class="churn-br-item"><span class="churn-dot" style="background:var(--yellow)"></span>${I18n.t('churn.mediumRisk').split(' ')[0]}: ${medium}</div>
                        <div class="churn-br-item"><span class="churn-dot" style="background:var(--green)"></span>${I18n.t('churn.lowRisk').split(' ')[0]}: ${low}</div>
                    </div>
                </div>
                <div class="card churn-trend-card">
                    <h3>${I18n.t('churn.riskTrend')}</h3>
                    <canvas id="churnTrendChart" height="220"></canvas>
                </div>
            </div>

            <!-- At Risk Members List -->
            <div class="card" style="margin-top:24px;">
                <div class="card-header">
                    <h3>${I18n.t('churn.atRiskMembers')} <span class="churn-count-badge">${atRisk.length}</span></h3>
                </div>
                ${atRisk.length === 0 ? `<p class="empty-state">${I18n.t('admin.allGood')}</p>` :
                `<div class="churn-members-list">
                    ${atRisk.map((r, i) => `
                        <div class="churn-member-row">
                            <div class="churn-member-left">
                                <div class="churn-member-avatar" style="background:${colors[i % colors.length]}">${r.name.charAt(0)}</div>
                                <div class="churn-member-info">
                                    <div class="churn-member-name">${r.name}</div>
                                    <div class="churn-member-email">${r.email}</div>
                                    <div class="churn-tags">${r.churn.tags.map(t => `<span class="risk-tag" style="background:${t.color};color:${t.textColor}">${t.text}</span>`).join('')}</div>
                                </div>
                            </div>
                            <div class="churn-member-right">
                                <div class="churn-score-wrap">
                                    <div class="churn-score-bar-bg">
                                        <div class="churn-score-bar-fill" style="width:${r.churn.score}%;background:${this.getRiskColor(r.churn.score)}"></div>
                                    </div>
                                    <span class="churn-score-pct" style="color:${this.getRiskColor(r.churn.score)}">${r.churn.score}%</span>
                                </div>
                                <span class="badge churn-level-badge" style="background:${this.getRiskBg(r.churn.score)};color:${this.getRiskColor(r.churn.score)}">${this.getRiskLabel(r.churn.score)}</span>
                                <button class="btn btn-sm btn-retention" onclick="ChurnEngine.sendRetentionOffer('${r.id}','${r.name}')">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                    ${I18n.t('churn.sendOffer')}
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>`}
            </div>
        `;

        // Render churn trend chart
        this.renderChurnTrendChart();
    },

    renderChurnTrendChart() {
        const ctx = document.getElementById('churnTrendChart');
        if (!ctx) return;
        if (this.churnChart) this.churnChart.destroy();

        const trend = this.getChurnTrend();

        this.churnChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trend.map(t => t.label),
                datasets: [{
                    label: I18n.t('churn.avgChurnRiskLabel'),
                    data: trend.map(t => t.avgRisk),
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249,115,22,0.08)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointBackgroundColor: '#f97316',
                    pointBorderColor: '#111116',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1a1a22',
                        titleColor: '#f4f4f5',
                        bodyColor: '#a1a1aa',
                        borderColor: '#2a2a33',
                        borderWidth: 1,
                        cornerRadius: 10,
                        padding: 12,
                        callbacks: {
                            label: ctx => `${I18n.t('admin.riskScore') || 'Risk'}: ${ctx.raw}%`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        ticks: { color: '#64647a', font: { size: 11 }, callback: v => v + '%' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#64647a', font: { size: 11 } }
                    }
                }
            }
        });
    },

    // Summary card for admin dashboard
    getChurnSummaryHTML() {
        const members = Auth.getMembers();
        const atRisk = members.filter(m => this.calculateChurnScore(m).score >= 40).length;
        const avgChurn = members.length > 0 ? Math.round(members.reduce((s, m) => s + this.calculateChurnScore(m).score, 0) / members.length) : 0;
        return `
            <div class="kpi-card clickable" onclick="Router.navigate('a-churn')">
                <div class="kpi-icon" style="background:rgba(239,68,68,0.1);color:var(--red)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="11" x2="22" y2="11"/></svg>
                </div>
                <div class="kpi-data">
                    <span class="kpi-value">${atRisk}</span>
                    <span class="kpi-label">${I18n.t('churn.atRiskMembersLabel')}</span>
                </div>
            </div>
        `;
    }
};
