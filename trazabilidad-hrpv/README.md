# Trazabilidad HRPV

Prototipo experimental para centralizar la recepción mensual de cifras de Estadísticas y Archivo Clínico del Hospital Regional de Puerto Vallarta.

## Modelo de trabajo

1. Cada responsable de área entrega su archivo mensual por el canal institucional vigente.
2. Se registra una ficha por área y periodo: responsable, fecha de recepción, folio, cantidad de indicadores y estado.
3. Las entregas recibidas pasan a una etapa distinta de revisión de fuente, definición operativa, periodo, unidad y consistencia.
4. Las discrepancias se aclaran con el área de origen antes de incorporar cifras al consolidado.
5. Se conserva la referencia al archivo original y al responsable que informó. La recepción no equivale a validación.

## Límites de esta versión

- La rama es experimental; no se integra a `main` ni altera el sistema actual.
- No conecta con Supabase ni con ningún servidor institucional.
- La lista de áreas y entregas es ficticia.
- El selector de archivo solo muestra localmente nombre y tamaño. No lee ni sube el contenido.
- Los cambios de la interfaz se pierden al recargar.
- No registrar nombres reales, datos personales, datos de pacientes, expedientes ni información institucional sensible en esta demostración.
- Antes de persistir datos se deben definir autenticación, permisos por rol, políticas RLS, auditoría de cambios, respaldo y autorización institucional.

## Siguiente validación propuesta

Probar el flujo con datos completamente ficticios y confirmar con el responsable del proceso:
- cuáles son las áreas que deben informar;
- el calendario y fecha límite mensual;
- el formato o plantilla oficial que entrega cada área;
- quién puede marcar una entrega como recibida, aclarada o validada;
- qué campos son obligatorios para la integración del consolidado.

La lista de 15 áreas no es un catálogo oficial y debe sustituirse por el listado confirmado por HRPV antes de usar el sistema para trabajo real.
