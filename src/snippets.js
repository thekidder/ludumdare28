var snippets = {};

function loadSnippet(name, loaded) {
  $.get('html/' + name + '.html', function(data) {
    snippets[name] = doT.template(data);
    if(loaded) {
      loaded(snippets[name]);
    }
  });
}

function compileSnippet(name, obj) {
  if(!snippets.hasOwnProperty(name)) {
    return undefined;
  }

  return snippets[name](obj);
}