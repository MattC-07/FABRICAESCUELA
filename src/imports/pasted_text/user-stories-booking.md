Backlog de Historias de Usuario — Sistema de Reservas de Peluquería/Barbería
Jerarquía: Epic → Feature → Product Backlog Item (Historia de Usuario), tal como en Azure DevOps.
Formato de HU: Gherkin (Dado / Cuando / Entonces).
Roles: Administrador (dueño de la peluquería), Cliente, Estilista (proveedor).
---
EP-01 · Acceso al sistema
FE-01 · Registro de usuarios
HU-01: Registrarse como cliente de la peluquería
COMO: Cliente
QUIERO: Registrar mis datos personales (nombre, correo y contraseña)
PARA: Crear una cuenta y acceder al sistema de reservas de la peluquería
Escenario 1: Registro exitoso de cliente
DADO QUE me encuentro en la opción de registro de clientes
Y el sistema requiere un nombre completo, un correo electrónico válido y una contraseña segura
CUANDO diligencio todos los campos obligatorios con un formato válido (correo tipo `usuario@dominio.com` y contraseña con mínimo 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales)
Y presiono el botón "Registrarse"
ENTONCES el sistema crea la cuenta, limpia el formulario y muestra en pantalla el mensaje: "Registro exitoso"
Escenario 2: Prevención de registro con correo duplicado
DADO QUE estoy en el formulario de registro
CUANDO ingreso un correo electrónico que ya existe en la base de datos
Y presiono el botón "Registrarse"
ENTONCES el sistema bloquea el envío y muestra el mensaje de error: "Este correo ya está registrado"
---
FE-02 · Autenticación
HU-02: Iniciar sesión como administrador
COMO: Administrador (dueño de la peluquería)
QUIERO: Ingresar al sistema con mi correo y contraseña
PARA: Acceder al panel de administración del negocio
Escenario 1: Inicio de sesión exitoso
DADO QUE me encuentro en la pantalla de inicio de sesión de administrador
CUANDO ingreso un correo y una contraseña registrados y válidos
Y presiono el botón "Ingresar"
ENTONCES el sistema valida las credenciales y me redirige al Dashboard principal
Escenario 2: Credenciales inválidas
DADO QUE me encuentro en la pantalla de inicio de sesión de administrador
CUANDO ingreso un correo o contraseña incorrectos
Y presiono el botón "Ingresar"
ENTONCES el sistema muestra el mensaje de error: "Correo o contraseña incorrectos" y no me redirige
---
HU-04: Iniciar sesión como estilista
COMO: Estilista (proveedor)
QUIERO: Ingresar a la plataforma con mi correo y contraseña
PARA: Acceder a mi panel de agenda y desempeño
Escenario 1: Inicio de sesión exitoso
DADO QUE tengo credenciales de estilista registradas por el administrador
CUANDO ingreso mi correo y contraseña válidos
Y presiono "Ingresar"
ENTONCES el sistema me redirige directamente a la vista "Mi Agenda"
---
FE-03 · Login social
HU-03: Iniciar sesión como cliente
COMO: Cliente
QUIERO: Ingresar al sistema con mi correo y contraseña, o mediante un inicio de sesión rápido con Google u otra red social
PARA: Entrar a la aplicación sin fricciones
Escenario 1: Inicio de sesión con correo y contraseña
DADO QUE tengo una cuenta registrada
CUANDO ingreso mi correo y contraseña válidos
Y presiono "Ingresar"
ENTONCES el sistema me autentica y me lleva al menú principal de la aplicación
Escenario 2: Inicio de sesión rápido con Google
DADO QUE me encuentro en la pantalla de inicio de sesión
CUANDO selecciono la opción "Continuar con Google"
Y autorizo el acceso desde mi cuenta de Google
ENTONCES el sistema crea o vincula mi cuenta automáticamente y me lleva al menú principal
---
EP-02 · Dashboard administrador
FE-04 · Métricas generales del negocio
HU-05: Visualizar métricas generales del negocio
COMO: Administrador
QUIERO: Ver en el Dashboard las citas totales de todos mis trabajadores, los ingresos de hoy, la ocupación semanal y la valoración promedio de las personas
PARA: Tener una visión general e inmediata del estado de mi negocio
Escenario 1: Carga correcta de las tarjetas de métricas
DADO QUE ingresé al sistema como administrador
CUANDO accedo al Dashboard
ENTONCES el sistema muestra cuatro tarjetas con: el total de citas de todos los estilistas, los ingresos generados en el día actual, el porcentaje de ocupación semanal y el puntaje/valoración promedio de los clientes
---
FE-05 · Métricas por estilista
HU-06: Visualizar ocupación por estilista
COMO: Administrador
QUIERO: Ver el porcentaje de ocupación de cada uno de mis estilistas
PARA: Identificar quién tiene más o menos carga de trabajo
Escenario 1: Visualización de ocupación por estilista
DADO QUE me encuentro en el Dashboard
CUANDO reviso la sección de ocupación por estilista
ENTONCES el sistema muestra un listado con el nombre de cada estilista y su porcentaje de ocupación actual
---
FE-06 · Gráficas de citas y servicios
HU-07: Visualizar gráfica de citas por periodo
COMO: Administrador
QUIERO: Ver una gráfica de barras con el número de citas y elegir si se muestra por mes o por semana
PARA: Analizar la tendencia de citas en el tiempo que me interese
Escenario 1: Cambio de vista mensual a semanal
DADO QUE estoy en el Dashboard viendo la gráfica de citas
CUANDO selecciono la opción "Semana" en el cuadro de elección
ENTONCES la gráfica se actualiza mostrando el número de citas de cada día de la semana actual
Escenario 2: Vista mensual por defecto
DADO QUE estoy en el Dashboard
CUANDO selecciono la opción "Mes" en el cuadro de elección
ENTONCES la gráfica muestra el número de citas agrupado por cada mes disponible
HU-08: Visualizar gráfica de servicios más solicitados
COMO: Administrador
QUIERO: Ver una gráfica de barras con los servicios más solicitados
PARA: Identificar qué servicios generan más demanda en mi negocio
Escenario 1: Visualización de servicios más solicitados
DADO QUE me encuentro en el Dashboard
CUANDO reviso la gráfica de servicios más solicitados
ENTONCES el sistema muestra cada servicio ofrecido junto con el número de veces que ha sido reservado, ordenado de mayor a menor
---
EP-03 · Gestión de equipo
FE-07 · Administración de estilistas (alta/baja)
HU-09: Agregar un nuevo estilista
COMO: Administrador
QUIERO: Registrar un nuevo estilista en el sistema
PARA: Incorporarlo a mi equipo de trabajo y asignarle citas
Escenario 1: Registro exitoso de estilista
DADO QUE me encuentro en la sección "Equipo"
CUANDO presiono "Agregar estilista" y diligencio su nombre, teléfono y horario disponible
Y presiono "Guardar"
ENTONCES el sistema agrega al estilista al listado de equipo y muestra el mensaje: "Estilista agregado exitosamente"
HU-11: Eliminar un estilista
COMO: Administrador
QUIERO: Quitar a un estilista del sistema
PARA: Mantener actualizado mi equipo de trabajo cuando alguien deja de laborar
Escenario 1: Eliminación exitosa
DADO QUE me encuentro en la ficha de un estilista sin citas futuras pendientes
CUANDO presiono la opción "Eliminar estilista"
Y confirmo la acción en el cuadro de diálogo
ENTONCES el sistema elimina al estilista del listado y muestra el mensaje: "Estilista eliminado"
Escenario 2: Intento de eliminar estilista con citas pendientes
DADO QUE un estilista tiene citas futuras agendadas
CUANDO intento eliminarlo
ENTONCES el sistema bloquea la acción y muestra el mensaje: "No se puede eliminar: el estilista tiene citas pendientes"
---
FE-08 · Consulta de disponibilidad e información del estilista
HU-10: Consultar horario disponible de un estilista
COMO: Administrador
QUIERO: Ver el horario disponible de un estilista específico
PARA: Conocer su disponibilidad antes de asignarle citas
Escenario 1: Consulta de horario
DADO QUE me encuentro en la sección "Equipo"
CUANDO selecciono a un estilista de la lista
ENTONCES el sistema muestra su horario disponible organizado por día y franja horaria
HU-12: Visualizar ficha resumen del estilista
COMO: Administrador
QUIERO: Ver el nombre, puntaje, promedio de citas al mes y número de teléfono de cada estilista
PARA: Tener información completa de mi equipo en un solo lugar
Escenario 1: Visualización de ficha
DADO QUE me encuentro en la sección "Equipo"
CUANDO selecciono a un estilista
ENTONCES el sistema muestra su nombre, puntaje promedio, número de citas promedio al mes y número de teléfono
---
EP-04 · Gestión de servicios
FE-09 · Catálogo de servicios (CRUD)
HU-13: Agregar un nuevo servicio
COMO: Administrador
QUIERO: Registrar un nuevo tipo de servicio con su valor y duración
PARA: Ofrecerlo a mis clientes dentro del sistema de reservas
Escenario 1: Registro exitoso de servicio
DADO QUE me encuentro en la sección "Servicios"
CUANDO presiono "Agregar servicio" y diligencio el nombre, el valor y la duración en minutos
Y presiono "Guardar"
ENTONCES el sistema agrega el servicio al listado y muestra el mensaje: "Servicio agregado exitosamente"
HU-14: Editar un servicio existente
COMO: Administrador
QUIERO: Modificar el nombre, valor o duración de un servicio ya creado
PARA: Mantener actualizada mi oferta de servicios
Escenario 1: Edición exitosa
DADO QUE me encuentro en el listado de servicios
CUANDO selecciono un servicio y modifico su valor o duración
Y presiono "Guardar cambios"
ENTONCES el sistema actualiza la información y muestra el mensaje: "Servicio actualizado"
HU-15: Eliminar un servicio
COMO: Administrador
QUIERO: Eliminar un servicio que ya no ofrezco
PARA: Mantener depurado mi catálogo de servicios
Escenario 1: Eliminación exitosa
DADO QUE me encuentro en el listado de servicios
CUANDO selecciono un servicio y presiono "Eliminar"
Y confirmo la acción
ENTONCES el sistema elimina el servicio del catálogo y muestra el mensaje: "Servicio eliminado"
---
EP-05 · Gestión de clientes (vista administrador)
FE-10 · Directorio de clientes
HU-16: Visualizar listado de clientes
COMO: Administrador
QUIERO: Ver el nombre de cada cliente, el servicio de su última visita y el número total de citas que ha tenido
PARA: Conocer a mi base de clientes y su historial de consumo
Escenario 1: Carga del listado de clientes
DADO QUE me encuentro en la sección "Clientes"
CUANDO la vista termina de cargar
ENTONCES el sistema muestra una lista con el nombre, el servicio de la última visita y el número de citas de cada cliente
HU-18: Visualizar detalle de citas de un cliente
COMO: Administrador
QUIERO: Ver, al dar clic sobre un cliente, las citas que ha pedido, las que ha cancelado y las que ha completado con éxito
PARA: Analizar el comportamiento histórico de ese cliente
Escenario 1: Consulta del detalle de un cliente
DADO QUE me encuentro en el listado de clientes
CUANDO doy clic sobre un cliente específico
ENTONCES el sistema muestra tres secciones con sus citas pedidas, sus citas canceladas y sus citas completadas exitosamente
---
FE-11 · Programa de fidelización (insignias)
HU-17: Visualizar insignia de cliente premium
COMO: Administrador
QUIERO: Ver una insignia de oro junto a los clientes que superan las 20 citas
PARA: Identificar fácilmente a mis clientes fijos o premium
Escenario 1: Cliente alcanza el estatus premium
DADO QUE un cliente supera las 20 citas registradas
CUANDO consulto el listado de clientes
ENTONCES el sistema muestra una insignia de oro junto al nombre de ese cliente indicando que es cliente fijo/premium
---
EP-06 · Reportes del negocio
FE-12 · Reportes de crecimiento
HU-19: Visualizar reporte de crecimiento del negocio
COMO: Administrador
QUIERO: Ver un reporte con gráficas del incremento del negocio a lo largo del tiempo
PARA: Tomar decisiones informadas sobre el crecimiento de mi peluquería
Escenario 1: Consulta del reporte de crecimiento
DADO QUE me encuentro en la sección "Reportes"
CUANDO selecciono el reporte de "Crecimiento del negocio"
ENTONCES el sistema muestra gráficas comparativas de ingresos y citas entre periodos anteriores y el periodo actual
---
FE-13 · Reportes de estilistas
HU-20: Visualizar reporte de desempeño por estilista
COMO: Administrador
QUIERO: Ver información detallada del desempeño de cada estilista
PARA: Evaluar productividad, calidad de servicio y carga de trabajo de mi equipo
Escenario 1: Consulta del reporte de desempeño
DADO QUE me encuentro en la sección "Reportes"
CUANDO selecciono el reporte "Desempeño de estilistas"
ENTONCES el sistema muestra, por cada estilista, sus citas atendidas, ingresos generados y calificación promedio en el periodo seleccionado
---
FE-14 · Reportes de satisfacción
HU-21: Visualizar reporte de satisfacción de clientes
COMO: Administrador
QUIERO: Ver un reporte sobre el confort y la satisfacción de mis clientes
PARA: Identificar oportunidades de mejora en la experiencia del servicio
Escenario 1: Consulta del reporte de satisfacción
DADO QUE me encuentro en la sección "Reportes"
CUANDO selecciono el reporte "Satisfacción de clientes"
ENTONCES el sistema muestra la calificación promedio general, la evolución de las reseñas en el tiempo y los comentarios más recientes
---
EP-07 · App Cliente — Descubrimiento y agendamiento
FE-15 · Búsqueda y recomendaciones
HU-22: Buscar barbería o estilista
COMO: Cliente
QUIERO: Buscar barberías o estilistas por cercanía, especialidad o nombre
PARA: Encontrar rápidamente la opción que mejor se ajuste a lo que necesito
Escenario 1: Búsqueda por especialidad
DADO QUE me encuentro en el menú principal de la aplicación
CUANDO escribo una especialidad (por ejemplo, "corte clásico") en el buscador
ENTONCES el sistema muestra un listado de barberías/estilistas que ofrecen esa especialidad, ordenado por cercanía
HU-23: Ver recomendaciones personalizadas
COMO: Cliente
QUIERO: Ver recomendaciones basadas en mis gustos y servicios anteriores
PARA: Descubrir opciones relevantes sin tener que buscar manualmente
Escenario 1: Visualización de recomendaciones
DADO QUE tengo un historial de citas previas en la aplicación
CUANDO ingreso al menú principal
ENTONCES el sistema muestra una sección de "Recomendados para ti" con barberías o servicios similares a los que he solicitado antes
---
FE-16 · Mapa en tiempo real
HU-24: Ver mapa interactivo de barberías cercanas
COMO: Cliente
QUIERO: Ver un mapa interactivo con las barberías abiertas cerca de mí en tiempo real
PARA: Elegir fácilmente una opción disponible según mi ubicación
Escenario 1: Visualización del mapa
DADO QUE he dado permiso de ubicación a la aplicación
CUANDO accedo a la vista de mapa desde el menú principal
ENTONCES el sistema muestra un mapa con las barberías cercanas marcadas, indicando cuáles están abiertas en este momento
---
EP-08 · App Cliente — Mis citas
FE-17 · Gestión de citas activas
HU-25: Visualizar cita activa
COMO: Cliente
QUIERO: Ver en la pestaña "Activas" mi cita en curso o en camino, con cuenta regresiva y ubicación GPS
PARA: Saber en todo momento cuánto falta y cómo llegar
Escenario 1: Visualización de cita activa
DADO QUE tengo una cita agendada próxima a comenzar
CUANDO ingreso a la sección "Mis Citas" pestaña "Activas"
ENTONCES el sistema muestra la cuenta regresiva del tiempo restante y la ubicación exacta en GPS de la barbería
HU-26: Cancelar o reprogramar una cita activa
COMO: Cliente
QUIERO: Cancelar o reprogramar mi cita activa al instante, sin penalizaciones ocultas
PARA: Tener flexibilidad si surge un imprevisto
Escenario 1: Cancelación exitosa
DADO QUE tengo una cita activa
CUANDO presiono el botón "Cancelar"
Y confirmo la acción
ENTONCES el sistema cancela la cita, libera el horario del estilista y muestra el mensaje: "Cita cancelada"
Escenario 2: Reprogramación exitosa
DADO QUE tengo una cita activa
CUANDO presiono el botón "Reprogramar" y selecciono una nueva fecha y hora disponible
ENTONCES el sistema actualiza la cita con el nuevo horario y muestra el mensaje: "Cita reprogramada exitosamente"
HU-27: Llamar al barbero desde la cita activa
COMO: Cliente
QUIERO: Llamar directamente al barbero desde la pantalla de mi cita activa
PARA: Comunicarme fácilmente si necesito avisar algo antes de llegar
Escenario 1: Llamada exitosa
DADO QUE me encuentro en la vista de mi cita activa
CUANDO presiono el botón "Llamar"
ENTONCES el sistema inicia una llamada telefónica al número del estilista asignado
---
FE-18 · Historial de citas
HU-28: Ver historial y repetir cita
COMO: Cliente
QUIERO: Ver mi historial de citas completadas y repetir el mismo servicio y barbero con un solo toque
PARA: Agendar más rápido cuando quiero el mismo servicio
Escenario 1: Repetir cita completada
DADO QUE me encuentro en la pestaña "Historial" viendo una cita completada
CUANDO presiono el botón "Repetir"
ENTONCES el sistema pre-llena una nueva reserva con el mismo estilista y servicio, y me lleva a confirmar fecha y hora
HU-29: Dejar propina digital o reseña
COMO: Cliente
QUIERO: Dejar una propina digital o una reseña después de una cita completada
PARA: Reconocer el servicio recibido
Escenario 1: Dejar reseña
DADO QUE tengo una cita marcada como completada
CUANDO selecciono "Dejar reseña", asigno una calificación y escribo un comentario
Y presiono "Enviar"
ENTONCES el sistema guarda la reseña y actualiza la calificación promedio del estilista
Escenario 2: Dejar propina digital
DADO QUE tengo una cita marcada como completada
CUANDO selecciono "Dejar propina" e ingreso un monto
Y confirmo el pago
ENTONCES el sistema procesa la propina y muestra el mensaje: "Propina enviada exitosamente"
HU-30: Ver historial de citas canceladas
COMO: Cliente
QUIERO: Ver el registro de mis citas canceladas
PARA: Tener trazabilidad de las citas que no se llevaron a cabo
Escenario 1: Consulta de citas canceladas
DADO QUE me encuentro en la pestaña "Historial"
CUANDO selecciono el filtro "Canceladas"
ENTONCES el sistema muestra el listado de citas canceladas con fecha, estilista y motivo si fue registrado
---
EP-09 · App Cliente — Perfil y recompensas
FE-19 · Perfil y pagos
HU-31: Gestionar datos de perfil y métodos de pago
COMO: Cliente
QUIERO: Ver y editar mis datos personales y mis métodos de pago guardados
PARA: Mantener actualizada mi información y agilizar mis pagos
Escenario 1: Edición exitosa de perfil
DADO QUE me encuentro en la sección "Perfil"
CUANDO modifico mis datos personales o agrego un nuevo método de pago
Y presiono "Guardar"
ENTONCES el sistema actualiza la información y muestra el mensaje: "Perfil actualizado"
---
FE-20 · Programa de puntos/VIP
HU-32: Visualizar nivel o insignia VIP
COMO: Cliente
QUIERO: Ver mi nivel o insignia de oro al superar las 20 citas
PARA: Sentirme reconocido como cliente VIP
Escenario 1: Obtención de insignia VIP
DADO QUE alcanzo mi cita número 21
CUANDO ingreso a la sección "Perfil"
ENTONCES el sistema muestra una insignia de oro junto a mi nombre indicando mi estatus VIP
HU-33: Acumular y redimir puntos por referidos
COMO: Cliente
QUIERO: Acumular puntos por cada corte y por referir a otras personas, y redimirlos por descuentos
PARA: Obtener beneficios en futuros servicios o productos
Escenario 1: Acumulación de puntos
DADO QUE completo una cita exitosamente
CUANDO el sistema procesa el pago del servicio
ENTONCES el sistema acredita automáticamente los puntos correspondientes a mi cuenta
Escenario 2: Redención de puntos
DADO QUE tengo puntos suficientes acumulados
CUANDO selecciono un descuento disponible en la sección "Recompensas" y confirmo su uso
ENTONCES el sistema aplica el descuento en mi próxima reserva y descuenta los puntos utilizados
---
EP-10 · App Estilista — Agenda y desempeño
FE-21 · Agenda del estilista
HU-34: Visualizar panel "Mi Agenda"
COMO: Estilista
QUIERO: Ver mi agenda del día con un selector de fechas para navegar por los días de la semana
PARA: Organizar mi jornada de trabajo
Escenario 1: Navegación entre días
DADO QUE ingresé a mi panel como estilista
CUANDO selecciono un día distinto en el selector de fechas
ENTONCES el sistema actualiza la vista mostrando las citas correspondientes a ese día
HU-35: Visualizar métricas del día
COMO: Estilista
QUIERO: Ver el número total de citas, los ingresos proyectados y las horas ocupadas del día seleccionado
PARA: Tener un resumen rápido de mi jornada
Escenario 1: Carga de métricas del día
DADO QUE me encuentro en la vista "Mi Agenda"
CUANDO selecciono un día en el calendario
ENTONCES el sistema muestra tres tarjetas con el número de citas agendadas, el monto de ingresos proyectados y el total de horas ocupadas para ese día
HU-36: Visualizar detalle de citas por hora
COMO: Estilista
QUIERO: Ver mis citas del día ordenadas por hora, con el cliente, estado, servicio, duración y precio
PARA: Saber exactamente qué debo atender y cuándo
Escenario 1: Visualización del cronograma diario
DADO QUE me encuentro en la vista "Mi Agenda" de un día con citas registradas
CUANDO reviso el listado de tarjetas de citas
ENTONCES el sistema muestra, para cada cita, la hora de inicio, el nombre del cliente, el estado ("Confirmada" o "Pendiente"), el servicio reservado, su duración en minutos y el precio a cobrar en el local
---
FE-22 · Bloqueo de horarios
HU-37: Bloquear una franja horaria
COMO: Estilista
QUIERO: Bloquear manualmente franjas de tiempo específicas en mi calendario
PARA: Gestionar descansos, almuerzos o imprevistos sin recibir nuevas citas en ese horario
Escenario 1: Bloqueo exitoso de horario
DADO QUE me encuentro en la vista "Mi Agenda"
CUANDO presiono el botón "Bloquear" y selecciono una franja horaria específica
Y confirmo la acción
ENTONCES el sistema inhabilita esa franja para nuevas reservas y la muestra marcada como "Bloqueada" en mi calendario
---
FE-23 · Gestión de mis clientes (estilista)
HU-38: Gestionar "Mis clientes"
COMO: Estilista
QUIERO: Acceder a un módulo de "Mis Clientes" desde el menú lateral
PARA: Consultar y gestionar la información de las personas que atiendo
Escenario 1: Consulta de mis clientes
DADO QUE me encuentro en el menú lateral de mi panel
CUANDO selecciono la opción "Mis Clientes"
ENTONCES el sistema muestra el listado de clientes que he atendido, con su información básica de contacto e historial conmigo
---
FE-24 · Reputación y desempeño
HU-39: Visualizar "Mi Desempeño"
COMO: Estilista
QUIERO: Ver mi especialidad destacada, mi calificación promedio por estrellas y el total de reseñas recibidas
PARA: Hacer seguimiento a mi reputación pública tal como la ven los clientes
Escenario 1: Consulta de desempeño
DADO QUE me encuentro en el menú lateral de mi panel
CUANDO selecciono la opción "Mi Desempeño"
ENTONCES el sistema muestra mi especialidad destacada, mi calificación promedio (ej. 4.9) y el número total de reseñas recibidas
---
Resumen del backlog
Épica	Features	HUs
EP-01 Acceso al sistema	FE-01, FE-02, FE-03	HU-01 a HU-04
EP-02 Dashboard administrador	FE-04, FE-05, FE-06	HU-05 a HU-08
EP-03 Gestión de equipo	FE-07, FE-08	HU-09 a HU-12
EP-04 Gestión de servicios	FE-09	HU-13 a HU-15
EP-05 Gestión de clientes (admin)	FE-10, FE-11	HU-16 a HU-18
EP-06 Reportes del negocio	FE-12, FE-13, FE-14	HU-19 a HU-21
EP-07 App cliente — descubrimiento	FE-15, FE-16	HU-22 a HU-24
EP-08 App cliente — mis citas	FE-17, FE-18	HU-25 a HU-30
EP-09 App cliente — perfil y recompensas	FE-19, FE-20	HU-31 a HU-33
EP-10 App estilista — agenda y desempeño	FE-21, FE-22, FE-23, FE-24	HU-34 a HU-39
Total: 10 Epics · 24 Features · 39 Historias de Usuario.
Para llegar a las ~45 HU que mencionas, se pueden desglosar aún más algunas historias compuestas (por ejemplo, separar recuperación de contraseña, notificaciones push, o pagos en línea del catálogo de servicios) como nuevas Features/HU independientes.