module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        user_id: DataTypes.INTEGER,
        order_type: DataTypes.STRING,
        crypto_symbol: DataTypes.STRING,
        amount: DataTypes.DECIMAL(18,8),
        price_per_unit: DataTypes.DECIMAL(18,8),
        status: DataTypes.STRING,
        created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
        }
    });
    return Order;
};