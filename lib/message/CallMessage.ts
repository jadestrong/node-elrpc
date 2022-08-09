import { Deferred } from "../Deferred";
import Message from "./Message";
import Method from '../Method';
import symbol from "../symbol";

class CallMessage extends Message {
  method: Method;
  args: string[];
  deferred: Deferred<any>;

  constructor(uid: number, method: Method, args, deferred: Deferred<any>) {
    super(uid);
    this.method = method;
    this.args = args;
    this.deferred = deferred;
  }

  toJSON() {
    return [symbol("call"), this.uid, this.method, this.args];
  }
}

export default CallMessage;
