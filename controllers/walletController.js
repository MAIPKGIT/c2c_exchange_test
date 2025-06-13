const { Wallet } = require('../models');

exports.createWallet = async (req, res) => {
    try {
        const wallet = await Wallet.create(req.body);
        res.status(201).json(wallet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getWallets = async (req, res) => {
    try {
        const wallets = await Wallet.findAll();
        res.json(wallets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserWallets = async (req, res) => {
    try {
        const userId = req.params.userId;
        const wallets = await Wallet.findAll({ where: { user_id: userId } });
        res.json(wallets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};