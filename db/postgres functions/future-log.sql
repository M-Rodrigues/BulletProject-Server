/*  GET /future-log/full-year
    ::  consulta todas entradas de future log dos próximos 12 meses
    */
CREATE OR REPLACE 
FUNCTION public.fl_get_entradas_next_year (
    e_mes integer,
    e_ano integer,
    e_cod_usuario integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    return query
    
    select array_to_json(array_agg(row_to_json(ans))) 
    from (
        SELECT DISTINCT ON (doc) doc
        FROM  (
            SELECT (
                select array_to_json(array_agg(row_to_json(result))) 
                from (
                    select
                        t.mes,
                        t.mes_nome,
                        t.ano,
                        (
                            select array_to_json(array_agg(row_to_json(entr))) 
                            from (
                                select
                                    e.cod_entrada,
                                    e.descricao,
                                    e.data
                                from entradas as e
                                where
                                    e.cod_usuario = e_cod_usuario
                                    and e.cod_tempo <= (select max(cod_tempo) from tempo where mes = t.mes and ano = t.ano)
                                    and e.cod_tempo >= (select min(cod_tempo) from tempo where mes = t.mes and ano = t.ano)
                            ) as entr
                        ) as entradas
                    from tempo as t
                    where
                        t.cod_tempo <= (select max(cod_tempo) from tempo where mes = e_mes and ano = e_ano+1)
                        and t.cod_tempo >= (select min(cod_tempo) from tempo where mes = e_mes and ano = e_ano)
                ) as result
            )::jsonb AS j
        ) t
        , jsonb_array_elements(t.j) WITH ORDINALITY t1(doc)
    ) as ans;

END
$BODY$;

/*  GET /future-log/:month/:year
    ::  consulta todas entradas de future log referentes a month/year
    */
CREATE OR REPLACE 
FUNCTION public.fl_get_entradas_by_monthyear (
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
        select array_to_json(array_agg(row_to_json(e))) from (
            select
                e_mes as mes,
                e_ano as ano,
                nome_mes as nome_mes,
                (
                    select  array_to_json(array_agg(row_to_json(e))) from (
                        select *,
                            (
                                select row_to_json(t)
                                from (
                                    select * from tempo as tt where tt.cod_tempo = ee.cod_tempo
                                ) as t
                            ) as full_date
                        from 
                            entradas as ee
                        where
                            cod_tempo >= min_cod
                            and cod_tempo <= max_cod
                            and cod_usuario = e_cod_usuario
                            and cod_colecao = 2
                        order by ee.cod_tempo
                    ) as e
                ) as entradas
            from tempo as t
            where
                t.cod_tempo = min_cod
        ) as e;
END
$BODY$;

/*  POST /future-log
    ::  criar uma nova entrada no future log
    */
CREATE OR REPLACE 
FUNCTION public.fl_criar_entrada (
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
        select criar_entrada(e_descricao, e_dia, e_mes, e_ano, e_data, 1, 1, e_cod_tipo, 2, null, e_cod_usuario);
END
$BODY$;

/*  PUT /future-log
    ::  atualiza dados de uma entrada do future log
    */
CREATE OR REPLACE 
FUNCTION public.fl_atualiza_entrada(
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

/*  DELETE /future-log/:id
    ::  remove o uma entrada do future log
    */
CREATE OR REPLACE 
FUNCTION public.fl_remover_entrada (
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