const plugin = {
  meta: {
    name: "eslint-plugin-custom",
    version: "0.0.1",
  },
  rules: {
    "no-blank-lines-after-decorator": {
      meta: {
        fixable: "code",
      },
      create(context) {
        return {
          PropertyDefinition(node) {
            const { decorators } = node;

            if (decorators && decorators.length > 0) {
              const decorator = decorators.at(-1);
              const decoratorLine = decorator.loc.end.line;
              const propertyLine = node.key.loc.start.line;

             if (decoratorLine + 1 !== propertyLine) {
               context.report( {
                  node,
                  message: "There should be no blank lines after a decorator.",
                  fix: function(fixer) {
                    const range = [decorator.range[1], node.key.range[0] - node.key.loc.start.column];
                    return fixer.replaceTextRange(range, '\n');
                  }
                } );
              }
          }
          },
        };
      },
    },
    "no-blank-lines-between-decorators": {
      meta: {
        fixable: "code",
      },
      create(context) {
        return {
          PropertyDefinition(node) {
            const { decorators } = node;

            for(let i = 1; i < decorators.length; i++) {
              const previousDecorator = decorators[i - 1];
              const currentDecorator = decorators[i];

              const previousDecoratorLine = previousDecorator.loc.end.line;
              const currentDecoratorLine = currentDecorator.loc.start.line;

              if (previousDecoratorLine + 1 !== currentDecoratorLine) {
                context.report( {
                  node,
                  message: "There should be no blank lines between decorators.",
                  fix: function(fixer) {
                    const range = [previousDecorator.range[1], currentDecorator.range[0] - currentDecorator.loc.start.column];
                    return fixer.replaceTextRange(range, '\n');
                  }
                } );
              }
            }
          },
        };
      },
    },
    "indent-after-decorator": {
      meta: {
        fixable: "code",
      },
      create(context) {
        return {
          PropertyDefinition(node) {
            const { decorators } = node;

            if (decorators && decorators.length > 0) {
              for(let i = 1; i < decorators.length; i++) {
                const decorator = decorators[i];
                const decoratorIndent = decorator.loc.start.column;

                  const previousDecorator = decorators[i - 1];
                  const previousDecoratorStartColumn = previousDecorator.loc.start.column;

                  if (decoratorIndent !== previousDecoratorStartColumn) {
                    console.log(previousDecoratorStartColumn, previousDecorator.range[1], decorator.range[0], decoratorIndent);
                    context.report( {
                      node,
                      message: `Decorator should have the same indentation as the previous decorator. Expected ${previousDecoratorStartColumn} spaces but found ${decoratorIndent}.`,
                      fix: function(fixer) {
                        const spaces = "\n" + " ".repeat(previousDecoratorStartColumn);
                        const range = [previousDecorator.range[1], decorator.range[0]];
                        return fixer.replaceTextRange(range, spaces);
                      }
                    } );
                  }

            }

            const firstDecorator = decorators.at(0);
            const decoratorIndent = firstDecorator.loc.start.column;

            const propertyLine = context.getSourceCode().getText(node).split('\n').at(-1);
                const propertyIndent = propertyLine.search(/\S|$/); // Encuentra el primer carácter no en blanco

                if (decoratorIndent !== propertyIndent) {
                  context.report( {
                    node,
                    message: `Property should have the same indentation as its decorator. Expected ${decoratorIndent} spaces but found ${propertyIndent}.`,
                    fix: function(fixer) {
                      const spaces = " ".repeat(decoratorIndent);
                      let propertyTokenStartColumn = node.key.loc.start.column;
                      const leftPad = propertyTokenStartColumn - propertyIndent; // Para tener en cuenta carácteres especiales como "[" o "("
                      const range = [node.key.range[0] - propertyTokenStartColumn, node.key.range[0] - leftPad];
                      return fixer.replaceTextRange(range, spaces);
                    }
                  } );
                }
          }
          },
        };
      },
    },
  },
};

export default plugin;