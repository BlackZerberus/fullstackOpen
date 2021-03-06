import axios from 'axios'

const urlbase = '/api/persons' //'http://localhost:3001/api/persons'

const getAll = async () => {
    const {data} = await axios.get(urlbase)
    return data
}

const searchByName = async (name = '') => {
    const {data} = await axios.get(`${urlbase}?name=${name}`)
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
    searchByName,
    create,
    update,
    clean
}