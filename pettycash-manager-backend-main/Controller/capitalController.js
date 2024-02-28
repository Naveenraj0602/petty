import CapitalBalance from "../Model/capitalModel.js";
import { getAllTransactions } from "./transactionController.js";

export async function getBalance(req, res) {
  try {
    const { userId } = req.query;
    const capitalBalanceObj = await CapitalBalance.findOne({ userId: userId });
    const transactionDetails = await getAllTransactions(userId);

    res.status(200).json({
      message: "Data retrieved successfully!",
      capitalBalance: capitalBalanceObj.capitalBalance,
      transactions: transactionDetails
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something Went Wrong in getting the balance!", error });
  }
}

export async function newUserCapitalBalanceSetup(userId) {
  try {
    const capitalBalanceObj = await CapitalBalance.create({
      userId: userId,
      transaction: [userId],
      capitalBalance: 0,
    });
    return {
      message: "Initial Setup of Capital Balance Completed!",
      capitalBalance: capitalBalanceObj.capitalBalance,
      createdAt: capitalBalanceObj.createdAt,
    };
  } catch (error) {
    return {
      message: "Something Went Wrong at new User CapitalBalance Setup!",
      error,
    };
  }
}

export async function checkTransactionEligibility(userId, amount) {
  const capitalBalanceObj = await CapitalBalance.findOne({ userId });
  if (amount > capitalBalanceObj.capitalBalance) return false;
  else return true;
}

export async function updateCapitalBalance(transaction, balanceDifference = 0,transactionType) {
  try {
    const capitalBalanceObj = (transactionType == "DELETE")?await CapitalBalance.findOneAndUpdate(
      { userId: transaction.userId },
      {
        $set: { updatedAt: new Date() }, //latest date updation
        $pull: {
          //links the transaction id for reference
          transaction: transaction._id 
        },
        //updates the capital balance 
        $inc: {
          capitalBalance: balanceDifference,
        }, 
      },
      { new: true }
    ):(transactionType == "CREATE")? await CapitalBalance.findOneAndUpdate(
      { userId: transaction.userId },
      {
        $set: { updatedAt: new Date() }, //latest date updation
        $push: {
          //links the transaction id for reference
          transaction: {
            $each: [transaction._id],
            $position: 0, // Adds the new transaction at the beginning of the array
          },
        },
        //updates the capital balance
        //if balanceDifference is not 0, it inc/dec the difference from CB, 
        //else, proceeds with updating the capital balance based on new transaction 
        $inc: {
          capitalBalance: transaction.type === "FUND_IN"? transaction.amount: -transaction.amount,
        }, 
      },
      { new: true }
    ):await CapitalBalance.findOneAndUpdate(
      { userId: transaction.userId },
      {
        $set: { updatedAt: new Date() }, //latest date updation
        //updates the capital balance
        //if balanceDifference is not 0, it inc/dec the difference from CB, 
        //else, proceeds with updating the capital balance based on new transaction 
        $inc: {
          capitalBalance: balanceDifference
        }, 
      },
      { new: true }
    )
    return {
      message: "Capital Balance updated successfully",
      capitalBalanceObj,
    };
  } catch (error) {
    return {
      message: "Something Went Wrong in updating the Capital balance!",
      statusCode: 500,
    };
  }
}
