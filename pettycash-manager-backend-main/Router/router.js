//Router Configuration
import { Router } from "express";
const router = Router();
//importing the middlewares and controllers -> To route the request to the correct controller function with middleware as configured.
import authenticationCheck from "../Middleware/middleware.js";
import { signup, login, getUserInfo,getAllUsers } from "../Controller/userController.js";
import { getBalance } from "../Controller/capitalController.js";
import { addTransaction, editTransaction, deleteTransaction, getTransactionDetails, getChartData } from "../Controller/transactionController.js";

//router.get("/",authenticationCheck);

//auth router
router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/user/:userId", getUserInfo);
router.get("/users/all",getAllUsers);

//capital router
router.get("/balance", authenticationCheck, getBalance);

//Transaction router
router.post("/transaction/new", authenticationCheck, addTransaction);
router.get("/transaction/get/:transactionId", authenticationCheck, getTransactionDetails);
router.put("/transaction/edit/:transactionId", authenticationCheck, editTransaction);
router.delete("/transaction/delete/:transactionId", authenticationCheck, deleteTransaction)
router.post("/transaction/getChartData", authenticationCheck, getChartData);

export default router;
