const fs = require('fs');
const path = require('path');
const vueParser = require('@vue/compiler-dom');
const typescript = require('typescript');

const components = [
    {
        name: 'drop',
        path: 'Drop.vue'
    },
    {
        name: 'modal-sync',
        path: 'ModalSync.vue'
    },
    {
        name: 'form',
        path: 'form/Form.vue'
    },
    {
        name: 'drop',
        path: 'Drop.vue'
    },
    {
        name: 'checkbox',
        path: 'form/CheckboxList.vue'
    },
    {
        name: 'chip',
        path: 'chips/Chip.vue'
    },
    {
        name: 'editor',
        path: 'form/Editor.vue'
    },
    {
        name: 'input',
        path: 'form/Input.vue'
    },
    {
        name: 'select',
        path: 'form/Select.vue'
    },
    {
        name: 'tabs',
        path: 'tabs/Tabs.vue'
    }
]

class Docs {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        components.forEach((component) => {
            const file = fs.readFileSync(path.resolve('shared/components', component.path), 'utf8');
            const code = vueParser.parse(file);
            const script = code?.children.find((templates) => templates.tag === 'script');

            this.components[component.name] = {
                params: []
            };


            if (script.children && script.children[0] && script.children[0].content) {
                const content = script.children[0].content;

                const ast = typescript.createSourceFile(
                    `${component.name}.ts`,
                    content,
                    typescript.ScriptTarget.Latest,
                    true
                );

                ast.statements.forEach((statement, index) => {
                    let props = null;

                    if (statement?.expression?.arguments) {
                        props = statement?.expression?.arguments[0]?.properties[0]?.initializer?.properties;
                    } else {
                        props = statement?.expression?.properties[0]?.initializer?.properties;
                    }

                    if (props) {
                        props.forEach((prop) => {
                            const name = prop?.name?.getText()
                            if (name) {
                                const data = {
                                    name,
                                    comment: '',
                                    params: {}
                                }

                                if (Array.isArray(prop.jsDoc) && prop.jsDoc[0]) {
                                    data.comment = prop.jsDoc[0].comment;
                                }

                                const params = prop?.initializer?.properties;

                                if (Array.isArray(params) && params.length) {
                                    params.forEach((param) => {
                                        if (param?.name?.getText() && param.initializer) {
                                            data.params[param.name.getText()] = param.initializer.getText();
                                        }
                                    })
                                }

                                this.components[component.name].params.push(data);
                            }
                        })
                    }
                })
            }
        });
    }

    get(name) {
        return this.components[name];
    }
}

module.exports = Docs;