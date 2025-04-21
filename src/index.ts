import {RecipeRegistry} from "@openrewrite/rewrite";
import {ChangeVersion} from "./change-version";

export * from "./change-version";

export function activate(registry: RecipeRegistry) {
    registry.register(ChangeVersion);
}
