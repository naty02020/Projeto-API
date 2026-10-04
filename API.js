import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

const clientes = [
  { id: 1, nome: 'Maria' },
  { id: 2, nome: 'João' }
];

const profissionais = [
  { id: 1, nome: 'Amanda' },
  { id: 2, nome: 'Joaquim' }
];

const servicos = [
  { id: 1, nome: 'Corte de cabelo', valor: 40 },
  { id: 2, nome: 'Manicure', valor: 35 }
];

const agendamentos = [
  {
    id: 1,
    clienteId: 1,
    profissionalId: 1,
    servicoId: 1,
    dataHora: '2026-10-10T14:00:00'
  }
];

function autenticar(req, res, next) {
  console.log('Autenticado com sucesso');
  next();
}

function registrarLog(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}

function validarAgendamento(req, res, next) {
  const {
    clienteId,
    profissionalId,
    servicoId,
    dataHora
  } = req.body;

  if (!clienteId || !profissionalId || !servicoId || !dataHora) {
    return res.status(400).json({
      erro: 'Todos os campos são obrigatórios.'
    });
  }

  next();
}

app.get('/', (req, res) => {
  res.send('API de Agendamento de Serviços');
});

app.get('/clientes', (req, res) => {
  res.json(clientes);
});

app.get('/profissionais', (req, res) => {
  res.json(profissionais);
});

app.get('/servicos', (req, res) => {
  res.json(servicos);
});

app.get('/agendamentos', (req, res) => {
  res.json(agendamentos);
});

app.get('/horarios/:profissionalId', (req, res) => {
  const profissionalId = parseInt(req.params.profissionalId);

  const horarios = agendamentos.filter(
    a => a.profissionalId == profissionalId
  );

  res.json(horarios);
});

app.post(
  '/agendamentos',
  [autenticar, validarAgendamento, registrarLog],
  (req, res) => {
    const {
      clienteId,
      profissionalId,
      servicoId,
      dataHora
    } = req.body;

    const conflito = agendamentos.find(a =>
      a.profissionalId == profissionalId &&
      a.dataHora == dataHora
    );

    if (conflito) {
      return res.status(400).json({
        erro: 'Esse horário já está ocupado.'
      });
    }

    const novoAgendamento = {
      id: agendamentos.length + 1,
      clienteId,
      profissionalId,
      servicoId,
      dataHora
    };

    agendamentos.push(novoAgendamento);

    res.status(201).json(novoAgendamento);
  }
);

app.put('/agendamentos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const agendamento = agendamentos.find(a => a.id == id);

  if (!agendamento) {
    return res.status(404).json({
      erro: 'Agendamento não encontrado.'
    });
  }

  const conflito = agendamentos.find(a =>
    a.profissionalId == req.body.profissionalId &&
    a.dataHora == req.body.dataHora &&
    a.id != id
  );

  if (conflito) {
    return res.status(400).json({
      erro: 'Horário indisponível.'
    });
  }

  agendamento.profissionalId = req.body.profissionalId;
  agendamento.servicoId = req.body.servicoId;
  agendamento.dataHora = req.body.dataHora;

  res.json(agendamento);
});

app.delete('/agendamentos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const indice = agendamentos.findIndex(a => a.id == id);

  if (indice == -1) {
    return res.status(404).json({
      erro: 'Agendamento não encontrado.'
    });
  }

  const dataAgendamento = new Date(
    agendamentos[indice].dataHora
  );

  const agora = new Date();

  const diferencaHoras =
    (dataAgendamento - agora) / (1000 * 60 * 60);

  if (diferencaHoras < 24) {
    return res.status(400).json({
      erro: 'Cancelamento permitido apenas com 24 horas de antecedência.'
    });
  }

  agendamentos.splice(indice, 1);

  res.json({
    mensagem: 'Agendamento cancelado com sucesso.'
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});