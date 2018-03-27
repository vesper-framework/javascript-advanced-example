import "babel-polyfill";
import {bootstrap} from "vesper";
import {CategoryController} from "./controller/CategoryController";
import {PostController} from "./controller/PostController";
import {PostResolver} from "./resolver/PostResolver";
import {PostsArgsValidator} from "./validator/PostsArgsValidator";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

bootstrap({
    port: 3000,
    controllers: [
        { controller: PostController, action: "posts", type: "query", validators: [PostsArgsValidator] },
        { controller: PostController, action: "post", type: "query" },
        { controller: PostController, action: "postSave", type: "mutation" },
        { controller: PostController, action: "postDelete", type: "mutation" },

        { controller: CategoryController, action: "categories", type: "query" },
        { controller: CategoryController, action: "category", type: "query" },
        { controller: CategoryController, action: "categorySave", type: "mutation" },
    ],
    resolvers: [
        { resolver: PostResolver, model: Post, methods: [{ methodName: "categoryNames", many: true }] },
    ],
    entities: [
        Post,
        Category
    ],
    schemas: [__dirname + "/schema/**/*.graphql"]
}).then(() => {
    console.log("Your app is up and running on http://localhost:3000 " +
        "You can use Playground in development mode on http://localhost:3000/playground");
}).catch(error => {
    console.error(error.stack ? error.stack : error);
});