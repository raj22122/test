const User = require('../models/user.model'); // Import the User model
const Transaction = require('../models/transaction.model');

const {REDIS_HOST} = require('../../config');

const redis = require('redis');
let redisPort = 6379;  // Replace with your redis port
const client = redis.createClient({
    socket: {
        port: redisPort,
        host: REDIS_HOST,
    }
});

(async () => {
    // Connect to redis server
    await client.connect();
})();

client.on('connect', () => {
    console.log('Connected!');
});

// Log any error that may occur to the console
client.on("error", (err) => {
    console.log(`Error:${err}`);
});


const createUser = async (req, res) => {

    try {
        const details = req.body;


        // Create a new user
        const newUser = new User({
            username: details.userName,
            designation: details.designation,
            age: details.age,
        });

        // Save the user to the database
        await newUser.save()
            .then((savedUser) => {
                //console.log(savedUser);
                res.status(200).json({ 'msg': savedUser });
                res.end();
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ 'msg': "Unable to save new User" });
                res.end();
            })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ 'msg': "Unable to save new User" });
        res.end();
    }

};



const getAllUser = async (req, res) => {

    try {
        const results = await client.get('allUsers');

        if (results) {
            res.status(200).json({ 'user': JSON.parse(results) })
            res.end();
        } else {
            const filter = {};
            const results = await User.find(filter);
            //console.log(results)
            // Store the fetched data in Redis with a TTL of 60 seconds (adjust as needed)
            client.setEx('allUsers', 60, JSON.stringify(results));

            // Return the data to the client
            res.status(200).json({ 'user': results });
            res.end();
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ 'msg': "Unable to save new User" });
        res.end();
    }

};

const createTransaction = async (req, res) => {

    try {
        const details = req.body;
        // Create a new Transaction
        const newTransaction = new Transaction({
            userId: details.userId,
            item: details.item,
            date: details.date,
            amount: details.amount
        });

        // Save the transaction to the database
        await newTransaction.save()
            .then((saved) => {
                //  console.log(saved);
                res.status(200).json({ 'msg': saved });
                res.end();
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ 'msg': "Unable to save new Transaction" });
                res.end();
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ 'msg': "Unable to save new Transaction" });
        res.end();
    }
};

function generateCacheKey(userId, startDate, endDate, minAmount, maxAmount, page) {
    return `${userId}_${startDate}_${endDate}_${minAmount}_${maxAmount}_${page}`;
  }

const getTransactionById = async (req, res) => {

    try {

        const pageSize = 10; // Number of items per page
        let page = req.query.page == "" ? undefined : req.query.page;     // Current page (you can adjust this)

        if (page == undefined) {
            page = 1;
        }

        // Calculate the skip value based on the page size and current page
        const skip = (page - 1) * pageSize;
        const userId = req.query.userId;
        const startDate = req.query.startDate == "" ? undefined : req.query.startDate;
        const endDate = req.query.endDate == "" ? undefined : req.query.endDate;
        const minAmount = req.query.minAmount == "" ? undefined : req.query.minAmount;
        const maxAmount = req.query.maxAmount == "" ? undefined : req.query.maxAmount;

        const cacheKey = generateCacheKey(userId, startDate, endDate, minAmount, maxAmount, page);
        // Define the filter object based on the presence of minAmount and maxAmount
        const filter = {
            userId: userId
        };

        // Add date range filters if startDate and endDate are provided
        if (startDate !== undefined && endDate !== undefined) {
            filter.date = { $gte: startDate, $lte: endDate };
        }
        // Add amount range filters if minAmount and maxAmount are provided
        if (minAmount !== undefined) {
            filter.amount = { $gte: minAmount };
        }

        if (maxAmount !== undefined) {
            filter.amount = { ...filter.amount, $lte: maxAmount };
        }


        const results = await client.get(cacheKey);
        if (results) {
            res.status(200).json({ 'user': JSON.parse(results) })
            res.end();
        }else{
            Transaction.find(filter)
            .skip(skip)
            .limit(pageSize)
            .then((user) => {
                client.setEx(cacheKey, 60, JSON.stringify(user));
                res.status(200).json({ 'user': user })
                res.end();
            })
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ 'msg': "Unable to retrieve Transactions" });
        res.end();
    }
};


module.exports = {
    createUser, createTransaction, getTransactionById, getAllUser
}
