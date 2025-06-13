module.exports = (sequelize, DataTypes) => {
    const CryptoTransaction = sequelize.define('CryptoTransaction', {
        wallet_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('internal', 'external'),
            allowNull: false,
            defaultValue: 'internal',
        },
        crypto_symbol: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(18,8),
            allowNull: false,
        },
        counterparty_address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed'),
            allowNull: false,
            defaultValue: 'pending',
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'crypto_transactions',
        timestamps: false,
    });

    CryptoTransaction.associate = (models) => {
        CryptoTransaction.belongsTo(models.Wallet, { foreignKey: 'wallet_id' });
    };

    return CryptoTransaction;
};