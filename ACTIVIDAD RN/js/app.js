/**
 * MISIÓN: GUARDIANES DE LOS BIENES COMUNES
 * Controlador Principal de la Aplicación.
 * Integra:
 * - Modo Participante (Mobile)
 * - Modo Anfitrión / Panel Proyector (Host) con QR y PIN
 * - Modo Práctica Individual (Solo)
 * - Panel Privado de Organizadores (Autenticación, Resultados & Auditoría, Descarga CSV)
 * - Recursos Visuales (Diagramas e Imágenes en las 15 preguntas)
 * - Podio de Premiación con Ganador Único
 */

class QuizApp {
  constructor() {
    this.questions = QUIZ_QUESTIONS;
    this.gameMode = 'SOLO'; // 'SOLO' | 'HOST' | 'PLAYER'

    // Controladores de juego
    this.hostCtrl = null;
    this.playerCtrl = null;

    // Estado local para Modo Solitario
    this.soloIndex = 0;
    this.soloScore = 0;
    this.soloCorrectCount = 0;
    this.soloIncorrectCount = 0;
    this.soloTimeoutCount = 0;
    this.soloUserAnswers = [];
    this.soloTimer = null;
    this.soloTimeLeft = (window.CONTEST_CONFIG && window.CONTEST_CONFIG.timerSeconds) || 25;
    this.soloTotalTime = 0;
    this.soloStartTime = 0;
    this.soloLocked = false;

    // Cache DOM
    this.cacheDom();
    this.initEvents();
    this.updateSoundIcon();

    // Comprobar parámetro ?room=XXXXXX en la URL
    this.checkUrlRoomParam();
  }

  cacheDom() {
    this.dom = {
      // Header
      brandHome: document.getElementById('btn-brand-home'),
      headerModeTxt: document.getElementById('header-mode-txt'),
      headerRoomBadge: document.getElementById('header-room-badge'),
      headerRoomCode: document.getElementById('header-room-code'),
      headerScoreBadge: document.getElementById('header-score-badge'),
      headerScoreVal: document.getElementById('header-score-val'),
      btnOpenAdminLogin: document.getElementById('btn-open-admin-login'),
      btnMute: document.getElementById('btn-mute'),
      muteIcon: document.getElementById('mute-icon'),

      // Modal Roles & Login Admin
      roleModalOverlay: document.getElementById('role-modal-overlay'),
      btnChooseHost: document.getElementById('btn-choose-host'),
      btnChoosePlayer: document.getElementById('btn-choose-player'),
      btnChooseSolo: document.getElementById('btn-choose-solo'),
      btnCloseRoleModal: document.getElementById('btn-close-role-modal'),
      adminLoginModal: document.getElementById('admin-login-modal'),
      formAdminLogin: document.getElementById('form-admin-login'),
      inputAdminPass: document.getElementById('input-admin-pass'),
      adminLoginError: document.getElementById('admin-login-error'),
      btnCloseAdminLogin: document.getElementById('btn-close-admin-login'),

      // Pantallas (Views)
      screenHome: document.getElementById('screen-home'),
      screenHostLobby: document.getElementById('screen-host-lobby'),
      screenPlayerJoin: document.getElementById('screen-player-join'),
      screenPlayerWait: document.getElementById('screen-player-wait'),
      screenQuiz: document.getElementById('screen-quiz'),
      screenLeaderboard: document.getElementById('screen-leaderboard'),
      screenPodium: document.getElementById('screen-podium'),
      screenAdminPanel: document.getElementById('screen-admin-panel'),
      screenResults: document.getElementById('screen-results'),
      screenReview: document.getElementById('screen-review'),

      // Inicio
      btnStart: document.getElementById('btn-start'),

      // Host Lobby
      qrContainer: document.getElementById('qr-container'),
      hostPinCode: document.getElementById('host-pin-code'),
      btnCopyInviteLink: document.getElementById('btn-copy-invite-link'),
      inputBaseUrl: document.getElementById('input-base-url'),
      btnUpdateQr: document.getElementById('btn-update-qr'),
      hostPlayersCount: document.getElementById('host-players-count'),
      hostPlayersGrid: document.getElementById('host-players-grid'),
      lobbyEmptyHint: document.getElementById('lobby-empty-hint'),
      btnCancelLobby: document.getElementById('btn-cancel-lobby'),
      btnHostStartGame: document.getElementById('btn-host-start-game'),
      btnAdminViewResults: document.getElementById('btn-admin-view-results'),

      // Player Join
      formPlayerJoin: document.getElementById('form-player-join'),
      inputRoomCode: document.getElementById('input-room-code'),
      inputNickname: document.getElementById('input-nickname'),
      btnSubmitJoin: document.getElementById('btn-submit-join'),
      joinErrorBox: document.getElementById('join-error-box'),
      btnBackHomeFromJoin: document.getElementById('btn-back-home-from-join'),

      // Player Wait
      playerWaitNick: document.getElementById('player-wait-nick'),
      playerWaitRoom: document.getElementById('player-wait-room'),
      playerWaitCount: document.getElementById('player-wait-count'),
      btnLeaveRoom: document.getElementById('btn-leave-room'),

      // Quiz Screen
      qCounter: document.getElementById('q-counter'),
      qRoundBadge: document.getElementById('q-round-badge'),
      hostAnswersStatus: document.getElementById('host-answers-status'),
      hostAnswersCount: document.getElementById('host-answers-count'),
      hostTotalPlayers: document.getElementById('host-total-players'),
      progressFill: document.getElementById('progress-fill'),
      timerSvgProgress: document.getElementById('timer-svg-progress'),
      timerNumber: document.getElementById('timer-number'),
      questionText: document.getElementById('question-text'),
      
      // Visual Resource Box
      questionVisualBox: document.getElementById('question-visual-box'),
      visualBadge: document.getElementById('visual-badge'),
      visualTitle: document.getElementById('visual-title'),
      visualContent: document.getElementById('visual-content'),
      visualCaption: document.getElementById('visual-caption'),
      
      optionsContainer: document.getElementById('options-container'),
      playerSubmittedNotice: document.getElementById('player-submitted-notice'),

      // Feedback Box
      feedbackBox: document.getElementById('feedback-box'),
      feedbackStatus: document.getElementById('feedback-status'),
      pointsEarned: document.getElementById('points-earned'),
      feedbackExplanation: document.getElementById('feedback-explanation'),
      btnHostPauseToggle: document.getElementById('btn-host-pause-toggle'),
      btnNext: document.getElementById('btn-next'),

      // Leaderboard
      leaderboardTbody: document.getElementById('leaderboard-tbody'),
      btnLeaderboardNext: document.getElementById('btn-leaderboard-next'),

      // Podium
      podiumStageContainer: document.getElementById('podium-stage-container'),
      podiumFullRankTbody: document.getElementById('podium-full-rank-tbody'),
      btnPodiumExportCsv: document.getElementById('btn-podium-export-csv'),
      btnPodiumRestart: document.getElementById('btn-podium-restart'),
      btnPodiumReview: document.getElementById('btn-podium-review'),

      // Admin Results Section
      adminResultsTbody: document.getElementById('admin-results-tbody'),
      btnAdminDownloadCsv: document.getElementById('btn-admin-download-csv'),
      btnAdminReturnRoom: document.getElementById('btn-admin-return-room'),
      btnAdminChangePass: document.getElementById('btn-admin-change-pass'),

      // Resultados Individuales
      finalScore: document.getElementById('final-score'),
      statCorrect: document.getElementById('stat-correct'),
      statIncorrect: document.getElementById('stat-incorrect'),
      statAccuracy: document.getElementById('stat-accuracy'),
      statTime: document.getElementById('stat-time'),
      performanceBanner: document.getElementById('performance-banner'),
      performanceText: document.getElementById('performance-text'),
      btnPlayAgain: document.getElementById('btn-play-again'),
      btnReview: document.getElementById('btn-review'),

      // Revisión
      reviewList: document.getElementById('review-list'),
      btnBackToResults: document.getElementById('btn-back-to-results')
    };
  }

  initEvents() {
    // Brand Home Click
    this.dom.brandHome.addEventListener('click', (e) => {
      e.preventDefault();
      this.resetToHome();
    });

    // Abrir Modal de Rol
    this.dom.btnStart.addEventListener('click', () => {
      window.soundCtrl.playClick();
      this.openRoleModal();
    });

    this.dom.btnCloseRoleModal.addEventListener('click', () => {
      window.soundCtrl.playClick();
      this.closeRoleModal();
    });

    // Opción Anfitrión (Requiere autenticación)
    this.dom.btnChooseHost.addEventListener('click', () => {
      window.soundCtrl.playClick();
      this.closeRoleModal();
      this.requestAdminAuth(() => this.startHostMode());
    });

    // Opción Participante (Celular)
    this.dom.btnChoosePlayer.addEventListener('click', () => {
      window.soundCtrl.playClick();
      this.closeRoleModal();
      this.startPlayerMode();
    });

    // Opción Modo Práctica
    this.dom.btnChooseSolo.addEventListener('click', () => {
      window.soundCtrl.playClick();
      this.closeRoleModal();
      this.startSoloMode();
    });

    // Botón en Header para Organizadores
    this.dom.btnOpenAdminLogin.addEventListener('click', () => {
      window.soundCtrl.playClick();
      this.requestAdminAuth(() => {
        if (this.gameMode === 'HOST' && this.hostCtrl) {
          this.openAdminPanel();
        } else {
          this.startHostMode();
        }
      });
    });

    // Formulario de login administrador
    this.dom.formAdminLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = this.dom.inputAdminPass.value;
      const res = window.adminManager.login(entered);
      if (res.success) {
        this.dom.adminLoginModal.classList.remove('active');
        this.dom.inputAdminPass.value = '';
        if (this.pendingAdminCallback) {
          this.pendingAdminCallback();
          this.pendingAdminCallback = null;
        }
      } else {
        this.dom.adminLoginError.textContent = res.message;
        this.dom.adminLoginError.style.display = 'block';
        window.soundCtrl.playIncorrect();
      }
    });

    this.dom.btnCloseAdminLogin.addEventListener('click', () => {
      this.dom.adminLoginModal.classList.remove('active');
      this.pendingAdminCallback = null;
    });

    // Copiar enlace
    this.dom.btnCopyInviteLink.addEventListener('click', () => {
      this.copyInviteLink();
    });

    // Actualizar URL QR
    this.dom.btnUpdateQr.addEventListener('click', () => {
      window.soundCtrl.playClick();
      this.renderHostQr();
    });

    // Iniciar Misión
    this.dom.btnHostStartGame.addEventListener('click', () => {
      window.soundCtrl.playClick();
      if (this.hostCtrl) this.hostCtrl.startGame();
    });

    // Cancelar Lobby
    this.dom.btnCancelLobby.addEventListener('click', () => {
      window.soundCtrl.playClick();
      this.resetToHome();
    });

    // Ver resultados desde el lobby
    this.dom.btnAdminViewResults.addEventListener('click', () => {
      window.soundCtrl.playClick();
      this.openAdminPanel();
    });

    // Ingreso de Participante
    this.dom.formPlayerJoin.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePlayerJoinSubmit();
    });

    this.dom.btnBackHomeFromJoin.addEventListener('click', () => {
      window.soundCtrl.playClick();
      this.resetToHome();
    });

    // Salir de la sala (espera)
    this.dom.btnLeaveRoom.addEventListener('click', () => {
      window.soundCtrl.playClick();
      this.resetToHome();
    });

    // Pausar / Reanudar temporizador en el proyector
    this.dom.btnHostPauseToggle.addEventListener('click', () => {
      if (this.hostCtrl) {
        const isPaused = this.hostCtrl.togglePause();
        this.dom.btnHostPauseToggle.innerHTML = isPaused
          ? '<span>▶ Reanudar Tiempo</span>'
          : '<span>⏸ Pausar Tiempo</span>';
      }
    });

    // Botón Siguiente en Quiz
    this.dom.btnNext.addEventListener('click', () => {
      window.soundCtrl.playClick();
      if (this.gameMode === 'HOST') {
        this.hostCtrl.showLeaderboard();
      } else if (this.gameMode === 'SOLO') {
        this.nextSoloQuestion();
      }
    });

    // Continuar en Leaderboard
    this.dom.btnLeaderboardNext.addEventListener('click', () => {
      window.soundCtrl.playClick();
      if (this.hostCtrl) this.hostCtrl.nextQuestionOrFinish();
    });

    // Acciones de Podio
    this.dom.btnPodiumRestart.addEventListener('click', () => {
      window.soundCtrl.playClick();
      if (this.hostCtrl) {
        this.hostCtrl.resetGame();
        this.showScreen('screenHostLobby');
        this.setupHostLobbyView();
      } else {
        this.resetToHome();
      }
    });

    this.dom.btnPodiumExportCsv.addEventListener('click', () => {
      window.soundCtrl.playClick();
      if (this.hostCtrl) {
        const ranked = this.hostCtrl.calculateRankings();
        window.adminManager.exportResultsToCSV(ranked, this.questions);
      }
    });

    this.dom.btnPodiumReview.addEventListener('click', () => {
      window.soundCtrl.playClick();
      this.showScreen('screenReview');
      this.renderPedagogicalReview();
    });

    // Acciones del Panel de Organizadores
    this.dom.btnAdminDownloadCsv.addEventListener('click', () => {
      window.soundCtrl.playClick();
      const ranked = this.hostCtrl ? this.hostCtrl.calculateRankings() : [];
      window.adminManager.exportResultsToCSV(ranked, this.questions);
    });

    this.dom.btnAdminReturnRoom.addEventListener('click', () => {
      window.soundCtrl.playClick();
      if (this.hostCtrl) {
        if (this.hostCtrl.state === 'PODIUM') this.showScreen('screenPodium');
        else if (this.hostCtrl.state === 'QUESTION_ACTIVE') this.showScreen('screenQuiz');
        else this.showScreen('screenHostLobby');
      } else {
        this.resetToHome();
      }
    });

    this.dom.btnAdminChangePass.addEventListener('click', () => {
      const newPass = prompt("Ingresa la nueva contraseña para el panel de organizadores:");
      if (newPass !== null) {
        const res = window.adminManager.setPassword(newPass);
        alert(res.message);
      }
    });

    // Acciones en Resultados Individuales
    this.dom.btnPlayAgain.addEventListener('click', () => {
      window.soundCtrl.playClick();
      this.resetToHome();
    });

    this.dom.btnReview.addEventListener('click', () => {
      window.soundCtrl.playClick();
      this.showScreen('screenReview');
      if (this.gameMode === 'PLAYER' && this.playerCtrl) {
        this.renderPlayerAnswersReview();
      } else {
        this.renderSoloReview();
      }
    });

    this.dom.btnBackToResults.addEventListener('click', () => {
      window.soundCtrl.playClick();
      if (this.gameMode === 'HOST') {
        this.showScreen('screenPodium');
      } else {
        this.showScreen('screenResults');
      }
    });

    // Toggle Sonido
    this.dom.btnMute.addEventListener('click', () => {
      const enabled = window.soundCtrl.toggleSound();
      this.updateSoundIcon(enabled);
    });
  }

  requestAdminAuth(onSuccess) {
    if (window.adminManager.isAuthenticated) {
      onSuccess();
    } else {
      this.pendingAdminCallback = onSuccess;
      this.dom.adminLoginError.style.display = 'none';
      this.dom.inputAdminPass.value = '';
      this.dom.adminLoginModal.classList.add('active');
      this.dom.inputAdminPass.focus();
    }
  }

  checkUrlRoomParam() {
    try {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      if (roomParam) {
        this.dom.inputRoomCode.value = roomParam.toUpperCase().trim();
        this.startPlayerMode();
        this.dom.inputNickname.focus();
      }
    } catch (e) {}
  }

  openRoleModal() {
    this.dom.roleModalOverlay.classList.add('active');
  }

  closeRoleModal() {
    this.dom.roleModalOverlay.classList.remove('active');
  }

  updateSoundIcon(enabled = window.soundCtrl.soundEnabled) {
    if (enabled) {
      this.dom.muteIcon.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
      this.dom.btnMute.title = 'Silenciar sonido';
    } else {
      this.dom.muteIcon.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      `;
      this.dom.btnMute.title = 'Activar sonido';
    }
  }

  showScreen(screenKey) {
    const screens = [
      this.dom.screenHome,
      this.dom.screenHostLobby,
      this.dom.screenPlayerJoin,
      this.dom.screenPlayerWait,
      this.dom.screenQuiz,
      this.dom.screenLeaderboard,
      this.dom.screenPodium,
      this.dom.screenAdminPanel,
      this.dom.screenResults,
      this.dom.screenReview
    ];
    screens.forEach(s => s && s.classList.remove('active'));

    const target = this.dom[screenKey];
    if (target) {
      target.classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetToHome() {
    clearInterval(this.soloTimer);
    window.confettiCannon.stop();
    if (window.networkManager) window.networkManager.cleanup();

    this.gameMode = 'SOLO';
    this.dom.headerModeTxt.textContent = 'Tecnología, IA y Economía de Recursos Naturales';
    this.dom.headerRoomBadge.style.display = 'none';
    this.dom.headerScoreBadge.style.display = 'none';
    this.dom.hostAnswersStatus.style.display = 'none';
    this.showScreen('screenHome');
  }

  /* ==========================================================================
     MODO ANFITRIÓN (PROYECTOR EN SALÓN)
     ========================================================================== */
  startHostMode() {
    this.gameMode = 'HOST';
    this.dom.headerModeTxt.textContent = 'Panel Proyector (15 Preguntas)';
    this.dom.headerScoreBadge.style.display = 'none';

    this.hostCtrl = new HostGameController(window.networkManager, this.questions);
    const roomCode = this.hostCtrl.createRoom();

    this.dom.headerRoomCode.textContent = roomCode;
    this.dom.headerRoomBadge.style.display = 'inline-flex';
    this.dom.hostPinCode.textContent = roomCode;

    // Configuración de URL base
    const currentOrigin = (window.location.protocol === 'file:') ? 'http://localhost:5500' : window.location.origin;
    const currentPath = window.location.pathname.replace(/\/$/, '');
    this.dom.inputBaseUrl.value = `${currentOrigin}${currentPath}/index.html`;

    this.setupHostLobbyView();
    this.showScreen('screenHostLobby');

    // Callbacks del Host
    this.hostCtrl.onPlayerListChange = (players) => {
      this.renderHostPlayersList(players);
    };

    this.hostCtrl.onStateChange = (newState, data) => {
      this.handleHostStateChange(newState, data);
    };

    this.hostCtrl.onAnswerReceived = (info) => {
      this.dom.hostAnswersCount.textContent = info.answeredCount;
      this.dom.hostTotalPlayers.textContent = info.totalPlayers;
    };

    this.hostCtrl.onTimerTick = (seconds, fraction) => {
      this.updateTimerUI(seconds, fraction);
    };
  }

  setupHostLobbyView() {
    this.renderHostQr();
    this.renderHostPlayersList([]);
  }

  renderHostQr() {
    let baseUrl = (this.dom.inputBaseUrl.value || '').trim();
    if (!baseUrl) {
      baseUrl = window.location.href.split('?')[0];
      this.dom.inputBaseUrl.value = baseUrl;
    }
    const cleanUrl = baseUrl.split('?')[0];
    const fullInviteUrl = `${cleanUrl}?room=${this.hostCtrl.roomCode}`;

    window.QRCodeGenerator.render(this.dom.qrContainer, fullInviteUrl, 210);
  }

  copyInviteLink() {
    let baseUrl = (this.dom.inputBaseUrl.value || '').trim();
    if (!baseUrl) baseUrl = window.location.href.split('?')[0];
    const cleanUrl = baseUrl.split('?')[0];
    const fullInviteUrl = `${cleanUrl}?room=${this.hostCtrl.roomCode}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullInviteUrl).then(() => {
        this.dom.btnCopyInviteLink.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>¡Enlace Copiado al Portapapeles!</span>
        `;
        setTimeout(() => {
          this.dom.btnCopyInviteLink.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Copiar Enlace Directo</span>
          `;
        }, 2500);
      });
    } else {
      prompt("Copia este enlace para los estudiantes:", fullInviteUrl);
    }
  }

  renderHostPlayersList(players) {
    this.dom.hostPlayersCount.textContent = players.length;

    if (players.length === 0) {
      this.dom.hostPlayersGrid.innerHTML = `
        <div style="width: 100%; text-align: center; color: var(--text-dim); margin-top: 5rem;" id="lobby-empty-hint">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.75rem;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <p>Esperando participantes...<br>Proyecta el código QR o comparte el código PIN.</p>
        </div>
      `;
      return;
    }

    this.dom.hostPlayersGrid.innerHTML = '';
    players.forEach(p => {
      const chip = document.createElement('div');
      chip.className = 'player-chip';
      const initials = p.nickname.substring(0, 2).toUpperCase();
      chip.innerHTML = `
        <span class="player-avatar-circle">${initials}</span>
        <span>${p.nickname}</span>
      `;
      this.dom.hostPlayersGrid.appendChild(chip);
    });
  }

  handleHostStateChange(newState, data) {
    if (newState === 'QUESTION_ACTIVE') {
      this.showScreen('screenQuiz');
      this.dom.hostAnswersStatus.style.display = 'inline-flex';
      this.dom.hostAnswersCount.textContent = '0';
      this.dom.hostTotalPlayers.textContent = this.hostCtrl.getConnectedPlayersCount();
      this.dom.playerSubmittedNotice.style.display = 'none';
      this.dom.btnHostPauseToggle.style.display = 'inline-flex';
      this.dom.btnHostPauseToggle.innerHTML = '<span>⏸ Pausar Tiempo</span>';

      this.renderQuestionScreen(data.question, data.qIndex, true);
    } else if (newState === 'ROUND_CLOSED') {
      window.soundCtrl.playTimeout();
      this.revealCorrectAnswerHost(data.question, data.summary);
    } else if (newState === 'LEADERBOARD') {
      this.showScreen('screenLeaderboard');
      this.renderLeaderboardTable(data.leaderboard);
    } else if (newState === 'PODIUM') {
      this.showScreen('screenPodium');
      this.renderPodiumStage(data.podium, data.leaderboard);
      window.soundCtrl.playVictory();
      window.confettiCannon.fire(5500);
    }
  }

  revealCorrectAnswerHost(q, summary) {
    const buttons = this.dom.optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctAnswer) {
        btn.classList.add('is-correct');
      } else {
        btn.classList.add('dimmed');
      }
    });

    this.dom.feedbackStatus.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>Ronda Concluida</span>
    `;
    this.dom.pointsEarned.style.display = 'none';
    this.dom.feedbackExplanation.textContent = q.explanation;
    this.dom.btnNext.innerHTML = `
      <span>Ver Posiciones</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
    `;
    this.dom.feedbackBox.classList.add('visible');
  }

  renderLeaderboardTable(leaderboard) {
    this.dom.leaderboardTbody.innerHTML = '';
    const medals = ['🥇', '🥈', '🥉'];

    (leaderboard || []).slice(0, 8).forEach((p) => {
      const tr = document.createElement('tr');
      tr.style.background = 'rgba(255,255,255,0.05)';
      tr.style.borderRadius = '8px';
      const medal = medals[p.rank - 1] || `${p.rank}°`;
      tr.innerHTML = `
        <td style="padding: 12px 16px; font-weight: 800; font-size: 1.1rem; color: #f59e0b;">${medal}</td>
        <td style="padding: 12px 16px; font-weight: 700;">${p.nickname}</td>
        <td style="padding: 12px 16px; text-align: right; font-weight: 800; color: #74c69d; font-size: 1.15rem;">${p.score.toLocaleString()} pts</td>
      `;
      this.dom.leaderboardTbody.appendChild(tr);
    });

    const isLast = (this.hostCtrl.currentQuestionIndex >= this.questions.length - 1);
    this.dom.btnLeaderboardNext.innerHTML = isLast
      ? '<span>Ir al Gran Podio Final</span>'
      : '<span>Siguiente Pregunta</span>';
  }

  renderPodiumStage(podium, leaderboard) {
    this.dom.podiumStageContainer.innerHTML = '';

    const winner = podium.winner;
    const second = podium.second;
    const third = podium.third;

    // 2do Lugar (Izquierda)
    if (second) {
      const col2 = document.createElement('div');
      col2.className = 'podium-column second';
      col2.innerHTML = `
        <div class="winner-avatar">🥈</div>
        <div class="winner-name-lbl" style="font-size: 1.15rem; font-weight: 800; margin-bottom: 2px;">${second.nickname}</div>
        <div style="font-size: 0.95rem; color: #f59e0b; font-weight: 700; margin-bottom: 6px;">${second.score.toLocaleString()} pts</div>
        <div style="font-size: 0.8rem; color: #74c69d; margin-bottom: 6px;">${second.correctCount}/${this.questions.length} aciertos</div>
        <div class="podium-pedestal">2°</div>
      `;
      this.dom.podiumStageContainer.appendChild(col2);
    }

    // 1er Lugar - GANADOR DEL CONCURSO (Centro y Prominente)
    if (winner) {
      const col1 = document.createElement('div');
      col1.className = 'podium-column first';
      col1.innerHTML = `
        <div class="winner-avatar">🥇</div>
        <div class="winner-name-lbl" style="font-size: 1.45rem; font-weight: 900; color: #fefae0; margin-bottom: 2px;">${winner.nickname}</div>
        <div style="font-size: 1.15rem; color: #f59e0b; font-weight: 800; margin-bottom: 4px;">${winner.score.toLocaleString()} pts</div>
        <div style="font-size: 0.85rem; color: #74c69d; font-weight: 700; margin-bottom: 8px;">${winner.correctCount}/${this.questions.length} aciertos</div>
        <div class="podium-pedestal" style="font-size: 1.15rem; padding-top: 15px;">
          <span style="font-size: 2.8rem; display:block;">1°</span>
          <span style="font-size: 0.8rem; letter-spacing: 0.05em; text-transform: uppercase;">GANADOR</span>
        </div>
      `;
      this.dom.podiumStageContainer.appendChild(col1);
    }

    // 3er Lugar (Derecha)
    if (third) {
      const col3 = document.createElement('div');
      col3.className = 'podium-column third';
      col3.innerHTML = `
        <div class="winner-avatar">🥉</div>
        <div class="winner-name-lbl" style="font-size: 1.1rem; font-weight: 800; margin-bottom: 2px;">${third.nickname}</div>
        <div style="font-size: 0.95rem; color: #f59e0b; font-weight: 700; margin-bottom: 6px;">${third.score.toLocaleString()} pts</div>
        <div style="font-size: 0.8rem; color: #74c69d; margin-bottom: 6px;">${third.correctCount}/${this.questions.length} aciertos</div>
        <div class="podium-pedestal">3°</div>
      `;
      this.dom.podiumStageContainer.appendChild(col3);
    }

    // Tabla Completa debajo del podio
    this.dom.podiumFullRankTbody.innerHTML = '';
    const medals = ['🥇', '🥈', '🥉'];
    (leaderboard || []).forEach(p => {
      const tr = document.createElement('tr');
      const medal = medals[p.rank - 1] || `${p.rank}°`;
      tr.innerHTML = `
        <td><strong>${medal}</strong></td>
        <td style="font-weight: 700;">${p.nickname}</td>
        <td style="text-align: center; color: #74c69d; font-weight: 700;">${p.correctCount} / ${this.questions.length}</td>
        <td style="text-align: center; color: var(--text-muted);">${p.totalCorrectTime ? p.totalCorrectTime.toFixed(1) : '0.0'}s</td>
        <td style="text-align: right; font-weight: 800; color: #f59e0b;">${p.score.toLocaleString()} pts</td>
      `;
      this.dom.podiumFullRankTbody.appendChild(tr);
    });
  }

  openAdminPanel() {
    this.showScreen('screenAdminPanel');
    this.renderAdminResultsTable();
  }

  renderAdminResultsTable() {
    this.dom.adminResultsTbody.innerHTML = '';
    const players = this.hostCtrl ? this.hostCtrl.calculateRankings() : [];

    if (players.length === 0) {
      this.dom.adminResultsTbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-dim);">
            No hay participantes registrados todavía en esta sala.
          </td>
        </tr>
      `;
      return;
    }

    players.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="color: #f59e0b;">${p.rank}°</strong></td>
        <td style="font-weight: 700;">${p.nickname}</td>
        <td style="font-weight: 800; color: #74c69d;">${p.score.toLocaleString()} pts</td>
        <td style="text-align: center; color: #74c69d; font-weight: bold;">${p.correctCount}</td>
        <td style="text-align: center; color: #f87171;">${p.incorrectCount + (p.timeoutCount || 0)}</td>
        <td style="text-align: center; color: var(--text-muted);">${p.totalCorrectTime ? p.totalCorrectTime.toFixed(1) : '0.0'}s</td>
        <td style="text-align: center;">
          <button class="btn-secondary" style="padding: 4px 10px; font-size: 0.78rem;">Ver Auditoría</button>
        </td>
      `;
      tr.addEventListener('click', () => {
        window.adminManager.openParticipantAuditModal(p, this.questions);
      });
      this.dom.adminResultsTbody.appendChild(tr);
    });
  }

  /* ==========================================================================
     MODO PARTICIPANTE (CELULAR)
     ========================================================================== */
  startPlayerMode() {
    this.gameMode = 'PLAYER';
    this.dom.headerModeTxt.textContent = 'Misión Participante';
    this.dom.joinErrorBox.classList.remove('visible');
    this.showScreen('screenPlayerJoin');
  }

  handlePlayerJoinSubmit() {
    const roomCode = (this.dom.inputRoomCode.value || '').toUpperCase().trim();
    const nickname = (this.dom.inputNickname.value || '').trim();

    if (!roomCode || roomCode.length < 4) {
      this.showJoinError("Ingresa un código de sala válido.");
      return;
    }
    if (!nickname) {
      this.showJoinError("Por favor ingresa tu nombre o apodo.");
      return;
    }

    this.playerCtrl = new PlayerGameController(window.networkManager, this.questions);
    this.playerCtrl.joinRoom(roomCode, nickname);

    this.dom.playerWaitNick.textContent = nickname;
    this.dom.playerWaitRoom.textContent = roomCode;
    this.dom.headerRoomCode.textContent = roomCode;
    this.dom.headerRoomBadge.style.display = 'inline-flex';

    this.playerCtrl.onError = (msg) => {
      this.showJoinError(msg);
      this.showScreen('screenPlayerJoin');
    };

    this.playerCtrl.onStateChange = (state, data) => {
      this.handlePlayerStateChange(state, data);
    };

    this.showScreen('screenPlayerWait');
  }

  showJoinError(msg) {
    this.dom.joinErrorBox.textContent = msg;
    this.dom.joinErrorBox.classList.add('visible');
    window.soundCtrl.playIncorrect();
  }

  handlePlayerStateChange(state, data) {
    if (state === 'LOBBY') {
      this.showScreen('screenPlayerWait');
    } else if (state === 'QUESTION_ACTIVE') {
      this.showScreen('screenQuiz');
      this.dom.headerScoreBadge.style.display = 'flex';
      this.dom.headerScoreVal.textContent = this.playerCtrl.score;
      this.dom.hostAnswersStatus.style.display = 'none';
      this.dom.playerSubmittedNotice.style.display = 'none';
      this.dom.btnHostPauseToggle.style.display = 'none';

      this.renderQuestionScreen(data, data.questionIndex, false);
    } else if (state === 'ANSWER_SENT') {
      this.dom.optionsContainer.style.display = 'none';
      this.dom.playerSubmittedNotice.style.display = 'block';
      window.soundCtrl.playClick();
    } else if (state === 'ROUND_FEEDBACK') {
      this.dom.optionsContainer.style.display = 'grid';
      this.dom.playerSubmittedNotice.style.display = 'none';
      this.dom.headerScoreVal.textContent = this.playerCtrl.score;

      const myResult = data.myResult;
      const isCorrect = myResult && myResult.isCorrect;
      const points = myResult ? myResult.pointsEarned : 0;

      if (isCorrect) {
        window.soundCtrl.playCorrect();
        this.dom.feedbackStatus.className = 'feedback-status correct';
        this.dom.feedbackStatus.innerHTML = `<span>¡Respuesta Correcta!</span>`;
        this.dom.pointsEarned.textContent = `+${points} pts`;
        this.dom.pointsEarned.style.display = 'inline-block';
      } else {
        window.soundCtrl.playIncorrect();
        this.dom.feedbackStatus.className = 'feedback-status incorrect';
        this.dom.feedbackStatus.innerHTML = `<span>${myResult && myResult.isTimeout ? 'Tiempo Agotado' : 'Incorrecto'}</span>`;
        this.dom.pointsEarned.style.display = 'none';
      }

      this.dom.feedbackExplanation.textContent = data.roundSummary.explanation;
      this.dom.btnNext.style.display = 'none';
      this.dom.feedbackBox.classList.add('visible');

      const buttons = this.dom.optionsContainer.querySelectorAll('.option-btn');
      buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === data.roundSummary.correctAnswer) btn.classList.add('is-correct');
        else if (idx === this.playerCtrl.selectedOption && !isCorrect) btn.classList.add('is-incorrect');
        else btn.classList.add('dimmed');
      });
    } else if (state === 'GAME_OVER') {
      this.showPlayerFinalResults(data);
    }
  }

  showPlayerFinalResults(data) {
    this.showScreen('screenResults');
    const myStats = data.myStats || { score: this.playerCtrl.score, rank: this.playerCtrl.rank, correctCount: 0 };
    const totalQ = this.questions.length;
    const correct = myStats.correctCount || this.playerCtrl.answersHistory.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correct / totalQ) * 100);

    this.dom.finalScore.textContent = myStats.score.toLocaleString();
    this.dom.statCorrect.textContent = correct;
    this.dom.statIncorrect.textContent = totalQ - correct;
    this.dom.statAccuracy.textContent = `${accuracy}%`;
    this.dom.statTime.textContent = `Puesto #${myStats.rank || 1}`;

    let messageText = '';
    if (accuracy >= 80) {
      messageText = '¡Excelente Guardián! Dominas los conceptos de tecnología, economía y sostenibilidad.';
      window.soundCtrl.playVictory();
      window.confettiCannon.fire(4000);
    } else if (accuracy >= 60) {
      messageText = '¡Muy bien! Tienes una sólida comprensión de las herramientas ambientales.';
      window.soundCtrl.playVictory();
      window.confettiCannon.fire(2500);
    } else {
      messageText = '¡Buen intento! Repasa las explicaciones didácticas para fortalecer tus conocimientos.';
    }

    this.dom.performanceText.textContent = messageText;
  }

  renderPlayerAnswersReview() {
    this.dom.reviewList.innerHTML = '';
    this.playerCtrl.answersHistory.forEach((rec, idx) => {
      const q = this.questions[rec.questionIndex];
      const card = document.createElement('div');
      const statusClass = rec.isCorrect ? 'correct' : 'incorrect';
      const statusLabel = rec.isCorrect ? 'Correcto' : 'Incorrecto';
      card.className = `review-item-card ${statusClass}`;

      const chosenText = (rec.chosenIndex >= 0 && q.options[rec.chosenIndex]) ? q.options[rec.chosenIndex] : 'Sin respuesta';
      const correctText = q.options[q.correctAnswer];

      card.innerHTML = `
        <div class="review-card-top" style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="color:#74c69d; font-weight:bold;">P${idx + 1} • ${q.roundName}</span>
          <span class="review-status-tag ${statusClass}">${statusLabel} (+${rec.pointsEarned || 0} pts)</span>
        </div>
        <h4 style="color:#ffffff; margin-bottom:8px;">${q.question}</h4>
        <div style="background:rgba(0,0,0,0.25); padding:10px; border-radius:6px; margin-bottom:8px; font-size:0.92rem;">
          <div style="color:${rec.isCorrect ? '#74c69d' : '#f87171'};"><strong>Tu respuesta:</strong> ${chosenText}</div>
          ${!rec.isCorrect ? `<div style="color:#74c69d; font-weight:bold; margin-top:4px;"><strong>Respuesta correcta:</strong> ${correctText}</div>` : ''}
        </div>
        <div style="font-size:0.9rem; color:var(--text-muted); border-left:2px solid #52b788; padding-left:8px;"><strong>Explicación:</strong> ${q.explanation}</div>
      `;
      this.dom.reviewList.appendChild(card);
    });
  }

  /* ==========================================================================
     MODO PRÁCTICA INDIVIDUAL (SOLO)
     ========================================================================== */
  startSoloMode() {
    this.gameMode = 'SOLO';
    this.dom.headerModeTxt.textContent = 'Modo Práctica Individual (15 Preguntas)';
    this.dom.headerScoreBadge.style.display = 'flex';
    this.dom.headerScoreVal.textContent = '0';
    this.dom.headerRoomBadge.style.display = 'none';

    this.soloIndex = 0;
    this.soloScore = 0;
    this.soloCorrectCount = 0;
    this.soloIncorrectCount = 0;
    this.soloTimeoutCount = 0;
    this.soloUserAnswers = [];
    this.soloTotalTime = 0;

    this.showScreen('screenQuiz');
    this.loadSoloQuestion(0);
  }

  loadSoloQuestion(index) {
    const q = this.questions[index];
    if (!q) return;

    this.soloIndex = index;
    this.soloLocked = false;
    this.soloTimeLeft = (window.CONTEST_CONFIG && window.CONTEST_CONFIG.timerSeconds) || 25;
    this.soloStartTime = Date.now();

    this.dom.btnNext.style.display = 'inline-flex';
    this.dom.btnNext.innerHTML = (index === this.questions.length - 1)
      ? '<span>Ver Resultados</span>'
      : '<span>Siguiente Pregunta</span>';

    this.dom.btnHostPauseToggle.style.display = 'none';
    this.renderQuestionScreen(q, index, false);
    this.startSoloTimer();
  }

  startSoloTimer() {
    clearInterval(this.soloTimer);
    let remainingMs = this.soloTimeLeft * 1000;
    this.updateTimerUI(this.soloTimeLeft, 1);

    this.soloTimer = setInterval(() => {
      remainingMs -= 100;
      const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
      this.updateTimerUI(seconds, remainingMs / (this.soloTimeLeft * 1000));

      if (seconds <= 5 && seconds > 0 && remainingMs % 1000 === 0) {
        window.soundCtrl.playTick();
      }

      if (remainingMs <= 0) {
        clearInterval(this.soloTimer);
        this.handleSoloTimeout();
      }
    }, 100);
  }

  handleSoloAnswer(selectedIndex) {
    if (this.soloLocked) return;
    this.soloLocked = true;
    clearInterval(this.soloTimer);

    const timeSpent = Math.max(0.2, (Date.now() - this.soloStartTime) / 1000);
    this.soloTotalTime += timeSpent;
    const q = this.questions[this.soloIndex];
    const isCorrect = (selectedIndex === q.correctAnswer);

    let points = 0;
    if (isCorrect) {
      this.soloCorrectCount++;
      const timeLeft = Math.max(0, this.soloTimeLeft - timeSpent);
      points = 100 + Math.round(50 * (timeLeft / this.soloTimeLeft));
      this.soloScore += points;
      this.dom.headerScoreVal.textContent = this.soloScore;
      window.soundCtrl.playCorrect();

      this.dom.feedbackStatus.innerHTML = `<span>¡Respuesta Correcta!</span>`;
      this.dom.pointsEarned.textContent = `+${points} pts`;
      this.dom.pointsEarned.style.display = 'inline-block';
    } else {
      this.soloIncorrectCount++;
      window.soundCtrl.playIncorrect();
      this.dom.feedbackStatus.innerHTML = `<span>Respuesta Incorrecta</span>`;
      this.dom.pointsEarned.style.display = 'none';
    }

    const buttons = this.dom.optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctAnswer) btn.classList.add('is-correct');
      else if (idx === selectedIndex && !isCorrect) btn.classList.add('is-incorrect');
      else btn.classList.add('dimmed');
    });

    this.dom.feedbackExplanation.textContent = q.explanation;
    this.dom.feedbackBox.classList.add('visible');

    this.soloUserAnswers.push({
      questionIndex: this.soloIndex,
      chosenIndex: selectedIndex,
      isCorrect: isCorrect,
      isTimeout: false,
      pointsEarned: points,
      timeSpent: timeSpent.toFixed(1)
    });
  }

  handleSoloTimeout() {
    if (this.soloLocked) return;
    this.soloLocked = true;
    this.soloTimeoutCount++;
    this.soloTotalTime += this.soloTimeLeft;

    window.soundCtrl.playTimeout();
    const q = this.questions[this.soloIndex];

    const buttons = this.dom.optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctAnswer) btn.classList.add('is-correct');
      else btn.classList.add('dimmed');
    });

    this.dom.feedbackStatus.innerHTML = `<span>¡Tiempo agotado!</span>`;
    this.dom.pointsEarned.style.display = 'none';
    this.dom.feedbackExplanation.textContent = q.explanation;
    this.dom.feedbackBox.classList.add('visible');

    this.soloUserAnswers.push({
      questionIndex: this.soloIndex,
      chosenIndex: -1,
      isCorrect: false,
      isTimeout: true,
      pointsEarned: 0,
      timeSpent: this.soloTimeLeft
    });
  }

  nextSoloQuestion() {
    if (this.soloIndex < this.questions.length - 1) {
      this.loadSoloQuestion(this.soloIndex + 1);
    } else {
      this.showSoloResults();
    }
  }

  showSoloResults() {
    clearInterval(this.soloTimer);
    this.showScreen('screenResults');

    const totalQ = this.questions.length;
    const accuracy = Math.round((this.soloCorrectCount / totalQ) * 100);

    this.dom.finalScore.textContent = this.soloScore.toLocaleString();
    this.dom.statCorrect.textContent = this.soloCorrectCount;
    this.dom.statIncorrect.textContent = this.soloIncorrectCount + this.soloTimeoutCount;
    this.dom.statAccuracy.textContent = `${accuracy}%`;
    this.dom.statTime.textContent = `${Math.round(this.soloTotalTime)}s`;

    let messageText = '';
    if (accuracy >= 80) {
      messageText = '¡Excelente! Tienes un dominio sobresaliente de los temas expuestos.';
      window.soundCtrl.playVictory();
      window.confettiCannon.fire(4500);
    } else if (accuracy >= 60) {
      messageText = '¡Muy bien! Tienes una buena comprensión de la economía ambiental y la tecnología.';
      window.soundCtrl.playVictory();
      window.confettiCannon.fire(2500);
    } else {
      messageText = '¡Buen esfuerzo! Repasa las explicaciones didácticas de las 15 preguntas.';
    }

    this.dom.performanceText.textContent = messageText;
  }

  renderSoloReview() {
    this.dom.reviewList.innerHTML = '';
    this.soloUserAnswers.forEach((rec, idx) => {
      const q = this.questions[rec.questionIndex];
      const card = document.createElement('div');
      const statusClass = rec.isCorrect ? 'correct' : (rec.isTimeout ? 'timeout' : 'incorrect');
      const statusLabel = rec.isCorrect ? 'Correcto' : (rec.isTimeout ? 'Tiempo agotado' : 'Incorrecto');
      card.className = `review-item-card ${statusClass}`;

      const chosenText = (rec.chosenIndex >= 0 && q.options[rec.chosenIndex]) ? q.options[rec.chosenIndex] : 'Sin respuesta';
      const correctText = q.options[q.correctAnswer];

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="color:#74c69d; font-weight:bold;">P${idx + 1} • ${q.roundName}</span>
          <span class="review-status-tag ${statusClass}">${statusLabel} (+${rec.pointsEarned || 0} pts)</span>
        </div>
        <h4 style="color:#ffffff; margin-bottom:8px;">${q.question}</h4>
        <div style="background:rgba(0,0,0,0.25); padding:10px; border-radius:6px; margin-bottom:8px; font-size:0.92rem;">
          <div style="color:${rec.isCorrect ? '#74c69d' : '#f87171'};"><strong>Tu respuesta:</strong> ${chosenText}</div>
          ${!rec.isCorrect ? `<div style="color:#74c69d; font-weight:bold; margin-top:4px;"><strong>Respuesta correcta:</strong> ${correctText}</div>` : ''}
        </div>
        <div style="font-size:0.9rem; color:var(--text-muted); border-left:2px solid #52b788; padding-left:8px;"><strong>Explicación:</strong> ${q.explanation}</div>
      `;
      this.dom.reviewList.appendChild(card);
    });
  }

  renderPedagogicalReview() {
    this.dom.reviewList.innerHTML = '';
    this.questions.forEach((q, idx) => {
      const card = document.createElement('div');
      card.style.background = 'var(--bg-card)';
      card.style.border = '1px solid var(--border-glass)';
      card.style.borderLeft = '5px solid var(--emerald-fresh)';
      card.style.borderRadius = '12px';
      card.style.padding = '18px 22px';
      card.style.marginBottom = '14px';

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="color:#74c69d; font-weight:bold;">Pregunta ${idx + 1} de 15 • ${q.roundName}</span>
          <span style="background:rgba(82,183,136,0.2); color:#74c69d; padding:2px 10px; border-radius:9999px; font-size:0.8rem; font-weight:bold;">${q.category}</span>
        </div>
        <h4 style="color:#ffffff; margin-bottom:10px; font-size:1.15rem;">${q.question}</h4>
        <div style="background:rgba(0,0,0,0.3); padding:12px; border-radius:8px; margin-bottom:10px;">
          <div style="color:#74c69d; font-weight:bold; font-size:0.95rem;">✓ Respuesta Correcta: ${q.options[q.correctAnswer]}</div>
        </div>
        <div style="font-size:0.95rem; color:var(--text-muted); line-height:1.6; border-left:3px solid #74c69d; padding-left:10px;">
          <strong>Fundamento Didáctico:</strong> ${q.explanation}
        </div>
      `;
      this.dom.reviewList.appendChild(card);
    });
  }

  /* ==========================================================================
     RENDERIZADO COMÚN DE PREGUNTA Y RECURSO VISUAL
     ========================================================================== */
  renderQuestionScreen(q, index, isHost) {
    this.dom.qCounter.textContent = `Pregunta ${index + 1} de ${this.questions.length}`;
    this.dom.qRoundBadge.textContent = q.roundName || `Ronda ${q.roundNumber}`;
    this.dom.progressFill.style.width = `${((index + 1) / this.questions.length) * 100}%`;
    this.dom.questionText.textContent = q.question;

    // Renderizar Recurso Visual (Fotografía o Diagrama SVG)
    if (q.visual) {
      this.dom.questionVisualBox.style.display = 'block';
      this.dom.visualBadge.textContent = q.visual.badge || 'Recurso Técnico';
      this.dom.visualTitle.textContent = q.visual.title || '';
      this.dom.visualContent.innerHTML = q.visual.svg || `<img src="${q.visual.url}" alt="${q.visual.title}" style="max-width:100%; max-height:220px; border-radius:8px;" />`;
      this.dom.visualCaption.textContent = q.visual.caption || '';
    } else {
      this.dom.questionVisualBox.style.display = 'none';
    }

    this.dom.feedbackBox.classList.remove('visible');
    this.dom.optionsContainer.style.display = 'grid';
    this.dom.optionsContainer.innerHTML = '';

    const shapes = ['▲', '◆', '●', '■'];
    q.options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `option-btn opt-${optIdx}`;
      btn.innerHTML = `
        <span class="option-shape">${shapes[optIdx] || '★'}</span>
        <span class="option-text">${optText}</span>
      `;

      if (isHost) {
        btn.style.cursor = 'default';
      } else {
        btn.addEventListener('click', () => {
          if (this.gameMode === 'SOLO') {
            this.handleSoloAnswer(optIdx);
          } else if (this.gameMode === 'PLAYER') {
            this.playerCtrl.submitAnswer(optIdx);
          }
        });
      }

      this.dom.optionsContainer.appendChild(btn);
    });
  }

  updateTimerUI(seconds, fraction) {
    this.dom.timerNumber.textContent = seconds;
    const totalCircumference = 251.2;
    const dashoffset = totalCircumference * (1 - Math.max(0, fraction));
    this.dom.timerSvgProgress.style.strokeDashoffset = dashoffset;

    if (seconds <= 5) {
      this.dom.timerSvgProgress.className = 'timer-circle-progress danger';
    } else if (seconds <= 10) {
      this.dom.timerSvgProgress.className = 'timer-circle-progress warning';
    } else {
      this.dom.timerSvgProgress.className = 'timer-circle-progress';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new QuizApp();
});
