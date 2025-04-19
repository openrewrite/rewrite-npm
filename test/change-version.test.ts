import {RecipeSpec} from "@openrewrite/rewrite/test";
import {ChangeVersion} from "../src";
import {json} from "@openrewrite/rewrite/json";

describe('ChangeVersion', () => {
    const spec = new RecipeSpec();
    spec.recipe = new ChangeVersion({version: "1.0.0"});

    test("change the version in `package.json`", () =>
      spec.rewriteRun(
        {
            //language=json
            ...json(
              `
                  {
                      "name": "@openrewrite/rewrite-example",
                      "version": "0"
                  }
              `,
              `
                  {
                      "name": "@openrewrite/rewrite-example",
                      "version": "1.0.0"
                  }
              `
            ),
            path: "package.json"
        }
      )
    );
});
