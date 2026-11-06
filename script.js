// 🔐 VERIFICA SE É O DONO DO SITE (você)
// Para editar, acesse: https://lilgus67.github.io/vingadores-cep/?admin=seu_codigo_secreto
var isAdmin = window.location.href.indexOf('admin=vingadores2026') !== -1;

let matchData = JSON.parse(localStorage.getItem('matchData')) || {
    opponent: 'Time Adversário',
    date: '2026-11-08',
    time: '15:00',
    location: 'Campo CEP'
};

let teamStats = JSON.parse(localStorage.getItem('teamStats')) || {
    wins: 0,
    draws: 0,
    losses: 0
};

let coach = JSON.parse(localStorage.getItem('coach')) || {
    id: 999,
    name: 'Técnico',
    photo: '👔',
    fieldX: 12,
    fieldY: 92
};

let defaultPlayers = [
    { id: 1, name: 'Capitão', position: 'Meia', photo: '👑', goals: 12, assists: 8, games: 15, starter: true, fieldX: 30, fieldY: 45, isCaptain: true },
    { id: 2, name: 'Jogador 2', position: 'Meia', photo: '⚡', goals: 15, assists: 5, games: 14, starter: true, fieldX: 70, fieldY: 45, isCaptain: false },
    { id: 3, name: 'Jogador 3', position: 'Goleiro', photo: '🧤', goals: 0, assists: 2, games: 15, starter: true, fieldX: 50, fieldY: 88, isCaptain: false },
    { id: 4, name: 'Jogador 4', position: 'Zagueiro', photo: '🛡️', goals: 3, assists: 4, games: 13, starter: true, fieldX: 20, fieldY: 70, isCaptain: false },
    { id: 5, name: 'Jogador 5', position: 'Zagueiro', photo: '🏃', goals: 2, assists: 10, games: 14, starter: true, fieldX: 50, fieldY: 72, isCaptain: false },
    { id: 6, name: 'Jogador 6', position: 'Zagueiro', photo: '🔥', goals: 8, assists: 6, games: 12, starter: true, fieldX: 80, fieldY: 70, isCaptain: false },
    { id: 7, name: 'Jogador 7', position: 'Atacante', photo: '⭐', goals: 5, assists: 3, games: 10, starter: true, fieldX: 50, fieldY: 18, isCaptain: false }
];

let players = JSON.parse(localStorage.getItem('players'));
if (!players || players.length === 0) {
    players = defaultPlayers;
    localStorage.setItem('players', JSON.stringify(defaultPlayers));
}

let matchHistory = JSON.parse(localStorage.getItem('matchHistory')) || [];

const content = document.getElementById('app-content');

// 🔐 Função para mostrar/ocultar botões de edição
function editButton(html, onclick) {
    if (isAdmin) {
        return html.replace('onclick="', 'onclick="' + onclick + '"');
    }
    return '';
}

function renderPhoto(photo, isCoach) {
    if (!photo) return isCoach ? '👔' : '⚽';
    if (photo.includes('.jpg') || photo.includes('.png') || photo.includes('.jpeg') || photo.includes('fotos/')) {
        return '<img src="' + photo + '" alt="Foto" onerror="this.style.display=\'none\'; this.parentElement.innerHTML=\'⚽\';">';
    }
    return photo;
}

function renderCaptainBadge(isCaptain, type) {
    if (!isCaptain) return '';
    if (type === 'field') return '<div class="captain-badge-field" title="Capitão">C</div>';
    if (type === 'label') return '<span class="captain-label" title="Capitão">C</span>';
    return '<span class="captain-badge" title="Capitão">C</span>';
}

function saveData() {
    localStorage.setItem('matchData', JSON.stringify(matchData));
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('matchHistory', JSON.stringify(matchHistory));
    localStorage.setItem('coach', JSON.stringify(coach));
    localStorage.setItem('teamStats', JSON.stringify(teamStats));
}

function navigate(page) {
    document.querySelectorAll('.nav-item').forEach(function(btn) { btn.classList.remove('active'); });
    document.getElementById('nav-' + page).classList.add('active');
    if (page === 'home') renderHome();
    else if (page === 'lineup') renderLineup();
    else if (page === 'squad') renderSquad();
    else if (page === 'history') renderHistory();
    else if (page === 'stats') renderStats();
}

function renderHome() {
    if (!players || players.length === 0) {
        content.innerHTML = '<div class="card"><div class="card-title">Bem-vindo!</div><p style="text-align:center;color:#9ca3af;">Nenhum jogador cadastrado ainda.</p></div>';
        return;
    }

    var totalGoals = 0;
    for (var i = 0; i < players.length; i++) totalGoals += players[i].goals;
    var totalGames = 0;
    for (var i = 0; i < players.length; i++) {
        if (players[i].games > totalGames) totalGames = players[i].games;
    }
    
    var topScorer = players[0];
    for (var i = 1; i < players.length; i++) {
        if (players[i].goals > topScorer.goals) topScorer = players[i];
    }
    if (!topScorer) topScorer = { name: 'Nenhum', photo: '⚽', goals: 0, games: 0, isCaptain: false };
    
    var captain = null;
    for (var i = 0; i < players.length; i++) {
        if (players[i].isCaptain) { captain = players[i]; break; }
    }
    
    var wins = teamStats.wins || 0;
    var draws = teamStats.draws || 0;
    var losses = teamStats.losses || 0;
    
    var matchDate = new Date(matchData.date + 'T' + matchData.time);
    var dateStr = matchDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    // Botão de editar próxima partida (só aparece para admin)
    var editMatchBtn = isAdmin ? '<button class="match-edit" onclick="openEditModal()"><i class="fas fa-edit"></i> Editar</button>' : '';

    var html = '<div class="card next-match"><div class="card-title">Próxima Partida</div><div class="match-info"><div class="match-teams"><div class="match-vs">Vingadores CEP vs ' + matchData.opponent + '</div><div class="match-date"><i class="fas fa-calendar"></i> ' + dateStr + ' às ' + matchData.time + '<br><i class="fas fa-map-marker-alt"></i> ' + matchData.location + '</div></div>' + editMatchBtn + '</div></div>';
    
    html += '<div class="card"><div class="card-title">Estatísticas do Time</div><div class="stats-grid"><div class="stat-box"><div class="stat-number">' + totalGoals + '</div><div class="stat-label">Gols</div></div><div class="stat-box"><div class="stat-number">' + totalGames + '</div><div class="stat-label">Jogos</div></div><div class="stat-box"><div class="stat-number" style="background:linear-gradient(135deg,#10b981,#059669);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">' + wins + '</div><div class="stat-label">Vitórias</div></div><div class="stat-box"><div class="stat-number">' + players.length + '</div><div class="stat-label">Jogadores</div></div></div></div>';
    
    // Botão de editar aproveitamento (só aparece para admin)
    var editStatsBtn = isAdmin ? '<button class="match-edit" onclick="openEditStatsModal()" style="font-size:0.7rem;padding:5px 10px;"><i class="fas fa-edit"></i> Editar</button>' : '';
    
    html += '<div class="card"><div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">Aproveitamento ' + editStatsBtn + '</div><div class="stats-grid" style="grid-template-columns:repeat(3,1fr);"><div class="stat-box" style="border-color:#10b981;"><div class="stat-number" style="background:linear-gradient(135deg,#10b981,#059669);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:1.5rem;">' + wins + '</div><div class="stat-label">Vitórias</div></div><div class="stat-box" style="border-color:#9ca3af;"><div class="stat-number" style="background:linear-gradient(135deg,#9ca3af,#6b7280);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:1.5rem;">' + draws + '</div><div class="stat-label">Empates</div></div><div class="stat-box" style="border-color:#ef4444;"><div class="stat-number" style="background:linear-gradient(135deg,#ef4444,#dc2626);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:1.5rem;">' + losses + '</div><div class="stat-label">Derrotas</div></div></div></div>';
    
    html += '<div class="card"><div class="card-title">Artilheiro do Time</div><div class="top-scorer"><div class="scorer-photo">' + renderPhoto(topScorer.photo) + '</div><div class="scorer-info"><div class="scorer-name">' + topScorer.name + renderCaptainBadge(topScorer.isCaptain, 'badge') + '</div><div class="scorer-goals"><i class="fas fa-futbol"></i> ' + topScorer.goals + ' gols em ' + topScorer.games + ' jogos</div></div></div></div>';
    
    html += '<div class="card"><div class="card-title">Comissão Técnica</div><div class="top-scorer"><div class="scorer-photo" style="background:linear-gradient(135deg,#000,#0a0a0a);">' + renderPhoto(coach.photo, true) + '</div><div class="scorer-info"><div class="scorer-name">' + coach.name + '</div><div class="scorer-goals"><i class="fas fa-user-tie"></i> Técnico Principal</div></div></div></div>';
    
    if (captain) {
        html += '<div class="card" style="border:2px solid #f4d03f;"><div class="card-title">🎯 Capitão do Time</div><div class="top-scorer"><div class="scorer-photo captain-photo">' + renderPhoto(captain.photo) + '</div><div class="scorer-info"><div class="scorer-name">' + captain.name + ' ' + renderCaptainBadge(true, 'label') + '</div><div class="scorer-goals"><i class="fas fa-shield-alt"></i> ' + captain.position + ' • ' + captain.games + ' jogos</div></div></div></div>';
    }
    
    // Aviso de admin no topo (só você vê)
    if (isAdmin) {
        html = '<div style="background:#10b981;color:#000;padding:10px;text-align:center;font-weight:bold;border-radius:8px;margin-bottom:15px;">🔓 MODO ADMIN ATIVADO - Você pode editar tudo</div>' + html;
    }
    
    content.innerHTML = html;
}

function organizeFormation() {
    const starters = players.filter(function(p) { return p.starter; });
    var gk = starters.filter(function(p) { return p.position.toLowerCase().includes('goleiro'); });
    var zagueiros = starters.filter(function(p) { return p.position.toLowerCase().includes('zagueiro') || p.position.toLowerCase().includes('defesa'); });
    var meias = starters.filter(function(p) { return p.position.toLowerCase().includes('meia') || p.position.toLowerCase().includes('medio'); });
    var atacantes = starters.filter(function(p) { return p.position.toLowerCase().includes('atacante') || p.position.toLowerCase().includes('ponta') || p.position.toLowerCase().includes('atac'); });
    
    gk.forEach(function(p) { p.fieldX = 50; p.fieldY = 88; });
    var zPositions = [20, 50, 80];
    zagueiros.forEach(function(p, i) { p.fieldX = zPositions[i] || 50; p.fieldY = 70; });
    var mPositions = [30, 70];
    meias.forEach(function(p, i) { p.fieldX = mPositions[i] || 50; p.fieldY = 45; });
    atacantes.forEach(function(p) { p.fieldX = 50; p.fieldY = 18; });
    
    saveData();
}

function renderLineup() {
    organizeFormation();
    var starters = players.filter(function(p) { return p.starter; });
    var html = '<h2 class="section-title">Formação Oficial</h2><div class="formation-container"><div class="formation-title">3-2-1</div><div class="field"><div class="field-area-top"></div><div class="field-area-bottom"></div><div class="field-goal-top"></div><div class="field-goal-bottom"></div><div class="field-penalty-top"></div><div class="field-penalty-bottom"></div>';
    
    var coachClick = isAdmin ? 'onclick="openEditCoachModal()"' : '';
    html += '<div class="field-player" style="left:' + coach.fieldX + '%;top:' + coach.fieldY + '%;" ' + coachClick + '><div class="player-circle coach">' + renderPhoto(coach.photo, true) + '</div><div class="player-name-field coach-name">👔 ' + coach.name + '</div><div class="player-position-field">TÉCNICO</div></div>';
    
    starters.filter(function(p) { return p.position.toLowerCase().includes('goleiro'); }).forEach(function(p) {
        var click = isAdmin ? 'onclick="openEditPlayerModal(' + p.id + ')"' : '';
        html += '<div class="field-player" style="left:' + p.fieldX + '%;top:' + p.fieldY + '%;" ' + click + '><div class="player-circle gk">' + renderPhoto(p.photo) + renderCaptainBadge(p.isCaptain, 'field') + '</div><div class="player-name-field">' + p.name + '</div><div class="player-position-field">GOL</div></div>';
    });
    
    starters.filter(function(p) { return p.position.toLowerCase().includes('zagueiro') || p.position.toLowerCase().includes('defesa'); }).forEach(function(p) {
        var click = isAdmin ? 'onclick="openEditPlayerModal(' + p.id + ')"' : '';
        html += '<div class="field-player" style="left:' + p.fieldX + '%;top:' + p.fieldY + '%;" ' + click + '><div class="player-circle">' + renderPhoto(p.photo) + renderCaptainBadge(p.isCaptain, 'field') + '</div><div class="player-name-field">' + p.name + '</div><div class="player-position-field">ZAG</div></div>';
    });
    
    starters.filter(function(p) { return p.position.toLowerCase().includes('meia') || p.position.toLowerCase().includes('medio'); }).forEach(function(p) {
        var click = isAdmin ? 'onclick="openEditPlayerModal(' + p.id + ')"' : '';
        html += '<div class="field-player" style="left:' + p.fieldX + '%;top:' + p.fieldY + '%;" ' + click + '><div class="player-circle">' + renderPhoto(p.photo) + renderCaptainBadge(p.isCaptain, 'field') + '</div><div class="player-name-field">' + p.name + '</div><div class="player-position-field">MEI</div></div>';
    });
    
    starters.filter(function(p) { return p.position.toLowerCase().includes('atacante') || p.position.toLowerCase().includes('ponta') || p.position.toLowerCase().includes('atac'); }).forEach(function(p) {
        var click = isAdmin ? 'onclick="openEditPlayerModal(' + p.id + ')"' : '';
        html += '<div class="field-player" style="left:' + p.fieldX + '%;top:' + p.fieldY + '%;" ' + click + '><div class="player-circle">' + renderPhoto(p.photo) + renderCaptainBadge(p.isCaptain, 'field') + '</div><div class="player-name-field">' + p.name + '</div><div class="player-position-field">ATA</div></div>';
    });
    
    html += '</div><div class="formation-legend"><div class="legend-item"><div class="legend-dot outfield"></div><span>Linha</span></div><div class="legend-item"><div class="legend-dot gk"></div><span>Goleiro</span></div><div class="legend-item"><div class="legend-dot coach"></div><span>Técnico</span></div><div class="legend-item"><div class="captain-badge" style="width:12px;height:12px;font-size:0.5rem;">C</div><span>Capitão</span></div></div></div>';
    content.innerHTML = html;
}

function renderSquad() {
    // Botão de adicionar jogador (só aparece para admin)
    var addBtn = isAdmin ? '<button class="add-player-btn" onclick="openAddPlayerModal()"><i class="fas fa-plus"></i> Adicionar Jogador</button>' : '';
    
    var html = '<h2 class="section-title">Elenco Completo</h2>' + addBtn;
    
    if (!players || players.length === 0) {
        html += '<div class="card" style="text-align:center;color:#9ca3af;">Nenhum jogador cadastrado ainda.</div>';
    } else {
        players.forEach(function(p) {
            var badge = p.starter ? '<span style="color:#f4d03f;font-size:0.7rem;">★ TITULAR</span>' : '<span style="color:#9ca3af;font-size:0.7rem;">RESERVA</span>';
            var captainBadge = renderCaptainBadge(p.isCaptain, 'badge');
            var photoClass = p.isCaptain ? 'player-photo captain-photo' : 'player-photo';
            
            // Botões de editar/excluir (só aparecem para admin)
            var actionBtns = '';
            if (isAdmin) {
                actionBtns = '<div class="player-actions"><button class="player-edit-btn" onclick="openEditPlayerModal(' + p.id + ')" title="Editar"><i class="fas fa-edit"></i></button><button class="player-delete-btn" onclick="deletePlayer(' + p.id + ')" title="Excluir"><i class="fas fa-trash"></i></button></div>';
            }
            
            html += '<div class="card player-card"><div class="' + photoClass + '">' + renderPhoto(p.photo) + '</div><div class="player-info"><div class="player-name">' + p.name + ' ' + captainBadge + ' ' + badge + '</div><div class="player-position">' + p.position + '</div></div><div class="player-stats-mini"><div><strong>' + p.goals + '</strong> G</div><div><strong>' + p.assists + '</strong> A</div><div><strong>' + p.games + '</strong> J</div></div>' + actionBtns + '</div>';
        });
    }
    
    var coachEditBtn = isAdmin ? '<div class="player-actions"><button class="player-edit-btn" onclick="openEditCoachModal()" title="Editar Técnico"><i class="fas fa-edit"></i></button></div>' : '';
    
    html += '<div class="coach-section"><h2 class="section-title">👔 Comissão Técnica</h2><div class="card player-card"><div class="player-photo coach-photo">' + renderPhoto(coach.photo, true) + '</div><div class="player-info"><div class="player-name">' + coach.name + '</div><div class="player-position">TÉCNICO PRINCIPAL</div></div>' + coachEditBtn + '</div></div>';
    content.innerHTML = html;
}

function renderHistory() {
    var addBtn = isAdmin ? '<button class="add-player-btn" onclick="openAddMatchModal()"><i class="fas fa-plus"></i> Registrar Partida</button>' : '';
    var html = '<h2 class="section-title">Histórico de Partidas</h2>' + addBtn;
    
    if (!matchHistory || matchHistory.length === 0) {
        html += '<div class="card" style="text-align:center;color:#9ca3af;">Nenhuma partida registrada ainda.</div>';
    } else {
        var sorted = matchHistory.slice().sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
        sorted.forEach(function(match) {
            var matchDate = new Date(match.date + 'T' + match.time);
            var dateStr = matchDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
            var resultClass = match.result === 'win' ? 'result-win' : match.result === 'loss' ? 'result-loss' : 'result-draw';
            var resultText = match.result === 'win' ? 'Vitória' : match.result === 'loss' ? 'Derrota' : 'Empate';
            html += '<div class="history-card"><div class="history-header"><span class="history-date">' + dateStr + '</span><span class="history-result ' + resultClass + '">' + resultText + '</span></div><div class="history-matchup">Vingadores CEP vs ' + match.opponent + '</div><div class="history-score">' + match.goalsFor + ' x ' + match.goalsAgainst + '</div><div class="history-location"><i class="fas fa-map-marker-alt"></i> ' + match.location + '</div></div>';
        });
    }
    content.innerHTML = html;
}

function renderStats() {
    if (!players || players.length === 0) {
        content.innerHTML = '<h2 class="section-title">Artilharia</h2><div class="card" style="text-align:center;color:#9ca3af;">Nenhum jogador cadastrado.</div>';
        return;
    }
    var sorted = players.slice().sort(function(a, b) { return b.goals - a.goals; });
    var html = '<h2 class="section-title">Artilharia</h2><table><thead><tr><th>#</th><th>Jogador</th><th>J</th><th>G</th><th>A</th></tr></thead><tbody>';
    sorted.forEach(function(p, index) {
        html += '<tr><td>' + (index + 1) + '</td><td>' + renderPhoto(p.photo) + ' ' + p.name + renderCaptainBadge(p.isCaptain, 'badge') + '</td><td>' + p.games + '</td><td><strong>' + p.goals + '</strong></td><td>' + p.assists + '</td></tr>';
    });
    html += '</tbody></table>';
    content.innerHTML = html;
}

// ============ MODAIS (só funcionam para admin) ============

function openEditModal() {
    if (!isAdmin) return;
    var modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'editModal';
    modal.innerHTML = '<div class="modal-content"><h3 class="modal-title">Editar Próxima Partida</h3><div class="form-group"><label>Adversário</label><input type="text" id="editOpponent" value="' + matchData.opponent + '"></div><div class="form-group"><label>Data</label><input type="date" id="editDate" value="' + matchData.date + '"></div><div class="form-group"><label>Horário</label><input type="time" id="editTime" value="' + matchData.time + '"></div><div class="form-group"><label>Local</label><input type="text" id="editLocation" value="' + matchData.location + '"></div><div class="form-buttons"><button class="btn btn-secondary" onclick="closeModal(\'editModal\')">Cancelar</button><button class="btn btn-primary" onclick="saveMatch()">Salvar</button></div></div>';
    document.body.appendChild(modal);
}

function saveMatch() {
    if (!isAdmin) return;
    matchData.opponent = document.getElementById('editOpponent').value;
    matchData.date = document.getElementById('editDate').value;
    matchData.time = document.getElementById('editTime').value;
    matchData.location = document.getElementById('editLocation').value;
    saveData();
    closeModal('editModal');
    renderHome();
}

function openEditStatsModal() {
    if (!isAdmin) return;
    var modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'editStatsModal';
    modal.innerHTML = '<div class="modal-content"><h3 class="modal-title">🏆 Editar Aproveitamento</h3><div class="form-group"><label style="color:#10b981;">Vitórias</label><input type="number" id="statWins" value="' + (teamStats.wins || 0) + '" min="0"></div><div class="form-group"><label style="color:#9ca3af;">Empates</label><input type="number" id="statDraws" value="' + (teamStats.draws || 0) + '" min="0"></div><div class="form-group"><label style="color:#ef4444;">Derrotas</label><input type="number" id="statLosses" value="' + (teamStats.losses || 0) + '" min="0"></div><div class="form-buttons"><button class="btn btn-secondary" onclick="closeModal(\'editStatsModal\')">Cancelar</button><button class="btn btn-primary" onclick="saveTeamStats()">Salvar</button></div></div>';
    document.body.appendChild(modal);
}

function saveTeamStats() {
    if (!isAdmin) return;
    teamStats.wins = parseInt(document.getElementById('statWins').value) || 0;
    teamStats.draws = parseInt(document.getElementById('statDraws').value) || 0;
    teamStats.losses = parseInt(document.getElementById('statLosses').value) || 0;
    saveData();
    closeModal('editStatsModal');
    renderHome();
}

function openAddPlayerModal() {
    if (!isAdmin) return;
    var modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'addPlayerModal';
    modal.innerHTML = '<div class="modal-content"><h3 class="modal-title">Adicionar Jogador</h3><div class="form-group"><label>Nome</label><input type="text" id="newName" placeholder="Nome do jogador"></div><div class="form-group"><label>Posição</label><input type="text" id="newPosition" placeholder="Ex: Atacante, Goleiro, Zagueiro, Meia"></div><div class="form-group"><label>Foto ou Emoji</label><input type="text" id="newPhoto" placeholder="Ex: fotos/joao.jpg"></div><div class="form-group"><label>É titular?</label><select id="newStarter"><option value="true">Sim</option><option value="false">Não</option></select></div><div class="form-group"><label>É o capitão?</label><select id="newIsCaptain"><option value="false">Não</option><option value="true">Sim</option></select></div><div class="form-buttons"><button class="btn btn-secondary" onclick="closeModal(\'addPlayerModal\')">Cancelar</button><button class="btn btn-primary" onclick="addPlayer()">Adicionar</button></div></div>';
    document.body.appendChild(modal);
}

function addPlayer() {
    if (!isAdmin) return;
    var name = document.getElementById('newName').value;
    var position = document.getElementById('newPosition').value;
    var photo = document.getElementById('newPhoto').value || '⚽';
    var starter = document.getElementById('newStarter').value === 'true';
    var isCaptain = document.getElementById('newIsCaptain').value === 'true';
    if (!name || !position) { alert('Preencha nome e posição!'); return; }
    if (isCaptain) { players.forEach(function(p) { p.isCaptain = false; }); }
    var fieldX = 50, fieldY = 50;
    var posLower = position.toLowerCase();
    if (posLower.includes('goleiro')) { fieldX = 50; fieldY = 88; }
    else if (posLower.includes('zagueiro') || posLower.includes('defesa')) { fieldX = 50; fieldY = 70; }
    else if (posLower.includes('meia') || posLower.includes('medio')) { fieldX = 50; fieldY = 45; }
    else if (posLower.includes('atacante') || posLower.includes('ponta')) { fieldX = 50; fieldY = 18; }
    players.push({ id: Date.now(), name: name, position: position, photo: photo, goals: 0, assists: 0, games: 0, starter: starter, isCaptain: isCaptain, fieldX: fieldX, fieldY: fieldY });
    saveData();
    closeModal('addPlayerModal');
    renderSquad();
}

function openEditCoachModal() {
    if (!isAdmin) return;
    var modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'editCoachModal';
    modal.innerHTML = '<div class="modal-content"><h3 class="modal-title">👔 Editar Técnico</h3><div class="form-group"><label>Nome do Técnico</label><input type="text" id="coachName" value="' + coach.name + '"></div><div class="form-group"><label>Foto ou Emoji</label><input type="text" id="coachPhoto" value="' + coach.photo + '" placeholder="Ex: fotos/tecnico.jpg"></div><div class="form-buttons"><button class="btn btn-secondary" onclick="closeModal(\'editCoachModal\')">Cancelar</button><button class="btn btn-primary" onclick="saveCoach()">Salvar</button></div></div>';
    document.body.appendChild(modal);
}

function saveCoach() {
    if (!isAdmin) return;
    coach.name = document.getElementById('coachName').value;
    coach.photo = document.getElementById('coachPhoto').value || '👔';
    if (!coach.name) { alert('Preencha o nome!'); return; }
    saveData();
    closeModal('editCoachModal');
    var activeNav = document.querySelector('.nav-item.active');
    navigate(activeNav.id.replace('nav-', ''));
}

function openEditPlayerModal(playerId) {
    if (!isAdmin) return;
    var player = players.find(function(p) { return p.id === playerId; });
    if (!player) return;
    var modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'editPlayerModal';
    modal.innerHTML = '<div class="modal-content"><h3 class="modal-title">Editar - ' + player.name + '</h3><div class="form-group"><label>Jogos</label><input type="number" id="editGames" value="' + player.games + '" min="0"></div><div class="form-group"><label>Gols</label><input type="number" id="editGoals" value="' + player.goals + '" min="0"></div><div class="form-group"><label>Assistências</label><input type="number" id="editAssists" value="' + player.assists + '" min="0"></div><div class="form-group"><label>É titular?</label><select id="editStarter"><option value="true"' + (player.starter ? ' selected' : '') + '>Sim</option><option value="false"' + (!player.starter ? ' selected' : '') + '>Não</option></select></div><div class="form-group"><label>É o capitão?</label><select id="editIsCaptain"><option value="true"' + (player.isCaptain ? ' selected' : '') + '>Sim</option><option value="false"' + (!player.isCaptain ? ' selected' : '') + '>Não</option></select></div><div class="form-buttons"><button class="btn btn-secondary" onclick="closeModal(\'editPlayerModal\')">Cancelar</button><button class="btn btn-primary" onclick="savePlayerStats(' + playerId + ')">Salvar</button></div></div>';
    document.body.appendChild(modal);
}

function savePlayerStats(playerId) {
    if (!isAdmin) return;
    var player = players.find(function(p) { return p.id === playerId; });
    if (!player) return;
    player.games = parseInt(document.getElementById('editGames').value) || 0;
    player.goals = parseInt(document.getElementById('editGoals').value) || 0;
    player.assists = parseInt(document.getElementById('editAssists').value) || 0;
    player.starter = document.getElementById('editStarter').value === 'true';
    var newIsCaptain = document.getElementById('editIsCaptain').value === 'true';
    if (newIsCaptain && !player.isCaptain) { players.forEach(function(p) { p.isCaptain = false; }); }
    player.isCaptain = newIsCaptain;
    saveData();
    closeModal('editPlayerModal');
    var activeNav = document.querySelector('.nav-item.active');
    navigate(activeNav.id.replace('nav-', ''));
}

function openAddMatchModal() {
    if (!isAdmin) return;
    var modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'addMatchModal';
    var today = new Date().toISOString().split('T')[0];
    modal.innerHTML = '<div class="modal-content"><h3 class="modal-title">Registrar Partida</h3><div class="form-group"><label>Adversário</label><input type="text" id="matchOpponent" placeholder="Nome do time"></div><div class="form-group"><label>Data</label><input type="date" id="matchDate" value="' + today + '"></div><div class="form-group"><label>Horário</label><input type="time" id="matchTime" value="20:00"></div><div class="form-group"><label>Local</label><input type="text" id="matchLocation" placeholder="Ex: Campo CEP"></div><div class="form-group"><label>Gols Vingadores CEP</label><input type="number" id="matchGoalsFor" min="0" value="0"></div><div class="form-group"><label>Gols Adversário</label><input type="number" id="matchGoalsAgainst" min="0" value="0"></div><div class="form-buttons"><button class="btn btn-secondary" onclick="closeModal(\'addMatchModal\')">Cancelar</button><button class="btn btn-primary" onclick="addMatch()">Registrar</button></div></div>';
    document.body.appendChild(modal);
}

function addMatch() {
    if (!isAdmin) return;
    var opponent = document.getElementById('matchOpponent').value;
    var date = document.getElementById('matchDate').value;
    var time = document.getElementById('matchTime').value;
    var location = document.getElementById('matchLocation').value;
    var goalsFor = parseInt(document.getElementById('matchGoalsFor').value) || 0;
    var goalsAgainst = parseInt(document.getElementById('matchGoalsAgainst').value) || 0;
    if (!opponent || !date || !location) { alert('Preencha todos os campos!'); return; }
    var result = goalsFor > goalsAgainst ? 'win' : goalsFor < goalsAgainst ? 'loss' : 'draw';
    matchHistory.push({ id: Date.now(), opponent: opponent, date: date, time: time, location: location, goalsFor: goalsFor, goalsAgainst: goalsAgainst, result: result });
    saveData();
    closeModal('addMatchModal');
    renderHistory();
}

function deletePlayer(playerId) {
    if (!isAdmin) return;
    var player = players.find(function(p) { return p.id === playerId; });
    if (!player) return;
    if (confirm('Tem certeza que deseja excluir ' + player.name + '?')) {
        players = players.filter(function(p) { return p.id !== playerId; });
        saveData();
        renderSquad();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).remove();
}

navigate('home');
