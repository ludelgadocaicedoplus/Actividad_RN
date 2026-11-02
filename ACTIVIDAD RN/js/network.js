/**
 * Capa de red y sincronización en tiempo real para Eco-IA Quiz.
 * Soporta arquitectura dual:
 * 1. BroadcastChannel / LocalStorage (multiventana / multipestaña local instantánea)
 * 2. WebRTC P2P DataChannels (PeerJS cloud broker para celulares en WiFi / Internet)
 * 3. Conector opcional para Firebase Realtime Database
 */

class NetworkManager {
  constructor() {
    this.role = null; // 'HOST' | 'PLAYER'
    this.roomCode = null;
    this.playerId = null;
    this.nickname = null;
    this.callbacks = {};

    // Canal local para pruebas multi-pestaña
    this.broadcastChannel = null;

    // WebRTC PeerJS
    this.peer = null;
    this.peerConnections = new Map(); // Para Host: Map(playerId -> connection)
    this.hostConnection = null;       // Para Player: connection hacia el Host

    // Estado de transporte activo
    this.useWebRTC = true;
    this.isPeerReady = false;
  }

  on(event, callback) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(callback);
  }

  emitLocal(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(cb => cb(data));
    }
  }

  // Genera un código de sala de 6 caracteres alfanuméricos fácil de leer
  static generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Inicializa la red como ANFITRIÓN (HOST)
   */
  initHost(roomCode) {
    this.role = 'HOST';
    this.roomCode = roomCode.toUpperCase();
    this.playerId = 'HOST';
    this.nickname = 'Anfitrión';

    // 1. Iniciar BroadcastChannel local
    this.initBroadcastChannel();

    // 2. Iniciar WebRTC PeerJS como servidor de la sala
    this.initPeerHost();

    return this.roomCode;
  }

  /**
   * Inicializa la red como PARTICIPANTE (PLAYER)
   */
  initPlayer(roomCode, nickname) {
    this.role = 'PLAYER';
    this.roomCode = roomCode.toUpperCase();
    this.nickname = nickname.trim();
    this.playerId = 'p_' + Math.random().toString(36).substring(2, 9);

    // 1. Iniciar BroadcastChannel local
    this.initBroadcastChannel();

    // 2. Intentar unirse mediante WebRTC PeerJS
    this.initPeerPlayer();

    // 3. Enviar solicitud de unión tanto por WebRTC como por BroadcastChannel
    this.sendToHost({
      type: 'HELLO_JOIN',
      playerId: this.playerId,
      nickname: this.nickname,
      roomCode: this.roomCode
    });

    return this.playerId;
  }

  initBroadcastChannel() {
    try {
      if ('BroadcastChannel' in window) {
        if (this.broadcastChannel) this.broadcastChannel.close();
        this.broadcastChannel = new BroadcastChannel('eco_quiz_' + this.roomCode);
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingMessage(event.data, 'local');
        };
      }
    } catch (e) {
      console.warn("BroadcastChannel no soportado, usando WebRTC", e);
    }
  }

  initPeerHost() {
    // Si PeerJS está disponible globalmente en la ventana o se inyecta
    if (typeof Peer !== 'undefined') {
      try {
        const peerId = 'eco-host-' + this.roomCode;
        this.peer = new Peer(peerId, {
          debug: 1
        });

        this.peer.on('open', (id) => {
          console.log("PeerJS Host listo con ID:", id);
          this.isPeerReady = true;
          this.emitLocal('NET_READY', { mode: 'WebRTC', id: id });
        });

        this.peer.on('connection', (conn) => {
          conn.on('data', (data) => {
            this.handleIncomingMessage(data, conn);
          });
          conn.on('close', () => {
            if (conn.metadata && conn.metadata.playerId) {
              this.emitLocal('PLAYER_DISCONNECTED', { playerId: conn.metadata.playerId });
            }
          });
        });

        this.peer.on('error', (err) => {
          console.warn("PeerJS Host notice:", err);
        });
      } catch (e) {
        console.warn("No se pudo iniciar PeerJS:", e);
      }
    }
  }

  initPeerPlayer() {
    if (typeof Peer !== 'undefined') {
      try {
        this.peer = new Peer({ debug: 1 });
        this.peer.on('open', () => {
          const hostPeerId = 'eco-host-' + this.roomCode;
          this.hostConnection = this.peer.connect(hostPeerId, {
            metadata: { playerId: this.playerId, nickname: this.nickname }
          });

          this.hostConnection.on('open', () => {
            console.log("Conectado con el Anfitrión vía WebRTC!");
            this.sendToHost({
              type: 'HELLO_JOIN',
              playerId: this.playerId,
              nickname: this.nickname,
              roomCode: this.roomCode
            });
          });

          this.hostConnection.on('data', (data) => {
            this.handleIncomingMessage(data, this.hostConnection);
          });

          this.hostConnection.on('close', () => {
            this.emitLocal('HOST_DISCONNECTED', {});
          });
        });
      } catch (e) {
        console.warn("Error en PeerJS Player:", e);
      }
    }
  }

  /**
   * Procesamiento de mensajes entrantes
   */
  handleIncomingMessage(msg, sourceConn) {
    if (!msg || !msg.type) return;

    // Guardar referencia a la conexión del jugador si es el Host
    if (this.role === 'HOST' && msg.playerId && sourceConn && sourceConn !== 'local') {
      this.peerConnections.set(msg.playerId, sourceConn);
      sourceConn.metadata = { playerId: msg.playerId, nickname: msg.nickname };
    }

    // Filtrar si el mensaje no es para esta sala
    if (msg.roomCode && msg.roomCode !== this.roomCode) return;

    // Despachar evento
    this.emitLocal(msg.type, msg);
  }

  /**
   * Envía un mensaje desde el participante hacia el anfitrión
   */
  sendToHost(payload) {
    payload.roomCode = this.roomCode;
    payload.senderId = this.playerId;
    payload.timestamp = Date.now();

    // 1. Enviar por WebRTC si existe
    if (this.hostConnection && this.hostConnection.open) {
      try {
        this.hostConnection.send(payload);
      } catch (e) {}
    }

    // 2. Enviar por BroadcastChannel para soporte multi-pestaña local
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch (e) {}
    }
  }

  /**
   * Envía un mensaje desde el anfitrión hacia todos los participantes (Broadcast)
   */
  broadcast(payload) {
    if (this.role !== 'HOST') return;

    payload.roomCode = this.roomCode;
    payload.senderId = 'HOST';
    payload.timestamp = Date.now();

    // 1. Enviar por WebRTC a cada jugador conectado
    this.peerConnections.forEach((conn) => {
      if (conn && conn.open) {
        try {
          conn.send(payload);
        } catch (e) {}
      }
    });

    // 2. Enviar por BroadcastChannel local
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch (e) {}
    }
  }

  /**
   * Envía un mensaje directo a un jugador específico
   */
  sendToPlayer(targetPlayerId, payload) {
    payload.roomCode = this.roomCode;
    payload.senderId = 'HOST';
    payload.targetPlayerId = targetPlayerId;
    payload.timestamp = Date.now();

    const conn = this.peerConnections.get(targetPlayerId);
    if (conn && conn.open) {
      try {
        conn.send(payload);
      } catch (e) {}
    }

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch (e) {}
    }
  }

  cleanup() {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.peerConnections.clear();
    this.hostConnection = null;
  }
}

window.networkManager = new NetworkManager();
