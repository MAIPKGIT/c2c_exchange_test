const { OrderMatch } = require('../models');

exports.createOrderMatch = async (req, res) => {
    try {
        const match = await OrderMatch.create(req.body);
        res.status(201).json(match);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderMatches = async (req, res) => {
    try {
        const matches = await OrderMatch.findAll();
        res.json(matches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderMatchById = async (req, res) => {
    try {
        const match = await OrderMatch.findByPk(req.params.id);
        if (!match) return res.status(404).json({ error: 'OrderMatch not found' });
        res.json(match);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};