const importTemplateFiles = (templateFn) => (destinationFn) => (that) => (files) =>
  files.forEach(filename => that.fs.copyTpl(
    that.templatePath(templateFn(filename)),
    that.destinationPath(destinationFn(filename)),
    that.props
  ))

module.exports = importTemplateFiles;
