import { ChildProcess, spawn } from "child_process";
import { initLogger } from "./elrpc";

class PeerProcess {
    cmd: string[];
    status = 'not_started';
    constructor(cmd: string[]) {
        this.cmd = cmd;
    }

    start() {
        this.status = 'start_pre';
        const cmd = this.cmd[0];
        const args = this.cmd.slice(1);
        const logger = initLogger();
        logger.debug('Process CMD: ', this.cmd.join(''));
        return new Promise((resolve, reject) => {
            let port: number | null = null;
            const process = spawn(cmd, args);
            this.status = 'start_spawned';
            process.stdout.on('data', (data) => {
                if (!port) {
                    try {
                        port = parseInt(data.toString(), 10);
                        if (isNaN(port)) {
                            logger.error('Wrong port number: ', data);
                            port = null;
                            return;
                        }
                        this.status = 'start_port_receive';
                        resolve(port);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    logger.debug(`PEER: ${data.toString()}`);
                }
            });

            process.stderr.on('data', (data) => {
                this.status = 'start_error';
                logger.warn(data.toString());
            });
        }).then(_port => {
            return startClient(_port).then((client) => {
                this.client = client;
                client.addCloseHook(() => {

                });
            });
        });
    }

    registerMethod(method) {
    }

    defineMethod(name, body, argdoc, docstring) {  }

    callMethod() {}

    queryMethod() {}

    stop() {}
}
