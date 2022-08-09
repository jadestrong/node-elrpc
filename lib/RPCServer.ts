import { Socket } from "net";
import elparser from "elparser";
import { initLogger } from "./elrpc";
import Method from "./Method";

var QueueState = {
  GO: {
    ondrain: function () {
      this.logger.debug("QueueState.GO.ondrain");
      // do nothing
    },
    onqueue: function (msg) {
      if (!msg) return;
      this.logger.debug("QueueState.GO.onqueue : " + msg.uid);
      this.queueStream.push(msg);
      this._send();
    },
  },
  STOP: {
    ondrain: function () {
      this.logger.debug(
        "QueueState.STOP.ondrain : num=" + this.queueStream.length
      );
      this.queueState = QueueState.GO;
      this._send();
    },
    onqueue: function (msg) {
      if (!msg) return;
      this.logger.debug("QueueState.STOP.onqueue : " + msg.uid);
      this.queueStream.push(msg);
    },
  },
};

class RPCServer {
  name: string;
  socket: Socket;
  socketState = "socket_opened";
  methods: Record<string, Method> = {};

  logger = initLogger();

  session: Record<number, () => any> = {};

  receiveBuffer = Buffer.alloc(0);

  constructor(name: string, socket: Socket, methods: Method[]) {
    this.name = name;
    this.socket = socket;

    this.socket.on("data", (chunk) => {
      this._on;
    });

    if (methods) {
      methods.forEach((method) => {
        this.registerMethod(method);
      });
    }
  }

  registerMethod(method: Method) {
    this.methods[method.name] = method;
    return method;
  }

  defineMethod(name, body, argdoc, docstring) {}

  callMethod() {}
  queryMethod() {}

  stop() {}

  private onReceiveData(chunk) {
    if (chunk) {
      this.receiveBuffer = Buffer.concat([this.receiveBuffer, chunk]);
    }
    const buf = this.receiveBuffer;
    if (buf.length >= 6) {
      const str = buf.subarray(0, 6).toString();
      this.logger.debug(`<< H:${str}`);
      const len = parseInt(str, 16);
      if (isNaN(len) || len <= 0) {
        this.logger.error(`Wrong Content Length: ${str} -> ${len}`);
        this.stop();
        return;
      }
      if (len > buf.length - 6) {
        this.logger.debug(`Wait for more input ${buf.length - 6} / ${len}`);
        return; // wait for subsequent data
      }
      const content = buf.subarray(6, 6 + len).toString();
      if (this.logger.isDebugEnabled()) {
        this.logger.debug(`<< B:${content}`);
      }
      this.receiveBuffer = buf.subarray(6 + len);

      let obj;
      try {
        obj = elparser.parse1(content);
      } catch (e) {
        this.logger.warn(`Parse Error: ${e}`, e);
        return;
      }
      try {
        this.dispatchHandler(obj);
      } catch (e) {
        this.logger.warn(`Dispatch Error ${e}`, e);
        return;
      }
      this.logger.debug("Dispatch OK");
      if (this.receiveBuffer.length > 6) {
        this.logger.debug("Try to read the next buffer.");
        this.onReceiveData(null);
      } else {
        this.logger.debug("Wait for next data chunk.");
      }
    }
  }

  private dispatchHandler(msg) {
    msg = msg.toJS();
    const type = msg.shift();
    switch (type) {
      case "quit":
        this.logger.debug("Quit Message Received.");
        this.stop();
        break;
      default:
        this.logger.warn(`Unknown Message Type: ${type}`);
    }
  }

  private handlerCall(uid, name, args) {}

  private handlerReturn(uid, value) {}
  private handlerErrorReturn(uid, error) {}

  private handlerMethods(uid) {}

  private clearWaitingSessions() {}
  private queueMessage(msg) {}
  private send() {}

  /* Wait for finishing this RPCServer connection */
  wait() {}
}

export default RPCServer;
