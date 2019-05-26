create table prioridade
(
    cod_prioridade int not null primary key,
    descricao varchar(50) not null 
)

create table status
(
    cod_status int not null primary key,
    descricao varchar(50) not null 
)

create table tipo
(
    cod_tipo int not null primary key,
    descricao varchar(50) not null 
)

create table colecoes
(
    cod_colecao int not null primary key,
    descricao varchar(50) not null
)

create table tempo
(
    cod_tempo int not null primary key,
    dia int not null,
    mes int not null,
    ano int not null,
    dia_semana int not null,
    dia_semana_nome varchar(50) not null,
    mes_nome varchar(50) not null
)

create table usuarios
(
    cod_usuario serial not null primary key,
    nome varchar(255) not null,
    email varchar(255) not null,
    senha varchar(500) not null,
    resposta varchar(500) not null,
    cod_tempo_nasc bigint,
    constraint nasc_fk foreign key (cod_tempo_nasc)
        references tempo(cod_tempo)
)

create table entradas
(
    cod_entrada serial not null primary key,
    descricao varchar(255),
    cod_prioridade bigint,
    cod_status bigint,
    cod_tipo bigint,
    cod_colecao bigint,
    cod_entrada_parent bigint,
    cod_usuario bigint,
    cod_tempo bigint,
    constraint prioridade_fk foreign key (cod_prioridade)
        references prioridade(cod_prioridade),
    constraint status_fk foreign key (cod_status)
        references status(cod_status),
    constraint tipo_fk foreign key (cod_tipo)
        references tipo(cod_tipo),
    constraint colecao_fk foreign key (cod_colecao)
        references colecoes(cod_colecao),
    constraint entrada_parent_fk foreign key (cod_entrada_parent)
        references entradas(cod_entrada),
    constraint usuario_fk foreign key (cod_usuario)
        references usuarios(cod_usuario),
    constraint tempo_fk foreign key (cod_tempo)
        references tempo(cod_tempo)
)