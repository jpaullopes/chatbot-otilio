import os
import io
import base64
import json
from datetime import datetime
from flask import Flask, request, jsonify, render_template, url_for
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

# Configura a API do Google Generative AI com a chave fornecida
genai.configure(api_key=api_key)
app = Flask(__name__)

# Configura o modelo de IA a ser utilizado
# ATENÇÃO: Verifique se este nome de modelo está correto para sua API Key
model = genai.GenerativeModel('gemini-1.5-flash')  # Modelo correto para processamento de imagens 

# Função para criar o prompt principal do chatbot
def get_master_prompt(user_prompt):
    return f"""
Você é um assistente virtual amigável e inteligente. Responda de forma clara, útil e conversacional.
Usuário: {user_prompt}

Assistente:"""

@app.route('/')
def index():
    # Renderiza a página inicial
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Obtém os dados enviados pelo cliente
        data = request.get_json()
        user_prompt = data.get('prompt', '')
        image_data_b64 = data.get('image')

        print(f"Recebido - Prompt: '{user_prompt}', Imagem: {'Sim' if image_data_b64 else 'Não'}")

        # Verifica se pelo menos um dos inputs foi fornecido
        if not user_prompt and not image_data_b64:
            return jsonify({'error': 'Nenhum prompt ou imagem fornecido'}), 400

        # Gera o prompt principal
        master_prompt = get_master_prompt(user_prompt)
        
        contents = []
        if image_data_b64:
            try:
                # Remove o prefixo "data:image/...;base64," se presente
                if ',' in image_data_b64:
                    image_data_b64 = image_data_b64.split(',')[1]
                
                # Decodifica a imagem base64 e a processa
                image_data_bytes = base64.b64decode(image_data_b64)
                img = Image.open(io.BytesIO(image_data_bytes))
                contents.append(img)
                print(f"Imagem processada com sucesso. Tamanho: {img.size}")
            except Exception as e:
                print(f"Erro ao processar imagem: {e}")
                return jsonify({'error': f'Erro ao processar imagem: {str(e)}'}), 400
        
        # Adiciona o prompt ao conteúdo enviado para o modelo
        contents.append(master_prompt)

        print(f"Enviando para o modelo: {len(contents)} items")
        response = model.generate_content(contents)
        print(f"Resposta recebida do modelo")
        
        # Retorna a resposta do modelo para o cliente
        return jsonify({
            'response': response.text,
            'timestamp': str(datetime.now())
        })

    except Exception as e:
        # Captura e retorna erros gerais
        print(f"Ocorreu um erro geral: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Inicia o servidor Flask
    app.run(host='0.0.0.0', port=5001, debug=True)
