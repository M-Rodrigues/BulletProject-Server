/*  GET /monthly-log/tp/:month/:year
    ::  consulta todas entradas de task-page referentes a month/year
    */
CREATE OR REPLACE 
FUNCTION public.tp_get_entradas_by_monthyear (
    e_mes integer,
    e_ano integer,
    e_cod_usuario integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    max_cod integer;
    min_cod integer;
    nome_mes text;
BEGIN
    max_cod := (select max(cod_tempo) from tempo where mes = e_mes and ano = e_ano);
    min_cod := (select min(cod_tempo) from tempo where mes = e_mes and ano = e_ano);
    nome_mes := (select mes_nome from tempo where cod_tempo = min_cod);

    return query
        select row_to_json(e) from (
            select
                e_mes as mes,
                e_ano as ano,
                nome_mes as nome_mes,
                (
                    select  array_to_json(array_agg(row_to_json(e))) from (
                        select *
                        from 
                            entradas
                        where
                            cod_tempo >= min_cod
                            and cod_tempo <= max_cod
                            and cod_usuario = e_cod_usuario
                            and cod_colecao = 6
                    ) as e
                ) as entradas
        ) as e;
END
$BODY$;

select row_to_json(e) from (
    select *
    from 
        entradas
    where
        cod_tempo >= 3408
        and cod_tempo <= 3438
        and cod_usuario = 3
) as e

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
    return query 
        select criar_entrada(e_descricao, e_dia, e_mes, e_ano, e_data, 1, 1, 1, 6, null, e_cod_usuario);
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
    return query 
        select atualiza_entrada(e_cod_entrada, e_descricao, e_cod_prioridade, e_cod_status, 1);
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
    return query 
        select remover_entrada(e_cod_entrada);
END
$BODY$;