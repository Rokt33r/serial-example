var SerialPort = require('serialport')

var port = null
var dataBinds = []
const defaultOption = {
  baudRate: 9600
}

function open (target, options) {
  port = new SerialPort(target, options = defaultOption)
  port.on('open', function () {
    port.write('main screen turn on', function (err) {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
    })
  })

  // open errors will be emitted as an error event
  port.on('error', function (err) {
    console.log('Error: ', err.message)
  })

  port.on('data', function (data) {
    dataBinds.forEach((bind) => {
      bind(data)
    })
  })
  port.on('close', function () {
    console.log('byebye')
  })
}

function close () {
  if (port != null) {
    port.close()
    port = null
  }
}

function send (payload) {
  if (port != null) {
    port.write(payload, function (err) {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
    })
  }
}

function list () {
  return new Promise(function (resolve, reject) {
    SerialPort.list(function (err, ports) {
      if (err) return reject(err)
      return resolve(ports)
    })
  })
}

function on (event, cb) {
  switch (event) {
    case 'data':
      dataBinds.push(cb)
  }
}

function off (event, cb) {
  switch (event) {
    case 'data':
      dataBinds.filter((bind) => bind !== cb)
  }
}

module.exports = {
  open,
  close,
  send,
  list,
  on,
  off
}
