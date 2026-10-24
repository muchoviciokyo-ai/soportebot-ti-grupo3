# 🤖 SoporteBot TI — Grupo 3 · Soporte Informático

Chatbot **por reglas** (palabras clave, **sin IA generativa**) que orienta sobre consultas frecuentes de soporte informático y **registra cada consulta en Google Sheets**.

Actividad grupal · Semana 4 — Facultad de Ingeniería Industrial y de Sistemas, Universidad Nacional del Callao.

## 🔗 Enlaces
- **Bot en línea (GitHub Pages):** _https://TU-USUARIO.github.io/soportebot-ti-grupo3/_
- **Hoja de registros:** _pegar aquí el enlace de Google Sheets (solo lectura)_

## 🏗️ Arquitectura
```
GitHub Pages (index.html) ──iframe──► Apps Script (chat + reglas) ──appendRow──► Google Sheets
```
GitHub Pages es la dirección pública: muestra a pantalla completa el bot de Apps Script, donde se ejecutan las reglas y el registro.

## 🎨 Personalización
| Elemento | Valor |
|---|---|
| Nombre | SoporteBot TI — Mesa de Ayuda · Grupo 3 |
| Colores | Azul marino `#0b3d91` y celeste `#00a3e0` |
| Botones | 🔐 No puedo ingresar · 📶 Se cayó la red · 📁 Carpeta compartida · 🖨️ Impresora |
| Categorías | Acceso al sistema · Red y conectividad · Carpetas compartidas · Impresoras · No reconocida |

## ⚙️ Cómo funciona
```
Chatbot del equipo → Su propia hoja (Registros) → Tabla de frecuencias → Gráfico actualizado
```
1. El texto se normaliza (minúsculas, sin tildes ni signos).
2. Cada categoría suma puntos por palabra clave (frases = 2 pts, palabras = 1 pt). Gana la de mayor puntaje.
3. Se toleran errores de escritura de 1–2 letras (distancia de Levenshtein), p. ej. `impresra` → `impresora`.
4. Si ninguna regla coincide, se responde el mensaje de **consulta no reconocida**.
5. Cada consulta se agrega como **fila nueva** en `Registros` (Fecha y hora · Consulta · Categoría · Respuesta), sin sobrescribir.
6. La hoja `Frecuencias` cuenta consultas por categoría con `COUNTIF` y alimenta un gráfico de columnas.

## 📂 Archivos
| Archivo | Contenido |
|---|---|
| `index.html` | Página contenedora publicada en GitHub Pages |
| `apps-script/Code.gs` | Personalización, reglas, registro en Sheets, `configurarHoja()` y `ejecutarPruebas()` |
| `apps-script/Index.html` | Interfaz del chat |

## 🚀 Instalación
1. Crear un Google Sheet → **Extensiones → Apps Script**.
2. Pegar `Code.gs` y crear un archivo HTML llamado `Index` con el contenido de `Index.html`.
3. Ejecutar `configurarHoja` una vez y autorizar permisos. Para generar los registros de prueba, ejecutar `ejecutarPruebas`.
4. **Implementar → Nueva implementación → Aplicación web** (Ejecutar como: Yo · Acceso: Cualquier usuario).
5. Pegar la URL `/exec` en la constante `URL_APP` de `index.html` y activar **GitHub Pages** (Settings → Pages → rama `main`, carpeta `/root`).

## 🧪 Pruebas (8 consultas ficticias)
| # | Consulta | Tipo | Categoría esperada |
|---|---|---|---|
| 1 | No puedo ingresar al sistema | Base | Acceso al sistema |
| 2 | Olvidé mi contraseña y mi usuario está bloqueado | Reformulación | Acceso al sistema |
| 3 | Se cayó la red en plena reunión | Base | Red y conectividad |
| 4 | Me quedé sin internet durante la videollamada | Reformulación | Red y conectividad |
| 5 | ¿Cómo pido acceso a una carpeta compartida y quién lo autoriza? | Base | Carpetas compartidas |
| 6 | La impresora no responde antes de una entrega | Base | Impresoras |
| 7 | No puedo imprimr, la impresra no hace nada | Error de escritura | Impresoras |
| 8 | ¿Cuál es el menú del comedor hoy? | No reconocida | No reconocida |

## ⚠️ Limitación
El bot reconoce **palabras, no significados**: sinónimos no registrados (p. ej. "loguearme en la plataforma") pueden quedar como *No reconocida*, y una frase que mezcla temas se asigna a la categoría con más coincidencias aunque no sea la intención real. Tampoco interpreta negaciones ni contexto. Se mejora ampliando las listas de palabras clave a partir de las consultas no reconocidas del registro.

> Políticas, plazos, anexos y portales son **ficticios**. El bot solo orienta: no ejecuta trámites ni consulta estados reales. Se cuentan consultas, no personas.
