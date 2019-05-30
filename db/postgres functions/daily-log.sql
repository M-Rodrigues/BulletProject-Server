/*  POST /daily-log
    ::  criar uma nova entrada no daily log
    */
CREATE OR REPLACE 
FUNCTION public.dl_criar_entrada (
    e_descricao text,
    e_dia integer,
    e_mes integer,
    e_ano integer,
    e_data text,
    e_cod_tipo integer,
    e_cod_usuario integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    return query 
        select criar_entrada(e_descricao, e_dia, e_mes, e_ano, e_data, 1, 1, e_cod_tipo, 4, null, e_cod_usuario);
END
$BODY$;

/*  PUT /future-log
    ::  atualiza dados de uma entrada do future log
    */
CREATE OR REPLACE 
FUNCTION public.dl_atualiza_entrada(
    e_cod_entrada integer,
    e_descricao text,
    e_cod_prioridade integer,
    e_cod_status integer,
    e_cod_tipo integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    return query 
        select atualiza_entrada(e_cod_entrada, e_descricao, e_cod_prioridade, e_cod_status, e_cod_tipo);
END
$BODY$;

/*  DELETE /daily-log/:id
    ::  remove o uma entrada do daily log
    */
CREATE OR REPLACE 
FUNCTION public.tp_remover_entrada(
    e_cod_entrada integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    return query 
        select remover_entrada(e_cod_entrada);
END
$BODY$;