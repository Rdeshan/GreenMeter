import { Request, Response } from 'express'
import Consumption from '../models/consumption.model'
import Device, { IDevice } from '../models/Device'
import AiGenerate from '../config/gemini.config'

// Create consumption record
export const addConsumptionController = async (req: any, res: Response) => {
  try {
    // const userId = req.userId

    const { deviceId, hours, minutes } = req.body

    const device = await Device.findById<IDevice>(deviceId)
    if (!device) {
      return res
        .status(409)
        .json({ success: false, message: 'No devices found' })
    }

    const consumption = new Consumption({
      // user: userId,
      device: deviceId,
      hours,
      minutes
    })
    await consumption.save()

    const aiReqData = {
      device_name: device.device_name,
      consumption: device.consumption,
      hours,
      minutes
    }
    const responseFromAI = await AiGenerate(
      'consumption_recommendation',
      aiReqData
    )

    const recommendations = responseFromAI?.recommendations || null
    const summary = responseFromAI?.summary || ''

    if (recommendations || summary) {
      await Consumption.findByIdAndUpdate(
        consumption._id,
        {
          $set: {
            recommendations,
            summary
          }
        },
        { new: true }
      )
    }

    res.status(201).json({ success: true, data: consumption })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get all consumptions
export const getAllConsumptionsController = async (req: any, res: Response) => {
  try {
    const consumptions = await Consumption.find()
      .select('-recommendations -summary')
      .populate('device')
      .sort({ createdAt: -1 })

    res.json({ success: true, data: consumptions })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get single consumption by ID
export const getConsumptionByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params
    const consumption = await Consumption.findById(id).populate('device')

    if (!consumption) {
      return res
        .status(404)
        .json({ success: false, message: 'Record not found' })
    }

    res.json({ success: true, data: consumption })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update consumption
export const editConsumptionController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params
    const { deviceId, hours, minutes } = req.body

    const device = await Device.findById<IDevice>(deviceId)
    if (!device) {
      return res
        .status(409)
        .json({ success: false, message: 'No devices found' })
    }

    const aiReqData = {
      device_name: device.device_name,
      consumption: device.consumption,
      hours,
      minutes
    }
    const responseFromAI = await AiGenerate(
      'consumption_recommendation',
      aiReqData
    )

    const recommendations = responseFromAI?.recommendations || null
    const summary = responseFromAI?.summary || ''

    const updateData: any = {
      hours,
      minutes,
      device: deviceId
    }
    if (recommendations || summary) {
      updateData.recommendations = recommendations
      updateData.summary = summary
    }
    const consumption = await Consumption.findByIdAndUpdate(id, updateData, {
      new: true
    })

    if (!consumption) {
      return res
        .status(400)
        .json({ success: false, message: 'Device update failed' })
    }

    res.json({ success: true, data: consumption })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Delete consumption
export const deleteConsumptionController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params
    const consumption = await Consumption.findByIdAndDelete(id)

    if (!consumption) {
      return res
        .status(404)
        .json({ success: false, message: 'Record not found' })
    }

    res.json({ success: true, message: 'Record deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}
