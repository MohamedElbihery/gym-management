const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 12;

module.exports = {
    async hash(password) {
        return bcrypt.hash(password, SALT_ROUNDS);
    },
    async compare(password, hash) {
        return bcrypt.compare(password, hash);
    }
};
