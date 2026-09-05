# Neural Seam para o Antigravity CLI (guia curto)

> **O [README.md](./README.md) em ingles e o documento canonico.** Esta pagina cobre o essencial em
> portugues; detalhe, medicoes e matriz de compatibilidade ficam la, e so la, para nao existirem duas
> versoes da mesma verdade se afastando com o tempo.

Adapter de host do Neural Seam para o **Antigravity CLI** (`agy`, Google), entregue como **bundle de
plugin** do Antigravity.

Instalado, ele fia num unico diretorio a infraestrutura de host do Neural Seam: o servidor MCP
`neural-seam-runtime`, as 11 skills `/neural-seam:ns-*`, uma rule de projeto e os hooks de ciclo de
vida. Toda a fiacao aponta para o binario `neural-seam` no `PATH`.

> **O Neural Seam nao fornece modelo e nao roda inferencia.** Ele coordena o trabalho: spec, glossario,
> backlog, cards e convencoes por caminho do seu projeto vivem no Neural Seam e sao servidos ao agente
> por MCP. O modelo com que voce conversa continua sendo o do seu Antigravity CLI, cobrado por quem o
> fornece. O Neural Seam nunca autentica em provedor de modelo no seu lugar.

## Pre-requisitos

O bundle fia; ele nao instala nem substitui nada disso.

| Voce precisa de | Como obter | Conferir com |
| --- | --- | --- |
| Antigravity CLI (`agy`) | instalador do Google | `agy --version` |
| O binario `neural-seam` no `PATH` | [instalador do Neural Seam](https://github.com/NeuralSeam/neural-seam-releases#download-and-install) | `neural-seam version` |
| Conta Neural Seam, autenticada | `neural-seam login` (device flow) | `neural-seam doctor` |
| Projeto vinculado a esta pasta | `neural-seam connect <projectId>` | `/neural-seam:ns-status` |

Instalar o bundle **nao** substitui `neural-seam login` nem `neural-seam connect`.

## Instalacao

```sh
agy plugin install https://github.com/NeuralSeam/neural-seam-antigravity
```

Um passo: o `agy` clona o repositorio e instala o bundle no proprio diretorio de plugins. Para
atualizar, desinstale e instale de novo pela mesma URL.

Depois, libere uma vez em `/permissions`, dentro do `agy`:

```
mcp(neural-seam-runtime/*)
```

O default deste host e perguntar por tool, e o formato de bundle nao tem arquivo de permissao: o bundle
**nao** consegue declarar isso por voce, e nao contorna a permissao por fora.

## Primeiro uso

```
/neural-seam:ns-start
```

E a resposta inteira para "e agora?". O comando le o estado que o runtime devolve e avanca **um**
passo: autenticar, criar ou escolher o projeto, vincular, e parar. Rode de novo para o proximo passo.
Tudo e convergente: repetir faz so o que falta.

Quando o projeto esta pronto, o loop de trabalho:

```
/neural-seam:ns-generate     # gera o backlog inicial
/neural-seam:ns-list         # escolhe um card
/neural-seam:ns-exec <id>    # renderiza o prompt de implementacao do card
```

## Comandos

As skills sao invocadas **com o namespace do plugin**: `/neural-seam:ns-<nome>`. A forma curta
(`/ns-<nome>`) **nao** e expandida pelo CLI e chega ao modelo como texto cru, sem erro visivel. Medido
com o `agy` 1.1.26; a evidencia esta no README canonico.

**Para comecar:** `ns-status` (so reporta), `ns-start` (guiado), `ns-create`, `ns-connect`,
`ns-clone`, `ns-doctor`.

**Dia a dia:** `ns-generate`, `ns-list`, `ns-open`, `ns-exec`, e o indice `ns-help`.

Rode `/neural-seam:ns-help` para a tabela completa.

## Privacidade, em uma linha

O bundle em si nao coleta nem envia nada. O runtime que ele aponta envia: sua autenticacao, a
identificacao da maquina no login, e os dados de coordenacao do seu projeto - **independente de
telemetria**, que e opt-in e vem desligada. Detalhe, e como apagar cada armazenamento separadamente,
em [PRIVACY.md](./PRIVACY.md).

## Se algo nao funciona

1. `agy plugin list` mostra o `neural-seam`?
2. `neural-seam version` responde?
3. `/mcp` mostra o `neural-seam-runtime` conectado?
4. Voce digitou o comando **com** o namespace?
5. `/neural-seam:ns-doctor`.

Tabela de sintomas e causas no [README.md](./README.md#troubleshooting).

## Onde esta o resto

| Assunto | Arquivo |
| --- | --- |
| Documento completo, medicoes, compatibilidade | [README.md](./README.md) |
| Duvidas e bugs | [SUPPORT.md](./SUPPORT.md) |
| Contribuir | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Vulnerabilidades (nao abra issue publica) | [SECURITY.md](./SECURITY.md) |
| Dados e privacidade | [PRIVACY.md](./PRIVACY.md) |
| Nome e marca | [TRADEMARKS.md](./TRADEMARKS.md) |
| Historico de versoes | [CHANGELOG.md](./CHANGELOG.md) |

## Licenca

MIT, ver [LICENSE](./LICENSE). A licenca cobre o conteudo deste repositorio e nao concede direitos
sobre o nome nem a marca Neural Seam.
