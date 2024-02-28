## Pettypal - simplifying cash management with a smile!
Pettypal is a web-based application designed to help people (individuals / professionals - Pettycash managers) to manage their petty cash transactions. User can signup and start using this for tracking the transactions(Fund_In / Fund_Out) made, managing the capital balance & maintaining the updates of the transactions/capital balance and user!

# APIs
//auth router
router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/user/:userId", getUserInfo);

//capital router
router.get("/balance", authenticationCheck, getBalance);

//Transaction router
router.post("/transaction/new", authenticationCheck, addTransaction);
router.get("/api/transaction/get/:transactionId", authenticationCheck, getTransactionDetails);
router.put("/transaction/edit/:transactionId", authenticationCheck, editTransaction);
router.delete("/transaction/delete/:transactionId", authenticationCheck, deleteTransaction)
router.post("/transaction/getChartData", authenticationCheck, getChartData)

# Documentation
https://documenter.getpostman.com/view/20660257/2s9YkuZJgV

# Deployment
https://pettycash-manager-pettypal.onrender.com/
