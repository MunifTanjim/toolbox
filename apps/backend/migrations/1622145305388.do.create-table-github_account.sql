begin;

create table "github_account" (
  "id" integer not null,
  "user_id" text not null
    constraint "github_account_fk_user_id"
    references "user" ("id"),
  "name" text not null,
  "email" text not null,
  "created_at" timestamp with time zone default current_timestamp not null,
  "updated_at" timestamp with time zone default current_timestamp not null,
  constraint "github_account_pk" primary key ("id")
);

create unique index "github_account_uidx_user_id"
  on "github_account" ("user_id");

create trigger "github_account_on_update_timestamp"
  before update
  on "github_account"
  for each row
execute procedure on_update_timestamp_trigger();

commit;
