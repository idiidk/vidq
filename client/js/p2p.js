const path = require("path");
const fs = require("fs");
const http = require("http");
const io = require("socket.io");
const ioClient = require("socket.io-client");
const uuidv1 = require("uuid/v1");

class Node {
  constructor(ip, socket) {
    this.ip = ip;
    this.socket = socket;
  }

  ask(id, callback) {
    const messageId = uuidv1();
    this.socket.emit(id, { uuid: messageId });
    this.socket.on(messageId, callback);
  }

  serialize() {
    let serialized = this;
    serialized.socket = null;
    return JSON.stringify(serialized);
  }
}

class P2P {
  constructor() {
    this.nodes = [];
    this.connectedNodes = [];
    this.connectedIps = [];
    this.ready = false;
  }

  loadNodes(callback) {
    const self = this;
    fs.readFile(
      path.join(__dirname, "../../nodes.json"),
      "utf8",
      (err, data) => {
        try {
          let nodes = JSON.parse(data);

          for (let i = 0; i < nodes.length; i++) {
            nodes[i].socket = null;
            self.nodes.push(nodes[i]);
          }
        } catch (e) {
          throw new Error(e);
        }

        if (typeof callback === "function") {
          callback();
        }
      }
    );
  }

  ask(id, callback) {
    for (let i = 0; i < this.connectedNodes.length; i++) {
      let node = this.connectedNodes[i];
      node.ask(id, callback);
    }
  }

  connect(callback) {
    let alreadyDone = false;
    let connectedCount = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      let client = ioClient(node.ip);
      client.on("connect", () => {
        connectedCount++;
        this.connectedNodes.push(new Node(node.ip, client));
        this.connectedIps.push(node.ip);
        if (connectedCount === this.nodes.length) {
          if (!alreadyDone) {
            alreadyDone = true;
            callback(connectedCount);
          }
        }
      });
    }

    setTimeout(() => {
      if (!alreadyDone) {
        alreadyDone = true;
        callback(connectedCount);
      }
    }, 10000);
  }

  askForNodes() {
    for (let i = 0; i < this.connectedNodes.length; i++) {
      let node = this.connectedNodes[i];

      node.ask("nodes", ip => {
        if (!this.connectedIps.includes(ip)) {
          console.log(`NEW IP ${ip}`)
          let client = ioClient(ip);
          client.on("connect", () => {
            connectedCount++;
            this.connectedNodes.push(new Node(node.ip, client));
            this.connectedIps.push(node.ip);
          });
        }
      });
    }
  }

  setupIO() {
    if (this.io) {
      this.io.on("connection", socket => {
        socket.on("videos", data => {
          for (let i = 0; i < 20; i++) {
            socket.emit(data.uuid, {
              title: "anus",
              description: "the best video eve",
              thumbnail: "https://source.unsplash.com/random/600x600",
              date: new Date()
            });
          }
        });

        socket.on("nodes", data => {
          for (let i = 0; i < this.connectedIps.length; i++) {
            socket.emit(data.uuid, this.connectedIps[i]);
          }
        });
      });
    } else {
      throw new Error("No socketio instance found!");
    }
  }

  server(port, callback) {
    this.server = http.Server();
    this.io = io(this.server);
    this.setupIO();
    this.server.listen(port, () => {
      if (typeof callback === "function") {
        callback();
      }
    });
  }
}

module.exports = new P2P();
