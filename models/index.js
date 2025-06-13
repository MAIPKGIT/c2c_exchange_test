const Sequelize = require('sequelize');
const sequelize = require('../config/config');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Wallet = require('./Wallet')(sequelize, Sequelize.DataTypes);
db.Order = require('./Order')(sequelize, Sequelize.DataTypes);
db.OrderMatch = require('./OrderMatch')(sequelize, Sequelize.DataTypes);
db.FiatTransaction = require('./FiatTransaction')(sequelize, Sequelize.DataTypes);
db.CryptoTransaction = require('./CryptoTransaction')(sequelize, Sequelize.DataTypes);

const { User, Wallet, Order, OrderMatch, FiatTransaction, CryptoTransaction , FiatWallet } = db;
User.hasMany(Wallet, { foreignKey: 'user_id' });
Wallet.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(FiatTransaction, { foreignKey: 'user_id' });
FiatTransaction.belongsTo(User, { foreignKey: 'user_id' });

Wallet.hasMany(CryptoTransaction, { foreignKey: 'wallet_id' });
CryptoTransaction.belongsTo(Wallet, { foreignKey: 'wallet_id' });

Order.hasMany(OrderMatch, { foreignKey: 'buyer_order_id' });
Order.hasMany(OrderMatch, { foreignKey: 'seller_order_id' });
OrderMatch.belongsTo(User, { foreignKey: 'buyer_order_id', as: 'BuyerUser', targetKey: 'id' });
OrderMatch.belongsTo(User, { foreignKey: 'seller_order_id', as: 'SellerUser', targetKey: 'id' });

module.exports = db;