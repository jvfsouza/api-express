#!/usr/bin/env bash
# scripts/requisicoes.sh
# Bate em todas as rotas da API e mostra o status + o body de cada resposta.
#
# uso:
#   npm start                      # em um terminal
#   ./scripts/requisicoes.sh       # em outro terminal
#
#   BASE_URL=http://localhost:8080 ./scripts/requisicoes.sh   # outra porta
#   VERBOSE=1 ./scripts/requisicoes.sh                        # mostra o body cru tbm
#
# obs - a API tem rate limit (100 req/15min em producao, 1000 em dev).
#       se aparecer 429, ou espera a janela passar ou sobe o RATE_LIMIT_MAX no .env

BASE_URL="${BASE_URL:-http://localhost:3000}"
VERBOSE="${VERBOSE:-0}"

OK=0C
ERROS=0

verde()    { printf '\033[32m%s\033[0m\n' "$1"; }
vermelho() { printf '\033[31m%s\033[0m\n' "$1"; }
amarelo()  { printf '\033[33m%s\033[0m\n' "$1"; }
titulo()   { printf '\n\033[1m%s\033[0m\n' "$1"; }

# req <METODO> <CAMINHO> [BODY_JSON] [STATUS_ESPERADO]
req() {
  local metodo="$1" caminho="$2" body="${3:-}" esperado="${4:-200}"
  local status tipo tamanho

  # o body vai pro arquivo e nao pra variavel (imagem/binario no shell da warning de byte nulo)
  local arquivo
  arquivo=$(mktemp)

  if [ -n "$body" ]; then
    status=$(curl -s -o "$arquivo" -w '%{http_code}' -X "$metodo" "$BASE_URL$caminho" \
      -H 'Content-Type: application/json' -d "$body")
  else
    status=$(curl -s -o "$arquivo" -w '%{http_code}' -X "$metodo" "$BASE_URL$caminho")
  fi

  tipo=$(file -b --mime-type "$arquivo")
  tamanho=$(wc -c < "$arquivo" | tr -d ' ')

  if [ "$status" = "$esperado" ]; then
    verde "  OK    $metodo $caminho -> $status"
    OK=$((OK + 1))
  else
    vermelho "  FALHA $metodo $caminho -> $status (esperado $esperado)"
    ERROS=$((ERROS + 1))
  fi

  # mostra o body quando for json, senao so o tipo e o tamanho
  if [ "$VERBOSE" = "1" ]; then
    head -c 2000 "$arquivo" | sed 's/^/          /'
  elif jq -e . "$arquivo" > /dev/null 2>&1; then
    jq . "$arquivo" | sed 's/^/          /'
  else
    printf '          (%s, %s bytes)\n' "$tipo" "$tamanho"
  fi

  rm -f "$arquivo"
}

titulo "Tarefas - caminho feliz"
req GET  "/tarefas"
req POST "/tarefas" '{"titulo":"Estudar Express","descricao":"Assistir a aula de middlewares","prioridade":2}' 201
req POST "/tarefas" '{"titulo":"Fazer compras"}' 201
req GET  "/tarefas/1"
req PUT  "/tarefas/1" '{"concluida":true}' 200
req PUT  "/tarefas/1" '{"titulo":"Estudar Express e Zod","prioridade":3}' 200

titulo "Tarefas - filtros na query"
req GET "/tarefas?concluida=false"
req GET "/tarefas?concluida=true"
req GET "/tarefas?titulo=estudar"
req GET "/tarefas?concluida=false&titulo=estudar"

titulo "Tarefas - o schema barrando (400)"
req POST "/tarefas" '{"descricao":"faltou o titulo"}' 400
req POST "/tarefas" '{"titulo":"ab"}' 400
req POST "/tarefas" '{"titulo":"Estudar Express","id":99,"criadaEm":"2020-01-01T00:00:00.000Z"}' 400
req POST "/tarefas" '{"titulo":"Prioridade furada","prioridade":7}' 400
req POST "/tarefas" '{"titulo":"Prioridade texto","prioridade":"alta"}' 400
req POST "/tarefas" '{"titulo":"Concluida invalida","concluida":"sim"}' 400
req POST "/tarefas" '{"titulo":"Descricao gigante","descricao":"'"$(printf 'a%.0s' {1..501})"'"}' 400
req PUT  "/tarefas/1" '{}' 400
req PUT  "/tarefas/1" '{"titulo":"x"}' 400
req GET  "/tarefas/abc" "" 400
req GET  "/tarefas/0" "" 400
req GET  "/tarefas?concluida=nao" "" 400

titulo "Tarefas - nao encontrado (404)"
req GET    "/tarefas/999999" "" 404
req DELETE "/tarefas/999999" "" 404

titulo "Usuarios"
req GET  "/usuarios"
req POST "/usuarios" '{"nome":"Joao da Silva","idade":20}' 201

titulo "Paginas e estaticos"
req GET "/"
req GET "/vibecoded"
# obs - /arquivos da 301 porque o express.static acha a pasta public/arquivos
#       e redireciona pra /arquivos/ (o app.get('/arquivos') do app.js fica depois do static, entao nao ganha)
req GET "/arquivos" "" 301
req GET "/arquivos/fanta.jpeg" "" 200

titulo "Resultado"
verde "  $OK requisicao(oes) ok"
[ "$ERROS" -gt 0 ] && vermelho "  $ERROS falha(s)"
echo
exit $([ "$ERROS" -gt 0 ] && echo 1 || echo 0)
