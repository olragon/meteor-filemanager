#!/usr/bin/env bash
rsync -avz -e ssh -P --delete ./ asaleo@172.16.0.12:/data/apps/filemanager \
  --exclude .git \
  --exclude settings.json
