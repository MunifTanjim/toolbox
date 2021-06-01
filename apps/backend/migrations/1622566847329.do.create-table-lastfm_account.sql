begin;

create table "lastfm_account" (
  "id" text not null,
  "user_id" text not null
    constraint "lastfm_account_fk_user_id"
    references "user" ("id"),
  "name" text not null,
  "username" text not null,
  "registered_at" timestamp with time zone not null,
  "created_at" timestamp with time zone default current_timestamp not null,
  "updated_at" timestamp with time zone default current_timestamp not null,
  constraint "lastfm_account_pk" primary key ("id")
);

create unique index "lastfm_account_uidx_user_id"
  on "lastfm_account" ("user_id");

create trigger "lastfm_account_on_update_timestamp"
  before update
  on "lastfm_account"
  for each row
execute procedure on_update_timestamp_trigger();

commit;
