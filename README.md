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
- [Uso](#uso)
  - [Execução Local](#execução-local)
  - [Acesso via Rede Local](#acesso-via-rede-local)
  - [Configuração de Firewall](#configuração-de-firewall)
- [Execução com Docker](#execução-com-docker)
  - [Método 1: Docker Compose (Recomendado)](#método-1-docker-compose-recomendado)
  - [Método 2: Docker Build Manual](#método-2-docker-build-manual)
  - [Logs do Docker](#logs-do-docker)
- [Funcionalidades](#funcionalidades)
- [Solução de Problemas](#solução-de-problemas)
- [Dependências](#dependências)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Recursos

- Chat em tempo real com IA
- Suporte a upload e análise de imagens
- **Prévia de imagem antes do envio** - Visualize a imagem selecionada antes de enviar
- Interface web moderna e responsiva
- Histórico de conversas durante a sessão
- Acesso via rede local
- Design otimizado para desktop e mobile
- Funcionalidade de copiar respostas com um clique

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
git clone https://github.com/seu-usuario/chatbot-assistant.git
cd chatbot-assistant
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

O projeto está configurado para usar o modelo `gemma-3-12b-it`. Se você tiver acesso a outros modelos, pode alterar no arquivo `app.py`:

```python
model = genai.GenerativeModel('gemma-3-12b-it')
```

## Uso

### Execução Local

```bash
python app.py
```

A aplicação estará disponível em: `http://localhost:5001`

### Acesso via Rede Local

Para permitir acesso de outros dispositivos na mesma rede:

1. O servidor já está configurado para aceitar conexões externas (`host='0.0.0.0'`)
2. Descubra seu IP local:
```bash
# Linux/Mac
hostname -I
# ou
ip addr show | grep inet
```
3. Acesse de outros dispositivos: `http://SEU_IP:5001`

### Configuração de Firewall

```bash
# Ubuntu/Debian
sudo ufw allow 5001

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=5001/tcp
sudo firewall-cmd --reload
```

## Execução com Docker

### Método 1: Docker Compose (Recomendado)

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
docker build -t chatbot-assistant .
```

2. Execute o container:
```bash
docker run -d \
  --name chatbot-assistant \
  -p 5001:5001 \
  --env-file .env \
  chatbot-assistant
```

3. Para parar:
```bash
docker stop chatbot-assistant
docker rm chatbot-assistant
```

### Logs do Docker

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs do container específico
docker logs chatbot-assistant
```

## Funcionalidades

### Chat de Texto
- Digite qualquer pergunta ou comando
- Pressione Enter ou clique no botão de envio
- Veja a resposta em tempo real

### Análise de Imagem
- Clique no ícone de anexo para selecionar uma imagem
- **Visualização da prévia**: A imagem aparecerá em uma prévia logo após a seleção
- **Remoção fácil**: Clique no botão "X" na prévia para remover a imagem
- Formatos suportados: PNG, JPG, JPEG, GIF
- Tamanho máximo: 10MB
- Adicione uma pergunta sobre a imagem (opcional)
- Receba análise detalhada da IA

### Histórico
- Todas as conversas ficam visíveis na tela
- Imagens enviadas são exibidas no histórico
- Clique em qualquer resposta para copiar o texto
- Histórico mantido durante a sessão

## Solução de Problemas

### Erro: "API Key não encontrada"
- Verifique se o arquivo `.env` existe
- Confirme se a variável está correta: `GOOGLE_API_KEY=sua_chave`
- Reinicie a aplicação após criar/modificar o `.env`

### Erro: "Modelo não encontrado"
- Verifique se sua API Key tem acesso ao modelo especificado
- Tente alterar para outro modelo disponível
- Consulte a documentação do Google AI para modelos disponíveis

### Erro de Conexão
- Confirme se a porta 5001 está disponível
- Verifique configurações de firewall
- Teste primeiro localmente: `http://localhost:5001`

### Problemas de Upload de Imagem
- Verifique se a imagem está em formato suportado (PNG, JPG, JPEG, GIF)
- Confirme o tamanho do arquivo (limite: 10MB)
- Tente com uma imagem menor
- Se a prévia não aparecer, recarregue a página e tente novamente
- Certifique-se de que o JavaScript está habilitado no navegador

## Dependências

```
flask>=2.3.0
python-dotenv>=1.0.0
google-generativeai>=0.3.0
pillow>=9.0.0
gunicorn>=21.0.0
```

## Contribuindo

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature ou correção: `git checkout -b minha-feature`.
3. Faça commit das suas alterações: `git commit -m 'Adiciona minha feature'`.
4. Envie para o repositório remoto: `git push origin minha-feature`.
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

