//Required framework/dependencies installation
import { config } from 'dotenv';
import { connect } from 'mongoose';

//dotenv config() to use the process environment variables declared via process.env.<<var_name>>.
config();
const CLOUD_MONGO_URL = process.env.MONGODB_URI



const DbClient = async () => {
    try {
      await connect(CLOUD_MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  };

  export default DbClient;