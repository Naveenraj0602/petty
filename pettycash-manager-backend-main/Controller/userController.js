import User from '../Model/userModel.js';
import { genSalt, hash, compare } from 'bcrypt';
import { config } from 'dotenv';
import jwt  from 'jsonwebtoken';
import {newUserCapitalBalanceSetup} from "./capitalController.js"

config();

export async function signup(req, res) {
    try {
      const { userName, emailId, password } = req.body;
      const existingUser = await User.findOne({ emailId });
      if (existingUser) {
        return res.status(409).json({ message: 'User with this emailId already exists.' });
      }
  
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
  
      const user = new User({
        userName,
        emailId,
        password: hashedPassword 
      });

      await user.save();
      const capitalBalanceAccount = await newUserCapitalBalanceSetup(user._id);
      res.status(201).json({ message: "User registered successfully. Please Login", user, capitalBalanceAccount});
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong while signing up!', error });
    }
  }

  export async function login(req, res) {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }
        
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
        }
        
        const responseToken = jwt.sign({ ...user }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        delete user._doc.password;
        let tokenIssuedAt = Date.now();
        let tokenExpirationAt = new Date(tokenIssuedAt);
        tokenExpirationAt.setHours(tokenExpirationAt.getHours() + 24);

        res.status(200).json({ 
            message: 'User Successfully Authenticated!',
            user: { ...user._doc },
            accessToken: responseToken,
            iat: tokenIssuedAt,
            exp: tokenExpirationAt.getTime(), // Add token expiration time in milliseconds
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Something went wrong while logging in.' });
    }
}


  export async function   getUserInfo(req,res) {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        res.status(200).json({ user });
      } catch (error) {
        res.status(404).json({ message: 'User not found!' });
      }
  }

  export async function getAllUsers(req, res) {
    try {
      // Query all users from the database
      const users = await User.find();
      
      // Check if there are no users found
      if (!users || users.length === 0) {
        return res.status(404).json({ message: 'No users found!' });
      }
      
      // If users are found, send them in the response
      res.status(200).json({ users });
    } catch (error) {
      // If an error occurs, handle it and send an error response
      console.error('Error while fetching all users:', error);
      res.status(500).json({ message: 'Something went wrong while fetching all users!', error });
    }
  }
  