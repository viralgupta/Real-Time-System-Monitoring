const mongoose = require('mongoose')

const { Schema } = mongoose;
const SystemLogSchema = new Schema({
  train_uuid: {
    type: String
  },
  system: {
    uuid: {
      type: String,
    },
    version: {
      type: String
    },
    model: {
      type: String
    },
  },
  cpu: {
    manufacturer: {
      type: String
    },
    brand: {
      type: String
    },
    cores: {
      type: Number
    },
    physicalCores: {
      type: Number
    },
    performanceCores: {
      type: Number
    },
    processors: {
      type: Number
    },
  },
  os: {
    platform: {
      type: String
    },
    distro: {
      type: String
    },
    arch: {
      type: String
    }
  },
  Logs: [
    {
      time: {
        current: {
          type: Date
        }
      },
      memory: {
        total: {
          type: Number
        },
        active: {
          type: Number
        },
        available: {
          type: Number
        },
      },
      gpu: [{
        vendor: {
          type: String
        },
        model: {
          type: String
        },
        memoryTotal: {
          type: Number
        },
        memoryFree: {
          type: Number
        },
        temperatureGpu: {
          type: Number
        },
        powerDraw: {
          type: Number
        },
      }],
      fs: [
        {
          fs: {
            type: String
          },
          type: {
            type: String
          },
          size: {
            type: Number
          },
          available: {
            type: Number
          },
          rw: {
            type: Boolean
          },
        }
      ],
      fsStats: {
        rx: {
          type: Number
        },
        wx: {
          type: Number
        }
      }
    }
  ]
}, { timestamps: true });








mongoose.models = {}
const SystemLog = mongoose.model('SystemLog', SystemLogSchema)
module.exports = SystemLog