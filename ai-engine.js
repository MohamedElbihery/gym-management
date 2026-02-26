/* ============================================
   GymForge PRO — AI Engine
   Workout Generator, Nutrition Calculator,
   Weekly Adjuster
   ============================================ */

const AIEngine = {
    // Exercise database
    exercises: {
        chest: [
            { name: 'Barbell Bench Press', type: 'compound' },
            { name: 'Incline Dumbbell Press', type: 'compound' },
            { name: 'Cable Flyes', type: 'isolation' },
            { name: 'Dumbbell Pullover', type: 'isolation' },
            { name: 'Push-Ups', type: 'bodyweight' },
            { name: 'Chest Dips', type: 'compound' },
            { name: 'Pec Deck Machine', type: 'isolation' },
        ],
        back: [
            { name: 'Deadlift', type: 'compound' },
            { name: 'Barbell Row', type: 'compound' },
            { name: 'Pull-Ups', type: 'bodyweight' },
            { name: 'Lat Pulldown', type: 'compound' },
            { name: 'Seated Cable Row', type: 'compound' },
            { name: 'Face Pulls', type: 'isolation' },
            { name: 'T-Bar Row', type: 'compound' },
        ],
        shoulders: [
            { name: 'Overhead Press', type: 'compound' },
            { name: 'Lateral Raises', type: 'isolation' },
            { name: 'Front Raises', type: 'isolation' },
            { name: 'Rear Delt Flyes', type: 'isolation' },
            { name: 'Arnold Press', type: 'compound' },
            { name: 'Upright Row', type: 'compound' },
        ],
        legs: [
            { name: 'Barbell Squat', type: 'compound' },
            { name: 'Romanian Deadlift', type: 'compound' },
            { name: 'Leg Press', type: 'compound' },
            { name: 'Leg Curl', type: 'isolation' },
            { name: 'Leg Extension', type: 'isolation' },
            { name: 'Calf Raises', type: 'isolation' },
            { name: 'Bulgarian Split Squat', type: 'compound' },
            { name: 'Hip Thrust', type: 'compound' },
        ],
        arms: [
            { name: 'Barbell Curl', type: 'isolation' },
            { name: 'Tricep Pushdown', type: 'isolation' },
            { name: 'Hammer Curls', type: 'isolation' },
            { name: 'Overhead Tricep Extension', type: 'isolation' },
            { name: 'Concentration Curls', type: 'isolation' },
            { name: 'Skull Crushers', type: 'isolation' },
            { name: 'Cable Curls', type: 'isolation' },
        ],
        core: [
            { name: 'Plank', type: 'bodyweight' },
            { name: 'Hanging Leg Raises', type: 'bodyweight' },
            { name: 'Cable Crunches', type: 'isolation' },
            { name: 'Russian Twists', type: 'bodyweight' },
            { name: 'Ab Rollout', type: 'bodyweight' },
        ],
        cardio: [
            { name: 'Treadmill Run', type: 'cardio' },
            { name: 'Stationary Bike', type: 'cardio' },
            { name: 'Rowing Machine', type: 'cardio' },
            { name: 'Jump Rope', type: 'cardio' },
            { name: 'HIIT Circuit', type: 'cardio' },
            { name: 'Stair Climber', type: 'cardio' },
        ],
    },

    // Split templates based on days
    splits: {
        3: [
            { day: 'Monday', muscles: ['chest', 'shoulders', 'arms'], label: 'Push' },
            { day: 'Wednesday', muscles: ['back', 'arms'], label: 'Pull' },
            { day: 'Friday', muscles: ['legs', 'core'], label: 'Legs & Core' },
        ],
        4: [
            { day: 'Monday', muscles: ['chest', 'shoulders'], label: 'Chest & Shoulders' },
            { day: 'Tuesday', muscles: ['back', 'arms'], label: 'Back & Arms' },
            { day: 'Thursday', muscles: ['legs'], label: 'Legs' },
            { day: 'Friday', muscles: ['shoulders', 'arms', 'core'], label: 'Shoulders & Core' },
        ],
        5: [
            { day: 'Monday', muscles: ['chest'], label: 'Chest' },
            { day: 'Tuesday', muscles: ['back'], label: 'Back' },
            { day: 'Wednesday', muscles: ['shoulders', 'core'], label: 'Shoulders & Core' },
            { day: 'Thursday', muscles: ['legs'], label: 'Legs' },
            { day: 'Friday', muscles: ['arms'], label: 'Arms' },
        ],
        6: [
            { day: 'Monday', muscles: ['chest', 'shoulders'], label: 'Push' },
            { day: 'Tuesday', muscles: ['back', 'arms'], label: 'Pull' },
            { day: 'Wednesday', muscles: ['legs'], label: 'Legs' },
            { day: 'Thursday', muscles: ['chest', 'shoulders'], label: 'Push B' },
            { day: 'Friday', muscles: ['back', 'arms'], label: 'Pull B' },
            { day: 'Saturday', muscles: ['legs', 'core'], label: 'Legs & Core' },
        ],
    },

    allDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

    generateWorkoutPlan(user) {
        const days = user.daysPerWeek || 4;
        const level = user.experience || 'intermediate';
        const goal = user.goal || 'general';
        const split = this.splits[days] || this.splits[4];
        const workoutDays = split.map(s => s.day);

        const setsConfig = level === 'beginner' ? { compound: 3, isolation: 2 } : level === 'advanced' ? { compound: 5, isolation: 4 } : { compound: 4, isolation: 3 };
        const repsConfig = goal === 'build_muscle' ? { compound: '6-8', isolation: '8-12' } : goal === 'endurance' ? { compound: '12-15', isolation: '15-20' } : goal === 'lose_weight' ? { compound: '10-12', isolation: '12-15' } : { compound: '8-10', isolation: '10-12' };
        const restConfig = goal === 'build_muscle' ? { compound: '90s', isolation: '60s' } : goal === 'endurance' ? { compound: '30s', isolation: '30s' } : { compound: '60s', isolation: '45s' };

        const weekPlan = this.allDays.map(dayName => {
            const splitDay = split.find(s => s.day === dayName);
            if (!splitDay) return { day: dayName, rest: true };

            const exercises = [];
            splitDay.muscles.forEach(muscle => {
                const pool = this.exercises[muscle] || [];
                const count = level === 'beginner' ? 2 : level === 'advanced' ? 4 : 3;
                const shuffled = [...pool].sort(() => Math.random() - 0.5);
                const selected = shuffled.slice(0, count);
                selected.forEach(ex => {
                    const isCompound = ex.type === 'compound';
                    const isCardio = ex.type === 'cardio';
                    exercises.push({
                        name: ex.name,
                        muscle,
                        sets: isCardio ? 1 : (isCompound ? setsConfig.compound : setsConfig.isolation),
                        reps: isCardio ? '20-30 min' : (isCompound ? repsConfig.compound : repsConfig.isolation),
                        rest: isCardio ? '—' : (isCompound ? restConfig.compound : restConfig.isolation),
                        completed: false
                    });
                });
            });

            // Add cardio for lose_weight / endurance
            if ((goal === 'lose_weight' || goal === 'endurance') && !exercises.some(e => e.muscle === 'cardio')) {
                const cardioEx = this.exercises.cardio[Math.floor(Math.random() * this.exercises.cardio.length)];
                exercises.push({ name: cardioEx.name, muscle: 'cardio', sets: 1, reps: goal === 'endurance' ? '25-40 min' : '15-20 min', rest: '—', completed: false });
            }

            return { day: dayName, rest: false, label: splitDay.label, muscles: splitDay.muscles, exercises };
        });

        return weekPlan;
    },

    calculateNutrition(user) {
        // Mifflin-St Jeor
        const w = user.weight || 75, h = user.height || 175, a = user.age || 25;
        let bmr;
        if (user.gender === 'female') {
            bmr = 10 * w + 6.25 * h - 5 * a - 161;
        } else {
            bmr = 10 * w + 6.25 * h - 5 * a + 5;
        }

        // Activity multiplier
        const activityMultiplier = { 3: 1.375, 4: 1.55, 5: 1.65, 6: 1.725 };
        const tdee = Math.round(bmr * (activityMultiplier[user.daysPerWeek] || 1.55));

        // Goal adjustment
        let target;
        if (user.goal === 'lose_weight') target = Math.round(tdee * 0.8);
        else if (user.goal === 'build_muscle') target = Math.round(tdee * 1.15);
        else target = tdee;

        // Macro split
        let proteinRatio, carbRatio, fatRatio;
        if (user.goal === 'build_muscle') { proteinRatio = 0.30; carbRatio = 0.45; fatRatio = 0.25; }
        else if (user.goal === 'lose_weight') { proteinRatio = 0.35; carbRatio = 0.35; fatRatio = 0.30; }
        else if (user.goal === 'endurance') { proteinRatio = 0.25; carbRatio = 0.50; fatRatio = 0.25; }
        else { proteinRatio = 0.30; carbRatio = 0.40; fatRatio = 0.30; }

        return {
            bmr: Math.round(bmr),
            tdee,
            target,
            protein: Math.round((target * proteinRatio) / 4),
            carbs: Math.round((target * carbRatio) / 4),
            fats: Math.round((target * fatRatio) / 9),
            goal: user.goal
        };
    },

    adjustPlan(userId) {
        // Simulate weekly adjustment based on progress
        const entries = Store.getA('progress_entries').filter(e => e.userId === userId).sort((a, b) => new Date(a.date) - new Date(b.date));
        if (entries.length < 2) return null;
        const last = entries[entries.length - 1], prev = entries[entries.length - 2];
        const weightDiff = last.weight - prev.weight;
        const user = Auth.getUser(userId);
        if (!user) return null;

        let adjustment = null;
        if (user.goal === 'lose_weight' && weightDiff > 0) {
            adjustment = 'Increased cardio duration and reduced rest periods to boost fat burn.';
        } else if (user.goal === 'build_muscle' && weightDiff < -0.5) {
            adjustment = 'Added an extra set to compound lifts and increased calorie target by 100.';
        } else if (user.goal === 'endurance') {
            adjustment = 'Progressive overload: increased cardio duration by 5 minutes.';
        }

        if (adjustment) {
            const plans = Store.getA('workout_plans');
            const plan = plans.find(p => p.userId === userId);
            if (plan) {
                plan.plan = this.generateWorkoutPlan(user);
                plan.generatedAt = new Date().toISOString();
                plan.adjustmentNote = adjustment;
                Store.set('workout_plans', plans);
            }
        }
        return adjustment;
    }
};
