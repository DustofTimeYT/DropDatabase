create extension "uuid-ossp";

create table profiles (
    id UUID primary key default uuid_generate_v4(),
    username TEXT not null unique check (username ~ '^[a-zA-Z0-9_]{3,30}$'),
    created_at TIMESTAMP with TIME zone not null default NOW(),
    updated_at TIMESTAMP with TIME zone not null default NOW()
);

create index profiles_username_idx on profiles (username);

create table accounts (
    id UUID primary key default uuid_generate_v4(),
    profile_id UUID,
	provider TEXT not null,
    provider_account_id TEXT not null,
    email TEXT not null check (email <> ''),
    email_verified BOOLEAN not null default false,
    created_at TIMESTAMP with TIME zone not null default NOW(),
    updated_at TIMESTAMP with TIME zone not null default NOW(),

    constraint accounts_profile_fk foreign key (profile_id) references profiles(id) on delete cascade,
	constraint accounts_provider_account_unique unique (provider, provider_account_id)
);

create table images (
    id UUID primary key default uuid_generate_v4(),
    profile_id UUID not null,
    image_id TEXT not null check (image_id <> ''),
	width INTEGER not null check (width > 0),
    height INTEGER not null check (height > 0),
    created_at TIMESTAMP with TIME zone not null default NOW(),
    updated_at TIMESTAMP with TIME zone not null default NOW(),
    score INTEGER not null default 0,
    
    constraint images_profile_fk foreign key (profile_id) references profiles(id) on delete set null  
);

create index images_profile_id_idx on images (profile_id);
create index images_image_id_idx on images (image_id);

create table posts (
    id UUID primary key default uuid_generate_v4(),
    profile_id UUID not null,
    text TEXT,
    score INTEGER not null default 0,
    is_draft BOOLEAN not null default true,
    created_at TIMESTAMP with TIME zone not null default NOW(),
    updated_at TIMESTAMP with TIME zone not null default NOW(),
    
    constraint posts_profile_fk foreign key (profile_id) references profiles(id) on delete cascade
);

create index posts_profile_idx on posts (profile_id);

create table post_images (
    post_id UUID not null,
    image_id UUID not null,
    primary key (post_id, image_id),
    constraint post_images_post_fk foreign key (post_id) references posts(id) on delete cascade,
	constraint post_images_image_fk foreign key (image_id) references images(id) on delete cascade
);

create type album_type as enum ('DEFAULT', 'LIKED');

CREATE TABLE albums (
    id UUID primary key default uuid_generate_v4(),
    profile_id UUID not null,
    title TEXT not null,
    album_type album_type not null default 'DEFAULT',
    created_at TIMESTAMP with TIME zone not null default NOW(),
    updated_at TIMESTAMP with TIME zone not null default NOW(),

    constraint albums_profile_fk foreign key (profile_id) references profiles(id) on delete cascade
);

create unique index albums_unique_liked_idx ON albums (profile_id) WHERE album_type = 'LIKED';
create index albums_profile_idx on albums (profile_id);

create or replace function fn_create_initial_albums() 
returns trigger 
language plpgsql
as $$
begin
    insert into albums (profile_id, title, album_type) values (NEW.id, 'Liked', 'LIKED');
	return new;
end;
$$;
	
create trigger trg_create_initial_albums 
	after insert on profiles 
	for each row 
	execute function fn_create_initial_albums();

create table album_images (
    album_id UUID not null,
    image_id UUID not null,
	profile_id UUID not null,
    saved_at TIMESTAMP with TIME zone not null default NOW(),

    primary key (album_id, image_id),
    constraint album_images_album_fk foreign key (album_id) references albums(id) on delete cascade,
	constraint album_images_image_fk foreign key (image_id) references images(id) on delete cascade,
	constraint album_images_prolfile_fk foreign key (profile_id) references profiles(id) on delete cascade
);

create table tags (
    id UUID primary key default uuid_generate_v4(),
    name TEXT not null unique check (name = LOWER(name)),
    created_at TIMESTAMP with TIME zone not null default NOW()
);

create table image_tags (
    image_id UUID not null,
    tag_id UUID not null,
    primary key (image_id, tag_id),
    constraint image_tags_image_fk foreign key (image_id) references images(id) on delete cascade,
	constraint image_tags_tag_fk foreign key (tag_id) references tags(id) on delete cascade
);

create table post_tags (
    post_id UUID not null,
    tag_id UUID not null,
    primary key (post_id, tag_id),
    constraint post_tags_post_fk foreign key (post_id) references posts(id) on delete cascade,
	constraint post_tags_tag_fk foreign key (tag_id) references tags(id) on delete cascade
);
