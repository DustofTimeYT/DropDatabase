package config

import "github.com/caarlos0/env/v11"

type Config struct {
	Port string `env:"PORT,required,notEmpty"`

	JWKSURL string `env:"JWKS_URL,required,notEmpty"`

	PostgresHost     string `env:"POSTGRES_HOST,required,notEmpty"`
	PostgresUser     string `env:"POSTGRES_USER,required,notEmpty"`
	PostgresPassword string `env:"POSTGRES_PASSWORD,required,notEmpty"`
	PostgresPort     string `env:"POSTGRES_PORT,required,notEmpty"`
	PostgresDB       string `env:"POSTGRES_DB,required,notEmpty"`
}

func Load() (Config, error) {
	var config Config
	if err := env.Parse(&config); err != nil {
		return Config{}, err
	}
	return config, nil
}
