//transaction.js
import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt:{ type: Date, default: Date.now },
  type: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  paidTo: {type: String, required: true },
  amount: { type: Number, required: true },
  history:{type:[Schema.Types.Mixed]}
});

export default model('Transactions', transactionSchema);