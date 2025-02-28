// app/api/checkFraud/route.js
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Pega os dados do corpo da requisição (no Next.js 13, usamos request.json())
    const { pharmacyWallet, medicineName, compra, ano_mes } = await request.json();

    // Calcular o primeiro e o último dia do mês anterior
    const primeiroDiaMesAnterior = dayjs(ano_mes).subtract(1, 'month').startOf('month').startOf('day').toDate();
    const ultimoDiaMesAnterior = dayjs(ano_mes).subtract(1, 'month').endOf('month').endOf('day').toDate();

    // Consultar as transações do mês anterior
    const transacoes = await prisma.salesHistory.findMany({
      where: {
        pharmacyWallet,
        medicineName,
        transactionDate: {
          gte: primeiroDiaMesAnterior,
          lte: ultimoDiaMesAnterior,
        },
      },
    });

    // Calcular a quantidade total de medicamentos vendidos no mês anterior
    const totalQuantidadeVendas = transacoes.reduce((acc, transacao) => acc + transacao.quantity, 0);

    // Chamar a API do FastAPI para prever fraude
    const respostaApi = await axios.post('http://127.0.0.1:8000/prever_fraude/', {
      compra,
      venda: totalQuantidadeVendas, // Passando a quantidade de vendas em vez de valor monetário
      farmacia: pharmacyWallet,
      medicamento: medicineName,
      ano_mes,
    });

    // Verificar se a previsão é de fraude
    if (respostaApi.data.resultado === "Fraude") {
        console.log('Fraude detectada!');
      // Criar um registro na tabela DetectedFraudes
      await prisma.detectedFraudes.create({
        data: {
          pharmacyWallet,
          medicineName,
        },
      });
    }

    // Retornar a resposta da API
    return new Response(JSON.stringify(respostaApi.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    return new Response(JSON.stringify({ message: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
