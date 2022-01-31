import React from 'react'

const Filter = ({value, fnChange}) => {
  return (
    <div>
        filter shown with: <input value={value} onChange={fnChange} />
    </div>
  )
}

export default Filter
