#!/usr/bin/env bash
set -euo pipefail

if [ ! -f "package.json" ] || [ ! -d "src" ]; then
  echo "Execute este script na raiz do projeto NestJS (onde estão package.json e src/)."
  exit 1
fi

create_placeholder() {
  local dir="$1"
  mkdir -p "$dir"

  if [ ! -f "$dir/.gitkeep" ] && [ -z "$(find "$dir" -mindepth 1 -maxdepth 1 -print -quit)" ]; then
    touch "$dir/.gitkeep"
  fi
}

create_module_tree() {
  local module="$1"

  create_placeholder "src/modules/$module/application/errors"
  create_placeholder "src/modules/$module/application/ports"
  create_placeholder "src/modules/$module/application/services"
  create_placeholder "src/modules/$module/application/types"

  create_placeholder "src/modules/$module/infra/controllers"
  create_placeholder "src/modules/$module/infra/decorators"
  create_placeholder "src/modules/$module/infra/dtos"
  create_placeholder "src/modules/$module/infra/entities"
  create_placeholder "src/modules/$module/infra/repositories"
}

create_module_tree "profile"
create_module_tree "jobs"
create_module_tree "applications"

# A integração de IA também fica separada por camada,
# mas usa providers na infraestrutura em vez de entidades próprias.
create_placeholder "src/modules/ai/application/errors"
create_placeholder "src/modules/ai/application/ports"
create_placeholder "src/modules/ai/application/services"
create_placeholder "src/modules/ai/application/types"
create_placeholder "src/modules/ai/infra/providers"

# Componentes compartilhados pela aplicação.
create_placeholder "src/shared/database"
create_placeholder "src/shared/errors"
create_placeholder "src/shared/filters"
create_placeholder "src/shared/interceptors"
create_placeholder "src/shared/pipes"

echo "Estrutura criada em src/."
