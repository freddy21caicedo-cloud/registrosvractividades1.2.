/**
 * Google Apps Script para registrar visitas con imagen incrustada DENTRO de la celda.
 *
 * ⚠️ COPIA TODO ESTE CÓDIGO EN TU APPS SCRIPT Y GENERA UNA NUEVA VERSIÓN.
 *
 * Instrucciones:
 * 1. En tu Google Sheet, ve a Extensiones > Apps Script.
 * 2. Borra TODO el código existente y pega este código completo.
 * 3. Guarda (Ctrl+S).
 * 4. Implementar > Gestionar implementaciones > Editar (lápiz) > Nueva versión > Implementar.
 * 5. Ejecutar como: "Tú"  |  Acceso: "Cualquiera".
 * 6. Si pide autorizar permisos, acéptalos todos.
 */

// API Key configurada para conexión directa con la IA de Google Gemini.
var GEMINI_API_KEY = "AQ.Ab8RN6LnrVKgJxMmXOTsjQ9bVeqzDOXxx7dPMYV6mG02ELbrpQ";

function mejorarConGemini(textoBorrador) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === "") {
    return null;
  }

  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY.trim();
  var prompt = "Eres un redactor y especialista en lenguaje corporativo para la empresa Italcol. " +
               "Tu objetivo es tomar el texto borrador de observaciones escrito por un asesor comercial/técnico y refinarlo palabra por palabra, elevando el vocabulario, la ortografía, la puntuación y la estructura gramatical. " +
               "Debes pulir cada oración para transmitir con máxima precisión, claridad y elegancia la misma idea original que el usuario quiso expresar, sin alterar el sentido ni omitir ningún dato clave (nombres, fechas, cantidades, valores o compromisos). " +
               "Devuelve EXCLUSIVAMENTE la redacción mejorada final en español, sin saludos, notas ni explicaciones adicionales.\n\n" +
               "Texto borrador:\n" + textoBorrador;

  var payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    if (json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts && json.candidates[0].content.parts[0]) {
      return json.candidates[0].content.parts[0].text.trim();
    }
  } catch (err) {
    Logger.log("Error consultando Gemini API: " + err);
  }
  return null;
}

function mejorarRedaccionLocal(texto) {
  var t = texto.trim();
  if (!t) return "";

  // 1. Limpieza de espacios dobles y corrección de palabras partidas
  t = t.replace(/\s+/g, " ");
  t = t.replace(/\bi\s+dea\b/gi, "idea");
  t = t.replace(/\bi\s+deas\b/gi, "ideas");
  t = t.replace(/\bcistema\b/gi, "sistema");
  t = t.replace(/\bcistemas\b/gi, "sistemas");
  t = t.replace(/\bacuacula\b/gi, "acuícola");
  t = t.replace(/\bacuaculas\b/gi, "acuícolas");
  t = t.replace(/\bacuicola\b/gi, "acuícola");
  t = t.replace(/\bacuicolas\b/gi, "acuícolas");
  t = t.replace(/\btecnica\b/gi, "técnica");
  t = t.replace(/\btecnico\b/gi, "técnico");
  t = t.replace(/\bproduccion\b/gi, "producción");
  t = t.replace(/\batencion\b/gi, "atención");
  t = t.replace(/\brevision\b/gi, "revisión");
  t = t.replace(/\balimentacion\b/gi, "alimentación");
  t = t.replace(/\bpara bien\b/gi, "de manera positiva");

  // 2. Corregir puntuación y espacios desalineados
  t = t.replace(/([,;.:?!])([^\s0-9])/g, "$1 $2");

  // 3. Estructura ejecutiva si comienza informalmente
  if (/^la idea es /i.test(t)) {
    t = t.replace(/^la idea es /i, "Se busca ");
  }

  // 4. Mayúscula inicial y punto final
  t = t.charAt(0).toUpperCase() + t.slice(1);
  if (!/[.!?]$/.test(t)) {
    t += ".";
  }

  return t;
}

function doPost(e) {
  try {
    // Leer el body. El formulario envía Content-Type: text/plain con JSON como cuerpo.
    var rawBody = (e && e.postData && e.postData.contents) ? e.postData.contents : null;

    if (!rawBody) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "No se recibió ningún dato."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(rawBody);

    // Acción especial: Mejorar observaciones con IA
    if (data.action === "mejorar_observaciones") {
      var textoOriginal = data.texto || "";
      var resultadoIA = mejorarConGemini(textoOriginal);

      if (!resultadoIA) {
        resultadoIA = mejorarRedaccionLocal(textoOriginal);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        textoMejorado: resultadoIA
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      // Fallback en caso de que sea un script independiente
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "No se pudo abrir la hoja activa. Abre Apps Script desde Extensiones > Apps Script en tu Google Sheet."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    var sheet = ss.getActiveSheet();

    // Crear encabezados si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Fecha Visita",
        "Persona que realiza la visita",
        "Lugar",
        "Gerente de Zona",
        "Canal",
        "Línea",
        "Clientes / Razón Social",
        "Pilar",
        "Marca",
        "Actividad",
        "Observaciones",
        "Apoyo aliado (Sí/No)",
        "Quién (Apoyo aliado)",
        "Apoyo especialista (Sí/No)",
        "Quién (Apoyo especialista)",
        "Apoyo Gerente de Zona (Sí/No)",
        "Quién (Apoyo Gerente de Zona)",
        "Evidencia Fotográfica",
        "Fecha de Registro (Sistema)",
        "Asignación Económica (Sí/No)",
        "Gasto/Costo"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
           .setFontWeight("bold")
           .setBackground("#002855")
           .setFontColor("#ffffff");
    }

    // Obtener lista de clientes (si hay múltiples clientes separados por coma, crear una fila por cliente)
    var clientesRaw = data.razon_social || "";
    var listaClientes = clientesRaw.split(",").map(function(item) {
      return item.trim();
    }).filter(function(item) {
      return item.length > 0;
    });

    // Si por alguna razón la lista está vacía, incluir al menos un elemento vacío
    if (listaClientes.length === 0) {
      listaClientes = [""];
    }

    // Preparar imagen incrustada si viene adjunta
    var cellImage = null;
    if (data.fotoBase64 && data.fotoBase64.length > 10) {
      var mimeType = "image/jpeg";
      if (data.fotoNombre && data.fotoNombre.toLowerCase().endsWith(".png")) {
        mimeType = "image/png";
      }
      var dataUrl = "data:" + mimeType + ";base64," + data.fotoBase64;
      cellImage = SpreadsheetApp.newCellImage()
          .setSourceUrl(dataUrl)
          .setAltTextTitle("Evidencia Fotográfica")
          .setAltTextDescription("Registro: " + (data.fecha || "") + " - " + (data.persona || ""))
          .build();
    }

    // Insertar una fila independiente por cada cliente
    for (var i = 0; i < listaClientes.length; i++) {
      var clienteActual = listaClientes[i];
      var nextRow = sheet.getLastRow() + 1;

      var row = [
        data.fecha                      || "",
        data.persona                    || "",
        data.lugar                      || "",
        data.zona                       || "",
        data.canal                      || "",
        data.linea                      || "",
        clienteActual,                        // Columna 7: Razón Social individual
        data.pilar                      || "",
        data.marca                      || "",
        data.actividad                  || "",
        data.observaciones              || "",
        data.apoyo_aliado               || "",
        data.apoyo_aliado_quien         || "",
        data.apoyo_especialista         || "",
        data.apoyo_especialista_quien   || "",
        data.apoyo_gerente_zona         || "",
        data.apoyo_gerente_zona_quien   || "",
        "",                               // Col 18: imagen (se inserta abajo)
        new Date().toISOString(),         // Col 19: timestamp del sistema
        data.asignacion_economica       || "No",
        data.gasto_costo                || ""
      ];

      sheet.appendRow(row);

      // Si hay imagen, incrustarla dentro de la celda de la columna 18 de esta fila
      if (cellImage) {
        sheet.setRowHeight(nextRow, 100);
        sheet.setColumnWidth(18, 140);
        sheet.getRange(nextRow, 18).setValue(cellImage);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Registro(s) guardado(s) exitosamente en Google Sheets (" + listaClientes.length + " fila(s) generadas)."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Manejar solicitudes GET para pruebas o llamadas directas
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Italcol VGR API activa y funcionando correctamente."
  })).setMimeType(ContentService.MimeType.JSON);
}

// Responder preflight CORS
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
