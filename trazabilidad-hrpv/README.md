# Trazabilidad HRPV

Rama experimental e independiente para diseñar un registro de trazabilidad documental para Estadísticas y Archivo Clínico del Hospital Regional de Puerto Vallarta.

## Objetivo del piloto

Registrar manualmente valores de indicadores y dejar evidencia verificable de su origen, periodo, revisión y comparación con la aplicación correspondiente.

## Límites del piloto

- No modificar las páginas existentes de la aplicación de Estadísticas.
- No desplegar cambios en Supabase ni ejecutar migraciones desde esta rama.
- No subir documentos originales, expedientes clínicos, datos personales ni rutas completas del disco institucional.
- No extraer datos automáticamente de archivos locales.
- Los documentos fuente permanecen en el almacenamiento institucional.
- Los valores y metadatos que se capturen en la futura interfaz web se transmitirán a Supabase; requieren autenticación, autorización y políticas RLS antes de habilitar escritura.

## Identificación de documentos

La interfaz usará un código documental y el nombre de archivo para relacionar cada registro con su original. La ruta completa del archivo permanecerá local, salvo que una evaluación institucional posterior autorice expresamente almacenarla en línea.

## Modelo conceptual propuesto

- **Documentos:** código, nombre, tipo, periodo y referencia documental no sensible.
- **Indicadores:** nombre, definición operativa, unidad y regla de comparación.
- **Evidencias:** documento, indicador, valor transcrito, ubicación exacta dentro de la fuente, valor comparado y diferencia.
- **Revisiones:** estado, observaciones, responsable y fecha.
- **Historial de cambios:** registro de modificaciones y motivo.

Este modelo es conceptual. No crea tablas ni altera ninguna base de datos.

## Primer caso de prueba

- Periodo: agosto de 2026.
- Documento: `032-reporteEgresos-AGO2026.xls`.
- Indicador candidato: egresos totales.
- Valor reportado: 429.
- Ubicación propuesta: B65, pendiente de confirmación directa en el archivo original.
- Valor de aplicación: 429.
- Estado inicial: pendiente de validación semántica y documental.

No se debe cerrar la revisión solo porque ambos valores coincidan numéricamente.

## Siguientes hitos

1. Confirmar el diseño de datos y el modelo de acceso.
2. Preparar una interfaz estática de demostración, sin conexión a Supabase.
3. Revisar el esquema de autenticación y las políticas RLS antes de implementar persistencia.
4. Probar con datos ficticios y después con el piloto autorizado.
5. Solicitar revisión antes de integrar cualquier elemento a la aplicación existente.
