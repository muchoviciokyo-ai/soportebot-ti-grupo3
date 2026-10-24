/**
 * SoporteBot TI — Grupo 3 · Soporte Informático
 * Chatbot POR REGLAS (palabras clave), sin IA generativa.
 * Cada consulta se registra como una fila nueva en la hoja "Registros".
 * Todas las políticas, plazos, anexos y portales son FICTICIOS.
 */

// ===================== PERSONALIZACIÓN =====================
const BOT = {
  nombre: 'SoporteBot TI',
  subtitulo: 'Mesa de Ayuda · Grupo 3',
  bienvenida: '¡Hola! Soy SoporteBot TI 🤖. Te oriento con problemas de acceso, red, carpetas compartidas e impresoras. ' +
              'Escribe tu consulta o elige un botón. Recuerda: solo oriento, no ejecuto trámites ni reviso estados reales.',
  colores: { primario: '#0b3d91', acento: '#00a3e0', fondo: '#eef5fb' },
  botones: [
    { etiqueta: '🔐 No puedo ingresar', consulta: 'No puedo ingresar al sistema. ¿Qué verifico primero y cuándo escalo el caso?' },
    { etiqueta: '📶 Se cayó la red', consulta: 'La red se cae durante una reunión. ¿Qué pasos sigo y cómo coordino su reprogramación?' },
    { etiqueta: '📁 Carpeta compartida', consulta: '¿Cómo solicito acceso a una carpeta compartida y quién debe autorizarlo?' },
    { etiqueta: '🖨️ Impresora', consulta: 'La impresora no responde antes de una entrega. ¿Qué reviso y qué alternativas tengo?' }
  ]
};

const HOJA_REGISTRO = 'Registros';
const HOJA_FRECUENCIAS = 'Frecuencias';
const CAT_NO_RECONOCIDA = 'No reconocida';

// ===================== REGLAS (categorías, palabras clave, respuestas) =====================
// Palabras sin tildes y en minúsculas. Las frases (con espacio) valen 2 puntos; las palabras, 1.
const REGLAS = [
  {
    categoria: 'Acceso al sistema',
    palabras: ['ingresar', 'ingreso', 'ingresa', 'entrar', 'login', 'logearme', 'sistema', 'contrasena',
               'clave', 'password', 'usuario', 'bloqueado', 'bloqueada', 'credenciales',
               'acceso al sistema', 'iniciar sesion', 'no puedo entrar'],
    respuesta:
      'Verifica primero (en este orden):\n' +
      '1. Bloq Mayús desactivado y usuario bien escrito (sin espacios).\n' +
      '2. Que tengas conexión a la red o VPN de la empresa.\n' +
      '3. Prueba en otro navegador o en una ventana de incógnito.\n' +
      '4. Si olvidaste la clave, restablécela en el portal ficticio autoservicio.empresa-demo.pe.\n\n' +
      'Escala el caso si: tu usuario queda bloqueado (3 intentos fallidos) o el problema sigue después de 15 minutos. ' +
      'Abre un ticket en Mesa de Ayuda (anexo ficticio 4500) adjuntando una captura del mensaje de error. ' +
      'Tiempo de atención referencial: 2 horas hábiles.'
  },
  {
    categoria: 'Red y conectividad',
    palabras: ['red', 'internet', 'wifi', 'conexion', 'conectar', 'desconecta', 'desconecto', 'cayo', 'cae',
               'caida', 'reunion', 'videollamada', 'zoom', 'teams', 'meet', 'lenta', 'senal',
               'sin internet', 'se cayo', 'reprogramar', 'reprogramacion'],
    respuesta:
      'Pasos inmediatos:\n' +
      '1. Revisa el cable de red o reconéctate al Wi-Fi corporativo.\n' +
      '2. Desactiva y activa el adaptador de red (o reinicia el equipo si no responde).\n' +
      '3. Como respaldo, únete a la reunión desde el celular con datos móviles.\n\n' +
      'Coordinación de la reunión:\n' +
      '• Avisa a los participantes por chat o correo que perdiste la conexión.\n' +
      '• Si no te reconectas en 10 minutos, propone un nuevo horario desde el calendario compartido.\n' +
      '• Reporta la caída a Mesa de Ayuda (anexo ficticio 4500) indicando hora, lugar y equipo.'
  },
  {
    categoria: 'Carpetas compartidas',
    palabras: ['carpeta', 'carpetas', 'compartida', 'compartido', 'permiso', 'permisos', 'autorizar',
               'autoriza', 'autorizacion', 'drive', 'archivos', 'lectura', 'edicion',
               'carpeta compartida', 'acceso a una carpeta'],
    respuesta:
      'Para solicitar acceso a una carpeta compartida:\n' +
      '1. Completa el formulario ficticio "Solicitud de accesos" indicando: ruta o nombre de la carpeta, ' +
      'tipo de permiso (lectura o edición) y el motivo.\n' +
      '2. Autorizan: tu jefe inmediato y el propietario de la carpeta.\n' +
      '3. Con ambas aprobaciones, TI otorga el acceso en un plazo referencial de 1 día hábil.\n\n' +
      'Consejo: pide solo el permiso mínimo que necesitas (normalmente "lectura").'
  },
  {
    categoria: 'Impresoras',
    palabras: ['impresora', 'impresoras', 'imprimir', 'imprime', 'imprimo', 'impresion', 'toner',
               'papel', 'atasco', 'atascada', 'escaner', 'cola de impresion', 'no imprime'],
    respuesta:
      'Revisa rápidamente:\n' +
      '1. Que esté encendida, con papel, con tóner y sin hojas atascadas.\n' +
      '2. En tu PC, abre la cola de impresión y cancela los trabajos pendientes.\n' +
      '3. Apaga la impresora 30 segundos y vuelve a enviar el documento.\n\n' +
      'Alternativas si tienes una entrega:\n' +
      '• Envía el documento a otra impresora del piso.\n' +
      '• Exporta a PDF y entrégalo por correo o en una USB.\n' +
      '• Reporta la falla a Mesa de Ayuda (anexo ficticio 4500) con el nombre de la impresora.'
  }
];

const RESPUESTA_NO_RECONOCIDA =
  'No reconocí tu consulta 🤔. Solo puedo orientarte sobre: acceso al sistema, red y conectividad, ' +
  'carpetas compartidas e impresoras.\n\n' +
  'Prueba reformulando con palabras como "contraseña", "internet", "carpeta" o "impresora", o usa los botones. ' +
  'Si es urgente, comunícate con Mesa de Ayuda (anexo ficticio 4500).';

// ===================== WEB APP =====================
function doGet() {
  const plantilla = HtmlService.createTemplateFromFile('Index');
  plantilla.bot = BOT;
  return plantilla.evaluate()
    .setTitle(BOT.nombre + ' · Grupo 3')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    // Permite mostrar el bot dentro de la página de GitHub Pages (iframe)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Llamada desde la interfaz: clasifica, registra y devuelve la respuesta. */
function procesarConsulta(texto) {
  texto = String(texto || '').trim().slice(0, 500);
  if (!texto) return null;
  const regla = clasificar(texto);
  const categoria = regla ? regla.categoria : CAT_NO_RECONOCIDA;
  const respuesta = regla ? regla.respuesta : RESPUESTA_NO_RECONOCIDA;
  registrar(texto, categoria, respuesta);
  return { categoria: categoria, respuesta: respuesta };
}

// ===================== MOTOR DE REGLAS =====================
function normalizar(texto) {
  return texto.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // quita tildes
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

/** Devuelve la regla con mayor puntaje, o null si ninguna coincide. */
function clasificar(texto) {
  const norm = normalizar(texto);
  const tokens = norm.split(' ');
  let mejor = null, mejorPuntaje = 0;
  REGLAS.forEach(function (regla) {
    let puntaje = 0;
    regla.palabras.forEach(function (p) {
      if (p.indexOf(' ') >= 0) {
        if ((' ' + norm + ' ').indexOf(' ' + p + ' ') >= 0) puntaje += 2;
      } else if (tokens.some(function (t) { return coincide(t, p); })) {
        puntaje += 1;
      }
    });
    if (puntaje > mejorPuntaje) { mejor = regla; mejorPuntaje = puntaje; }
  });
  return mejor;
}

/** Coincidencia exacta o tolerante a errores de escritura en palabras largas. */
function coincide(token, palabra) {
  if (token === palabra) return true;
  if (palabra.length < 5 || Math.abs(token.length - palabra.length) > 2) return false;
  const tolerancia = palabra.length >= 9 ? 2 : 1;
  return levenshtein(token, palabra) <= tolerancia;
}

function levenshtein(a, b) {
  const fila = [];
  for (let j = 0; j <= b.length; j++) fila[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let previo = fila[0];
    fila[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = fila[j];
      fila[j] = Math.min(fila[j] + 1, fila[j - 1] + 1, previo + (a[i - 1] === b[j - 1] ? 0 : 1));
      previo = temp;
    }
  }
  return fila[b.length];
}

// ===================== GOOGLE SHEETS =====================
/** Agrega SIEMPRE una fila nueva (nunca sobrescribe). */
function registrar(consulta, categoria, respuesta) {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_REGISTRO);
  // Evita que un texto que empiece con "=" se interprete como fórmula
  if (/^[=+\-@]/.test(consulta)) consulta = "'" + consulta;
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    hoja.appendRow([new Date(), consulta, categoria, respuesta]);
  } finally {
    lock.releaseLock();
  }
}

// ===================== PRUEBAS =====================
const PRUEBAS = [
  { consulta: 'No puedo ingresar al sistema', tipo: 'Base', esperada: 'Acceso al sistema' },
  { consulta: 'Olvidé mi contraseña y mi usuario está bloqueado', tipo: 'Reformulación', esperada: 'Acceso al sistema' },
  { consulta: 'Se cayó la red en plena reunión', tipo: 'Base', esperada: 'Red y conectividad' },
  { consulta: 'Me quedé sin internet durante la videollamada', tipo: 'Reformulación', esperada: 'Red y conectividad' },
  { consulta: '¿Cómo pido acceso a una carpeta compartida y quién lo autoriza?', tipo: 'Base', esperada: 'Carpetas compartidas' },
  { consulta: 'La impresora no responde antes de una entrega', tipo: 'Base', esperada: 'Impresoras' },
  { consulta: 'No puedo imprimr, la impresra no hace nada', tipo: 'Error de escritura', esperada: 'Impresoras' },
  { consulta: '¿Cuál es el menú del comedor hoy?', tipo: 'No reconocida', esperada: CAT_NO_RECONOCIDA }
];

/** Ejecutar desde el editor: envía las 8 consultas ficticias y verifica filas y categorías. */
function ejecutarPruebas() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_REGISTRO);
  const filasAntes = hoja.getLastRow();
  let aciertos = 0;

  PRUEBAS.forEach(function (p, i) {
    const r = procesarConsulta(p.consulta);
    const ok = r.categoria === p.esperada;
    if (ok) aciertos++;
    Logger.log('%s Prueba %s (%s): "%s" → %s%s', ok ? '✅' : '❌', i + 1, p.tipo, p.consulta,
               r.categoria, ok ? '' : ' (esperada: ' + p.esperada + ')');
    Utilities.sleep(1000); // fecha y hora distintas por fila
  });

  SpreadsheetApp.flush();
  const filasNuevas = hoja.getLastRow() - filasAntes;
  Logger.log('Categorías correctas: %s/%s', aciertos, PRUEBAS.length);
  Logger.log('Filas nuevas en "%s": %s (esperadas: %s) %s', HOJA_REGISTRO, filasNuevas, PRUEBAS.length,
             filasNuevas === PRUEBAS.length ? '✅ sin sobrescribir' : '❌');
}

/** Ejecutar UNA VEZ desde el editor: crea hojas, tabla de frecuencias y gráfico. */
function configurarHoja() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('America/Lima');

  const reg = ss.getSheetByName(HOJA_REGISTRO) || ss.insertSheet(HOJA_REGISTRO);
  reg.getRange(1, 1, 1, 4).setValues([['Fecha y hora', 'Consulta', 'Categoría', 'Respuesta']])
    .setFontWeight('bold').setBackground(BOT.colores.primario).setFontColor('#ffffff');
  reg.setFrozenRows(1);
  reg.getRange('A:A').setNumberFormat('dd/mm/yyyy hh:mm:ss');
  reg.setColumnWidth(1, 150).setColumnWidth(2, 320).setColumnWidth(3, 170).setColumnWidth(4, 420);

  const frec = ss.getSheetByName(HOJA_FRECUENCIAS) || ss.insertSheet(HOJA_FRECUENCIAS);
  frec.getCharts().forEach(function (c) { frec.removeChart(c); });
  frec.clear();
  const categorias = REGLAS.map(function (r) { return r.categoria; }).concat(CAT_NO_RECONOCIDA);
  const n = categorias.length;
  frec.getRange(1, 1, 1, 2).setValues([['Categoría', 'N.º de consultas']])
    .setFontWeight('bold').setBackground(BOT.colores.primario).setFontColor('#ffffff');
  frec.getRange(2, 1, n, 1).setValues(categorias.map(function (c) { return [c]; }));
  frec.getRange(2, 2, n, 1).setFormulas(categorias.map(function (_, i) {
    return ['=COUNTIF(' + HOJA_REGISTRO + '!C:C,A' + (i + 2) + ')'];
  }));
  frec.getRange(n + 2, 1, 1, 2).setValues([['TOTAL', '=SUM(B2:B' + (n + 1) + ')']]).setFontWeight('bold');
  frec.setColumnWidth(1, 200).setColumnWidth(2, 140);

  const grafico = frec.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(frec.getRange(1, 1, n + 1, 2))
    .setNumHeaders(1)
    .setPosition(2, 4, 0, 0)
    .setOption('title', 'Consultas por categoría — ' + BOT.nombre)
    .setOption('legend', { position: 'none' })
    .setOption('colors', [BOT.colores.acento])
    .build();
  frec.insertChart(grafico);

  const hoja1 = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
  if (hoja1 && hoja1.getLastRow() === 0 && ss.getSheets().length > 2) ss.deleteSheet(hoja1);
}
