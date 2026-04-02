import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js';

// Configuration
env.allowRemoteModels = false;

// Éléments DOM
const status = document.getElementById('status');
const translateBtn = document.getElementById('translateBtn');
const clearBtn = document.getElementById('clearBtn');
const copyResultBtn = document.getElementById('copyResultBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const outputDiv = document.getElementById('output');
const inputText = document.getElementById('inputText');
const historyList = document.getElementById('historyList');

// Configuration du modèle
<<<<<<< HEAD
const modelID = "opus-mt-fr2nnh";
=======
const modelID = "Xenova/opus-mt-en-fr";
>>>>>>> d465bf8feff927e5121f4e35ad327ab579f52659
const modelTask = "translation";
let translator = null;

// Stockage de l'historique
let history = [];

// Clé pour le localStorage
const STORAGE_KEY = 'translation_history';

// ---- Gestion de l'historique ----
function loadHistory() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            history = JSON.parse(saved);
            renderHistory();
        } catch (e) {
            console.error('Erreur chargement historique:', e);
        }
    }
}

function saveHistory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-50))); // Garde les 50 derniers
}

function addToHistory(source, target) {
    if (!source || !target) return;
    
    history.unshift({
        id: Date.now(),
        source: source,
        target: target,
        timestamp: new Date().toLocaleString()
    });
    
    // Limiter à 100 entrées
    if (history.length > 100) history.pop();
    
    saveHistory();
    renderHistory();
}

function renderHistory() {
    if (!historyList) return;
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="history-empty">📭 Aucune traduction pour le moment</div>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item" data-id="${item.id}">
            <div class="history-source" title="Cliquer pour utiliser comme source">📝 ${escapeHtml(truncate(item.source, 100))}</div>
            <div class="history-target">🎯 ${escapeHtml(truncate(item.target, 100))}</div>
            <div class="history-actions">
                <button class="use-source" data-source="${escapeHtml(item.source)}">📋 Utiliser</button>
                <button class="copy-target" data-target="${escapeHtml(item.target)}">📄 Copier</button>
            </div>
        </div>
    `).join('');
    
    // Ajouter les écouteurs d'événements
    document.querySelectorAll('.use-source').forEach(btn => {
        btn.addEventListener('click', () => {
            const source = btn.getAttribute('data-source');
            inputText.value = source;
            updateCharCount();
        });
    });
    
    document.querySelectorAll('.copy-target').forEach(btn => {
        btn.addEventListener('click', async () => {
            const target = btn.getAttribute('data-target');
            await copyToClipboard(target);
            showTemporaryStatus('✅ Texte copié !', 'success');
        });
    });
}

function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Erreur copie:', err);
        return false;
    }
}

function updateCharCount() {
    // Optionnel : ajouter un compteur de caractères
}

function showTemporaryStatus(message, type = 'info') {
    const originalText = status.textContent;
    const originalClass = status.className;
    status.textContent = message;
    status.className = `status ${type}`;
    setTimeout(() => {
        if (translator) {
            status.textContent = originalText;
            status.className = originalClass;
        } else {
            status.textContent = 'Modèle prêt';
            status.className = 'status success';
        }
    }, 2000);
}

// ---- Initialisation ----
async function init() {
    try {
        status.textContent = "⚙️ Chargement du modèle de traduction...";
        status.className = "status loading";
        
        translator = await pipeline(modelTask, modelID, { local_files_only: true });
        
        status.textContent = "✅ Modèle prêt !";
        status.className = "status success";
        translateBtn.disabled = false;
        copyResultBtn.disabled = false;
        
        // Charger l'historique
        loadHistory();
        
        // Afficher les infos du modèle
        const model = translator.model;
        console.log("Config du modèle:", model.config);
        
    } catch (e) {
        status.textContent = "❌ Erreur : " + e.message;
        status.className = "status error";
        console.error("Erreur détaillée :", e);
        console.error("Stack:", e.stack);
    }
}

// ---- Traduction ----
async function translate() {
    const text = inputText.value.trim();
    if (!text) {
        showTemporaryStatus("📝 Veuillez entrer un texte à traduire", "error");
        return;
    }
    
    if (!translator) {
        showTemporaryStatus("⏳ Modèle en cours de chargement...", "error");
        return;
    }
    
    translateBtn.disabled = true;
    outputDiv.textContent = "🔄 Traduction en cours...";
    
    try {
        const result = await translator(text, {
            max_new_tokens: 512,
            return_full_text: true,
            early_stopping: false,
            no_repeat_ngram_size: 0
        });
        
        let translation = result?.[0]?.generated_text?.trim() ??
                         result?.[0]?.translation_text?.trim() ??
                         result?.[0]?.text?.trim() ??
                         "";
        
        // Nettoyer les tokens spéciaux si présents
        translation = translation.replace(/__nnh__/g, '').trim();
        
        outputDiv.textContent = translation;
        
        // Ajouter à l'historique
        addToHistory(text, translation);
        
        showTemporaryStatus("✅ Traduction terminée !", "success");
        
    } catch (err) {
        outputDiv.textContent = "❌ Erreur lors de la traduction";
        console.error("Erreur de traduction:", err);
        showTemporaryStatus("❌ Erreur : " + err.message, "error");
    } finally {
        translateBtn.disabled = false;
    }
}

// ---- Copier le résultat ----
async function copyResult() {
    const resultText = outputDiv.textContent;
    if (!resultText || resultText === "En attente de traduction..." || resultText === "🔄 Traduction en cours...") {
        showTemporaryStatus("📭 Rien à copier", "error");
        return;
    }
    
    const success = await copyToClipboard(resultText);
    if (success) {
        showTemporaryStatus("📋 Résultat copié !", "success");
    } else {
        showTemporaryStatus("❌ Impossible de copier", "error");
    }
}

// ---- Effacer le champ de saisie ----
function clearInput() {
    inputText.value = "";
    outputDiv.textContent = "En attente de traduction...";
    showTemporaryStatus("🗑️ Champ effacé", "success");
}

// ---- Effacer tout l'historique ----
function clearHistory() {
    if (confirm("⚠️ Voulez-vous vraiment effacer tout l'historique des traductions ?")) {
        history = [];
        saveHistory();
        renderHistory();
        showTemporaryStatus("🗑️ Historique effacé", "success");
    }
}

// ---- Raccourcis clavier ----
inputText.addEventListener('keydown', (e) => {
    // Ctrl+Enter pour traduire
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        translate();
    }
});

// Double-clic sur le résultat pour copier
outputDiv.addEventListener('dblclick', copyResult);

// ---- Écouteurs d'événements ----
translateBtn.addEventListener('click', translate);
clearBtn.addEventListener('click', clearInput);
copyResultBtn.addEventListener('click', copyResult);
clearHistoryBtn.addEventListener('click', clearHistory);

// ---- Démarrer l'application ----
init();