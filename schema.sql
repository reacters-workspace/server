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

  create table if not exists user_schedule(
  id serial primary key,
  bodypart varchar (255),
  equipment varchar(10000),
  gifUrl varchar(100000),
  exercise_name varchar(100000),
  exercise_target varchar(100000),
  week_day varchar(255)
  );