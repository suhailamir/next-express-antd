const express = require('express')
const next = require('next')
const axios = require('axios');
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const productsApiUrl = "http://127.0.0.1:3001";
const reviewsApiUrl = "http://127.0.0.1:3002";

app.prepare()
    .then(() => {
        const server = express()
        server.use(express.json())
        server.use(bodyParser.json());
        server.get('/api/*', async (req, res) => {
            try {
                const endpoint = req.originalUrl.split('/api')[1];
                const options = {
                    method: 'GET',
                    url: (endpoint.includes("product") ? productsApiUrl : reviewsApiUrl) + endpoint,
                };
                const { data } = await axios(options);
                res.send({ data, error: false });
            } catch (e) {
                res.send({ msg: 'Something went wrong', error: true });
            }

        })
        server.post('/api/*', async (req, res) => {
            const endpoint = req.originalUrl.split('/api')[1];
            try {
                const options = {
                    method: 'POST',
                    url: (endpoint.includes("product") ? productsApiUrl : reviewsApiUrl) + endpoint,
                    data: req.body
                };
                const { data } = await axios({ ...options });
                res.send({ data, error: false });
            } catch (e) {
                res.send({ msg: 'Something went wrong', error: true });
            }

        })
        server.get('/p/:id', (req, res) => {
            const actualPage = '/product'
            const queryParams = { id: req.params.id }
            app.render(req, res, actualPage, queryParams)
        })

        server.get('*', (req, res) => {
            return handle(req, res)
        })

        server.listen(3000, (err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:3000')
        })
    })
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    })