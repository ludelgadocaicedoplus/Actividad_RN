/**
 * MISIÓN: GUARDIANES DE LOS BIENES COMUNES
 * Módulo de Administración Privada de los Organizadores.
 * - Protección por contraseña segura
 * - Panel de control de partida
 * - Sección 'RESULTADOS Y CLASIFICACIÓN'
 * - Auditoría individual de respuestas por participante
 * - Exportación de resultados a CSV / Excel
 */

class AdminManager {
  constructor() {
    this.DEFAULT_PASSWORD = "guardianes2026";
    this.isAuthenticated = false;
    this.sessionKey = "guardianes_admin_session";
    this.customPassKey = "guardianes_admin_pass";
    this.activeTab = "lobby"; // 'lobby' | 'controls' | 'results' | 'settings'

    this.initSession();
  }

  // Verifica sesión previa en localStorage
  initSession() {
    try {
      const savedAuth = sessionStorage.getItem(this.sessionKey);
      if (savedAuth === "true") {
        this.isAuthenticated = true;
      }
    } catch (e) {
      this.isAuthenticated = false;
    }
  }

  getPassword() {
    try {
      return localStorage.getItem(this.customPassKey) || this.DEFAULT_PASSWORD;
    } catch (e) {
      return this.DEFAULT_PASSWORD;
    }
  }

  setPassword(newPass) {
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: "La contraseña debe tener al menos 4 caracteres." };
    }
    try {
      localStorage.setItem(this.customPassKey, newPass.trim());
      return { success: true, message: "Contraseña de organizadores actualizada con éxito." };
    } catch (e) {
      return { success: false, message: "No se pudo guardar la contraseña localmente." };
    }
  }

  login(enteredPass) {
    const valid = this.getPassword();
    if (enteredPass && enteredPass.trim() === valid) {
      this.isAuthenticated = true;
      try {
        sessionStorage.setItem(this.sessionKey, "true");
      } catch (e) {}
      return { success: true };
    }
    return { success: false, message: "Contraseña incorrecta. Acceso exclusivo para organizadores." };
  }

  logout() {
    this.isAuthenticated = false;
    try {
      sessionStorage.removeItem(this.sessionKey);
    } catch (e) {}
  }

  /**
   * Genera el archivo CSV oficial con codificación UTF-8 BOM
   * compatible nativamente con Microsoft Excel y Google Sheets.
   */
  exportResultsToCSV(rankedPlayers, questions) {
    if (!rankedPlayers || rankedPlayers.length === 0) {
      alert("No hay resultados registrados en la partida para exportar.");
      return;
    }

    const bom = "\uFEFF"; // UTF-8 BOM para forzar a Excel a leer tildes y eñes
    let csv = "Posición;Participante;Puntaje Total;Respuestas Correctas;Respuestas Incorrectas / Tiempo;Tiempo Total Acumulado (s);Porcentaje Aciertos (%)";

    // Encabezados de cada una de las 15 preguntas
    questions.forEach((q, idx) => {
      csv += `;P${idx + 1} (${q.category.replace(/;/g, ",")})`;
    });
    csv += "\r\n";

    rankedPlayers.forEach(p => {
      const accuracy = Math.round((p.correctCount / questions.length) * 100);
      let row = [
        p.rank,
        `"${(p.nickname || '').replace(/"/g, '""')}"`,
        p.score,
        p.correctCount,
        p.incorrectCount + (p.timeoutCount || 0),
        p.totalCorrectTime ? p.totalCorrectTime.toFixed(1) : "0.0",
        `${accuracy}%`
      ].join(";");

      // Detalle de cada pregunta
      questions.forEach((q, idx) => {
        const ans = p.answers ? p.answers.find(a => a.questionId === q.id) : null;
        if (!ans) {
          row += ";Sin responder (0 pts)";
        } else if (ans.isTimeout) {
          row += ";Tiempo Agotado (0 pts)";
        } else if (ans.isCorrect) {
          row += `;Correcta (+${ans.pointsEarned} pts en ${ans.timeSpent}s)`;
        } else {
          row += `;Incorrecta (Opción ${String.fromCharCode(65 + ans.chosenIndex)} - 0 pts)`;
        }
      });

      csv += row + "\r\n";
    });

    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `Resultados_Guardianes_Bienes_Comunes_${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Renderiza el modal de inspección individual de respuestas
   */
  openParticipantAuditModal(player, questions) {
    let modal = document.getElementById("admin-player-audit-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "admin-player-audit-modal";
      modal.className = "role-modal-overlay active";
      document.body.appendChild(modal);
    } else {
      modal.classList.add("active");
    }

    const accuracy = Math.round((player.correctCount / questions.length) * 100);

    let rowsHtml = "";
    questions.forEach((q, idx) => {
      const ans = player.answers ? player.answers.find(a => a.questionId === q.id) : null;
      let statusBadge = '<span class="review-status-tag incorrect">✗ Incorrecta</span>';
      let chosenText = "Sin respuesta (Tiempo agotado)";
      let pointsText = "0 pts";
      let timeText = "-";

      if (ans) {
        timeText = `${ans.timeSpent}s`;
        pointsText = `+${ans.pointsEarned || 0} pts`;
        if (ans.isCorrect) {
          statusBadge = '<span class="review-status-tag correct">✓ Correcta</span>';
        } else if (ans.isTimeout) {
          statusBadge = '<span class="review-status-tag timeout">⏱ Tiempo agotado</span>';
        }
        if (ans.chosenIndex >= 0 && q.options[ans.chosenIndex]) {
          chosenText = q.options[ans.chosenIndex];
        }
      }

      rowsHtml += `
        <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-glass); border-radius: 8px; padding: 12px 14px; margin-bottom: 10px; font-size: 0.9rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
            <strong style="color: var(--cyan-ai);">P${idx + 1}. [${q.roundName}] - ${q.category}</strong>
            <div>${statusBadge} <span style="color: var(--solar-amber); font-weight: bold; margin-left: 8px;">${pointsText} (${timeText})</span></div>
          </div>
          <div style="color: #ffffff; margin-bottom: 4px;"><strong>Pregunta:</strong> ${q.question}</div>
          <div style="color: #cbd5e1;"><strong>Respuesta seleccionada:</strong> ${chosenText}</div>
          ${(!ans || !ans.isCorrect) ? `<div style="color: #34d399; font-weight: bold;"><strong>Respuesta correcta:</strong> ${q.options[q.correctAnswer]}</div>` : ''}
        </div>
      `;
    });

    modal.innerHTML = `
      <div class="role-modal-card" style="max-width: 820px; max-height: 85vh; display: flex; flex-direction: column; text-align: left;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 1.5rem; font-weight: 800; color: #ffffff; margin: 0;">Auditoría: ${player.nickname}</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin: 4px 0 0 0;">
              Puesto: <strong style="color: var(--solar-amber);">${player.rank}°</strong> | 
              Puntaje: <strong style="color: #38bdf8;">${player.score} pts</strong> | 
              Aciertos: <strong style="color: #34d399;">${player.correctCount}/${questions.length} (${accuracy}%)</strong>
            </p>
          </div>
          <button id="btn-close-audit-modal" class="btn-icon" style="flex-shrink: 0;">✕</button>
        </div>

        <div style="overflow-y: auto; flex: 1; padding-right: 6px;">
          ${rowsHtml}
        </div>

        <div style="border-top: 1px solid var(--border-glass); padding-top: 14px; margin-top: 12px; display: flex; justify-content: flex-end;">
          <button id="btn-close-audit-modal-2" class="btn-secondary" style="padding: 8px 20px;">Cerrar Auditoría</button>
        </div>
      </div>
    `;

    const closeFn = () => modal.classList.remove("active");
    modal.querySelector("#btn-close-audit-modal").onclick = closeFn;
    modal.querySelector("#btn-close-audit-modal-2").onclick = closeFn;
  }
}

window.adminManager = new AdminManager();
