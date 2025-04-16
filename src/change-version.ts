import {ExecutionContext, Option, Recipe, Registered} from "@openrewrite/rewrite";
import {Json, JsonKind, JsonVisitor, Member} from "@openrewrite/rewrite/json";

@Registered
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
            protected async visitMember(member: Member, p: ExecutionContext): Promise<Json | undefined> {
                return this.produceJson<Member>(await super.visitMember(member, p), p, draft => {
                    let key = member.key.element;
                    if (key.kind === JsonKind.Literal && key.value === "version") {
                        if (draft.value.kind === JsonKind.Literal) {
                            draft.value.value = v;
                            draft.value.source = `"${v}"`;
                        }
                    }
                });
            }
        };
    }
}
