import React, { useState } from 'react'
import ReactDOM from 'react-dom'

// anecdote display component
const AnecdoteDisplay = ({anecdotes, selected, votes, clickVote, getAnecdote}) => {
  // Button 'vote' props
  const propsButtonV = {fnClick: clickVote, text: "vote"}
  // Button 'next anecdote props
  const propsButtonNA = {fnClick: getAnecdote, text: "next anecdote"}
  return (
    <>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}<br />
      has {votes[selected]} votes.<br />
      <Button {...propsButtonV} />
      <Button {...propsButtonNA} />
    </>
  )
}

// Button component
const Button = ({fnClick, text}) => {
  return (
    <button onClick={fnClick}>{text}</button>
  )
}

// Most voted display component
const MostVotedDisplay = ({anecdotes, mostVoted, votes}) => {
  if (mostVoted === -1) {
    return (
      <>
        <h2>Anecdote with most votes</h2>
        {"There are no info yet."}
      </>
    )
  }
  return (
    <>
      <h2>Anecdote with most votes</h2>
      {anecdotes[mostVoted]} <br /> has {votes[mostVoted]} votes.
    </>
  )
}

// App component
const App = ({anecdotes}) => {
  // useState hooks
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(6).fill(0))
  const [mostVoted, setMostVoted] = useState(-1)
  
  //get random integer number between 0 and number - 1
  const randomInt = (number) => Math.floor(Math.random() * number)
  // store in the selected state a random int number
  const getAnecdote = () => {
    setSelected(randomInt(anecdotes.length))
  }
  // update the amount of votes in the votes state
  const clickVote = () => {
    const updateVotes = [...votes]
    updateVotes[selected]++
    setVotes([...updateVotes])
    checkVotes(updateVotes)
  }
  //updates the most voted state
  const checkVotes = (values) => {
    const maxVote = Math.max(...values)
    setMostVoted(values.findIndex(element => element === maxVote))
  }

  //AnecdoteDisplay props
  const propsAnecdoteDisplay = {anecdotes, selected, votes, clickVote, getAnecdote}
  //MostVotedDisplay props
  const propsMostVotedDisplay = {anecdotes, mostVoted, votes}

  return (
    <div>
      <AnecdoteDisplay {...propsAnecdoteDisplay} />
      <MostVotedDisplay {...propsMostVotedDisplay} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)