const { Order, OrderMatch, Wallet, CryptoTransaction, sequelize } = require('../models');

exports.createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body);
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.completeOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { orderId } = req.params;
        const order = await Order.findByPk(orderId, { transaction: t });
        if (!order) return res.status(404).json({ error: 'Order not found' });

        if (order.status === 'completed') {
        await t.rollback();
        return res.status(400).json({ error: 'Order already completed' });
        }

        order.status = 'completed';
        await order.save({ transaction: t });

        const matchingOrder = await Order.findOne({
        where: {
            crypto_symbol: order.crypto_symbol,
            order_type: order.order_type === 'buy' ? 'sell' : 'buy',
            status: 'completed',
        },
        transaction: t,
        });

        if (matchingOrder) {
        const matchedAmount = Math.min(order.amount, matchingOrder.amount);
        const match = await OrderMatch.create({
            buy_order_id: order.order_type === 'buy' ? order.id : matchingOrder.id,
            sell_order_id: order.order_type === 'sell' ? order.id : matchingOrder.id,
            matched_amount: matchedAmount,
            matched_price: order.price_per_unit,
            matched_at: new Date(),
        }, { transaction: t });

        const buyerWallet = await Wallet.findOne({
            where: { user_id: order.order_type === 'buy' ? order.user_id : matchingOrder.user_id, crypto_symbol: order.crypto_symbol },
            transaction: t,
        });
        const sellerWallet = await Wallet.findOne({
            where: { user_id: order.order_type === 'sell' ? order.user_id : matchingOrder.user_id, crypto_symbol: order.crypto_symbol },
            transaction: t,
        });

        if (buyerWallet && sellerWallet) {
            buyerWallet.balance += matchedAmount;
            sellerWallet.balance -= matchedAmount;
            await buyerWallet.save({ transaction: t });
            await sellerWallet.save({ transaction: t });

            await CryptoTransaction.create({
            wallet_id: sellerWallet.id,
            type: 'internal',
            crypto_symbol: order.crypto_symbol,
            amount: matchedAmount,
            counterparty_address: buyerWallet.address,
            created_at: new Date(),
            }, { transaction: t });
        }

        await t.commit();
        return res.status(200).json({ message: 'Order completed and matched', match });
        } else {
        await t.commit();
        return res.status(200).json({ message: 'Order completed but no match found' });
        }
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};