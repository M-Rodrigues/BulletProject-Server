/*  GET /usuarios
    ::  consulta todos os usuário cadastrados no sistema
    */
CREATE OR REPLACE 
FUNCTION public.us_consulta_usuarios()
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$

BEGIN
	RETURN QUERY 
        SELECT array_to_json(array_agg(row_to_json(u))) 
        FROM (
            select * from usuarios
        ) as u;
END
$BODY$;

/*  GET /usuarios/:id
    ::  consulta apenas 1 usuario especifico pelo seu cod_usuario
    */
CREATE OR REPLACE 
FUNCTION public.us_consulta_usuario(id integer)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$

BEGIN
	RETURN QUERY 
        SELECT row_to_json(u) 
        FROM (
            select * from usuarios where cod_usuario = id
        ) as u;
END
$BODY$;

/*  POST /usuarios
    ::  criar um novo usuario no sistema, ou seja
        , realiza o cadastro no sistema
    */
CREATE OR REPLACE 
FUNCTION public.us_criar_usuario(
    u_nome text,
    u_email text,
    u_resposta text,
    u_senha text,
    u_dia integer,
    u_mes integer,
    u_ano integer
)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    insert into usuarios (nome, email, resposta, senha)
    values (u_nome, u_email, u_resposta, u_senha);

    update usuarios
    set
        cod_tempo_nasc = t.cod_tempo
    from
        tempo as t
    where
        email = u_email
        and t.dia = u_dia
        and t.mes = u_mes
        and t.ano = u_ano;

    return query 
        select row_to_json(u) 
        from (
            select * from usuarios
            where email = u_email
        ) as u;    
END
$BODY$;

/*  DELETE /usuarios/:id
    ::  remove o cadastro de um usuário pelo seu cod_usuario
    */
CREATE OR REPLACE 
FUNCTION public.us_remover_usuario(id integer)
    RETURNS SETOF json
    LANGUAGE 'plpgsql'
AS $BODY$

BEGIN
	RETURN QUERY DELETE FROM usuarios WHERE cod_usuario = id;
END
$BODY$;