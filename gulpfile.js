const { gulp, src, watch, parallel } = require("gulp");
const { exec } = require('child_process');

const dirs = ["./commands/*.js", "./events/*.js", "./slash_commands/*.js", "./utils/*.js", "./*js"];
let nodeProcess = null;

function runApp(done) {
  try {
    nodeProcess.kill();
    nodeProcess.on('close', (code) => {
      console.log('Node process exited with code ' + code);
      done();
    });
  } catch (e) {
    // console.log(e)
  }
  nodeProcess = exec('node .');
  attachLogs(nodeProcess);
}

function attachLogs(nodeProcess) {
  nodeProcess.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  nodeProcess.stderr.on('data', function (data) {
    console.error(data.toString());
  });

  nodeProcess.on('exit', function (code) {
    console.log('Node process exited with code ' + code);
  });
}

function dev(done) { //Nos actualiza el proyecto
  runApp();
  watch(dirs, runApp);

  done();
}

exports.dev = (dev);

