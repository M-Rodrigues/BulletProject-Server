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

/*  PUT /daily-log
    ::  atualiza dados de uma entrada do daily log
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
FUNCTION public.dl_remover_entrada(
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


/*  GET /daily-log/:id
    ::  consulta 1 entrada do daily-log
    */
CREATE OR REPLACE 
FUNCTION public.dl_get_entrada(id integer)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$

BEGIN
	RETURN QUERY 
        SELECT row_to_json(u) 
        FROM (
            select * from entradas where e_cod_entrada = id
        ) as u;
END
$BODY$;

/*  GET /daily-log/last-week
    ::  consulta as entradas de daily-log dentro de 1 semana
    */
CREATE OR REPLACE 
FUNCTION public.dl_get_entradas_last_week(
    e_dia integer,
    e_mes integer,
    e_ano integer,
    e_cod_usuario integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    cur_cod_tempo integer;
BEGIN
    cur_cod_tempo := (select cod_tempo from tempo where dia = e_dia and mes = e_mes and ano = e_ano);

	RETURN QUERY 
        SELECT array_to_json(array_agg(row_to_json(res))) 
        FROM (
            select
                tt.dia, tt.mes, tt.ano, tt.dia_semana_nome, tt.mes_nome,
                (
                    SELECT array_to_json(array_agg(row_to_json(u))) 
                    FROM (
                        select e.*
                        from entradas as e 
                        where 
                            e.cod_usuario = e_cod_usuario
                            and e.cod_colecao = 4
                            and e.cod_tempo = tt.cod_tempo
                        order by e.cod_tempo
                    ) as u
                ) as entradas	
            from tempo as tt
            where 
                tt.cod_tempo >= cur_cod_tempo - 7
                and tt.cod_tempo <= cur_cod_tempo
            order by tt.cod_tempo desc
        ) as res;
END
$BODY$;


/*  GET /daily-log/last-month
    ::  consulta todas entradas de daily-log dentro de 1 mes
    */
CREATE OR REPLACE 
FUNCTION public.dl_get_entradas_last_month (
    e_dia integer,
    e_mes integer,
    e_ano integer,
    e_cod_usuario integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    cur_cod_tempo integer;
BEGIN
    cur_cod_tempo := (select cod_tempo from tempo where dia = e_dia and mes = e_mes and ano = e_ano);

	RETURN QUERY 
        SELECT array_to_json(array_agg(row_to_json(res))) 
        FROM (
            select
                tt.dia, tt.mes, tt.ano, tt.dia_semana_nome, tt.mes_nome,
                (
                    SELECT array_to_json(array_agg(row_to_json(u))) 
                    FROM (
                        select e.*
                        from entradas as e 
                        where 
                            e.cod_usuario = e_cod_usuario
                            and e.cod_colecao = 4
                            and e.cod_tempo = tt.cod_tempo
                        order by e.cod_tempo
                    ) as u
                ) as entradas	
            from tempo as tt
            where 
                tt.cod_tempo >= cur_cod_tempo - 30
                and tt.cod_tempo <= cur_cod_tempo
            order by tt.cod_tempo desc
        ) as res;
END
$BODY$;

/*  GET /daily-log
    ::  consulta todas entradas de daily-log do usuario
    */
CREATE OR REPLACE 
FUNCTION public.dl_get_entradas(
    e_cod_usuario integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$

BEGIN
	RETURN QUERY 
        SELECT array_to_json(array_agg(row_to_json(u))) 
        FROM (
            select e.*,
                (select row_to_json(date) from (
                    select t.dia, t.mes, t.ano, t.dia_semana_nome, t.mes_nome
                    from tempo as t
                    where t.cod_tempo = e.cod_tempo
                ) as date) as full_date
            from entradas as e 
            where e.cod_usuario = e_cod_usuario and e.cod_colecao = 4
            order by e.cod_tempo
        ) as u;
END
$BODY$;