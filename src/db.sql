use latp_db;

create table user( 
    id serial not null primary key,
    name varchar(150) not null,
    lastname varchar(400)  
);

create table tasks(
    id serial primary key,
    name varchar(150) not null,
    description varchar(500) not null,
    priority tinyint(1),

    user_id integer references user(id)
);  