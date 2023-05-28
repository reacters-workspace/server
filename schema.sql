create table if not exists user_contact_form(
  id serial primary key,
  username varchar(255),
  email varchar(255),
  usermessage varchar(100000)
  );


  create table if not exists exercise_category(
  id serial primary key,
  category varchar (255),
  category_url varchar(10000),
  description varchar(100000)
  );