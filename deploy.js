var cmd = require('node-cmd');
var path, node_ssh, ssh, fs;
fs = require('fs');
path = require('path');
node_ssh = require('node-ssh');
ssh = new node_ssh();

// the method that starts the deployment process
function main() {
  console.log('Deployment started.');
  sshConnect();
}

// installs PM2
function installPM2() {
  return ssh.execCommand(
    'sudo npm install pm2 -g', {
      cwd: '/home/ubuntu'
  });
}

// transfers local project to the remote server
function transferProjectToRemote(failed, successful) {
  return ssh.putDirectory(
    '../hackathon-starter',
    '/home/ubuntu/starter-node-angular-temp',
    {
      recursive: true,
      concurrency: 1,
      validate: function(itemPath) {
        const baseName = path.basename(itemPath);
        return (
          baseName.substr(0, 1) !== '.' && baseName !== 'node_modules' // do not allow dot files
        ); // do not allow node_modules
      },
      tick: function(localPath, remotePath, error) {
        if (error) {
          failed.push(localPath);
          console.log('failed.push: ' + localPath);
        } else {
          successful.push(localPath);
          console.log('successful.push: ' + localPath);
        }
      }
    }
  );
}

// creates a temporary folder on the remote server
function createRemoteTempFolder() {
  return ssh.execCommand(
    'rm -rf starter-node-angular-temp && mkdir starter-node-angular-temp', {
      cwd: '/home/ubuntu'
  });
}

// stops mongodb and node services on the remote server
function stopRemoteServices() {
  return ssh.execCommand(
    'pm2 stop all && sudo service mongod stop', {
      cwd: '/home/ubuntu'
  });
}

// updates the project source on the server
function updateRemoteApp() {
  return ssh.execCommand(
    'mkdir starter-node-angular && cp -r starter-node-angular starter-node-angular-temp/* starter-node-angular/ && rm -rf starter-node-angular-temp', {
      cwd: '/home/ubuntu'
  });
}

// restart mongodb and node services on the remote server
function restartRemoteServices() {
  return ssh.execCommand(
    'cd starter-node-angular && sudo service mongod start && pm2 start app.js', {
      cwd: '/home/ubuntu'
  });
}

// connect to the remote server
function sshConnect() {
  console.log('Connecting to the server...');

  ssh
    .connect({
      // TODO: ADD YOUR IP ADDRESS BELOW (e.g. '12.34.5.67')
      host: '34.228.143.133',
      username: 'ubuntu',
      privateKey: 'sn-key.pem'
    })
    .then(function() {
      console.log('SSH Connection established.');
      console.log('Installing PM2...');
      return installPM2();
    })
    .then(function() {
      console.log('Creating `starter-node-angular-temp` folder.');
      return createRemoteTempFolder();
    })
    .then(function(result) {
      const failed = [];
      const successful = [];
      if (result.stdout) {
        console.log('STDOUT: ' + result.stdout);
      }
      if (result.stderr) {
        console.log('STDERR: ' + result.stderr);
        return Promise.reject(result.stderr);
      }
      console.log('Transferring files to remote server...');
      return transferProjectToRemote(failed, successful);
    })
    .then(function(status) {
      if (status) {
        console.log('Stopping remote services.');
        return stopRemoteServices();
      } else {
        return Promise.reject(failed.join(', '));
      }
    })
    .then(function(status) {
      if (status) {
        console.log('Updating remote app.');
        return updateRemoteApp();
      } else {
        return Promise.reject(failed.join(', '));
      }
    })
    .then(function(status) {
      if (status) {
        console.log('Restarting remote services...');
        return restartRemoteServices();
      } else {
        return Promise.reject(failed.join(', '));
      }
    })
    .then(function() {
      console.log('DEPLOYMENT COMPLETE!');
      process.exit(0);
    })
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
}

main();
