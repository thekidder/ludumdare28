var dialogs = Array();
var dialogCloseEvent = undefined;
var dialogNumOpen = 0;

function isDialogOpen() {
  for(var i = 0; i < dialogs.length; ++i) {
    if(dialogs[i].entity.visible)
      return dialogs[i];
  }
  return false;
}

function closeDialog(e, d) {
  console.log('closed');

  if(d.closeFn) {
    d.closeFn(d);
  }
  
  d.entity.attr({visible: false});
  d.entity.replace('');
  dialogCloseEvent = e;

  dialogNumOpen--;
}

function openDialog(name, templateData) {
  var cur = isDialogOpen();
  if(cur && cur.name != name) {
    console.log('in dialog');
  } else if(cur.name == name) {
    cur.entity.replace(cur.template(templateData));
  }

  for(var i = 0; i < dialogs.length; ++i) {
    if(dialogs[i].name == name) {
      dialogs[i].entity.replace(dialogs[i].template(templateData));
      //dialogs[i].entity.addComponent('Mouse');
      dialogs[i].entity.attr({visible: true, z: 10000 + dialogNumOpen});
      //$('#' + name + '-dialog').addClass('visible');
      $('.close-button').on('click', function(e) { closeDialog(e, dialogs[i]);});
      dialogs[i].close = function(e) { var ind = i; closeDialog(e, dialogs[ind]);};

      dialogs[i].configFn(templateData, dialogs[i]);

      dialogNumOpen++;
      break;
    }
  }
}

function loadDialog(name, configFn, openFn, closeFn) {
  $.get('html/' + name + '.html', function(data) {
    var template = doT.template(data);
    var entity = Crafty.e('2D, DOM, HTML, Mouse').attr({x: 0, y: -Crafty.viewport.y, z: 10000, w: canvasWidth, h: canvasHeight});
    entity.attr({visible: false});
    obj = {
      name: name,
      entity: entity,
      template: template,
      configFn: configFn,
      closeFn: closeFn
    };
    dialogs.push(obj);

    if(openFn) {
      openFn();
    }
  });
}