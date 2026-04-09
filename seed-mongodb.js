/**
 * Script de Seeding - Gera dados de teste no MongoDB
 * 
 * Uso:
 *   npm install mongoose
 *   node seed-mongodb.js
 * 
 * Variáveis de ambiente necessárias:
 *   MONGODB_URI = Connection string do MongoDB Atlas
 *   ou defina diretamente no arquivo
 */

const mongoose = require('mongoose');

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

// Connection String - Substitua com sua URI do MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'MONGODB_URI:mongodb+srv://smartstock:smartD%40stock@smartstock.erkrji7.mongodb.net/?appName=smartstock';

// Modelos Mongoose
const usuarioSchema = new mongoose.Schema({
  nomeColaborador: String,
  email: { type: String, unique: true, sparse: true },
  cpf: String,
  senha: String,
  ativo: { type: Boolean, default: true },
  funcao: String,
  dataCriacao: { type: Date, default: Date.now }
}, { collection: 'usuarios' });

const produtoSchema = new mongoose.Schema({
  nomeProduto: String,
  descricao: String,
  preco: Number,
  categoria: String,
  fornecedorId: mongoose.Schema.Types.ObjectId,
  estoque: Number,
  sku: { type: String, unique: true, sparse: true },
  ativo: { type: Boolean, default: true },
  dataCriacao: { type: Date, default: Date.now }
}, { collection: 'produtos' });

const fornecedorSchema = new mongoose.Schema({
  nomeFornecedor: String,
  email: String,
  telefone: String,
  endereco: String,
  cidade: String,
  estado: String,
  cnpj: { type: String, unique: true, sparse: true },
  ativo: { type: Boolean, default: true },
  dataCriacao: { type: Date, default: Date.now }
}, { collection: 'fornecedores' });

const mercadoSchema = new mongoose.Schema({
  nomeMercado: String,
  localizacao: String,
  endereco: String,
  telefone: String,
  email: String,
  ativo: { type: Boolean, default: true },
  dataCriacao: { type: Date, default: Date.now }
}, { collection: 'mercados' });

// Criar modelos
const Usuario = mongoose.model('Usuario', usuarioSchema);
const Produto = mongoose.model('Produto', produtoSchema);
const Fornecedor = mongoose.model('Fornecedor', fornecedorSchema);
const Mercado = mongoose.model('Mercado', mercadoSchema);

// ============================================================================
// DADOS DE TESTE
// ============================================================================

const usuariosTest = [
  {
    nomeColaborador: 'João Silva',
    email: 'joao@example.com',
    cpf: '12345678901',
    senha: 'senha123', // Em produção, use bcrypt!
    funcao: 'Gerente',
    ativo: true
  },
  {
    nomeColaborador: 'Maria Santos',
    email: 'maria@example.com',
    cpf: '98765432101',
    senha: 'senha123',
    funcao: 'Vendedor',
    ativo: true
  },
  {
    nomeColaborador: 'Pedro Costa',
    email: 'pedro@example.com',
    cpf: '55555555501',
    senha: 'senha123',
    funcao: 'Estoquista',
    ativo: true
  },
  {
    nomeColaborador: 'Ana Oliveira',
    email: 'ana@example.com',
    cpf: '44444444401',
    senha: 'senha123',
    funcao: 'Gerente de Operacoes',
    ativo: true
  }
];

const fornecedoresTest = [
  {
    nomeFornecedor: 'Distribuidora XYZ Ltda',
    email: 'contato@xyz.com',
    telefone: '1133334444',
    endereco: 'Rua A, 100',
    cidade: 'Sao Paulo',
    estado: 'SP',
    cnpj: '12345678000100',
    ativo: true
  },
  {
    nomeFornecedor: 'Importadora Brasil',
    email: 'vendas@brasil.com',
    telefone: '1144445555',
    endereco: 'Avenida B, 200',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    cnpj: '98765432000100',
    ativo: true
  },
  {
    nomeFornecedor: 'Fabrica Nacional',
    email: 'fabrica@nacional.com',
    telefone: '1155556666',
    endereco: 'Rua C, 300',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    cnpj: '55555555000100',
    ativo: true
  },
  {
    nomeFornecedor: 'Produtos Premium',
    email: 'premium@produtos.com',
    telefone: '1166667777',
    endereco: 'Rua D, 400',
    cidade: 'Salvador',
    estado: 'BA',
    cnpj: '44444444000100',
    ativo: true
  }
];

const mercadosTest = [
  {
    nomeMercado: 'Mercado Central',
    localizacao: 'Centro',
    endereco: 'Rua Principal, 500',
    telefone: '1177778888',
    email: 'central@mercado.com',
    ativo: true
  },
  {
    nomeMercado: 'Supermarket 24h',
    localizacao: 'Vila Mariana',
    endereco: 'Avenida Paulista, 1000',
    telefone: '1188889999',
    email: 'vila@supermarket.com',
    ativo: true
  },
  {
    nomeMercado: 'Loja do Bairro',
    localizacao: 'Pinheiros',
    endereco: 'Rua dos Pinheiros, 1500',
    telefone: '1199990000',
    email: 'bairro@loja.com',
    ativo: true
  }
];

// ============================================================================
// FUNÇÕES DE SEEDING
// ============================================================================

async function limparBancoDados() {
  console.log('🗑️  Limpando banco de dados...');
  try {
    await Usuario.deleteMany({});
    await Produto.deleteMany({});
    await Fornecedor.deleteMany({});
    await Mercado.deleteMany({});
    console.log('✓ Banco de dados limpo com sucesso');
  } catch (erro) {
    console.error('✗ Erro ao limpar banco:', erro.message);
    throw erro;
  }
}

async function inserirFornecedores() {
  console.log('📦 Inserindo fornecedores...');
  try {
    const fornecedores = await Fornecedor.insertMany(fornecedoresTest);
    console.log(`✓ ${fornecedores.length} fornecedores inseridos`);
    return fornecedores;
  } catch (erro) {
    console.error('✗ Erro ao inserir fornecedores:', erro.message);
    throw erro;
  }
}

async function inserirProdutos(fornecedores) {
  console.log('🛍️  Inserindo produtos...');
  
  const produtos = [
    {
      nomeProduto: 'Arroz Integral 5kg',
      descricao: 'Arroz integral de qualidade premium',
      preco: 28.50,
      categoria: 'Alimentos',
      fornecedorId: fornecedores[0]._id,
      estoque: 150,
      sku: 'ARROZ-INT-5KG',
      ativo: true
    },
    {
      nomeProduto: 'Feijao Carioca 1kg',
      descricao: 'Feijao carioca selecionado',
      preco: 8.90,
      categoria: 'Alimentos',
      fornecedorId: fornecedores[0]._id,
      estoque: 300,
      sku: 'FEIJAO-CAR-1KG',
      ativo: true
    },
    {
      nomeProduto: 'Oleo de Soja 900ml',
      descricao: 'Oleo de soja refinado',
      preco: 6.50,
      categoria: 'Alimentos',
      fornecedorId: fornecedores[1]._id,
      estoque: 200,
      sku: 'OLEO-SOJ-900ML',
      ativo: true
    },
    {
      nomeProduto: 'Leite Integral 1L',
      descricao: 'Leite integral pasteurizado',
      preco: 5.20,
      categoria: 'Lacteos',
      fornecedorId: fornecedores[1]._id,
      estoque: 500,
      sku: 'LEITE-INT-1L',
      ativo: true
    },
    {
      nomeProduto: 'Queijo Meia Cura 500g',
      descricao: 'Queijo meia cura artesanal',
      preco: 32.00,
      categoria: 'Lacteos',
      fornecedorId: fornecedores[2]._id,
      estoque: 80,
      sku: 'QUEIJO-MC-500G',
      ativo: true
    },
    {
      nomeProduto: 'Pao Frances 1kg',
      descricao: 'Pao frances fresco diariamente',
      preco: 12.00,
      categoria: 'Panaderia',
      fornecedorId: fornecedores[2]._id,
      estoque: 400,
      sku: 'PAO-FRA-1KG',
      ativo: true
    },
    {
      nomeProduto: 'Frango Congelado 1kg',
      descricao: 'Peito de frango congelado',
      preco: 18.50,
      categoria: 'Carnes',
      fornecedorId: fornecedores[3]._id,
      estoque: 250,
      sku: 'FRANGO-1KG',
      ativo: true
    },
    {
      nomeProduto: 'Cafe em Graos 500g',
      descricao: 'Cafe arabica 100% puro',
      preco: 22.90,
      categoria: 'Bebidas',
      fornecedorId: fornecedores[3]._id,
      estoque: 120,
      sku: 'CAFE-GRAOS-500G',
      ativo: true
    }
  ];

  try {
    const produtosInseridos = await Produto.insertMany(produtos);
    console.log(`✓ ${produtosInseridos.length} produtos inseridos`);
    return produtosInseridos;
  } catch (erro) {
    console.error('✗ Erro ao inserir produtos:', erro.message);
    throw erro;
  }
}

async function inserirUsuarios() {
  console.log('👤 Inserindo usuarios...');
  try {
    const usuarios = await Usuario.insertMany(usuariosTest);
    console.log(`✓ ${usuarios.length} usuarios inseridos`);
    return usuarios;
  } catch (erro) {
    console.error('✗ Erro ao inserir usuarios:', erro.message);
    throw erro;
  }
}

async function inserirMercados() {
  console.log('🏪 Inserindo mercados...');
  try {
    const mercados = await Mercado.insertMany(mercadosTest);
    console.log(`✓ ${mercados.length} mercados inseridos`);
    return mercados;
  } catch (erro) {
    console.error('✗ Erro ao inserir mercados:', erro.message);
    throw erro;
  }
}

// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================

async function seed() {
  try {
    console.log('\n🔄 Iniciando seeding do banco de dados...\n');
    console.log(`📍 MongoDB URI: ${MONGODB_URI.replace(/:[^@]+@/, ':****@')}\n`);

    // Conectar ao MongoDB
    console.log('🔗 Conectando ao MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✓ Conectado com sucesso\n');

    // Limpar e popular dados
    await limparBancoDados();
    console.log();
    
    const fornecedores = await inserirFornecedores();
    console.log();
    
    await inserirProdutos(fornecedores);
    console.log();
    
    await inserirUsuarios();
    console.log();
    
    await inserirMercados();
    console.log();

    // Exibir resumo
    console.log('✅ Seeding concluído com sucesso!\n');
    console.log('📊 Resumo dos dados inseridos:');
    const totalFornecedores = await Fornecedor.countDocuments();
    const totalProdutos = await Produto.countDocuments();
    const totalUsuarios = await Usuario.countDocuments();
    const totalMercados = await Mercado.countDocuments();
    
    console.log(`   - Fornecedores: ${totalFornecedores}`);
    console.log(`   - Produtos: ${totalProdutos}`);
    console.log(`   - Usuarios: ${totalUsuarios}`);
    console.log(`   - Mercados: ${totalMercados}`);
    console.log();

  } catch (erro) {
    console.error('❌ Erro durante o seeding:', erro.message);
    process.exit(1);
  } finally {
    // Desconectar
    await mongoose.connection.close();
    console.log('🔌 Desconectado do MongoDB\n');
  }
}

// Executar
seed();
