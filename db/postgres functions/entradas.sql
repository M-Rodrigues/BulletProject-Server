-- CREATE ENTRADA
CREATE OR REPLACE 
FUNCTION public.criar_entrada(
    e_descricao text,
    e_dia integer,
    e_mes integer,
    e_ano integer,
    e_data text,
    e_cod_prioridade integer,
    e_cod_status integer,
    e_cod_tipo integer,
    e_cod_colecao integer,
    e_cod_entrada_parent integer,
    e_cod_usuario integer,
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    insert into entradas 
    (descricao, cod_prioridade, cod_status, cod_tipo, cod_colecao, cod_entrada_parent, cod_usuario, data)
    values 
    (e_descricao, e_cod_prioridade, e_cod_status, e_cod_tipo, e_cod_colecao, e_cod_entrada_parent, e_cod_usuario, e_data);
    
    update entradas
    set
        cod_tempo = t.cod_tempo
    from
        tempo as t
    where
        descricao = e_descricao
        and cod_colecao = e_cod_colecao
        and cod_usuario = e_cod_usuario
        and data = e_data
        and t.dia = e_dia
        and t.mes = e_mes
        and t.ano = e_ano;

    return query 
        select row_to_json(e) 
        from (
            select * 
            from entradas
            where 
                descricao = e_descricao
                and cod_colecao = e_cod_colecao
                and cod_usuario = e_cod_usuario
                and data = e_data
        ) as e;    
END
$BODY$;

-- UPDATE ENTRADA
CREATE OR REPLACE 
FUNCTION public.atualiza_entrada(
    e_cod_entrada integer,
    e_descricao text,
    e_cod_prioridade integer,
    e_cod_status integer,
    e_tipo integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    update entradas
    set 
        descricao = e_descricao,
        cod_prioridade = e_cod_prioridade,
        cod_status = e_cod_status,
        cod_tipo = e_cod_tipo
    where
        cod_entrada = e_cod_entrada

    return query 
        select row_to_json(e) 
        from (
            select * from entradas
            where cod_entrada = e_cod_entrada
        ) as e;    
END
$BODY$;

-- DELETE ENTRADA
CREATE OR REPLACE 
FUNCTION public.remover_entrada(
    e_cod_entrada integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    delete from entradas
    where cod_entrada = e_cod_entrada

    return query 
        select row_to_json(e) 
        from (
            select
                'Entrada removida com sucesso' as msg,
                0 as status
        ) as e;    
END
$BODY$;