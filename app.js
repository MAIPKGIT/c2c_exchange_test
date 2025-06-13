const express = require('express');
const app = express();
const db = require('./models');

const userRoutes = require('./routes/userRoutes');
const walletRoutes = require('./routes/walletRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderMatchRoutes = require('./routes/orderMatchRoutes');
const cryptoTransactionRoutes = require('./routes/cryptoTransactionRoutes');
const fiatTransactionRoutes = require('./routes/fiatTransactionRoutes');

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-matches', orderMatchRoutes);
app.use('/api/crypto-transactions', cryptoTransactionRoutes);
app.use('/api/fiat-transactions', fiatTransactionRoutes);

const PORT = process.env.PORT || 3000;
db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});