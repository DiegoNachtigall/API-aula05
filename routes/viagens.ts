import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
    const viagens = await prisma.viagem.findMany()
    res.status(200).json(viagens)
})

router.post('/', async (req, res) => {
    const { destino, transporte, preco, duracao } = req.body

    if (!destino || !transporte || !preco || !duracao) {
        res.status(400).send({ 'erro': 'Faltam campos obrigatórios' })
        return
    }

    const viagem = await prisma.viagem.create({
        data: {
            destino,
            transporte,
            preco,
            duracao
        }
    })
    res.status(201).json(viagem)
})

router.put('/preco/:id', async (req, res) => {
    const { id } = req.params
    const { preco } = req.body

    const viagem = await prisma.viagem.update({
        where: {
            id: Number(id)
        },
        data: { preco }
    })
    res.status(200).json(viagem)
})

router.put('/duracao/:id', async (req, res) => {
    const { id } = req.params
    const { duracao } = req.body

    const viagem = await prisma.viagem.update({
        where: {
            id: Number(id)
        },
        data: { duracao }
    })
    res.status(200).json(viagem)
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    await prisma.viagem.delete({
        where: {
            id: Number(id)
        }
    })
    res.status(204).send("Viagem deletada com sucesso!")
})

router.get('/transporte/:transporte', async (req, res) => {
    const { transporte } = req.params

    const viagem = await prisma.viagem.findMany({
        where: {
            transporte: String(transporte)
        }
    })
    if (viagem.length === 0) {
        res.status(404).send("Viagem não encontrada")
        return
    }
    res.status(200).json(viagem)
})

router.get('/preco/:preco', async (req, res) => {
    const { preco } = req.params

    const viagem = await prisma.viagem.findMany({
        where: {
            preco: {
                gte: Number(preco)
            }
        }
    })
    if (viagem.length === 0) {
        res.status(404).send("Viagem não encontrada")
        return
    } else {
        res.status(200).json(viagem)
        return
    }
})

router.get('/alfabetica', async (req, res) => {
    const viagem = await prisma.viagem.findMany({
        orderBy: {
            destino: 'asc'
        },
        select: {
            destino: true,
            preco: true,
            duracao: true
        }
    })
    res.status(200).json(viagem)
})

router.get('/precomedio', async (req, res) => {
    const viagem = await prisma.viagem.aggregate({
        _avg: {
            preco: true
        }
    })

    res.status(200).json(viagem)
})

router.get('/duracaomedia', async (req, res) => {
    const viagem = await prisma.viagem.aggregate({
        _avg: {
            duracao: true
        }
    })

    res.status(200).json(viagem)
})

export default router