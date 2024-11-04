# devsBot

## Instalación (Es necesario tener ssh vinculado y funcionando)
Sin docker
```bash
git clone git@github.com:Esteban528/devsBot.git

cd devsBot
chmod +x install.sh
./install.sh
```

Con docker
```bash
git clone git@github.com:Esteban528/devsBot.git

cd devsBot
chmod +x install.sh
./install.sh docker
```

## Ejecución 
**Modo dev**
```bash 
npx gulp dev
```
**Modo produccion**
```bash 
node .
```

## Subir cambios
```bash
git add <nombre del archivo>
git commit -m "Mensaje de la actualización/commit"
git push origin main

```
## Invitacion del bot
<a href="https://discord.com/oauth2/authorize?client_id=1243695658439938058&permissions=8&scope=bot">Enlace de invitación del bot :D</a>

