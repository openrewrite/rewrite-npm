import {ExecutionContext, Option, Recipe} from "@openrewrite/rewrite";
import {Json, JsonVisitor} from "@openrewrite/rewrite/json";

export class ChangeVersion extends Recipe {
    name = "org.openrewrite.npm.change-version";
    displayName = "Change version in `package.json`";
    description = "Change the version in both `package.json` and `package-lock.json`.";

    @Option({
        displayName: "Version",
        description: "The version to change to."
    })
    version!: string

    constructor(options: { version: string }) {
        super(options);
    }

    get editor(): JsonVisitor<ExecutionContext> {
        const v = this.version;
        return new class extends JsonVisitor<ExecutionContext> {
            protected async visitDocument(document: Json.Document, p: ExecutionContext): Promise<Json | undefined> {
                // Only visit package.json and package-lock.json files
                if (!(document.sourcePath.endsWith("package.json") || document.sourcePath.endsWith("package-lock.json"))) {
                    return document;
                }
                return super.visitDocument(document, p);
            }

            protected async visitMember(member: Json.Member, p: ExecutionContext): Promise<Json | undefined> {
                return this.produceJson<Json.Member>(await super.visitMember(member, p), p, draft => {
                    let key = member.key.element;
                    if (key.kind === Json.Kind.Literal && key.value === "version") {
                        if (draft.value.kind === Json.Kind.Literal) {
                            draft.value.value = v;
                            draft.value.source = `"${v}"`;
                        }
                    }
                });
            }
        };
    }
}
