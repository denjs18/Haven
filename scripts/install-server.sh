#!/bin/bash
# ============================================================
# Script d'installation automatique de Haven sur Oracle Cloud
# Ubuntu 22.04 — ARM64 (Ampere A1) ou AMD64
#
# Usage :
#   curl -fsSL https://raw.githubusercontent.com/denjs18/Haven/claude/init-haven-saas-WETJA/scripts/install-server.sh | bash
# ============================================================

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✅ $1${NC}"; }
info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; exit 1; }

echo ""
echo "======================================"
echo "   Installation de Haven sur Oracle   "
echo "======================================"
echo ""

# ── 1. Variables demandées à l'utilisateur ──────────────────

read -p "Ton email admin PocketBase : " PB_ADMIN_EMAIL
read -s -p "Mot de passe admin PocketBase : " PB_ADMIN_PASSWORD
echo ""
read -p "IP publique de ce serveur (ex: 130.61.45.12) : " SERVER_IP

echo ""
info "Démarrage de l'installation…"
echo ""

# ── 2. Mise à jour système ───────────────────────────────────

info "Mise à jour du système…"
sudo apt-get update -y -qq
sudo apt-get upgrade -y -qq
sudo apt-get install -y -qq git curl unzip wget
ok "Système à jour"

# ── 3. Node.js 20 ────────────────────────────────────────────

info "Installation de Node.js 20…"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - -qq
sudo apt-get install -y -qq nodejs
ok "Node.js $(node -v) installé"

# ── 4. PM2 (gestionnaire de process) ─────────────────────────

info "Installation de PM2…"
sudo npm install -g pm2 --silent
ok "PM2 installé"

# ── 5. PocketBase ─────────────────────────────────────────────

info "Installation de PocketBase…"
PB_VERSION="0.23.4"
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ]; then
  PB_ARCH="linux_arm64"
else
  PB_ARCH="linux_amd64"
fi

mkdir -p ~/pocketbase
cd ~/pocketbase
wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_${PB_ARCH}.zip"
unzip -q "pocketbase_${PB_VERSION}_${PB_ARCH}.zip"
chmod +x pocketbase
sudo ln -sf ~/pocketbase/pocketbase /usr/local/bin/pocketbase
cd ~
ok "PocketBase v${PB_VERSION} installé"

# ── 6. Cloner Haven ──────────────────────────────────────────

info "Clonage du repo Haven…"
if [ -d ~/haven ]; then
  cd ~/haven && git pull origin claude/init-haven-saas-WETJA
else
  git clone -b claude/init-haven-saas-WETJA https://github.com/denjs18/Haven.git ~/haven
fi
cd ~/haven
ok "Haven cloné"

# ── 7. Créer .env.local ──────────────────────────────────────

info "Création de .env.local…"
cat > ~/haven/.env.local << EOF
NEXT_PUBLIC_POCKETBASE_URL=http://${SERVER_IP}:8090
PB_ADMIN_EMAIL=${PB_ADMIN_EMAIL}
PB_ADMIN_PASSWORD=${PB_ADMIN_PASSWORD}
PB_BINARY_PATH=/usr/local/bin/pocketbase
PB_DATA_DIR=/var/haven/projects
PB_BIND_HOST=0.0.0.0
PB_PUBLIC_HOST=${SERVER_IP}
EOF
sudo mkdir -p /var/haven/projects
sudo chown -R ubuntu:ubuntu /var/haven
ok ".env.local créé"

# ── 8. Dépendances npm + build ───────────────────────────────

info "Installation des dépendances npm…"
cd ~/haven
npm install --silent
ok "Dépendances installées"

info "Build de l'app Next.js…"
npm run build
ok "Build terminé"

# ── 9. Démarrer PocketBase pour le setup ─────────────────────

info "Démarrage temporaire de PocketBase pour le setup…"
pocketbase serve --dir ~/pocketbase/data &
PB_PID=$!
sleep 4

# Créer le compte admin via l'API
info "Création du compte admin PocketBase…"
curl -s -X POST "http://127.0.0.1:8090/api/admins" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${PB_ADMIN_EMAIL}\",\"password\":\"${PB_ADMIN_PASSWORD}\",\"passwordConfirm\":\"${PB_ADMIN_PASSWORD}\"}" > /dev/null 2>&1 || true

sleep 1

info "Création de la collection projects…"
npm run setup || info "Setup déjà effectué ou erreur — on continue"

kill $PB_PID 2>/dev/null || true
sleep 1
ok "PocketBase configuré"

# ── 10. PM2 — lancer les deux services ───────────────────────

info "Configuration de PM2…"
cd ~/haven
pm2 start ecosystem.config.js
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
ok "PM2 configuré"

# ── 11. Firewall Oracle (iptables) ───────────────────────────

info "Ouverture des ports dans le firewall OS…"
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8090 -j ACCEPT
sudo apt-get install -y -qq iptables-persistent
sudo netfilter-persistent save
ok "Ports 3000 et 8090 ouverts"

# ── Résumé ───────────────────────────────────────────────────

echo ""
echo "======================================"
echo -e "${GREEN}   Haven est installé et en ligne ! 🎉${NC}"
echo "======================================"
echo ""
echo "  Dashboard Haven   → http://${SERVER_IP}:3000"
echo "  Admin PocketBase  → http://${SERVER_IP}:8090/_/"
echo ""
echo -e "${YELLOW}⚠️  N'oublie pas d'ouvrir les ports 3000 et 8090${NC}"
echo "  dans la Security List Oracle (VCN) depuis le panel web."
echo ""
