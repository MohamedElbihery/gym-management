/* ============================================
   GymForge PRO — Trainer Module
   Dashboard, Members, Modify Plans, Feedback
   ============================================ */

const TrainerModule = {
    onNav(section) {
        if (!Auth.currentUser || Auth.currentUser.role !== 'trainer') return;
        switch (section) {
            case 't-dashboard': this.renderDashboard(); break;
            case 't-members': this.renderMembers(); break;
            case 't-plans': this.renderPlans(); break;
            case 't-feedback': this.renderFeedback(); break;
        }
    },

    renderDashboard() {
        const members = Auth.getMembers();
        const attendance = Store.getA('attendance');
        const todayCheckins = attendance.filter(a => a.date === todayStr());
        const thisWeek = attendance.filter(a => { const d = new Date(a.date); return d >= new Date(Date.now() - 7 * 86400000); });

        const s = document.getElementById('section-t-dashboard');
        s.innerHTML = `
            <div class="section-header"><h1>Trainer Dashboard</h1><p class="section-subtitle">Monitor your members and their progress</p></div>
            <div class="kpi-grid">
                <div class="kpi-card"><div class="kpi-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div class="kpi-data"><span class="kpi-value">${members.length}</span><span class="kpi-label">Total Members</span></div></div>
                <div class="kpi-card"><div class="kpi-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div class="kpi-data"><span class="kpi-value">${todayCheckins.length}</span><span class="kpi-label">Checked In Today</span></div></div>
                <div class="kpi-card"><div class="kpi-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><div class="kpi-data"><span class="kpi-value">${thisWeek.length}</span><span class="kpi-label">Weekly Check-ins</span></div></div>
                <div class="kpi-card"><div class="kpi-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><div class="kpi-data"><span class="kpi-value">${Store.getA('feedbacks').length}</span><span class="kpi-label">Feedbacks Sent</span></div></div>
            </div>
            <div class="card"><h3 class="card-title">Recent Check-ins</h3>
                ${todayCheckins.length === 0 ? '<p class="empty-state sm">No check-ins today</p>' : `<div class="meal-list">${todayCheckins.slice(0, 10).map(a => `<div class="meal-item"><span class="meal-name">${a.userName}</span><span style="color:var(--text-muted);font-size:0.82rem;">${formatTime(a.time)}</span></div>`).join('')}</div>`}
            </div>
            <div class="card"><h3 class="card-title">Members at Risk</h3>
                <div>${this.getRiskMembers().map(m => `<div class="risk-card"><div class="risk-avatar" style="background:var(--red)">${m.name.charAt(0)}</div><div class="risk-info"><div class="risk-name">${m.name}</div><div class="risk-reason">${m.riskReason}</div></div><button class="btn btn-ghost btn-sm" onclick="TrainerModule.openFeedback('${m.id}','${m.name}')">Send Message</button></div>`).join('') || '<p class="empty-state sm">No at-risk members</p>'}</div>
            </div>
        `;
    },

    getRiskMembers() {
        const members = Auth.getMembers();
        const attendance = Store.getA('attendance');
        const risks = [];
        members.forEach(m => {
            const recentCheckins = attendance.filter(a => a.userId === m.id && new Date(a.date) >= new Date(Date.now() - 14 * 86400000)).length;
            const reasons = [];
            if (recentCheckins === 0) reasons.push('No check-ins in 14 days');
            if (m.streak === 0) reasons.push('Lost streak');
            if (m.subscription?.status === 'expiring') reasons.push('Subscription expiring');
            if (reasons.length > 0) risks.push({ ...m, riskReason: reasons.join(' · ') });
        });
        return risks;
    },

    renderMembers() {
        const members = Auth.getMembers();
        const colors = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#06b6d4', '#eab308'];
        const s = document.getElementById('section-t-members');
        s.innerHTML = `
            <div class="section-header"><h1>Members</h1><p class="section-subtitle">View and monitor all member progress</p></div>
            ${members.map((m, i) => {
            const tier = Gamification.getTier(m.xp || 0);
            const entries = Store.getA('progress_entries').filter(e => e.userId === m.id);
            const latest = entries.length > 0 ? entries[entries.length - 1] : null;
            const attendance = Store.getA('attendance').filter(a => a.userId === m.id);
            const recentCount = attendance.filter(a => new Date(a.date) >= new Date(Date.now() - 7 * 86400000)).length;
            return `<div class="trainer-member-card">
                    <div class="tm-avatar" style="background:${colors[i % colors.length]}">${m.name.charAt(0)}</div>
                    <div class="tm-info">
                        <div class="tm-name">${m.name} <span class="level-badge level-${tier.css}" style="font-size:0.65rem;padding:1px 6px;">${tier.emoji} ${tier.name}</span></div>
                        <div class="tm-meta">Goal: ${(m.goal || '').replace('_', ' ')} · ${recentCount} workouts/wk · Weight: ${latest ? latest.weight + 'kg' : (m.weight || '—') + 'kg'} · Streak: 🔥${m.streak || 0}</div>
                    </div>
                    <div class="tm-actions">
                        <button class="btn btn-ghost btn-sm" onclick="TrainerModule.openFeedback('${m.id}','${m.name}')">Feedback</button>
                    </div>
                </div>`;
        }).join('')}
        `;
    },

    renderPlans() {
        const members = Auth.getMembers();
        const plans = Store.getA('workout_plans');
        const s = document.getElementById('section-t-plans');
        s.innerHTML = `
            <div class="section-header"><h1>Modify Plans</h1><p class="section-subtitle">Override AI-generated plans for specific members</p></div>
            ${members.map(m => {
            const plan = plans.find(p => p.userId === m.id);
            if (!plan) return '';
            const workoutDays = plan.plan.filter(d => !d.rest);
            return `<div class="card" style="margin-bottom:16px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <div><strong>${m.name}</strong> <span style="color:var(--text-muted);font-size:0.82rem;">· ${(m.goal || '').replace('_', ' ')} · ${m.experience}</span></div>
                        <button class="btn btn-ghost btn-sm" onclick="TrainerModule.regenerateForMember('${m.id}')">🤖 Regenerate</button>
                    </div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        ${workoutDays.map(d => `<div style="background:var(--bg-card-hover);padding:8px 14px;border-radius:var(--radius-xs);font-size:0.82rem;"><strong>${d.day}</strong> · ${d.label} · ${d.exercises.length} exercises</div>`).join('')}
                    </div>
                </div>`;
        }).join('')}
        `;
    },

    regenerateForMember(userId) {
        const user = Auth.getUser(userId);
        if (!user) return;
        const newPlan = AIEngine.generateWorkoutPlan(user);
        const plans = Store.getA('workout_plans');
        const idx = plans.findIndex(p => p.userId === userId);
        if (idx > -1) { plans[idx].plan = newPlan; plans[idx].generatedAt = new Date().toISOString(); }
        else plans.push({ userId, plan: newPlan, generatedAt: new Date().toISOString() });
        Store.set('workout_plans', plans);
        showToast(`Plan regenerated for ${user.name}`);
        Notifs.push('Plan Updated', `Coach has regenerated your workout plan.`);
        this.renderPlans();
    },

    renderFeedback() {
        const members = Auth.getMembers();
        const feedbacks = Store.getA('feedbacks').slice(0, 20);
        const s = document.getElementById('section-t-feedback');
        s.innerHTML = `
            <div class="section-header"><h1>Feedback</h1><p class="section-subtitle">Send messages and feedback to members</p></div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;">
                ${members.map(m => `<button class="btn btn-ghost btn-sm" onclick="TrainerModule.openFeedback('${m.id}','${m.name}')">${m.name}</button>`).join('')}
            </div>
            <div class="card"><h3 class="card-title">Sent Feedback</h3>
                ${feedbacks.length === 0 ? '<p class="empty-state sm">No feedback sent yet</p>' : feedbacks.map(f => `<div class="notif-item" style="margin-bottom:8px;"><div class="notif-title">To: ${f.memberName}</div><div>${f.message}</div><div class="notif-time">${timeAgo(f.createdAt)}</div></div>`).join('')}
            </div>
        `;
    },

    openFeedback(memberId, memberName) {
        document.getElementById('feedbackMemberId').value = memberId;
        document.getElementById('feedbackTo').value = memberName;
        document.getElementById('feedbackMsg').value = '';
        openModal('feedbackModal');
    },

    sendFeedback(e) {
        e.preventDefault();
        const memberId = document.getElementById('feedbackMemberId').value;
        const memberName = document.getElementById('feedbackTo').value;
        const message = document.getElementById('feedbackMsg').value.trim();
        if (!message) return;
        const feedbacks = Store.getA('feedbacks');
        feedbacks.unshift({ memberId, memberName, message, from: Auth.currentUser.name, createdAt: new Date().toISOString() });
        Store.set('feedbacks', feedbacks);
        closeModal('feedbackModal');
        showToast(`Feedback sent to ${memberName}`);
        Notifs.push('Trainer Feedback 📩', message);
        this.renderFeedback();
    }
};

// Init feedback form
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('feedbackForm').addEventListener('submit', e => TrainerModule.sendFeedback(e));
});
