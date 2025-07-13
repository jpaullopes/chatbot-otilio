document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos ---
    const resultsArea = document.getElementById('results-area');
    const promptInput = document.getElementById('prompt-input');
    const sendButton = document.getElementById('send-button');
    const imageUpload = document.getElementById('image-upload');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const previewImage = document.getElementById('preview-image');
    const removeImageButton = document.getElementById('remove-image');
    const sendButtonIcon = sendButton.innerHTML; // Salva o ícone original

    // --- Estado ---
    let imageBase64 = null;
    let conversationHistory = [];

    // --- Eventos ---
    imageUpload.addEventListener('change', handleImageUpload);
    sendButton.addEventListener('click', sendMessage);
    removeImageButton.addEventListener('click', removeImage);
    
    // Auto-resize do textarea
    promptInput.addEventListener('input', autoResizeTextarea);
    
    promptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // --- Funções ---
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Verifica se é uma imagem
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione apenas arquivos de imagem.');
                event.target.value = '';
                return;
            }
            
            // Verifica o tamanho do arquivo (máximo 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('A imagem é muito grande. Por favor, selecione uma imagem menor que 10MB.');
                event.target.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => { 
                imageBase64 = e.target.result;
                console.log('Imagem carregada:', file.name, 'Tamanho:', file.size, 'bytes');
                
                // Mostra a prévia da imagem
                previewImage.src = imageBase64;
                imagePreviewContainer.style.display = 'block';
                
                // Feedback visual de que a imagem foi carregada
                const uploadButton = document.querySelector('.input-icon-button');
                uploadButton.style.color = 'var(--blue-medium)';
                uploadButton.title = `Imagem carregada: ${file.name}`;
            };
            reader.onerror = (e) => {
                console.error('Erro ao ler arquivo:', e);
                alert('Erro ao carregar a imagem. Tente novamente.');
                event.target.value = '';
            };
            reader.readAsDataURL(file);
        }
    }
    
    function removeImage() {
        imageBase64 = null;
        imageUpload.value = '';
        imagePreviewContainer.style.display = 'none';
        
        // Reset visual do botão de upload
        const uploadButton = document.querySelector('.input-icon-button');
        uploadButton.style.color = '';
        uploadButton.title = 'Enviar imagem';
    }
    
    function autoResizeTextarea() {
        promptInput.style.height = 'auto';
        promptInput.style.height = Math.min(promptInput.scrollHeight, 120) + 'px';
    }

    // --- Funções ---
    async function sendMessage() {
        const promptText = promptInput.value.trim();
        if (!promptText && !imageBase64) return;

        // Salva a mensagem do usuário no histórico
        const userMessage = {
            type: 'user',
            text: promptText,
            image: imageBase64, // Adiciona a imagem ao histórico
            timestamp: new Date()
        };

        setLoadingState(true);

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: promptText,
                    image: imageBase64
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro desconhecido no servidor.');
            }
            
            if (data.response) {
                // Debug: vamos ver o que está chegando
                console.log('Resposta recebida:', data.response);
                
                // Adiciona a conversa ao histórico
                conversationHistory.push({
                    user: userMessage,
                    assistant: {
                        type: 'assistant',
                        text: data.response,
                        timestamp: new Date()
                    }
                });
                
                displayConversationHistory();
            } else {
                throw new Error("Resposta da API em formato inesperado.");
            }

        } catch (error) {
            console.error("Erro:", error);
            
            // Mostra mensagem de erro para o usuário
            const errorMessage = {
                type: 'assistant',
                text: `Desculpe, ocorreu um erro: ${error.message}`,
                timestamp: new Date()
            };
            
            conversationHistory.push({
                user: userMessage,
                assistant: errorMessage
            });
            
            displayConversationHistory();
        } finally {
            setLoadingState(false);
        }

        // Limpa os inputs
        promptInput.value = '';
        removeImage(); // Usa a função para remover a prévia da imagem
        
        // Reset altura do textarea
        promptInput.style.height = 'auto';
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            sendButton.disabled = true;
            sendButton.innerHTML = '<div class="spinner"></div>';
        } else {
            sendButton.disabled = false;
            sendButton.innerHTML = sendButtonIcon;
        }
    }

    function displayConversationHistory() {
        resultsArea.innerHTML = '';
        
        conversationHistory.forEach((conversation, conversationIndex) => {
            const conversationItem = document.createElement('div');
            conversationItem.className = 'conversation-item';
            
            // Mensagem do usuário
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'user-message';
            
            // Se há imagem, exibe ela primeiro
            if (conversation.user.image) {
                const imageElement = document.createElement('img');
                imageElement.src = conversation.user.image;
                imageElement.className = 'user-image';
                imageElement.alt = 'Imagem enviada pelo usuário';
                userMessageDiv.appendChild(imageElement);
            }
            
            // Se há texto, exibe ele
            if (conversation.user.text) {
                const textElement = document.createElement('div');
                textElement.textContent = conversation.user.text;
                userMessageDiv.appendChild(textElement);
            }
            
            conversationItem.appendChild(userMessageDiv);
            
            // Resposta do assistente
            const assistantMessageDiv = document.createElement('div');
            assistantMessageDiv.className = 'assistant-message';
            assistantMessageDiv.innerHTML = conversation.assistant.text.replace(/\n/g, '<br>');
            conversationItem.appendChild(assistantMessageDiv);
            
            resultsArea.appendChild(conversationItem);
        });
        
        addCopyFunctionality();
        
        // Scroll para o final
        resultsArea.scrollTop = resultsArea.scrollHeight;
    }

    function addCopyFunctionality() {
        // Funcionalidade para copiar texto das mensagens do assistente
        document.querySelectorAll('.assistant-message').forEach(message => {
            message.addEventListener('click', (e) => {
                const textToCopy = e.target.textContent;
                copyToClipboard(textToCopy);
            });
        });
    }

    function copyToClipboard(text, buttonElement = null) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Texto copiado!');
            if (buttonElement) {
                const originalText = buttonElement.textContent;
                buttonElement.textContent = 'Copiado!';
                buttonElement.classList.add('copied');
                setTimeout(() => {
                    buttonElement.textContent = originalText;
                    buttonElement.classList.remove('copied');
                }, 2000);
            }
        }).catch(err => console.error('Erro ao copiar:', err));
    }
    
    // Função para escapar HTML e evitar problemas no atributo data-text
    function escapeHTML(str) {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }
});
