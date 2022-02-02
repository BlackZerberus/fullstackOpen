import axios from 'axios'

const urlbase = 'http://localhost:3001/persons'

const getAll = async () => {
    const {data} = await axios.get(urlbase)
    return data
}

const create = async (person) => {
    const {data} = await axios.post(urlbase, person)
    return data
}

const update = async (id, person) => {
    const {data} = await axios.put(`${urlbase}/${id}`, person)
    return data
}

const clean = async (id) => {
    const {data} = await axios.delete(`${urlbase}/${id}`)
    return data
}

/* eslint-disable */
export default {
    getAll,
    create,
    update,
    clean
}