const { Wallet, FiatTransaction } = require('../models');

exports.depositFiat = async (req, res) => {
    try {
        const { user_id, fiat_currency, amount } = req.body;

        let wallet = await Wallet.findOne({
            where: { user_id, crypto_symbol: fiat_currency }
        });

        if (!wallet) {
            wallet = await Wallet.create({
                user_id,
                crypto_symbol: fiat_currency,
                balance: 0
            });
        }

        wallet.balance += amount;
        await wallet.save();

        const tx = await FiatTransaction.create({
            user_id,
            fiat_currency,
            amount,
            type: 'deposit',
            status: 'completed'
        });

        res.status(200).json({ message: 'Deposit successful', wallet, transaction: tx });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.withdrawFiat = async (req, res) => {
    try {
        const { user_id, fiat_currency, amount } = req.body;

        const wallet = await Wallet.findOne({
            where: { user_id, crypto_symbol: fiat_currency }
        });

        if (!wallet) return res.status(404).json({ error: 'Fiat wallet not found' });
        if (wallet.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

        wallet.balance -= amount;
        await wallet.save();

        const tx = await FiatTransaction.create({
            user_id,
            fiat_currency,
            amount,
            type: 'withdraw',
            status: 'completed'
        });

        res.status(200).json({ message: 'Withdraw successful', wallet, transaction: tx });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createFiatTransaction = async (req, res) => {
    try {
        const tx = await FiatTransaction.create(req.body);
        res.status(201).json(tx);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFiatTransactions = async (req, res) => {
    try {
        const txs = await FiatTransaction.findAll();
        res.json(txs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFiatTransactionById = async (req, res) => {
    try {
        const tx = await FiatTransaction.findByPk(req.params.id);
        if (!tx) return res.status(404).json({ error: 'FiatTransaction not found' });
        res.json(tx);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};