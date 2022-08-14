require('dotenv').config();
const {format,createLogger,transports} = require('winston');
const {timestamp,combine,printf,errors,json,level}=format;

const logformat = printf(({ level, message, timestamp ,stack}) => {
  console.log(`${level}`);
    return `${timestamp}  ${level}: ${stack || message}`;
  });
const logger = createLogger({
    level:process.env.level,
    format: combine(
        timestamp({format:'YYYY-DD-HH:mm:ss'}),
        errors({stack :true}),
        logformat,
        json(),
    ),
    //defaultMeta:{service :'user-service'},    
  
  transports: [
    
    new transports.Console(),
    
  ],
});
module.exports = logger;