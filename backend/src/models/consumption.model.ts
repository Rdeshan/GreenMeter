// models/consumption.model.js
import mongoose from 'mongoose'

const consumptionSchema = new mongoose.Schema(
  {
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true
    },
    hours: {
      type: Number,
      required: true,
      default: 0
    },
    minutes: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

const Consumption = mongoose.model('Consumption', consumptionSchema)

export default Consumption
