import Transactions from "../Model/transactionModel.js";
import {
  checkTransactionEligibility,
  updateCapitalBalance,
} from "../Controller/capitalController.js";
import mongoose from "mongoose";

export async function addTransaction(req, res) {
  try {
    const { type, category, description, paidTo, amount } = req.body;
    const userId = req.user._doc._id
    // console.log(req.user._doc._id)
    if (type == "FUND_OUT") {
      const isValidTransaction = await checkTransactionEligibility(userId, amount);
      if (!isValidTransaction) {
        throw {
          message: "Insufficient capital balance for this transaction",
          statusCode: 400,
        };
      }
    }

    const transaction = await Transactions.create({
      userId,
      type,
      category,
      description,
      paidTo,
      amount,
    });

    await updateCapitalBalance(transaction, 0, "CREATE");

    // console.log(transaction);

    res.status(201).json({
      message: "Transaction created & Capital Balance updated successfully",
      result: transaction,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
  }
}


export async function editTransaction(req, res) {
  const updatedTransactionReq = req.body;
  //transaction update
  const updatedQuery = {};
  const updatedHistory = {};
  const transactionDetail = await Transactions.findById(
    updatedTransactionReq._id
  );
  for (const [key, value] of Object.entries(updatedTransactionReq)) {
    if (value != transactionDetail[key]) {
      updatedHistory[key] = transactionDetail[key];
      updatedQuery[key] = value;
    }
  }
  updatedHistory.updatedAt = new Date();
  updatedQuery.history = transactionDetail.history;
  updatedQuery.history.push(updatedHistory);
  updatedQuery.updatedAt = new Date();

  //capital balance update
  const balanceDifference =
    transactionDetail.type == "FUND_OUT"
      ? transactionDetail.amount - updatedTransactionReq.amount
      : updatedTransactionReq.amount - transactionDetail.amount;
  const updatedTransactionObj = await Transactions.findOneAndUpdate(
    { _id: updatedTransactionReq._id },
    updatedQuery
  ).then((transaction) =>
    updateCapitalBalance(transaction, balanceDifference, "EDIT")
  );
  res.status(201).json({
    message: "Transaction data updated successfully",
    updatedTransactionObj,
  });
}

export async function deleteTransaction(req, res) {
  const { transactionId } = req.params;
  try {
    const deletedRecord = await Transactions.findByIdAndDelete(
      transactionId
    ).then((transaction) =>
      updateCapitalBalance(
        transaction,
        transaction.type == "FUND_IN"
          ? -transaction.amount
          : transaction.amount,
        "DELETE"
      )
    );
    res.status(201).json({
      message: "Transaction data deleted successfully",
      deletedRecord,
    });
  } catch (error) {
    res
      .status(404)
      .json({ message: "No transaction found with given ID!", error });
  }
}

export async function getTransactionDetails(req, res) {
  const { transactionId } = req.params;
  try {
    const transactionDetail = await Transactions.findById(transactionId);
    res.status(201).json({
      message: "Transaction data retrieved successfully",
      transactionDetail,
    });
  } catch (error) {
    res.status(404).json({ message: "No transaction found with given ID!" });
  }
}

export async function getAllTransactions(userId) {
  try {
    const transactionDetails = await Transactions.find({ userId: userId });
    return transactionDetails;
  } catch (error) {
    return { message: "No user is found with given ID!" };
  }
}

// //.group({
//   _id: {
//     type: '$type',
//     year: '$year',
//     category: '$category'
//   },
//   totalAmount: {
//     $sum: '$amount'
//   },
//   year: {
//     $first: '$year'
//   },
//   type: {
//     $first: '$type'
//   },
//   category: {
//     $first: '$category'
//   }
// })
////

export async function getChartData(req, res) {
  const { userId } = req.query;
  const { body: filterObj } = req;
  let chartDetails;
  try {
    if (filterObj.filter === "month") {
      chartDetails = await Transactions.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $addFields: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: { type: "$type", month: "$month", category:'$category' }, // //category:'$category'
            totalAmount: { $sum: "$amount" },
            year: { $first: "$year" },
            month:{$first: "$month"},
            type: { $first: "$type" },
            category: { $first: "$category" },  //$push: "$category"  //$first: "$category"
          },
        },
        { $project: { _id: 0 } },
      ]);
      }else{
        chartDetails =  await Transactions.aggregate([
          { $match: { userId: new mongoose.Types.ObjectId(userId) } },
          {
            $addFields: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
          },
          {
            $group: {
              _id: { type: "$type", year: "$year", category:'$category' }, // //category:'$category'
              totalAmount: { $sum: "$amount" },
              year: { $first: "$year" },
              type: { $first: "$type" },
              category: { $first: "$category" },  //$push: "$category"  //$first: "$category"
            },
          },
          { $project: { _id: 0 } },
        ])
    }
    res.status(201).json({
      message: "Chart Data retrieved successfully",
      chartDetails,
    });
  } catch (error) {
    res.status(404).json({ message: "Unable to fetch data" });
  }
}
