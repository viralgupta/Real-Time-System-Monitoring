const mongoose = require('mongoose')

const { Schema } = mongoose;
const TrainingLogSchema = new Schema({
  uuid: {
    type: String,
    unique: true
  },
  model_name: {
    type: String
  },
  model_type: {
    type: String
  },
  status: {
    type: String,
    enum: ["Training", "Finished"]
  },
  start_time: {
    type: Date
  },
  end_time: {
    type: Date
  },
  total_time_taken: {
    type: Number,
  },
  epoch: [
    {
      index: {
        type: Number
      },
      start_time: {
        type: Date
      },
      end_time: {
        type: Date
      },
      total_time: {
        type: Number
      },
      data: {
        accuracy: {
          type: Number
        },
        loss: {
          type: Number
        },
        val_accuracy: {
          type: Number
        },
        val_loss: {
          type: Number
        },
      }
    }
  ],
  stats: {
    accuracy: {
      type: Number
    },
    loss: {
      type: Number
    },
    val_accuracy: {
      type: Number
    },
    val_loss: {
      type: Number
    },
  },
  logFile: {
    type: String
  }
}, {timestamps: true});


mongoose.models = {}
const TrainingLog = mongoose.model('TrainingLog', TrainingLogSchema)
module.exports = TrainingLog