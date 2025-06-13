module.exports = (sequelize, DataTypes) => {
    const OrderMatch = sequelize.define('OrderMatch', {
        buy_order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Orders',
                key: 'id'
            }
        },
        sell_order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Orders',
                key: 'id'
            }
        },
        crypto_symbol: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(18,8),
            allowNull: false
        },
        price_per_unit: {
            type: DataTypes.DECIMAL(18,8),
            allowNull: false
        },
        matched_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'OrderMatches',
        timestamps: true
    });

    OrderMatch.associate = function(models) {
        OrderMatch.belongsTo(models.Order, { as: 'buyOrder', foreignKey: 'buy_order_id' });
        OrderMatch.belongsTo(models.Order, { as: 'sellOrder', foreignKey: 'sell_order_id' });
    };

    return OrderMatch;
};