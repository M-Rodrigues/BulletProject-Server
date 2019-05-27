/*  GET /future-log
    ::  consulta todas entradas de FL de um usuário
    */
CREATE OR REPLACE 
FUNCTION public.FL_criar_entrada(
    -- parametros
)
    RETURNS SETOF json 
    LANGUAGE 'plpgsql'
AS $BODY$

BEGIN
	RETURN QUERY SELECT array_to_json(array_agg(row_to_json(u))) FROM (select * from usuarios) as u;
END
$BODY$;