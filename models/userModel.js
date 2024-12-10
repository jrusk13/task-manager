const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersFile = path.join(__dirname, '../data/users.json');

const getUsers = () => JSON.parse(fs.readFileSync(usersFile, 'utf-8'));

const addUser = async (username, password) => {
    const users = getUsers();
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    users.push({ username, password: hashedPassword });
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    return { username };
};

const findUser = (username) => {
    const users = getUsers();
    return users.find((user) => user.username === username);
};

module.exports = { addUser, findUser };

