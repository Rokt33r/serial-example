import React, { PropTypes } from 'react'
import CSSModules from 'main/lib/CSSModules'
import styles from './Main.styl'
import serial from './lib/serial'

class Main extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      targets: [],
      currentTarget: null,
      message: '',
      stack: [],
      encoding: 'utf-8'
    }

    this.dataHandler = (payload) => this.handleData(payload)
  }

  componentDidMount () {
    this.reloadList()
    serial.on('data', this.dataHandler)
  }

  componentWillUnmount () {
    serial.off('data', this.dataHandler)
  }

  handleReloadClick (e) {
    this.reloadList()
  }

  handleData (payload) {
    let { stack } = this.state
    stack = stack.slice()
    stack.push({
      type: 'RECV',
      data: payload
    })
    this.setState({
      stack
    })
  }

  reloadList () {
    serial
      .list()
      .then((list) => {
        console.log(list)
        this.setState({
          targets: list
        })
      })
  }

  handleConnectButtonClick (e, comName) {
    console.log(comName)
    serial
      .open(comName)
    this.setState({
      currentTarget: comName
    })
  }

  handleDisconnectButtonClick (e) {
    serial
      .close()

    this.setState({
      currentTarget: null
    })
  }

  handleChange (e) {
    this.setState({
      message: this.refs.message.value
    })
  }

  handleMessageKeyDown (e) {
    switch (e.keyCode) {
      case 13:
        this.sendMessage()
        break
    }
  }

  sendMessage () {
    serial.send(this.state.message)
    let { stack } = this.state
    stack = stack.slice()
    stack.push({
      type: 'SEND',
      data: new Buffer(this.state.message)
    })

    this.setState({
      message: '',
      stack
    })
  }

  handleSendButtonClick (e) {
    this.sendMessage()
  }

  handleEncodingChange (e, value) {
    this.setState({
      encoding: value
    })
  }

  handleFlushButtonClick (e) {
    this.setState({
      stack: []
    })
  }

  renderData (data, encoding) {
    let result = Array.prototype.map.call(data, (char, index) => {
      switch (char) {
        case 3:
          return <span key={index} style={{color: 'blue'}}>ETX</span>
        case 2:
          return <span key={index} style={{color: 'blue'}}>STX</span>
        case 6:
          return <span key={index} style={{color: 'green'}}>ACK</span>
        case 21:
          return <span key={index} style={{color: 'red'}}>NAK</span>
      }
      return String.fromCharCode(char)
    })
    return result
  }

  render () {
    let targetList = this.state.targets
      .map((target) => {
        return <div
          key={target.comName}
        >
          {target.comName}
          <button
            onClick={(e) => this.handleConnectButtonClick(e, target.comName)}
          >Connect</button>
        </div>
      })
    let stackList = this.state.stack
      .map((line, index) => {
        return <div
          key={index}
        >
          {line.type === 'SEND'
            ? 'SENT >> '
            : 'RECEIVED << '
          }
          {this.state.encoding === 'utf-8'
            ? this.renderData(line.data)
            : line.data.toString('hex')
          }
        </div>
      })
    return (
      <div>
        <div>
          List
          <button
            onClick={(e) => this.handleReloadClick(e)}
          >Reload</button>
        </div>
        <div>
        {targetList}
        </div>

        <div>
          <div>
            Current status :&nbsp;
            {this.state.currentTarget == null
              ? 'Not connected'
              : this.state.currentTarget
            }
            {this.state.currentTarget != null &&
              <button
                onClick={(e) => this.handleDisconnectButtonClick(e)}
              >Disconnect</button>
            }
          </div>
          <div>
            <input
              ref='message'
              value={this.state.message}
              onChange={(e) => this.handleChange(e)}
              onKeyDown={(e) => this.handleMessageKeyDown(e)}
            />
            <button
              onClick={(e) => this.handleSendButtonClick(e)}
            >Send</button>

          </div>
          <div>
            <label>
              <input type='radio'
                checked={this.state.encoding === 'utf-8'}
                onChange={(e) => this.handleEncodingChange(e, 'utf-8')}
              />
              UTF-8
            </label>
            <label>
              <input type='radio'
                checked={this.state.encoding === 'hex'}
                onChange={(e) => this.handleEncodingChange(e, 'hex')}
              />
              HEX
            </label>

            <button
              onClick={(e) => this.handleFlushButtonClick(e)}
            >Flush</button>
          </div>
          <div>
            {stackList}
          </div>
        </div>
      </div>
    )
  }
}

Main.propTypes = {
}

export default CSSModules(Main, styles)
