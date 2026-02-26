/* ============================================
   GymForge PRO — Gamification
   XP, Levels, Leaderboard
   ============================================ */

const Gamification = {
    tiers: [
        { name: 'Iron', minXP: 0, css: 'iron', emoji: '🔩' },
        { name: 'Bronze', minXP: 500, css: 'bronze', emoji: '🥉' },
        { name: 'Silver', minXP: 1500, css: 'silver', emoji: '🥈' },
        { name: 'Gold', minXP: 3000, css: 'gold', emoji: '🥇' },
        { name: 'Platinum', minXP: 5000, css: 'platinum', emoji: '💎' },
        { name: 'Diamond', minXP: 8000, css: 'diamond', emoji: '👑' },
    ],

    xpActions: {
        workout_complete: 50,
        checkin: 20,
        streak_bonus: 30,
        meal_log: 10,
        progress_log: 15,
        welcome: 100,
    },

    getTier(xp) {
        let tier = this.tiers[0];
        for (const t of this.tiers) {
            if (xp >= t.minXP) tier = t;
        }
        return tier;
    },

    getLevel(xp) {
        for (let i = this.tiers.length - 1; i >= 0; i--) {
            if (xp >= this.tiers[i].minXP) return i + 1;
        }
        return 1;
    },

    getNextTier(xp) {
        for (const t of this.tiers) {
            if (xp < t.minXP) return t;
        }
        return null;
    },

    getProgress(xp) {
        const current = this.getTier(xp);
        const next = this.getNextTier(xp);
        if (!next) return { pct: 100, current, next: null, xpInTier: 0, xpNeeded: 0 };
        const xpInTier = xp - current.minXP;
        const xpNeeded = next.minXP - current.minXP;
        return { pct: Math.min(100, Math.round((xpInTier / xpNeeded) * 100)), current, next, xpInTier, xpNeeded };
    },

    addXP(userId, amount, reason) {
        const user = Auth.getUser(userId);
        if (!user) return;
        const oldLevel = this.getLevel(user.xp || 0);
        const newXP = (user.xp || 0) + amount;
        const newLevel = this.getLevel(newXP);
        Auth.updateUser(userId, { xp: newXP, level: newLevel });

        if (newLevel > oldLevel) {
            const tier = this.getTier(newXP);
            this.showLevelUp(tier);
            Notifs.push(`Level Up! ${tier.emoji}`, `You've reached ${tier.name} tier! Keep pushing!`, 'success');
        }
    },

    showLevelUp(tier) {
        const overlay = document.getElementById('levelUpOverlay');
        document.getElementById('levelUpTier').textContent = `${tier.emoji} ${tier.name} Tier`;
        document.getElementById('levelUpMsg').textContent = `Keep training to unlock the next level!`;
        overlay.style.display = 'flex';
    },

    renderXPBar(containerId, xp) {
        const prog = this.getProgress(xp);
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = `
            <div class="xp-bar-info">
                <span class="xp-level"><span class="level-badge level-${prog.current.css}">${prog.current.emoji} ${prog.current.name}</span></span>
                <span class="xp-text">${xp} XP ${prog.next ? `/ ${prog.next.minXP} XP` : '(MAX)'}</span>
            </div>
            <div class="xp-bar"><div class="xp-bar-fill" style="width:${prog.pct}%"></div></div>
        `;
    },

    renderLeaderboard(containerId) {
        const members = Auth.getMembers().sort((a, b) => (b.xp || 0) - (a.xp || 0));
        const container = document.getElementById(containerId);
        if (!container) return;

        const colors = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#06b6d4', '#eab308', '#ec4899', '#14b8a6'];

        container.innerHTML = `
            <div class="section-header"><h1>Leaderboard</h1><p class="section-subtitle">Top performers ranked by XP</p></div>
            <div class="leaderboard-list">
                ${members.map((m, i) => {
            const tier = this.getTier(m.xp || 0);
            const rankClass = i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : 'rn';
            const rowClass = i < 3 ? `top-${i + 1}` : '';
            const color = colors[i % colors.length];
            return `<div class="lb-row ${rowClass}">
                        <div class="lb-rank ${rankClass}">${i + 1}</div>
                        <div class="lb-avatar" style="background:${color}">${m.name.charAt(0)}</div>
                        <div class="lb-info">
                            <div class="lb-name">${m.name} ${Auth.currentUser && m.id === Auth.currentUser.id ? '<span style="color:var(--accent);font-size:0.72rem;">(You)</span>' : ''}</div>
                            <div class="lb-meta"><span class="level-badge level-${tier.css}" style="font-size:0.68rem;padding:2px 8px;">${tier.emoji} ${tier.name}</span></div>
                        </div>
                        <div style="text-align:right;">
                            <div class="lb-xp">${(m.xp || 0).toLocaleString()} XP</div>
                            <div class="lb-streak">🔥 ${m.streak || 0} day streak</div>
                        </div>
                    </div>`;
        }).join('')}
            </div>
        `;
    }
};
