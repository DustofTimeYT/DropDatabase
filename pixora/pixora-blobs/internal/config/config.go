package config

import "github.com/caarlos0/env/v11"

type Config struct {
	Port         string `env:"PORT,required,notEmpty"`
	UploadFolder string `env:"UPLOAD_FOLDER,required,notEmpty"`
}

func Load() (Config, error) {
	var config Config
	if err := env.Parse(&config); err != nil {
		return Config{}, err
	}
	return config, nil
}
