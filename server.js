'use strict'

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json())

const axios = require('axios');
require('dotenv').config();
const pg = require('pg');
const client = new pg.Client(process.env.DBURL);
const PORT = process.env.PORT || 3005
const APIKEY = process.env.APIKEY

app.get(`/`, homeHandler)
app.get('/db-data', handleDbData)
app.get(`/category`, categoryHandler)
app.get(`/exercises`, exercisesHandler)
app.get(`/schedule`, handleScheduleData)
app.get(`/get-categories-db`, handleGetDbCategory)
app.put(`/contact/:id`, updateContactHandler)
app.put(`/update-category/:id`, updateCategoryHandler)
app.put(`/update-schedule/:id`, updateScheduleHandler)
app.post(`/contact`, handleAddUserForm)
app.post(`/add-category`, handleAddCategory)
app.post(`/schedule`, handleAddSchedule)
app.delete(`/delete/:id`, handleDeleteForm)
app.delete(`/deleteCategory/:id`, handleDeleteCategory)
app.delete(`/deleteSchedule/:id`, handleDeleteSchedule)
app.use(errorHandler)


//Functions
async function homeHandler(req, res) {
  const options = {
    method: 'GET',
    url: 'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
    headers: {
      'X-RapidAPI-Key': APIKEY,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
  };


  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.status(202).json({
      results: response.data
    })
  } catch (error) {
    console.error(error);
  }

}

async function categoryHandler(req, res) {
  const options = {
    method: 'GET',
    url: 'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
    headers: {
      'X-RapidAPI-Key': APIKEY,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
  };


  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.status(202).json({
      results: response.data
    })
  } catch (error) {
    console.error(error);
  }
}

function handleScheduleData(req, res) {
  const sql = `select * from  user_schedule`;
  client.query(sql).then(data => {
    res.json({
      count: data.rowCount,
      data: data.rows
    })
  }).catch(err => {
    errorHandler(err, req, res);
  })
}

async function exercisesHandler(req, res) {
  const options = {
    method: 'GET',
    url: 'https://exercisedb.p.rapidapi.com/exercises',
    headers: {
      'X-RapidAPI-Key': APIKEY,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
  };


  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.status(202).json({
      results: response.data
    })
  } catch (error) {
    console.error(error);
  }
}

async function updateContactHandler(req, res) {
  const id = req.params.id;
  const newData = req.body;
  const sql = `update user_contact_form set username = $1, email = $2, usermessage = $3 where id = $4 returning *`;
  const updatedValue = [newData.username, newData.email, newData.usermessage, id];
  client.query(sql, updatedValue).then(data =>
    res.status(202).json(data.rows)
  )
}

async function updateCategoryHandler(req, res) {
  const id = req.params.id;
  const newData = req.body;
  const sql = `update exercise_category set category = $1, category_url = $2, description = $3 where id = $4 returning *`;
  const updatedValue = [newData.category, newData.category_url, newData.description, id];
  client.query(sql, updatedValue).then(data =>
    res.status(202).json(data.rows)
  )
}
async function updateScheduleHandler(req, res) {
  const id = req.params.id;
  const newData = req.body;
  const sql = `update user_schedule set week_day = $1 where id = $2 returning *`;
  const updatedValue = [newData.week_day, id];
  client.query(sql, updatedValue).then(data =>
    res.status(202).json(data.rows)
  )
}

async function handleAddUserForm(req, res) {
  const userInput = req.body;
  const sql = `insert into user_contact_form(username, email, usermessage) values($1, $2, $3) returning *`;
  const handleValueFromUser = [userInput.username, userInput.email, userInput.usermessage];
  client.query(sql, handleValueFromUser).then(data => {
    res.status(201).json(data.rows)
  }).catch(err => errorHandler(err, req, res))
}
async function handleAddCategory(req, res) {
  const userInput = req.body;
  const sql = `insert into exercise_category(category, category_url,description) values($1, $2,$3) returning *`;
  const handleValueFromUser = [userInput.category, userInput.category_url, userInput.description];
  client.query(sql, handleValueFromUser).then(data => {
    res.status(201).json(data.rows)
  }).catch(err => errorHandler(err, req, res))
}
async function handleAddSchedule(req, res) {
  const userInput = req.body;
  const sql = `insert into  user_schedule(bodypart, equipment, gifUrl, exercise_name, exercise_target, week_day) values($1, $2, $3, $4, $5, $6) returning *`;
  const handleValueFromUser = [userInput.bodypart, userInput.equipment, userInput.gifUrl, userInput.exercise_name, userInput.exercise_target, userInput.week_day];
  client.query(sql, handleValueFromUser).then(data => {
    res.status(201).json(data.rows)
  }).catch(err => errorHandler(err, req, res))
}

function handleDbData(req, res) {
  const sql = `select * from user_contact_form`;
  client.query(sql).then(data => {
    res.json({
      count: data.rowCount,
      data: data.rows
    })
  }).catch(err => {
    errorHandler(err, req, res);
  })
}

function handleDeleteForm(req, res) {
  const id = req.params.id;
  const sql = `delete from user_contact_form where id = ${id}`;
  client.query(sql).then(() => {
    return res.status(204).json({
      code: 204,
      message: `Row deleted successfuly with id: ${id}`
    })
  }).catch(err => errorHandler(err, req, res))
}

function handleGetDbCategory(req, res) {
  const sql = `select * from exercise_category`;
  client.query(sql).then(data => {
    res.json({
      count: data.rowCount,
      data: data.rows
    })
  }).catch(err => {
    errorHandler(err, req, res);
  })
}

function handleDeleteCategory(req, res) {
  const id = req.params.id;
  const sql = `delete from exercise_category where id = ${id}`;
  client.query(sql).then(() => {
    return res.status(204).json({
      code: 204,
      message: `Row deleted successfuly with id: ${id}`
    })
  }).catch(err => errorHandler(err, req, res))
}
function handleDeleteSchedule(req, res) {
  const id = req.params.id;
  const sql = `delete from user_schedule where id = ${id}`;
  client.query(sql).then(() => {
    return res.status(204).json({
      code: 204,
      message: `Row deleted successfuly with id: ${id}`
    })
  }).catch(err => errorHandler(err, req, res))
}




function errorHandler(error, req, res) {
  res.status(500).json({ code: 500, message: error.message || error })
}


client.connect().
  then(con => {
    console.log(con)
    app.listen(PORT, () => console.log(`Up and running on port ${PORT}`));
  }
  )