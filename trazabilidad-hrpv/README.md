# Procedencia de cifras · HRPV

Prototipo independiente para registrar de dónde se obtuvo un valor digitado en el control mensual de indicadores hospitalarios.

## Flujo mínimo

1. Elegir mes y año.
2. Seleccionar un indicador que ya existe como columna de `public.indicadores_mensuales`.
3. Digitar el valor capturado.
4. Pegar la ruta del archivo fuente.
5. Opcionalmente, añadir una pista como hoja o celda (por ejemplo, “Resumen, F27”).

## Alcance y límites

- Se trabaja en la rama experimental `feature/trazabilidad-hrpv`; no se fusiona a `main` ni modifica la aplicación vigente.
- No conecta con Supabase y no escribe ni lee datos de producción.
- No se suben ni se leen archivos. La ruta se guarda como texto.
- Los registros se guardan únicamente en el almacenamiento local del navegador usado para la prueba. No se sincronizan con otros equipos ni con otros navegadores.
- El catálogo de indicadores se basa en los nombres y descripciones disponibles en la estructura de `indicadores_mensuales`; no contiene valores reales.
- No introducir datos personales, datos de pacientes, expedientes ni información sensible en el prototipo.

## Antes de usarlo como herramienta de trabajo

Validar el flujo con referencias ficticias. Para compartir registros entre equipos o conservarlos de manera institucional, se necesitará definir dónde persistirlos, quién puede consultarlos y editarlos, y los controles de acceso correspondientes. Eso no forma parte de este prototipo.
