/* ============================================
   GymForge PRO — Admin Module
   Dashboard, Revenue, Attendance, Members,
   Risk Detection, Plans & Pricing
   ============================================ */

const AdminModule = {
    revenueChart: null,
    attendanceChart: null,
    planDistChart: null,

    onNav(section) {
        if (!Auth.currentUser || Auth.currentUser.role !== 'admin') return;
        switch (section) {
            case 'a-dashboard': this.renderDashboard(); break;
            case 'a-revenue': this.renderRevenue(); break;
            case 'a-attendance': this.renderAttendance(); break;
            case 'a-members': this.renderMembers(); break;
            case 'a-requests': this.renderRequests(); break;
            case 'a-risk': this.renderRisk(); break;
            case 'a-plans': this.renderPlans(); break;
        }
    },

    // ==================== DASHBOARD ====================
    renderDashboard() {
        const members = Auth.getMembers();
        const payments = Store.getA('payments');
        const attendance = Store.getA('attendance');
        const active = members.filter(m => m.subscription?.status === 'active').length;
        const expiring = members.filter(m => m.subscription?.status === 'expiring' || (m.subscription?.expiresAt && new Date(m.subscription.expiresAt) < new Date(Date.now() + 7 * 86400000) && new Date(m.subscription.expiresAt) > new Date())).length;
        const totalRev = payments.reduce((s, p) => s + p.amount, 0);
        const thisMonthRev = payments.filter(p => p.date >= new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]).reduce((s, p) => s + p.amount, 0);
        const todayCheckins = attendance.filter(a => a.date === todayStr()).length;

        const churnRate = members.length > 0 ? Math.round((members.filter(m => m.subscription?.status === 'expired' || (m.subscription?.expiresAt && new Date(m.subscription.expiresAt) < new Date())).length / members.length) * 100) : 0;

        const s = document.getElementById('section-a-dashboard');
        s.innerHTML = `
            <div class="section-header"><h1>${I18n.t('admin.dashTitle')}</h1><p class="section-subtitle">${I18n.t('admin.dashSubtitle')}</p></div>
            <div class="kpi-grid">
                <div class="kpi-card"><div class="kpi-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div class="kpi-data"><span class="kpi-value">${members.length}</span><span class="kpi-label">${I18n.t('trainer.totalMembers')}</span></div></div>
                <div class="kpi-card"><div class="kpi-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div class="kpi-data"><span class="kpi-value">${active}</span><span class="kpi-label">${I18n.t('admin.active')}</span></div></div>
                <div class="kpi-card"><div class="kpi-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="kpi-data"><span class="kpi-value">${expiring}</span><span class="kpi-label">${I18n.t('admin.expiringSoon')}</span></div></div>
                <div class="kpi-card"><div class="kpi-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div class="kpi-data"><span class="kpi-value">$${totalRev.toLocaleString()}</span><span class="kpi-label">${I18n.t('admin.totalRevenue')}</span></div></div>
                <div class="kpi-card"><div class="kpi-icon cyan"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div class="kpi-data"><span class="kpi-value">$${thisMonthRev.toLocaleString()}</span><span class="kpi-label">${I18n.t('admin.mrr')}</span></div></div>
                <div class="kpi-card"><div class="kpi-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div class="kpi-data"><span class="kpi-value">${churnRate}%</span><span class="kpi-label">${I18n.t('admin.churnRate')}</span></div></div>
            </div>

            <div class="charts-grid">
                <div class="chart-card"><h3 class="chart-title">${I18n.t('admin.revenueLast6')}</h3><canvas id="adminRevChart"></canvas></div>
                <div class="chart-card"><h3 class="chart-title">${I18n.t('admin.attendanceLast7')}</h3><canvas id="adminAttChart"></canvas></div>
            </div>

            <div class="charts-grid">
                <div class="chart-card"><h3 class="chart-title">${I18n.t('admin.planDist')}</h3><canvas id="adminPlanDist"></canvas></div>
                <div class="card"><h3 class="card-title">${I18n.t('admin.subPredictions')}</h3>
                    <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px;">${I18n.t('admin.basedOnPatterns')}</p>
                    ${this.getPredictions(members, payments)}
                </div>
            </div>
        `;

        this.renderDashCharts(payments, attendance, members);
    },

    getPredictions(members, payments) {
        const activeCount = members.filter(m => m.subscription?.status === 'active').length;
        const avgPayment = payments.length > 0 ? payments.reduce((s, p) => s + p.amount, 0) / payments.length : 0;
        const recentRate = members.length > 0 ? Math.round((activeCount / members.length) * 100) : 0;
        const predictedRenewals = Math.round(activeCount * (recentRate / 100));
        const predictedRev = Math.round(predictedRenewals * avgPayment);

        return `
            <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));">
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value" style="font-size:1.2rem;">${predictedRenewals}</span><span class="kpi-label">${I18n.t('admin.estRenewals')}</span></div></div>
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value" style="font-size:1.2rem;">$${predictedRev}</span><span class="kpi-label">${I18n.t('admin.predictedRev')}</span></div></div>
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value" style="font-size:1.2rem;">${recentRate}%</span><span class="kpi-label">${I18n.t('admin.retentionRate')}</span></div></div>
            </div>
        `;
    },

    renderDashCharts(payments, attendance, members) {
        // Revenue chart
        const months = [], amounts = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(); d.setMonth(d.getMonth() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            months.push(d.toLocaleDateString('en-US', { month: 'short' }));
            amounts.push(payments.filter(p => p.date?.startsWith(key)).reduce((s, p) => s + p.amount, 0));
        }
        const chartOpts = { responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#64647a', font: { family: 'Outfit' } }, grid: { display: false } }, y: { ticks: { color: '#64647a', font: { family: 'Outfit' }, callback: v => `$${v}` }, grid: { color: '#1f1f26' }, beginAtZero: true } } };

        if (this.revenueChart) this.revenueChart.destroy();
        this.revenueChart = new Chart(document.getElementById('adminRevChart'), {
            type: 'line', data: { labels: months, datasets: [{ data: amounts, borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#a855f7', pointRadius: 4, borderWidth: 2 }] }, options: chartOpts
        });

        // Attendance chart
        const days = [], counts = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate() - i);
            days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
            counts.push(attendance.filter(a => a.date === d.toISOString().split('T')[0]).length);
        }
        if (this.attendanceChart) this.attendanceChart.destroy();
        this.attendanceChart = new Chart(document.getElementById('adminAttChart'), {
            type: 'bar', data: { labels: days, datasets: [{ data: counts, backgroundColor: 'rgba(249,115,22,0.5)', borderColor: '#f97316', borderWidth: 1, borderRadius: 6 }] },
            options: { ...chartOpts, scales: { ...chartOpts.scales, y: { ...chartOpts.scales.y, ticks: { ...chartOpts.scales.y.ticks, callback: v => v, stepSize: 1 } } } }
        });

        // Plan distribution
        const planCounts = { basic: 0, pro: 0, elite: 0 };
        members.forEach(m => { if (m.subscription?.plan) planCounts[m.subscription.plan] = (planCounts[m.subscription.plan] || 0) + 1; });
        if (this.planDistChart) this.planDistChart.destroy();
        this.planDistChart = new Chart(document.getElementById('adminPlanDist'), {
            type: 'doughnut', data: { labels: [I18n.t('admin.basic'), I18n.t('admin.pro'), I18n.t('admin.elite')], datasets: [{ data: [planCounts.basic, planCounts.pro, planCounts.elite], backgroundColor: ['#3b82f6', '#f97316', '#a855f7'], borderWidth: 0 }] },
            options: { responsive: true, plugins: { legend: { display: true, position: 'bottom', labels: { color: '#a1a1aa', font: { family: 'Outfit' }, padding: 16 } } } }
        });
    },

    // ==================== REVENUE ====================
    renderRevenue() {
        const payments = Store.getA('payments');
        const s = document.getElementById('section-a-revenue');
        s.innerHTML = `
            <div class="section-header"><h1>${I18n.t('admin.revAnalytics')}</h1><p class="section-subtitle">${I18n.t('admin.revSubtitle')}</p></div>
            <div class="card table-card">
                <div class="table-responsive">
                    <table class="data-table"><thead><tr><th>${I18n.t('admin.member')}</th><th>${I18n.t('admin.amount')}</th><th>${I18n.t('admin.plan')}</th><th>${I18n.t('admin.method')}</th><th>${I18n.t('admin.date')}</th></tr></thead>
                    <tbody>${payments.sort((a, b) => new Date(b.date) - new Date(a.date)).map(p => `<tr><td><strong>${p.userName}</strong></td><td style="color:var(--green);font-weight:600;">$${p.amount}</td><td style="text-transform:capitalize;">${I18n.t('admin.' + p.plan) || p.plan || '—'}</td><td style="text-transform:capitalize;">${I18n.t('sub.' + p.method) || p.method}</td><td>${formatDate(p.date)}</td></tr>`).join('')}</tbody></table>
                </div>
                ${payments.length === 0 ? `<p class="empty-state sm">${I18n.t('admin.noPayments')}</p>` : ''}
            </div>
        `;
    },

    // ==================== ATTENDANCE ====================
    renderAttendance() {
        const attendance = Store.getA('attendance').sort((a, b) => new Date(b.time) - new Date(a.time));
        const s = document.getElementById('section-a-attendance');
        s.innerHTML = `
            <div class="section-header"><h1>${I18n.t('admin.attAnalytics')}</h1><p class="section-subtitle">${I18n.t('admin.attSubtitle')}</p></div>
            <div class="kpi-grid" style="margin-bottom:24px;">
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value">${attendance.filter(a => a.date === todayStr()).length}</span><span class="kpi-label">${I18n.t('admin.today')}</span></div></div>
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value">${attendance.filter(a => new Date(a.date) >= new Date(Date.now() - 7 * 86400000)).length}</span><span class="kpi-label">${I18n.t('admin.thisWeek')}</span></div></div>
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value">${attendance.length}</span><span class="kpi-label">${I18n.t('admin.allTime')}</span></div></div>
            </div>
            <div class="card table-card">
                <div class="table-responsive">
                    <table class="data-table"><thead><tr><th>${I18n.t('admin.member')}</th><th>${I18n.t('admin.date')}</th><th>${I18n.t('admin.time')}</th><th>${I18n.t('admin.method')}</th></tr></thead>
                    <tbody>${attendance.slice(0, 50).map(a => `<tr><td><strong>${a.userName}</strong></td><td>${formatDate(a.date)}</td><td>${formatTime(a.time)}</td><td>${a.method}</td></tr>`).join('')}</tbody></table>
                </div>
            </div>
        `;
    },

    // ==================== MEMBERS ====================
    renderMembers() {
        const s = document.getElementById('section-a-members');
        s.innerHTML = `
            <div class="section-header"><h1>${I18n.t('admin.allMembers')}</h1><p class="section-subtitle">${I18n.t('admin.manageGym')}</p></div>
            <div class="card table-card" id="adminMembersTable">
                <p class="empty-state sm">Loading members...</p>
            </div>
        `;

        ApiClient.checkBackend().then(available => {
            if (available) {
                ApiClient.getAdminUsers({ role: 'member' })
                    .then(res => {
                        this.renderMembersList(res.users);
                    })
                    .catch(err => {
                        showToast('Failed to load members from server', 'error');
                        this.renderMembersList(Auth.getMembers());
                    });
            } else {
                this.renderMembersList(Auth.getMembers());
            }
        });
    },

    renderMembersList(members) {
        const container = document.getElementById('adminMembersTable');
        if (!container) return;

        if (members.length === 0) {
            container.innerHTML = `<p class="empty-state sm">${I18n.t('general.noMembers') || 'No members found'}</p>`;
            return;
        }

        container.innerHTML = `
            <div class="table-responsive">
                <table class="data-table"><thead><tr><th>${I18n.t('admin.name')}</th><th>${I18n.t('admin.email')}</th><th>${I18n.t('admin.plan')}</th><th>${I18n.t('admin.status')}</th><th>${I18n.t('admin.xp')}</th><th>${I18n.t('admin.streak')}</th><th>${I18n.t('admin.joined')}</th><th>${I18n.t('admin.actions') || 'Actions'}</th></tr></thead>
                <tbody>${members.map(m => {
            const tier = Gamification.getTier(m.xp || 0);
            const status = m.subscription?.expiresAt && new Date(m.subscription.expiresAt) < new Date() ? 'expired' : m.subscription?.expiresAt && new Date(m.subscription.expiresAt) < new Date(Date.now() + 7 * 86400000) ? 'expiring' : 'active';
            const plan = m.subscription?.plan || m.plan || '—';
            return `<tr>
                <td><strong>${m.name}</strong></td>
                <td>${m.email}</td>
                <td style="text-transform:capitalize;">${I18n.t('admin.' + plan.toLowerCase()) || plan}</td>
                <td><span class="badge badge-${status}">${I18n.t('admin.' + status)}</span></td>
                <td><span class="level-badge level-${tier.css}" style="font-size:0.65rem;padding:1px 6px;">${tier.emoji} ${m.xp || 0}</span></td>
                <td>🔥 ${m.streak || 0}</td>
                <td>${formatDate(m.createdAt || m.created_at)}</td>
                <td>
                    ${m.role !== 'admin' ? `<button class="btn btn-ghost btn-xs" onclick="AdminModule.promoteMember('${m.id}')" title="${I18n.t('auth.makeAdmin')}">👑</button>` : ''}
                </td>
            </tr>`;
        }).join('')}</tbody></table>
            </div>
        `;
    },

    // ==================== REQUESTS ====================
    renderRequests() {
        const s = document.getElementById('section-a-requests');
        s.innerHTML = `
            <div class="section-header"><h1>${I18n.t('auth.requests')}</h1><p class="section-subtitle">Manage pending trainer and admin join requests</p></div>
            <div class="card table-card" id="adminRequestsTable">
                <p class="empty-state sm">Loading requests...</p>
            </div>
        `;

        ApiClient.checkBackend().then(available => {
            if (available) {
                ApiClient.getAdminUsers({ approved: 'false' })
                    .then(res => {
                        this.renderRequestsList(res.users);
                    })
                    .catch(err => {
                        showToast('Failed to load requests', 'error');
                        document.getElementById('adminRequestsTable').innerHTML = '<p class="empty-state sm">Error loading requests</p>';
                    });
            } else {
                document.getElementById('adminRequestsTable').innerHTML = '<p class="empty-state sm">Requests are only available in connected mode</p>';
            }
        });
    },

    renderRequestsList(users) {
        const container = document.getElementById('adminRequestsTable');
        if (!container) return;

        if (users.length === 0) {
            container.innerHTML = `<p class="empty-state sm">No pending requests</p>`;
            return;
        }

        container.innerHTML = `
            <div class="table-responsive">
                <table class="data-table"><thead><tr><th>${I18n.t('admin.name')}</th><th>${I18n.t('admin.email')}</th><th>${I18n.t('admin.role')}</th><th>${I18n.t('admin.joined')}</th><th>${I18n.t('admin.actions') || 'Actions'}</th></tr></thead>
                <tbody>${users.map(u => `
                    <tr>
                        <td><strong>${u.name}</strong> ${u.is_active ? '✅' : '⏳'}</td>
                        <td>${u.email}</td>
                        <td style="text-transform:capitalize;">${I18n.t('auth.' + u.role) || u.role}</td>
                        <td>${formatDate(u.created_at)}</td>
                        <td>
                            <div style="display:flex;gap:4px;">
                                <button class="btn btn-primary btn-xs" onclick="AdminModule.handleApproval('${u.id}', true)">${I18n.t('auth.approve')}</button>
                                <button class="btn btn-ghost btn-xs" style="color:var(--red);" onclick="AdminModule.handleApproval('${u.id}', false)">${I18n.t('auth.reject')}</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}</tbody></table>
            </div>
        `;
    },

    handleApproval(id, approve) {
        if (!confirm(approve ? 'Approve this user?' : 'Reject and delete this user?')) return;

        ApiClient.request(`/admin/users/${id}/approve`, {
            method: 'PUT',
            body: { approve }
        }).then(res => {
            showToast(res.message);
            this.renderRequests();
        }).catch(err => {
            showToast(err.error || 'Failed to update approval', 'error');
        });
    },

    promoteMember(id) {
        if (!confirm(I18n.t('auth.makeAdmin') + '?')) return;

        ApiClient.request(`/admin/users/${id}/promote`, {
            method: 'PUT'
        }).then(res => {
            showToast(res.message);
            this.renderMembers();
        }).catch(err => {
            showToast(err.error || 'Failed to promote', 'error');
        });
    },

    // ==================== RISK DETECTION ====================
    renderRisk() {
        const members = Auth.getMembers();
        const attendance = Store.getA('attendance');
        const risks = [];

        members.forEach(m => {
            const recentCheckins = attendance.filter(a => a.userId === m.id && new Date(a.date) >= new Date(Date.now() - 14 * 86400000)).length;
            const tags = [];
            let score = 0;
            if (recentCheckins === 0) { tags.push({ text: I18n.t('admin.inactive14d'), color: 'var(--red-bg)', textColor: 'var(--red)' }); score += 3; }
            else if (recentCheckins < 3) { tags.push({ text: I18n.t('admin.lowActivity'), color: 'var(--yellow-bg)', textColor: 'var(--yellow)' }); score += 1; }
            if (m.streak === 0) { tags.push({ text: I18n.t('admin.noStreak'), color: 'var(--yellow-bg)', textColor: 'var(--yellow)' }); score += 1; }
            if (m.subscription?.expiresAt && new Date(m.subscription.expiresAt) < new Date(Date.now() + 7 * 86400000)) { tags.push({ text: I18n.t('admin.subExpiring'), color: 'var(--red-bg)', textColor: 'var(--red)' }); score += 2; }
            if (m.subscription?.expiresAt && new Date(m.subscription.expiresAt) < new Date()) { tags.push({ text: I18n.t('admin.expired'), color: 'var(--red-bg)', textColor: 'var(--red)' }); score += 3; }
            if (tags.length > 0) risks.push({ ...m, tags, riskScore: score, reasons: tags.map(t => t.text).join(' · ') });
        });

        risks.sort((a, b) => b.riskScore - a.riskScore);
        const colors = ['#ef4444', '#f97316', '#eab308', '#a855f7', '#3b82f6'];

        const s = document.getElementById('section-a-risk');
        s.innerHTML = `
            <div class="section-header"><h1>${I18n.t('admin.riskDetection')}</h1><p class="section-subtitle">${I18n.t('admin.riskSubtitle')}</p></div>
            <div class="kpi-grid" style="margin-bottom:24px;">
                <div class="kpi-card"><div class="kpi-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg></div><div class="kpi-data"><span class="kpi-value">${risks.filter(r => r.riskScore >= 3).length}</span><span class="kpi-label">${I18n.t('admin.highRisk')}</span></div></div>
                <div class="kpi-card"><div class="kpi-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><div class="kpi-data"><span class="kpi-value">${risks.filter(r => r.riskScore < 3).length}</span><span class="kpi-label">${I18n.t('admin.mediumRisk')}</span></div></div>
                <div class="kpi-card"><div class="kpi-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div class="kpi-data"><span class="kpi-value">${members.length - risks.length}</span><span class="kpi-label">${I18n.t('admin.lowRisk')}</span></div></div>
            </div>
            ${risks.length === 0 ? `<p class="empty-state">${I18n.t('admin.allGood')}</p>` : risks.map((r, i) => `
                <div class="risk-card">
                    <div class="risk-avatar" style="background:${colors[i % colors.length]}">${r.name.charAt(0)}</div>
                    <div class="risk-info">
                        <div class="risk-name">${r.name}</div>
                        <div class="risk-reason">${r.reasons}</div>
                        <div class="risk-tags">${r.tags.map(t => `<span class="risk-tag" style="background:${t.color};color:${t.textColor};">${t.text}</span>`).join('')}</div>
                    </div>
                    <span class="badge ${r.riskScore >= 3 ? 'badge-expired' : 'badge-expiring'}">${r.riskScore >= 3 ? I18n.t('admin.highRisk').split(' ')[0] : I18n.t('admin.mediumRisk').split(' ')[0]}</span>
                </div>
            `).join('')}
        `;
    },

    // ==================== PLANS & PRICING ====================
    renderPlans() {
        const plans = Store.getA('sub_plans');
        const s = document.getElementById('section-a-plans');
        s.innerHTML = `
            <div class="section-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
                <div><h1>${I18n.t('admin.plansPricing')}</h1><p class="section-subtitle">${I18n.t('admin.manageTiers')}</p></div>
                <button class="btn btn-primary btn-sm" id="addPlanBtn">+ ${I18n.t('admin.addPlan')}</button>
            </div>
            <div class="pricing-grid">
                ${plans.map(p => `
                    <div class="pricing-card">
                        <div class="pricing-name">${I18n.t('admin.' + p.name.toLowerCase()) || p.name}</div>
                        <div class="pricing-price">$${p.price}<span>/${I18n.t('admin.monthly')[0]}</span></div>
                        <p style="font-size:0.82rem;color:var(--text-muted);text-transform:capitalize;">${I18n.t('admin.' + p.duration.toLowerCase()) || p.duration}</p>
                        <ul class="pricing-features">${(p.features || []).map(f => `<li>${f}</li>`).join('')}</ul>
                        <div style="display:flex;gap:8px;margin-top:12px;">
                            <button class="btn btn-ghost btn-sm btn-full" onclick="AdminModule.editPlan('${p.id}')">${I18n.t('admin.edit')}</button>
                            <button class="btn btn-ghost btn-sm" style="color:var(--red);" onclick="AdminModule.deletePlan('${p.id}')">${I18n.t('admin.delete')}</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        document.getElementById('addPlanBtn').addEventListener('click', () => {
            document.getElementById('adminPlanTitle').textContent = I18n.t('admin.addPlan');
            document.getElementById('adminPlanForm').reset();
            document.getElementById('apId').value = '';
            openModal('adminPlanModal');
        });
    },

    editPlan(id) {
        const plans = Store.getA('sub_plans');
        const p = plans.find(x => x.id === id);
        if (!p) return;
        document.getElementById('adminPlanTitle').textContent = I18n.t('admin.edit');
        document.getElementById('apId').value = p.id;
        document.getElementById('apName').value = p.name;
        document.getElementById('apPrice').value = p.price;
        document.getElementById('apDuration').value = p.duration;
        document.getElementById('apFeatures').value = (p.features || []).join(', ');
        openModal('adminPlanModal');
    },

    savePlan(e) {
        e.preventDefault();
        const plans = Store.getA('sub_plans');
        const id = document.getElementById('apId').value;
        const data = {
            name: document.getElementById('apName').value.trim(),
            price: parseFloat(document.getElementById('apPrice').value),
            duration: document.getElementById('apDuration').value,
            features: document.getElementById('apFeatures').value.split(',').map(f => f.trim()).filter(Boolean)
        };
        if (id) {
            const idx = plans.findIndex(p => p.id === id);
            if (idx > -1) Object.assign(plans[idx], data);
            showToast(I18n.t('admin.planUpdated'));
        } else {
            data.id = Store.genId('PLAN');
            plans.push(data);
            showToast(I18n.t('admin.planCreated'));
        }
        Store.set('sub_plans', plans);
        closeModal('adminPlanModal');
        this.renderPlans();
    },

    deletePlan(id) {
        if (!confirm(I18n.t('admin.deleteConfirm'))) return;
        Store.set('sub_plans', Store.getA('sub_plans').filter(p => p.id !== id));
        showToast(I18n.t('admin.delete'), 'info');
        this.renderPlans();
    }
};

// Init admin plan form
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('adminPlanForm').addEventListener('submit', e => AdminModule.savePlan(e));
});
