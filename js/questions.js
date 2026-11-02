/**
 * MISIÓN: GUARDIANES DE LOS BIENES COMUNES
 * Banco Oficial de 15 Preguntas distribuidas en 3 Rondas Temáticas.
 * Cada pregunta incluye su recurso visual técnico / gráfico correspondiente.
 */

const CONTEST_CONFIG = {
  contestTitle: "MISIÓN: GUARDIANES DE LOS BIENES COMUNES",
  contestSubtitle: "¿Estás preparado para demostrar cuánto aprendiste sobre tecnología, inteligencia artificial y economía ambiental?",
  timerSeconds: 25,
  rounds: [
    { number: 1, name: "DETECTIVES AMBIENTALES", description: "Monitoreo satelital, sensores remotos, NDVI, drones, IoT y SIG" },
    { number: 2, name: "DECISIONES INTELIGENTES", description: "IA predictiva, mercados, valoración de servicios ecosistémicos, Coase y Ostrom" },
    { number: 3, name: "RETOS EN EL TERRITORIO", description: "Altiplano de Nariño, heladas, agricultura de precisión, gobernanza y KoBold Metals" }
  ]
};

const QUIZ_QUESTIONS = [
  // =========================================================================
  // RONDA 1: DETECTIVES AMBIENTALES (Preguntas 1 a 5)
  // =========================================================================
  {
    id: 1,
    roundNumber: 1,
    roundName: "Ronda 1: Detectives Ambientales",
    category: "Monitoreo Satelital",
    question: "¿Cómo permiten las constelaciones de satélites como Sentinel-2 o Landsat detectar la deforestación de manera oportuna en extensas áreas de bosque?",
    visual: {
      type: "diagram",
      title: "Monitoreo Satelital Óptico Multiespectral",
      badge: "Sensores Remotos",
      caption: "Detección multitemporal de pérdida de dosel arbóreo por reflectancia espectral",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- Orbita y Satélite -->
          <path d="M 50 40 Q 250 15 450 40" stroke="#52b788" stroke-width="2" stroke-dasharray="6 4" opacity="0.6"/>
          <g transform="translate(230, 20)">
            <rect x="0" y="5" width="40" height="22" rx="4" fill="#d8f3dc" stroke="#2d6a4f" stroke-width="2"/>
            <rect x="-35" y="8" width="30" height="16" rx="2" fill="#0284c7" stroke="#38bdf8"/>
            <rect x="45" y="8" width="30" height="16" rx="2" fill="#0284c7" stroke="#38bdf8"/>
            <polygon points="12,27 28,27 20,45" fill="#f59e0b" opacity="0.8"/>
          </g>
          <!-- Haces de escaneo multiespectral -->
          <polygon points="250,45 100,190 400,190" fill="url(#satScan)" opacity="0.35"/>
          <!-- Superficie boscosa y claros de deforestación -->
          <rect x="20" y="190" width="460" height="40" rx="4" fill="#1b4332"/>
          <circle cx="90" cy="180" r="18" fill="#2d6a4f"/>
          <circle cx="120" cy="175" r="22" fill="#40916c"/>
          <circle cx="150" cy="182" r="16" fill="#2d6a4f"/>
          <!-- Parche de deforestación detectado en rojo -->
          <rect x="210" y="180" width="80" height="20" rx="3" fill="#ef4444" opacity="0.85"/>
          <text x="250" y="195" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">ALERTA PÉRDIDA</text>
          <circle cx="340" cy="178" r="20" fill="#2d6a4f"/>
          <circle cx="375" cy="175" r="22" fill="#40916c"/>
          <circle cx="410" cy="182" r="17" fill="#2d6a4f"/>
          <defs>
            <linearGradient id="satScan" x1="250" y1="45" x2="250" y2="190" gradientUnits="userSpaceOnUse">
              <stop stop-color="#52b788" stop-opacity="0.8"/>
              <stop offset="1" stop-color="#52b788" stop-opacity="0.05"/>
            </linearGradient>
          </defs>
        </svg>
      `
    },
    options: [
      "A. Enviando fotografías impresas a las oficinas ambientales una vez al año.",
      "B. Comparando imágenes multiespectrales repetidas en el tiempo para detectar cambios en la reflectancia de la vegetación.",
      "C. Remplazando a todas las autoridades y guardabosques con robots patrulleros.",
      "D. Impidiendo físicamente la entrada de los madereros ilegales mediante láseres espaciales."
    ],
    correctAnswer: 1, // B
    explanation: "Los satélites de observación de la Tierra como Sentinel-2 y Landsat captan firmas espectrales de forma periódica. Cuando el dosel verde desaparece o se degrada, el cambio en la radiación reflejada genera alertas casi en tiempo real."
  },
  {
    id: 2,
    roundNumber: 1,
    roundName: "Ronda 1: Detectives Ambientales",
    category: "NDVI y Vigor Vegetal",
    question: "Observa el gráfico. ¿Por qué el Índice de Vegetación de Diferencia Normalizada (NDVI) utiliza la diferencia entre el Infrarrojo Cercano (NIR) y la Luz Roja Visible (RED)?",
    visual: {
      type: "diagram",
      title: "Firma Espectral del Follaje: NDVI = (NIR - RED) / (NIR + RED)",
      badge: "Índice NDVI",
      caption: "La clorofila absorbe luz roja visible mientras la estructura celular refleja intensamente el infrarrojo cercano",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- Ejes cartesianos -->
          <line x1="60" y1="200" x2="450" y2="200" stroke="#74c69d" stroke-width="1.5"/>
          <line x1="60" y1="200" x2="60" y2="30" stroke="#74c69d" stroke-width="1.5"/>
          <text x="50" y="35" fill="#d8f3dc" font-size="11" text-anchor="end">% Reflectancia</text>
          <text x="440" y="218" fill="#d8f3dc" font-size="11" text-anchor="end">Longitud de onda</text>
          <!-- Marcas de onda -->
          <text x="140" y="215" fill="#f87171" font-size="10" text-anchor="middle">ROJO (Visible: ~660nm)</text>
          <text x="320" y="215" fill="#38bdf8" font-size="10" text-anchor="middle">NIR (Infrarrojo: ~840nm)</text>
          <line x1="140" y1="200" x2="140" y2="40" stroke="#ef4444" stroke-width="1" stroke-dasharray="3 3" opacity="0.4"/>
          <line x1="320" y1="200" x2="320" y2="40" stroke="#0284c7" stroke-width="1" stroke-dasharray="3 3" opacity="0.4"/>
          <!-- Curva Hoja Sana (Verde) -->
          <path d="M 70 185 Q 110 185 140 190 T 190 120 Q 230 65 320 60 T 430 65" stroke="#52b788" stroke-width="3.5" fill="none"/>
          <circle cx="140" cy="190" r="5" fill="#ef4444"/>
          <circle cx="320" cy="60" r="5" fill="#52b788"/>
          <text x="330" y="55" fill="#52b788" font-size="11" font-weight="bold">Hoja Sana (NDVI ~ 0.8)</text>
          <!-- Curva Hoja Estresada/Seca (Amarillo) -->
          <path d="M 70 175 Q 110 170 140 160 T 230 145 Q 280 140 320 135 T 430 130" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="5 3" fill="none"/>
          <circle cx="140" cy="160" r="4" fill="#f59e0b"/>
          <circle cx="320" cy="135" r="4" fill="#f59e0b"/>
          <text x="330" y="130" fill="#f59e0b" font-size="10">Vegetación con Estrés (NDVI ~ 0.3)</text>
        </svg>
      `
    },
    options: [
      "A. Porque la vegetación sana absorbe fuertemente la luz roja para la fotosíntesis y refleja intensamente el infrarrojo cercano.",
      "B. Porque las plantas reflejan únicamente el color rojo e impiden el paso de cualquier otra luz.",
      "C. Porque el infrarrojo caliente quema las hojas y el rojo las enfría de noche.",
      "D. Porque mide directamente el peso en kilogramos de la madera sin necesidad de fórmulas."
    ],
    correctAnswer: 0, // A
    explanation: "La clorofila de las plantas sanas absorbe la luz roja para la fotosíntesis, mientras que la estructura interna de las células del mesófilo foliar refleja intensamente la radiación en el Infrarrojo Cercano (NIR). Esa relación calcula el vigor vegetal."
  },
  {
    id: 3,
    roundNumber: 1,
    roundName: "Ronda 1: Detectives Ambientales",
    category: "Uso de Drones",
    question: "¿Cuál es la principal ventaja técnica de los drones multiespectrales frente a los satélites al monitorear cultivos y microcuencas andinas?",
    visual: {
      type: "diagram",
      title: "Fotogrametría Aérea con Dron Multiespectral",
      badge: "Drones en Ecosistemas",
      caption: "Vuelo bajo la nubosidad con resolución espacial centimétrica en zonas montañosas",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- Nubes altas bloqueando el satélite -->
          <path d="M 40 45 Q 70 25 100 45 Q 130 25 160 45 Q 180 60 160 75 Q 120 85 80 75 Q 40 75 40 45 Z" fill="#64748b" opacity="0.65"/>
          <path d="M 280 40 Q 320 20 360 40 Q 400 20 440 40 Q 460 60 440 75 Q 380 85 330 75 Q 280 75 280 40 Z" fill="#64748b" opacity="0.65"/>
          <text x="100" y="60" fill="#cbd5e1" font-size="10" text-anchor="middle">Nubosidad Andina</text>
          <!-- Dron volando POR DEBAJO de las nubes -->
          <g transform="translate(210, 80)">
            <ellipse cx="40" cy="15" rx="30" ry="8" fill="#1e293b" stroke="#52b788" stroke-width="2"/>
            <line x1="10" y1="15" x2="-5" y2="5" stroke="#94a3b8" stroke-width="2"/>
            <line x1="70" y1="15" x2="85" y2="5" stroke="#94a3b8" stroke-width="2"/>
            <line x1="-15" y1="5" x2="5" y2="5" stroke="#38bdf8" stroke-width="3"/>
            <line x1="75" y1="5" x2="95" y2="5" stroke="#38bdf8" stroke-width="3"/>
            <circle cx="40" cy="24" r="5" fill="#f59e0b"/>
            <!-- Cono de escaneo de alta resolución -->
            <polygon points="40,28 10,130 70,130" fill="#52b788" opacity="0.4"/>
          </g>
          <!-- Cultivos en terraza andina y quebrada -->
          <path d="M 20 220 Q 150 170 260 180 T 480 200 L 480 230 L 20 230 Z" fill="#2d6a4f"/>
          <!-- Río o quebrada -->
          <path d="M 260 180 Q 290 200 320 230" stroke="#0284c7" stroke-width="8" stroke-linecap="round"/>
          <text x="250" y="165" fill="#d8f3dc" font-size="11" font-weight="bold" text-anchor="middle">Resolución Centimétrica (< 3 cm/píxel)</text>
        </svg>
      `
    },
    options: [
      "A. Pueden volar en días nublados por debajo del techo de nubes y proporcionan una resolución espacial centimétrica para inspección detallada.",
      "B. Funcionan sin baterías y pueden monitorear continentes enteros en un solo vuelo.",
      "C. Eliminan automáticamente las plagas sin necesidad de ningún análisis de datos.",
      "D. Cuestan más que un cohete espacial comercial y no generan mapas georreferenciados."
    ],
    correctAnswer: 0, // A
    explanation: "En la región andina la nubosidad constante suele tapar la visión de los satélites ópticos. Los drones vuelan por debajo de las nubes y capturan detalles milimétricos o centimétricos indispensables para la agricultura y el control de quebradas."
  },
  {
    id: 4,
    roundNumber: 1,
    roundName: "Ronda 1: Detectives Ambientales",
    category: "Internet de las Cosas (IoT)",
    question: "En una red de Internet de las Cosas (IoT) aplicada a la gestión ambiental, ¿cuál es la función de los sensores capacitivos de humedad y las estaciones microclimáticas en campo?",
    visual: {
      type: "diagram",
      title: "Arquitectura IoT de Sensores In-Situ y Telemetría",
      badge: "Internet de las Cosas",
      caption: "Sondas en el perfil del suelo y estación meteorológica transmitiendo vía LoRaWAN a la nube",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- Nodo IoT y antena en superficie -->
          <rect x="120" y="70" width="30" height="40" rx="4" fill="#334155" stroke="#74c69d" stroke-width="2"/>
          <line x1="135" y1="70" x2="135" y2="45" stroke="#74c69d" stroke-width="2.5"/>
          <circle cx="135" cy="42" r="3" fill="#38bdf8"/>
          <!-- Ondas de transmisión LoRa / Celular -->
          <path d="M 145 40 Q 165 30 180 40" stroke="#38bdf8" stroke-width="2" fill="none"/>
          <path d="M 150 33 Q 175 20 195 33" stroke="#38bdf8" stroke-width="2" fill="none" opacity="0.6"/>
          <!-- Suelo en capas -->
          <rect x="40" y="110" width="420" height="110" rx="4" fill="#8c6239" opacity="0.7"/>
          <line x1="40" y1="150" x2="460" y2="150" stroke="#c49a6c" stroke-dasharray="4 4"/>
          <!-- Sonda clavada en el suelo -->
          <rect x="132" y="110" width="6" height="85" fill="#0f172a" stroke="#38bdf8"/>
          <!-- Bulbo de humedad medido -->
          <ellipse cx="135" cy="160" rx="35" ry="22" fill="#0284c7" opacity="0.35"/>
          <text x="180" y="165" fill="#38bdf8" font-size="11" font-weight="bold">Contenido Volumétrico de Agua (VWC %)</text>
          <!-- Nube / Servidor receptor -->
          <g transform="translate(360, 40)">
            <ellipse cx="40" cy="25" rx="35" ry="18" fill="#1e293b" stroke="#52b788" stroke-width="2"/>
            <text x="40" y="28" fill="#d8f3dc" font-size="10" font-weight="bold" text-anchor="middle">Plataforma Cloud</text>
          </g>
          <path d="M 200 45 L 320 45" stroke="#52b788" stroke-width="2" stroke-dasharray="4 4"/>
        </svg>
      `
    },
    options: [
      "A. Reemplazar toda el agua del suelo por señales electromagnéticas.",
      "B. Medir variables físicas continuas (como humedad del suelo, temperatura y precipitación) y transmitirlas automáticamente para la toma de decisiones.",
      "C. Bombear fertilizantes químicos sin supervisión ni límites.",
      "D. Funcionar como cámaras de vigilancia para cobrar multas a los animales del bosque."
    ],
    correctAnswer: 1, // B
    explanation: "Los sensores IoT miden in situ variables biofísicas en tiempo real (porcentaje de agua en el suelo, humedad relativa, temperatura) y envían los datos a servidores para programar riegos precisos y emitir alertas tempranas de sequía o heladas."
  },
  {
    id: 5,
    roundNumber: 1,
    roundName: "Ronda 1: Detectives Ambientales",
    category: "Sistemas de Información Geográfica",
    question: "¿De qué manera un Sistema de Información Geográfica (SIG) ayuda a evitar la degradación de las rondas de los ríos y microcuencas?",
    visual: {
      type: "diagram",
      title: "Superposición de Capas de Información Geográfica (SIG)",
      badge: "SIG y Ordenamiento",
      caption: "Integración de capas vectoriales de hidrografía, pendientes y cobertura para delimitar zonas de protección",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- Capa 3: Zonificación final -->
          <g transform="translate(180, 20)">
            <polygon points="40,10 180,0 220,50 80,60" fill="#2d6a4f" opacity="0.8" stroke="#74c69d" stroke-width="2"/>
            <text x="130" y="35" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Capa 3: Zonificación y Buffer (30m)</text>
          </g>
          <!-- Capa 2: Pendientes y Suelo -->
          <g transform="translate(140, 70)">
            <polygon points="40,10 180,0 220,50 80,60" fill="#8c6239" opacity="0.7" stroke="#c49a6c" stroke-width="2"/>
            <text x="130" y="35" fill="#fefae0" font-size="10" font-weight="bold" text-anchor="middle">Capa 2: Modelo Digital de Pendientes</text>
          </g>
          <!-- Capa 1: Red Hídrica -->
          <g transform="translate(100, 120)">
            <polygon points="40,10 180,0 220,50 80,60" fill="#0f172a" opacity="0.85" stroke="#38bdf8" stroke-width="2"/>
            <path d="M 60 40 Q 130 15 200 45" stroke="#38bdf8" stroke-width="4" fill="none"/>
            <text x="130" y="38" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">Capa 1: Red Hidrográfica Vectorial</text>
          </g>
          <!-- Flecha de síntesis -->
          <path d="M 70 140 L 70 40" stroke="#f59e0b" stroke-width="2.5"/>
          <text x="75" y="90" fill="#f59e0b" font-size="11" font-weight="bold">Superposición</text>
          <text x="350" y="210" fill="#d8f3dc" font-size="11" text-anchor="middle">Análisis Espacial Multicriterio</text>
        </svg>
      `
    },
    options: [
      "A. Borrando los mapas viejos para que nadie sepa dónde nacen las fuentes de agua.",
      "B. Permitiendo sobreponer capas de hidrografía, pendientes y cobertura para delimitar zonas de ronda y planificar la conservación.",
      "C. Construyendo muros de concreto directamente desde la pantalla de la computadora.",
      "D. Imponiendo impuestos fijos sin considerar la ubicación de los ecosistemas."
    ],
    correctAnswer: 1, // B
    explanation: "Los SIG permiten la superposición multicriterio de capas espaciales (ríos, pendientes pronunciadas, tipos de vegetación) para delimitar con exactitud las franjas de protección (buffers) y definir el uso del suelo sin comprometer las fuentes de agua."
  },

  // =========================================================================
  // RONDA 2: DECISIONES INTELIGENTES (Preguntas 6 a 10)
  // =========================================================================
  {
    id: 6,
    roundNumber: 2,
    roundName: "Ronda 2: Decisiones Inteligentes",
    category: "IA en Agricultura",
    question: "¿Cómo utiliza la Inteligencia Artificial los modelos predictivos para mejorar el rendimiento de los cultivos y reducir el desperdicio de insumos?",
    visual: {
      type: "diagram",
      title: "Modelos Predictivos y Redes Neuronales en Agricultura",
      badge: "Machine Learning",
      caption: "Integración de variables climáticas históricas, análisis de suelo y datos satelitales",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- Entradas de datos -->
          <rect x="30" y="40" width="100" height="30" rx="5" fill="#1b4332" stroke="#52b788"/>
          <text x="80" y="58" fill="#ffffff" font-size="10" text-anchor="middle">Datos Climáticos</text>
          <rect x="30" y="85" width="100" height="30" rx="5" fill="#1b4332" stroke="#52b788"/>
          <text x="80" y="103" fill="#ffffff" font-size="10" text-anchor="middle">Sensores de Suelo</text>
          <rect x="30" y="130" width="100" height="30" rx="5" fill="#1b4332" stroke="#52b788"/>
          <text x="80" y="148" fill="#ffffff" font-size="10" text-anchor="middle">NDVI Satelital</text>
          <!-- Red Neuronal / Algoritmo IA -->
          <g transform="translate(190, 35)">
            <circle cx="20" cy="25" r="10" fill="#0284c7"/>
            <circle cx="20" cy="65" r="10" fill="#0284c7"/>
            <circle cx="20" cy="105" r="10" fill="#0284c7"/>
            <circle cx="65" cy="45" r="10" fill="#52b788"/>
            <circle cx="65" cy="85" r="10" fill="#52b788"/>
            <circle cx="110" cy="65" r="12" fill="#f59e0b"/>
            <!-- Conexiones -->
            <line x1="30" y1="25" x2="55" y2="45" stroke="#74c69d" stroke-width="1.5"/>
            <line x1="30" y1="65" x2="55" y2="45" stroke="#74c69d" stroke-width="1.5"/>
            <line x1="30" y1="65" x2="55" y2="85" stroke="#74c69d" stroke-width="1.5"/>
            <line x1="30" y1="105" x2="55" y2="85" stroke="#74c69d" stroke-width="1.5"/>
            <line x1="75" y1="45" x2="98" y2="65" stroke="#f59e0b" stroke-width="2"/>
            <line x1="75" y1="85" x2="98" y2="65" stroke="#f59e0b" stroke-width="2"/>
          </g>
          <!-- Salida / Predicción -->
          <rect x="340" y="75" width="130" height="50" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="405" y="96" fill="#f59e0b" font-size="11" font-weight="bold" text-anchor="middle">Recomendación IA:</text>
          <text x="405" y="112" fill="#d8f3dc" font-size="10" text-anchor="middle">-30% Nitrógeno / Riego Martes</text>
          <text x="250" y="215" fill="#74c69d" font-size="11" text-anchor="middle">Optimización de insumos basada en evidencia predictiva</text>
        </svg>
      `
    },
    options: [
      "A. Analizando datos históricos del clima, suelo e imágenes para predecir necesidades exactas de agua y nutrientes.",
      "B. Obligando a los cultivos a crecer en laboratorios subterráneos cerrados.",
      "C. Remplazando las semillas nativas por códigos de computadora no comestibles.",
      "D. Aumentando la dosis de químicos al azar cada semana."
    ],
    correctAnswer: 0, // A
    explanation: "Los algoritmos de aprendizaje automático (Machine Learning) procesan variables meteorológicas, humedad del suelo e índices vegetativos para estimar el momento exacto y la dosis requerida de agua y abono, reduciendo el desperdicio y la lixiviación de nitratos."
  },
  {
    id: 7,
    roundNumber: 2,
    roundName: "Ronda 2: Decisiones Inteligentes",
    category: "Economía de Mercados",
    question: "¿De qué forma la predicción de precios y análisis de volatilidad mediante IA beneficia tanto a los productores agrícolas como al medio ambiente?",
    visual: {
      type: "diagram",
      title: "Modelación de Demanda, Precios y Reducción de Pérdidas",
      badge: "Economía de Recursos",
      caption: "Anticipación de sobreoferta para prevenir desplome de precios y pérdida de alimentos",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- Gráfica de fluctuación de precios -->
          <line x1="50" y1="190" x2="450" y2="190" stroke="#74c69d" stroke-width="1.5"/>
          <line x1="50" y1="190" x2="50" y2="30" stroke="#74c69d" stroke-width="1.5"/>
          <text x="45" y="40" fill="#d8f3dc" font-size="10" text-anchor="end">Precio ($)</text>
          <text x="440" y="205" fill="#d8f3dc" font-size="10" text-anchor="end">Tiempo (Meses)</text>
          <!-- Curva sin predicción (Caída abrupta / Quiebra) -->
          <path d="M 60 100 Q 120 40 180 60 T 260 175 T 350 170" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4 3" fill="none"/>
          <text x="270" y="165" fill="#ef4444" font-size="10">Sobreoferta y desperdicio</text>
          <!-- Curva con pronóstico IA (Estable) -->
          <path d="M 60 100 Q 120 70 180 80 T 260 90 T 380 85" stroke="#52b788" stroke-width="3" fill="none"/>
          <circle cx="260" cy="90" r="5" fill="#f59e0b"/>
          <text x="270" y="85" fill="#52b788" font-size="11" font-weight="bold">Planificación con IA (Precio Equilibrado)</text>
          <rect x="160" y="210" width="220" height="20" rx="4" fill="#1b4332"/>
          <text x="270" y="224" fill="#d8f3dc" font-size="10" text-anchor="middle">Menor huella hídrica y de carbono por alimentos no arrojados</text>
        </svg>
      `
    },
    options: [
      "A. Fija precios monopólicos obligatorios para eliminar a los pequeños agricultores.",
      "B. Permite planificar las siembras para evitar sobreofertas críticas, caídas drásticas de ingresos y pérdida de cosechas en campo.",
      "C. Prohíbe el comercio local de alimentos perecederos.",
      "D. Hace que los alimentos no tengan precio y sean completamente gratuitos."
    ],
    correctAnswer: 1, // B
    explanation: "Cuando los agricultores siembran a ciegas suele ocurrir sobreoferta simultánea, desplome de precios y toneladas de cosechas abandonadas en el campo que desperdician agua y nutrientes. La IA anticipa tendencias de mercado para equilibrar la oferta con la demanda."
  },
  {
    id: 8,
    roundNumber: 2,
    roundName: "Ronda 2: Decisiones Inteligentes",
    category: "Servicios Ecosistémicos",
    question: "Desde la economía ecológica, ¿qué significa hacer una 'valoración económica de los servicios ecosistémicos' regulados por una cuenca boscosa?",
    visual: {
      type: "diagram",
      title: "Valoración Económica de Funciones Ambientales",
      badge: "Economía Ambiental",
      caption: "Costo evitado de tratamiento de agua y beneficios de la captura de carbono frente al valor maderable",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- Balanza comparativa -->
          <line x1="250" y1="70" x2="250" y2="180" stroke="#74c69d" stroke-width="4"/>
          <polygon points="250,55 240,75 260,75" fill="#f59e0b"/>
          <line x1="120" y1="100" x2="380" y2="120" stroke="#d8f3dc" stroke-width="4"/>
          <!-- Plato Izquierdo: Valor de Servicios Ecosistémicos -->
          <rect x="60" y="100" width="120" height="75" rx="6" fill="#1b4332" stroke="#52b788" stroke-width="2"/>
          <text x="120" y="120" fill="#52b788" font-size="11" font-weight="bold" text-anchor="middle">Servicios Vivos:</text>
          <text x="120" y="137" fill="#ffffff" font-size="10" text-anchor="middle">• Purificación de Agua</text>
          <text x="120" y="152" fill="#ffffff" font-size="10" text-anchor="middle">• Regulación Hídrica</text>
          <text x="120" y="167" fill="#ffffff" font-size="10" text-anchor="middle">• Captura de Carbono</text>
          <!-- Plato Derecho: Solo Madera talada -->
          <rect x="320" y="120" width="120" height="60" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="1.5"/>
          <text x="380" y="142" fill="#f87171" font-size="10" font-weight="bold" text-anchor="middle">Enfoque Clásico:</text>
          <text x="380" y="160" fill="#cbd5e1" font-size="10" text-anchor="middle">• Madera comercial ($)</text>
          <text x="250" y="215" fill="#fefae0" font-size="11" text-anchor="middle">Los servicios de soporte y regulación suelen superar el valor extractivo directo</text>
        </svg>
      `
    },
    options: [
      "A. Ponerle una etiqueta con precio de venta en el mercado a cada árbol para talarlo de inmediato.",
      "B. Cuantificar el beneficio económico que brindan funciones naturales como la purificación del agua o la captura de carbono para justificar su preservación.",
      "C. Cobrar la entrada en efectivo a los animales que habiten en el bosque.",
      "D. Demostrar que los recursos naturales no tienen ningún valor para la sociedad humana."
    ],
    correctAnswer: 1, // B
    explanation: "La valoración económica de servicios ecosistémicos permite estimar costos evitados (por ejemplo, millones de pesos ahorrados en plantas de potabilización gracias al bosque que filtra el agua), visibilizando beneficios que el mercado tradicional ignora."
  },
  {
    id: 9,
    roundNumber: 2,
    roundName: "Ronda 2: Decisiones Inteligentes",
    category: "Teorema de Coase",
    question: "El Teorema de Coase plantea que las partes pueden negociar eficientemente ante una externalidad si los costos de transacción son bajos. ¿Cómo contribuye la tecnología a esto?",
    visual: {
      type: "diagram",
      title: "Reducción de Costos de Transacción con Monitoreo Digital",
      badge: "Teorema de Coase",
      caption: "Sensores verificables y contratos inteligentes facilitan acuerdos voluntarios transparentes",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- Parte A: Finca aguas arriba -->
          <rect x="40" y="70" width="120" height="80" rx="8" fill="#1b4332" stroke="#52b788" stroke-width="2"/>
          <text x="100" y="95" fill="#52b788" font-size="11" font-weight="bold" text-anchor="middle">Comunidad A</text>
          <text x="100" y="115" fill="#ffffff" font-size="10" text-anchor="middle">(Aguas Arriba)</text>
          <text x="100" y="135" fill="#cbd5e1" font-size="9" text-anchor="middle">Conserva vegetación</text>
          <!-- Plataforma Digital Intermedia con Sensores Verificables -->
          <rect x="190" y="55" width="120" height="110" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="250" y="78" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="middle">PLATAFORMA</text>
          <text x="250" y="95" fill="#38bdf8" font-size="9" text-anchor="middle">Sensores de Calidad</text>
          <text x="250" y="112" fill="#d8f3dc" font-size="9" text-anchor="middle">Datos Verificables</text>
          <text x="250" y="135" fill="#52b788" font-size="9" font-weight="bold" text-anchor="middle">Pago por Servicios</text>
          <text x="250" y="150" fill="#fefae0" font-size="8" text-anchor="middle">(Bajos Costos Transacción)</text>
          <!-- Parte B: Usuarios aguas abajo -->
          <rect x="340" y="70" width="120" height="80" rx="8" fill="#1b4332" stroke="#52b788" stroke-width="2"/>
          <text x="400" y="95" fill="#52b788" font-size="11" font-weight="bold" text-anchor="middle">Comunidad B</text>
          <text x="400" y="115" fill="#ffffff" font-size="10" text-anchor="middle">(Aguas Abajo)</text>
          <text x="400" y="135" fill="#cbd5e1" font-size="9" text-anchor="middle">Recibe agua limpia</text>
          <!-- Flechas de acuerdo -->
          <path d="M 160 100 L 190 100" stroke="#52b788" stroke-width="2.5"/>
          <path d="M 340 120 L 310 120" stroke="#f59e0b" stroke-width="2.5"/>
          <text x="250" y="210" fill="#d8f3dc" font-size="11" text-anchor="middle">La información simétrica y auditable facilita acuerdos directos de compensación</text>
        </svg>
      `
    },
    options: [
      "A. Aumentando la burocracia y los trámites notariales en papel.",
      "B. Proporcionando datos transparentes, mediciones objetivas y plataformas digitales que reducen el costo de vigilar y verificar acuerdos ambientales.",
      "C. Obligando a que los jueces decidan cada disputa ambiental sin consultar a las comunidades.",
      "D. Eliminando los derechos de propiedad de todas las partes involucradas."
    ],
    correctAnswer: 1, // B
    explanation: "El Teorema de Coase demuestra que cuando negociar y verificar el cumplimiento es barato (bajos costos de transacción), las partes resuelven las externalidades. Sensores y registros digitales transparentes reducen las asimetrías de información y facilitan pagos por servicios ambientales."
  },
  {
    id: 10,
    roundNumber: 2,
    roundName: "Ronda 2: Decisiones Inteligentes",
    category: "Gobernanza y Regla de Hotelling",
    question: "Elinor Ostrom demostró que las comunidades pueden gobernar sus bienes comunes sin colapsar. ¿Cuál es el papel clave de la tecnología en este esquema comunitario?",
    visual: {
      type: "diagram",
      title: "Gobernanza de Bienes Comunes (Elinor Ostrom) y Trazabilidad",
      badge: "Gobernanza de Comunes",
      caption: "El monitoreo transparente compartido inhibe al infractor y fortalece la confianza colectiva",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- Nodo Central: Recurso Común Compartido -->
          <circle cx="250" cy="110" r="45" fill="#0284c7" stroke="#38bdf8" stroke-width="2.5" opacity="0.8"/>
          <text x="250" y="105" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">FUENTE HÍDRICA</text>
          <text x="250" y="120" fill="#d8f3dc" font-size="9" text-anchor="middle">COMÚN</text>
          <!-- Nodos de la comunidad alrededor -->
          <circle cx="140" cy="60" r="22" fill="#1b4332" stroke="#52b788" stroke-width="2"/>
          <text x="140" y="64" fill="#d8f3dc" font-size="9" font-weight="bold" text-anchor="middle">Usuario 1</text>
          <circle cx="360" cy="60" r="22" fill="#1b4332" stroke="#52b788" stroke-width="2"/>
          <text x="360" y="64" fill="#d8f3dc" font-size="9" font-weight="bold" text-anchor="middle">Usuario 2</text>
          <circle cx="160" cy="170" r="22" fill="#1b4332" stroke="#52b788" stroke-width="2"/>
          <text x="160" y="174" fill="#d8f3dc" font-size="9" font-weight="bold" text-anchor="middle">Usuario 3</text>
          <circle cx="340" cy="170" r="22" fill="#1b4332" stroke="#52b788" stroke-width="2"/>
          <text x="340" y="174" fill="#d8f3dc" font-size="9" font-weight="bold" text-anchor="middle">Usuario 4</text>
          <!-- Telemetría y reglas visibles a todos -->
          <rect x="180" y="200" width="140" height="24" rx="4" fill="#0f172a" stroke="#f59e0b"/>
          <text x="250" y="216" fill="#f59e0b" font-size="9" font-weight="bold" text-anchor="middle">Monitoreo Mutuo Transparente</text>
          <line x1="162" y1="65" x2="210" y2="90" stroke="#74c69d" stroke-dasharray="3 3"/>
          <line x1="338" y1="65" x2="290" y2="90" stroke="#74c69d" stroke-dasharray="3 3"/>
          <line x1="178" y1="158" x2="215" y2="130" stroke="#74c69d" stroke-dasharray="3 3"/>
          <line x1="322" y1="158" x2="285" y2="130" stroke="#74c69d" stroke-dasharray="3 3"/>
        </svg>
      `
    },
    options: [
      "A. Reemplazar la asamblea comunitaria por un algoritmo privado cerrado.",
      "B. Facilitar la vigilancia mutua transparente y el cumplimiento de las reglas comunitarias para evitar abusos o sobreexplotación.",
      "C. Vender el recurso comunitario a una empresa multinacional en secreto.",
      "D. Permitir que quien tenga el sensor más caro se quede con todo el recurso."
    ],
    correctAnswer: 1, // B
    explanation: "Uno de los 8 principios de Elinor Ostrom para la gestión exitosa de los bienes comunes es el 'Monitoreo efectivo y transparente'. La tecnología sirve como herramienta pública donde todos ven los consumos y el estado del recurso, disuadiendo a quienes intentan violar los acuerdos."
  },

  // =========================================================================
  // RONDA 3: RETOS EN EL TERRITORIO (Casos Reales y Nariño) (Preguntas 11 a 15)
  // =========================================================================
  {
    id: 11,
    roundNumber: 3,
    roundName: "Ronda 3: Retos en el Territorio",
    category: "Altiplano Nariñense",
    question: "Una finca ganadera en el altiplano de Nariño (Túquerres/Guachucal) sufre pérdidas severas por heladas nocturnas que queman las pasturas. ¿Cómo pueden ayudar la IA y los sensores IoT (como Microsoft DeepMC/FarmBeats)?",
    visual: {
      type: "diagram",
      title: "Predicción de Heladas en el Altiplano Nariñense con IoT e IA",
      badge: "Contexto Nariño",
      caption: "Sensores a nivel de suelo detectan inversión térmica y modelos de IA emiten alerta previa",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- Paisaje Altiplano Nariñense / Volcanes al fondo -->
          <polygon points="40,160 140,70 230,160" fill="#2d6a4f" opacity="0.6"/>
          <polygon points="180,160 290,50 400,160" fill="#1b4332" opacity="0.8"/>
          <!-- Cielo nocturno despejado (causa de helada por radiación) -->
          <circle cx="430" cy="40" r="14" fill="#fefae0"/>
          <text x="430" y="65" fill="#cbd5e1" font-size="9" text-anchor="middle">Cielo Despejado</text>
          <!-- Pasturas y vacas lecheras en altiplano -->
          <rect x="20" y="160" width="460" height="70" rx="4" fill="#40916c"/>
          <!-- Sensor IoT en pastura -->
          <line x1="120" y1="160" x2="120" y2="120" stroke="#f59e0b" stroke-width="2.5"/>
          <circle cx="120" cy="115" r="5" fill="#ef4444"/>
          <!-- Alerta de helada emitida a las 7:00 PM -->
          <rect x="230" y="105" width="210" height="45" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
          <text x="335" y="122" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">ALERTA IA: Helada Inminente (3:00 AM)</text>
          <text x="335" y="138" fill="#d8f3dc" font-size="9" text-anchor="middle">Riego por aspersión preventivo activado</text>
          <text x="250" y="215" fill="#fefae0" font-size="10" text-anchor="middle">La IA microclimática anticipa la caída bajo 0°C con horas de ventaja</text>
        </svg>
      `
    },
    options: [
      "A. Generando calor artificial con fuegos artificiales satelitales.",
      "B. Monitoreando microclima a ras de suelo y entrenando redes neuronales para predecir con horas de anticipación el descenso térmico bajo 0°C y activar medidas preventivas.",
      "C. Vendiendo el ganado antes del atardecer para comprarlo de nuevo al día siguiente.",
      "D. Cubriendo todo el municipio de Guachucal con una manta plástica gigante."
    ],
    correctAnswer: 1, // B
    explanation: "Modelos como DeepMC (desarrollados para contextos agropecuarios) combinan pronósticos generales con estaciones IoT a ras de suelo. Al predecir la caída térmica 6 a 12 horas antes, el productor puede activar aspersores antiheladas, proteger pastos y abrigar terneros."
  },
  {
    id: 12,
    roundNumber: 3,
    roundName: "Ronda 3: Retos en el Territorio",
    category: "Vigilancia Forestal Comunitaria",
    question: "Una comunidad indígena o campesina en los bosques andinos necesita frenar la tala ilegal. ¿Por qué la combinación de alertas satelitales con patrullas de drones es la estrategia más efectiva?",
    visual: {
      type: "diagram",
      title: "Esquema Híbrido: Detección Satelital + Verificación con Dron",
      badge: "Vigilancia Comunitaria",
      caption: "El satélite alerta sobre la coordenada global y el dron registra la evidencia legal en campo",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- 1. Alerta Satélite (Macro) -->
          <rect x="30" y="60" width="130" height="90" rx="6" fill="#1b4332" stroke="#52b788" stroke-width="2"/>
          <text x="95" y="85" fill="#52b788" font-size="10" font-weight="bold" text-anchor="middle">1. ALERTA GLOBAL</text>
          <text x="95" y="105" fill="#ffffff" font-size="9" text-anchor="middle">Satélites (GFW / Planet)</text>
          <text x="95" y="125" fill="#ef4444" font-size="9" font-weight="bold" text-anchor="middle">Píxel sospechoso</text>
          <text x="95" y="140" fill="#cbd5e1" font-size="8" text-anchor="middle">(Coordenada GPS)</text>
          <!-- Flecha de despacho -->
          <path d="M 160 105 L 195 105" stroke="#f59e0b" stroke-width="2.5"/>
          <!-- 2. Vuelo focalizado de Dron (Micro) -->
          <rect x="195" y="60" width="130" height="90" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="260" y="85" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="middle">2. VERIFICACIÓN DRON</text>
          <text x="260" y="105" fill="#d8f3dc" font-size="9" text-anchor="middle">Vuelo directo al punto</text>
          <text x="260" y="122" fill="#38bdf8" font-size="9" text-anchor="middle">Sin arriesgar vidas</text>
          <text x="260" y="140" fill="#52b788" font-size="8" text-anchor="middle">Foto en alta resolución</text>
          <!-- Flecha de acción legal -->
          <path d="M 325 105 L 360 105" stroke="#52b788" stroke-width="2.5"/>
          <!-- 3. Guardia Comunitaria y Autoridad -->
          <rect x="360" y="60" width="115" height="90" rx="6" fill="#1b4332" stroke="#74c69d" stroke-width="2"/>
          <text x="417" y="85" fill="#74c69d" font-size="10" font-weight="bold" text-anchor="middle">3. ACCIÓN LEGAL</text>
          <text x="417" y="105" fill="#ffffff" font-size="9" text-anchor="middle">Guardia indígena</text>
          <text x="417" y="122" fill="#ffffff" font-size="9" text-anchor="middle">y autoridad ambiental</text>
          <text x="417" y="140" fill="#fefae0" font-size="8" text-anchor="middle">Pruebas georreferenciadas</text>
          <text x="250" y="205" fill="#d8f3dc" font-size="11" text-anchor="middle">Monitoreo híbrido seguro, económico y de rápida respuesta</text>
        </svg>
      `
    },
    options: [
      "A. Porque el satélite detecta la anomalía a gran escala y el dron va directamente a la coordenada para recolectar pruebas georreferenciadas sin exponer a los guardabosques.",
      "B. Porque los satélites confiscan las motosierras desde el espacio automáticamente.",
      "C. Porque los drones eliminan la necesidad de tener comunidades viviendo en el territorio.",
      "D. Porque los taladores no saben qué es un dron y se asustan sin importar la ley."
    ],
    correctAnswer: 0, // A
    explanation: "El monitoreo satelital escanea miles de hectáreas y entrega coordenadas de alerta temprana. La comunidad despacha un dron directamente a ese punto para registrar evidencia fotográfica con fecha y GPS sin entrar en confrontaciones directas peligrosas."
  },
  {
    id: 13,
    roundNumber: 3,
    roundName: "Ronda 3: Retos en el Territorio",
    category: "Agricultura de Precisión",
    question: "Un agricultor riega su terreno por igual con aspersores fijos, provocando encharcamiento en las zonas bajas y sequedad en las laderas. ¿Cómo soluciona esto la tecnología de Riego de Tasa Variable (VRI)?",
    visual: {
      type: "diagram",
      title: "Riego de Tasa Variable (VRI) según Mapeo de Suelos",
      badge: "Riego de Precisión",
      caption: "Ajuste diferencial de caudal por zonas según mapas de elevación y conductividad eléctrica",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- Terreno con ladera y zona baja -->
          <path d="M 40 180 Q 200 130 460 175 L 460 220 L 40 220 Z" fill="#8c6239" opacity="0.6"/>
          <!-- Zona Ladera Alta (Necesita más agua) -->
          <rect x="70" y="80" width="100" height="50" rx="4" fill="#0f172a" stroke="#38bdf8"/>
          <text x="120" y="100" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">Zona Ladera Alta</text>
          <text x="120" y="118" fill="#ffffff" font-size="9" text-anchor="middle">Riego: 100% Caudal</text>
          <!-- Zona Media -->
          <rect x="200" y="80" width="100" height="50" rx="4" fill="#0f172a" stroke="#52b788"/>
          <text x="250" y="100" fill="#52b788" font-size="10" font-weight="bold" text-anchor="middle">Zona Meseta</text>
          <text x="250" y="118" fill="#ffffff" font-size="9" text-anchor="middle">Riego: 60% Caudal</text>
          <!-- Zona Depresión (Riesgo encharcamiento) -->
          <rect x="330" y="80" width="110" height="50" rx="4" fill="#0f172a" stroke="#f59e0b"/>
          <text x="385" y="100" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="middle">Zona Depresión</text>
          <text x="385" y="118" fill="#ffffff" font-size="9" text-anchor="middle">Riego: 20% (Evita hongo)</text>
          <!-- Boquillas controladas por GPS -->
          <line x1="120" y1="130" x2="120" y2="160" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3 2"/>
          <line x1="250" y1="130" x2="250" y2="150" stroke="#52b788" stroke-width="1.5" stroke-dasharray="3 2"/>
          <line x1="385" y1="130" x2="385" y2="165" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 2"/>
          <text x="250" y="210" fill="#d8f3dc" font-size="11" text-anchor="middle">Ahorro de hasta 40% de agua evitando lixiviación y enfermedades de raíz</text>
        </svg>
      `
    },
    options: [
      "A. Deteniendo el cultivo de plantas para dedicarse únicamente a la minería.",
      "B. Con sensores y válvulas inteligentes que abren o cierran boquillas según la humedad específica de cada sector del lote.",
      "C. Inundando todo el valle con agua de río sin medir.",
      "D. Esperando a que llueva para no gastar dinero en tecnología."
    ],
    correctAnswer: 1, // B
    explanation: "El Riego de Tasa Variable (Variable Rate Irrigation - VRI) utiliza mapas de conductividad de suelo y sensores de humedad para comandar electroválvulas individuales, aplicando la cantidad exacta de milímetros que requiere cada metro cuadrado del terreno."
  },
  {
    id: 14,
    roundNumber: 3,
    roundName: "Ronda 3: Retos en el Territorio",
    category: "Gobernanza del Agua",
    question: "En una cuenca comunitaria varios usuarios sobreexplotan una quebrada. Aunque se instalen sensores de caudal de última tecnología, ¿por qué la tecnología por sí sola NO resuelve el problema?",
    visual: {
      type: "diagram",
      title: "La Tecnología como Herramienta vs. Gobernanza Social",
      badge: "Límites de la Tecnología",
      caption: "Los sensores proporcionan datos objetivos, pero las reglas comunitarias y sanciones definen el uso",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- Bloque Tecnología -->
          <rect x="40" y="60" width="180" height="120" rx="8" fill="#1b4332" stroke="#52b788" stroke-width="2"/>
          <text x="130" y="90" fill="#52b788" font-size="12" font-weight="bold" text-anchor="middle">Tecnología (Datos)</text>
          <text x="130" y="115" fill="#ffffff" font-size="10" text-anchor="middle">• Mide caudales exactos</text>
          <text x="130" y="135" fill="#ffffff" font-size="10" text-anchor="middle">• Detecta sobreconsumo</text>
          <text x="130" y="155" fill="#cbd5e1" font-size="10" text-anchor="middle">¡Pero NO puede obligar!</text>
          <!-- Signo Más -->
          <text x="250" y="125" fill="#f59e0b" font-size="28" font-weight="bold" text-anchor="middle">+</text>
          <!-- Bloque Gobernanza Comunitaria -->
          <rect x="280" y="60" width="180" height="120" rx="8" fill="#1b4332" stroke="#f59e0b" stroke-width="2"/>
          <text x="370" y="90" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">Gobernanza Institucional</text>
          <text x="370" y="115" fill="#ffffff" font-size="10" text-anchor="middle">• Acuerdos legítimos</text>
          <text x="370" y="135" fill="#ffffff" font-size="10" text-anchor="middle">• Sanciones graduadas</text>
          <text x="370" y="155" fill="#ffffff" font-size="10" text-anchor="middle">• Resolución de conflictos</text>
          <text x="250" y="210" fill="#fefae0" font-size="11" text-anchor="middle">Sin legitimidad social ni acuerdos vinculantes, el dato del sensor se ignora</text>
        </svg>
      `
    },
    options: [
      "A. Porque los sensores atraen plagas y rayos durante las tormentas.",
      "B. Porque los datos solo muestran lo que ocurre; sin acuerdos colectivos, sanciones graduales, legitimidad y gobernanza comunitaria no hay cambio de conducta.",
      "C. Porque la tecnología solo funciona en países de Europa o Norteamérica.",
      "D. Porque los ríos cambian de cauce cada hora impidiendo cualquier medición."
    ],
    correctAnswer: 1, // B
    explanation: "Como enfatizaba Elinor Ostrom, la información es una condición necesaria pero no suficiente. Un sensor puede alertar que un usuario está extrayendo más agua de la debida, pero sin un comité de cuenca con reglas acordadas y sanciones sociales, la sobreexplotación continúa."
  },
  {
    id: 15,
    roundNumber: 3,
    roundName: "Ronda 3: Retos en el Territorio",
    category: "Minerales Críticos e IA",
    question: "En la transición energética, empresas como KoBold Metals utilizan algoritmos de Inteligencia Artificial para prospectar yacimientos de cobre y cobalto. ¿Cuál es el principal beneficio ambiental y económico de este enfoque?",
    visual: {
      type: "diagram",
      title: "Exploración Minera Guiada por Inteligencia Artificial (Caso KoBold)",
      badge: "IA y Minerales Críticos",
      caption: "Fusión de datos geológicos y geofísicos históricos para predecir anomalías sin perforaciones masivas",
      svg: `
        <svg viewBox="0 0 500 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:220px;border-radius:12px;background:#0d2319;">
          <!-- Modelo tradicional vs Modelo IA -->
          <!-- Tradicional: Múltiples perforaciones a ciegas que deforestan -->
          <g transform="translate(40, 50)">
            <rect x="0" y="0" width="180" height="130" rx="6" fill="#1e293b" stroke="#ef4444"/>
            <text x="90" y="22" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="middle">Exploración Clásica</text>
            <!-- Líneas de perforación invasivas -->
            <line x1="30" y1="40" x2="30" y2="110" stroke="#ef4444" stroke-width="2"/>
            <line x1="60" y1="40" x2="60" y2="110" stroke="#ef4444" stroke-width="2"/>
            <line x1="90" y1="40" x2="90" y2="110" stroke="#ef4444" stroke-width="2"/>
            <line x1="120" y1="40" x2="120" y2="110" stroke="#ef4444" stroke-width="2"/>
            <line x1="150" y1="40" x2="150" y2="110" stroke="#ef4444" stroke-width="2"/>
            <text x="90" y="125" fill="#fca5a5" font-size="9" text-anchor="middle">Alto impacto y alto costo</text>
          </g>
          <!-- Modelo IA: Fusión de capas y 1 sola perforación certera -->
          <g transform="translate(280, 50)">
            <rect x="0" y="0" width="180" height="130" rx="6" fill="#1b4332" stroke="#52b788"/>
            <text x="90" y="22" fill="#52b788" font-size="10" font-weight="bold" text-anchor="middle">Modelo Predictivo IA</text>
            <!-- Depósito detectado con precisión -->
            <ellipse cx="90" cy="90" rx="45" ry="20" fill="#f59e0b" opacity="0.6"/>
            <text x="90" y="93" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Cobre / Cobalto</text>
            <!-- Una única perforación confirmatoria -->
            <line x1="90" y1="35" x2="90" y2="85" stroke="#38bdf8" stroke-width="3"/>
            <circle cx="90" cy="85" r="4" fill="#38bdf8"/>
            <text x="90" y="125" fill="#d8f3dc" font-size="9" text-anchor="middle">-80% Huella de perforación</text>
          </g>
          <text x="250" y="210" fill="#fefae0" font-size="11" text-anchor="middle">Descubrimiento más rápido y con mínima alteración del paisaje superficial</text>
        </svg>
      `
    },
    options: [
      "A. Reduce drásticamente la cantidad de perforaciones exploratorias invasivas y caminos de acceso, concentrando la prospección en puntos de alta certeza.",
      "B. Sintetiza cobre y cobalto artificialmente en computadoras sin tocar ningún mineral real.",
      "C. Garantiza que la minería nunca consuma energía ni agua en ningún proceso de refinación.",
      "D. Permite extraer minerales sin necesidad de permisos legales ni consultas previas."
    ],
    correctAnswer: 0, // A
    explanation: "La exploración minera tradicional abre cientos de trochas y plataformas de perforación con fuerte impacto en el suelo y los bosques. Algoritmos de IA integran gigabytes de datos gravimétricos, magnéticos y satelitales para señalar anomalías profundas reduciendo drásticamente las perforaciones a ciegas."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONTEST_CONFIG, QUIZ_QUESTIONS };
}
