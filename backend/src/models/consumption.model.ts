// models/consumption.model.js
import mongoose from 'mongoose'

const consumptionSchema = new mongoose.Schema(
  {
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true
    // },
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
    },
    recommendations: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    summary: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

const Consumption = mongoose.model('Consumption', consumptionSchema)

export default Consumption
