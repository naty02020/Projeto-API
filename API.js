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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});