# Importações necessárias para o funcionamento do chatbot
import os
import io
import base64
import json
from datetime import datetime
from flask import Flask, request, jsonify, render_template, url_for
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")


# Configura a API do Google Generative AI
genai.configure(api_key=api_key)

# Model de IA a ser utilizado
model = genai.GenerativeModel('gemini-1.5-flash') 

app = Flask(__name__)


# Função para criar o prompt principal do assistente
def get_master_prompt(user_prompt):
    return f"""
Você é um assistente virtual amigável e inteligente. Responda de forma clara, útil e conversacional.
Usuário: {user_prompt}

Assistente:"""

# Rota principal - renderiza a página inicial do chatbot
@app.route('/')
def index():
    return render_template('index.html')

# Rota para processar mensagens do chat (aceita texto e imagens)
@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Extrai dados da requisição JSON
        data = request.get_json()
        user_prompt = data.get('prompt', '')
        image_data_b64 = data.get('image')

        print(f"Recebido - Prompt: '{user_prompt}', Imagem: {'Sim' if image_data_b64 else 'Não'}")

        # Valida se pelo menos um tipo de entrada foi fornecido
        if not user_prompt and not image_data_b64:
            return jsonify({'error': 'Nenhum prompt ou imagem fornecido'}), 400

        # Prepara o prompt principal para o modelo
        master_prompt = get_master_prompt(user_prompt)
        
        # Lista que irá conter o conteúdo a ser enviado para o modelo
        contents = []
        
        # Processa imagem se fornecida
        if image_data_b64:
            try:
                # Remove o prefixo data:image se presente
                if ',' in image_data_b64:
                    image_data_b64 = image_data_b64.split(',')[1]
                
                # Decodifica e processa a imagem
                image_data_bytes = base64.b64decode(image_data_b64)
                img = Image.open(io.BytesIO(image_data_bytes))
                contents.append(img)
                print(f"Imagem processada com sucesso. Tamanho: {img.size}")
            except Exception as e:
                print(f"Erro ao processar imagem: {e}")
                return jsonify({'error': f'Erro ao processar imagem: {str(e)}'}), 400
        
        # Adiciona o prompt de texto ao conteúdo
        contents.append(master_prompt)

        print(f"Enviando para o modelo: {len(contents)} items")
        response = model.generate_content(contents)
        print(f"Resposta recebida do modelo")
        
        # Retorna a resposta do modelo com timestamp
        return jsonify({
            'response': response.text,
            'timestamp': str(datetime.now())
        })

    except Exception as e:
        # Tratamento de erros gerais
        print(f"Ocorreu um erro geral: {e}")
        return jsonify({'error': str(e)}), 500

# Inicializa o servidor Flask
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
