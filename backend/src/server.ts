import express, { response, request } from 'express';
import routes from './routes'
import path from 'path'
import cors from 'cors'

const app = express();

// Necessário para acessar parametros no corpo da requisição
app.use(express.json()) 

// Controle de rotas da aplicação
app.use(routes);

// Controle de quais aplicações podem acessar o back-end (apenas web)
app.use(cors())

// Diretório de arquivos do back-end
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))



app.listen(3333);