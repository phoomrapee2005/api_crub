const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

const connection = mysql.createConnection(process.env.DATABASE_URL)

app.get('/', (req, res) => {
    res.send('Hello world!!')
})

// READ all cars
app.get('/cars', (req, res) => {
    connection.query(
        'SELECT * FROM cars',
        function (err, results, fields) {
            if (err) {
                console.error('Error in GET /cars:', err)
                res.status(500).send('Error getting cars')
            } else {
                res.send(results)
            }
        }
    )
})

// READ car by id
app.get('/cars/:id', (req, res) => {
    const id = req.params.id

    connection.query(
        'SELECT * FROM cars WHERE id = ?',
        [id],
        function (err, results, fields) {
            if (err) {
                console.error('Error in GET /cars/:id:', err)
                res.status(500).send('Error getting car')
            } else {
                res.send(results)
            }
        }
    )
})

// CREATE car
app.post('/cars', (req, res) => {
    connection.query(
        'INSERT INTO `cars` (`name`, `detail`, `coverimage`, `price`, `brand`) VALUES (?, ?, ?, ?, ?)',
        [
            req.body.name,
            req.body.detail,
            req.body.coverimage,
            req.body.price,
            req.body.brand
        ],
        function (err, results, fields) {
            if (err) {
                console.error('Error in POST /cars:', err)
                res.status(500).send('Error adding car')
            } else {
                res.status(200).send(results)
            }
        }
    )
})

// UPDATE car
app.put('/cars', (req, res) => {
    connection.query(
        'UPDATE `cars` SET `name`=?, `detail`=?, `coverimage`=?, `price`=?, `brand`=? WHERE id = ?',
        [
            req.body.name,
            req.body.detail,
            req.body.coverimage,
            req.body.price,
            req.body.brand,
            req.body.id
        ],
        function (err, results, fields) {
            if (err) {
                console.error('Error in PUT /cars:', err)
                res.status(500).send('Error updating car')
            } else {
                res.send(results)
            }
        }
    )
})

// DELETE car
app.delete('/cars', (req, res) => {
    connection.query(
        'DELETE FROM `cars` WHERE id = ?',
        [req.body.id],
        function (err, results, fields) {
            if (err) {
                console.error('Error in DELETE /cars:', err)
                res.status(500).send('Error deleting car')
            } else {
                res.send(results)
            }
        }
    )
})

app.listen(process.env.PORT || 3000, () => {
    console.log('CORS-enabled web server listening on port 3000')
})

// export the app for vercel serverless functions
module.exports = app