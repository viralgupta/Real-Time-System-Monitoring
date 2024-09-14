import uuid
import time
import requests
import platform
import subprocess
import tensorflow as tf

class WatchDawg:
    def __init__(self, url = "http://localhost:5000", log_interval = None, logFile = None):
        self.url = url
        self.logFile = logFile
        self.train_uuid = uuid.uuid4()

        platform_system = platform.system();
        os_type = "linux" if platform_system == "Linux" else "win" if platform_system == "Windows" else None
        if(os_type == None):
            print("Unable to start metric logging service due to unsupported platform!")
        else:
            args = [];
            if(os_type == "linux"):
                args.append("./index-linux")
            else:
                args.append("./index-win.exe")
            if (url != "http://localhost:5000"):
                args.append(f"--SERVER_API={url}")
            if (log_interval):
                args.append(f"--LOG_INTERVAL={log_interval}")

            args.append(f"--TRAIN_UUID={self.train_uuid}")
            self.system_logging_process = subprocess.Popen(args);

    def initlizeModel(self, model):
        model_name = model.name;
        model_type = model.__class__.__name__;
        
        self.callBackend("/initializeModel", {
            "model_name": model_name,
            "model_type": model_type,
            "model_uuid": str(self.train_uuid)
        })

    def callBackend(self, path="", data={}):
        response = requests.post(f"{self.url}/api/postdata/training{path}", json=data)
        return response.json()

    class TFSequentialCallback(tf.keras.callbacks.Callback):
        def __init__(self, WatchDawgInstance):
            super(WatchDawg.TFSequentialCallback, self).__init__()
            self.train_begin = 0
            self.epoch_begin = {}
            self.callBackend = WatchDawgInstance.callBackend
            self.train_uuid = str(WatchDawgInstance.train_uuid);
            self.log_file = WatchDawgInstance.logFile;
            self.system_logging_process = WatchDawgInstance.system_logging_process;

        def on_train_begin(self, logs=None):
            self.train_begin = time.time()
            self.callBackend("/train_begin", {
                "start_time": int(self.train_begin * 1000),
                "model_uuid": self.train_uuid
            })

        def on_epoch_begin(self, epoch, logs=None):
            self.epoch_begin[epoch] = time.time()
            self.callBackend("/epoch_begin", {
                "epoch_index": epoch,
                "start_time": int(self.epoch_begin[epoch] * 1000),
                "model_uuid": self.train_uuid
            })

        def on_epoch_end(self, epoch, logs=None):
            total_epoch_time = round(time.time() - self.epoch_begin[epoch], 2)
            self.callBackend("/epoch_end", {
                "epoch_index": epoch,
                "end_time": int(time.time() * 1000),
                "total_time": int(total_epoch_time * 1000),
                "model_uuid": self.train_uuid,
                "data": logs
            })

        def on_train_end(self, logs=None):
            total_train_time = time.time() - self.train_begin;
            log_file = None;
            
            if(self.log_file):
                try:
                    with open(self.log_file, "r") as file:
                        log_file = file.read();
                except FileNotFoundError:
                    print("The file does not exist.")
                except IOError:
                    print("An error occurred while reading the log file.")
            
            self.callBackend("/train_end", {
                "end_time": int(time.time() * 1000),
                "total_time": int(total_train_time * 1000),
                "model_uuid": self.train_uuid,
                "log_file": log_file,
                "data": logs,
            })

            if(self.system_logging_process):
                self.system_logging_process.terminate()
                self.system_logging_process.wait()

