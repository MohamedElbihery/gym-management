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
            <div class="section-header"><h1>Admin Dashboard</h1><p class="section-subtitle">Platform analytics and key metrics</p></div>
            <div class="kpi-grid">
                <div class="kpi-card"><div class="kpi-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div class="kpi-data"><span class="kpi-value">${members.length}</span><span class="kpi-label">Total Members</span></div></div>
                <div class="kpi-card"><div class="kpi-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div class="kpi-data"><span class="kpi-value">${active}</span><span class="kpi-label">Active</span></div></div>
                <div class="kpi-card"><div class="kpi-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="kpi-data"><span class="kpi-value">${expiring}</span><span class="kpi-label">Expiring Soon</span></div></div>
                <div class="kpi-card"><div class="kpi-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div class="kpi-data"><span class="kpi-value">$${totalRev.toLocaleString()}</span><span class="kpi-label">Total Revenue</span></div></div>
                <div class="kpi-card"><div class="kpi-icon cyan"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div class="kpi-data"><span class="kpi-value">$${thisMonthRev.toLocaleString()}</span><span class="kpi-label">MRR</span></div></div>
                <div class="kpi-card"><div class="kpi-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div class="kpi-data"><span class="kpi-value">${churnRate}%</span><span class="kpi-label">Churn Rate</span></div></div>
            </div>

            <div class="charts-grid">
                <div class="chart-card"><h3 class="chart-title">Revenue (Last 6 Months)</h3><canvas id="adminRevChart"></canvas></div>
                <div class="chart-card"><h3 class="chart-title">Attendance (Last 7 Days)</h3><canvas id="adminAttChart"></canvas></div>
            </div>

            <div class="charts-grid">
                <div class="chart-card"><h3 class="chart-title">Plan Distribution</h3><canvas id="adminPlanDist"></canvas></div>
                <div class="card"><h3 class="card-title">Subscription Predictions</h3>
                    <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px;">Based on current patterns:</p>
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
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value" style="font-size:1.2rem;">${predictedRenewals}</span><span class="kpi-label">Est. Renewals</span></div></div>
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value" style="font-size:1.2rem;">$${predictedRev}</span><span class="kpi-label">Predicted Revenue</span></div></div>
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value" style="font-size:1.2rem;">${recentRate}%</span><span class="kpi-label">Retention Rate</span></div></div>
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
            type: 'doughnut', data: { labels: ['Basic', 'Pro', 'Elite'], datasets: [{ data: [planCounts.basic, planCounts.pro, planCounts.elite], backgroundColor: ['#3b82f6', '#f97316', '#a855f7'], borderWidth: 0 }] },
            options: { responsive: true, plugins: { legend: { display: true, position: 'bottom', labels: { color: '#a1a1aa', font: { family: 'Outfit' }, padding: 16 } } } }
        });
    },

    // ==================== REVENUE ====================
    renderRevenue() {
        const payments = Store.getA('payments');
        const s = document.getElementById('section-a-revenue');
        s.innerHTML = `
            <div class="section-header"><h1>Revenue Analytics</h1><p class="section-subtitle">Payment history and revenue tracking</p></div>
            <div class="card table-card">
                <div class="table-responsive">
                    <table class="data-table"><thead><tr><th>Member</th><th>Amount</th><th>Plan</th><th>Method</th><th>Date</th></tr></thead>
                    <tbody>${payments.sort((a, b) => new Date(b.date) - new Date(a.date)).map(p => `<tr><td><strong>${p.userName}</strong></td><td style="color:var(--green);font-weight:600;">$${p.amount}</td><td style="text-transform:capitalize;">${p.plan || '—'}</td><td style="text-transform:capitalize;">${p.method}</td><td>${formatDate(p.date)}</td></tr>`).join('')}</tbody></table>
                </div>
                ${payments.length === 0 ? '<p class="empty-state sm">No payments</p>' : ''}
            </div>
        `;
    },

    // ==================== ATTENDANCE ====================
    renderAttendance() {
        const attendance = Store.getA('attendance').sort((a, b) => new Date(b.time) - new Date(a.time));
        const s = document.getElementById('section-a-attendance');
        s.innerHTML = `
            <div class="section-header"><h1>Attendance Analytics</h1><p class="section-subtitle">Check-in logs and attendance patterns</p></div>
            <div class="kpi-grid" style="margin-bottom:24px;">
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value">${attendance.filter(a => a.date === todayStr()).length}</span><span class="kpi-label">Today</span></div></div>
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value">${attendance.filter(a => new Date(a.date) >= new Date(Date.now() - 7 * 86400000)).length}</span><span class="kpi-label">This Week</span></div></div>
                <div class="kpi-card"><div class="kpi-data" style="text-align:center;width:100%;"><span class="kpi-value">${attendance.length}</span><span class="kpi-label">All Time</span></div></div>
            </div>
            <div class="card table-card">
                <div class="table-responsive">
                    <table class="data-table"><thead><tr><th>Member</th><th>Date</th><th>Time</th><th>Method</th></tr></thead>
                    <tbody>${attendance.slice(0, 50).map(a => `<tr><td><strong>${a.userName}</strong></td><td>${formatDate(a.date)}</td><td>${formatTime(a.time)}</td><td>${a.method}</td></tr>`).join('')}</tbody></table>
                </div>
            </div>
        `;
    },

    // ==================== MEMBERS ====================
    renderMembers() {
        const members = Auth.getMembers();
        const s = document.getElementById('section-a-members');
        s.innerHTML = `
            <div class="section-header"><h1>All Members</h1><p class="section-subtitle">Manage gym membership</p></div>
            <div class="card table-card">
                <div class="table-responsive">
                    <table class="data-table"><thead><tr><th>Name</th><th>Email</th><th>Plan</th><th>Status</th><th>XP</th><th>Streak</th><th>Joined</th></tr></thead>
                    <tbody>${members.map(m => {
            const tier = Gamification.getTier(m.xp || 0);
            const status = m.subscription?.expiresAt && new Date(m.subscription.expiresAt) < new Date() ? 'expired' : m.subscription?.expiresAt && new Date(m.subscription.expiresAt) < new Date(Date.now() + 7 * 86400000) ? 'expiring' : 'active';
            return `<tr><td><strong>${m.name}</strong></td><td>${m.email}</td><td style="text-transform:capitalize;">${m.subscription?.plan || '—'}</td><td><span class="badge badge-${status}">${status}</span></td><td><span class="level-badge level-${tier.css}" style="font-size:0.65rem;padding:1px 6px;">${tier.emoji} ${m.xp || 0}</span></td><td>🔥 ${m.streak || 0}</td><td>${formatDate(m.createdAt)}</td></tr>`;
        }).join('')}</tbody></table>
                </div>
            </div>
        `;
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
            if (recentCheckins === 0) { tags.push({ text: 'Inactive 14d+', color: 'var(--red-bg)', textColor: 'var(--red)' }); score += 3; }
            else if (recentCheckins < 3) { tags.push({ text: 'Low activity', color: 'var(--yellow-bg)', textColor: 'var(--yellow)' }); score += 1; }
            if (m.streak === 0) { tags.push({ text: 'No streak', color: 'var(--yellow-bg)', textColor: 'var(--yellow)' }); score += 1; }
            if (m.subscription?.expiresAt && new Date(m.subscription.expiresAt) < new Date(Date.now() + 7 * 86400000)) { tags.push({ text: 'Sub expiring', color: 'var(--red-bg)', textColor: 'var(--red)' }); score += 2; }
            if (m.subscription?.expiresAt && new Date(m.subscription.expiresAt) < new Date()) { tags.push({ text: 'Expired', color: 'var(--red-bg)', textColor: 'var(--red)' }); score += 3; }
            if (tags.length > 0) risks.push({ ...m, tags, riskScore: score, reasons: tags.map(t => t.text).join(' · ') });
        });

        risks.sort((a, b) => b.riskScore - a.riskScore);
        const colors = ['#ef4444', '#f97316', '#eab308', '#a855f7', '#3b82f6'];

        const s = document.getElementById('section-a-risk');
        s.innerHTML = `
            <div class="section-header"><h1>Risk Detection</h1><p class="section-subtitle">Members flagged for low engagement or expiring subscriptions</p></div>
            <div class="kpi-grid" style="margin-bottom:24px;">
                <div class="kpi-card"><div class="kpi-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg></div><div class="kpi-data"><span class="kpi-value">${risks.filter(r => r.riskScore >= 3).length}</span><span class="kpi-label">High Risk</span></div></div>
                <div class="kpi-card"><div class="kpi-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><div class="kpi-data"><span class="kpi-value">${risks.filter(r => r.riskScore < 3).length}</span><span class="kpi-label">Medium Risk</span></div></div>
                <div class="kpi-card"><div class="kpi-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div class="kpi-data"><span class="kpi-value">${members.length - risks.length}</span><span class="kpi-label">Low Risk</span></div></div>
            </div>
            ${risks.length === 0 ? '<p class="empty-state">All members are in good standing! 🎉</p>' : risks.map((r, i) => `
                <div class="risk-card">
                    <div class="risk-avatar" style="background:${colors[i % colors.length]}">${r.name.charAt(0)}</div>
                    <div class="risk-info">
                        <div class="risk-name">${r.name}</div>
                        <div class="risk-reason">${r.reasons}</div>
                        <div class="risk-tags">${r.tags.map(t => `<span class="risk-tag" style="background:${t.color};color:${t.textColor};">${t.text}</span>`).join('')}</div>
                    </div>
                    <span class="badge ${r.riskScore >= 3 ? 'badge-expired' : 'badge-expiring'}">${r.riskScore >= 3 ? 'HIGH' : 'MEDIUM'}</span>
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
                <div><h1>Plans & Pricing</h1><p class="section-subtitle">Manage subscription tiers</p></div>
                <button class="btn btn-primary btn-sm" id="addPlanBtn">+ Add Plan</button>
            </div>
            <div class="pricing-grid">
                ${plans.map(p => `
                    <div class="pricing-card">
                        <div class="pricing-name">${p.name}</div>
                        <div class="pricing-price">$${p.price}<span>/mo</span></div>
                        <p style="font-size:0.82rem;color:var(--text-muted);text-transform:capitalize;">${p.duration}</p>
                        <ul class="pricing-features">${(p.features || []).map(f => `<li>${f}</li>`).join('')}</ul>
                        <div style="display:flex;gap:8px;margin-top:12px;">
                            <button class="btn btn-ghost btn-sm btn-full" onclick="AdminModule.editPlan('${p.id}')">Edit</button>
                            <button class="btn btn-ghost btn-sm" style="color:var(--red);" onclick="AdminModule.deletePlan('${p.id}')">Delete</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        document.getElementById('addPlanBtn').addEventListener('click', () => {
            document.getElementById('adminPlanTitle').textContent = 'Add Plan';
            document.getElementById('adminPlanForm').reset();
            document.getElementById('apId').value = '';
            openModal('adminPlanModal');
        });
    },

    editPlan(id) {
        const plans = Store.getA('sub_plans');
        const p = plans.find(x => x.id === id);
        if (!p) return;
        document.getElementById('adminPlanTitle').textContent = 'Edit Plan';
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
            showToast('Plan updated');
        } else {
            data.id = Store.genId('PLAN');
            plans.push(data);
            showToast('Plan created');
        }
        Store.set('sub_plans', plans);
        closeModal('adminPlanModal');
        this.renderPlans();
    },

    deletePlan(id) {
        if (!confirm('Delete this plan?')) return;
        Store.set('sub_plans', Store.getA('sub_plans').filter(p => p.id !== id));
        showToast('Plan deleted', 'info');
        this.renderPlans();
    }
};

// Init admin plan form
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('adminPlanForm').addEventListener('submit', e => AdminModule.savePlan(e));
});
