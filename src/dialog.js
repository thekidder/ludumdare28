var dialogs = Array();

var dialogCloseEvent = undefined;

function isDialogOpen() {
  for(var i = 0; i < dialogs.length; ++i) {
    if(dialogs[i].entity.visible)
      return true;
  }
  return false;
}

function closeDialog(e) {
  console.log('closed');
  //$('.modal').removeClass('visible');
  for(var i = 0; i < dialogs.length; ++i) {
    dialogs[i].entity.attr({visible: false});
    //dialogs[i].entity.removeComponent('Mouse');
  }
  dialogCloseEvent = e;
}

function openDialog(name, templateData) {
  if(isDialogOpen()) {
    console.log('in dialog');
    return;
  }

  for(var i = 0; i < dialogs.length; ++i) {
    if(dialogs[i].name == name) {
      dialogs[i].entity.replace(dialogs[i].template(templateData));
      //dialogs[i].entity.addComponent('Mouse');
      dialogs[i].entity.attr({visible: true});
      //$('#' + name + '-dialog').addClass('visible');
      $('.close').on('click', function(e) { closeDialog(e);});
      break;
    }
  }
}

function loadDialog(name) {
  $.get('html/' + name + '.html', function(data) {
    var template = doT.template(data);
    var entity = Crafty.e('2D, DOM, HTML, Mouse').attr({x: 0, y: -Crafty.viewport.y, z: 10000, w: canvasWidth, h: canvasHeight});
    entity.attr({visible: false});
    obj = {
      name: name,
      entity: entity,
      template: template
    };
    dialogs.push(obj);
  });
}