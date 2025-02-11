const { connectMongoDB } = require('./mongo_db');

connectMongoDB();

require('./message');
