import React from 'react'

const PersonForm = ({fnSubmit, nameText, fnName, numberText, fnNumber}) => {
  return (
      <>
        <form onSubmit={fnSubmit}>
          <div>
            name: <input value={nameText} onChange={fnName} />
          </div>
          <div>
              phone: <input value={numberText} onChange={fnNumber}/>
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
      </>
  )
}

export default PersonForm
