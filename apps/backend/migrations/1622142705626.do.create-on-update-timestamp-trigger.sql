begin;
  create or replace function on_update_timestamp_trigger()
    returns trigger as $$
      begin
        new. "updated_at" = current_timestamp;
        return new;
      end;
    $$ language 'plpgsql';
commit;
