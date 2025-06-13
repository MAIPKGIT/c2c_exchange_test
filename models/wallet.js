module.exports = (sequelize, DataTypes) => {
    const Wallet = sequelize.define('Wallet', {
        user_id: DataTypes.INTEGER,
        crypto_symbol: DataTypes.STRING,
        balance: DataTypes.DECIMAL(18,8)
    });
    return Wallet;
};