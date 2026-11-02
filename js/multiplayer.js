/**
 * MISIÓN: GUARDIANES DE LOS BIENES COMUNES
 * Controlador de Lógica Multijugador: Anfitrión (Host) y Participante (Player)
 * Reglas de negocio:
 * - 15 preguntas en 3 rondas
 * - Temporizador autoritativo de 25 segundos
 * - Puntuación: 100 pts base por acierto + bonificación por rapidez hasta 50 pts
 *   Puntos = 100 + Math.round(50 * (tiempoRestante / tiempoTotal))
 * - Reglas de desempate matemáticas estrictas para garantizar UN ÚNICO GANADOR
 */

class HostGameController {
  constructor(network, questions) {
    this.network = network;
    this.questions = questions || QUIZ_QUESTIONS;
    this.roomCode = null;
    this.state = 'IDLE'; // LOBBY | QUESTION_ACTIVE | PAUSED | ROUND_CLOSED | LEADERBOARD | PODIUM
    this.players = new Map(); // id -> { id, nickname, score, correctCount, incorrectCount, timeoutCount, totalCorrectTime, totalTimeAllAnswers, answers: [], isConnected: true, rank: 1 }

    this.currentQuestionIndex = 0;
    this.TIMER_SECONDS = (window.CONTEST_CONFIG && window.CONTEST_CONFIG.timerSeconds) || 25;
    this.timerRemainingMs = this.TIMER_SECONDS * 1000;
    this.questionStartTime = 0;
    this.timerInterval = null;
    this.isPaused = false;
    this.answersInCurrentRound = new Map(); // playerId -> { answerIndex, timeSpent, points, isCorrect }

    this.onStateChange = null;
    this.onPlayerListChange = null;
    this.onAnswerReceived = null;
    this.onTimerTick = null;

    this.setupNetworkHandlers();
  }

  createRoom() {
    this.roomCode = NetworkManager.generateRoomCode();
    this.players.clear();
    this.state = 'LOBBY';
    this.currentQuestionIndex = 0;
    this.network.initHost(this.roomCode);
    return this.roomCode;
  }

  setupNetworkHandlers() {
    // 1. Solicitud de ingreso de un nuevo participante
    this.network.on('HELLO_JOIN', (data) => {
      if (this.state !== 'LOBBY') {
        this.network.sendToPlayer(data.playerId, {
          type: 'JOIN_REJECTED',
          reason: 'GAME_ALREADY_STARTED',
          message: 'La misión ya ha comenzado. Espera a que los organizadores abran una nueva sala.'
        });
        return;
      }

      // Validar apodo no vacío
      const cleanNick = (data.nickname || '').trim();
      if (!cleanNick) {
        this.network.sendToPlayer(data.playerId, {
          type: 'JOIN_REJECTED',
          reason: 'INVALID_NICKNAME',
          message: 'Debes ingresar un nombre o apodo válido para participar.'
        });
        return;
      }

      // Validar apodo duplicado dentro de la misma sala
      let isDuplicate = false;
      for (const [id, p] of this.players.entries()) {
        if (p.nickname.toLowerCase() === cleanNick.toLowerCase() && id !== data.playerId) {
          isDuplicate = true;
          break;
        }
      }

      if (isDuplicate) {
        this.network.sendToPlayer(data.playerId, {
          type: 'JOIN_REJECTED',
          reason: 'DUPLICATE_NAME',
          message: 'Ese nombre o apodo ya fue registrado en esta sala. Por favor elige otro para diferenciarte.'
        });
        return;
      }

      // Registrar jugador
      this.players.set(data.playerId, {
        id: data.playerId,
        nickname: cleanNick,
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        timeoutCount: 0,
        totalCorrectTime: 0,
        totalTimeAllAnswers: 0,
        answers: [],
        isConnected: true,
        rank: 1
      });

      // Confirmar ingreso
      this.network.sendToPlayer(data.playerId, {
        type: 'JOIN_ACCEPTED',
        roomCode: this.roomCode,
        playerId: data.playerId,
        nickname: cleanNick,
        totalQuestions: this.questions.length
      });

      this.broadcastPlayerList();
      if (this.onPlayerListChange) this.onPlayerListChange(Array.from(this.players.values()));
    });

    // 2. Jugador desconectado
    this.network.on('PLAYER_DISCONNECTED', (data) => {
      const p = this.players.get(data.playerId);
      if (p) {
        p.isConnected = false;
        this.broadcastPlayerList();
        if (this.onPlayerListChange) this.onPlayerListChange(Array.from(this.players.values()));
      }
    });

    // 3. Recepción autoritativa de respuestas enviadas desde celulares
    this.network.on('SUBMIT_ANSWER', (data) => {
      if (this.state !== 'QUESTION_ACTIVE' && this.state !== 'PAUSED') return;
      if (data.questionIndex !== this.currentQuestionIndex) return;

      const player = this.players.get(data.playerId);
      if (!player) return;

      // Evitar que el jugador envíe múltiples respuestas en la misma pregunta
      if (this.answersInCurrentRound.has(data.playerId)) {
        return;
      }

      // Cálculo autoritativo de tiempo en el servidor/host
      const timeSpentSec = Math.max(0.1, (Date.now() - this.questionStartTime) / 1000);
      const timeLeftSec = Math.max(0, this.TIMER_SECONDS - timeSpentSec);

      const q = this.questions[this.currentQuestionIndex];
      const isCorrect = (data.answerIndex === q.correctAnswer);

      // Sistema oficial de puntuación transparente:
      // Acierto = 100 base + bonificación por rapidez hasta 50 pts
      let points = 0;
      if (isCorrect && timeSpentSec <= this.TIMER_SECONDS) {
        const speedBonus = Math.round(50 * (timeLeftSec / this.TIMER_SECONDS));
        points = 100 + speedBonus;
        player.correctCount++;
        player.totalCorrectTime += timeSpentSec;
      } else {
        player.incorrectCount++;
      }

      player.score += points;
      player.totalTimeAllAnswers += timeSpentSec;

      const answerRecord = {
        questionId: q.id,
        roundNumber: q.roundNumber,
        chosenIndex: data.answerIndex,
        isCorrect: isCorrect,
        isTimeout: false,
        timeSpent: parseFloat(timeSpentSec.toFixed(2)),
        pointsEarned: points
      };

      player.answers.push(answerRecord);
      this.answersInCurrentRound.set(data.playerId, answerRecord);

      // Confirmar recepción al participante (bloquea la interfaz móvil)
      this.network.sendToPlayer(data.playerId, {
        type: 'ANSWER_ACKNOWLEDGED',
        questionIndex: this.currentQuestionIndex
      });

      if (this.onAnswerReceived) {
        this.onAnswerReceived({
          playerId: data.playerId,
          answeredCount: this.answersInCurrentRound.size,
          totalPlayers: this.getConnectedPlayersCount()
        });
      }

      // Si todos los jugadores conectados respondieron, cerrar la ronda de inmediato
      const activeCount = this.getConnectedPlayersCount();
      if (activeCount > 0 && this.answersInCurrentRound.size >= activeCount) {
        this.closeCurrentRound();
      }
    });
  }

  getConnectedPlayersCount() {
    let count = 0;
    this.players.forEach(p => { if (p.isConnected) count++; });
    return count;
  }

  broadcastPlayerList() {
    const list = Array.from(this.players.values()).map(p => ({
      id: p.id,
      nickname: p.nickname,
      score: p.score,
      isConnected: p.isConnected
    }));
    this.network.broadcast({
      type: 'PLAYER_LIST_UPDATE',
      players: list
    });
  }

  startGame() {
    if (this.players.size === 0) {
      alert("Se requiere al menos un participante conectado para iniciar el concurso.");
      return;
    }
    this.state = 'QUESTION_ACTIVE';
    this.currentQuestionIndex = 0;

    // Reiniciar contadores de cada jugador
    this.players.forEach(p => {
      p.score = 0;
      p.correctCount = 0;
      p.incorrectCount = 0;
      p.timeoutCount = 0;
      p.totalCorrectTime = 0;
      p.totalTimeAllAnswers = 0;
      p.answers = [];
      p.rank = 1;
    });

    this.network.broadcast({
      type: 'GAME_STARTED',
      totalQuestions: this.questions.length,
      contestTitle: (window.CONTEST_CONFIG && window.CONTEST_CONFIG.contestTitle) || "MISIÓN: GUARDIANES DE LOS BIENES COMUNES"
    });

    this.launchQuestion(this.currentQuestionIndex);
  }

  launchQuestion(qIndex) {
    this.currentQuestionIndex = qIndex;
    this.state = 'QUESTION_ACTIVE';
    this.isPaused = false;
    this.answersInCurrentRound.clear();
    this.questionStartTime = Date.now();
    this.timerRemainingMs = this.TIMER_SECONDS * 1000;

    const q = this.questions[qIndex];

    // Transmitir pregunta sin respuesta correcta ni explicación
    this.network.broadcast({
      type: 'QUESTION_ACTIVE',
      questionIndex: qIndex,
      roundNumber: q.roundNumber,
      roundName: q.roundName,
      category: q.category,
      question: q.question,
      options: q.options,
      visual: q.visual,
      timeLimit: this.TIMER_SECONDS,
      serverStartTime: this.questionStartTime
    });

    if (this.onStateChange) this.onStateChange('QUESTION_ACTIVE', { question: q, qIndex: qIndex });

    this.startAuthoritativeTimer();
  }

  startAuthoritativeTimer() {
    clearInterval(this.timerInterval);
    const step = 100;

    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;

      this.timerRemainingMs -= step;
      const seconds = Math.max(0, Math.ceil(this.timerRemainingMs / 1000));
      const fraction = Math.max(0, this.timerRemainingMs / (this.TIMER_SECONDS * 1000));

      if (this.onTimerTick) {
        this.onTimerTick(seconds, fraction);
      }

      if (this.timerRemainingMs <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimerExpired();
      }
    }, step);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.network.broadcast({
      type: this.isPaused ? 'TIMER_PAUSED' : 'TIMER_RESUMED',
      remainingSeconds: Math.ceil(this.timerRemainingMs / 1000)
    });
    return this.isPaused;
  }

  handleTimerExpired() {
    // Para todos los que no contestaron: registrar tiempo agotado con 0 puntos
    const q = this.questions[this.currentQuestionIndex];
    this.players.forEach(player => {
      if (!this.answersInCurrentRound.has(player.id)) {
        player.timeoutCount++;
        player.totalTimeAllAnswers += this.TIMER_SECONDS;
        const record = {
          questionId: q.id,
          roundNumber: q.roundNumber,
          chosenIndex: -1,
          isCorrect: false,
          isTimeout: true,
          timeSpent: this.TIMER_SECONDS,
          pointsEarned: 0
        };
        player.answers.push(record);
        this.answersInCurrentRound.set(player.id, record);
      }
    });

    this.closeCurrentRound();
  }

  closeCurrentRound() {
    clearInterval(this.timerInterval);
    this.state = 'ROUND_CLOSED';

    const q = this.questions[this.currentQuestionIndex];

    // Ahora se revelan la respuesta correcta y la explicación didáctica
    const roundSummary = {
      questionIndex: this.currentQuestionIndex,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      playerResults: {}
    };

    this.players.forEach(p => {
      const ans = this.answersInCurrentRound.get(p.id) || { pointsEarned: 0, isCorrect: false, isTimeout: true };
      roundSummary.playerResults[p.id] = {
        score: p.score,
        pointsEarned: ans.pointsEarned,
        isCorrect: ans.isCorrect,
        isTimeout: ans.isTimeout
      };
    });

    this.network.broadcast({
      type: 'ROUND_CLOSED',
      roundSummary: roundSummary
    });

    if (this.onStateChange) {
      this.onStateChange('ROUND_CLOSED', { question: q, summary: roundSummary });
    }
  }

  showLeaderboard() {
    this.state = 'LEADERBOARD';
    const rankedPlayers = this.calculateRankings();

    this.network.broadcast({
      type: 'LEADERBOARD_UPDATE',
      leaderboard: rankedPlayers
    });

    if (this.onStateChange) {
      this.onStateChange('LEADERBOARD', { leaderboard: rankedPlayers });
    }
  }

  nextQuestionOrFinish() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.launchQuestion(this.currentQuestionIndex + 1);
    } else {
      this.finishGame();
    }
  }

  /**
   * REGLAS DE DESEMPATE MATEMÁTICAS ESTRICTAS (Garantizan un único ganador):
   * 1. Mayor puntuación total.
   * 2. Si hay empate, mayor número de respuestas correctas.
   * 3. Si persiste, menor tiempo total acumulado en las respuestas correctas.
   * 4. Si persiste, menor tiempo total general acumulado.
   * 5. Orden de registro.
   */
  calculateRankings() {
    const list = Array.from(this.players.values());

    list.sort((a, b) => {
      // 1. Mayor puntuación total
      if (b.score !== a.score) return b.score - a.score;
      // 2. Mayor número de aciertos
      if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
      // 3. Menor tiempo acumulado en respuestas correctas
      if (Math.abs(a.totalCorrectTime - b.totalCorrectTime) > 0.01) {
        return a.totalCorrectTime - b.totalCorrectTime;
      }
      // 4. Menor tiempo total acumulado
      if (Math.abs(a.totalTimeAllAnswers - b.totalTimeAllAnswers) > 0.01) {
        return a.totalTimeAllAnswers - b.totalTimeAllAnswers;
      }
      return 0;
    });

    // Asignación de rangos 1..N sin empates forzados en el primer puesto
    list.forEach((p, idx) => {
      p.rank = idx + 1;
    });

    return list;
  }

  finishGame() {
    clearInterval(this.timerInterval);
    this.state = 'PODIUM';

    const ranked = this.calculateRankings();

    // Podio visual con los 3 mejores puestos reales
    const podium = {
      winner: ranked.length > 0 ? ranked[0] : null,
      second: ranked.length > 1 ? ranked[1] : null,
      third: ranked.length > 2 ? ranked[2] : null
    };

    this.network.broadcast({
      type: 'GAME_OVER',
      podium: podium,
      leaderboard: ranked
    });

    if (this.onStateChange) {
      this.onStateChange('PODIUM', { podium: podium, leaderboard: ranked });
    }
  }

  resetGame() {
    clearInterval(this.timerInterval);
    this.state = 'LOBBY';
    this.currentQuestionIndex = 0;
    this.answersInCurrentRound.clear();

    this.createRoom();

    this.network.broadcast({
      type: 'RESTART_GAME',
      newRoomCode: this.roomCode
    });

    if (this.onStateChange) this.onStateChange('LOBBY', {});
  }
}

/**
 * Controlador del Participante (Player Móvil)
 */
class PlayerGameController {
  constructor(network, questions) {
    this.network = network;
    this.questions = questions || QUIZ_QUESTIONS;
    this.playerId = null;
    this.nickname = null;
    this.roomCode = null;

    this.state = 'JOINING'; // JOINING | LOBBY | QUESTION_ACTIVE | ANSWER_SENT | ROUND_FEEDBACK | GAME_OVER
    this.currentQuestion = null;
    this.currentQuestionIndex = 0;
    this.selectedOption = -1;
    this.hasAnswered = false;

    this.score = 0;
    this.rank = 0;
    this.answersHistory = [];

    this.onStateChange = null;
    this.onError = null;

    this.setupNetworkHandlers();
  }

  joinRoom(roomCode, nickname) {
    this.roomCode = roomCode.toUpperCase().trim();
    this.nickname = nickname.trim();
    this.playerId = this.network.initPlayer(this.roomCode, this.nickname);
  }

  setupNetworkHandlers() {
    this.network.on('JOIN_ACCEPTED', (data) => {
      this.state = 'LOBBY';
      if (this.onStateChange) this.onStateChange('LOBBY', data);
    });

    this.network.on('JOIN_REJECTED', (data) => {
      if (this.onError) this.onError(data.message || 'No se pudo ingresar a la sala.');
    });

    this.network.on('QUESTION_ACTIVE', (data) => {
      this.state = 'QUESTION_ACTIVE';
      this.currentQuestionIndex = data.questionIndex;
      this.currentQuestion = data;
      this.selectedOption = -1;
      this.hasAnswered = false;

      if (this.onStateChange) this.onStateChange('QUESTION_ACTIVE', data);
    });

    this.network.on('ANSWER_ACKNOWLEDGED', () => {
      this.state = 'ANSWER_SENT';
      if (this.onStateChange) this.onStateChange('ANSWER_SENT', {});
    });

    this.network.on('ROUND_CLOSED', (data) => {
      this.state = 'ROUND_FEEDBACK';
      const myResult = (data.roundSummary && data.roundSummary.playerResults)
        ? data.roundSummary.playerResults[this.playerId]
        : null;

      if (myResult) {
        this.score = myResult.score;
        this.answersHistory.push({
          questionIndex: data.roundSummary.questionIndex,
          chosenIndex: this.selectedOption,
          correctAnswer: data.roundSummary.correctAnswer,
          explanation: data.roundSummary.explanation,
          isCorrect: myResult.isCorrect,
          pointsEarned: myResult.pointsEarned
        });
      }

      if (this.onStateChange) {
        this.onStateChange('ROUND_FEEDBACK', {
          roundSummary: data.roundSummary,
          myResult: myResult
        });
      }
    });

    this.network.on('LEADERBOARD_UPDATE', (data) => {
      const me = (data.leaderboard || []).find(p => p.id === this.playerId);
      if (me) {
        this.rank = me.rank;
        this.score = me.score;
      }
      if (this.onStateChange) this.onStateChange('LEADERBOARD', data);
    });

    this.network.on('GAME_OVER', (data) => {
      this.state = 'GAME_OVER';
      const me = (data.leaderboard || []).find(p => p.id === this.playerId);
      if (me) {
        this.rank = me.rank;
        this.score = me.score;
      }
      if (this.onStateChange) this.onStateChange('GAME_OVER', {
        podium: data.podium,
        leaderboard: data.leaderboard,
        myStats: me
      });
    });

    this.network.on('RESTART_GAME', (data) => {
      this.state = 'LOBBY';
      this.score = 0;
      this.rank = 0;
      this.answersHistory = [];
      if (this.onStateChange) this.onStateChange('LOBBY', data);
    });
  }

  submitAnswer(optionIndex) {
    if (this.hasAnswered || this.state !== 'QUESTION_ACTIVE') return;
    this.hasAnswered = true;
    this.selectedOption = optionIndex;

    this.network.sendToHost({
      type: 'SUBMIT_ANSWER',
      playerId: this.playerId,
      questionIndex: this.currentQuestionIndex,
      answerIndex: optionIndex
    });
  }
}

window.HostGameController = HostGameController;
window.PlayerGameController = PlayerGameController;
