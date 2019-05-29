/*  POST /monthly-log/tp
    ::  criar uma nova entrada na task page
    */
CREATE OR REPLACE 
FUNCTION public.tp_criar_entrada(
    e_descricao text,
    e_dia integer,
    e_mes integer,
    e_ano integer,
    e_data text,
    e_cod_usuario integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    return select criar_entrada(e_descricao, e_dia, e_mes, e_ano, e_data, 1, 1, 1, 6, null, e_cod_usuario);
END
$BODY$;

/*  PUT /monthly-log/tp
    ::  atualiza dados de uma entrada na task page
    */
CREATE OR REPLACE 
FUNCTION public.tp_atualiza_entrada(
    e_cod_entrada integer,
    e_descricao text,
    e_cod_prioridade integer,
    e_cod_status integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    return select atualiza_entrada(e_cod_entrada, e_descricao, e_cod_prioridade, e_cod_status, 1);
END
$BODY$;

/*  DELETE /monthly-log/tp/:id
    ::  remove o uma entrada da task page
    */
CREATE OR REPLACE 
FUNCTION public.tp_remover_entrada(
    e_cod_entrada integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    return select remover_entrada(e_cod_entrada)
END
$BODY$;