/*  GET /monthly-log/tp/:month/:year
    ::  consulta todas entradas de task-page referentes a month/year
    */
CREATE OR REPLACE 
FUNCTION public.tp_get_entradas_by_monthyear(
    e_data_my text,
    e_cod_usuario integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    return query 
        select row_to_json(es) 
        from (
            select 
                distinct *,
                (   select array_to_json(array_agg(row_to_json(ent))) from 
                    (   select *
                        from entradas as e
                        where exists
                        (
                            select 1
                            from tempo
                            where
                                e.cod_tempo = t.cod_tempo
                                and concat(case when t.mes < 10 THEN '0' ELSE '' END,t.mes,t.ano) = e_data_my
                        )
                    ) as ent
                ) as entradas 
            from tempo as t
            where 
                concat(case when t.mes < 10 THEN '0' ELSE '' END,t.mes,t.ano) = e_data_my
        ) as es;  
END
$BODY$;

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
        select remover_entrada(e_cod_entrada)
END
$BODY$;