import log4js, { Logger } from "log4js";

let _defaultLogger: Logger | null = null;

export const initLogger = () => {
  if (_defaultLogger) return _defaultLogger;
  // const appender = {
  // 	type: 'console',
  // 	layout: {
  // 		type: "pattern",
  // 		pattern: "%5p | %m"
  // 	},
  // 	category: "log"
  // };
  // log4js.configure({appenders: [appender]});
  log4js.configure({
    appenders: {
      cheese: { type: "file", filename: "cheese.log" },
    },
    categories: { default: { appenders: ["cheese"], level: "error" } },
  });
  const logger = log4js.getLogger("log");
  logger.level = "debug";
  // logger.setLevel("DEBUG"); // debug level
  // logger.setLevel("WARN");

  _defaultLogger = logger;

  return logger;
};
