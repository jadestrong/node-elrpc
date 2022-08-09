import Method from "./Method";
import symbol from "./symbol";

class CallMessage {
    uid: number;
    method: Method;
    args: string[];

    constructor() {

    }

    toJSON() {
        return [symbol('call'), this.uid, this.method, this.args];
    }
}

export default CallMessage;
