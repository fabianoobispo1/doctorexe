/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as arquivos from "../arquivos.js";
import type * as avaliacoes from "../avaliacoes.js";
import type * as evolucao from "../evolucao.js";
import type * as exercicio from "../exercicio.js";
import type * as faleConosco from "../faleConosco.js";
import type * as paciente from "../paciente.js";
import type * as recuperaSenha from "../recuperaSenha.js";
import type * as todo from "../todo.js";
import type * as user from "../user.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  arquivos: typeof arquivos;
  avaliacoes: typeof avaliacoes;
  evolucao: typeof evolucao;
  exercicio: typeof exercicio;
  faleConosco: typeof faleConosco;
  paciente: typeof paciente;
  recuperaSenha: typeof recuperaSenha;
  todo: typeof todo;
  user: typeof user;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
