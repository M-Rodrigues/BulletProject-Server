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
    insert into entradas 
    (descricao, cod_prioridade, cod_status, cod_tipo, cod_colecao, cod_entrada_parent, cod_usuario, data)
    values 
    (e_descricao, 1, 1, 1, 6, null, e_cod_usuario, e_data);

    update entradas
    set
        cod_tempo = t.cod_tempo
    from
        tempo as t
    where
        descricao = e_descricao
        and cod_colecao = 6
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
                and cod_colecao = 6
                and cod_usuario = e_cod_usuario
                and data = e_data
        ) as e;    
END
$BODY$;