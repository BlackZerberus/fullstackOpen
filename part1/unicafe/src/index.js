import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistics = ({good, neutral, bad, all, avg, positive}) =>  {
  if(good === 0 && neutral === 0 && bad === 0) {
    return (
      <>
        <h2>Statistics</h2>
        <p>No feedback given.</p>
      </>
    )
  }
  return (
    <>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr>
            <td><Statistic text={"good"} value={good}/></td>
          </tr>
          <tr>
            <td><Statistic text={"neutral"} value={neutral}/></td>
          </tr>
          <tr>
            <td><Statistic text={"bad"} value={bad}/></td>
          </tr>
          <tr>
            <td><Statistic text={"all"} value={all}/></td>
          </tr>
          <tr>
            <td><Statistic text={"average"} value={avg}/></td>
          </tr>
          <tr>
            <td><Statistic text={"positive"} value={positive + " %"}/></td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

const Statistic = ({text, value}) => {
  return (
    <>
      <span>{text}: {value}</span><br />
    </>
  )
}

const Button = ({clickHandler, text}) => {
  return (
    <button onClick={clickHandler}>{text}</button>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addGood = () => {
    setGood(good + 1)
  }
  const addNeutral = () => {
    setNeutral(neutral + 1)
  }

  const addBad = () => {
    setBad(bad + 1)
  }

  const all = () => good + neutral + bad
  const avg = () => (good * 1 + neutral * 0 + bad * -1) / all()
  const positive = () => (good * 100) / all()

  return (
    <div>
      <h2>give feedback</h2>
      <Button clickHandler={addGood} text={"good"}/>
      <Button clickHandler={addNeutral} text={"neutral"}/>
      <Button clickHandler={addBad} text={"bad"}/>
      <Statistics
       good={good}
       neutral={neutral}
       bad={bad}
       all={all()}
       avg={avg()}
       positive={positive()}
      />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)