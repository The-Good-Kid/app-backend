import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(80);
  // do something when app is closing
  process.on('exit', exitHandler.bind(null, { cleanup : true }));
  
  // catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, { exit : true, skipNotify : true }));
  
  // catches uncaught exceptions
  process.on('uncaughtException', exitHandler.bind(null, { exit : true }));
  
  // catches unhandled rejections. Arguments (err, promise)
  process.on('unhandledRejection', exitHandler.bind(null, { exit : true }));
}
function exitHandler(options:any, err:any) {
  try {
    if (arguments[0].exit && !arguments[0].skipNotify) {
      console.log('Uncaught exception and rejection', {
        err : err,
        stackTrace : err.stack || err
      });
    }
    const Error = JSON.stringify(err || { error : 'NotFound' });
    console.log('**************EXIT HANDLER REACHED********************');
    console.log(Error);
    console.log('Goodbye! , removed the cron job');
  } catch (err) {
    console.log('Error in logging the exit condition => ', JSON.stringify(err));
  } finally {
    process.exit(0);
  }
}

bootstrap();
