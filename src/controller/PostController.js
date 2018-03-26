import {EntityManager} from "typeorm";
import {Post} from "../entity/Post";
import {TextGenerator} from "../service/TextGenerator";

export class PostController {

    constructor(container) {
        this.entityManager = container.get(EntityManager);
        this.textGenerator = container.get(TextGenerator);
    }

    posts(args) {

        let findOptions = {};
        if (args.limit)
            findOptions.take = args.limit;
        if (args.offset)
            findOptions.skip = args.offset;
        if (args.sortBy === "last")
            findOptions.order = { "id": "DESC" };
        if (args.sortBy === "name")
            findOptions.order = { "name": "ASC" };

        return this.entityManager.find(Post, findOptions);
    }

    post({ id }) {
        return this.entityManager.findOne(Post, id);
    }

    async postSave(args) {
        const post = args.id ? await this.entityManager.findOneOrFail(Post, args.id) : {};
        post.title = args.title;
        post.text = args.text ? args.text : this.textGenerator.generate();
        if (args.categoryIds)
            post.categories = args.categoryIds.map(categoryId => ({ id: categoryId }));

        return this.entityManager.save(Post, post);
    }

    async postDelete({ id }) {
        await this.entityManager.remove(Post, { id: id });
        return true;
    }

}