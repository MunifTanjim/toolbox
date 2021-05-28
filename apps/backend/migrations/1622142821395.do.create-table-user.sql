begin;

create table "user" (
  "id" text not null,
  "name" text not null,
  "email" text not null,
  "email_verified" bool default false,
  "created_at" timestamp with time zone default current_timestamp not null,
  "updated_at" timestamp with time zone default current_timestamp not null,
  constraint "user_pk" primary key ("id")
);

create unique index "user_uidx_email"
  on "user" ("email");

create trigger "user_on_update_timestamp"
  before update
  on "user"
  for each row
execute procedure on_update_timestamp_trigger();

commit;
