const { Wallet, CryptoTransaction } = require('../models');

exports.createCryptoTransaction = async (req, res) => {
    try {
        const tx = await CryptoTransaction.create(req.body);
        res.status(201).json(tx);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCryptoTransactions = async (req, res) => {
    try {
        const txs = await CryptoTransaction.findAll();
        res.json(txs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCryptoTransactionById = async (req, res) => {
    try {
        const tx = await CryptoTransaction.findByPk(req.params.id);
        if (!tx) return res.status(404).json({ error: 'CryptoTransaction not found' });
        res.json(tx);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.transferExternalCrypto = async (req, res) => {
    try {
        const { user_id, crypto_symbol, amount, external_address } = req.body;

        const wallet = await Wallet.findOne({ where: { user_id, crypto_symbol } });
        if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

        if (wallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        wallet.balance -= amount;
        await wallet.save();

        const tx = await CryptoTransaction.create({
            wallet_id: wallet.id,
            type: 'external',
            crypto_symbol,
            amount,
            counterparty_address: external_address,
            status: 'pending',  
            created_at: new Date()
        });

        res.status(200).json({ message: 'External transfer initiated', transaction: tx });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};