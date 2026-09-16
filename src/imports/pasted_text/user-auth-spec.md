ÉPICA 01: Identidad, Seguridad y Gestión de Acceso Global
FEATURE 01: FE-01 - Autenticación y Acceso Seguro Multi-Rol
HU-01: Registro de Nuevos Clientes con Validación Segura
Descripción:
Como cliente potencial,
quiero registrarme en la plataforma ingresando mis datos personales y credenciales de acceso,
para disponer de una cuenta privada que me permita reservar y gestionar mis citas de peluquería.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Registro exitoso de cuenta
Dado que me encuentro en la vista de registro del portal web,
Y el sistema solicita Nombre Completo, Teléfono Móvil, Correo Electrónico y Contraseña,
Cuando diligencio todos los campos obligatorios con formatos válidos y una contraseña de al menos 8 caracteres (alfanumerica y con carácter especial),
Y presiono el botón "Crear Cuenta",
Entonces el sistema cifra la contraseña en base de datos mediante hash seguro (Argon2id/Bcrypt),
Y crea el registro de usuario asignándole el rol CLIENTE,
Y muestra una notificación flotante (Toast): "¡Registro exitoso! Ya puedes iniciar sesión", redirigiendo al login.
Escenario 2: Rechazo por correo electrónico duplicado
Dado que el correo electrónico ingresado ya existe previamente en la base de datos,
Cuando presiono el botón "Crear Cuenta",
Entonces el sistema detiene el proceso, mantiene los datos en el formulario sin borrar el teléfono ni el nombre,
Y resalta el campo de correo en color rojo mostrando el mensaje de error: "Este correo ya se encuentra registrado. Intenta iniciar sesión".
HU-02: Autenticación Multi-Rol Unificada (Local y Google OAuth2)
Descripción:
Como usuario del sistema (Cliente, Estilista o Administrador),
quiero iniciar sesión utilizando mi correo y contraseña o mi cuenta de Google,
para ingresar de manera segura y ser dirigido a la interfaz correspondiente a mi rol.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Inicio de sesión exitoso y redirección por rol
Dado que el usuario se encuentra en la pantalla de inicio de sesión,
Cuando ingresa sus credenciales válidas y hace clic en "Iniciar Sesión",
Entonces el sistema emite un token seguro JWT (JSON Web Token) firmado con algoritmo RS256,
Y si el rol es CLIENTE, lo redirige a la vista de Catálogo de Servicios,
Y si el rol es ESTILISTA, lo redirige a la vista "Mi Agenda Diaria",
Y si el rol es ADMIN, lo redirige al Panel de Configuración Administrativa.
Escenario 2: Autenticación federada mediante Google OAuth2
Dado que el usuario hace clic en el botón "Continuar con Google",
Cuando autoriza el acceso desde la pasarela externa de Google Identity Services,
Entonces el sistema valida el id_token, crea el perfil de cliente automáticamente si no existía,
Y abre la sesión en el frontend sin solicitar contraseña adicional en menos de 1.5 segundos.
Escenario 3: Bloqueo temporal por intentos fallidos
Dado un usuario que ingresa credenciales inválidas,
Cuando falla por 5 ocasiones consecutivas en menos de 5 minutos,
Entonces el sistema bloquea los intentos de ese usuario por 10 minutos y muestra: "Demasiados intentos fallidos. Cuenta temporalmente bloqueada por seguridad".
HU-03: Cierre de Sesión Seguro y Gestión de Tokens
Descripción:
Como usuario autenticado en la plataforma,
quiero cerrar mi sesión de manera explícita desde cualquier dispositivo,
para revocar el acceso a mi cuenta y proteger mi información personal en equipos compartidos.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Cierre de sesión voluntario
Dado que el usuario tiene una sesión activa en el navegador,
Cuando hace clic en su foto/perfil y selecciona "Cerrar Sesión",
Entonces el sistema destruye el token en almacenamiento local (Secure HttpOnly Cookie), invalida el refresh token en el backend y redirige al inicio público en menos de 500 ms.
FEATURE 02: FE-02 - Gestión de Cuentas y Ciclo de Vida del Usuario
HU-04: Gestión de Datos de Perfil del Cliente
Descripción:
Como cliente registrado,
quiero consultar y editar mis datos personales (nombre, teléfono y foto de perfil),
para mantener mi información actualizada de cara a las notificaciones de mis citas.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Actualización exitosa de número de contacto
Dado que el cliente accede a la vista "Mi Perfil",
Cuando ingresa un nuevo número de teléfono móvil válido de 10 dígitos y presiona "Guardar",
Entonces el sistema actualiza el registro en la base de datos y muestra: "Perfil actualizado correctamente".
HU-05: Baja y Anonimización de Cuenta de Cliente (Derecho al Olvido)
Descripción:
Como cliente registrado,
quiero solicitar la desactivación y eliminación lógica de mi cuenta en el sistema,
para revocar el uso de mis datos personales cuando decida no utilizar más el servicio.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Baja exitosa de cuenta sin citas pendientes
Dado que el cliente solicita eliminar su cuenta y no tiene citas activas en estado "Programada",
Cuando confirma su acción ingresando su contraseña de seguridad,
Entonces el sistema realiza un borrado lógico (Soft Delete), anonimiza su correo y teléfono en base de datos para no quebrar la integridad referencial de citas históricas, y cierra la sesión.
Escenario 2: Bloqueo de baja con citas activas
Dado que el cliente tiene una cita pendiente para el día siguiente,
Cuando intenta eliminar la cuenta,
Entonces el sistema bloquea la acción y muestra: "No puedes eliminar tu cuenta con citas activas pendientes. Cancela tus citas primero".
ÉPICA 02: Catálogo de Servicios y Parámetros Comerciales
FEATURE 03: FE-03 - Catálogo Maestro de Servicios (CRUD Completo)
HU-06: Exploración y Consulta Pública del Catálogo de Servicios (Read CRUD)
Descripción:
Como cliente (o visitante del sitio),
quiero consultar la lista completa de servicios ofrecidos con su precio, duración y descripción detallada,
para conocer la oferta de la barbería y decidir qué servicio reservar.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Carga y renderizado del catálogo interactivo
Dado que el usuario ingresa a la sección "Servicios",
Cuando la vista realiza la petición GET /api/v1/services?status=active,
Entonces el frontend renderiza una grilla de tarjetas con: Nombre del servicio, Descripción breve, Duración en minutos (ej. 30 min, 45 min) y Precio formateado en moneda local (ej. $25.000 COP).
Escenario 2: Filtrado dinámico por categoría de servicio
Dado que existen categorías configuradas (ej. "Cortes", "Barba", "Combos"),
Cuando el usuario hace clic en el chip/filtro "Barba",
Entonces la interfaz filtra reactivamente en pantalla únicamente los servicios asociados en menos de 200 ms.
HU-07: Creación y Modificación de Servicios en el Catálogo (Admin)
Descripción:
Como administrador de la peluquería,
quiero registrar nuevos servicios y actualizar precios, duraciones o descripciones existentes,
para mantener sincronizada la oferta comercial del establecimiento con los cambios del negocio.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Registro exitoso de nuevo servicio
Dado que el administrador está en el panel de "Gestión de Servicios",
Cuando presiona "Nuevo Servicio", ingresa Nombre: "Corte Fade & Barba", Duración: "60", Precio: "35000", Categoría: "Combos", y presiona "Guardar",
Entonces el sistema valida que el precio sea mayor a cero y la duración esté entre 10 y 240 minutos,
Y almacena el servicio habilitándolo de inmediato para reservas.
Escenario 2: Actualización de precio de un servicio
Dado un servicio existente con precio anterior de $20.000,
Cuando el administrador modifica el campo precio a $25.000 y confirma,
Entonces el nuevo precio aplica para todas las futuras reservas sin alterar el precio de las citas ya agendadas en el pasado.
HU-08: Desactivación y Eliminación Lógica de Servicios (Admin)
Descripción:
Como administrador,
quiero deshabilitar o eliminar del catálogo servicios que ya no se prestarán,
para impedir que los clientes reserven tratamientos o cortes descontinuados.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Desactivación segura con citas pendientes
Dado que un servicio tiene citas agendadas para la próxima semana,
Cuando el administrador presiona el botón "Eliminar",
Entonces el sistema cambia el estado del servicio a INACTIVO, ocultándolo del catálogo público pero manteniendo intactas las citas previamente programadas.
ÉPICA 03: Gestión del Equipo y Capacidad Operativa
FEATURE 04: FE-04 - Administración de Estilistas y Jornadas Laborales
HU-09: Registro y Alta de Estilistas con Asignación de Horario Base
Descripción:
Como administrador de la peluquería,
quiero dar de alta a un nuevo estilista con sus datos profesionales y su horario laboral semanal,
para integrarlo al equipo de trabajo y habilitar su calendario para recepción de reservas.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Registro completo de estilista y jornada laboral
Dado que el administrador accede al módulo "Equipo / Estilistas",
Cuando diligencia Nombre, Correo, Especialidad principal (ej. "Diseño de Barba") y configura su horario (Lunes a Viernes de 09:00 a 18:00 con almuerzo de 13:00 a 14:00),
Y presiona "Registrar Estilista",
Entonces el sistema crea la cuenta con rol ESTILISTA, genera los slots de disponibilidad base en la base de datos y envía un correo con sus credenciales de acceso temporal.
HU-10: Edición de Información Profesional y Jornada del Estilista
Descripción:
Como administrador (o estilista autorizado),
quiero editar la información de perfil, especialidades y ajustar los días u horas laborales del estilista,
para adaptar la capacidad de atención a cambios en el contrato o disponibilidad del personal.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Modificación de jornada laboral
Dado que un estilista acuerda cambiar su hora de inicio de 09:00 a 10:00,
Cuando el administrador modifica la jornada semanal en su ficha técnica y guarda,
Entonces el sistema actualiza la matriz de disponibilidad futura sin afectar citas ya confirmadas en días previos.
HU-11: Desvinculación y Baja de Estilistas del Equipo
Descripción:
Como administrador,
quiero dar de baja a un estilista que finalizó su relación laboral con el negocio,
para retirar su visibilidad del catálogo público y gestionar las citas pendientes asignadas.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Desvinculación con reasignación o alerta de citas
Dado que un estilista tiene 3 citas pendientes para los próximos días,
Cuando el administrador intenta desvincularlo,
Entonces el sistema muestra un modal preventivo: "El estilista tiene 3 citas pendientes. ¿Deseas reasignarlas a otro barbero o cancelarlas notificando al cliente?", impidiendo el borrado ciego.
ÉPICA 04: Motor Transaccional de Agendamiento y Reservas (CORE)
FEATURE 05: FE-05 - Explorador y Selector de Disponibilidad en Tiempo Real
HU-12: Consulta de Disponibilidad de Horarios por Estilista y Fecha
Descripción:
Como cliente interesado en agendar una cita,
quiero seleccionar un estilista (o la opción "Cualquier barbero disponible") y una fecha en el calendario,
para ver las franjas horarias libres y exactas en tiempo real.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Cálculo dinámico de franjas horarias según duración del servicio
Dado que el cliente ha preseleccionado un servicio de 45 minutos y al estilista "Carlos",
Cuando selecciona la fecha de mañana en el selector de fecha (DatePicker),
Entonces el motor de reservas consulta el horario base de Carlos, resta las citas ya reservadas y los bloqueos de descanso,
Y renderiza botones interactivos (Time Slots) únicamente con los intervalos donde caben los 45 minutos continuos (ej. 10:00, 10:45, 11:30, 15:00).
Escenario 2: Día completo sin disponibilidad
Dado que el estilista tiene todas sus franjas ocupadas para la fecha elegida,
Cuando el cliente consulta ese día,
Entonces el sistema muestra: "No hay turnos disponibles para esta fecha. Intenta con otro barbero o selecciona el siguiente día disponible".
HU-13: Selección y Resumen Previo de la Reserva de Cita
Descripción:
Como cliente,
quiero visualizar una pantalla de resumen con el desglose del servicio, estilista, fecha, hora y precio final,
para verificar todos los datos antes de confirmar definitivamente mi compromiso de cita.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Confirmación de datos pre-transaccionales
Dado que el cliente seleccionó Corte Clásico ($25.000), Estilista: Mateo, Fecha: 20 de Octubre a las 14:00,
Cuando avanza al paso de confirmación,
Entonces el sistema muestra una tarjeta de resumen clara con todos los ítems, indicando que el pago se realizará en el establecimiento.
FEATURE 06: FE-06 - Motor de Reserva Concurrente y Confirmación Atómica
HU-14: CORE — Confirmación Transaccional de Reserva y Bloqueo de Franja
Descripción:
Como cliente autenticado,
quiero confirmar la reserva de mi cita mediante un proceso transaccional protegido,
para asegurar mi turno en la barbería garantizando que nadie más pueda tomar mi franja horaria.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Creación atómica de cita exitosa
Dado que el cliente presiona "Confirmar Reserva",
Cuando el backend procesa la solicitud POST /api/v1/appointments,
Entonces el sistema bloquea atómicamente la franja en base de datos mediante transacción (Pessimistic/Optimistic Locking),
Y crea el registro de la cita en estado PROGRAMADA con un código único de reserva (ej. #BB-8942),
Y muestra en pantalla: "¡Cita confirmada con éxito! Te esperamos el 20 de Octubre a las 14:00".
Escenario 2: Manejo de colisión concurrente (Race Condition)
Dado que dos clientes intentaron confirmar la misma franja horaria al mismo milisegundo,
Cuando el segundo cliente envía su confirmación,
Entonces la base de datos rechaza la segunda transacción por colisión de clave única de horario,
Y el frontend responde informando amablemente: "¡Lo sentimos! Esta franja horaria acaba de ser reservada por otro usuario. Por favor selecciona otra hora".
HU-15: Notificación Automática de Confirmación de Cita (Email / SMS)
Descripción:
Como cliente con una cita recién confirmada,
quiero recibir un comprobante digital inmediato en mi correo electrónico,
para tener los detalles de mi reserva guardados y contar con un enlace directo para reprogramar si es necesario.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Envío de correo con archivo de calendario (.ics)
Dado que una cita fue creada en estado PROGRAMADA,
Cuando se dispara el evento de dominio AppointmentCreatedEvent,
Entonces el servicio asíncrono despacha un correo con el resumen, dirección del local y un archivo adjunto invite.ics para añadir a Google Calendar o Apple Calendar en menos de 10 segundos.
ÉPICA 05: Operación de Citas y Control de Agenda en Vivo
FEATURE 07: FE-07 - Gestión de Agenda Diaria y Control de Estados (Estilista)
HU-16: Visualización de Agenda Diaria y Métricas Rápidas (Estilista)
Descripción:
Como estilista,
quiero acceder a mi panel "Mi Agenda" para ver el cronograma de citas del día y un resumen de ingresos y horas ocupadas,
para organizar el flujo de mi jornada y conocer mi carga de trabajo diaria.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Carga del cronograma y selector de fecha
Dado que el estilista inicia sesión y accede a su panel principal,
Cuando visualiza la fecha de hoy,
Entonces el sistema muestra tarjetas KPI con: Total de Citas Hoy, Horas de Trabajo Ocupadas e Ingresos Proyectados,
Y un listado cronológico ordenado por hora con cada cliente, servicio, duración y estado.
HU-17: Transición y Cierre de Estados de la Cita por el Estilista
Descripción:
Como estilista en turno,
quiero cambiar el estado de una cita a "En Atención", "Completada" o marcar "No Asistió",
para reflejar el progreso real del servicio y liberar los registros para cálculo de comisiones.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Finalización exitosa del servicio
Dado que el cliente ha recibido su corte y pagado en recepción,
Cuando el estilista hace clic en "Finalizar Servicio",
Entonces la cita pasa al estado COMPLETADA, se registra la marca temporal de cierre y se habilita la solicitud de calificación al cliente.
HU-18: Bloqueo de Franjas Horarias por Imprevistos o Pausas (Estilista)
Descripción:
Como estilista,
quiero bloquear intervalos horarios específicos en mi calendario de trabajo,
para impedir que se agenden clientes durante mis tiempos de descanso o imprevistos personales.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Bloqueo exitoso de horario libre
Dado que el estilista no tiene citas reservadas entre las 15:00 y las 16:00 de hoy,
Cuando selecciona esa franja y pulsa "Bloquear Horario" indicando motivo "Pausa activa",
Entonces el sistema inhabilita esa hora inmediatamente en el motor público de reservas de los clientes.
FEATURE 08: FE-08 - Seguimiento, Reprogramación y Cancelación de Citas (Cliente)
HU-19: Consulta y Seguimiento de Citas Activas (Cliente)
Descripción:
Como cliente,
quiero consultar el estado, la hora y los datos de mi próxima cita programada en la sección "Mis Citas",
para recordar mi compromiso y tener a mano los datos de contacto y dirección del local.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Visualización de tarjeta de cita activa
Dado que el cliente tiene una cita en estado PROGRAMADA,
Cuando ingresa al módulo "Mis Citas",
Entonces observa una tarjeta destacada con: Nombre del barbero, Servicio, Fecha, Hora, Cuenta regresiva (ej. "En 3 horas") y botón de acceso a la ubicación en Google Maps.
HU-20: Reprogramación y Cancelación Oportuna de Cita (Cliente)
Descripción:
Como cliente,
quiero cancelar o reprogramar la fecha/hora de mi cita con anticipación,
para ajustar mi agenda ante imprevistos y liberar el espacio para otros usuarios.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Cancelación oportuna (más de 2 horas de anticipación)
Dado que faltan más de 2 horas para la hora programada de la cita,
Cuando el cliente presiona "Cancelar Cita" y confirma el motivo,
Entonces el sistema cambia el estado a CANCELADA, libera la franja horaria en la agenda del estilista y envía confirmación de cancelación.
Escenario 2: Restricción de cancelación tardía
Dado que faltan menos de 60 minutos para la cita,
Cuando el cliente intenta cancelar desde la web,
Entonces el sistema bloquea la auto-cancelación directa e instruye: "Para cancelaciones de última hora, por favor comunícate directamente por teléfono con la peluquería".
ÉPICA 06: Historial, Experiencia y Fidelización
FEATURE 09: FE-09 - Historial Transaccional, Feedback y Reseñas
HU-21: Historial Completo de Citas y Re-agendamiento Rápido
Descripción:
Como cliente,
quiero ver el registro de todas mis citas pasadas (completadas y canceladas) con opción de "Repetir Cita",
para llevar control de mis servicios y agendar rápidamente con mi barbero favorito en un solo clic.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Re-agendamiento en un clic
Dado que el cliente revisa una cita completada el mes pasado con el estilista "Mateo",
Cuando presiona el botón "Repetir Servicio",
Entonces el sistema precarga el flujo de reservas con Mateo y el servicio de corte clásico, abriendo directamente el selector de fecha y hora.
HU-22: Calificación, Reseña y Propina Digital Post-Servicio
Descripción:
Como cliente con un servicio completado,
quiero otorgar una puntuación de 1 a 5 estrellas, dejar un comentario y registrar una propina voluntaria,
para valorar la atención de mi estilista y retroalimentar la calidad del establecimiento.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Envío de calificación y reseña
Dado que la cita pasó a estado COMPLETADA,
Cuando el cliente selecciona 5 estrellas y escribe "Excelente atención y corte impecable",
Entonces el sistema almacena la reseña, recalcula el promedio general de estrellas del estilista y publica el comentario en su perfil público.
FEATURE 10: FE-10 - Programa de Lealtad, Puntos y Reconocimiento VIP
HU-23: Programa de Fidelización e Insignia de Cliente VIP
Descripción:
Como cliente frecuente,
quiero visualizar mi nivel de cliente y desbloquear la insignia dorada VIP al superar las 20 citas,
para obtener reconocimiento y acceder a tarifas preferenciales en mis servicios.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Asignación automática de estatus VIP
Dado que un cliente completa su cita número 20,
Cuando el sistema procesa el cierre de la cita,
Entonces asigna el tag CLIENTE_VIP, despliega una animación de felicitaciones en su perfil e ilustra una insignia dorada visible tanto para él como para el administrador.
HU-24: Acumulación y Redención de Puntos por Visitas
Descripción:
Como cliente,
quiero acumular puntos por cada servicio completado y redimirlos como saldo a favor en futuras reservas,
para ahorrar dinero y premiar mi lealtad con el negocio.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Redención de puntos en reserva
Dado que un cliente tiene 500 puntos (equivalentes a $5.000 COP) y reserva un corte de $25.000,
Cuando marca el switch "Usar mis puntos acumulados",
Entonces el sistema descuenta el valor reflejando un total a pagar en caja de $20.000 y descuenta los puntos de su balance.
ÉPICA 07: Directorio Maestro de Clientes (Admin)
FEATURE 11: FE-11 - Directorio Centralizado y Trazabilidad de Clientes
HU-25: Directorio y Listado Centralizado de Clientes (Admin)
Descripción:
Como administrador,
quiero consultar el listado completo de clientes registrados con su número total de citas y última fecha de visita,
para conocer el volumen de mi clientela y segmentar a los usuarios más activos.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Paginación y búsqueda de clientes
Dado que el administrador ingresa a "Directorio de Clientes",
Cuando escribe el nombre o teléfono de un cliente en el cuadro de búsqueda,
Entonces el sistema filtra en tiempo real la tabla paginada mostrando: Nombre, Teléfono, Total Citas, Última Visita y Badges (ej. "VIP", "Nuevo").
HU-26: Ficha Histórica y Trazabilidad de Citas por Cliente
Descripción:
Como administrador,
quiero hacer clic sobre un cliente del directorio para ver su historial discriminado de citas,
para analizar su comportamiento, tasas de inasistencia (No-Shows) y fidelidad con los barberos.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Detalle histórico consolidado
Dado que el administrador selecciona a un cliente en particular,
Cuando carga el modal de detalle,
Entonces observa tres pestañas con el histórico: Citas Atendidas, Citas Canceladas y Citas con Inasistencia, con sus fechas y estilistas asignados.
ÉPICA 08: Analítica, Tableros de Control y Reportes Operacionales
FEATURE 12: FE-12 - Dashboard Operativo e Indicadores en Tiempo Real
HU-27: Tablero de Control Operativo y KPIs del Negocio (Admin)
Descripción:
Como administrador de la barbería,
quiero ver en el Dashboard principal los ingresos del día, total de citas atendidas y tasa de ocupación global,
para monitorear la salud financiera y operativa de mi negocio en tiempo real.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Carga reactiva de tarjetas métricas
Dado que existen citas registradas y atendidas en el día en curso,
Cuando el administrador ingresa al Dashboard principal,
Entonces el sistema calcula y muestra en menos de 1 segundo: 1) Ingresos facturados hoy, 2) Número total de citas agendadas vs completadas, 3) Porcentaje de ocupación semanal del local, y 4) Calificación promedio global por estrellas.
HU-28: Panel de Ocupación y Desempeño Individual del Estilista
Descripción:
Como estilista (y administrador),
quiero visualizar mi porcentaje de ocupación, total de clientes atendidos y propinas acumuladas en el mes,
para hacer seguimiento a mis metas de productividad y ganancias.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Consulta de métricas personales del barbero
Dado que el estilista entra a la pestaña "Mi Rendimiento",
Cuando selecciona el mes actual,
Entonces el sistema grafica sus horas laboradas vs productivas, el monto de comisiones ganadas y las valoraciones de sus clientes.
FEATURE 13: FE-13 - Reportes Ejecutivos, Demanda y Analítica Financiera
HU-29: Reportes Gráficos de Demanda y Servicios Más Solicitados
Descripción:
Como administrador,
quiero ver gráficas de barras y líneas con la evolución de citas por semana/mes y el ranking de servicios más vendidos,
para planificar promociones y compras de insumos basadas en tendencias reales de demanda.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Conmutación de periodicidad en gráficas
Dado que el administrador está en el módulo de Reportes,
Cuando cambia el filtro de "Vista Mensual" a "Vista Semanal",
Entonces las gráficas de Chart.js/Recharts se recalculan dinámicamente mostrando el volumen de citas por día de la semana actual.
HU-30: Reporte Consolidado de Satisfacción y Rendimiento Financiero
Descripción:
Como administrador,
quiero exportar reportes ejecutivos en PDF/Excel sobre el crecimiento mensual del negocio y la satisfacción de clientes,
para presentar balances a socios o tomar decisiones de expansión del local.
Criterios de Aceptación (Sintaxis Gherkin):
Escenario 1: Exportación exitosa de informe financiero
Dado que el administrador selecciona el rango del último trimestre,
Cuando hace clic en "Descargar Reporte Excel",
Entonces el backend genera y descarga una hoja de cálculo con el desglose de ingresos brutos, comisiones de barberos y calificaciones consolidadas en menos de 3 segundos