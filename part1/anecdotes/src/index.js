import React, { useState } from 'react'
import ReactDOM from 'react-dom'

// anecdote display component
const AnecdoteDisplay = ({anecdotes, selected, votes, fnVote, fnAnecdote}) => {
  return (
    <>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}<br />
      has {votes[selected]} votes.<br />
      <Button
       fnClick={fnVote}
       text={"vote"}
      />
      <Button
       fnClick={fnAnecdote}
       text={"next anecdote"}
      />
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
      {anecdotes[mostVoted]} has {votes[mostVoted]} votes.
    </>
  )
}

const App = ({anecdotes}) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(6).fill(0))
  const [mostVoted, setMostVoted] = useState(-1)
  
  const randomInt = (number) => Math.floor(Math.random() * number)
  const getAnecdote = () => {
    setSelected(randomInt(anecdotes.length))
  }
  const clickVote = () => {
    const updateVotes = [...votes]
    updateVotes[selected]++
    setVotes([...updateVotes])
    checkVotes(updateVotes)
  }
  const checkVotes = (values) => {
    const maxVote = Math.max(...values)
    setMostVoted(values.findIndex(element => element === maxVote))
  }

  return (
    <div>
      <AnecdoteDisplay
       anecdotes={anecdotes}
       selected={selected}
       votes={votes}
       fnVote={clickVote}
       fnAnecdote={getAnecdote}
      />
      <MostVotedDisplay
        anecdotes={anecdotes}
        mostVoted={mostVoted}
        votes={votes}
      />
      {/* <h2>Anecdote with most votes</h2>
      {anecdotes[mostVoted]} has {votes[mostVoted]} votes. */}
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