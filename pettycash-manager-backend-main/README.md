## Pettycash manager - simplifying cash management with a smile!
Pettycash manager is a web-based application designed to help people (individuals / professionals - Pettycash managers) to manage their petty cash transactions. User can signup and start using this for tracking the transactions(Fund_In / Fund_Out) made, managing the capital balance & maintaining the updates of the transactions/capital balance and user!

# APIs
//auth router
router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/user/:userId", getUserInfo);
router.get("/users/all",getAllUsers);

//capital router
router.get("/balance", authenticationCheck, getBalance);

//Transaction router
router.post("/transaction/new", authenticationCheck, addTransaction);
router.get("/api/transaction/get/:transactionId", authenticationCheck, getTransactionDetails);
router.put("/transaction/edit/:transactionId", authenticationCheck, editTransaction);
router.delete("/transaction/delete/:transactionId", authenticationCheck, deleteTransaction)
router.post("/transaction/getChartData", authenticationCheck, getChartData)



# Deployment
https://petty-6j9h.onrender.com/
