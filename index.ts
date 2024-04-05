import express from 'express'
const app = express()
const port = 3000

import viagensRouter from './routes/viagens'

app.use(express.json())
app.use('/viagens', viagensRouter)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
