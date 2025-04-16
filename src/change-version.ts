import {ExecutionContext, Option, Recipe, Registered} from "@openrewrite/rewrite";
import {Json, JsonVisitor, Member} from "@openrewrite/rewrite/json";

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
        return new class extends JsonVisitor<ExecutionContext> {
            protected visitMember(member: Member, p: ExecutionContext): Promise<Json | undefined> {
                return super.visitMember(member, p);
            }
        };
    }
}
