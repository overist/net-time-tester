/*
    admin table
*/
DROP TABLE IF EXISTS _admin;
CREATE TABLE IF NOT EXISTS _admin (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'id',
  `account` VARCHAR(255) UNIQUE NOT NULL COMMENT 'account',
  `password` VARCHAR(255) NOT NULL COMMENT 'password',
  `intro` VARCHAR(255) COMMENT 'intro',
  `username` VARCHAR(255) NOT NULL COMMENT 'username',
  `is_system_admin` INT DEFAULT 0 COMMENT 'is system admin',
  `is_admin` INT DEFAULT 0 COMMENT 'is admin',
  `created_at` DATETIME DEFAULT now() COMMENT 'create time',
  `updated_at` DATETIME DEFAULT NULL COMMENT 'update time',
  `deleted_at` DATETIME DEFAULT NULL COMMENT 'delete time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="admin";



/*
    login history user table
*/
DROP TABLE IF EXISTS _login_history_user;
CREATE TABLE IF NOT EXISTS _login_history_user (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_id` INT NOT NULL COMMENT 'user id',
  `type` INT COMMENT 'login = 1, logout = 0',
  `created_at` DATETIME DEFAULT now() COMMENT 'create time',
  `updated_at` DATETIME DEFAULT NULL COMMENT 'update time', -- not used
  `deleted_at` DATETIME DEFAULT NULL COMMENT 'delete time' -- not used
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="login history user";


/*
    login history admin table
*/
DROP TABLE IF EXISTS _login_history_admin;
CREATE TABLE IF NOT EXISTS _login_history_admin (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'id',
  `admin_id` INT NOT NULL COMMENT 'admin id',
  `type` INT COMMENT 'login = 1, logout = 0',
  `created_at` DATETIME DEFAULT now() COMMENT 'create time',
  `updated_at` DATETIME DEFAULT NULL COMMENT 'update time', -- not used
  `deleted_at` DATETIME DEFAULT NULL COMMENT 'delete time' -- not used
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="login history admin";


/*
    global table
*/
DROP TABLE IF EXISTS _global;    
CREATE TABLE IF NOT EXISTS _global (
  `key` VARCHAR(255) PRIMARY KEY NOT NULL COMMENT 'key',
  `value` TEXT NOT NULL COMMENT 'value',
  `memo` VARCHAR(255) COMMENT 'memo',
  `created_at` DATETIME DEFAULT now() COMMENT 'create time',
  `updated_at` DATETIME DEFAULT NULL COMMENT 'update time',
  `deleted_at` DATETIME DEFAULT NULL COMMENT 'delete time' -- pysical delete
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="global";

/*
    file table
*/
DROP TABLE IF EXISTS _file;
CREATE TABLE IF NOT EXISTS _file (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'id',
  `table_name` VARCHAR(255) COMMENT 'table name',
  `table_pk` INT COMMENT 'table pk',
  `type` VARCHAR(255) COMMENT 'type',
  `raw_name` VARCHAR(255) NOT NULL COMMENT 'raw name',
  `enc_name` VARCHAR(255) NOT NULL COMMENT 'enc name',
  `extension` VARCHAR(255) NOT NULL COMMENT 'extension',
  `size` INT NOT NULL COMMENT 'size',
  `h_size` VARCHAR(255) NOT NULL COMMENT 'human size',
  `abs_path` VARCHAR(255) NOT NULL COMMENT 'abs path',
  `note` VARCHAR(255) COMMENT 'note',
  `created_at` DATETIME DEFAULT now() COMMENT 'create time',
  `updated_at` DATETIME DEFAULT NULL COMMENT 'update time',
  `deleted_at` DATETIME DEFAULT NULL COMMENT 'delete time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="file";

/*
    history action table
*/
DROP TABLE IF EXISTS _history_action;
CREATE TABLE IF NOT EXISTS _history_action (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'id',
  `admin_id` INT NOT NULL COMMENT 'admin id', -- 관리자 아이디
  `api_name` VARCHAR(255) COMMENT 'to username', -- API명
  `params` TEXT COMMENT 'to username', -- 파라미터
  `created_at` DATETIME DEFAULT now() COMMENT 'create time',
  `updated_at` DATETIME DEFAULT NULL COMMENT 'update time',
  `deleted_at` DATETIME DEFAULT NULL COMMENT 'delete time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="history action";

/* 
    user table
*/
DROP TABLE IF EXISTS _user;
CREATE TABLE IF NOT EXISTS _user (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'id',
  `account` VARCHAR(255) UNIQUE NOT NULL COMMENT 'account',
  `intro` VARCHAR(255) COMMENT 'intro',
  `username` VARCHAR(255) NOT NULL COMMENT 'username',
  `profile_img` INT COMMENT 'profile img',
  `is_ban` INT DEFAULT 0 COMMENT 'ban (0: 정상, 1: 정지)',
  `kakao_id` VARCHAR(255) UNIQUE COMMENT 'kakao id',
  `created_at` DATETIME DEFAULT now() COMMENT 'create time',
  `updated_at` DATETIME DEFAULT NULL COMMENT 'update time',
  `deleted_at` DATETIME DEFAULT NULL COMMENT 'delete time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="user";

/*
    user follow table
*/
DROP TABLE IF EXISTS _user_follow;
CREATE TABLE IF NOT EXISTS _user_follow (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_id` INT NOT NULL COMMENT 'user id',
  `follow_id` INT NOT NULL COMMENT 'follow id',
  `created_at` DATETIME DEFAULT now() COMMENT 'create time',
  `updated_at` DATETIME DEFAULT NULL COMMENT 'update time',
  `deleted_at` DATETIME DEFAULT NULL COMMENT 'delete time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="user follow";

/*
    category table
*/
DROP TABLE IF EXISTS _category;
CREATE TABLE IF NOT EXISTS _category (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'id',
  `creater_id` INT NOT NULL COMMENT 'creater id', -- user_id
  `subject` VARCHAR(255) UNIQUE NOT NULL COMMENT 'subject',
  `description` VARCHAR(255) COMMENT 'description',
  `icon_img` INT COMMENT 'icon img',
  `created_at` DATETIME DEFAULT now() COMMENT 'create time',
  `updated_at` DATETIME DEFAULT NULL COMMENT 'update time',
  `deleted_at` DATETIME DEFAULT NULL COMMENT 'delete time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="category";

/*
    user participation table
*/
DROP TABLE IF EXISTS _user_participation;
CREATE TABLE IF NOT EXISTS _user_participation (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_id` INT NOT NULL COMMENT 'user id',
  `category_id` INT NOT NULL COMMENT 'category id',
  `created_at` DATETIME DEFAULT now() COMMENT 'create time',
  `updated_at` DATETIME DEFAULT NULL COMMENT 'update time',
  `deleted_at` DATETIME DEFAULT NULL COMMENT 'delete time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="user participation";

/*
    post table
*/
DROP TABLE IF EXISTS _post;
CREATE TABLE IF NOT EXISTS _post (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'id',
  `category_id` INT NOT NULL COMMENT 'category id',
  `user_id` INT NOT NULL COMMENT 'user id',
  `net_time` INT NOT NULL COMMENT 'net time',
  `image` INT COMMENT 'image',
  `content` TEXT NULL COMMENT 'content',
  `created_at` DATETIME DEFAULT now() COMMENT 'create time',
  `updated_at` DATETIME DEFAULT NULL COMMENT 'update time',
  `deleted_at` DATETIME DEFAULT NULL COMMENT 'delete time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="post";

/*
    post like table
*/
DROP TABLE IF EXISTS _post_like;
CREATE TABLE IF NOT EXISTS _post_like (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'id',
  `post_id` INT NOT NULL COMMENT 'post id',
  `user_id` INT NOT NULL COMMENT 'user id',
  `created_at` DATETIME DEFAULT now() COMMENT 'create time',
  `updated_at` DATETIME DEFAULT NULL COMMENT 'update time',
  `deleted_at` DATETIME DEFAULT NULL COMMENT 'delete time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="post like";
