// script.js

// ⚠️ SUBSTITUA ESTE URL pelo seu link JSON de "Publicar na web"
// Certifique-se de que a planilha tenha as colunas: Termo, Definição, Link Adicional
const GOOGLE_SHEET_JSON_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQMT1MX75GMBnPqX4pCsLHTRIPNBlZAzyuEUdh3PbLjH8ETahFnLXSmQFCfhuBaJJ-Qzt0NYqQGH_i_/pubhtml'; 

// Elementos da Interface
const flashcard = document.getElementById('flashcard');
const sortearBtn = document.getElementById('sortear-btn');
const cardTerm = document.getElementById('card-term');
const cardDefinitionTitle = document.getElementById('card-definition-title');
const cardDefinition = document.getElementById('card-definition');
const cardLink = document.getElementById('card-link');
const loadingMessage = document.getElementById('loading-message');

let glossaryData = []; // Armazenará todos os cards
let currentCard = null; // O card atualmente exibido

// Função para buscar dados da Planilha Google
async function loadGlossary() {
    try {
        const response = await fetch(GOOGLE_SHEET_JSON_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        
        // Assume que os dados vêm em uma lista sob a chave 'feed' -> 'entry'
        // Acessa as colunas 'gsx$termo', 'gsx$definicao', etc.
        if (json.feed && json.feed.entry) {
            glossaryData = json.feed.entry.map(item => ({
                Termo: item.gsx$termo.$t,
                Definicao: item.gsx$definicao.$t,
                LinkAdicional: item.gsx$linkadicional.$t || '' // Garante string vazia se o link não existir
            }));

            loadingMessage.textContent = `Glossário carregado com ${glossaryData.length} termos!`;
            sortearBtn.disabled = false; // Habilita o botão
        } else {
             throw new Error("Formato de dados inesperado do Google Sheets.");
        }

    } catch (error) {
        console.error("Erro ao carregar o glossário:", error);
        loadingMessage.textContent = 'Erro ao carregar o glossário. Verifique o link e as permissões.';
        sortearBtn.disabled = true;
    }
}

// Função para sortear e exibir um card aleatório
function drawRandomCard() {
    if (glossaryData.length === 0) {
        alert("Nenhum termo disponível para sorteio.");
        return;
    }

    // 1. Remove o estado 'flipped' (vira o card para a frente)
    flashcard.classList.remove('is-flipped');

    // 2. Sorteia um índice aleatório
    const randomIndex = Math.floor(Math.random() * glossaryData.length);
    currentCard = glossaryData[randomIndex];

    // 3. Atualiza a Frente do Card imediatamente
    cardTerm.textContent = currentCard.Termo;

    // 4. Atualiza o Verso do Card (para ser visto após o flip)
    cardDefinitionTitle.textContent = currentCard.Termo;
    cardDefinition.textContent = currentCard.Definicao;
    
    // Atualiza o link opcional
    if (currentCard.LinkAdicional) {
        cardLink.href = currentCard.LinkAdicional;
        cardLink.style.display = 'inline-block';
    } else {
        cardLink.style.display = 'none';
    }
}

// Função para lidar com o clique no card (virar)
function handleCardClick() {
    // Só permite virar se um card já tiver sido sorteado
    if (currentCard) {
        flashcard.classList.toggle('is-flipped');
    }
}

// --- Inicialização e Event Listeners ---

// 1. Carrega os dados ao iniciar a aplicação
loadGlossary();

// 2. Configura o botão de Sortear
sortearBtn.addEventListener('click', drawRandomCard);

// 3. Configura o clique no card para virar
flashcard.addEventListener('click', handleCardClick);
