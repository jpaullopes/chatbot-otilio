# ChatBot Assistant

Um chatbot inteligente desenvolvido com Flask e Google Generative AI (Gemini), que permite conversas naturais e análise de imagens.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Python Version](https://img.shields.io/badge/python-3.11-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Tabela de Conteúdo
- [Recursos](#recursos)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
  - [Instalação via pip](#instalação-via-pip)
  - [Instalação via Docker](#instalação-via-docker)
- [Configuração da API Google](#configuração-da-api-google)
- [Configuração do Arquivo .env](#configuração-do-arquivo-env)
- [Uso](#uso)
  - [Execução Local](#execução-local)
- [Execução com Docker](#execução-com-docker)
  - [Método 1: Docker Compose (Recomendado)](#método-1-docker-compose-recomendado)
  - [Método 2: Docker Build Manual](#método-2-docker-build-manual)
  - [Logs do Docker](#logs-do-docker)
- [Funcionalidades](#funcionalidades)
- [Solução de Problemas](#solução-de-problemas)
- [Dependências](#dependências)
- [Licença](#licença)

## Recursos

- Chat em tempo real com IA
- Suporte a upload e análise de imagens
- Interface web responsiva

## Tecnologias Utilizadas

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript
- **IA**: Google Generative AI (Gemini)
- **Processamento de Imagem**: Pillow (PIL)
- **Estilização**: CSS customizado com design system

## Pré-requisitos

- Python 3.8 ou superior
- Conta no Google AI Studio
- Chave da API do Google Generative AI

## Instalação

1. Clone ou baixe o projeto:
```bash
git clone https://github.com/jpaullopes/chatbot-otilio.git
cd chatbot-otilio
```

### Instalação via pip

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

### Instalação via Docker

```bash
# Constrói automaticamente com docker-compose
docker-compose up --build
```

## Configuração da API Google

### Passo 1: Obter a Chave da API

1. Acesse o [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Selecione um projeto existente ou crie um novo
5. Copie a chave gerada

### Passo 2: Configurar o Modelo

O projeto está configurado para usar o modelo `gemini-1.5-flash`. Se você tiver acesso a outros modelos, pode alterar no arquivo `app.py`:

```python
model = genai.GenerativeModel('gemini-1.5-flash')
```

## Configuração do Arquivo .env

Para que o projeto funcione corretamente, é necessário configurar o arquivo `.env` na raiz do projeto. Siga os passos abaixo:

1. Crie um arquivo chamado `.env` na raiz do projeto, caso ele não exista.
2. Adicione a seguinte variável ao arquivo:
   ```env
   GOOGLE_API_KEY="SUA-CHAVE-AQUI"
   ```
   - Substitua `SUA-CHAVE-AQUI` pela chave da API obtida no Google AI Studio.
3. Salve o arquivo e reinicie a aplicação para aplicar as mudanças.

## Uso

### Execução Local

```bash
python app.py
```

A aplicação estará disponível em: `http://localhost:5001`

## Execução com Docker

### Método 1: Docker Compose 

1. Certifique-se de ter o arquivo `.env` configurado
2. Execute o comando:
```bash
docker-compose up -d
```

3. Acesse a aplicação em: `http://localhost:5001`

4. Para parar:
```bash
docker-compose down
```

### Método 2: Docker Build Manual

1. Construa a imagem:
```bash
docker build -t chatbot-otilio .
```

2. Execute o container:
```bash
docker run -d \
  --name chatbot-otilio \
  -p 5001:5001 \
  --env-file .env \
  chatbot-otilio
```

3. Para parar:
```bash
docker stop chatbot-otilio
docker rm chatbot-otilio
```

### Logs do Docker

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs do container específico
docker logs chatbot-otilio
```

## Funcionalidades

### Chat de Texto
- Digite qualquer pergunta ou comando
- Pressione Enter ou clique no botão de envio
- Veja a resposta em tempo real

### Análise de Imagem
- Clique no ícone de anexo para selecionar uma imagem
- Formatos suportados: PNG, JPG, JPEG, GIF
- Receba análise detalhada da IA

### Histórico
- Todas as conversas ficam visíveis na tela
- Histórico mantido durante a sessão

## Solução de Problemas

### Erro: "API Key não encontrada"
- Verifique se o arquivo `.env` existe
- Confirme se a variável está correta: `GOOGLE_API_KEY="SUA-CHAVE-AQUI"`
- Reinicie a aplicação após criar/modificar o `.env`

### Erro: "Modelo não encontrado"
- Verifique se sua API Key tem acesso ao modelo especificado
- Tente alterar para outro modelo disponível
- Consulte a documentação do Google AI para modelos disponíveis

### Erro de Conexão
- Confirme se a porta 5001 está disponível
- Teste localmente: `http://localhost:5001`

### Problemas de Upload de Imagem
- Verifique se a imagem está em formato suportado (PNG, JPG, JPEG, GIF)
- Tente com uma imagem menor

## Dependências

```
flask>=2.3.0
python-dotenv>=1.0.0
google-generativeai>=0.3.0
pillow>=9.0.0
gunicorn>=21.0.0
```

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

