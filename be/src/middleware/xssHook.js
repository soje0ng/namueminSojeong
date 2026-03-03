const xss = require('xss');

/**
 * Sequelize 모델에 XSS Hook을 자동 등록
 * @param {object} model Sequelize 모델
 */
function applyXssHook(model) {
    if (!model || !model.addHook) return;

    const sanitize = val => (typeof val === 'string' ? xss(val) : val);

    model.addHook('beforeSave', instance => {
        Object.keys(instance.dataValues).forEach(key => {
            instance.dataValues[key] = sanitize(instance.dataValues[key]);
        });
    });
}

module.exports = applyXssHook;
