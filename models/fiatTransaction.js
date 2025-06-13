module.exports = (sequelize, DataTypes) => {
    const FiatTransaction = sequelize.define('FiatTransaction', {
        user_id: DataTypes.INTEGER,
        fiat_currency: DataTypes.STRING,
        amount: DataTypes.DECIMAL(18,8),
        type: DataTypes.STRING,
        status: DataTypes.STRING,
        created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
        }
    });
    return FiatTransaction;
};