const express = require('express')

const app = express()
const port = process.env.PORT|| 8386
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use('/' , (req , res) =>  {res.send('SERVER ON')})

app.listen(port, () => {
    console.log(' Server dang chay:' + port)
})