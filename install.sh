#!/usr/bin/env bash

# Crear un archivo .env vacío
touch .env

# Añadir los campos necesarios al archivo .env
echo "DISCORD_KEY_TOKEN=" >>.env
echo "DISCORD_CLIENT_ID=" >>.env
echo "DISCORD_GUILD_ID=" >>.env
echo "GEMINI_API_KEY=" >>.env
