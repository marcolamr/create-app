# Changesets

Este diretório é gerenciado pelo [`@changesets/cli`](https://github.com/changesets/changesets).

## Fluxo de release

1. Após uma mudança relevante, crie um changeset:

   ```bash
   pnpm changeset
   ```

2. Quando quiser preparar uma release, aplique os bumps de versão:

   ```bash
   pnpm release
   ```

3. Para publicar no npm:

   ```bash
   pnpm pub:beta    # tag beta
   pnpm pub:release # release estável
   ```

Documentação: https://github.com/changesets/changesets/blob/main/docs/common-questions.md
