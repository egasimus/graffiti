import * as React from 'react'
import { render } from 'react-dom'

const Counter = () => {
  const [count, setCount] = React.useState(0)
  const dec = () => setCount(count - 1)
  const inc = () => setCount(count + 1)

  return (
    <div style={styles.counter}>
      <h3>{count}</h3>

      <div style={{ ...styles.bar, width: count * 5 }} />

      <div style={styles.buttons}>
        <button onClick={dec}>--</button>
        <button onClick={inc}>++</button>
      </div>
    </div>
  )
}

const styles = {
  counter: {
    height: '100%',
    maxWidth: 250,
    maxHeight: 200,
    padding: 20,
    justifyContent: 'space-between'
  },

  bar: {
    backgroundColor: '#ff0000',
    height: 20
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}

render(<Counter />, document.body)
