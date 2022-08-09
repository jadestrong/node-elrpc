class Method {
    name: string;
    body: any;
    argdoc: string;
    docstring: string;

    constructor(name: string, body: any, argdoc: string, docstring: string) {
        this.name = name;
        this.body = body;
        this.argdoc = argdoc;
        this.docstring = docstring;
    }

    invoke(args) {
        return this.body.apply(null, args);
    }
}

export default Method;
