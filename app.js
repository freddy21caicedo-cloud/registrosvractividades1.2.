document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    const saveTheme = (isDark) => {
        if (isDark) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'light');
        }
    };

    // System theme preference detection
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark.matches)) {
        saveTheme(true);
    } else {
        saveTheme(false);
    }

    themeToggle.addEventListener('click', () => {
        const isDarkNow = body.classList.contains('dark-theme');
        saveTheme(!isDarkNow);
    });

    // Searchable Client Dropdown implementation
    const inputBuscarCliente = document.getElementById('buscar_cliente');
    const optionsContainer = document.getElementById('buscar_cliente_options');
    const sortedClientes = [...clientesDB].sort((a, b) => a.razon.localeCompare(b.razon));

    // Populate searchable select options list for Clients (max 15 results for performance)
    function renderOptions(filterText = '') {
        optionsContainer.innerHTML = '';
        const filtered = sortedClientes.filter(c => 
            c.razon.toLowerCase().includes(filterText.toLowerCase())
        ).slice(0, 15);

        if (filtered.length === 0) {
            const emptyOption = document.createElement('div');
            emptyOption.className = 'search-option no-results';
            emptyOption.textContent = 'Sin resultados';
            optionsContainer.appendChild(emptyOption);
            return;
        }

        filtered.forEach(cliente => {
            const option = document.createElement('div');
            option.className = 'search-option';
            option.textContent = cliente.razon;
            option.addEventListener('click', () => {
                inputBuscarCliente.value = cliente.razon;
                optionsContainer.classList.remove('show');
            });
            optionsContainer.appendChild(option);
        });
    }

    // Toggle dropdown on input focus
    inputBuscarCliente.addEventListener('focus', () => {
        renderOptions(inputBuscarCliente.value);
        optionsContainer.classList.add('show');
    });

    // Filter list on typing
    inputBuscarCliente.addEventListener('input', () => {
        renderOptions(inputBuscarCliente.value);
        optionsContainer.classList.add('show');
    });

    // Activities Database with LocalStorage persistence support
    const actividadesDB = [
        "ACTIVACIONES LÍNEA", "ACTIVIDAD COMERCIAL", "ANALISIS NIRS", "ANALISIS TÉCNICO-COMERCIAL", "ANCHETA",
        "APP ZOOTECNICA", "AQUAEXPERT INTERNACIONAL", "ARREGLO FACHADA", "ASISTENCIA TÉCNICA", "AVISO",
        "BOOTCAMP CLIENTES", "BOOTCAMP ESPECIALISTA", "BOOTCAMP GERENTES DE ZONA",
        "BROILER EXPERT", "BUENA VISTA", "CABALGATA", "CALIDAD DE AGUA", "CALIPER", "CAMPAMENTO VIRTUAL",
        "CAPACITACIÓN", "CEPI", "CERTIFICACIÓN", "CHARLA", "CLIENTE PROSPECTO", "COMERCIALIZADOR",
        "COMITÉ TECNICO", "CONCURSO RIFAS", "COSTOS EXPERT", "CRECIMIENTO CANAL DIRECTOS", "CREDITO GESTIÓN",
        "CURSO MAYORDOMIA", "DESCUENTO COMERCIAL", "DÍA DE BIOMETRÍA ACUÍCOLA", "DÍA DE CAMPO", "DÍA DE LA MASCOTA", "DÍA DE LA POLLITA",
        "DÍA DEL ALEVINO", "DIA DEL CERDITO", "DIA DEL POLLITO", "DOTACION CLIENTES", "ECOGRAFIAS",
        "EGG EXPERT", "EVALUACION DE CANAL", "EVALUACION PIGMENTO", "EXHIBICIÓN", "EXPERT REGIONAL",
        "EXPORTACIÓN", "FENAVI", "FENAVI BUCARAMANGA", "FERIA DE SERVICIOS", "FERIAS Y EVENTOS",
        "FIDELIZACIÓN", "FIDELIZACIÓN CON EQUIPOS", "GESTIÓN CUPO CRÉDITO", "GIRA DE MOSTRADORES",
        "GIRA DE PRODUCTORES", "GIRA PRODUCTORES", "ITALPAY", "JORNADA ACUÍCOLA", "JORNADA BIENESTAR",
        "JORNADA DE DESPARÁSITACIÓN", "LABORATORIOS", "LANZAMIENTO", "LETRERO", "LIQUIDACION LOTES",
        "MEDICACIÓN ESTRATEGICA", "MES ITALSAL", "MUESTRA COMERCIAL", "PCR", "PESAJE", "PLAN ALIMENTACIÓN", "PLAN NACIONAL SANIDAD",
        "PLAN SEMILLA", "PLAN VITAMINIZACIÓN", "PORCIGENES", "PORCIXPERT NACIONAL", "PORCIXPERT PLANTA", "PORCIXPERT REGIONAL",
        "PORKAMERICAS", "PORKCOLOMBIA", "PROGRAMACIÓN LEVANTE, PLAN ALIMENTACIÓN, MANEJO Y PLAN VACUNAL.",
        "PROSPECTO", "PUBLICIDAD", "QUEJAS", "RECEPCIÓN DE POLLITAS", "RELANZAMIENTO",
        "REVISIÓN RESULTADOS LEVANTE, RENDIMIENTO POLLITAS", "RIFA", "RUTA ESPECIALIZADA", "SANIDAD",
        "SEMINARIO", "SEÑALIZACIÓN ICA", "TALLER", "TALLER DE DESPOSTE", "TALLER DE INSEMINACIÓN", "TALLER EMBUTIDOS",
        "TELEMETRIA", "TOMA DE ALMACEN", "VACUNACION", "VECINO SOSTENIBLE", "VISITA COMERCIAL",
        "VISITA DE TRANSFERENCIA", "VISITA DIR LINEA"
    ];

    // Cargar actividades personalizadas guardadas previamente en localStorage
    const loadCustomActivities = () => {
        try {
            const saved = JSON.parse(localStorage.getItem('custom_actividades_vgr')) || [];
            saved.forEach(act => {
                const formatted = act.trim().toUpperCase();
                if (formatted && !actividadesDB.includes(formatted)) {
                    actividadesDB.push(formatted);
                }
            });
        } catch (e) {
            console.error('Error al cargar actividades personalizadas:', e);
        }
        actividadesDB.sort((a, b) => a.localeCompare(b));
    };

    loadCustomActivities();

    // Guardar una nueva actividad personalizada en localStorage y la memoria
    const saveCustomActivity = (newAct) => {
        const formatted = newAct.trim().toUpperCase();
        if (!actividadesDB.includes(formatted)) {
            actividadesDB.push(formatted);
            actividadesDB.sort((a, b) => a.localeCompare(b));
        }
        try {
            const saved = JSON.parse(localStorage.getItem('custom_actividades_vgr')) || [];
            if (!saved.includes(formatted)) {
                saved.push(formatted);
                localStorage.setItem('custom_actividades_vgr', JSON.stringify(saved));
            }
        } catch (e) {
            console.error('Error al guardar actividad personalizada:', e);
        }
    };

    // Normalizar texto eliminando tildes y caracteres especiales
    const normalizeString = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toUpperCase()
            .trim();
    };

    // Calcular distancia Levenshtein entre dos cadenas
    const getLevenshteinDistance = (a, b) => {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    };

    // Buscar si existe una actividad idéntica o muy similar
    const checkActivitySimilarity = (inputText) => {
        const normInput = normalizeString(inputText);
        if (!normInput) return null;

        // 1. Coincidencia Exacta (ignorando tildes/mayúsculas)
        const exactMatch = actividadesDB.find(act => normalizeString(act) === normInput);
        if (exactMatch) {
            return { type: 'exact', match: exactMatch };
        }

        // 2. Coincidencia por Similitud Ortográfica
        let bestMatch = null;
        let highestSimilarity = 0;

        for (const act of actividadesDB) {
            const normAct = normalizeString(act);
            const distance = getLevenshteinDistance(normInput, normAct);
            const maxLength = Math.max(normInput.length, normAct.length);
            const similarity = 1 - (distance / maxLength);

            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                bestMatch = act;
            }
        }

        // Umbral de similitud >= 68%
        if (highestSimilarity >= 0.68 && bestMatch) {
            return { type: 'similar', match: bestMatch, score: highestSimilarity };
        }

        return null;
    };

    // Searchable Activity Dropdown implementation
    const inputActividad = document.getElementById('buscar_actividad');
    const optionsActividadContainer = document.getElementById('actividad_options');

    // Modal elements for activity similarity confirmation
    const similarityModal = document.getElementById('similarityModal');
    const modalNuevaActividad = document.getElementById('modalNuevaActividad');
    const modalSugerencia = document.getElementById('modalSugerencia');
    const modalBtnExistenteTexto = document.getElementById('modalBtnExistenteTexto');
    const btnUseExisting = document.getElementById('btnUseExisting');
    const btnCreateNew = document.getElementById('btnCreateNew');
    const btnCancelModal = document.getElementById('btnCancelModal');

    let pendingNewActivity = '';
    let pendingExistingMatch = '';

    const openSimilarityModal = (newAct, existingMatch) => {
        pendingNewActivity = newAct.trim().toUpperCase();
        pendingExistingMatch = existingMatch;

        modalNuevaActividad.textContent = pendingNewActivity;
        modalSugerencia.innerHTML = `<i class="fa-solid fa-lightbulb"></i> Actividad Sugerida: <strong>"${pendingExistingMatch}"</strong>`;
        modalBtnExistenteTexto.textContent = pendingExistingMatch;

        similarityModal.style.display = 'flex';
    };

    const closeSimilarityModal = () => {
        similarityModal.style.display = 'none';
        pendingNewActivity = '';
        pendingExistingMatch = '';
    };

    btnUseExisting.addEventListener('click', () => {
        if (pendingExistingMatch) {
            addActivityToSelection(pendingExistingMatch);
            showToast(`Se seleccionó la actividad existente "${pendingExistingMatch}".`, 'success');
        }
        closeSimilarityModal();
    });

    btnCreateNew.addEventListener('click', () => {
        if (pendingNewActivity) {
            saveCustomActivity(pendingNewActivity);
            addActivityToSelection(pendingNewActivity);
            showToast(`Nueva actividad "${pendingNewActivity}" creada y guardada.`, 'success');
        }
        closeSimilarityModal();
    });

    btnCancelModal.addEventListener('click', closeSimilarityModal);

    // Populate searchable select options list for Activities (max 15 results for performance)
    function renderActividadOptions(filterText = '') {
        optionsActividadContainer.innerHTML = '';
        const filtered = actividadesDB.filter(act => 
            act.toLowerCase().includes(filterText.toLowerCase())
        ).slice(0, 15);

        if (filtered.length === 0) {
            const emptyOption = document.createElement('div');
            emptyOption.className = 'search-option no-results';
            emptyOption.textContent = 'Sin resultados en la lista oficial';
            optionsActividadContainer.appendChild(emptyOption);
            return;
        }

        filtered.forEach(act => {
            const option = document.createElement('div');
            option.className = 'search-option';
            option.textContent = act;
            option.addEventListener('click', () => {
                inputActividad.value = act;
                optionsActividadContainer.classList.remove('show');
            });
            optionsActividadContainer.appendChild(option);
        });
    }

    // Toggle dropdown on input focus
    inputActividad.addEventListener('focus', () => {
        renderActividadOptions(inputActividad.value);
        optionsActividadContainer.classList.add('show');
    });

    // Filter list on typing
    inputActividad.addEventListener('input', () => {
        renderActividadOptions(inputActividad.value);
        optionsActividadContainer.classList.add('show');
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.searchable-select-wrapper')) {
            optionsContainer.classList.remove('show');
            optionsActividadContainer.classList.remove('show');
        }
    });

    // Multiselect Activity Logic
    const selectedActivities = [];
    const btnAddActividad = document.getElementById('btnAddActividad');
    const actividadesTagsContainer = document.getElementById('actividades_tags');
    const textActividad = document.getElementById('actividad'); // Hidden textarea

    const updateActivityMetadata = () => {
        if (selectedActivities.length === 0) {
            actividadesTagsContainer.innerHTML = `<span style="color: var(--text-secondary); font-size: 14px; font-style: italic; padding: 4px 0;">Ninguna actividad añadida aún</span>`;
            textActividad.value = '';
            return;
        }

        // Render Tags
        actividadesTagsContainer.innerHTML = '';
        selectedActivities.forEach((actName, index) => {
            const tag = document.createElement('div');
            tag.className = 'client-tag'; // Reuse styling
            tag.innerHTML = `
                <span>${actName}</span>
                <button type="button" class="btn-remove" data-index="${index}">&times;</button>
            `;
            actividadesTagsContainer.appendChild(tag);
        });

        // Set hidden textarea value for submission and WhatsApp extraction
        textActividad.value = selectedActivities.join(', ');
    };

    // Add Activity Event (strictly from predefined list)
    btnAddActividad.addEventListener('click', () => {
        const rawVal = inputActividad.value.trim();
        if (!rawVal) {
            showToast('Por favor, selecciona una actividad primero.', 'error');
            return;
        }

        // Buscar coincidencia en la base oficial
        const found = actividadesDB.find(act => act.toLowerCase() === rawVal.toLowerCase() || normalizeString(act) === normalizeString(rawVal));

        if (!found) {
            showToast('Actividad no encontrada en la lista oficial.', 'error');
            return;
        }

        if (selectedActivities.includes(found)) {
            showToast('Esta actividad ya ha sido añadida.', 'error');
            return;
        }

        selectedActivities.push(found);
        updateActivityMetadata();
        inputActividad.value = '';
        showToast('Actividad añadida.', 'success');
    });

    // Remove Activity Tag Event
    actividadesTagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove')) {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            selectedActivities.splice(index, 1);
            updateActivityMetadata();
            showToast('Actividad removida.', 'success');
        }
    });

    // Set Default Date to Today
    const inputFecha = document.getElementById('fecha');
    const today = new Date().toISOString().split('T')[0];
    inputFecha.value = today;

    // Multiselect Client Logic
    const selectedClients = [];
    const btnAddCliente = document.getElementById('btnAddCliente');
    const clientesTagsContainer = document.getElementById('clientes_tags');
    const textRazonSocial = document.getElementById('razon_social');
    const inputZona = document.getElementById('zona');
    const selectCanal = document.getElementById('canal');

    const updateClientMetadata = () => {
        if (selectedClients.length === 0) {
            clientesTagsContainer.innerHTML = `<span style="color: var(--text-secondary); font-size: 14px; font-style: italic; padding: 4px 0;">Ningún cliente añadido aún</span>`;
            textRazonSocial.value = '';
            inputZona.value = '';
            selectCanal.value = '';
            return;
        }

        // Render Tags
        clientesTagsContainer.innerHTML = '';
        selectedClients.forEach((clientName, index) => {
            const tag = document.createElement('div');
            tag.className = 'client-tag';
            tag.innerHTML = `
                <span>${clientName}</span>
                <button type="button" class="btn-remove" data-index="${index}">&times;</button>
            `;
            clientesTagsContainer.appendChild(tag);
        });

        // Set hidden text value
        textRazonSocial.value = selectedClients.join(', ');

        // Automatic autocompletion logic for multiple clients
        const managers = [];
        const channels = [];

        selectedClients.forEach(clientName => {
            const found = clientesDB.find(c => c.razon === clientName);
            if (found) {
                if (found.gerente && !managers.includes(found.gerente)) {
                    managers.push(found.gerente);
                }
                if (found.canal && !channels.includes(found.canal)) {
                    channels.push(found.canal);
                }
            }
        });

        // Autocomplete outputs
        inputZona.value = managers.join(', ');
        
        if (channels.length === 1) {
            selectCanal.value = channels[0];
        } else if (channels.length > 1) {
            selectCanal.value = ""; // Let user choose if channels differ
        }

        // Si hay prospectos (clientes no encontrados en clientesDB) o es modo prospecto activo,
        // permitimos escribir libremente el Gerente de Zona
        const hasProspects = selectedClients.some(c => !clientesDB.find(db => db.razon === c));
        const esProspectoActivo = document.getElementById('es_prospecto').value === 'Sí';

        if (hasProspects || esProspectoActivo) {
            inputZona.removeAttribute('readonly');
            inputZona.placeholder = "Escribe el Gerente de Zona...";
        } else {
            inputZona.setAttribute('readonly', 'true');
            inputZona.placeholder = "Se autocompleta según el cliente...";
        }
    };

    // ¿Es un Cliente Prospecto? Toggle container visibility
    const selectEsProspecto = document.getElementById('es_prospecto');
    const prospectoNombreContainer = document.getElementById('prospecto_nombre_container');
    const inputProspectoNombre = document.getElementById('prospecto_nombre');
    const btnAddProspecto = document.getElementById('btnAddProspecto');

    selectEsProspecto.addEventListener('change', () => {
        if (selectEsProspecto.value === 'Sí') {
            prospectoNombreContainer.classList.add('active');
            inputProspectoNombre.required = true;
            inputZona.removeAttribute('readonly');
            inputZona.placeholder = "Escribe el Gerente de Zona...";
        } else {
            prospectoNombreContainer.classList.remove('active');
            inputProspectoNombre.required = false;
            inputProspectoNombre.value = '';
            updateClientMetadata();
        }
    });

    // Auto-capitalize Prospect Name input field
    inputProspectoNombre.addEventListener('input', () => {
        inputProspectoNombre.value = inputProspectoNombre.value.toUpperCase();
    });

    // Add Client Event (from searchable list)
    btnAddCliente.addEventListener('click', () => {
        const clientVal = inputBuscarCliente.value.trim();
        if (!clientVal) {
            showToast('Por favor, selecciona un cliente primero.', 'error');
            return;
        }

        // Verificar que sea un cliente de la base de datos
        const exists = clientesDB.some(c => c.razon === clientVal);
        if (!exists) {
            showToast('Cliente no encontrado. Si es nuevo, activa la opción de Cliente Prospecto.', 'error');
            return;
        }

        if (selectedClients.includes(clientVal)) {
            showToast('Este cliente ya ha sido añadido.', 'error');
            return;
        }

        selectedClients.push(clientVal);
        updateClientMetadata();
        inputBuscarCliente.value = ''; // Reset select
        showToast('Cliente añadido.', 'success');
    });

    // Add Prospect Client Event
    btnAddProspecto.addEventListener('click', () => {
        const prospectVal = inputProspectoNombre.value.trim().toUpperCase();
        if (!prospectVal) {
            showToast('Por favor, escribe el nombre del cliente prospecto.', 'error');
            return;
        }

        if (selectedClients.includes(prospectVal)) {
            showToast('Este cliente ya ha sido añadido.', 'error');
            return;
        }

        selectedClients.push(prospectVal);
        updateClientMetadata();
        inputProspectoNombre.value = ''; // Reset input
        showToast('Prospecto añadido.', 'success');
    });

    // Remove Client Tag Event
    clientesTagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove')) {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            selectedClients.splice(index, 1);
            updateClientMetadata();
            showToast('Cliente removido.', 'success');
        }
    });

    // Photo upload handler
    const inputFoto = document.getElementById('foto_evidencia');
    const fileNameText = document.getElementById('file_name_text');
    const imagePreviewContainer = document.getElementById('image_preview_container');
    const imagePreview = document.getElementById('image_preview');
    const btnRemoveFoto = document.getElementById('btnRemoveFoto');

    let fotoBase64 = '';
    let fotoNombre = '';
    let fotoFile = null; // Archivo original para compartir via Web Share API

    inputFoto.addEventListener('change', () => {
        const file = inputFoto.files[0];
        if (file) {
            fileNameText.textContent = 'Procesando e imprimiendo imagen...';
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Ajustar tamaño máximo a 1000px para mantener la hoja ligera
                    const max_size = 1000;
                    if (width > height) {
                        if (width > max_size) {
                            height *= max_size / width;
                            width = max_size;
                        }
                    } else {
                        if (height > max_size) {
                            width *= max_size / height;
                            height = max_size;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Comprimir como JPEG con calidad 0.7
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    
                    fotoBase64 = dataUrl.split(',')[1];
                    // Renombrar la extensión a .jpg por la compresión
                    fotoNombre = file.name.substring(0, file.name.lastIndexOf('.')) + '.jpg';

                    // Convertir el canvas a un File real para poder adjuntarlo en Web Share API
                    canvas.toBlob((blob) => {
                        fotoFile = new File([blob], fotoNombre, { type: 'image/jpeg' });
                    }, 'image/jpeg', 0.7);

                    fileNameText.textContent = fotoNombre;
                    imagePreview.src = dataUrl;
                    imagePreviewContainer.style.display = 'inline-block';
                    showToast('Foto cargada y optimizada con éxito.', 'success');
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    btnRemoveFoto.addEventListener('click', () => {
        inputFoto.value = '';
        fotoBase64 = '';
        fotoNombre = '';
        fotoFile = null;
        fileNameText.textContent = 'Ningún archivo seleccionado';
        imagePreviewContainer.style.display = 'none';
        imagePreview.src = '';
        showToast('Foto removida.', 'success');
    });

    // Activity selection element
    const selectActividad = document.getElementById('actividad');


    // Helper function for conditional animation toggles
    const setupConditionalToggle = (selectId, containerId, inputId) => {
        const select = document.getElementById(selectId);
        const container = document.getElementById(containerId);
        const input = document.getElementById(inputId);

        select.addEventListener('change', () => {
            if (select.value === 'Sí') {
                container.classList.add('active');
                input.required = true;
            } else {
                container.classList.remove('active');
                input.required = false;
                input.value = '';
            }
        });
    };

    setupConditionalToggle('apoyo_aliado', 'aliado_quien_container', 'apoyo_aliado_quien');
    setupConditionalToggle('apoyo_especialista', 'especialista_quien_container', 'apoyo_especialista_quien');
    setupConditionalToggle('apoyo_gerente_zona', 'gerente_quien_container', 'apoyo_gerente_zona_quien');
    setupConditionalToggle('asignacion_economica', 'gasto_costo_container', 'gasto_costo');

    // Auto-formatting for Colombian Pesos (COP)
    const inputGastoCosto = document.getElementById('gasto_costo');
    inputGastoCosto.addEventListener('input', (e) => {
        let value = e.target.value;
        // Keep only numbers
        value = value.replace(/\D/g, "");
        if (value) {
            // Format as COP currency
            const formatted = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(parseInt(value));
            e.target.value = formatted;
        } else {
            e.target.value = "";
        }
    });

    // Build Payload Helper
    const getPayload = () => {
        const persona = document.getElementById('persona').value;
        const fecha = document.getElementById('fecha').value;
        const lugar = document.getElementById('lugar').value;
        const razon_social = textRazonSocial.value;
        const zona = inputZona.value;
        const canal = selectCanal.value;
        const linea = document.getElementById('linea').value;
        const pilar = document.getElementById('pilar').value;
        const marca = document.getElementById('marca').value;
        
        const actividad = selectActividad.value;

        const observaciones = document.getElementById('observaciones').value;
        const apoyo_aliado = document.getElementById('apoyo_aliado').value;
        const apoyo_aliado_quien = document.getElementById('apoyo_aliado_quien').value;
        const apoyo_especialista = document.getElementById('apoyo_especialista').value;
        const apoyo_especialista_quien = document.getElementById('apoyo_especialista_quien').value;
        const apoyo_gerente_zona = document.getElementById('apoyo_gerente_zona').value;
        const apoyo_gerente_zona_quien = document.getElementById('apoyo_gerente_zona_quien').value;

        const asignacion_economica = document.getElementById('asignacion_economica').value;
        const gasto_costo = inputGastoCosto.value;

        return {
            persona, fecha, lugar, razon_social, zona, canal, linea, pilar, marca, actividad,
            observaciones, apoyo_aliado, apoyo_aliado_quien, apoyo_especialista, apoyo_especialista_quien,
            apoyo_gerente_zona, apoyo_gerente_zona_quien,
            asignacion_economica, gasto_costo,
            fotoBase64, fotoNombre
        };
    };

    // Formatear fecha en español (ej: "1 de julio de 2026")
    const formatFechaES = (isoDate) => {
        if (!isoDate) return '';
        const [year, month, day] = isoDate.split('-');
        const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
        return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
    };

    // Generar texto en formato WhatsApp (sin incluir quien realiza la visita)
    const generateWhatsAppText = () => {
        const data = getPayload();

        if (!data.fecha || !data.lugar || !data.razon_social || !data.linea || !data.pilar || !data.marca || !data.actividad || !data.observaciones) {
            showToast('Por favor, completa los campos requeridos antes de enviar.', 'error');
            return null;
        }

        const fechaFormateada = formatFechaES(data.fecha);

        // Los clientes van como lista con viñetas (• )
        const clientesLista = data.razon_social
            .split(',')
            .map(c => `• ${c.trim()}`)
            .join('\n');

        // Las actividades van como lista con viñetas (• )
        const actividadesLista = data.actividad
            .split(',')
            .map(a => `• ${a.trim()}`)
            .join('\n');

        // Sin nombre de quien realiza la visita
        let txt = `Fecha: ${fechaFormateada}\n\n`;
        txt += `Lugar: ${data.lugar}\n\n`;
        if (data.zona) txt += `Zona: ${data.zona}\n\n`;
        if (data.canal) txt += `Canal: ${data.canal}\n\n`;
        txt += `Linea: ${data.linea}\n\n`;
        txt += `Razon social:\n\n${clientesLista}\n\n`;
        txt += `Pilar: ${data.pilar}\n\n`;
        txt += `Marca: ${data.marca}\n\n`;
        txt += `Actividades:\n\n${actividadesLista}\n\n`;
        txt += `Observaciones: ${data.observaciones}\n\n`;

        if (data.apoyo_aliado === 'Sí') txt += `Apoyo aliado: ${data.apoyo_aliado_quien}\n\n`;
        if (data.apoyo_especialista === 'Sí') txt += `Apoyo especialista: ${data.apoyo_especialista_quien}\n\n`;
        if (data.apoyo_gerente_zona === 'Sí') txt += `Apoyo Gerente de Zona: ${data.apoyo_gerente_zona_quien}\n\n`;
        if (data.asignacion_economica === 'Sí') {
            txt += `Asignación económica: Sí\n\n`;
            txt += `Gasto / Costo: ${data.gasto_costo}\n\n`;
        }

        return txt.trim();
    };

    // Action button elements
    const btnWhatsApp = document.getElementById('btnWhatsApp');
    const btnGuardar  = document.getElementById('btnGuardar');

    btnWhatsApp.addEventListener('click', async () => {
        const text = generateWhatsAppText();
        if (!text) return;

        // Si hay imagen y el navegador soporta Web Share API con archivos,
        // compartir texto + foto directamente (abre WhatsApp con ambos adjuntos)
        if (fotoFile && navigator.canShare && navigator.canShare({ files: [fotoFile] })) {
            try {
                await navigator.share({
                    text: text,
                    files: [fotoFile]
                });
            } catch (err) {
                // El usuario canceló o hubo un error — fallback a enlace de texto
                if (err.name !== 'AbortError') {
                    const encoded = encodeURIComponent(text);
                    window.open(`https://wa.me/?text=${encoded}`, '_blank');
                }
            }
        } else {
            // Sin imagen o sin soporte de Web Share: abrir WhatsApp con solo el texto
            const encoded = encodeURIComponent(text);
            window.open(`https://wa.me/?text=${encoded}`, '_blank');
        }
    });

    // Save to Google Sheets Logic
    btnGuardar.addEventListener('click', () => {
        const webhookUrl = 'https://script.google.com/macros/s/AKfycbxxA8EfMGO6QIvFiYa5adF7XIs3yeDVnkB2b1Zddb5GSpuu4YkXIozrPiDPK_pU1c5t/exec';

        const data = getPayload();
        // Validation check
        if (!data.persona || !data.fecha || !data.lugar || !data.razon_social || !data.linea || !data.pilar || !data.marca || !data.actividad || !data.observaciones) {
            showToast('Por favor, completa todo el formulario antes de guardar.', 'error');
            return;
        }

        // Set Loading state
        const originalContent = btnGuardar.innerHTML;
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = `<span class="spinner"></span> Guardando...`;

        // text/plain es un tipo "simple" de CORS: no dispara preflight,
        // no-cors lo envía completo, y Apps Script lo recibe en e.postData.contents.
        fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            // Note: with mode: 'no-cors', response is opaque. We assume success if it doesn't fail.
            showToast('¡Visita registrada con éxito en Google Sheets!', 'success');
            
            // Clean dynamic values of the form (except persona, fecha and location for fast typing)
            selectedClients.length = 0;
            updateClientMetadata();
            inputBuscarCliente.value = '';
            selectedActivities.length = 0;
            updateActivityMetadata();
            inputActividad.value = '';
            selectEsProspecto.value = 'No';
            selectEsProspecto.dispatchEvent(new Event('change'));
            document.getElementById('pilar').value = '';
            document.getElementById('marca').value = '';
            document.getElementById('linea').value = '';
            document.getElementById('observaciones').value = '';

            // Clean photo input
            inputFoto.value = '';
            fotoBase64 = '';
            fotoNombre = '';
            fileNameText.textContent = 'Ningún archivo seleccionado';
            imagePreviewContainer.style.display = 'none';
            imagePreview.src = '';

            // Reset supports
            ['apoyo_aliado', 'apoyo_especialista', 'apoyo_gerente_zona', 'asignacion_economica'].forEach(id => {
                document.getElementById(id).value = 'No';
                document.getElementById(id).dispatchEvent(new Event('change'));
            });

        })
        .catch(err => {
            showToast('Error al enviar a Google Sheets. Revisa la URL e intenta nuevamente.', 'error');
            console.error(err);
        })
        .finally(() => {
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = originalContent;
        });
    });

    // AI Observation Improvement Handler
    const btnMejorarIA = document.getElementById('btnMejorarIA');
    const btnUndoIA = document.getElementById('btnUndoIA');
    const textareaObservaciones = document.getElementById('observaciones');
    let originalObservaciones = '';

    const mejorarRedaccionIA = (texto) => {
        let raw = texto.trim();
        if (!raw) return "";

        // 1. Normalización inicial y limpieza
        let t = raw.replace(/\s+/g, " ");
        t = t.replace(/\bi\s+dea\b/gi, "idea");
        t = t.replace(/\bi\s+deas\b/gi, "ideas");

        // 2. Diccionario de transformación de vocabulario informal a técnico-comercial
        const reemplazosTecnicos = [
            [/\bcistema\b/gi, "sistema"],
            [/\bcistemas\b/gi, "sistemas"],
            [/\bacuacula\b/gi, "acuícola"],
            [/\bacuaculas\b/gi, "acuícolas"],
            [/\bacuicola\b/gi, "acuícola"],
            [/\bacuicolas\b/gi, "acuícolas"],
            [/\bporcicultura\b/gi, "porcicultura"],
            [/\btecnica\b/gi, "técnica"],
            [/\btecnico\b/gi, "técnico"],
            [/\btecnicos\b/gi, "técnicos"],
            [/\bproduccion\b/gi, "producción"],
            [/\batencion\b/gi, "atención"],
            [/\brevision\b/gi, "revisión"],
            [/\balimentacion\b/gi, "alimentación"],
            [/\bnutricion\b/gi, "nutrición"],
            [/\bparametro\b/gi, "parámetro"],
            [/\bparametros\b/gi, "parámetros"],
            [/\bevaluacion\b/gi, "evaluación"],
            [/\bcapacitacion\b/gi, "capacitación"],
            [/\bpresentacion\b/gi, "presentación"],
            [/\bcotizacion\b/gi, "cotización"],
            [/\bnegociacion\b/gi, "negociación"],
            [/\binstalacion\b/gi, "instalación"],
            [/\bdia\b/gi, "día"],
            [/\bdias\b/gi, "días"],
            [/\bpara bien\b/gi, "de manera altamente favorable"],
            [/\bcliente contento\b/gi, "el cliente manifiesta alta conformidad con los resultados"],
            [/\bcliente satisfecho\b/gi, "el cliente confirma excelente desempeño del programa nutricional"],
            [/\bpidio mas\b/gi, "solicitó incremento en los volúmenes de pedido"],
            [/\bpidio producto\b/gi, "solicitó la programación de despacho de producto"],
            [/\bse hablo con\b/gi, "se sostuvo reunión de trabajo con"],
            [/\bse hablo de\b/gi, "se abordaron los aspectos técnicos y comerciales correspondientes a"],
            [/\bfui a ver\b/gi, "se realizó inspección técnica en"],
            [/\bfui a visitar\b/gi, "se ejecutó visita de acompañamiento comercial a"],
            [/\bdijo que\b/gi, "manifestó que"],
            [/\bquedamos en\b/gi, "se concertó como compromiso acordado"],
            [/\bbuen rendimiento\b/gi, "óptimo desempeño en los parámetros zootécnicos"],
            [/\bbaja produccion\b/gi, "novedades en el rendimiento productivo"],
            [/\bse hizo charla\b/gi, "se impartió jornada de capacitación técnica"],
            [/\bse tomo muestra\b/gi, "se recolectaron muestras para análisis de laboratorio"]
        ];

        reemplazosTecnicos.forEach(([regex, reemplazo]) => {
            t = t.replace(regex, reemplazo);
        });

        // 3. Reconstrucción sintáctica del texto para convertirlo en informe ejecutivo
        if (/^la idea es /i.test(t)) {
            t = t.replace(/^la idea es /i, "En el marco de la gestión técnico-comercial, se establece como objetivo ");
        } else if (/^la idea /i.test(t)) {
            t = t.replace(/^la idea /i, "Las acciones se orientan a ");
        } else if (/^se quiere /i.test(t)) {
            t = t.replace(/^se quiere /i, "Se proyecta en la unidad productiva ");
        } else if (/^se visito /i.test(t)) {
            t = t.replace(/^se visito /i, "Se realizó visita de acompañamiento técnico-comercial a ");
        } else if (/^se realizo /i.test(t)) {
            t = t.replace(/^se realizo /i, "Se llevó a cabo la actividad de ");
        } else if (!/^(Se |En |Durante |Con el fin |Atendiendo )/i.test(t)) {
            t = "Durante la actividad comercial, " + t.charAt(0).toLowerCase() + t.slice(1);
        }

        // 4. Normalización de conectores técnicos
        t = t.replace(/ y tambi[eé]n /gi, ", así como ");
        t = t.replace(/ para que /gi, " con el fin de ");
        t = t.replace(/ porque /gi, " debido a que ");

        // 5. Ajuste fino de signos de puntuación y espacios
        t = t.replace(/([,;.:?!])([^\s0-9])/g, "$1 $2");

        // 6. Capitalización de primera letra en cada oración
        t = t.replace(/(^\s*|[.!?]\s+)([a-záéíóúñ])/g, (match, p1, p2) => p1 + p2.toUpperCase());

        // 7. Asegurar cierre formal
        if (!/[.!?]$/.test(t)) {
            t += ".";
        }

        return t;
    };

    if (btnMejorarIA && textareaObservaciones) {
        btnMejorarIA.addEventListener('click', () => {
            const currentText = textareaObservaciones.value.trim();
            if (!currentText || currentText.length < 3) {
                showToast('Por favor, escribe algunas observaciones antes de usar la IA.', 'error');
                return;
            }

            // Guardar borrador previo para permitir deshacer
            originalObservaciones = textareaObservaciones.value;

            const originalBtnHtml = btnMejorarIA.innerHTML;
            btnMejorarIA.disabled = true;
            btnMejorarIA.innerHTML = `<span class="spinner"></span> Mejorando con IA...`;

            setTimeout(() => {
                const mejorado = mejorarRedaccionIA(currentText);
                textareaObservaciones.value = mejorado;
                btnUndoIA.style.display = 'inline-flex';
                btnMejorarIA.disabled = false;
                btnMejorarIA.innerHTML = originalBtnHtml;
                showToast('¡Redacción mejorada con éxito!', 'success');
            }, 400);
        });
    }

    if (btnUndoIA && textareaObservaciones) {
        btnUndoIA.addEventListener('click', () => {
            if (originalObservaciones !== '') {
                textareaObservaciones.value = originalObservaciones;
                btnUndoIA.style.display = 'none';
                originalObservaciones = '';
                showToast('Se ha restaurado el texto original.', 'success');
            }
        });
    }

    // Custom Toast Alert notification system
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    let toastTimeout;

    function showToast(message, type = 'success') {
        clearTimeout(toastTimeout);
        toastMessage.textContent = message;
        toast.className = 'toast show ' + type;
        
        if (type === 'success') {
            toastIcon.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
        } else {
            toastIcon.innerHTML = `<i class="fa-solid fa-circle-xmark"></i>`;
        }

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }
});
