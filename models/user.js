module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password_hash: DataTypes.STRING,
        phone_number: DataTypes.STRING,
        created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
        }
    });
    return User;
};