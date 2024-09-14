const express = require('express');
const connectDB = require('./utils/db.js')
const dotenv = require('dotenv')
var cors = require('cors')
const { Server } = require('socket.io')
const asyncHandler = require('express-async-handler')
const SystemLog = require('./models/SystemLog')
const TrainingLog = require('./models/TrainingLog')

dotenv.config()

const app = express();


app.use(cors());
app.use(express.json());
connectDB();


const expressServer = app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

const io = new Server(expressServer, {
  pingTimeout: 60000,
  cors: true
})


let localData = [];

app.use("/api/postdata/server", asyncHandler(async (req, res) => {
  if (req.body.metrics.system) {
    await SystemLog.create({
      train_uuid: req.body.train_uuid,
      system: {
        model: req.body.metrics.system.model,
        version: req.body.metrics.system.version,
        uuid: req.body.metrics.system.uuid
      },
      cpu: {
        manufacturer: req.body.metrics.cpu.manufacturer,
        brand: req.body.metrics.cpu.brand,
        speed: req.body.metrics.cpu.speed,
        cores: req.body.metrics.cpu.cores,
        physicalCores: req.body.metrics.cpu.physicalCores,
        performanceCores: req.body.metrics.cpu.performanceCores,
        processors: req.body.metrics.cpu.processors,
      },
      os: {
        platform: req.body.metrics.os.platform,
        distro: req.body.metrics.os.distro,
        arch: req.body.metrics.os.arch,
      },
      Logs: [
        {
          time: new Date(req.body.metrics.time.current),
          memory: {
            total: req.body.metrics.memory.total,
            active: req.body.metrics.memory.active,
            available: req.body.metrics.memory.available
          },
          gpu: req.body.metrics.gpu.map(gpu => ({
            vendor: gpu.vendor,
            model: gpu.model,
            memoryTotal: gpu.memoryTotal,
            memoryFree: gpu.memoryFree,
            temperatureGpu: gpu.temperatureGpu,
            powerDraw: gpu.powerDraw
          })),
          fs: req.body.metrics.fs.map(fs => ({
            fs: fs.fs,
            type: fs.type,
            size: fs.size,
            available: fs.available,
            rw: fs.rw
          })),
          fsStats: {
            rx: req.body.metrics.fsStats ? req.body.metrics.fsStats.rx ?? 0 : 0,
            wx: req.body.metrics.fsStats ? req.body.metrics.fsStats.wx ?? 0 : 0
          }
        }
      ]
    })
  } else {
    localData.push(req.body.metrics)
    io.in(req.body.train_uuid).emit(JSON.stringify(req.body.metrics))
    if (localData.length == 3) {
      const old_log = await SystemLog.findOne({
        train_uuid: req.body.train_uuid
      });
      if (old_log) {
        const new_logs = localData.map(log => ({
          time: new Date(log.time.current),
          memory: {
            total: log.memory.total,
            active: log.memory.active,
            available: log.memory.available
          },
          gpu: log.gpu.map(gpu => ({
            vendor: gpu.vendor,
            model: gpu.model,
            memoryTotal: gpu.memoryTotal,
            memoryFree: gpu.memoryFree,
            temperatureGpu: gpu.temperatureGpu,
            powerDraw: gpu.powerDraw
          })),
          fs: log.fs.map(fs => ({
            fs: fs.fs,
            type: fs.type,
            size: fs.size,
            available: fs.available,
            rw: fs.rw
          })),
          fsStats: {
            rx: log.fsStats ? log.fsStats.rx ?? 0 : 0,
            wx: log.fsStats ? log.fsStats.wx ?? 0 : 0,
          }
        }));

        // Update the existing log with the new logs
        old_log.Logs.push(...new_logs);
        await old_log.save();

        // Clear localData after saving
        localData = [];
      }
    }
  }
  res.json({ success: true })
}))

app.post("/api/postdata/training/initializeModel", asyncHandler(async (req, res) => {
  const body = req.body;

  await TrainingLog.create({
    uuid: body.model_uuid,
    model_name: body.model_name,
    model_type: body.model_type
  })

  res.json({success: true})
}))

app.post("/api/postdata/training/train_begin", asyncHandler(async (req, res) => {
  await TrainingLog.findOneAndUpdate({
    uuid: req.body.model_uuid
  }, {
    start_time: req.body.start_time
  })

  io.in(req.body.model_uuid).emit("refresh");
  res.json({success:true})  
}))

app.post("/api/postdata/training/epoch_begin", asyncHandler(async (req, res) => {
  try {
    const { epoch_index, start_time, model_uuid } = req.body;

    const oldLog = await TrainingLog.findOne({ uuid: model_uuid });

    if (!oldLog) {
      return res.status(404).json({ error: 'Training log not found' });
    }

    oldLog.epoch[epoch_index] = {
      index: epoch_index,
      start_time: new Date(start_time),
      end_time: null,
      total_time: null,
      data: {
        accuracy: null,
        loss: null,
        val_accuracy: null,
        val_loss: null
      }
    }

    await oldLog.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}));

app.post("/api/postdata/training/epoch_end", asyncHandler(async (req, res) => {
  try {
    const { epoch_index, end_time, total_time, model_uuid, data } = req.body;

    const oldLog = await TrainingLog.findOne({ uuid: model_uuid });

    if (!oldLog) {
      return res.status(404).json({ error: 'Training log not found' });
    }

    const epoch = oldLog.epoch[epoch_index];

    epoch.end_time = new Date(end_time);  // Convert timestamp to Date
    epoch.total_time = total_time;
    epoch.data = {
      accuracy: data.accuracy,
      loss: data.loss,
      val_accuracy: data.val_accuracy,
      val_loss: data.val_loss
    };

    await oldLog.save();

    io.in(model_uuid).emit("refresh");

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}))

app.post("/api/postdata/training/train_end", asyncHandler(async (req, res) => {
  try {
    const { end_time, total_time, model_uuid, log_file, data } = req.body;

    const oldLog = await TrainingLog.findOne({ uuid: model_uuid });

    if (!oldLog) {
      return res.status(404).json({ error: 'Training log not found' });
    }

    oldLog.end_time = new Date(end_time);  
    oldLog.total_time_taken = total_time;
    oldLog.logFile = log_file;
    oldLog.status = "Finished"; 

    oldLog.stats = {
      accuracy: data.accuracy,
      loss: data.loss,
      val_accuracy: data.val_accuracy,
      val_loss: data.val_loss
    };

    await oldLog.save();

    io.in(model_uuid).emit("refresh");

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}));

io.on("connection", (socket) => {
  socket.on('setup', () => {
    socket.emit("connected");
  });
  socket.on("setupclose", () => {
    socket.emit("disconnected")
  })
  socket.on("join game", (room) => {
    socket.join(room)
  })
  socket.on("leave game", (room) => {
    socket.leave(room)
  })
  eventEmitter.on('sendLog', (room, message) => {
    socket.to(room).emit('new_log', message);
  });
})
