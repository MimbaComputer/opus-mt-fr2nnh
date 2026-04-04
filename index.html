import { pipeline, env } from '@xenova/transformers';

// Configuration
env.allowRemoteModels = true;
env.cacheDir = './models';

// Éléments DOM
const status = document.getElementById('status');
const translateBtn = document.getElementById('translateBtn');
const clearBtn = document.getElementById('clearBtn');
const copyResultBtn = document.getElementById('copyResultBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const reloadModelBtn = document.getElementById('reloadModelBtn');
const outputDiv = document.getElementById('output');
const inputText = document.getElementById('inputText');
const historyList = document.getElementById('historyList');
const cacheInfo = document.getElementById('cacheInfo');

// Configuration du modèle
const MODEL_ID = "mimba/opus-mt-fr2nnh";
const MODEL_TASK = "translation";
let translator = null;
let isLoading = false;

// Configuration de génération
let generationConfig = {
    num_beams: 4,
    max_new_tokens: 512,
    return_full_text: false,
    early_stopping: false,
    no_repeat_ngram_size: 0,
    temperature: 1.0,
    do_sample: false
};

// Stockage de l'historique
let history = [];
const STORAGE_KEY = 'translation_history';

// Éléments du panneau config
const configToggle = document.getElementById('configToggle');
const configDropdown = document.getElementById('configDropdown');
const numBeamsSlider = document.getElementById('numBeamsSlider');
const maxTokensSlider = document.getElementById('maxTokensSlider');
const beamsValue = document.getElementById('beamsValue');
const maxTokensValue = document.getElementById('maxTokensValue');
const currentBeamsBadge = document.getElementById('currentBeamsBadge');

// ---- Gestion du cache ----
function getCacheSize() {
    if ('caches' in window) {
        return caches.keys().then(keys => {
            let totalSize = 0;
            return Promise.all(keys.map(key => 
                caches.open(key).then(cache => 
                    cache.keys().then(requests => 
                        Promise.all(requests.map(req => 
                            cache.match(req).then(res => res ? res.clone().blob().then(b => b.size) : 0)
                        )).then(sizes => sizes.reduce((a,b) => a+b, 0))
                    )
                )
            )).then(sizes => sizes.reduce((a,b) => a+b, 0));
        });
    }
    return Promise.resolve(0);
}

async function clearModelCache() {
    try {
        status.textContent = "🗑️ Nettoyage du cache en cours...";
        status.className = "status loading";
        
        if ('caches' in window) {
            const cacheKeys = await caches.keys();
            for (const key of cacheKeys) {
                if (key.includes('transformers') || key.includes('model') || key.includes(MODEL_ID)) {
                    await caches.delete(key);
                    console.log(`Cache supprimé: ${key}`);
                }
            }
        }
        
        for (const key in localStorage) {
            if (key.includes('transformers') || key.includes('model') || key.includes(MODEL_ID)) {
                localStorage.removeItem(key);
                console.log(`LocalStorage supprimé: ${key}`);
            }
        }
        
        for (const key in sessionStorage) {
            if (key.includes('transformers') || key.includes('model') || key.includes(MODEL_ID)) {
                sessionStorage.removeItem(key);
                console.log(`SessionStorage supprimé: ${key}`);
            }
        }
        
        console.log("✅ Cache vidé");
        return true;
    } catch (e) {
        console.error("Erreur nettoyage cache:", e);
        return false;
    }
}

// ---- Rechargement du modèle ----
async function reloadModel() {
    if (isLoading) {
        status.textContent = "⚠️ Un chargement est déjà en cours...";
        status.className = "status warning";
        return;
    }
    
    isLoading = true;
    reloadModelBtn.disabled = true;
    translateBtn.disabled = true;
    copyResultBtn.disabled = true;
    
    status.textContent = "🔄 Nettoyage du cache et rechargement du modèle...";
    status.className = "status loading";
    
    const cacheCleared = await clearModelCache();
    
    if (cacheCleared) {
        status.textContent = "🗑️ Cache vidé, téléchargement du nouveau modèle...";
    }
    
    try {
        translator = null;
        
        translator = await pipeline(MODEL_TASK, MODEL_ID, {
            local_files_only: false,
            progress_callback: (progress) => {
                if (progress.status === 'downloading') {
                    status.textContent = `📥 Téléchargement: ${Math.round(progress.progress * 100)}%`;
                } else if (progress.status === 'loading') {
                    status.textContent = "⚙️ Chargement du modèle...";
                }
            }
        });
        
        status.textContent = "✅ Modèle rechargé avec succès !";
        status.className = "status success";
        translateBtn.disabled = false;
        copyResultBtn.disabled = false;
        
        setTimeout(() => {
            showCacheInfo();
        }, 3000);
        
    } catch (e) {
        status.textContent = "❌ Erreur lors du rechargement : " + e.message;
        status.className = "status error";
        console.error("Erreur rechargement:", e);
    } finally {
        isLoading = false;
        reloadModelBtn.disabled = false;
    }
}

async function showCacheInfo() {
    try {
        const size = await getCacheSize();
        if (size > 0) {
            const sizeMB = (size / (1024 * 1024)).toFixed(2);
            cacheInfo.style.display = 'block';
            cacheInfo.title = `Taille du cache: ${sizeMB} MB - Cliquer pour vider`;
        }
    } catch (e) {
        console.error("Erreur lecture cache:", e);
    }
}

// ---- Initialisation du panneau config ----
function initConfigPanel() {
    if (!configToggle || !configDropdown) return;
    
    configToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        configDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', (e) => {
        if (!configDropdown.contains(e.target) && !configToggle.contains(e.target)) {
            configDropdown.classList.remove('show');
        }
    });
    
    if (numBeamsSlider) {
        numBeamsSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            beamsValue.textContent = value;
            generationConfig.num_beams = value;
            currentBeamsBadge.textContent = `${value} beam${value > 1 ? 's' : ''}`;
            
            const speedHint = value <= 2 ? '🚀 Mode rapide' : (value >= 6 ? '🐢 Mode précision' : '⚖️ Mode équilibré');
            showTemporaryStatus(`${speedHint} : ${value} beam${value > 1 ? 's' : ''}`, 'success');
            
            localStorage.setItem('translation_num_beams', value);
        });
    }
    
    if (maxTokensSlider) {
        maxTokensSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            maxTokensValue.textContent = value;
            generationConfig.max_new_tokens = value;
            localStorage.setItem('translation_max_tokens', value);
        });
    }
    
    const savedBeams = localStorage.getItem('translation_num_beams');
    if (savedBeams && numBeamsSlider) {
        const beams = parseInt(savedBeams);
        numBeamsSlider.value = beams;
        beamsValue.textContent = beams;
        generationConfig.num_beams = beams;
        currentBeamsBadge.textContent = `${beams} beam${beams > 1 ? 's' : ''}`;
    }
    
    const savedTokens = localStorage.getItem('translation_max_tokens');
    if (savedTokens && maxTokensSlider) {
        const tokens = parseInt(savedTokens);
        maxTokensSlider.value = tokens;
        maxTokensValue.textContent = tokens;
        generationConfig.max_new_tokens = tokens;
    }
}

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-50)));
}

function addToHistory(source, target) {
    if (!source || !target) return;
    
    history.unshift({
        id: Date.now(),
        source: source,
        target: target,
        timestamp: new Date().toLocaleString()
    });
    
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
    
    document.querySelectorAll('.use-source').forEach(btn => {
        btn.addEventListener('click', () => {
            const source = btn.getAttribute('data-source');
            inputText.value = source;
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

function showTemporaryStatus(message, type = 'info') {
    const originalText = status.textContent;
    const originalClass = status.className;
    status.textContent = message;
    status.className = `status ${type}`;
    setTimeout(() => {
        if (translator && !isLoading) {
            status.textContent = originalText;
            status.className = originalClass;
        } else if (translator) {
            status.textContent = 'Modèle prêt';
            status.className = 'status success';
        }
    }, 2000);
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
    
    const beamInfo = generationConfig.num_beams === 1 ? '⚡ greedy' : `🎯 ${generationConfig.num_beams} beams`;
    outputDiv.textContent = `🔄 Traduction en cours (${beamInfo})...`;
    
    try {
        const startTime = performance.now();
        
        const result = await translator(text, {
            max_new_tokens: generationConfig.max_new_tokens,
            num_beams: generationConfig.num_beams,
            return_full_text: generationConfig.return_full_text,
            early_stopping: generationConfig.early_stopping,
            no_repeat_ngram_size: generationConfig.no_repeat_ngram_size,
            temperature: generationConfig.temperature,
            do_sample: generationConfig.do_sample
        });
        
        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        let translation = result?.[0]?.generated_text?.trim() ??
                         result?.[0]?.translation_text?.trim() ??
                         result?.[0]?.text?.trim() ??
                         "";
        
        translation = translation
            .replace(/__nnh__/g, '')
            .replace(/^,\s*/, '')
            .replace(/^\s+/, '')
            .replace(/^[，,]\s*/, '')
            .trim();
        
        if (translation.startsWith(',')) {
            translation = translation.substring(1).trim();
        }
        
        outputDiv.textContent = translation;
        addToHistory(text, translation);
        
        showTemporaryStatus(`✅ Traduction en ${duration}s (${generationConfig.num_beams} beam${generationConfig.num_beams > 1 ? 's' : ''})`, "success");
        
        console.log(`Traduction: "${text.substring(0, 50)}..." → ${duration}s, ${generationConfig.num_beams} beams`);
        
    } catch (err) {
        outputDiv.textContent = "❌ Erreur lors de la traduction";
        console.error("Erreur de traduction:", err);
        showTemporaryStatus("❌ Erreur : " + err.message, "error");
    } finally {
        translateBtn.disabled = false;
    }
}

async function copyResult() {
    const resultText = outputDiv.textContent;
    if (!resultText || resultText === "En attente de traduction..." || resultText === "🔄 Traduction en cours..." || resultText.includes("🔄 Traduction en cours")) {
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

function clearInput() {
    inputText.value = "";
    outputDiv.textContent = "En attente de traduction...";
    showTemporaryStatus("🗑️ Champ effacé", "success");
}

function clearHistory() {
    if (confirm("⚠️ Voulez-vous vraiment effacer tout l'historique des traductions ?")) {
        history = [];
        saveHistory();
        renderHistory();
        showTemporaryStatus("🗑️ Historique effacé", "success");
    }
}

// ---- Initialisation principale ----
async function init() {
    if (isLoading) return;
    isLoading = true;
    
    initConfigPanel();
    
    try {
        status.textContent = "⚙️ Chargement du modèle de traduction...";
        status.className = "status loading";
        
        translator = await pipeline(MODEL_TASK, MODEL_ID, {
            progress_callback: (progress) => {
                if (progress.status === 'downloading') {
                    status.textContent = `📥 Téléchargement: ${Math.round(progress.progress * 100)}%`;
                } else if (progress.status === 'loading') {
                    status.textContent = "⚙️ Chargement du modèle...";
                }
            }
        });
        
        status.textContent = "✅ Modèle prêt !";
        status.className = "status success";
        translateBtn.disabled = false;
        copyResultBtn.disabled = false;
        reloadModelBtn.disabled = false;
        
        loadHistory();
        
        console.log("Modèle chargé avec succès");
        console.log("Configuration de génération:", generationConfig);
        
        setTimeout(() => {
            showCacheInfo();
        }, 2000);
        
    } catch (e) {
        status.textContent = "❌ Erreur : " + e.message;
        status.className = "status error";
        console.error("Erreur détaillée :", e);
    } finally {
        isLoading = false;
    }
}

// Écouteurs d'événements
translateBtn.addEventListener('click', translate);
clearBtn.addEventListener('click', clearInput);
copyResultBtn.addEventListener('click', copyResult);
clearHistoryBtn.addEventListener('click', clearHistory);
reloadModelBtn.addEventListener('click', reloadModel);

inputText.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        translate();
    }
});

outputDiv.addEventListener('dblclick', copyResult);

cacheInfo.addEventListener('click', async () => {
    if (confirm("⚠️ Vider le cache peut nécessiter un rechargement du modèle. Continuer ?")) {
        await clearModelCache();
        showTemporaryStatus("🗑️ Cache vidé. Rechargez la page ou le modèle.", "success");
        cacheInfo.style.display = 'none';
    }
});

// Démarrer l'application
init();