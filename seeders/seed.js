const axios = require('axios');
const baseURL = 'http://localhost:3000/api';

async function seed() {
    try {
        const usersData = [
            { username: 'panat', email: 'panat@example.com', password_hash: '123456panat', phone_number: '0632142555' },
            { username: 'ying', email: 'ying@example.com', password_hash: '123456ying', phone_number: '0983835866' },
            { username: 'joe', email: 'joe@example.com', password_hash: '123456joe', phone_number: '0911222333' },
        ];

        const users = [];
        for (const u of usersData) {
            const res = await axios.post(`${baseURL}/users`, u);
            users.push(res.data);
        }
        console.log('Users created:', users.map(u => u.username));

        for (const user of users) {
            await axios.post(`${baseURL}/wallets`, { user_id: user.id, crypto_symbol: 'BTC', balance: 1.5 });
            await axios.post(`${baseURL}/wallets`, { user_id: user.id, crypto_symbol: 'ETH', balance: 3.0 });

            await axios.post(`${baseURL}/wallets`, { user_id: user.id, crypto_symbol: 'THB', balance: 0 });
            await axios.post(`${baseURL}/wallets`, { user_id: user.id, crypto_symbol: 'USD', balance: 0 });
        }
        console.log('Wallets created (crypto + fiat)');

        await axios.post(`${baseURL}/fiat-transactions/deposit`, {
            user_id: users[0].id,
            fiat_currency: 'THB',
            amount: 50000,
        });
        await axios.post(`${baseURL}/fiat-transactions/deposit`, {
            user_id: users[1].id,
            fiat_currency: 'USD',
            amount: 1000,
        });
        console.log('Fiat deposits done');

        const ordersData = [
            { user_id: users[0].id, order_type: 'buy', crypto_symbol: 'BTC', amount: 0.7, price_per_unit: 1500000, status: 'open' },
            { user_id: users[1].id, order_type: 'sell', crypto_symbol: 'BTC', amount: 0.5, price_per_unit: 1500000, status: 'open' },
            { user_id: users[0].id, order_type: 'buy', crypto_symbol: 'BTC', amount: 0.3, price_per_unit: 1550000, status: 'completed' },
            { user_id: users[1].id, order_type: 'sell', crypto_symbol: 'BTC', amount: 0.3, price_per_unit: 1550000, status: 'completed' },
        ];

        const orders = [];
        for (const o of ordersData) {
            const res = await axios.post(`${baseURL}/orders`, o);
            orders.push(res.data);
        }
        console.log('Orders created');

        const completedBuy = orders.find(o => o.status === 'completed' && o.order_type === 'buy');
        const completedSell = orders.find(o => o.status === 'completed' && o.order_type === 'sell');

        if (completedBuy && completedSell) {
            const matchRes = await axios.post(`${baseURL}/order-matches`, {
                buy_order_id: completedBuy.id,
                sell_order_id: completedSell.id,
                crypto_symbol: completedBuy.crypto_symbol,
                amount: Math.min(completedBuy.amount, completedSell.amount),
                price_per_unit: completedBuy.price_per_unit,
            });
            console.log('Order match created:', matchRes.data);

            const buyerWalletRes = await axios.get(`${baseURL}/wallets`, {
                params: { user_id: completedBuy.user_id, crypto_symbol: completedBuy.crypto_symbol }
            });
            const buyerWallet = buyerWalletRes.data[0];

            const sellerWalletRes = await axios.get(`${baseURL}/wallets`, {
                params: { user_id: completedSell.user_id, crypto_symbol: completedSell.crypto_symbol }
            });
            const sellerWallet = sellerWalletRes.data[0];

            if (buyerWallet && sellerWallet) {
                const cryptoTxRes = await axios.post(`${baseURL}/crypto-transactions`, {
                    wallet_id: sellerWallet.id,
                    type: 'internal',
                    crypto_symbol: completedSell.crypto_symbol,
                    amount: completedSell.amount,
                    counterparty_address: buyerWallet.address,
                    created_at: new Date(),
                });
                console.log('Crypto internal transaction created:', cryptoTxRes.data);

                const externalTxRes = await axios.post(`${baseURL}/crypto-transactions`, {
                    wallet_id: sellerWallet.id,
                    type: 'external',
                    crypto_symbol: completedSell.crypto_symbol,
                    amount: 0.1,
                    counterparty_address: 'external-wallet-address-xyz',
                    created_at: new Date(),
                });
                console.log('Crypto external transaction created:', externalTxRes.data);
            }

            const fiatAmount = completedBuy.amount * completedBuy.price_per_unit;

            await axios.post(`${baseURL}/fiat-transactions`, {
                user_id: completedBuy.user_id,
                fiat_currency: 'THB',
                amount: fiatAmount,
                type: 'withdraw',
                status: 'completed',
            });

            await axios.post(`${baseURL}/fiat-transactions`, {
                user_id: completedSell.user_id,
                fiat_currency: 'THB',
                amount: fiatAmount,
                type: 'deposit',
                status: 'completed',
            });

            console.log('Fiat transactions updated');
        } else {
            console.log('No completed buy/sell order found for matching');
        }

        console.log('Seed via HTTP requests completed successfully!');
    } catch (err) {
        console.error('Seed failed:', err.response?.data || err.message);
    }
}

seed();